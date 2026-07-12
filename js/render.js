// Moteur de rendu des documents — réplique la charte graphique des documents
// originaux (Barlow / bleu CHU #0072BC / orange #EF7D00), paramétrée par
// médecin + patient, avec mode générique (reprographie).
//
// ctx = {
//   medecin: null | { nom, specialite, tel, fax, rpps, mail },   // null → générique
//   patient: null | { nom, prenom, ddn, examen },                // null → lignes à remplir
// }

import { DOCS, SERVICES } from "./endoc-docs.js";
import { ORDOS } from "./tpl-ordos.js";
import { IZINOVA } from "./tpl-izinova.js";
import { REGIMES, REGIME_NIVEAUX } from "./tpl-regimes.js";
import { ETP } from "./tpl-etp.js";
ORDOS.izinova = IZINOVA;
import { code128svg } from "./barcode.js";

export const FINESS = "340782036";
const F = `font-family:'Barlow',sans-serif;`;
const FC = `font-family:'Barlow Condensed',sans-serif;`;

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const frDate = (iso) => {
  if (!iso) return "";
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(iso);
};

const patientNom = (p) => [p?.nom?.toUpperCase(), p?.prenom].filter(Boolean).join(" ");

const dotted = (w) =>
  `<span style="display:inline-block; min-width:${w}px; border-bottom:1px dotted #90a4b4;">&nbsp;</span>`;

// ---------------------------------------------------------------------------
// En-tête / pied répétés (notes)
// ---------------------------------------------------------------------------

function noteHeader(doc, ctx) {
  const svc = SERVICES[doc.service || "endoscopie"] || SERVICES.endoscopie;
  const med = ctx.medecin;
  const p = ctx.patient;

  const rightLines = med
    ? [
        `<div style="font-weight:700; color:#0d2b45; font-size:11px;">${esc(med.nom)}</div>`,
        `<div>${esc(med.specialite || "Hépato-Gastroentérologie")}</div>`,
        med.tel ? `<div>Secrétariat : ${esc(med.tel)}</div>` : "",
        `<div>${esc(svc.nom)} : ${esc(svc.tel)}</div>`,
        `<div>${esc(med.mail || svc.mail)}</div>`,
      ]
    : [
        `<div style="font-weight:700; color:#0d2b45; font-size:11px;">Service d'Hépato-Gastroentérologie</div>`,
        `<div>${esc(svc.nom)}</div>`,
        `<div>Tél. ${esc(svc.tel)}</div>`,
        `<div>${esc(svc.mail)}</div>`,
      ];

  const patientStrip = p
    ? `<div style="display:flex; justify-content:flex-end; margin-top:4px; font-size:10px; color:#4a5b68;">
        Patient&nbsp;: <strong style="color:#0d2b45;">&nbsp;${esc(patientNom(p))}</strong>${p.ddn ? `&nbsp;· né(e) le ${esc(frDate(p.ddn))}` : ""}</div>`
    : "";

  const urgence = svc.urgence
    ? `<div style="display:flex; align-items:center; gap:8px; background:#FCECEA; border:1px solid #e7b3ab; border-radius:6px; padding:4px 10px; margin-top:6px;">
      <span style="${FC} text-transform:uppercase; letter-spacing:.04em; font-weight:700; color:#C0392B; font-size:11px;">Urgence 24 h/24</span>
      <span style="color:#8f2419; font-size:11px; font-weight:600;">${esc(svc.urgence)}</span>
      <span style="color:#8f2419; font-size:11px;">— en cas d'impossibilité, appelez le <strong>15</strong>.</span>
    </div>`
    : "";

  return `<div style="${F}">
    <div style="display:flex; align-items:center; gap:14px; padding-bottom:8px; border-bottom:2px solid #0072BC;">
      <img src="chu-logo.webp" alt="CHU de Montpellier" style="height:44px; width:auto; flex:none;">
      <div style="flex:1; min-width:0; line-height:1.2;">
        <div style="font-weight:700; color:#0d2b45; font-size:13px;">CHU de Montpellier</div>
        <div style="${FC} text-transform:uppercase; letter-spacing:.05em; color:#0072BC; font-weight:600; font-size:12px;">${esc(svc.nom)}</div>
      </div>
      <div style="flex:none; text-align:right; line-height:1.35; color:#4a5b68; font-size:10px;">${rightLines.join("")}</div>
    </div>${patientStrip}${urgence}
  </div>`;
}

function noteFooter(doc) {
  const svc = SERVICES[doc.service || "endoscopie"] || SERVICES.endoscopie;
  return `<div style="${F} display:flex; align-items:center; gap:16px; border-top:1.5px solid #0072BC; padding-top:7px;">
    <div style="flex:1; min-width:0;">
      <div style="${FC} text-transform:uppercase; letter-spacing:.05em; font-weight:700; color:#0d2b45; font-size:10.5px;">À scanner en intégralité dans le dossier du patient</div>
      <div style="color:#7a8794; font-size:9px; margin-top:1px;">CHU de Montpellier · ${esc(svc.nom)} · Ce document doit être paraphé à chaque page.</div>
    </div>
    <div style="flex:none; display:flex; align-items:center; gap:9px; border:1.5px solid #0072BC; border-radius:8px; padding:5px 12px; background:#EAF3FB;">
      <span style="${FC} text-transform:uppercase; letter-spacing:.05em; color:#0072BC; font-weight:700; font-size:11px;">Paraphe</span>
      <span style="display:inline-block; width:72px; border-bottom:1px dotted #6f8ba3; height:16px;"></span>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Corps des notes (réplique de la logique Component des .dc.html)
// ---------------------------------------------------------------------------

function toneStyle(tone) {
  if (tone === "danger")
    return { boxStyle: "background:#FCECEA; border:1.5px solid #C0392B; border-radius:10px; padding:8px 14px 12px; margin-top:8px;", accent: "#C0392B", headingColor: "#a5271a" };
  if (tone === "info")
    return { boxStyle: "background:#EAF3FB; border-left:4px solid #0072BC; border-radius:0 10px 10px 0; padding:8px 14px 12px; margin-top:8px;", accent: "#0072BC", headingColor: "#0d2b45" };
  if (tone === "warn")
    return { boxStyle: "background:#FFF4E6; border:1px solid #f3c98a; border-radius:10px; padding:8px 14px 12px; margin-top:8px;", accent: "#EF7D00", headingColor: "#0d2b45" };
  return { boxStyle: "margin-top:2px;", accent: "#0072BC", headingColor: "#0d2b45" };
}

function renderBlocks(body, accent) {
  let n = 0;
  return body
    .map((raw) => {
      let kind = "p", text = raw;
      if (raw.startsWith("n:")) { kind = "step"; text = raw.slice(2); n += 1; }
      else if (raw.startsWith("--:")) { kind = "li"; text = `<span style='color:#4a5b68'>${raw.slice(3)}</span>`; }
      else if (raw.startsWith("-:")) { kind = "li"; text = raw.slice(2); }
      else if (raw.startsWith("p:")) { text = raw.slice(2); }

      if (kind === "li")
        return `<div style="display:flex; gap:9px; margin-top:5px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.5;"><span style="flex:none; width:6px; height:6px; border-radius:50%; background:${accent}; margin-top:6px;"></span><div style="flex:1;">${text}</div></div>`;
      if (kind === "step")
        return `<div style="display:flex; gap:10px; margin-top:6px; align-items:flex-start; ${F} font-size:12.5px; color:#1c3a52; line-height:1.5;"><span style="flex:none; width:20px; height:20px; border-radius:50%; background:#EAF3FB; color:#0072BC; font-weight:800; font-size:11px; display:flex; align-items:center; justify-content:center;">${n}</span><div style="flex:1; padding-top:1px;">${text}</div></div>`;
      return `<div style="${F} font-size:12.5px; color:#1c3a52; line-height:1.5; margin-top:6px;">${text}</div>`;
    })
    .join("");
}

function identityBox(ctx) {
  const p = ctx.patient;
  const cell = (label, value, flex = 1) =>
    `<div style="flex:${flex}; padding:7px 14px; min-width:0;">
      <div style="${FC} text-transform:uppercase; letter-spacing:.04em; color:#4a5b68; font-size:10px; font-weight:600;">${label}</div>
      <div style="font-size:12px; color:#0d2b45; font-weight:700; margin-top:2px; min-height:15px;">${value || dotted(120)}</div>
    </div>`;
  return `<div style="${F} display:flex; align-items:stretch; border:1px solid #cfe1f0; border-radius:10px; margin-top:12px; background:#fff;">
    ${cell("Patient", p ? esc(patientNom(p)) : "", 1.6)}
    <div style="flex:none; width:1px; background:#e0eaf3;"></div>
    ${cell("Né(e) le", p?.ddn ? esc(frDate(p.ddn)) : "")}
    <div style="flex:none; width:1px; background:#e0eaf3;"></div>
    ${cell("Date de l'examen", p?.examen ? esc(frDate(p.examen)) : "")}
  </div>`;
}

function consentBlock(doc, ctx) {
  if (doc.noConsent) return "";
  const c = doc.consent || {};
  const med = ctx.medecin;
  const p = ctx.patient;
  let inner = "";

  if (Array.isArray(c.lines)) {
    inner += `<div>${c.intro || "Je reconnais avoir reçu une information claire et complète concernant :"}</div>`;
    inner += c.lines
      .map((l) => `<div style="display:flex; gap:9px; margin-top:5px;"><span style="flex:none; width:6px; height:6px; border-radius:50%; background:#0072BC; margin-top:6px;"></span><div style="flex:1;">${l}</div></div>`)
      .join("");
  }

  if (c.soussigne) {
    const nameSpan = p
      ? `<span style="display:inline-block; min-width:240px; border-bottom:1px dotted #90a4b4;"><strong>${esc(patientNom(p))}</strong></span>`
      : `<span style="display:inline-block; min-width:240px; border-bottom:1px dotted #90a4b4;">&nbsp;</span>`;
    const recuDe = med ? esc(med.nom) : "médecin";
    inner += `<div>Je soussigné(e) ${nameSpan}</div>`;
    inner += `<div style="margin-top:8px;">atteste avoir reçu du <strong>${recuDe}</strong> toutes les informations relatives à ${c.objet}. J'ai pu poser toutes les questions nécessaires et reconnais avoir compris les informations délivrées.</div>`;
    if (c.retrait)
      inner += `<div style="margin-top:6px;">J'ai pu poser toutes les questions souhaitées et j'ai compris que je peux <strong>retirer mon consentement à tout moment</strong>, y compris le jour de l'intervention.</div>`;
  }

  if (c.accept) inner += `<div style="margin-top:10px; font-weight:600; color:#0d2b45;">${c.accept}</div>`;

  if (c.choix)
    inner += `<div style="display:flex; gap:22px; margin-top:12px; font-weight:600;"><span>&#9744;&nbsp;&nbsp;OUI, j'accepte</span><span>&#9744;&nbsp;&nbsp;NON, je refuse</span></div>`;
  if (c.choix2)
    inner += `<div style="display:flex; flex-direction:column; gap:5px; margin-top:12px; font-weight:600;"><span>&#9744;&nbsp;&nbsp;J'accepte la réalisation de cette procédure selon les modalités expliquées.</span><span>&#9744;&nbsp;&nbsp;Je ne souhaite pas bénéficier de ce traitement.</span></div>`;

  const signMention = c.mention ? " (précédée de « Lu et approuvé »)" : "";
  inner += `<div style="display:flex; gap:24px; margin-top:20px; align-items:flex-end;">
      <div style="flex:none;"><span style="${FC} text-transform:uppercase; letter-spacing:.04em; color:#4a5b68; font-size:11px; font-weight:600;">Date</span><div style="border-bottom:1px solid #90a4b4; width:150px; height:22px;">${ctx.patientSign && ctx.dateDoc ? `<div style="font-weight:700; font-size:12.5px; padding-top:4px;">${esc(frDate(ctx.dateDoc))}</div>` : ""}</div></div>
      <div style="flex:1;"><span style="${FC} text-transform:uppercase; letter-spacing:.04em; color:#4a5b68; font-size:11px; font-weight:600;">Signature du patient${signMention}</span><div style="border-bottom:1px solid #90a4b4; height:44px; display:flex; align-items:flex-end;">${ctx.patientSign ? signImgTag(ctx.patientSign, 42) : ""}</div></div>
      <div style="flex:1;"><span style="${FC} text-transform:uppercase; letter-spacing:.04em; color:#4a5b68; font-size:11px; font-weight:600;">Signature &amp; cachet du médecin</span><div style="border-bottom:1px solid #90a4b4; height:44px; display:flex; align-items:flex-end;">${med?.sign ? signImgTag(med.sign, 40) : ""}</div></div>
    </div>`;

  return `<div style="margin-top:20px; break-inside:avoid; border:1.5px solid #0072BC; border-radius:12px; overflow:hidden;">
    <div style="background:#0d2b45; color:#fff; padding:9px 16px; ${F} font-weight:700; font-size:15px;">Consentement éclairé</div>
    <div style="padding:14px 16px; ${F} color:#1c3a52; font-size:12.5px; line-height:1.55;">${inner}</div>
  </div>`;
}

