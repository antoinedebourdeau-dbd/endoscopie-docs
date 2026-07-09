#!/usr/bin/env python3
"""Génère js/tpl-ordotypes.js depuis les ordonnances Word de référence.

Prérequis : textutil (macOS) a converti les .doc en .txt dans /tmp/ordotypes
(voir l'appel dans l'historique du projet ; relancer :
  find "…/ORDO Lucy" -name "*.doc*" -exec textutil -convert txt {} -output … \;)

Extraction : contenu entre « (AFFECTION EXONERANTE) » et la signature.
Variables : {MEDECIN} (nom du prescripteur), {FAX} (fax du secrétariat) —
remplacées à l'application du modèle dans l'interface.
"""
import os, re, json, html, unicodedata

SRC = "/tmp/ordotypes"
OUT = os.path.join(os.path.dirname(__file__), "..", "js", "tpl-ordotypes.js")

EXCLUDE = {
    "Régime SR", "GLUTEN Conseils", "INFORMATIONS COLONISATION BACTERIENNE GRELE ",
    "Anticorps anti IFX et ADA", "Ferinject-Venofer", "ORDO vierge",
}
CAT_ORDER = ["BILAN BIO", "COLO", "DIVERS", "GREFFE", "HEPATO", "IDE",
             "MICI", "NUTRITION GEP", "ONCO", "PROCTO", "RGO-HP", "TFI"]

