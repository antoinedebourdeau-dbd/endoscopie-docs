#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère js/tpl-etp.js (v2) depuis le brief détaillé
~/Downloads/ETP_HGE_detaille_v2_ClaudeCode.md (contenu médical validé).

Modèle : fiche = {id, name, star, type?, secs:[{e, t, ...}]} — sections typées
par leur emoji ; le renderer applique le style correspondant.
"""
import re, json, html, unicodedata

SRC = "/Users/antoinedebourdeau/Downloads/ETP_HGE_detaille_v2_ClaudeCode.md"
OUT = "/Users/antoinedebourdeau/Projects/dochge/js/tpl-etp.js"

AXE_ICONS = {1: "🟣", 2: "🫀", 3: "🌀", 4: "🔬", 5: "🎗", 6: "🧬", 7: "🥤", 8: "💊", 9: "🍑", 10: "🧘"}
FMAP = {
 "F1.1": "mici_comprendre", "F1.2": "mici_biotherapies", "F1.3": "mici_poussee_reagir",
 "F1.4": "mici_vaccins", "F1.5": "mici_corticoides", "F1.6": "mici_vie", "F1.7": "mici_surveillance",
 "F2.1": "cirrhose_autosurv", "F2.2": "cirrhose_complications", "F2.3": "hepatites_bc",
 "F2.4": "masld_objectifs", "F2.5": "betabloquant_vo", "F2.6": "alcool", "F2.7": "greffe_foie",
 "F3.1": "sii_comprendre", "F3.2": "sii_poussees", "F3.3": "rgo_vivre", "F3.4": "neuromodulateurs", "F3.5": "dyspepsie_quotidien",
 "F4.1": "esd_emr", "F4.2": "poem", "F4.3": "cpre_prothese", "F4.4": "drainage_biliaire", "F4.5": "gpe_soins", "F4.6": "anticoag_geste",
 "F5.1": "polype_surveillance", "F5.2": "barrett", "F5.3": "depistage_ccr", "F5.4": "surveillance_post_ttt",
 "F6.1": "pc_douleur", "F6.2": "ipe_enzymes", "F6.3": "diabete_pancreas",
 "F7.1": "stomie_vivre", "F7.2": "denutrition", "F7.3": "cno",
 "F8.1": "ipp_longcours", "F8.2": "immunosup_peau", "F8.3": "anticoag_hge",
 "F9.1": "hemorroides", "F9.2": "incontinence", "F9.3": "constipation_chronique",
 "F10.0": "resp_diaphragme", "F10.1": "eructations", "F10.2": "rumination",
 "F10.3": "ballonnement", "F10.4": "aerophagie", "F10.5": "dyschesie_reeduc", "F10.6": "incontinence_reeduc",
}

def inline(md):
    """MD inline → HTML sûr (gras, italique, illustrations)."""
    s = html.escape(md, quote=False)
    s = re.sub(r"`\[ILLUSTRATION:\s*([^\]]*)\]`", r"{{ILL:\1}}", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\w)\*([^*\n]+)\*(?!\w)", r"<em>\1</em>", s)
    s = s.replace("`", "")
    return s.strip()

def parse_sections(body):
    """Découpe le corps d'une fiche en sections **<emoji> Titre** [— inline]."""
    secs = []
    cur = None
    for line in body.split("\n"):
        m = re.match(r"^\*\*([^\w\s*][^ ]*)\s+([^*]*?)\*\*\s*(?:—\s*(.*))?$", line.strip())
        if m and not line.strip().startswith("**Palier"):
            if cur: secs.append(cur)
            cur = {"e": m.group(1).strip(), "t": m.group(2).strip(), "lines": []}
            if m.group(3): cur["lines"].append(m.group(3).strip())
        elif cur is not None and line.strip():
            cur["lines"].append(line.rstrip())
    if cur: secs.append(cur)
    return secs

