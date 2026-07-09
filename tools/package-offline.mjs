// Fabrique dist/endoscopie-docs-hors-ligne.zip : le site complet, utilisable
// en double-cliquant index.html… sauf que les modules ES exigent un serveur.
// → On inline donc tous les modules JS dans un bundle unique chargé en
//   <script type="module"> via import inline ? Non : le plus robuste hors
//   serveur est un import map impossible en file:// ; on garde la solution
//   éprouvée : servir via file:// fonctionne pour type=module SI les chemins
//   sont relatifs et le navigateur l'autorise — Chrome le bloque (CORS).
//   Solution retenue : bundle unique js/bundle.js (concaténation naïve des
//   modules, exports remplacés) injecté dans une copie d'index.html.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const STAGE = join(ROOT, "dist", "stage");

rmSync(join(ROOT, "dist"), { recursive: true, force: true });
mkdirSync(STAGE, { recursive: true });

// Assets
cpSync(join(ROOT, "img"), join(STAGE, "img"), { recursive: true });
cpSync(join(ROOT, "chu-logo.webp"), join(STAGE, "chu-logo.webp"));
cpSync(join(ROOT, "css"), join(STAGE, "css"), { recursive: true });

// Bundle : modules concaténés dans l'ordre des dépendances, imports/exports retirés.
const ORDER = [
  "js/endoc-docs.js",
  "js/tpl-ordos.js",
  "js/tpl-fiches.js",
  "js/barcode.js",
  "js/render.js",
  "js/doctors.js",
  "js/localdocs.js",
  "js/app.js",
];
const bundle = ORDER.map((f) => {
  let src = readFileSync(join(ROOT, f), "utf8");
  src = src.replace(/^import[\s\S]*?from\s+["'][^"']+["'];?\s*$/gm, ""); // imports statiques
  src = src.replace(/await import\(["']\.\/tpl-fiches\.js["']\)/g, "({ FICHES })"); // import dynamique
  src = src.replace(/^export\s+/gm, "");
  return `// ===== ${f} =====\n${src}`;
}).join("\n\n");
writeFileSync(join(STAGE, "js-bundle.js"), `"use strict";\n(async () => {\n${bundle}\n})();\n`);

// index.html : script module → bundle classique
let html = readFileSync(join(ROOT, "index.html"), "utf8");
html = html.replace(
  `<script type="module" src="js/app.js"></script>`,
  `<script src="js-bundle.js"></script>`
);
writeFileSync(join(STAGE, "index.html"), html);

// LISEZ-MOI
writeFileSync(
  join(STAGE, "LISEZ-MOI.txt"),
  `DOCUMENTS PATIENTS — ENDOSCOPIE DIGESTIVE · CHU DE MONTPELLIER (version hors-ligne)

• Double-cliquez sur « index.html » pour ouvrir l'interface dans votre navigateur.
• Tout fonctionne sans connexion internet (les polices d'écran utilisent
  alors une police de substitution ; l'impression reste correcte).
• Les listes de médecins et documents créés restent dans le navigateur de ce poste.
• Endoscopie digestive : 04 67 33 70 67 — Urgence 24 h/24 : 04 67 33 70 65, sinon 15.
`
);

execSync(`cd "${join(ROOT, "dist")}" && ditto -c -k --sequesterRsrc stage endoscopie-docs-hors-ligne.zip && rm -rf stage`);
console.log("dist/endoscopie-docs-hors-ligne.zip prêt.");
