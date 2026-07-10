// Extraction des modèles depuis le dossier source « prepa et infos ».
// Génère js/tpl-ordos.js (4 ordonnances+guides paramétrées) et js/tpl-fiches.js
// (2 fiches illustrées paramétrées). À relancer si les documents source changent.
//
// Tokens injectés (remplacés au rendu par render.js) :
//   @@MED_NOM@@        nom du médecin (ex. « Dr Antoine DEBOURDEAU »)
//   @@MED_SPEC@@       spécialité
//   @@MED_TEL_LINE@@   ligne secrétariat/fax du bloc prescripteur (ordonnance)
//   @@RPPS_BLOCK@@     code-barres + numéro RPPS (ou zone tampon si absent)
//   @@FINESS_BARCODE@@ code-barres FINESS (SVG généré)
//   @@PATIENT_BOX@@    encart patient (étiquette ou identité renseignée)
//   @@DATE_LINE@@      « Fait à Montpellier, le … »
//   @@FICHE_MED_BLOCK@@ bloc médecin en-tête des fiches illustrées

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "/Users/antoinedebourdeau/Downloads/prepa et infos";
const OUT = new URL("../js/", import.meta.url).pathname;

const must = (haystack, needle, file) => {
  if (!haystack.includes(needle)) {
    throw new Error(`Motif introuvable dans « ${file} » :\n${needle.slice(0, 120)}`);
  }
};

// ---------------------------------------------------------------- ordonnances
const ORDOS = [
  { key: "citrafleet", file: "Ordonnance et Guide Coloscopie.dc.html", product: "CITRAFLEET®" },
  { key: "moviprep", file: "Ordonnance et Guide Coloscopie - MOVIPREP.dc.html", product: "MOVIPREP®" },
  { key: "plenvu", file: "Ordonnance et Guide Coloscopie - PLENVU.dc.html", product: "PLENVU®" },
  { key: "ximepeg", file: "Ordonnance et Guide Coloscopie - XIMEPEG.dc.html", product: "XIMEPEG®" },
];

function extractOrdo({ key, file, product }) {
  const raw = readFileSync(join(SRC, file), "utf8");

  // Corps entre <x-import …> et </x-import>
  const open = raw.match(/<x-import[^>]*>/);
  const closeIdx = raw.lastIndexOf("</x-import>");
  if (!open || closeIdx < 0) throw new Error(`x-import introuvable : ${file}`);
  let html = raw.slice(open.index + open[0].length, closeIdx);

  // Tableau d'horaires : données du script → lignes statiques
  const dataMatch = raw.match(/const data = \[([\s\S]*?)\];/);
  if (!dataMatch) throw new Error(`data horaires introuvable : ${file}`);
  const data = JSON.parse("[" + dataMatch[1].replace(/,\s*$/, "").replace(/\n/g, "") + "]");
  const base = "padding:5px 10px; font-size:13px; border-top:1px solid #e3ebf2;";
  const rowsHtml = data
    .map(([colo, start, stop], i) => {
      const even = i % 2 === 0;
      return `<tr>
            <td style="${base}font-weight:700; color:#0d2b45; background:${even ? "#f4f8fc" : "#ffffff"};">${colo}</td>
            <td style="${base}text-align:center; font-weight:700; color:#146c3a; background:${even ? "#E6F4EC" : "#EEF8F1"};">${start}</td>
            <td style="${base}text-align:center; font-weight:700; color:#a5271a; background:${even ? "#FBE9E6" : "#FDF0EE"};">${stop}</td>
          </tr>`;
    })
    .join("\n");
  const scFor = html.match(/<sc-for list="\{\{ rows \}\}"[\s\S]*?<\/sc-for>/);
  if (!scFor) throw new Error(`sc-for horaires introuvable : ${file}`);
  html = html.replace(scFor[0], rowsHtml);

  // Bloc prescripteur (page 1)
  const nomBloc =
    `<div style="font-family:'Barlow',sans-serif; font-weight:700; font-size:15px; line-height:1.15;">Dr Antoine DEBOURDEAU</div>`;
  must(html, nomBloc, file);
  html = html.replace(
    nomBloc,
    `<div style="font-family:'Barlow',sans-serif; font-weight:700; font-size:15px; line-height:1.15;">@@MED_NOM@@</div>`
  );

  const specBloc = `<div style="font-size:12px; color:#0072BC; font-weight:600;">Hépato-Gastroentérologie</div>`;
  must(html, specBloc, file);
  html = html.replace(specBloc, `<div style="font-size:12px; color:#0072BC; font-weight:600;">@@MED_SPEC@@</div>`);

  const contactLine = `Secrétariat : 04 67 33 02 24 · Fax : 04 67 33 69 42`;
  must(html, contactLine, file);
  html = html.replace(contactLine, `@@MED_TEL_LINE@@`);

  const rppsBloc = html.match(
    /<div style="display:flex; align-items:center; gap:8px; margin-top:6px;">\s*<img src="rpps-barcode\.png"[\s\S]*?<\/div>/
  );
  if (!rppsBloc) throw new Error(`bloc RPPS introuvable : ${file}`);
  html = html.replace(rppsBloc[0], `@@RPPS_BLOCK@@`);

  // ℞ → puce ronde de la charte (esthétique, pro)
  html = html.replaceAll(
    `<span style="flex:none; color:#0072BC; font-weight:800;">℞</span>`,
    `<span style="flex:none; width:7px; height:7px; border-radius:50%; background:#0072BC; margin-top:8px;"></span>`
  );

  const finessImg = html.match(/<img src="finess-barcode\.png"[^>]*>/);
  if (!finessImg) throw new Error(`img FINESS introuvable : ${file}`);
  html = html.replace(finessImg[0], `@@FINESS_BARCODE@@`);

  // Encart patient
  const patientBox = html.match(
    /<div style="flex:none; width:170px; border:1\.5px dashed #9db4c6;[^>]*>Étiquette patient<\/div>/
  );
  if (!patientBox) throw new Error(`encart patient introuvable : ${file}`);
  html = html.replace(patientBox[0], `@@PATIENT_BOX@@`);

  // Date + signature
  const dateLine = html.match(/<div style="font-size:13px;">Fait à Montpellier, le[\s\S]*?<\/div>/);
  if (!dateLine) throw new Error(`ligne date introuvable : ${file}`);
  html = html.replace(dateLine[0], `@@DATE_LINE@@`);

  const signNom = `<div style="font-weight:700; font-size:14px; margin-top:22px;">Dr Antoine DEBOURDEAU</div>`;
  must(html, signNom, file);
  html = html.replace(signNom, `<div style="font-weight:700; font-size:14px; margin-top:22px;">@@MED_NOM@@</div>`);

  const signSpec = `<div style="font-size:11px; color:#4a5b68;">Hépato-Gastroentérologie — CHU de Montpellier</div>`;
  must(html, signSpec, file);
  html = html.replace(signSpec, `<div style="font-size:11px; color:#4a5b68;">@@MED_SPEC@@ — CHU de Montpellier</div>`);

  return { key, product, html };
}