def sec_to_data(sec):
    e, t, lines = sec["e"], sec["t"], sec["lines"]
    d = {"e": e, "t": t}
    bullets = [l for l in lines if re.match(r"^\s*[-•]\s+", l)]
    numbered = [l for l in lines if re.match(r"^\s*\d+\.\s+", l)]

    if e == "🚦":  # carte feu : classer par pastille
        v, o, r = [], [], []
        for l in lines:
            txt = re.sub(r"^\s*[-•]\s*", "", l)
            m = re.match(r"^(🟢|🟠|🔴)\s*(.*)$", txt)
            if not m:  # ligne de contexte (ex. par complication) → orange par défaut
                (o if not r else r).append(inline(txt)); continue
            content = inline(m.group(2))  # inline() gère déjà **gras** proprement
            {"🟢": v, "🟠": o, "🔴": r}[m.group(1)].append(content)
        d["feu"] = {"v": v, "o": o, "r": r}
    elif e == "✅":  # quiz vrai/faux fourni
        items = []
        for l in numbered:
            txt = re.sub(r"^\s*\d+\.\s+", "", l)
            m = re.match(r"^(.*?)→\s*\*\*(Vrai|Faux)[^*]*\*\*\.?\s*(.*)$", txt)
            if m:
                items.append({"q": inline(m.group(1).strip(" .")), "a": m.group(2), "note": inline(m.group(3)) if m.group(3) else ""})
            else:
                items.append({"q": inline(txt), "a": "", "note": ""})
        d["quiz"] = items
    elif e == "❌":  # mythe → réalité
        rows = []
        for l in bullets:
            txt = re.sub(r"^\s*[-•]\s+", "", l)
            parts = re.split(r"\s*→\s*", txt, maxsplit=1)
            rows.append({"m": inline(parts[0]), "r": inline(parts[1]) if len(parts) > 1 else ""})
        d["mythes"] = rows
    elif e == "🪜":  # paliers de livret
        pal = []
        for l in bullets:
            txt = re.sub(r"^\s*[-•]\s+", "", l)
            m = re.match(r"^\*\*Palier\s*\d+\s*—\s*([^*]*)\*\*\s*(.*)$", txt)
            if not m: continue
            p = {"t": m.group(1).strip(" ."), "obj": "", "comment": "", "freq": "", "critere": ""}
            rest = m.group(2)
            fields = re.split(r"\*(Micro-objectif|Comment|Fréquence|Critère)\s*:\*\s*", rest)
            for i in range(1, len(fields) - 1, 2):
                key = {"Micro-objectif": "obj", "Comment": "comment", "Fréquence": "freq", "Critère": "critere"}[fields[i]]
                p[key] = inline(fields[i + 1].strip(" ;."))
            pal.append(p)
        d["paliers"] = pal
    else:  # section générique : puces + paragraphes
        items, paras = [], []
        for l in lines:
            if re.match(r"^\s*[-•]\s+", l): items.append(inline(re.sub(r"^\s*[-•]\s+", "", l)))
            elif re.match(r"^\s*\d+\.\s+", l): items.append(inline(re.sub(r"^\s*\d+\.\s+", "", l)))
            else: paras.append(inline(l))
        if paras: d["paras"] = paras
        if items: d["items"] = items
    return d

md = open(SRC, encoding="utf-8").read()
md = unicodedata.normalize("NFC", md)
axes_raw = re.split(r"^# AXE (\d+) — (.*)$", md, flags=re.M)[1:]

ETP = []
missing = []
for i in range(0, len(axes_raw), 3):
    num = int(axes_raw[i]); title = re.sub(r"\s*★+\s*$", "", axes_raw[i + 1]).strip()
    body = axes_raw[i + 2]
    if "Mentions finales" in body:
        body = body.split("# Mentions finales")[0]
    axe = {"axe": title, "icon": AXE_ICONS[num], "items": []}
    fiches = re.split(r"^## (F\d+\.\d+) — (.*)$", body, flags=re.M)[1:]
    for j in range(0, len(fiches), 3):
        fnum, fname, fbody = fiches[j], fiches[j + 1], fiches[j + 2]
        star = fname.count("★")
        fname = re.sub(r"\s*★+\s*$", "", fname).strip()
        fname = re.sub(r"^LIVRET( SOCLE)?\s*:\s*", "", fname)
        fid = FMAP.get(fnum)
        if not fid: missing.append(fnum); continue
        fiche = {"id": fid, "name": fname, "secs": [sec_to_data(s) for s in parse_sections(fbody)]}
        if star: fiche["star"] = star
        if num == 10: fiche["type"] = "livret"
        if fid == "anticoag_geste": fiche["planTable"] = True
        axe["items"].append(fiche)
    ETP.append(axe)

out = "// GÉNÉRÉ par tools/extract-etp.py depuis le brief détaillé v2 (contenu validé A. Debourdeau).\n"
out += "// Sections typées par emoji : 🎯 objectifs · 🧠 comprendre · 🩺 surveillance · 🚦 feu ·\n"
out += "// 💊 traitement · 🌱 vivre avec · ❌ mythes · ❓ FAQ · ✅ quiz · 🪜 paliers · 🔗 renvois…\n"
out += "export const ETP = " + json.dumps(ETP, ensure_ascii=False, indent=1) + ";\n"
open(OUT, "w", encoding="utf-8").write(out)
n = sum(len(a["items"]) for a in ETP)
print(f"{n} fiches ETP v2 dans {len(ETP)} axes → {OUT} ({len(out)} caractères)")
if missing: print("NON MAPPÉES :", missing)
# contrôle : sections par fiche
for a in ETP:
    for f in a["items"]:
        if len(f["secs"]) < 3: print("⚠ peu de sections :", f["id"], len(f["secs"]))