function noteBody(doc, ctx) {
  let html = `<div style="${F}">
    <div style="${FC} text-transform:uppercase; letter-spacing:.08em; color:#0072BC; font-weight:700; font-size:13px;">${esc(doc.geste || "Note d'information")}</div>
    <h1 style="font-weight:800; color:#0d2b45; font-size:26px; line-height:1.1; margin:4px 0 0; text-wrap:balance;">${doc.title}</h1>
    ${doc.subtitle ? `<div style="font-weight:600; color:#005a94; font-size:15px; margin-top:3px;">${doc.subtitle}</div>` : ""}
    <div style="height:3px; width:64px; background:#EF7D00; border-radius:2px; margin-top:10px;"></div>
    ${doc.lead ? `<div style="background:#EAF3FB; border-radius:10px; padding:12px 16px; margin-top:12px; color:#1c3a52; font-size:13px; line-height:1.55;">${doc.lead}</div>` : ""}
  </div>`;

  html += identityBox(ctx);

  if (doc.illus) {
    const imgs = doc.illus.imgs
      .map(
        (src) =>
          `<div style="flex:1; min-width:0; border:1px solid #cfe1f0; border-radius:10px; overflow:hidden; background:#fff; display:flex; align-items:center; justify-content:center; padding:6px;"><img src="${src}" alt="Illustration médicale" style="width:100%; height:auto; max-height:210px; object-fit:contain; display:block;"></div>`
      )
      .join("");
    html += `<figure style="margin:14px 0 0; break-inside:avoid;"><div style="display:flex; gap:10px; align-items:stretch; justify-content:center;">${imgs}</div><figcaption style="${F} font-size:11px; color:#6b7c8a; text-align:center; margin-top:7px; line-height:1.4;">${doc.illus.cap} <span style="color:#9aa8b4;">— Illustrations : Dr A. Debourdeau</span></figcaption></figure>`;
  }

  for (const s of doc.sections) {
    const t = toneStyle(s.tone || "");
    html += `<div style="margin-top:16px; break-inside:avoid;">
      <div style="display:flex; align-items:center; gap:9px;"><span style="flex:none; width:5px; height:17px; border-radius:2px; background:${t.accent};"></span><h2 style="${F} font-weight:700; font-size:15.5px; color:${t.headingColor}; margin:0; line-height:1.15;">${s.h}</h2></div>
      <div style="${t.boxStyle}">${renderBlocks(s.body, t.accent)}</div>
    </div>`;
  }

  html += consentBlock(doc, ctx);
  return html;
}

// ---------------------------------------------------------------------------
// Assemblage en <section class="doc"> (table thead/tfoot pour l'impression)
// ---------------------------------------------------------------------------

function docSection(headerHtml, bodyHtml, footerHtml) {
  return `<section class="doc">
    <table class="frame">
      <thead><tr><td><div class="hdr">${headerHtml}</div></td></tr></thead>
      <tbody><tr><td class="bodycell">${bodyHtml}</td></tr></tbody>
      <tfoot><tr><td><div class="ftr">${footerHtml}</div></td></tr></tfoot>
    </table>
  </section>`;
}

/** Note d'information — slug d'un doc officiel OU objet doc local complet. */
export function renderNote(slugOrDoc, ctx) {
  const doc = typeof slugOrDoc === "string" ? DOCS[slugOrDoc] : slugOrDoc;
  if (!doc) throw new Error(`Document inconnu : ${slugOrDoc}`);
  return docSection(noteHeader(doc, ctx), noteBody(doc, ctx), noteFooter(doc));
}

// ---------------------------------------------------------------------------
// Signatures : image du médecin (fiche locale, jamais transmise) ou tracé
// patient à l'écran (mémoire vive uniquement — ctx.patientSign).
// ---------------------------------------------------------------------------

const signImgTag = (data, h) =>
  `<img src="${data}" alt="" style="height:${h}px; max-width:230px; object-fit:contain; object-position:left bottom; display:block;">`;

const SIGN_ZONE_EMPTY = `<div style="border-top:1px dashed #9db4c6; margin-top:40px; padding-top:5px; font-size:10.5px; color:#8a9aa8; text-align:center;">Signature et cachet du prescripteur</div>`;

function signZone(med) {
  return med?.sign
    ? `<div style="margin-top:6px;">${signImgTag(med.sign, 56)}</div><div style="border-top:1px dashed #9db4c6; margin-top:4px; padding-top:5px; font-size:10.5px; color:#8a9aa8; text-align:center;">Signature et cachet du prescripteur</div>`
    : SIGN_ZONE_EMPTY;
}

// ---------------------------------------------------------------------------
// Ordonnances + guides de préparation colique
// ---------------------------------------------------------------------------

function ordoTokens(ctx) {
  const med = ctx.medecin;
  const p = ctx.patient;
  const svc = SERVICES.endoscopie;

  const patientBox = p
    ? `<div style="flex:none; width:170px; border:1.5px solid #0072BC; border-radius:8px; ${F} font-size:11px; color:#0d2b45; padding:10px 12px; min-height:78px;">
        <div style="${FC} text-transform:uppercase; letter-spacing:.04em; font-size:10px; color:#4a5b68; font-weight:600;">Patient</div>
        <div style="font-weight:700; margin-top:2px;">${esc(patientNom(p))}</div>
        ${p.ddn ? `<div style="color:#4a5b68; margin-top:2px;">Né(e) le ${esc(frDate(p.ddn))}</div>` : ""}
        ${p.examen ? `<div style="color:#4a5b68; margin-top:2px;">Examen le ${esc(frDate(p.examen))}</div>` : ""}
      </div>`
    : `<div style="flex:none; width:170px; border:1.5px dashed #9db4c6; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#8a9aa8; ${F} font-size:11px; text-align:center; padding:14px; min-height:78px;">Étiquette patient</div>`;

  return {
    "@@MED_NOM@@": med ? esc(med.nom) : `Dr&nbsp;${dotted(170)}`,
    "@@MED_SPEC@@": med ? esc(med.specialite || "Hépato-Gastroentérologie") : "Hépato-Gastroentérologie",
    "@@MED_TEL_LINE@@": med
      ? [
          med.tel ? `Secrétariat : ${esc(med.tel)}` : `Secrétariat : ${esc(svc.tel)}`,
          med.fax ? `Fax : ${esc(med.fax)}` : "",
          med.mail ? `E-mail : <strong>${esc(med.mail)}</strong>` : "",
        ].filter(Boolean).join("<br>")
      : `Secrétariat : ${esc(svc.tel)}<br>E-mail : ${esc(svc.mail)}`,
    "@@RPPS_BLOCK@@": med?.rpps
      ? `<div style="display:flex; align-items:center; gap:8px; margin-top:6px;">${code128svg(med.rpps)}<span style="${F} font-size:10px; color:#4a5b68;">RPPS ${esc(med.rpps)}</span></div>`
      : `<div style="margin-top:6px; border:1.5px dashed #9db4c6; border-radius:6px; padding:8px 10px; ${F} font-size:10px; color:#8a9aa8; width:190px; text-align:center;">RPPS — tampon du prescripteur</div>`,
    "@@FINESS_BARCODE@@": code128svg(FINESS),
    "@@PATIENT_BOX@@": patientBox,
    "@@DATE_LINE@@": ctx.dateDoc
      ? `<div style="font-size:13px;">Fait à Montpellier, le&nbsp;&nbsp;<strong>${esc(frDate(ctx.dateDoc))}</strong></div>`
      : `<div style="font-size:13px;">Fait à Montpellier, le&nbsp;&nbsp;____ / ____ / 20____</div>`,
  };
}

/** Ordonnance + guide (citrafleet | moviprep | plenvu | ximepeg). */
export function renderOrdo(key, ctx) {
  const tpl = ORDOS[key];
  if (!tpl) throw new Error(`Ordonnance inconnue : ${key}`);
  let html = tpl.html;

  // Le pied répété est déclaré en tête de template : on le déplace en tfoot.
  const foot = html.match(/<div slot="footer"[\s\S]*?<\/div>\s*/);
  let footerHtml = "";
  if (foot) {
    footerHtml = foot[0].replace(/ slot="footer"/, "");
    html = html.replace(foot[0], "");
  }

  const tokens = ordoTokens(ctx);
  for (const [tok, val] of Object.entries(tokens)) html = html.replaceAll(tok, val);
  html = html.replaceAll(SIGN_ZONE_EMPTY, signZone(ctx.medecin));

  return `<section class="doc">
    <table class="frame">
      <thead><tr><td><div class="hdr hdr-spacer"></div></td></tr></thead>
      <tbody><tr><td class="bodycell">${html}</td></tr></tbody>
      <tfoot><tr><td><div class="ftr">${footerHtml}</div></td></tr></tfoot>
    </table>
  </section>`;
}

// ---------------------------------------------------------------------------
// Ordonnance libre (simple ou ALD bizone)
// ---------------------------------------------------------------------------

