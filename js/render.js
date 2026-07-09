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
      <div style="flex:none;"><span style="${FC} text-transform:uppercase; letter-spacing:.04em; color:#4a5b68; font-size:11px; font-weight:600;">Date</span><div style="border-bottom:1px solid #90a4b4; width:150px; height:22px;"></div></div>
      <div style="flex:1;"><span style="${FC} text-transform:uppercase; letter-spacing:.04em; color:#4a5b68; font-size:11px; font-weight:600;">Signature du patient${signMention}</span><div style="border-bottom:1px solid #90a4b4; height:44px;"></div></div>
      <div style="flex:1;"><span style="${FC} text-transform:uppercase; letter-spacing:.04em; color:#4a5b68; font-size:11px; font-weight:600;">Signature &amp; cachet du médecin</span><div style="border-bottom:1px solid #90a4b4; height:44px;"></div></div>
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
const RICH_ALLOWED = new Set(["B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "BR", "DIV", "P", "SPAN", "BLOCKQUOTE"]);
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
        for (const a of [...child.attributes]) child.removeAttribute(a.name);
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
      <div style="border-top:1px dashed #9db4c6; margin-top:40px; padding-top:5px; font-size:10.5px; color:#8a9aa8; text-align:center;">Signature et cachet du prescripteur</div>
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

  const ouinon = (v) => `${chk(v === "oui")} OUI&nbsp;&nbsp;&nbsp;${chk(v === "non")} NON`;
  const agBloc = `<div style="display:flex; gap:24px; margin-top:7px; ${F} font-size:11px; color:#1c3a52; align-items:baseline; flex-wrap:wrap;">
    <span><strong>Examen sous anesthésie générale :</strong> ${ouinon(o.ag)}</span>
    <span><strong>Informations délivrées au patient :</strong> ${ouinon(o.infosPatient)}</span>
    <span style="color:#4a5b68; font-size:10.5px;">Joindre le consentement éclairé du patient.</span>
  </div>`;

  const critRows = [
    ["imc", "IMC > 40 kg/m²"], ["htap", "HTAP > 50 mmHg"],
    ["fevg", "FEVG < 35 % ou assistance cardiaque"], ["htic", "HTIC"],
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
    <div style="display:flex; gap:10px;"><span style="flex:1.2;">${fline("Anticoagulation en cours ? Laquelle :", esc(o.antico || ""))}</span><span style="flex:1;">${fline("Stoppée ? Quand :", esc(o.anticoStop || ""))}</span></div>
    <div style="display:flex; gap:10px;"><span style="flex:1.2;">${fline("Anti-agrégation en cours ? Laquelle :", esc(o.antiagreg || ""))}</span><span style="flex:1;">${fline("Stoppée ? Quand :", esc(o.antiagregStop || ""))}</span></div>
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
    delaiHospit + examens + indications + agBloc + clinique + pted +
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
    else if (it.type === "fiche") parts.push(await renderFiche(it.key, ctx));
  }
  return parts.join("\n");
}