# ---------------------------------------------------------------------------
# Nomenclature éditoriale : nom de fichier → intitulé clair + mots-clés de
# recherche (synonymes DCI/marque/pathologie, invisibles à l'affichage).
# Clé = nom de fichier sans extension (espaces de fin ignorés).
RENAMES = {
    # BILAN BIO
    "ORDO BIO anémie suivi  LM": ("Anémie — bilan de suivi", "NFS ferritine réticulocytes fer"),
    "ORDO BIO AVK INR  LM": ("Surveillance AVK — INR", "anticoagulant coumadine previscan warfarine"),
    "ORDO BIO BetaHCG  LM": ("β-hCG — test de grossesse", "beta hcg enceinte"),
    "ORDO BIO DIarrhées chroniques 1ère intention  LM": ("Diarrhée chronique — bilan de 1ère intention", "selles coproculture parasito"),
    "ORDO BIO DIarrhées chroniques 2eme intention  LM": ("Diarrhée chronique — bilan de 2e intention", "elastase laxatifs VIP gastrine"),
    "ORDO BIO Douleurs abdo rares  LM": ("Douleurs abdominales — causes rares (bilan)", "porphyrie plomb saturnisme"),
    "ORDO BIO Hepatite aigue + suivi  LM": ("Hépatite aiguë — bilan initial et suivi", "cytolyse transaminases"),
    "ORDO BIO Hepatopathie chronique  LM": ("Hépatopathie chronique — bilan étiologique", "cytolyse ferritine céruléoplasmine auto-anticorps"),
    "ORDO BIO long LM": ("Bilan biologique complet (long)", "exhaustif"),
    "ORDO BIO suivi LM": ("Bilan biologique de suivi (avant consultation)", "standard"),
    "ORDO BIO Thrombophilie  LM": ("Thrombophilie — bilan", "thrombose porte SAPL facteur V Leiden"),
    "ORDO BIO tumeurs endocrine LM": ("Tumeur neuroendocrine — bilan biologique", "TNE chromogranine 5HIAA sérotonine"),
    "ORDO Cirrhose bio echo  LM": ("Cirrhose — bilan bio + échographie (dépistage CHC)", "alfafoetoprotéine AFP surveillance"),
    "ORDO Lésion surrénale  LM": ("Lésion surrénalienne — bilan hormonal", "incidentalome métanéphrines cortisol"),
    # COLO
    "ORDO BIO colo LM": ("Bilan biologique pré-coloscopie", "NFS TP anesthésie"),
    "ORDO IZINOVA split  LM": ("Préparation colique — IZINOVA (prise fractionnée)", "purge coloscopie split dose"),
    "ORDO IZINOVA veille  LM": ("Préparation colique — IZINOVA (tout la veille)", "purge coloscopie"),
    "ORDO KLEAN PREP + prepacol LM": ("Préparation colique — KLEAN-PREP + PRÉPACOL", "purge PEG bisacodyl"),
    "ORDO KLEAN PREP LM": ("Préparation colique — KLEAN-PREP", "purge PEG 4 litres"),
    "ORDO MOVIPREP CITRAFLEET 1j LM": ("Préparation colique — MOVIPREP ou CITRAFLEET (schéma 1 jour)", "purge picosulfate"),
    "ORDO MOVIPREP CITRAFLEET 2j LM": ("Préparation colique — MOVIPREP ou CITRAFLEET (schéma 2 jours)", "purge picosulfate"),
    "ORDO MOVIPREP seul LM": ("Préparation colique — MOVIPREP seul", "purge PEG"),
    "ORDO PICOPREP LM": ("Préparation colique — PICOPREP", "purge picosulfate sodium"),
    "Régime SR": ("Régime sans résidu — consignes patient", "fibres coloscopie alimentation"),
    # DIVERS
    "ORDO Ferinject LM": ("Fer injectable — FERINJECT (prescription)", "carboxymaltose ferrique carence martiale anémie perfusion"),
    "ORDO Ferinject IDE LM": ("Fer injectable — FERINJECT : soins IDE", "perfusion infirmière"),
    "ORDO Ferinject matériel LM": ("Fer injectable — FERINJECT : matériel de perfusion", "tubulure cathéter"),
    "ORDO Ferinject pharma LM": ("Fer injectable — FERINJECT : délivrance pharmacie", ""),
    "ORDO Antalgiques LM": ("Antalgiques — paliers", "paracétamol tramadol douleur"),
    "ORDO B12 B9 D LM": ("Vitamines B9, B12 et D — supplémentation", "folates cobalamine carence"),
    "ORDO BIO suivi maladie Biermer LM": ("Maladie de Biermer — bilan de suivi", "B12 gastrite auto-immune anémie pernicieuse"),
    "ORDO BIO suivi maladie coeliaque LM": ("Maladie cœliaque — bilan de suivi", "gluten transglutaminase IgA"),
    "ORDO Diabete LM": ("Diabète — bilan biologique", "HbA1c glycémie"),
    "ORDO IST LM": ("Dépistage IST", "VIH syphilis chlamydia gonocoque hépatites sérologie"),
    "ORDO maladie coeliaque bilan LM": ("Maladie cœliaque — bilan initial", "gluten transglutaminase biopsies"),
    "ORDO Pansement laparotomie. LM": ("Pansements de laparotomie — soins IDE", "cicatrice post-opératoire infirmière"),
    "ORDO Peristeen LM": ("Irrigation transanale — PERISTEEN", "constipation incontinence neurologique lavement"),
    "ORDO Questran. LM": ("Cholestyramine — QUESTRAN", "diarrhée acides biliaires malabsorption cholérétique"),
    "ORDO relais AVK-lovenox LM": ("Relais AVK ↔ LOVENOX (HBPM)", "anticoagulant pont héparine énoxaparine"),
    "ORDO saignées LM": ("Saignées thérapeutiques", "hémochromatose phlébotomie ferritine"),
    "ORDO Uvedose LM": ("Vitamine D — UVEDOSE", "cholécalciférol carence 100000"),
    "ORDO Zentel LM": ("Albendazole — ZENTEL", "parasitose vermifuge anguillulose"),
    "ORDO Zoometa bilan dentaire LM": ("Acide zolédronique (ZOMETA) — bilan dentaire préalable", "biphosphonate panoramique ostéonécrose"),
    # GREFFE
    "ORDO Vaccins  post greffe LM": ("Vaccinations après greffe hépatique", "transplantation immunodéprimé rappels"),
    # HEPATO
    "ORDO Avlocardyl. LM": ("Propranolol — AVLOCARDYL (prophylaxie rupture de VO)", "bêta-bloquant varices œsophagiennes hypertension portale"),
    "ORDO BIO intiale VHB LM": ("Hépatite B — bilan initial", "VHB antigène HBs charge virale"),
    "ORDO CSP surveillance LM": ("Cholangite sclérosante primitive — surveillance", "CSP IRM CA19-9 MICI"),
    "ORDO Fibrotest LM": ("FIBROTEST — évaluation de la fibrose", "fibrose score non invasif"),
    "ORDO Maviret LM": ("Hépatite C — MAVIRET", "VHC glécaprévir pibrentasvir antiviral"),
    "ORDO NASH ttt LM": ("Stéatose / NASH — prise en charge", "MASH stéatohépatite métabolique"),
    "ORDO Ocaliva LM": ("Acide obéticholique — OCALIVA (CBP)", "cholangite biliaire primitive ursolvan"),
    "ORDO pré ttt VHC LM": ("Hépatite C — bilan pré-thérapeutique", "VHC génotype charge virale"),
    "ORDO suivi cirrhose bio echo LM": ("Cirrhose — surveillance semestrielle (bio + échographie)", "CHC alfafoetoprotéine dépistage"),
    "ORDO suivi VHC LM": ("Hépatite C — suivi sous / après traitement", "VHC RVS charge virale"),
    "ORDO VHB suivi LM": ("Hépatite B — suivi", "VHB charge virale"),
    "ORDO VHB vaccin LM": ("Hépatite B — vaccination", "VHB Engerix schéma"),
    "ORDO Viread baraclude LM": ("Hépatite B — ténofovir (VIREAD) / entécavir (BARACLUDE)", "VHB antiviral"),
    # IDE
    "LIT MEDICALISE": ("Location de lit médicalisé", "domicile barrières potence"),
    "ORDO IDE complets LM": ("Soins infirmiers à domicile — complets", "nursing toilette IDE"),
    "ORDO IDE HBPM LM": ("Injections HBPM — soins IDE + surveillance plaquettes", "lovenox anticoagulant infirmière"),
    "ORDO IDE partiels LM": ("Soins infirmiers à domicile — partiels", "aide IDE"),
    "ORDO IDE vierge LM": ("Soins IDE — ordonnance à personnaliser", "infirmière"),
    "ORDO Kiné LM": ("Kinésithérapie", "rééducation séances"),
    # MICI
    "BIO + radio pre TNF LM": ("Bilan pré-anti-TNF — biologie + imagerie", "quantiféron radio thorax infliximab tuberculose"),
    "BIO Entivyo LM": ("Surveillance biologique — ENTYVIO (védolizumab)", "MICI biothérapie"),
    "BIO Humira LM": ("Surveillance biologique — HUMIRA (adalimumab)", "anti-TNF biothérapie"),
    "BIO Inflectra LM": ("Surveillance biologique — INFLECTRA (infliximab)", "anti-TNF biosimilaire"),
    "BIO Remicade LM": ("Surveillance biologique — REMICADE (infliximab)", "anti-TNF perfusion"),
    "BIO standard + carences LM": ("Bilan MICI — standard + carences", "CRP calprotectine fer vitamines"),
    "BIO Stelara LM": ("Surveillance biologique — STELARA (ustékinumab)", "MICI biothérapie"),
    "Cs Dermato antiTNF LM": ("Consultation dermatologie — dépistage sous anti-TNF / azathioprine", "peau mélanome"),
    "Cs Gyneco antiTNF LM": ("Consultation gynécologie — dépistage sous anti-TNF / azathioprine", "frottis HPV col"),
    "Cs Rhumato antiTNF LM": ("Consultation rhumatologie — avis sous anti-TNF", "articulaire spondylarthrite"),
    "ORDO Aphtes LM": ("Aphtes buccaux — traitement local", "stomatite bains de bouche"),
    "ORDO B12 B9 D LM ": ("Vitamines B9, B12 et D — supplémentation (MICI)", "folates cobalamine carence"),
    "ORDO Corticoides decroissance LM": ("Corticoïdes — schéma de décroissance", "prednisolone solupred cortancyl sevrage"),
    "ORDO Dermocorticoides LM": ("Dermocorticoïdes", "peau eczéma corticoïde local"),
    "ORDO Hydrocortisone LM": ("Hydrocortisone — insuffisance surrénalienne", "substitution cortisol"),
    "ORDO Imurel + surveillance LM": ("Azathioprine — IMUREL + surveillance biologique", "immunosuppresseur NFS lipase"),
    "ORDO Imurel LM": ("Azathioprine — IMUREL", "immunosuppresseur MICI"),
    "ORDO Lavements sucralfate LM": ("Lavements au sucralfate", "rectite radique ulcère rectal"),
    "ORDO Pentasa LM": ("Mésalazine — PENTASA", "5-ASA RCH rectocolite"),
    "ORDO prévention pneumocystose LM": ("Prévention de la pneumocystose — BACTRIM", "cotrimoxazole immunodéprimé triple immunosuppression"),
    "ORDO Quadrasa solupred LM": ("Lavements QUADRASA + SOLUPRED", "4-ASA rectite corticoïde local"),
    "ORDO Test synachtene LM": ("Test au SYNACTHÈNE", "insuffisance surrénale cortisol sevrage corticoïdes"),
    "ORDO Vaccins grippe pneumocoque LM": ("Vaccinations — grippe + pneumocoque (immunodéprimé)", "prevenar influenza"),
    "ORDO Vaccins MICI  LM": ("Vaccinations MICI — avant immunosuppression", "hépatite B VZV schéma"),
    # NUTRITION GEP
    "ORDO CNO Clinutren dysphagie LM": ("Compléments nutritionnels — CLINUTREN texture modifiée (dysphagie)", "CNO dénutrition épaissi"),
    "ORDO CNO Clinutren LM": ("Compléments nutritionnels — CLINUTREN", "CNO dénutrition boisson"),
    "ORDO CNO HP:HC LM": ("Compléments nutritionnels — hyperprotéinés / hypercaloriques", "CNO dénutrition"),
    "ORDO CNO pates LM": ("Compléments nutritionnels — pâtes enrichies", "CNO dénutrition"),
    "ORDO GEP bourgeon IDE LM": ("GEP — bourgeon : soins IDE (nitrate d'argent)", "gastrostomie granulome stomie"),
    "ORDO GEP bourgeon pharma LM": ("GEP — bourgeon : délivrance pharmacie", "gastrostomie nitrate"),
    "ORDO GEP conseils avant LM": ("GEP — conseils avant la pose", "gastrostomie préparation"),
    "ORDO GEP IDE LM": ("GEP — soins IDE", "gastrostomie pansement sonde"),
    "ORDO GEP pharma LM": ("GEP — matériel : délivrance pharmacie", "gastrostomie compresses"),
    "ORDO Modulen LM": ("Nutrition entérale exclusive — MODULEN (Crohn)", "NEE polymérique"),
    # ONCO
    "ORDO Chimio de base LM": ("Chimiothérapie — prescriptions associées de base", "antiémétique bilan"),
    "ORDO Diffuseur + IDE LM": ("Diffuseur portable (5-FU) — soins IDE", "chimiothérapie perfusion domicile folfox"),
    "ORDO Doxicycline LM": ("Doxycycline — toxicité cutanée (anti-EGFR)", "folliculite rash erbitux cetuximab"),
    "ORDO Granocyte + IDE LM": ("G-CSF — GRANOCYTE + soins IDE", "neutropénie facteur de croissance"),
    "ORDO Nexavar + mesures associées LM": ("Sorafénib — NEXAVAR + mesures associées", "CHC thérapie ciblée"),
    "ORDO Sd main-pieds LM": ("Syndrome main-pied — prévention / traitement", "capécitabine xeloda sorafénib crème"),
    "ORDO IDE Verrou amiklin LM": ("Verrou de PAC — amikacine : soins IDE", "chambre implantable infection cathéter"),
    "ORDO IDE Verrou vanco LM": ("Verrou de PAC — vancomycine : soins IDE", "chambre implantable infection cathéter"),
    "ORDO Verrou amiklin LM": ("Verrou de PAC — amikacine : préparation", "chambre implantable antibiotique"),
    "ORDO Verrou vanco LM": ("Verrou de PAC — vancomycine : préparation", "chambre implantable antibiotique"),
    # PROCTO
    "ORDO Fissure anale LM": ("Fissure anale — traitement de 1ère intention", "rectogesic topique laxatif"),
    "ORDO Fissure anale resistante LM": ("Fissure anale résistante — option 1", "2e ligne"),
    "ORDO Fissure anale resistante 2 LM": ("Fissure anale résistante — option 2", "2e ligne"),
    "ORDO Prurit anal LM": ("Prurit anal — traitement et conseils", "démangeaisons hygiène"),
    "ORDO Thrombose hemorroidaire LM": ("Thrombose hémorroïdaire — traitement", "hémorroïdes AINS topique"),
    # RGO-HP
    "ORDO HP concomittant LM": ("Éradication H. pylori — traitement concomitant", "helicobacter quadrithérapie amoxicilline clarithromycine métronidazole"),
    "ORDO HP Pylera LM": ("Éradication H. pylori — PYLERA", "helicobacter quadrithérapie bismuth"),
    "ORDO IPP LM": ("IPP — pleine dose puis entretien", "inexium mopral ogastoro ésoméprazole oméprazole"),
    "ORDO RGO complexe LM": ("RGO réfractaire / complexe", "reflux alginate gaviscon IPP double dose"),
    "ORDO RGO oesophagite stade A-B LM": ("Œsophagite stade A–B (Los Angeles) — IPP", "reflux érosive"),
    "ORDO RGO oesophagite stade C-D LM": ("Œsophagite stade C–D (Los Angeles) — IPP", "reflux sévère contrôle endoscopique"),
    "ORDO RGO simple LM": ("RGO simple — IPP", "reflux pyrosis"),
    "Régime RGO": ("RGO — règles hygiéno-diététiques", "reflux conseils alimentation"),
    # TFI
    "ORDO TFI - Constipation LM": ("Constipation (TFI) — traitement", "laxatif macrogol forlax transit"),
    "ORDO TFI - Douleurs ballonements LM": ("TFI — douleurs / ballonnements", "intestin irritable antispasmodique météospasmyl duspatalin"),
}

