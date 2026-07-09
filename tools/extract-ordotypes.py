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
        cats.setdefault(cat, []).append({"name": clean_name(stem), "content": h})

ordered = [{"cat": c, "items": sorted(cats[c], key=lambda x: x["name"].lower())}
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
