#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère js/tpl-regimes.js (v3) depuis les 4 briefs détaillés
~/Downloads/regimes-v3/Regimes_HGE_v3_*.md (contenu médical validé).

Modèle : fiche = {id, name, niveau, niveauNote?, ecart?, secs:[{k, ...}]}
— sections ORDONNÉES comme dans le document ; le renderer applique le
composant correspondant à chaque type k (même charte que les fiches v2).
"""
import re, json, glob, html, unicodedata

SRC = sorted(glob.glob("/Users/antoinedebourdeau/Downloads/regimes-v3/Regimes_HGE_v3_*.md"))
OUT = "/Users/antoinedebourdeau/Projects/dochge/js/tpl-regimes.js"

# ids historiques (stables : packs, recherche) — par code de fiche v3
IDMAP = {
 "A1": "rgo", "A2": "dysphagie", "A3": "eoe",
 "B1": "dyspepsie", "B2": "gastroparesie", "B3": "dumping",
 "C1": "gluten", "C2": "lactose", "C3": "fructose",
 "D1": "fodmap", "D2": "fibres", "D3": "sans_residu", "D4": "diverticules",
 "E1": "mici_poussee", "E2": "nee", "E3": "cded", "E4": "mici_entretien",
 "F1": "pancreatite_aigue", "F2": "pancreatite_chronique",
 "G1": "cirrhose", "G2": "hyposode", "G3": "encephalopathie", "G4": "mash",
 "G5": "vesicule", "G6": "wilson", "G7": "hemochromatose",
 "H1": "postop", "H2": "stomie", "I1": "prep_colo",
}

# catégories d'affichage (ordre et intitulés conservés de la v2)
CATS = [
 ("Reflux & œsophage", "🫁", ["rgo", "dysphagie", "eoe"]),
 ("Estomac", "🍽", ["dyspepsie", "gastroparesie", "dumping"]),
 ("Intolérances & malabsorptions", "🥛", ["gluten", "lactose", "fructose"]),
 ("Intestin & troubles fonctionnels", "🌀", ["fodmap", "fibres", "sans_residu", "diverticules"]),
 ("MICI (Crohn, RCH)", "🎗", ["mici_poussee", "nee", "cded", "mici_entretien"]),
 ("Pancréas", "🧬", ["pancreatite_aigue", "pancreatite_chronique"]),
 ("Foie & voies biliaires", "🫀", ["cirrhose", "hyposode", "encephalopathie", "mash", "vesicule", "wilson", "hemochromatose"]),
 ("Chirurgie digestive & stomies", "🩹", ["postop", "stomie"]),
 ("Régimes préparatoires (examens)", "🔬", ["prep_colo"]),
]

NIVEAUX = {"🔴": 1, "🟠": 2, "🟡": 3, "🟢": 4}
NIV_STD = {1: "STRICT & DÉFINITIF", 2: "STRICT & TEMPORAIRE", 3: "SUR-MESURE", 4: "HYGIÈNE DE VIE"}

def inline(md):
    s = html.escape(md, quote=False)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?!\w)", r"<em>\1</em>", s)
    s = s.replace("**", "")  # gras non apparié dans la source : on nettoie
    return s.replace("`", "").strip()

def strip_md(s):
    return re.sub(r"\*+", "", s).strip()

# ---------------------------------------------------------------- sections
def classify(title):
    t = title.strip().rstrip(".?").strip()
    low = strip_md(t).lower()
    def note_of():
        m = re.search(r"[(（«]([^)）»]*)[)）»]", t)
        return m.group(1).strip() if m else (None)
    if low.startswith("pourquoi"): return "pourquoi", None
    if "principe" in low: return "principes", None
    if low.startswith("je démarre"): return "demarrer", None
    if "portions" in low: return "portions", None
    if "menu" in low or "plan des 3 derniers jours" in low:
        return "menu", (note_of() or ("Plan des 3 derniers jours" if "plan" in low else None))
    if "options" in low or t.startswith("🔁"): return "options", None
    if t.startswith("👨‍🍳") or "recettes" in low or "formules" in low: return "recettes", note_of()
    if t.startswith("🍱") or "batch" in low: return "batch", None
    if "collations" in low or t.startswith("🍎"): return "collations", None
    if "substitutions" in low: return "substitutions", note_of()
    if low.startswith("tableau"): return "tab", note_of()
    if "courses" in low: return "courses", None
    if "déplacement" in low: return "deplacement", None
    if "pièges" in low: return "pieges", None
    if "vigilance" in low: return "vigilance", None
    if "fausse bonne idée" in low: return "erreur", None
    if "retenir" in low or t == "⚠️": return "retenir", None
    return "libre", strip_md(t)  # section spécifique (ex. « Liquides clairs autorisés »)

CIRCLES = "①②③④⑤⑥⑦⑧⑨"

def parse_table(lines):
    rows = []
    for l in lines:
        if re.match(r"^\|[\s:-]+\|", l.replace("-", "-")) and set(l) <= set("|-: "):
            continue
        cells = [c.strip() for c in l.strip().strip("|").split("|")]
        rows.append(cells)
    return rows

def body_to_sec(kind, note, first, lines):
    """Construit la section typée depuis son contenu brut."""
    tbl = [l for l in lines if l.strip().startswith("|")]
    bullets = [l for l in lines if re.match(r"^\s*[-•]\s+", l)]
    numbered = [l for l in lines if re.match(r"^\s*\d+\.\s+", l)]
    paras = [l for l in lines if l.strip() and not l.strip().startswith("|")
             and not re.match(r"^\s*[-•]\s+", l) and not re.match(r"^\s*\d+\.\s+", l)]
    if first: paras.insert(0, first)
    sec = {"k": kind}
    if note: sec["note"] = note

    if kind == "menu" and tbl:
        rows = parse_table(tbl)
        sec["head"] = [strip_md(c) for c in rows[0]]
        sec["rows"] = [[inline(c) for c in r] for r in rows[1:]]
        if paras: sec["text"] = inline(" ".join(paras))
        return sec
    if kind in ("substitutions", "tab") and tbl:
        rows = parse_table(tbl)
        if kind == "tab":
            sec["okT"] = strip_md(re.sub(r"^[✅⛔]\s*", "", rows[0][0]))
            sec["koT"] = strip_md(re.sub(r"^[✅⛔]\s*", "", rows[0][1]))
            sec["ok"] = [inline(r[0]) for r in rows[1:] if r[0]]
            sec["ko"] = [inline(r[1]) for r in rows[1:] if len(r) > 1 and r[1]]
        else:
            sec["head"] = [strip_md(c) for c in rows[0]]
            sec["rows"] = [[inline(c) for c in r] for r in rows[1:]]
        return sec

    if kind == "principes":
        txt = " ".join(paras)
        if any(c in txt for c in CIRCLES):
            parts = re.split(r"[①②③④⑤⑥⑦⑧⑨]\s*", txt)
            intro = parts[0].strip()
            sec["items"] = [inline(p.strip(" .")) + "." if not p.strip().endswith((".", "!", "?")) else inline(p.strip()) for p in parts[1:] if p.strip()]
            if intro: sec["text"] = inline(intro)
        elif bullets:
            sec["items"] = [inline(re.sub(r"^\s*[-•]\s+", "", b)) for b in bullets]
            if paras: sec["text"] = inline(" ".join(paras))
        else:
            sec["text"] = inline(txt)
        return sec

    if kind == "demarrer":
        if numbered:
            sec["items"] = [inline(re.sub(r"^\s*\d+\.\s+", "", n)) for n in numbered]
            if paras: sec["text"] = inline(" ".join(paras))
        else:
            txt = " ".join(paras)
            parts = re.split(r"\s*\d+\.\s+", txt)
            if len(parts) > 2:
                sec["items"] = [inline(p.strip()) for p in parts[1:] if p.strip()]
                if parts[0].strip(): sec["text"] = inline(parts[0])
            else:
                sec["text"] = inline(txt)
        return sec

    # sections génériques : texte + puces + numéros
    if paras: sec["text"] = inline(" ".join(paras))
    items = ([inline(re.sub(r"^\s*[-•]\s+", "", b)) for b in bullets]
             + [inline(re.sub(r"^\s*\d+\.\s+", "", n)) for n in numbered])
    if items: sec["items"] = items
    if tbl:  # table inattendue dans une section générique : rendue en lignes
        sec["rows"] = [[inline(c) for c in r] for r in parse_table(tbl)]
        sec.setdefault("head", None)
    return sec

# ------------------------------------------------------------------ fiches
def parse_fiche(code, name_md, tail, body):
    fid = IDMAP[code]
    name = strip_md(name_md)
    niv = next((NIVEAUX[e] for e in ["🔴", "🟠", "🟡", "🟢"] if e in tail), 3)
    tail_clean = strip_md(tail)
    note = None
    if tail_clean not in (f"{k} {v}" for k, v in [("🔴", NIV_STD[1]), ("🟠", NIV_STD[2]), ("🟡", NIV_STD[3]), ("🟢", NIV_STD[4])]):
        note = tail_clean
    fiche = {"id": fid, "name": name, "niveau": niv}
    if note: fiche["niveauNote"] = note

    lines = body.split("\n")
    # conséquence d'un écart (ligne italique sous le titre)
    for l in lines[:4]:
        m = re.match(r"^\*(?:Conséquence d'un écart\s*:\s*)(.*)\*\s*$", l.strip())
        if m:
            fiche["ecart"] = inline(m.group(1))
            lines.remove(l)
            break

    secs, cur = [], None
    for l in lines:
        if re.match(r"^(#{1,2})\s", l): break  # méta de fin de fichier
        if re.match(r"^-{3,}\s*$", l.strip()): continue  # séparateurs
        m = re.match(r"^\*\*(.+?)\*\*\s*(.*)$", l.strip())
        # titre de section = gras en début de ligne, PAS une ligne de tableau
        if m and not l.strip().startswith("|"):
            if cur: secs.append(cur)
            kind, note_ = classify(m.group(1))
            cur = {"kind": kind, "note": note_, "first": m.group(2).strip(), "lines": []}
        elif cur is not None:
            cur["lines"].append(l)
    if cur: secs.append(cur)

    fiche["secs"] = [body_to_sec(s["kind"], s["note"], s["first"], s["lines"]) for s in secs]
    return fiche

fiches = {}
for path in SRC:
    md = unicodedata.normalize("NFC", open(path, encoding="utf-8").read())
    parts = re.split(r"^# ([A-I]\d) — (.*?) — (.*)$", md, flags=re.M)[1:]
    for i in range(0, len(parts), 4):
        code, name, tail, body = parts[i], parts[i + 1], parts[i + 2], parts[i + 3]
        fiches[IDMAP[code]] = parse_fiche(code, name, tail, body)

missing = [i for _, _, ids in CATS for i in ids if i not in fiches]
if missing:
    raise SystemExit("FICHES MANQUANTES : " + ", ".join(missing))

REGIMES = [{"cat": cat, "icon": icon, "items": [fiches[i] for i in ids]} for cat, icon, ids in CATS]

NIVEAUX_OUT = {
 "1": {"badge": "🔴", "label": "STRICT & DÉFINITIF", "color": "#C0392B", "bg": "#FCECEA", "border": "#C0392B",
       "sens": "Régime absolu, à vie. Aucune « petite quantité tolérée ».",
       "ecart": "Chaque écart, même minime, entretient la maladie et expose à des complications. Il n'y a pas de seuil « acceptable »."},
 "2": {"badge": "🟠", "label": "STRICT & TEMPORAIRE", "color": "#b35a00", "bg": "#FFF4E6", "border": "#EF7D00",
       "sens": "À respecter à la lettre, mais sur une durée limitée définie par le médecin.",
       "ecart": "Un écart pendant la période peut faire échouer l'examen ou prolonger la crise. Après la date fixée, vous reprenez une alimentation normale."},
 "3": {"badge": "🟡", "label": "SUR-MESURE", "color": "#8a6d00", "bg": "#FFF9E0", "border": "#E1A500",
       "sens": "Pas de règle universelle : on part large puis on ajuste à votre tolérance. Le but est de trouver votre seuil, pas de tout supprimer.",
       "ecart": "Un écart occasionnel n'est pas dangereux : il vous renseigne sur votre limite. À l'inverse, trop se restreindre est inutile et risqué (carences)."},
 "4": {"badge": "🟢", "label": "HYGIÈNE DE VIE", "color": "#146c3a", "bg": "#E6F4EC", "border": "#146c3a",
       "sens": "Des habitudes protectrices à installer durablement, sans interdit strict.",
       "ecart": "Aucun aliment n'est « interdit » : c'est la tendance générale qui compte, pas l'écart ponctuel."},
}

out = "// GÉNÉRÉ par tools/extract-regimes.py depuis les briefs v3 (~/Downloads/regimes-v3/)\n"
out += "// — contenu médical validé A. Debourdeau. Ne pas éditer à la main.\n"
out += "export const REGIME_NIVEAUX = " + json.dumps(NIVEAUX_OUT, ensure_ascii=False, indent=1) + ";\n\n"
out += "export const REGIMES = " + json.dumps(REGIMES, ensure_ascii=False, indent=1) + ";\n"
open(OUT, "w", encoding="utf-8").write(out)

n = sum(len(c["items"]) for c in REGIMES)
print(f"{n} fiches régimes v3 dans {len(REGIMES)} catégories → {OUT} ({len(out)} caractères)")
for c in REGIMES:
    for f in c["items"]:
        kinds = [s["k"] for s in f["secs"]]
        if "pourquoi" not in kinds or "tab" not in kinds or "vigilance" not in kinds:
            print("⚠ sections clés manquantes :", f["id"], kinds)
        if len(kinds) < 10:
            print("⚠ fiche courte :", f["id"], len(kinds), "sections")