def clean_name(stem):
    n = re.sub(r"^ORDO\s+", "", stem)
    n = re.sub(r"\s*LM\s*\.?\s*$", "", n)
    n = re.sub(r"\s+", " ", n).strip(" .")
    return n[0].upper() + n[1:] if n else stem

def parse(txt):
    txt = txt.replace("\r", "").replace("\u00a0", " ").replace("\u2028", "\n")
    txt = re.sub(r"\s*FILENAME\s+\S+", "", txt)
    txt = re.sub(r"TIME \\@ \"[^\"]*\"[^\n]*", "", txt)
    m = re.search(r"\(AFFECTION EXONERANTE\)\s*\n", txt)
    if m:
        rest = txt[m.end():]
        end = re.search(r"Dr\s+Lucy\s+MEUNIER|Prescriptions\s+SANS\s+RAPPORT", rest)
        body = rest[:end.start()] if end else rest
        # zone « maladies intercurrentes » non vide ? (rare — signalé)
        z2 = re.search(r"\(MALADIES INTERCURRENTES\)\s*\n(.*?)(?:HEPATO-GASTRO|$)", txt, re.S)
        extra = (z2.group(1).strip() if z2 else "")
        if extra and len(extra) > 5:
            body += "\n\n[Zone hors ALD :]\n" + extra
    else:
        # pas un modèle bizone : tout le texte, moins l'en-tête/pied connus
        body = re.split(r"HEPATO-GASTRO-ENTEROLOGIE", txt)[0]
    # nettoyage
    body = body.replace("\t", " ")
    body = re.sub(r"Merci de faxer les r[ée]sultats au[^\n]*", "Merci de faxer les résultats au {FAX}", body)
    body = re.sub(r"Dr\s+(Lucy\s+)?MEUNIER", "{MEDECIN}", body)
    body = re.sub(r"[  ]+\n", "\n", body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    lines = [l.strip() for l in body.split("\n")]
    body = "\n".join(lines).strip()
    body = re.sub(r"\n{3,}", "\n\n", body)
    # lignes réduites à des points/underscores
    body = "\n".join(l for l in body.split("\n") if not re.fullmatch(r"[.…_ ]{1,6}", l))
    return body.strip()

cats = {}
skipped, empties = [], []
for root, _, files in os.walk(SRC):
    for f in sorted(files):
        if not f.endswith(".txt"):
            continue
        stem = f[:-4]
        if stem.strip() in EXCLUDE or stem in EXCLUDE:
            skipped.append(stem); continue
        rel = os.path.relpath(os.path.join(root, f), SRC)
        parts = rel.split(os.sep)
        cat = parts[0] if len(parts) > 1 else None
        if cat is None:
            skipped.append(stem); continue
        body = parse(open(os.path.join(root, f), encoding="utf-8", errors="replace").read())
        if len(body) < 15:
            empties.append(rel); continue
        h = html.escape(body).replace("\n", "<br>")
        key = unicodedata.normalize("NFC", stem)
        ren = RENAMES.get(key) or RENAMES.get(key.rstrip()) or RENAMES.get(re.sub(r"\s+", " ", key).strip())
        name = ren[0] if ren else clean_name(stem)
        kw = ren[1] if ren else ""
        entry = {"name": name, "content": h}
        if kw:
            entry["kw"] = kw
        cats.setdefault(cat, []).append(entry)

# Ordonnances DGBI / motilité (spec MD d'Antoine) — fusionnées avec TFI
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dgbi_items import DGBI_ITEMS
cats.setdefault("TFI", []).extend(DGBI_ITEMS)

CAT_LABELS = {"TFI": "FONCTIONNELS & MOTILITÉ"}

ordered = [{"cat": CAT_LABELS.get(c, c), "items": sorted(cats[c], key=lambda x: x["name"].lower())}
           for c in CAT_ORDER if c in cats]

with open(OUT, "w", encoding="utf-8") as fh:
    fh.write("// GÉNÉRÉ par tools/extract-ordotypes.py — ne pas éditer à la main.\n")
    fh.write("// Bibliothèque d'ordonnances types (source : ORDO Lucy, Dr L. Meunier).\n")
    fh.write("// Variables remplacées à l'application : {MEDECIN}, {FAX}.\n")
    fh.write("export const ORDO_TYPES = ")
    fh.write(json.dumps(ordered, ensure_ascii=False, indent=1))
    fh.write(";\n")

total = sum(len(c["items"]) for c in ordered)
print(f"{total} ordonnances types dans {len(ordered)} catégories → {os.path.normpath(OUT)}")
print("exclus :", ", ".join(skipped))
if empties:
    print("VIDES (à vérifier) :", ", ".join(empties))