// Contenu riche saisi dans l'éditeur (gras, italique, listes…) — nettoyé
// avant impression. Compatibilité : un ancien texte brut est converti.
const RICH_ALLOWED = new Set(["B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "BR", "DIV", "P", "SPAN", "BLOCKQUOTE", "FONT"]);
const SAFE_COLOR = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))$/;
export function sanitizeRich(html) {
  const s = String(html || "");
  if (!/[<>]/.test(s)) return esc(s).replace(/\n/g, "<br>"); // ancien format texte
  const root = new DOMParser().parseFromString(`<div>${s}</div>`, "text/html").body.firstChild;
  const DROP = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED"]);
  (function walk(el) {
    let child = el.firstChild;
    while (child) {
      if (child.nodeType === 1) {
        if (DROP.has(child.tagName)) {
          const dead = child; child = child.nextSibling; dead.remove(); continue;
        }
        if (!RICH_ALLOWED.has(child.tagName)) {
          // désencapsule puis retraite les nœuds remontés à cette position
          const first = child.firstChild;
          while (child.firstChild) el.insertBefore(child.firstChild, child);
          const dead = child; child = first || dead.nextSibling; dead.remove(); continue;
        }
        // taille / couleur choisies dans l'éditeur : seules propriétés
        // de style conservées, valeurs strictement validées
        let fSize = null, fColor = null, style = null;
        if (child.tagName === "FONT") {
          const sz = child.getAttribute("size"), col = child.getAttribute("color");
          if (sz && /^[1-7]$/.test(sz)) fSize = sz;
          if (col && SAFE_COLOR.test(col)) fColor = col;
        } else if (child.tagName === "SPAN") {
          const cs = child.getAttribute("style") || "";
          const mC = /(?:^|;)\s*color\s*:\s*(#[0-9a-fA-F]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))/i.exec(cs);
          const mS = /font-size\s*:\s*(\d{1,2}(?:\.\d+)?(?:px|pt|em))/i.exec(cs);
          const parts = [];
          if (mC) parts.push("color:" + mC[1]);
          if (mS) parts.push("font-size:" + mS[1]);
          if (parts.length) style = parts.join("; ");
        }
        for (const a of [...child.attributes]) child.removeAttribute(a.name);
        if (fSize) child.setAttribute("size", fSize);
        if (fColor) child.setAttribute("color", fColor);
        if (style) child.setAttribute("style", style);
        walk(child);
        child = child.nextSibling;
      } else if (child.nodeType === 3) {
        child = child.nextSibling;
      } else {
        const dead = child; child = child.nextSibling; dead.remove();
      }
    }
  })(root);
  return root.innerHTML;
}

function rxLines(html) {
  return `<div class="ordo-body" style="margin-top:12px; font-size:14px; line-height:1.55;">${sanitizeRich(html)}</div>`;
}

/**
 * opts = { mode: "ald" | "simple", textAld, textNonAld, texte, duree }
 * — mode "ald" : bizone (zone ALD 100 % + zone hors ALD) ;
 * — mode "simple" : une seule zone, sans mention ALD.
 */
export function renderOrdoLibre(opts, ctx) {
  const med = ctx.medecin;
  const p = ctx.patient;
  const svc = SERVICES.endoscopie;
  const t = ordoTokens(ctx); // réutilise bloc patient / RPPS / date

  const medBlock = `<div style="flex:1; ${F} color:#0d2b45;">
      <div style="${F} font-weight:700; font-size:15px; line-height:1.15;">${t["@@MED_NOM@@"]}</div>
      <div style="font-size:12px; color:#0072BC; font-weight:600;">${t["@@MED_SPEC@@"]}</div>
      <div style="font-size:11px; color:#4a5b68; margin-top:4px; line-height:1.5;">CHU de Montpellier<br>Hospitalisation : 04 67 33 70 65<br>${t["@@MED_TEL_LINE@@"]}</div>
      ${t["@@RPPS_BLOCK@@"]}
    </div>`;

  const dureeLine = opts.duree
    ? `<div style="font-size:12.5px; color:#1c3a52; margin-top:16px;"><strong>Durée du traitement :</strong> ${esc(opts.duree)}</div>`
    : "";

  let zones = "";
  if (opts.mode === "ald") {
    zones = `
    <div style="border:1.5px solid #0072BC; border-radius:10px; overflow:hidden; margin-top:16px;">
      <div style="background:#EAF3FB; padding:7px 14px; ${F} font-weight:700; font-size:12px; color:#0d2b45; border-bottom:1px solid #cfe1f0;">Prescriptions relatives au traitement de l'affection de longue durée reconnue (liste ou hors liste)<span style="font-weight:600; color:#4a5b68;"> — AFFECTION EXONÉRANTE</span></div>
      <div style="padding:2px 16px 16px; min-height:150px;">${rxLines(opts.textAld)}</div>
    </div>
    <div style="border:1.5px solid #9db4c6; border-radius:10px; overflow:hidden; margin-top:14px;">
      <div style="background:#f4f7fa; padding:7px 14px; ${F} font-weight:700; font-size:12px; color:#4a5b68; border-bottom:1px solid #dde6ee;">Prescriptions SANS rapport avec l'affection de longue durée<span style="font-weight:600;"> — MALADIES INTERCURRENTES</span></div>
      <div style="padding:2px 16px 16px; min-height:110px;">${rxLines(opts.textNonAld)}</div>
    </div>`;
  } else {
    zones = `<div style="${F} color:#1c3a52; margin-top:6px;">${rxLines(opts.texte)}</div>`;
  }

  const body = `
  <div style="display:flex; gap:16px; align-items:flex-start; border-bottom:2px solid #0072BC; padding-bottom:12px;">
    ${medBlock}
    <div style="flex:none; text-align:center;"><img src="chu-logo.webp" alt="CHU de Montpellier" style="height:66px; width:auto;"></div>
    <div style="flex:1; text-align:right; ${F} color:#0d2b45;">
      <div style="font-weight:700; font-size:13px;">${esc(svc.nom)}</div>
      <div style="font-size:11px; color:#4a5b68; margin-top:3px; line-height:1.5;">80, avenue Augustin Fliche<br>34295 Montpellier Cedex 5<br>Tél. ${esc(svc.tel)} / 04 67 33 54 85<br>${esc(svc.mail)}</div>
    </div>
  </div>

  <div style="display:flex; gap:14px; margin-top:12px; align-items:stretch;">
    ${t["@@PATIENT_BOX@@"]}
    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:6px; ${F}">
      <div style="display:flex; align-items:center; gap:8px;">${code128svg(FINESS)}<span style="font-size:10px; color:#4a5b68;">FINESS ${FINESS}</span></div>
    </div>
    <div style="flex:none; ${F} font-size:12px; color:#4a5b68; text-align:right;">Le ${ctx.dateDoc ? `<strong style="color:#0d2b45;">${esc(frDate(ctx.dateDoc))}</strong>` : dotted(110)}</div>
  </div>

  <div style="text-align:center; margin-top:20px;">
    <div style="display:inline-block; ${F} font-weight:800; font-size:26px; letter-spacing:.14em; color:#0d2b45; border-bottom:3px solid #EF7D00; padding-bottom:4px;">ORDONNANCE</div>
  </div>

  <div style="${F} color:#1c3a52; margin-top:4px;">
    ${zones}
    ${dureeLine}
  </div>

  <div style="display:flex; justify-content:flex-end; margin-top:30px;">
    <div style="width:300px; ${F} color:#1c3a52;">
      <div style="font-weight:700; font-size:14px; margin-top:10px;">${t["@@MED_NOM@@"]}</div>
      <div style="font-size:11px; color:#4a5b68;">${t["@@MED_SPEC@@"]} — CHU de Montpellier</div>
      ${signZone(med)}
    </div>
  </div>`;

  const footer = `<div style="display:flex; justify-content:space-between; align-items:center; ${F} font-size:9px; color:#7a8794; border-top:1px solid #d9e2ea; padding-top:5px;">
    <span>CHU de Montpellier — ${esc(svc.nom)} · ${esc(svc.tel)}</span>
    <span style="${FC} letter-spacing:.05em; text-transform:uppercase; color:#0072BC; font-weight:600;">Ordonnance</span>
  </div>`;

  return `<section class="doc">
    <table class="frame">
      <thead><tr><td><div class="hdr hdr-spacer"></div></td></tr></thead>
      <tbody><tr><td class="bodycell">${body}</td></tr></tbody>
      <tfoot><tr><td><div class="ftr">${footer}</div></td></tr></tfoot>
    </table>
  </section>`;
}

// ---------------------------------------------------------------------------
// Demande d'examen endoscopique (bon PTED — Hôpital Saint-Éloi)
// ---------------------------------------------------------------------------

const chk = (on) =>
  `<span style="font-size:13px; line-height:1; color:${on ? "#0072BC" : "#9db4c6"};">${on ? "☑" : "☐"}</span>`;

const EXAMENS_ENDO = [
  ["gastroscopie", "Gastroscopie"], ["cpre", "CPRE"],
  ["coloscopie", "Coloscopie"], ["echoendoscopie", "Échoendoscopie"],
  ["coloscopie_courte", "Coloscopie courte"], ["enteroscopie", "Entéroscopie"],
  ["videocapsule", "Vidéocapsule"], ["duodenoscopie", "Duodénoscopie"],
  ["gep", "GEP"], ["biopsie_transjug", "Biopsie hépatique transjugulaire"],
];

function boxTitle(t) {
  return `<div style="background:#EAF3FB; border-bottom:1px solid #cfe1f0; padding:5px 12px; ${FC} text-transform:uppercase; letter-spacing:.05em; font-weight:700; font-size:11.5px; color:#0d2b45;">${t}</div>`;
}
function fbox(inner, extra = "") {
  return `<div style="border:1.5px solid #0072BC; border-radius:9px; overflow:hidden; ${extra}">${inner}</div>`;
}
const fline = (label, value, minw = 110) =>
  `<div style="display:flex; gap:6px; align-items:baseline; margin-top:4px;"><span style="color:#4a5b68; flex:none;">${label}</span><span style="flex:1; border-bottom:1px dotted #9db4c6; font-weight:600; color:#0d2b45; min-width:${minw}px; padding:0 4px;">${value || "&nbsp;"}</span></div>`;

export function renderDemandeEndoscopie(o, ctx) {
  const med = ctx.medecin;
  const p = ctx.patient;

  const head = `
  <div style="display:flex; gap:14px; align-items:center;">
    <img src="chu-logo.webp" alt="CHU" style="height:42px; flex:none;">
    <div style="flex:1; min-width:0;">
      <div style="${F} font-size:11px; color:#4a5b68;">Plateau technique d'endoscopie digestive — Hôpital Saint-Éloi</div>
      <div style="${F} font-weight:800; font-size:17.5px; color:#0d2b45; line-height:1.1;">Bon de demande d'examen endoscopique</div>
    </div>
    <div style="flex:none; border:1.5px solid #0072BC; border-radius:9px; padding:5px 10px; ${F} font-size:10.5px; color:#1c3a52; line-height:1.6;">
      <div style="${FC} text-transform:uppercase; letter-spacing:.05em; font-weight:700; color:#0072BC; font-size:10px;">Formulaire à retourner</div>
      <div>Fax : <strong>04 67 33 73 58</strong></div>
      <div>endoscopie.ste@chu-montpellier.fr</div>
    </div>
  </div>
  <div style="${F} font-size:11.5px; color:#1c3a52; margin-top:8px;">Date de la demande : <strong>${ctx.dateDoc ? esc(frDate(ctx.dateDoc)) : "____ / ____ / 20____"}</strong></div>`;

  const identite = fbox(
    boxTitle("Identité du patient (ou étiquette)") +
    `<div style="padding:4px 10px 7px; ${F} font-size:11px;">
      ${fline("Nom :", p?.nom ? esc(p.nom.toUpperCase()) : "")}
      ${fline("Prénom :", esc(p?.prenom || ""))}
      ${fline("Date de naissance :", p?.ddn ? esc(frDate(p.ddn)) : "")}
      ${fline("Téléphone :", esc(o.telPatient || ""))}
    </div>`, "flex:1;");

  const demandeur = fbox(
    boxTitle("Service demandeur") +
    `<div style="padding:4px 10px 7px; ${F} font-size:11px;">
      ${fline("Médecin :", med ? esc(med.nom) : "")}
      ${fline("Service :", esc(o.service || ""))}
      ${fline("Code UF :", esc(o.uf || ""))}
      ${fline("Téléphone :", esc(o.telDemandeur || med?.tel || ""))}
    </div>`, "flex:1;");

  const delaiRows = [
    ["urgent48", "Urgent ++ (< 48 heures)", "19195"],
    ["urgent7", "Urgent (< 7 jours)", "33305"],
    ["semi15", "Semi-urgent (< 15 jours)", "37067"],
    ["autre", `Autres : <span style="border-bottom:1px dotted #9db4c6; padding:0 6px; font-weight:600;">${esc(o.delaiAutre || "")}&nbsp;</span>`, "35485"],
  ].map(([k, lbl, tel]) =>
    `<div style="display:flex; align-items:baseline; gap:7px; margin-top:3px;">${chk(o.delai === k)}<span style="flex:1;">${lbl}</span><span style="color:#4a5b68;">☎ ${tel}</span></div>`
  ).join("");

  const hospitRows = [
    ["deja", "Déjà hospitalisé"],
    ["hdj", `Hôpital de jour — Service : <span style="border-bottom:1px dotted #9db4c6; padding:0 6px; font-weight:600;">${esc(o.hdjService || "")}&nbsp;</span>`],
    ["hosp", `Hospitalisation&nbsp;&nbsp; ${["J0", "J-1", "J-2"].map((j) => `${chk(o.hospit === "hosp" && o.hospJ === j)} ${j}`).join("&nbsp;&nbsp;")}`],
    ["externe", `Externe <span style="color:#4a5b68;">(uniquement pour les examens sans AG)</span>`],
  ].map(([k, lbl]) =>
    `<div style="display:flex; align-items:baseline; gap:7px; margin-top:3px;">${chk(o.hospit === k)}<span style="flex:1;">${lbl}</span></div>`
  ).join("");

  const delaiHospit = `<div style="display:flex; gap:10px; margin-top:7px;">
    ${fbox(boxTitle("Délai souhaité") + `<div style="padding:3px 10px 6px; ${F} font-size:11px;">${delaiRows}</div>`, "flex:1;")}
    ${fbox(boxTitle("Type d'hospitalisation") + `<div style="padding:3px 10px 6px; ${F} font-size:11px;">${hospitRows}</div>`, "flex:1;")}
  </div>
  <div style="display:flex; gap:8px; align-items:flex-start; margin-top:8px; background:#FFF4E6; border:1px solid #f3c98a; border-radius:8px; padding:5px 10px; ${F} font-size:10.5px; color:#6b4a1a; line-height:1.45;">
    <span style="flex:none; font-weight:800; color:#EF7D00;">⚠</span>
    <span>Pour un examen sous <strong>AG</strong>, prévoir une hospitalisation et une consultation d'anesthésie. Pour un examen en <strong>AMBU</strong>, préciser si vous souhaitez une HDJ dans le service Gastro.</span>
  </div>`;

  const exCells = EXAMENS_ENDO.map(([k, lbl]) => {
    let extra = "";
    if (k === "gep" && (o.examens || []).includes("gep"))
      extra = `&nbsp;&nbsp;<span style="color:#4a5b68; font-size:10.5px;">${["pose", "changement", "retrait"].map((m) => `${chk(o.gepMode === m)} ${m}`).join("&nbsp;")}</span>`;
    return `<div style="width:50%; display:flex; gap:7px; align-items:baseline; margin-top:3px;">${chk((o.examens || []).includes(k))}<span style="font-weight:${(o.examens || []).includes(k) ? "700" : "400"};">${lbl}${extra}</span></div>`;
  }).join("");

  const examens = fbox(
    boxTitle("Examens demandés") +
    `<div style="padding:2px 10px 6px; ${F} font-size:11.5px; display:flex; flex-wrap:wrap;">${exCells}</div>
     <div style="padding:0 10px 7px; ${F} font-size:11px;">${fline("Actes thérapeutiques probables (prothèse, ligature, dilatation…) :", esc(o.actes || ""))}</div>`,
    "margin-top:7px;");

  const indications = fbox(
    boxTitle("Indications") +
    `<div style="padding:6px 10px 8px; ${F} font-size:11.5px; color:#0d2b45; min-height:40px; white-space:pre-wrap; line-height:1.5;">${esc(o.indications || "")}</div>`,
    "margin-top:7px;");

  const lieuCase = (on) =>
    `<span style="display:inline-block; width:16px; height:16px; border:2.5px solid ${on ? "#C0392B" : "#9db4c6"}; border-radius:4px; text-align:center; line-height:12px; font-weight:900; font-size:13px; color:#C0392B; background:#fff;">${on ? "✕" : "&nbsp;"}</span>`;
  const lieu = `<div style="border:2.5px solid #C0392B; border-radius:10px; margin-top:8px; padding:8px 14px; display:flex; align-items:center; gap:22px; break-inside:avoid; background:#FCECEA;">
    <span style="${FC} text-transform:uppercase; letter-spacing:.05em; font-weight:800; color:#C0392B; font-size:14px; flex:none;">Lieu de réalisation</span>
    <span style="display:flex; align-items:center; gap:8px; ${F} font-size:15px; font-weight:${o.lieu !== "bloc" ? "800" : "500"}; color:#0d2b45;">${lieuCase(o.lieu !== "bloc")} PTED</span>
    <span style="display:flex; align-items:center; gap:8px; ${F} font-size:15px; font-weight:${o.lieu === "bloc" ? "800" : "500"}; color:#0d2b45;">${lieuCase(o.lieu === "bloc")} BLOC OPÉRATOIRE</span>
    ${o.lieu === "bloc" && Object.values(o.crit || {}).some(Boolean) ? `<span style="${F} font-size:10px; color:#8f2419;">(critère d'examen au bloc présent)</span>` : ""}
  </div>`;

  const ouinon = (v) => `${chk(v === "oui")} OUI&nbsp;&nbsp;&nbsp;${chk(v === "non")} NON`;
  const agBloc = `<div style="display:flex; gap:24px; margin-top:7px; ${F} font-size:11px; color:#1c3a52; align-items:baseline; flex-wrap:wrap;">
    <span><strong>Examen sous anesthésie générale :</strong> ${ouinon(o.ag)}</span>
    <span><strong>Informations délivrées au patient :</strong> ${ouinon(o.infosPatient)}</span>
    <span style="color:#4a5b68; font-size:10.5px;">Joindre le consentement éclairé du patient.</span>
  </div>`;

  const critRows = [
    ["imc", "IMC > 40 kg/m²"], ["htap", "HTAP > 50 mmHg"],
    ["fevg", "FEVG < 35 % ou assistance cardiaque"], ["htic", "HTIC"],
    ["irc", "Insuffisance respiratoire chronique"],
  ].map(([k, lbl]) => `<div style="display:flex; gap:7px; align-items:baseline; margin-top:3px;">${chk(!!(o.crit || {})[k])}<span>${lbl}</span></div>`).join("");

  const isoLbl = { bhre: "BHRe", tuberculose: "Tuberculose" };
  const risques = `
    <div style="margin-top:2px;"><strong>Patient avec isolement :</strong>&nbsp; ${["bhre", "tuberculose"].map((k) => `${chk(o.iso === k)} ${isoLbl[k]}`).join("&nbsp;&nbsp;")}&nbsp;&nbsp;${chk(o.iso === "autre")} Autres : <span style="border-bottom:1px dotted #9db4c6; padding:0 5px; font-weight:600;">${esc(o.isoAutre || "")}&nbsp;</span></div>
    <div style="margin-top:5px;"><strong>Risque de Creutzfeldt-Jakob :</strong>&nbsp; ${ouinon(o.cjd)}</div>`;

  const clinique = `
  <div style="${FC} text-transform:uppercase; letter-spacing:.05em; font-weight:700; font-size:11.5px; color:#C0392B; margin-top:8px;">Informations cliniques à compléter obligatoirement</div>
  <div style="display:flex; gap:10px; margin-top:6px;">
    ${fbox(boxTitle("Critères d'examen au bloc") + `<div style="padding:3px 10px 6px; ${F} font-size:11px;">${critRows}</div>`, "flex:1;")}
    ${fbox(boxTitle("Risques patients") + `<div style="padding:3px 10px 6px; ${F} font-size:11px;">${risques}</div>`, "flex:1.3;")}
  </div>
  <div style="border:1.5px solid #0072BC; border-radius:9px; margin-top:8px; padding:6px 10px; ${F} font-size:11px;">
    <div style="display:flex; gap:10px; align-items:baseline;"><span style="flex:none;"><strong>Anticoagulation en cours :</strong> ${chk(!o.anticoEn)} Non&nbsp; ${chk(!!o.anticoEn)} Oui</span><span style="flex:1.1;">${fline("laquelle :", esc(o.antico || ""))}</span><span style="flex:1;">${fline("stoppée ? quand :", esc(o.anticoStop || ""))}</span></div>
    <div style="display:flex; gap:10px; align-items:baseline; margin-top:2px;"><span style="flex:none;"><strong>Anti-agrégation en cours :</strong> ${chk(!o.antiagregEn)} Non&nbsp; ${chk(!!o.antiagregEn)} Oui</span><span style="flex:1.1;">${fline("laquelle :", esc(o.antiagreg || ""))}</span><span style="flex:1;">${fline("stoppée ? quand :", esc(o.antiagregStop || ""))}</span></div>
    <div style="display:flex; gap:10px;"><span style="flex:1;">${fline("TP :", esc(o.tp || ""))}</span><span style="flex:1;">${fline("Plaquettes :", esc(o.plaquettes || ""))}</span></div>
  </div>`;

  const pted = fbox(
    boxTitle("Espace réservé au PTED") +
    `<div style="padding:4px 10px 7px; ${F} font-size:11px; color:#4a5b68;">
      ${fline("Validation gastroentérologue :", "")}
      ${fline("Protocole d'examen :", "")}
      <div style="margin-top:5px;">Consultation pré-endoscopie : ${chk(false)} OUI&nbsp;&nbsp;${chk(false)} NON</div>
    </div>`, "margin-top:8px; break-inside:avoid;");

  const body = head + `<div style="display:flex; gap:10px; margin-top:7px;">${identite}${demandeur}</div>` +
    delaiHospit + examens + indications + lieu + agBloc + clinique + pted +
    `<div style="${FC} text-transform:uppercase; letter-spacing:.06em; text-align:center; font-weight:700; font-size:11px; color:#C0392B; margin-top:7px;">Toute demande incomplète ne sera pas traitée</div>`;

  const footer = `<div style="display:flex; justify-content:space-between; align-items:center; ${F} font-size:9px; color:#7a8794; border-top:1px solid #d9e2ea; padding-top:5px;">
    <span>CHU de Montpellier — Plateau technique d'endoscopie digestive · Fax 04 67 33 73 58</span>
    <span style="${FC} letter-spacing:.05em; text-transform:uppercase; color:#0072BC; font-weight:600;">Demande d'examen endoscopique</span>
  </div>`;

  return `<section class="doc">
    <table class="frame">
      <thead><tr><td><div class="hdr hdr-spacer"></div></td></tr></thead>
      <tbody><tr><td class="bodycell">${body}</td></tr></tbody>
      <tfoot><tr><td><div class="ftr">${footer}</div></td></tr></tfoot>
    </table>
  </section>`;
}

// ---------------------------------------------------------------------------
// Demandes d'examens d'imagerie (bons CHU : écho/doppler, radio, TDM, IRM,
// interventionnel, TEP-TDM) — Saint Eloi coché par défaut.
// ---------------------------------------------------------------------------

const SITES_6 = [
  ["adv", "Plateau d'imagerie médicale ADV", "35991", "36088"],
  ["lapeyronie", "Plateau d'imagerie médicale Lapeyronie", "38632", "38949"],
  ["radioped", "Service de Radiopédiatrie ADV", "36017", "36018"],
  ["guichauliac", "Neuroradiologie Gui de Chauliac", "37533 ou 37275", "37671"],
  ["steloi", "Service d'imagerie médicale Saint Eloi", "37540 ou 37120", "37116"],
  ["balmes", "Radiologie A. Balmès / La Colombière", "39970", ""],
];
const SITES_TDM = [
  ["adv", "Plateau d'imagerie médicale ADV", "35991", "36088"],
  ["lapeyronie", "Plateau d'imagerie médicale Lapeyronie", "38620 ou 38635", "38949"],
  ["guichauliac", "Neuroradiologie Gui de Chauliac", "37533 ou 37275", "37671"],
  ["steloi", "Service d'imagerie médicale Saint Eloi", "37540 ou 37120", "37116"],
];
const SITES_IRM = [
  ["adv", "Plateau d'imagerie médicale ADV", "35987", "30753 ou 36088"],
  ["lapeyronie", "Plateau d'imagerie médicale Lapeyronie", "38615", "39074"],
  ["guichauliac", "Neuroradiologie Gui de Chauliac", "37880", "36838"],
  ["steloi", "Service d'imagerie médicale Saint Eloi", "37322", "37116"],
];

export const IMAGERIE_TITRES = {
  echo: "Demande d'examen échographique / Doppler",
  radio: "Demande d'examen de radiologie",
  tdm: "Demande d'examen de tomodensitométrie (scanner)",
  irm: "Demande d'examen d'IRM",
  interv: "Demande d'examen interventionnel ou d'angiographie",
  tep: "Formulaire de demande d'examen TEP-TDM",
};

const on3 = (v) => `${chk(v === "non")} Non&nbsp;&nbsp;${chk(v === "oui")} Oui`; // Non/Oui explicites
const inline = (label, value, w = 70) =>
  `${label} <span style="border-bottom:1px dotted #9db4c6; display:inline-block; min-width:${w}px; font-weight:600; padding:0 4px;">${esc(value || "")}&nbsp;</span>`;

function demHead(title, sub, ctx) {
  return `<div style="display:flex; gap:14px; align-items:center;">
    <img src="chu-logo.webp" alt="CHU" style="height:42px; flex:none;">
    <div style="flex:1; min-width:0;">
      ${sub ? `<div style="${F} font-size:11px; color:#4a5b68;">${sub}</div>` : ""}
      <div style="${F} font-weight:800; font-size:17px; color:#0d2b45; line-height:1.1;">${title}</div>
    </div>
    <div style="flex:none; ${F} font-size:11.5px; color:#1c3a52;">Date de la demande : <strong>${ctx.dateDoc ? esc(frDate(ctx.dateDoc)) : "____ / ____ / 20____"}</strong></div>
  </div>`;
}

function sitesBox(sites, selected) {
  const cells = sites.map(([k, nom, tel, fax]) => `
    <div style="width:50%; display:flex; gap:7px; align-items:baseline; margin-top:3px; padding-right:8px;">
      ${chk(k === selected)}
      <span style="flex:1;"><span style="font-weight:${k === selected ? "700" : "400"};">${nom}</span><br>
      <span style="color:#4a5b68; font-size:10px;">Tél : ${tel}${fax ? " · Fax : " + fax : ""}</span></span>
    </div>`).join("");
  return fbox(boxTitle("Site de réalisation (cocher)") + `<div style="padding:2px 10px 7px; ${F} font-size:11px; display:flex; flex-wrap:wrap;">${cells}</div>`, "margin-top:8px;");
}

function identiteDemandeur(o, ctx, opts = {}) {
  const p = ctx.patient;
  const med = ctx.medecin;
  const identite = fbox(
    boxTitle("Identification du patient (ou étiquette)") +
    `<div style="padding:4px 10px 7px; ${F} font-size:11px;">
      ${fline("Nom :", p?.nom ? esc(p.nom.toUpperCase()) : "")}
      ${fline("Prénom :", esc(p?.prenom || ""))}
      ${fline("Date de naissance :", p?.ddn ? esc(frDate(p.ddn)) : "")}
      ${fline("☎ (si consultant) :", esc(o.telPatient || ""))}
    </div>`, "flex:1;");
  const demandeur = fbox(
    boxTitle("Service demandeur") +
    `<div style="padding:4px 10px 7px; ${F} font-size:11px;">
      ${fline("Service :", esc(o.service || ""))}
      <div style="display:flex; gap:10px;"><span style="flex:1;">${fline("Code UF :", esc(o.uf || ""))}</span><span style="flex:1;">${fline("☎ :", esc(o.telDemandeur || med?.tel || ""))}</span></div>
      ${fline("Médecin demandeur (capitales) :", med ? esc(med.nom.toUpperCase()) : "")}
      <div style="display:flex; gap:6px; align-items:flex-end; margin-top:4px;"><span style="color:#4a5b68; flex:none;">Signature${opts.sigOblig ? " obligatoire" : ""} :</span><span style="flex:1; border-bottom:1px solid #9db4c6; min-height:22px; display:flex; align-items:flex-end;">${med?.sign ? signImgTag(med.sign, 26) : ""}</span></div>
    </div>`, "flex:1;");
  return `<div style="display:flex; gap:10px; margin-top:8px;">${identite}${demandeur}</div>`;
}

function isoLine(o) {
  return `<div style="margin-top:4px;"><strong>Isolement pour risques infectieux :</strong>&nbsp; ${on3(o.risqueInf || "non")}
    &nbsp;&nbsp;<span style="color:#4a5b68;">si oui :</span>&nbsp;${["contact", "air", "gouttelettes"].map((t) => `${chk(o.risqueInf === "oui" && o.risqueInfType === t)} ${t.charAt(0).toUpperCase() + t.slice(1)}`).join("&nbsp;&nbsp;")}</div>`;
}

function cadreReserve(inner) {
  return fbox(boxTitle("Cadre réservé au service d'imagerie médicale") +
    `<div style="padding:5px 10px 8px; ${F} font-size:11px; color:#4a5b68;">${inner}</div>`, "margin-top:8px; break-inside:avoid;");
}

const NB_LINE = `<div style="${F} font-size:9.5px; color:#6b7c8a; font-style:italic; margin-top:7px;">NB : les renseignements demandés engagent votre responsabilité médicale et sont indispensables pour donner un rendez-vous d'examen. Toute demande incorrectement remplie sera retournée.</div>`;

function demandeSection(body, footTitle) {
  const footer = `<div style="display:flex; justify-content:space-between; align-items:center; ${F} font-size:9px; color:#7a8794; border-top:1px solid #d9e2ea; padding-top:5px;">
    <span>CHU de Montpellier — Doc'HGE · Hépato-Gastroentérologie</span>
    <span style="${FC} letter-spacing:.05em; text-transform:uppercase; color:#0072BC; font-weight:600;">${footTitle}</span>
  </div>`;
  return `<section class="doc">
    <table class="frame">
      <thead><tr><td><div class="hdr hdr-spacer"></div></td></tr></thead>
      <tbody><tr><td class="bodycell">${body}</td></tr></tbody>
      <tfoot><tr><td><div class="ftr">${footer}</div></td></tr></tfoot>
    </table>
  </section>`;
}

/** Écho/Doppler et Radiologie (même bon, titres différents). */
function renderDemandeEchoRadio(kind, o, ctx) {
  const titre = IMAGERIE_TITRES[kind];
  const body = demHead(titre, "CHU de Montpellier — Imagerie médicale", ctx) +
    sitesBox(SITES_6, o.site) +
    identiteDemandeur(o, ctx) +
    fbox(`<div style="padding:6px 10px 8px; ${F} font-size:11px;">
      <div><strong>Examen au lit du patient :</strong>&nbsp; ${chk(o.lit === "oui")} OUI&nbsp;&nbsp;${chk(o.lit !== "oui")} NON
      &nbsp;&nbsp;&nbsp;<strong>Transport :</strong>&nbsp; ${[["valide", "Patient valide"], ["fauteuil", "Fauteuil"], ["brancard", "Brancard"], ["litT", "Lit"]].map(([k, l]) => `${chk(o.transport === k)} ${l}`).join("&nbsp;&nbsp;")}</div>
      ${isoLine(o)}
      ${fline("Autonomie relationnelle du patient (confus…) :", esc(o.autonomie || ""))}
    </div>`, "margin-top:8px;") +
    fbox(boxTitle("Examen demandé") + `<div style="padding:6px 10px 10px; ${F} font-size:12px; font-weight:600; color:#0d2b45; min-height:30px;">${esc(o.examen || "")}</div>`, "margin-top:8px;") +
    fbox(boxTitle("Indication de l'examen et contexte clinique") + `<div style="padding:6px 10px 10px; ${F} font-size:11.5px; min-height:70px; white-space:pre-wrap; line-height:1.5;">${esc(o.indications || "")}</div>`, "margin-top:8px;") +
    cadreReserve(`Rendez-vous donné — ${inline("le :", "", 90)} &nbsp; ${inline("à :", "", 60)} h`) + NB_LINE;
  return demandeSection(body, titre);
}

/** Scanner (TDM). */
function renderDemandeTdm(o, ctx) {
  const titre = IMAGERIE_TITRES.tdm;
  const prealables = fbox(boxTitle("Préalables à l'exploration TDM") + `<div style="padding:5px 10px 8px; ${F} font-size:11px; line-height:1.6;">
      <div><strong>Asthme non équilibré</strong> (crise < 8 jours) : ${on3(o.asthme)} &nbsp;&nbsp;·&nbsp; <strong>Réaction sévère lors d'une injection de PCI :</strong> ${on3(o.reactionPci)}</div>
      <div style="color:#4a5b68; font-size:10px;">Si oui : contacter un radiologue, envisager une procédure alternative (écho, IRM, scanner sans injection), bilan allergologique. En dehors de cette éventualité : aucune prémédication.</div>
      ${isoLine(o)}
      <div style="margin-top:3px;"><strong>Diabète :</strong> ${on3(o.diabete)} <span style="color:#4a5b68; font-size:10px;">— si DNID sous METFORMINE : arrêt le jour de l'examen, reprise 48 h après si fonction rénale normale</span></div>
      <div style="margin-top:3px;"><strong>Insuffisance rénale :</strong> ${on3(o.ir)} &nbsp; ${inline("Créatininémie :", o.creat, 60)} µmol/L &nbsp; ${chk(!!o.dialyse)} Patient dialysé</div>
      <div style="margin-top:3px;"><strong>Bêta-bloquants :</strong> ${on3(o.betabloquants)} &nbsp;·&nbsp; <strong>Grossesse :</strong> ${on3(o.grossesse)} &nbsp;·&nbsp; <strong>Gammapathie monoclonale (myélome) :</strong> ${on3(o.gammapathie)}</div>
      <div style="margin-top:3px;"><strong>Examen sous anesthésie générale :</strong> ${on3(o.ag)} &nbsp;&nbsp;·&nbsp; <strong>Mobilité :</strong> ${[["normale", "Normale"], ["fauteuil", "Fauteuil"], ["brancard", "Brancard"]].map(([k, l]) => `${chk(o.mobilite === k)} ${l}`).join("&nbsp;&nbsp;")}</div>
    </div>`, "margin-top:8px;");
  const body = demHead(titre, "CHU de Montpellier — Imagerie médicale", ctx) +
    sitesBox(SITES_TDM, o.site) + identiteDemandeur(o, ctx, { sigOblig: true }) + prealables +
    fbox(boxTitle("Région anatomique à explorer") + `<div style="padding:6px 10px 8px; ${F} font-size:12px; font-weight:600; color:#0d2b45; min-height:26px;">${esc(o.examen || "")}</div>`, "margin-top:8px;") +
    fbox(boxTitle("But de l'examen et contexte clinique") + `<div style="padding:6px 10px 8px; ${F} font-size:11.5px; min-height:56px; white-space:pre-wrap; line-height:1.5;">${esc(o.indications || "")}</div>
      <div style="padding:0 10px 8px; ${F} font-size:11px;">${fline("Date souhaitée :", o.dateSouhaitee ? esc(o.dateSouhaitee) : "")}</div>`, "margin-top:8px;") +
    `<div style="${F} font-size:10px; color:#4a5b68; margin-top:5px;">➤ Joindre tous les documents concernant la région à explorer le jour de l'examen.</div>` +
    cadreReserve(`${inline("Rendez-vous le :", "", 90)} &nbsp; ${inline("à :", "", 50)} h &nbsp;&nbsp; Injection : ${chk(false)} OUI ${chk(false)} NON &nbsp;&nbsp; ${inline("Protocole :", "", 120)} &nbsp;&nbsp; ${inline("Visa du radiologue :", "", 80)}`) + NB_LINE;
  return demandeSection(body, titre);
}

const IRM_MATERIEL = [
  ["stimulateur", "Stimulateur cardiaque"],
  ["neuro", "Neurostimulateur"],
  ["clips", "Clips chirurgicaux, structures métalliques, agrafes"],
  ["valves", "Valves cardiaques, matériel endo-vasculaire"],
  ["protheses_aud", "Prothèses auditives ou dentaires"],
  ["autres_protheses", "Autres prothèses"],
  ["osteo", "Matériel d'ostéosynthèse"],
  ["metaux", "Travailleur des métaux, corps étrangers oculaires, éclats d'obus, balles"],
  ["rea", "Matériel de réanimation"],
];

/** IRM. */
function renderDemandeIrm(o, ctx) {
  const titre = IMAGERIE_TITRES.irm;
  const mat = (o.materiel || {});
  const rows = IRM_MATERIEL.map(([k, l]) => {
    const val = mat[k] || "";
    return `<div style="display:flex; gap:7px; align-items:baseline; margin-top:2px;">
      <span style="flex:1.6;">• ${l}</span>
      <span style="flex:none;">${chk(!val)} Non&nbsp; ${chk(!!val)} Oui</span>
      <span style="flex:1; border-bottom:1px dotted #9db4c6; font-weight:600; padding:0 4px;">${esc(val === true ? "" : val || "")}&nbsp;</span>
    </div>`;
  }).join("");
  const body = demHead(titre, "CHU de Montpellier — Imagerie médicale", ctx) +
    sitesBox(SITES_IRM, o.site) + identiteDemandeur(o, ctx, { sigOblig: true }) +
    fbox(boxTitle("Préalables à l'exploration IRM — risques spécifiques") + `<div style="padding:5px 10px 8px; ${F} font-size:11px; line-height:1.6;">
      <div><strong>Allergie au gadolinium :</strong> ${on3(o.gado)} &nbsp;·&nbsp; <strong>Grossesse / allaitement :</strong> ${on3(o.grossesse)}</div>
      ${isoLine(o)}
      <div style="margin-top:3px;"><strong>Insuffisance rénale :</strong> ${on3(o.ir)} &nbsp; ${inline("Créatininémie :", o.creat, 55)} &nbsp; ${inline("Clairance :", o.clairance, 55)}</div>
    </div>`, "margin-top:8px;") +
    fbox(boxTitle("Contre-indications liées au matériel (si oui : localisation, référence)") + `<div style="padding:4px 10px 7px; ${F} font-size:10.5px;">${rows}</div>`, "margin-top:8px;") +
    fbox(`<div style="padding:5px 10px 7px; ${F} font-size:11px;">
      <strong>Mobilité :</strong> ${[["normale", "Normale"], ["fauteuil", "Fauteuil"], ["brancard", "Brancard"]].map(([k, l]) => `${chk(o.mobilite === k)} ${l}`).join("&nbsp;&nbsp;")}
      &nbsp;&nbsp;·&nbsp; <strong>Coopération prévisible :</strong> ${[["claustro", "Claustrophobie"], ["ag", "Anesthésie générale"], ["ag_enfant", "AG enfant"]].map(([k, l]) => `${chk(o.cooperation === k)} ${l}`).join("&nbsp;&nbsp;")}
    </div>`, "margin-top:8px;") +
    fbox(boxTitle("Région anatomique à explorer") + `<div style="padding:6px 10px 8px; ${F} font-size:12px; font-weight:600; color:#0d2b45; min-height:24px;">${esc(o.examen || "")}</div>`, "margin-top:8px;") +
    fbox(boxTitle("But de l'examen et contexte clinique") + `<div style="padding:6px 10px 8px; ${F} font-size:11.5px; min-height:46px; white-space:pre-wrap; line-height:1.5;">${esc(o.indications || "")}</div>`, "margin-top:8px;") +
    `<div style="${F} font-size:10px; color:#4a5b68; margin-top:5px;">➤ Joindre tous les documents concernant la région à explorer le jour de l'examen. Pour les mineurs, s'assurer que l'autorisation de soins a été signée par les parents.</div>` +
    cadreReserve(`${inline("Demande reçue le :", "", 80)} &nbsp; ${inline("Rendez-vous le :", "", 80)} à ${inline("", "", 40)} h &nbsp; Injection : ${chk(false)} OUI ${chk(false)} NON &nbsp; ${inline("Protocole :", "", 90)} ${inline("Visa du radiologue :", "", 70)}`) + NB_LINE;
  return demandeSection(body, titre);
}

/** Radiologie interventionnelle / angiographie (SIM Saint-Éloi). */
function renderDemandeInterv(o, ctx) {
  const titre = IMAGERIE_TITRES.interv;
  const body = demHead(titre, "Service d'imagerie médicale (SIM) — Hôpital Saint-Éloi · CHU de Montpellier", ctx) +
    `<div style="display:flex; gap:8px; align-items:center; margin-top:8px; background:#FFF4E6; border:1px solid #f3c98a; border-radius:8px; padding:6px 12px; ${F} font-size:11px; color:#6b4a1a;"><span style="font-weight:800; color:#EF7D00;">⚠</span><span><strong>Patient à jeun 4 h</strong> au moins avant l'examen — <strong>6 h si anesthésie générale</strong>. Adresser le malade avec son dossier : bilan de coagulation, consultation AG, dossier médical, de soins, radiologique.</span></div>` +
    identiteDemandeur(o, ctx) +
    fbox(boxTitle("Examen demandé") + `<div style="padding:6px 10px 8px; ${F} font-size:12px; font-weight:600; color:#0d2b45; min-height:26px;">${esc(o.examen || "")}</div>`, "margin-top:8px;") +
    fbox(boxTitle("Bilan de coagulation (indispensable, récent)") + `<div style="padding:5px 10px 8px; ${F} font-size:11px; line-height:1.6;">
      <div style="display:flex; gap:12px;"><span style="flex:1;">${fline("Date :", esc(o.bilanDate || ""))}</span><span style="flex:1;">${fline("TP :", esc(o.tp || ""))}</span><span style="flex:1;">${fline("Plaquettes :", esc(o.plaquettes || ""))}</span></div>
      <div style="margin-top:3px;"><strong>Traitement anticoagulant :</strong> ${on3(o.antico)} &nbsp;&nbsp;·&nbsp; <strong>Anti-agrégants plaquettaires :</strong> ${on3(o.antiagreg)}</div>
    </div>`, "margin-top:8px;") +
    fbox(boxTitle("Consultation AG") + `<div style="padding:5px 10px 8px; ${F} font-size:11px; line-height:1.6;">
      <div style="color:#4a5b68; font-size:10px;">Consultation d'anesthésie <strong>48 h avant</strong> tous les gestes suivants : drainage et prothèse biliaire, radiofréquence, alcoolisation, TIPS, chimio-embolisation.</div>
      <div style="margin-top:3px;"><strong>Geste prévu sous AG :</strong> ${on3(o.ag)} &nbsp; ${inline("Date de la consultation AG :", esc(o.agDate || ""), 80)}</div>
    </div>`, "margin-top:8px;") +
    fbox(boxTitle("Injection d'un produit de contraste iodé") + `<div style="padding:5px 10px 8px; ${F} font-size:11px; line-height:1.6;">
      <div><strong>Réaction sévère lors d'une injection de PCI :</strong> ${on3(o.reactionPci)} &nbsp;·&nbsp; <strong>Asthme non équilibré</strong> (crise < 8 j) : ${on3(o.asthme)}</div>
      <div style="margin-top:3px;"><strong>Diabète :</strong> ${on3(o.diabete)} <span style="color:#4a5b68; font-size:10px;">(si METFORMINE : arrêt 48 h avant, reprise 48 h après)</span> &nbsp;·&nbsp; <strong>Bêta-bloquants :</strong> ${on3(o.betabloquants)}</div>
      <div style="margin-top:3px;"><strong>Insuffisance rénale :</strong> ${on3(o.ir)} &nbsp; ${inline("Créatininémie :", o.creat, 60)} µmol/L &nbsp; ${chk(!!o.dialyse)} Patient dialysé</div>
    </div>`, "margin-top:8px;") +
    fbox(boxTitle("But de l'examen et contexte clinique") + `<div style="padding:6px 10px 8px; ${F} font-size:11.5px; min-height:60px; white-space:pre-wrap; line-height:1.5;">${esc(o.indications || "")}</div>`, "margin-top:8px;") +
    cadreReserve(`Rendez-vous donné — ${inline("le :", "", 90)} &nbsp; ${inline("à :", "", 60)} h`) + NB_LINE;
  return demandeSection(body, titre);
}

const TEP_CADRE = [["amm", "Conforme AMM"], ["sor", "Standard des SOR"], ["option_sor", "Option des SOR"], ["ucp", "Décision des UCP"], ["recherche", "Recherche"]];
const TEP_LOC = [["sein", "Sein"], ["orl", "ORL"], ["colorectale", "Colo-rectale"], ["primitif", "Recherche de primitif"], ["ovaire", "Ovaire"], ["hemopathie", "Hémopathie"], ["poumon", "Poumon"], ["thyroide", "Thyroïde"], ["seminome", "Séminome"], ["autre", "Autre"]];
const TEP_INTERET = [["diagnostic", "Diagnostic de malignité"], ["stadification", "Stadification"], ["surveillance", "Surveillance de l'efficacité du traitement"], ["recidive_syst", "Recherche systématique de récidive"], ["image_anormale", "Image anormale ou douteuse en imagerie"], ["masse_residuelle", "Masse résiduelle"], ["marqueur", "Élévation isolée du marqueur"], ["preop_recidive", "Bilan pré-opératoire d'une récidive connue"], ["autre", "Autre"]];

/** TEP-TDM (médecine nucléaire — Gui de Chauliac). */
function renderDemandeTep(o, ctx) {
  const titre = IMAGERIE_TITRES.tep;
  const p = ctx.patient;
  const med = ctx.medecin;
  const multi = (list, sel) => list.map(([k, l]) => `<div style="display:flex; gap:6px; align-items:baseline; margin-top:2px;">${chk((sel || []).includes(k))}<span>${l}</span></div>`).join("");
  const body = `
  <div style="text-align:center; ${F}">
    <div style="font-weight:800; font-size:15px; color:#0d2b45;">MÉDECINE NUCLÉAIRE — Hôpital Gui de Chauliac</div>
    <div style="font-size:10.5px; color:#4a5b68;">80 av. Augustin Fliche — 34295 Montpellier Cedex 5 · Tél 04 67 33 02 06</div>
    <div style="display:inline-block; font-weight:800; font-size:15px; color:#0d2b45; border-bottom:3px solid #EF7D00; padding-bottom:3px; margin-top:8px;">${titre}</div>
    <div style="font-size:11px; color:#C0392B; font-weight:700; margin-top:3px;">À faxer au 04 67 33 69 22 — Date de la demande : ${ctx.dateDoc ? esc(frDate(ctx.dateDoc)) : "____ / ____ / 20____"}</div>
  </div>
  <div style="display:flex; gap:10px; margin-top:8px;">
    ${fbox(boxTitle("Patient") + `<div style="padding:4px 10px 7px; ${F} font-size:10.5px;">
      ${fline("Nom :", p?.nom ? esc(p.nom.toUpperCase()) : "")}
      ${fline("Prénom :", esc(p?.prenom || ""))}
      <div style="display:flex; gap:10px;"><span style="flex:1;">${fline("Né(e) le :", p?.ddn ? esc(frDate(p.ddn)) : "")}</span><span style="flex:1;">${fline("Tél :", esc(o.telPatient || ""))}</span></div>
      ${fline("Adresse :", "")}
      <div style="margin-top:4px;">${chk(o.statut !== "externe")} Patient hospitalisé (CHU de Montpellier) &nbsp;&nbsp;${chk(o.statut === "externe")} Patient externe</div>
    </div>`, "flex:1;")}
    ${fbox(boxTitle("Médecin demandeur") + `<div style="padding:4px 10px 7px; ${F} font-size:10.5px;">
      ${fline("Identité :", med ? esc(med.nom) : "")}
      ${fline("Spécialité :", med ? esc(med.specialite || "Hépato-Gastroentérologie") : "")}
      ${fline("Adresse :", "CHU de Montpellier — Hôpital Saint-Éloi")}
      <div style="display:flex; gap:10px;"><span style="flex:1;">${fline("Tél :", esc(med?.tel || ""))}</span><span style="flex:1;">${fline("Fax :", esc(med?.fax || ""))}</span></div>
      ${fline("E-mail :", esc(med?.mail || ""))}
    </div>`, "flex:1;")}
  </div>
  <div style="display:flex; gap:10px; margin-top:8px;">
    ${fbox(boxTitle("Cadre de prescription") + `<div style="padding:3px 10px 7px; ${F} font-size:10.5px;">${multi(TEP_CADRE, o.cadre ? [o.cadre] : [])}</div>`, "flex:1;")}
    ${fbox(boxTitle("Localisation") + `<div style="padding:3px 10px 7px; ${F} font-size:10.5px;">${multi(TEP_LOC, o.localisation)}${o.localisationAutre ? `<div style="margin-top:2px; font-weight:600;">→ ${esc(o.localisationAutre)}</div>` : ""}</div>`, "flex:1;")}
    ${fbox(boxTitle("Intérêt de la TEP") + `<div style="padding:3px 10px 7px; ${F} font-size:10.5px;">${multi(TEP_INTERET, o.interet)}</div>`, "flex:1.2;")}
  </div>
  ${fbox(`<div style="padding:5px 10px 7px; ${F} font-size:10.5px;">
    <div><strong>TEP déjà réalisée :</strong> ${on3(o.tepDeja)} &nbsp; ${inline("Si oui, date et lieu :", esc(o.tepDejaDetail || ""), 160)}</div>
  </div>`, "margin-top:8px;")}
  ${fbox(boxTitle("Histologie et commentaires") + `<div style="padding:5px 10px 8px; ${F} font-size:11px; min-height:44px; white-space:pre-wrap; line-height:1.5;">${esc(o.indications || "")}</div>`, "margin-top:8px;")}
  ${fbox(boxTitle("Traitements antérieurs & stratégie") + `<div style="padding:4px 10px 7px; ${F} font-size:10.5px; line-height:1.6;">
    <div>${chk(!!o.ttAucun)} Aucun &nbsp;·&nbsp; ${inline("Chirurgie tumorale — date :", esc(o.ttChirurgie || ""), 70)} &nbsp;·&nbsp; ${inline("Chimiothérapie — dernière cure :", esc(o.ttChimio || ""), 70)} &nbsp;·&nbsp; ${inline("Radiothérapie — dernière séance :", esc(o.ttRadio || ""), 70)}</div>
    <div style="margin-top:3px;"><strong>Stratégie thérapeutique avant TEP :</strong> ${[["radiotherapie", "Radiothérapie"], ["chirurgie", "Chirurgie"], ["chimiotherapie", "Chimiothérapie"], ["surveillance", "Surveillance"]].map(([k, l]) => `${chk((o.strategie || []).includes(k))} ${l}`).join("&nbsp;&nbsp;")}</div>
  </div>`, "margin-top:8px;")}
  ${fbox(`<div style="padding:5px 10px 7px; ${F} font-size:10.5px; line-height:1.6;">
    <div>${inline("Poids :", esc(o.poids || ""), 45)} kg &nbsp;·&nbsp; ${inline("Taille :", esc(o.taille || ""), 45)} cm &nbsp;·&nbsp; <strong>Diabète :</strong> ${chk(o.diabete === "oui")} OUI ${chk(o.diabete !== "oui")} NON &nbsp; ${inline("si oui, glycémie à jeun :", esc(o.glycemie || ""), 55)}</div>
    <div style="margin-top:3px;"><strong>Grossesse :</strong> ${chk(o.grossesse === "oui")} OUI ${chk(o.grossesse !== "oui")} NON &nbsp;·&nbsp; <strong>Allaitement :</strong> ${chk(o.allaitement === "oui")} OUI ${chk(o.allaitement !== "oui")} NON</div>
    ${fline("Pathologie infectieuse ? Préciser :", esc(o.pathoInf || ""))}
    ${fline("Chirurgie non oncologique (localisation et date) :", esc(o.chirNonOnco || ""))}
    ${fline("Date ou délai du rendez-vous souhaité :", esc(o.dateSouhaitee || ""))}
  </div>`, "margin-top:8px;")}
  ${fbox(`<div style="padding:5px 10px 7px; ${F} font-size:10.5px; color:#4a5b68;">RDV FIXÉ LE ${inline("", "", 90)} à ${inline("", "", 45)} h — heure d'arrivée du patient dans le service</div>`, "margin-top:8px; break-inside:avoid;")}`;
  return demandeSection(body, "Demande TEP-TDM · Médecine nucléaire");
}

/** Point d'entrée demandes d'imagerie. */
export function renderDemandeImagerie(kind, o, ctx) {
  if (kind === "echo" || kind === "radio") return renderDemandeEchoRadio(kind, o, ctx);
  if (kind === "tdm") return renderDemandeTdm(o, ctx);
  if (kind === "irm") return renderDemandeIrm(o, ctx);
  if (kind === "interv") return renderDemandeInterv(o, ctx);
  if (kind === "tep") return renderDemandeTep(o, ctx);
  throw new Error("Type de demande inconnu : " + kind);
}

// ---------------------------------------------------------------------------
// Fiches régimes (brief HGE — trame fixe : entête patient, badge de niveau,
// pourquoi, principes, journée type, tableau vert/rouge, vigilance, erreurs)
// ---------------------------------------------------------------------------

export function findRegime(id) {
  for (const c of REGIMES) {
    const f = c.items.find((i) => i.id === id);
    if (f) return { ...f, cat: c.cat };
  }
  return null;
}

export function renderRegime(id, ctx) {
  const f = findRegime(id);
  if (!f) throw new Error("Fiche régime inconnue : " + id);
  const med = ctx.medecin;
  const p = ctx.patient;
  const N = REGIME_NIVEAUX[f.niveau];

  // ---- entête personnalisé
  const qui = p && (p.nom || p.prenom)
    ? `${p.civ ? esc(p.civ) + " " : ""}<strong>${esc(patientNom(p))}</strong>`
    : "Madame, Monsieur";
  const doc = med ? `votre gastroentérologue, le <strong>${esc(med.nom)}</strong>,` : "votre gastroentérologue";
  const entete = `<div style="background:#EAF3FB; border-radius:10px; padding:12px 16px; margin-top:12px; ${F} font-size:13px; color:#1c3a52; line-height:1.55;">
    ${qui}, ${doc} vous a prescrit le régime décrit ci-dessous. Cette fiche vous explique <strong>pourquoi</strong>, <strong>comment le suivre</strong> et <strong>ce que vous pouvez manger</strong>. Elle ne remplace pas les conseils personnalisés de votre médecin ou de votre diététicien(ne).
  </div>`;

  // ---- badge de contrainte (l'élément pédagogique central)
  const badge = `<div style="border:2.5px solid ${N.border}; background:${N.bg}; border-radius:12px; margin-top:12px; padding:11px 16px; break-inside:avoid; ${F}">
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="font-size:20px; flex:none;">${N.badge}</span>
      <span style="${FC} text-transform:uppercase; letter-spacing:.05em; font-weight:800; font-size:16px; color:${N.color};">Niveau ${f.niveau} — ${N.label}</span>
    </div>
    <div style="font-size:12.5px; color:#1c3a52; margin-top:5px; line-height:1.5;">${N.sens}</div>
    <div style="font-size:12px; color:${N.color}; margin-top:5px; line-height:1.5;"><strong>Conséquence d'un écart :</strong> <em>${f.ecart || N.ecart}</em></div>
    ${f.niveauNote ? `<div style="font-size:11.5px; color:#4a5b68; margin-top:5px;">${esc(f.niveauNote)}</div>` : ""}
  </div>`;

  const h2 = (t, color = "#0072BC", hc = "#0d2b45") => `<div style="display:flex; align-items:center; gap:9px; margin-top:16px;"><span style="flex:none; width:5px; height:17px; border-radius:2px; background:${color};"></span><h2 style="${F} font-weight:700; font-size:15.5px; color:${hc}; margin:0; line-height:1.15;">${t}</h2></div>`;

  // ---- composants génériques (texte + puces + numéros)
  const txt = (t, size = "12.5px") => t ? `<div style="${F} font-size:${size}; color:#1c3a52; line-height:1.55; margin-top:7px;">${t}</div>` : "";
  const puces = (items) => (items || []).map((li) =>
    `<div style="display:flex; gap:9px; margin-top:5px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.5;"><span style="flex:none; width:6px; height:6px; border-radius:50%; background:#0072BC; margin-top:6px;"></span><div style="flex:1;">${li}</div></div>`).join("");
  const etapes = (items) => (items || []).map((li, i) =>
    `<div style="display:flex; gap:10px; margin-top:6px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.5;"><span style="flex:none; width:20px; height:20px; border-radius:50%; background:#0072BC; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-weight:800; font-size:11.5px;">${i + 1}</span><div style="flex:1; padding-top:1px;">${li}</div></div>`).join("");
  const generic = (s) => txt(s.text) + puces(s.items);

  // ---- table générique (menu de la semaine, substitutions…)
  const tableGen = (s, compact = false) => {
    const head = s.head
      ? `<thead><tr>${s.head.map((h, i) => `<th style="padding:6px 9px; background:#0072BC; color:#fff; font-size:${compact ? "10.5px" : "11.5px"}; text-align:left; ${i === 0 ? "width:1%; white-space:nowrap;" : ""}">${esc(h)}</th>`).join("")}</tr></thead>`
      : "";
    const body_ = s.rows.map((r, ri) => `<tr>${r.map((c, i) => `<td style="padding:5px 9px; font-size:${compact ? "10.5px" : "11.5px"}; border-top:1px solid #e3ebf2; background:${ri % 2 ? "#ffffff" : "#f4f8fc"}; color:#1c3a52; ${i === 0 ? "font-weight:700; color:#0d2b45; white-space:nowrap;" : ""} line-height:1.4;">${c}</td>`).join("")}</tr>`).join("");
    return `<table style="width:100%; border-collapse:collapse; margin-top:8px; ${F} border:1px solid #cfe1f0; border-radius:8px; overflow:hidden; break-inside:avoid;">${head}<tbody>${body_}</tbody></table>`;
  };

  // ---- sections ordonnées comme dans le brief (mise en page = charte v2)
  const SEC = {
    pourquoi: (s) => h2("Pourquoi ce régime ?") + generic(s),
    principes: (s) => h2("Le principe en 3 idées") + txt(s.text) + puces(s.items),
    demarrer: (s) => h2("🚀 Je démarre") + txt(s.text) + etapes(s.items),
    portions: (s) => h2("⚖️ Portions repères") +
      `<div style="${F} font-size:12.5px; color:#1c3a52; line-height:1.55; margin-top:7px; border:1px solid #cfe1f0; background:#f8fbfd; border-radius:10px; padding:9px 14px;">${s.text || ""}${puces(s.items)}</div>`,
    menu: (s) => h2(`📅 ${s.note ? esc(s.note) : "Menu de la semaine"}`) + (s.rows ? tableGen(s, true) : generic(s)),
    options: (s) => h2("🔁 Pour varier — options par repas") + generic(s),
    recettes: (s) => h2(`👨‍🍳 ${s.note ? esc(s.note) : "Recettes express"}`) + generic(s),
    batch: (s) => h2("🍱 Batch cooking — préparer à l'avance") + generic(s),
    collations: (s) => h2("🍎 Collations") + generic(s),
    substitutions: (s) => h2(`Substitutions malines${s.note ? " — " + esc(s.note) : ""}`) + (s.rows ? tableGen(s) : generic(s)),
    tab: (s) => {
      if (!s.ok) return h2("Ce que vous pouvez manger / ce qu'il faut éviter") + generic(s); // pas de tableau (ex. protocole CDED)
      const rowsN = Math.max(s.ok.length, s.ko.length);
      let rows = "";
      for (let i = 0; i < rowsN; i++) {
        rows += `<tr>
          <td style="padding:5px 12px; font-size:12px; border-top:1px solid #d6e8dc; background:#F4FBF6; color:#1c3a52; width:50%;">${s.ok[i] || ""}</td>
          <td style="padding:5px 12px; font-size:12px; border-top:1px solid #f0d4cf; background:#FDF4F2; color:#1c3a52; width:50%;">${s.ko[i] || ""}</td>
        </tr>`;
      }
      return h2(`Ce que vous pouvez manger / ce qu'il faut éviter${s.note ? " (" + esc(s.note) + ")" : ""}`) +
        `<table style="width:100%; border-collapse:collapse; margin-top:8px; ${F} border:1px solid #cfe1f0; border-radius:8px; overflow:hidden;">
          <thead><tr>
            <th style="padding:7px 12px; background:#146c3a; color:#fff; font-size:12.5px; text-align:left;">✅ ${esc(s.okT || "Autorisés / conseillés")}</th>
            <th style="padding:7px 12px; background:#a5271a; color:#fff; font-size:12.5px; text-align:left;">⛔ ${esc(s.koT || "À éviter / exclure")}</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    },
    courses: (s) => h2("🛒 Liste de courses de la semaine") +
      `<div style="${F} font-size:12px; color:#1c3a52; line-height:1.6; margin-top:7px; border:1.5px dashed #9db4c6; border-radius:10px; padding:9px 14px;">${s.text || ""}${puces(s.items)}</div>`,
    deplacement: (s) => h2("🧳 En déplacement, au restaurant") + generic(s),
    pieges: (s) => h2("⚠️ Pièges à éviter", "#EF7D00") + generic(s),
    vigilance: (s) => h2("À surveiller · durée · quand consulter", "#EF7D00") +
      `<div style="background:#FFF4E6; border:1px solid #f3c98a; border-radius:10px; padding:9px 14px; margin-top:7px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.55;">${s.text || ""}${puces(s.items)}</div>`,
    erreur: (s) => `<div style="background:#FCECEA; border:2px solid #C0392B; border-radius:10px; padding:10px 14px; margin-top:14px; break-inside:avoid; ${F}">
        <div style="${FC} text-transform:uppercase; letter-spacing:.04em; font-weight:800; color:#C0392B; font-size:13px;">⛔ Fausse bonne idée</div>
        <div style="font-size:12.5px; color:#1c3a52; margin-top:4px; line-height:1.55;">${s.text || ""}</div>
      </div>`,
    retenir: (s) => `<div style="border:1.5px solid #0072BC; background:#EAF3FB; border-radius:10px; padding:9px 14px; margin-top:12px; break-inside:avoid; ${F} font-size:13px; color:#0d2b45;"><strong>À retenir —</strong> ${s.text || ""}${puces(s.items)}</div>`,
    libre: (s) => h2(esc(s.note || "Informations complémentaires")) + generic(s) + (s.rows ? tableGen(s) : ""),
  };
  const sections = f.secs.map((s) => (SEC[s.k] || SEC.libre)(s)).join("");

  const mention = `<div style="${F} font-size:9.5px; color:#7a8794; margin-top:16px; line-height:1.5; border-top:1px solid #e3ebf2; padding-top:8px;">Cette fiche d'information a été rédigée par le Dr Antoine Debourdeau, gastroentérologue${med && med.nom !== "Dr Antoine DEBOURDEAU" ? ", et remise par " + esc(med.nom) : ""}. Elle est personnalisée à votre situation et ne remplace ni une consultation, ni les conseils d'un(e) diététicien(ne). En cas de doute, de symptôme nouveau ou inhabituel (amaigrissement, sang, douleur intense, fièvre, vomissements), <strong>contactez votre médecin</strong>.</div>`;

  const body = `<div style="${F}">
    <div style="${FC} text-transform:uppercase; letter-spacing:.08em; color:#0072BC; font-weight:700; font-size:13px;">Fiche régime — ${esc(f.cat)}</div>
    <h1 style="font-weight:800; color:#0d2b45; font-size:24px; line-height:1.1; margin:4px 0 0; text-wrap:balance;">${esc(f.name)}</h1>
    <div style="height:3px; width:64px; background:#EF7D00; border-radius:2px; margin-top:10px;"></div>
  </div>` + entete + badge + sections + mention;

  const fakeDoc = { service: "endoscopie" };
  const footer = `<div style="display:flex; justify-content:space-between; align-items:center; ${F} font-size:9px; color:#7a8794; border-top:1px solid #d9e2ea; padding-top:5px;">
    <span>CHU de Montpellier — Hépato-Gastroentérologie · Doc'HGE</span>
    <span style="${FC} letter-spacing:.05em; text-transform:uppercase; color:#0072BC; font-weight:600;">Fiche régime · ${esc(f.cat)}</span>
  </div>`;
  return `<section class="doc">
    <table class="frame">
      <thead><tr><td><div class="hdr">${noteHeader(fakeDoc, ctx)}</div></td></tr></thead>
      <tbody><tr><td class="bodycell">${body}</td></tr></tbody>
      <tfoot><tr><td><div class="ftr">${footer}</div></td></tr></tfoot>
    </table>
  </section>`;
}

// ---------------------------------------------------------------------------
// Fiches d'éducation thérapeutique v2 (brief détaillé) — sections typées par
// emoji ; carte feu tricolore = pièce de sécurité centrale.
// ---------------------------------------------------------------------------

export function findEtp(id) {
  for (const a of ETP) {
    const f = a.items.find((i) => i.id === id);
    if (f) return { ...f, axe: a.axe };
  }
  return null;
}

function etpH2(t, color = "#0072BC", hc = "#0d2b45") {
  return `<div style="display:flex; align-items:center; gap:9px; margin-top:15px; break-inside:avoid;"><span style="flex:none; width:5px; height:17px; border-radius:2px; background:${color};"></span><h2 style="${F} font-weight:700; font-size:15px; color:${hc}; margin:0; line-height:1.15;">${t}</h2></div>`;
}
const etpLi = (t, accent = "#0072BC") =>
  `<div style="display:flex; gap:9px; margin-top:5px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.5;"><span style="flex:none; width:6px; height:6px; border-radius:50%; background:${accent}; margin-top:6px;"></span><div style="flex:1;">${t}</div></div>`;
const chkLine = (t) =>
  `<div style="display:flex; gap:9px; margin-top:6px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.5;"><span style="flex:none; width:13px; height:13px; border:1.5px solid #0072BC; border-radius:3px; margin-top:2px;"></span><div style="flex:1;">${t}</div></div>`;
const etpParas = (s) => (s.paras || []).map((p) => `<div style="${F} font-size:12.5px; color:#1c3a52; line-height:1.55; margin-top:7px;">${p}</div>`).join("");

function carteFeu(t, feu) {
  const row = (emoji, titre, items, color, bg) => items && items.length
    ? `<div style="display:flex; gap:10px; background:${bg}; padding:8px 12px; border-top:1px solid #fff;">
        <span style="flex:none; font-size:16px;">${emoji}</span>
        <div style="flex:1;">
          <div style="${FC} text-transform:uppercase; letter-spacing:.04em; font-weight:800; font-size:11.5px; color:${color};">${titre}</div>
          ${items.map((i) => `<div style="${F} font-size:12px; color:#1c3a52; line-height:1.5; margin-top:2px;">${i}</div>`).join("")}
        </div>
      </div>` : "";
  return `<div style="border:2px solid #0d2b45; border-radius:12px; overflow:hidden; margin-top:14px; break-inside:avoid;">
    <div style="background:#0d2b45; color:#fff; padding:7px 14px; ${F} font-weight:700; font-size:13.5px;">🚦 ${t}</div>
    ${row("🟢", "Tout va bien — je continue", feu.v, "#146c3a", "#E6F4EC")}
    ${row("🟠", "Je surveille / je prends conseil", feu.o, "#b35a00", "#FFF4E6")}
    ${row("🔴", "J'appelle / je vais aux urgences", feu.r, "#a5271a", "#FCECEA")}
  </div>`;
}

function renderEtpSection(s) {
  switch (s.e) {
    case "🎯":
      return etpH2("🎯 " + s.t) + etpParas(s) + (s.items || []).map((o) => chkLine(o)).join("");
    case "🧠":
      return etpH2("🧠 " + s.t) + etpParas(s) + (s.items || []).map((i) => etpLi(i)).join("");
    case "🩺":
      return etpH2("🩺 " + s.t) +
        `<div style="border:1px solid #cfe1f0; border-radius:10px; padding:8px 12px 10px; margin-top:7px; break-inside:avoid;">${etpParas(s)}${(s.items || []).map((i) => etpLi(i)).join("")}</div>`;
    case "🚦":
      return carteFeu(s.t, s.feu || { v: [], o: [], r: [] });
    case "💊":
      return `<div style="border:1.5px solid #0072BC; background:#EAF3FB; border-radius:10px; padding:9px 14px; margin-top:14px; break-inside:avoid;">
        <div style="${FC} text-transform:uppercase; letter-spacing:.04em; font-weight:800; color:#0072BC; font-size:12px;">💊 ${s.t}</div>
        ${etpParas(s)}${(s.items || []).map((i) => etpLi(i)).join("")}</div>`;
    case "🌱":
      return etpH2("🌱 " + s.t, "#146c3a") + etpParas(s) + (s.items || []).map((i) => etpLi(i, "#146c3a")).join("");
    case "❌":
      return etpH2("❌ " + s.t, "#C0392B", "#a5271a") +
        (s.mythes || []).map((m) => `<div style="display:flex; gap:0; border:1px solid #f0d4cf; border-radius:9px; overflow:hidden; margin-top:6px; break-inside:avoid;">
          <div style="flex:1; background:#FDF0EE; padding:7px 11px; ${F} font-size:12px; color:#8f2419; line-height:1.45;">${m.m}</div>
          <div style="flex:1.2; background:#F4FBF6; padding:7px 11px; ${F} font-size:12px; color:#14532d; line-height:1.45;">${m.r}</div>
        </div>`).join("");
    case "❓":
      return etpH2("❓ " + s.t) + etpParas(s) + (s.items || []).map((i) => etpLi(i)).join("");
    case "✅": {
      const items = s.quiz || [];
      const reponses = items.map((q, i) => `${i + 1} : ${q.a || "—"}`).join(" · ");
      return etpH2("✅ " + s.t, "#146c3a") +
        items.map((q, i) => `<div style="display:flex; gap:9px; margin-top:6px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.5;">
          <span style="flex:none; font-weight:700; color:#0072BC;">${i + 1}.</span>
          <div style="flex:1;">${q.q} ${q.note ? `<span style="color:#4a5b68; font-size:11px;">${q.note}</span>` : ""}</div>
          <span style="flex:none; color:#4a5b68;">☐ Vrai&nbsp; ☐ Faux</span>
        </div>`).join("") +
        `<div style="${F} font-size:9.5px; color:#9aa8b4; margin-top:6px;">Réponses : ${reponses}</div>`;
    }
    case "🪜": {
      let out = etpH2("🪜 Ma progression par paliers — je ne passe au suivant qu'après le critère de réussite", "#EF7D00");
      (s.paliers || []).forEach((pal, i) => {
        out += `<div style="border:1px solid #cfe1f0; border-radius:12px; overflow:hidden; margin-top:10px; break-inside:avoid;">
          <div style="background:#0072BC; color:#fff; padding:7px 14px; display:flex; align-items:center; gap:10px;">
            <span style="flex:none; width:26px; height:26px; border-radius:50%; background:#fff; color:#0072BC; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center;">${i + 1}</span>
            <span style="${F} font-weight:700; font-size:14px;">${pal.t}</span>
          </div>
          <div style="padding:9px 14px; ${F} font-size:12.5px; color:#1c3a52; line-height:1.55;">
            ${pal.obj ? `<div><strong>🎯 Micro-objectif :</strong> ${pal.obj}</div>` : ""}
            ${pal.comment ? `<div style="margin-top:5px;"><strong>Comment faire :</strong> ${pal.comment}</div>` : ""}
            ${pal.freq ? `<div style="margin-top:5px;"><strong>Fréquence :</strong> ${pal.freq}</div>` : ""}
            ${pal.critere ? `<div style="margin-top:6px; background:#E6F4EC; border-radius:8px; padding:6px 10px; color:#146c3a;"><strong>✅ Je passe au palier suivant quand :</strong> ${pal.critere}</div>` : ""}
          </div>
        </div>`;
      });
      return out;
    }
    case "⚠️":
      return `<div style="background:#FCECEA; border:2px solid #C0392B; border-radius:10px; padding:9px 14px; margin-top:12px; break-inside:avoid;">
        <div style="${FC} text-transform:uppercase; letter-spacing:.04em; font-weight:800; color:#C0392B; font-size:12.5px;">⛔ ${s.t}</div>
        ${etpParas(s)}${(s.items || []).map((i) => etpLi(i, "#C0392B")).join("")}</div>`;
    case "📈":
      return `<div style="background:#E6F4EC; border:1px solid #b7dfc6; border-radius:10px; padding:8px 12px; margin-top:10px; ${F} font-size:12px; color:#14532d;"><strong>📈 ${s.t} :</strong> ${(s.paras || []).join(" ")}${(s.items || []).join(" ")}</div>`;
    case "🧭":
      return `<div style="background:#FFF4E6; border:1px solid #f3c98a; border-radius:10px; padding:8px 12px; margin-top:10px; ${F} font-size:12px; color:#6b4a1a;"><strong>🧭 ${s.t} :</strong> ${(s.paras || []).join(" ")}${(s.items || []).join(" ")}</div>`;
    case "🗓": {
      const desc = [(s.paras || []).join(" "), (s.items || []).join(" ")].filter(Boolean).join(" ");
      let rows = "";
      for (let sem = 1; sem <= 2; sem++) {
        rows += `<tr><td colspan="3" style="padding:4px 8px; background:#EAF3FB; ${FC} text-transform:uppercase; font-size:10px; font-weight:700; color:#0072BC;">Semaine ${sem}</td></tr>`;
        for (const j of ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"])
          rows += `<tr><td style="padding:4px 8px; font-size:11px; border-top:1px solid #e3ebf2; color:#4a5b68; width:44px;">${j}</td><td style="border-top:1px solid #e3ebf2; border-left:1px solid #eef3f8; width:90px;">&nbsp;</td><td style="border-top:1px solid #e3ebf2; border-left:1px solid #eef3f8;">&nbsp;</td></tr>`;
      }
      return etpH2("🗓 Mon journal de bord") +
        `<div style="${F} font-size:11.5px; color:#4a5b68; margin-top:5px;">${desc}</div>
        <table style="width:100%; border-collapse:collapse; margin-top:8px; ${F} border:1px solid #cfe1f0;">
          <tr><th style="padding:5px 8px; background:#0d2b45; color:#fff; font-size:10.5px; text-align:left;">Jour</th><th style="padding:5px 8px; background:#0d2b45; color:#fff; font-size:10.5px; text-align:center;">Fait ✓</th><th style="padding:5px 8px; background:#0d2b45; color:#fff; font-size:10.5px; text-align:left;">Observations</th></tr>
          ${rows}
        </table>
        <div style="${F} font-size:10px; color:#7a8794; margin-top:4px;">Photocopiez ou réimprimez cette page pour les semaines suivantes.</div>`;
    }
    case "🔗":
      return `<div style="${F} font-size:10.5px; color:#7a8794; margin-top:10px;">🔗 ${s.t ? s.t + " : " : "Voir aussi : "}${(s.paras || []).join(" ")}${(s.items || []).join(" · ")}</div>`;
    default:
      return etpH2(`${s.e} ${s.t}`) + etpParas(s) + (s.items || []).map((i) => etpLi(i)).join("");
  }
}

export function renderEtp(id, ctx) {
  const f = findEtp(id);
  if (!f) throw new Error("Fiche ETP inconnue : " + id);
  const med = ctx.medecin;
  const p = ctx.patient;

  const qui = p && (p.nom || p.prenom)
    ? `${p.civ ? esc(p.civ) + " " : ""}<strong>${esc(patientNom(p))}</strong>`
    : "Madame, Monsieur";
  const doc = med ? `votre gastroentérologue, le <strong>${esc(med.nom)}</strong>` : "votre gastroentérologue";

  let body = `<div style="${F}">
    <div style="${FC} text-transform:uppercase; letter-spacing:.08em; color:#0072BC; font-weight:700; font-size:13px;">${f.type === "livret" ? "Livret de rééducation" : "Éducation thérapeutique"} — ${esc(f.axe)}</div>
    <h1 style="font-weight:800; color:#0d2b45; font-size:23px; line-height:1.1; margin:4px 0 0; text-wrap:balance;">${esc(f.name)}</h1>
    <div style="height:3px; width:64px; background:#EF7D00; border-radius:2px; margin-top:10px;"></div>
  </div>
  <div style="background:#EAF3FB; border-radius:10px; padding:12px 16px; margin-top:12px; ${F} font-size:13px; color:#1c3a52; line-height:1.55;">
    ${qui}, cette fiche a été préparée pour vous par ${doc}. Elle vous aide à <strong>comprendre</strong>, à <strong>vous surveiller</strong> et à <strong>savoir réagir</strong>. Elle complète — sans les remplacer — les explications données en consultation.
  </div>`;

  const hasQuiz = f.secs.some((s) => s.e === "✅");
  for (const s of f.secs) body += renderEtpSection(s);

  // auto-évaluation générée si absente (à partir des objectifs)
  if (!hasQuiz) {
    const obj = f.secs.find((s) => s.e === "🎯");
    if (obj && obj.items) body += etpH2("✅ Ai-je bien compris ? — je coche quand c'est acquis", "#146c3a") +
      obj.items.map((o) => { let t = o.trim(); return chkLine("Je sais : " + t.charAt(0).toLowerCase() + t.slice(1)); }).join("");
  }

  // plan d'action
  const dot = (w) => `<span style="display:inline-block; min-width:${w}px; border-bottom:1px dotted #9db4c6;">&nbsp;</span>`;
  body += `<div style="border:1.5px solid #0072BC; border-radius:12px; overflow:hidden; margin-top:16px; break-inside:avoid;">
    <div style="background:#0d2b45; color:#fff; padding:7px 14px; ${F} font-weight:700; font-size:13.5px;">📋 Mon plan d'action personnalisé (rempli en consultation)</div>
    <div style="padding:10px 14px; ${F} font-size:12px; color:#1c3a52; line-height:2;">
      Mon objectif : ${dot(330)}<br>
      Mon traitement : ${dot(320)}<br>
      ${f.planTable ? `<table style="width:100%; border-collapse:collapse; margin:6px 0; font-size:11.5px;"><tr><th style="text-align:left; padding:3px 6px; background:#EAF3FB;">Molécule</th><th style="text-align:left; padding:3px 6px; background:#EAF3FB;">Dernière prise avant le geste</th><th style="text-align:left; padding:3px 6px; background:#EAF3FB;">Date de reprise</th><th style="text-align:left; padding:3px 6px; background:#EAF3FB;">Relais éventuel</th></tr>${"<tr>" + "<td style=\"border-top:1px solid #e3ebf2; padding:6px;\">&nbsp;</td>".repeat(4) + "</tr>"}${"<tr>" + "<td style=\"border-top:1px solid #e3ebf2; padding:6px;\">&nbsp;</td>".repeat(4) + "</tr>"}</table>` : ""}
      Prochains contrôles : ${dot(280)}<br>
      Numéros utiles : ${dot(300)}
    </div>
  </div>`;

  const nomAff = p ? `${p.civ ? esc(p.civ) + " " : ""}${esc(patientNom(p))}` : "vous";
  body += `<div style="${F} font-size:9.5px; color:#7a8794; margin-top:14px; line-height:1.5; border-top:1px solid #e3ebf2; padding-top:8px;">Ce document d'éducation thérapeutique a été préparé par le Dr Antoine Debourdeau, gastroentérologue${med && med.nom !== "Dr Antoine DEBOURDEAU" ? ", et remis par " + esc(med.nom) : ""}, pour ${nomAff}. Il ne remplace ni une consultation, ni une rééducation encadrée par un professionnel. En cas de doute, de symptôme nouveau ou d'aggravation (voir la carte 🔴), <strong>contactez votre médecin ou les urgences</strong>.</div>`;

  // placeholders d'illustration
  body = body.replace(/\{\{ILL:([^}]*)\}\}/g, (m, d2) =>
    `<span style="display:block; border:1.5px dashed #9db4c6; border-radius:10px; padding:8px 12px; margin:8px 0 2px; ${F} font-size:11px; color:#4a5b68; text-align:center;">🖼 Schéma expliqué en consultation : ${d2.trim()}</span>`);

  const footer = `<div style="display:flex; justify-content:space-between; align-items:center; ${F} font-size:9px; color:#7a8794; border-top:1px solid #d9e2ea; padding-top:5px;">
    <span>CHU de Montpellier — Hépato-Gastroentérologie · Doc'HGE</span>
    <span style="${FC} letter-spacing:.05em; text-transform:uppercase; color:#0072BC; font-weight:600;">${f.type === "livret" ? "Livret de rééducation" : "Éducation thérapeutique"} · ${esc(f.axe)}</span>
  </div>`;
  return `<section class="doc">
    <table class="frame">
      <thead><tr><td><div class="hdr">${noteHeader({ service: "endoscopie" }, ctx)}</div></td></tr></thead>
      <tbody><tr><td class="bodycell">${body}</td></tr></tbody>
      <tfoot><tr><td><div class="ftr">${footer}</div></td></tr></tfoot>
    </table>
  </section>`;
}

// ---------------------------------------------------------------------------
// Fiches illustrées (pages A4 à gabarit fixe) — chargées à la demande
// ---------------------------------------------------------------------------

let fichesModule = null;
export async function loadFiches() {
  if (!fichesModule) fichesModule = await import("./tpl-fiches.js");
  return fichesModule.FICHES;
}

export function ficheMedBlock(ctx) {
  const med = ctx.medecin;
  const style = `font-family:'Barlow','Segoe UI',system-ui,sans-serif;text-align:right;color:#4a5b68;font-size:8.5pt;line-height:1.4;`;
  const lines = med
    ? [
        `<div style="font-weight:700;color:#0d2b45;">${esc(med.nom)}</div>`,
        `<div>${esc(med.specialite || "Hépato-Gastroentérologie")}</div>`,
        med.tel ? `<div>Secrétariat : ${esc(med.tel)}</div>` : "",
        med.mail ? `<div>${esc(med.mail)}</div>` : `<div>Endoscopie digestive : 04 67 33 70 67</div>`,
      ]
    : [
        `<div style="font-weight:700;color:#0d2b45;">Service d'Hépato-Gastroentérologie</div>`,
        `<div>Endoscopie digestive</div>`,
        `<div>Tél. 04 67 33 70 67</div>`,
      ];
  return `<div style="${style}">${lines.join("")}</div>`;
}

/** Fiche illustrée (ags | gep) — async (module volumineux chargé à la demande). */
export async function renderFiche(key, ctx) {
  const FICHES = await loadFiches();
  const f = FICHES[key];
  if (!f) throw new Error(`Fiche inconnue : ${key}`);
  const bloc = ficheMedBlock(ctx);
  const pages = f.pages.map((p) => `<div class="fichepage">${p.replaceAll("@@FICHE_MED_BLOCK@@", bloc)}</div>`).join("");
  return `<section class="fiche">${pages}</section>`;
}

// ---------------------------------------------------------------------------
// Assemblage multi-documents
// ---------------------------------------------------------------------------

/**
 * items : [{type:"note", slug} | {type:"ordo", key} | {type:"fiche", key} | {type:"local", doc}]
 * Retourne le HTML complet à injecter dans #print-root.
 */
export async function assembleDocs(items, ctx) {
  const parts = [];
  for (const it of items) {
    if (it.type === "note") parts.push(renderNote(it.slug, ctx));
    else if (it.type === "local") parts.push(renderNote(it.doc, ctx));
    else if (it.type === "ordo") parts.push(renderOrdo(it.key, ctx));
    else if (it.type === "ordolibre") parts.push(renderOrdoLibre(it.opts, ctx));
    else if (it.type === "demande-endo") parts.push(renderDemandeEndoscopie(it.opts, ctx));
    else if (it.type === "demande-imagerie") parts.push(renderDemandeImagerie(it.kind, it.opts, ctx));
    else if (it.type === "regime") parts.push(renderRegime(it.key, ctx));
    else if (it.type === "etp") parts.push(renderEtp(it.key, ctx));
    else if (it.type === "fiche") parts.push(await renderFiche(it.key, ctx));
  }
  return parts.join("\n");
}