// ------------------------------------------------------------------- fiches
const FICHES = [
  { key: "ags", file: "Anastomose gastro-jejunale -fiche patient-.html", title: "Anastomose gastro-jéjunale par écho-endoscopie", sub: "Fiche patient illustrée (recto-verso)" },
  { key: "gep", file: "Gastrostomie endoscopique GEP -fiche patient-.html", title: "Gastrostomie endoscopique (GEP)", sub: "Fiche patient illustrée (recto-verso)" },
];

function extractFiche({ key, file, title, sub }) {
  const raw = readFileSync(join(SRC, file), "utf8");
  const medBloc =
    `<div style="font-family:'Barlow','Segoe UI',system-ui,sans-serif;text-align:right;color:#4a5b68;font-size:8.5pt;line-height:1.4;"><div style="font-weight:700;color:#0d2b45;">Dr Antoine DEBOURDEAU</div><div>Hépato-Gastroentérologie</div><div>Tél. 04 67 33 70 67</div></div>`;
  must(raw, medBloc, file);
  let html = raw.replaceAll(medBloc, `@@FICHE_MED_BLOCK@@`);

  // Pages : tous les <div class="page"> … (délimités par la structure connue)
  const pages = [];
  const re = /<div class="page">([\s\S]*?)<\/div>\s*(?=<div class="page">|<\/body>)/g;
  let m;
  while ((m = re.exec(html))) pages.push(m[1]);
  if (pages.length < 2) throw new Error(`pages introuvables (${pages.length}) : ${file}`);

  return { key, title, sub, pages };
}

// -------------------------------------------------------------------- write
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const ordos = ORDOS.map(extractOrdo);
writeFileSync(
  join(OUT, "tpl-ordos.js"),
  `// GÉNÉRÉ par tools/extract.mjs — ne pas éditer à la main.\nexport const ORDOS = {\n` +
    ordos
      .map((o) => `  ${o.key}: {\n    product: ${JSON.stringify(o.product)},\n    html: \`${esc(o.html)}\`,\n  },`)
      .join("\n") +
    `\n};\n`
);
console.log(`tpl-ordos.js : ${ordos.map((o) => o.key).join(", ")}`);

const fiches = FICHES.map(extractFiche);
writeFileSync(
  join(OUT, "tpl-fiches.js"),
  `// GÉNÉRÉ par tools/extract.mjs — ne pas éditer à la main.\nexport const FICHES = {\n` +
    fiches
      .map(
        (f) =>
          `  ${f.key}: {\n    title: ${JSON.stringify(f.title)},\n    sub: ${JSON.stringify(f.sub)},\n    pages: [\n` +
          f.pages.map((p) => `      \`${esc(p)}\`,`).join("\n") +
          `\n    ],\n  },`
      )
      .join("\n") +
    `\n};\n`
);
console.log(`tpl-fiches.js : ${fiches.map((f) => `${f.key} (${f.pages.length} pages)`).join(", ")}`);
