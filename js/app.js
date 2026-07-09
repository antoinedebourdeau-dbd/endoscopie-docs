// Interface principale — catalogue, médecin, patient, aperçu, impression.

import { DOCS } from "./endoc-docs.js";
import { assembleDocs } from "./render.js";
import { listMedecins, saveMedecin, removeMedecin, exportMedecins, importMedecins, checkRpps } from "./doctors.js";
import {
  listSections, addSection, listLocalDocs, saveLocalDoc, removeLocalDoc,
  exportLocalDoc, importLocalDoc, validateDoc, buildPrompt,
} from "./localdocs.js";
import { renderNote } from "./render.js";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

// ---------------------------------------------------------------- catalogue
const ORDO_ITEMS = [
  { key: "citrafleet", label: "Ordonnance + guide — CITRAFLEET®" },
  { key: "moviprep", label: "Ordonnance + guide — MOVIPREP®" },
  { key: "plenvu", label: "Ordonnance + guide — PLENVU®" },
  { key: "ximepeg", label: "Ordonnance + guide — XIMEPEG®" },
];
const FICHE_ITEMS = [
  { key: "ags", label: "Anastomose gastro-jéjunale par écho-endoscopie", sub: "Fiche illustrée recto-verso" },
  { key: "gep", label: "Gastrostomie endoscopique (GEP)", sub: "Fiche illustrée recto-verso" },
];

function buildCatalog() {
  const notesEndo = [], notesExplo = [];
  for (const [slug, d] of Object.entries(DOCS)) {
    const item = { id: "note:" + slug, type: "note", slug, label: d.title, sub: d.geste };
    (d.service === "explo" ? notesExplo : notesEndo).push(item);
  }
  notesEndo.sort((a, b) => a.label.localeCompare(b.label, "fr"));
  notesExplo.sort((a, b) => a.label.localeCompare(b.label, "fr"));

  const groups = [
    { id: "g-ordo", title: "Préparations coliques & ordonnances", items: ORDO_ITEMS.map((o) => ({ id: "ordo:" + o.key, type: "ordo", key: o.key, label: o.label, sub: "Ordonnance (page 1) + guide patient" })) },
    { id: "g-notes", title: "Notes d'information & consentement — Endoscopie", items: notesEndo },
    { id: "g-explo", title: "Explorations fonctionnelles digestives", items: notesExplo },
    { id: "g-fiches", title: "Fiches illustrées", items: FICHE_ITEMS.map((f) => ({ id: "fiche:" + f.key, type: "fiche", key: f.key, label: f.label, sub: f.sub })) },
  ];

  // Sections personnalisées + documents locaux
  const localDocs = listLocalDocs();
  for (const s of listSections()) {
    groups.push({
      id: s.id, title: s.title, custom: true,
      items: localDocs.filter((d) => d.category === s.id).map((d) => ({ id: "local:" + d.id, type: "local", doc: d, label: d.title, sub: d.geste, local: true })),
    });
  }
  const orphans = localDocs.filter((d) => !listSections().some((s) => s.id === d.category));
  if (orphans.length) {
    groups.push({ id: "g-local-autres", title: "Documents locaux", custom: true, items: orphans.map((d) => ({ id: "local:" + d.id, type: "local", doc: d, label: d.title, sub: d.geste, local: true })) });
  }
  return groups;
}

let CATALOG = buildCatalog();
const selection = new Set();

function renderCatalog() {
  CATALOG = buildCatalog();
  const root = $("#catalogue");
  root.innerHTML = CATALOG.map((g, gi) => {
    if (g.custom && !g.items.length) {
      return `<div class="cat-group" data-g="${g.id}">
        <div class="cat-title"><span class="chev">▶</span>${g.title}<span class="count">vide</span></div>
      </div>`;
    }
    const items = g.items.map((it) => `
      <label class="doc-item">
        <input type="checkbox" data-doc="${it.id}" ${selection.has(it.id) ? "checked" : ""}>
        <span>${it.label}${it.local ? `<span class="badge-local">Document local</span>` : ""}<br><span class="sub">${it.sub || ""}</span>
        ${it.local ? `<span class="sub"> · <a href="#" data-export-local="${it.doc.id}">exporter</a> · <a href="#" data-del-local="${it.doc.id}" style="color:var(--rouge);">supprimer</a></span>` : ""}</span>
      </label>`).join("");
    return `<div class="cat-group ${gi === 0 ? "open" : ""}" data-g="${g.id}">
      <div class="cat-title"><span class="chev">▶</span>${g.title}<span class="count">${g.items.length}</span></div>
      <div class="cat-docs">${items}</div>
    </div>`;
  }).join("");

  // interactions
  $$("#catalogue .cat-title").forEach((el) =>
    el.addEventListener("click", () => el.parentElement.classList.toggle("open")));
  $$("#catalogue input[data-doc]").forEach((cb) =>
    cb.addEventListener("change", () => {
      cb.checked ? selection.add(cb.dataset.doc) : selection.delete(cb.dataset.doc);
      refresh();
    }));
  $$("#catalogue [data-export-local]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const doc = listLocalDocs().find((d) => d.id === a.dataset.exportLocal);
      if (doc) download(`document-${slugify(doc.title)}.json`, exportLocalDoc(doc));
    }));
  $$("#catalogue [data-del-local]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const doc = listLocalDocs().find((d) => d.id === a.dataset.delLocal);
      if (doc && confirm(`Supprimer « ${doc.title} » ?`)) {
        removeLocalDoc(doc.id);
        selection.delete("local:" + doc.id);
        renderCatalog();
        refresh();
      }
    }));
}

// ------------------------------------------------------------------ médecin
function renderMedecinSelect() {
  const sel = $("#sel-medecin");
  const current = sel.value;
  sel.innerHTML =
    listMedecins().map((m) => `<option value="${m.id}">${m.nom}${m.tel ? " — secr. " + m.tel : ""}</option>`).join("") +
    `<option value="__libre">Autre médecin (saisie libre)…</option>`;
  if ([...sel.options].some((o) => o.value === current)) sel.value = current;
  $("#medecin-libre").style.display = sel.value === "__libre" ? "block" : "none";
}

function currentMedecin() {
  if ($("#chk-generic").checked) return null;
  const v = $("#sel-medecin").value;
  if (v === "__libre") {
    const nom = $("#ml-nom").value.trim();
    if (!nom) return null;
    return {
      nom,
      specialite: $("#ml-spec").value.trim() || "Hépato-Gastroentérologie",
      tel: $("#ml-tel").value.trim(),
      fax: "",
      rpps: $("#ml-rpps").value.replace(/\s+/g, ""),
    };
  }
  return listMedecins().find((m) => m.id === v) || null;
}

function currentPatient() {
  if ($("#chk-generic").checked) return null;
  const p = {
    nom: $("#pt-nom").value.trim(),
    prenom: $("#pt-prenom").value.trim(),
    ddn: $("#pt-ddn").value,
    examen: $("#pt-examen").value,
  };
  return p.nom || p.prenom || p.ddn || p.examen ? p : null;
}

// ------------------------------------------------------------------- aperçu
function selectedItems() {
  const items = [];
  for (const g of CATALOG) for (const it of g.items) if (selection.has(it.id)) items.push(it);
  return items;
}

let renderSeq = 0;
async function refresh() {
  const items = selectedItems();
  $("#btn-print").disabled = !items.length;
  $("#preview-empty").style.display = items.length ? "none" : "block";

  const seq = ++renderSeq;
  const ctx = { medecin: currentMedecin(), patient: currentPatient() };
  const html = await assembleDocs(items, ctx);
  if (seq === renderSeq) $("#print-root").innerHTML = html;
}

let refreshTimer = null;
function refreshSoon() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(refresh, 250);
}

// ------------------------------------------------------------------- outils
function download(name, content) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 50);

function pickFile(cb) {
  const input = $("#file-input");
  input.onchange = () => {
    const f = input.files[0];
    input.value = "";
    if (!f) return;
    const r = new FileReader();
    r.onload = () => cb(String(r.result));
    r.readAsText(f);
  };
  input.click();
}

// ------------------------------------------------------------ modale médecins
function openModal(id) { $(id).classList.add("open"); }
function closeModals() { $$(".modal-back").forEach((m) => m.classList.remove("open")); }
$$("[data-close]").forEach((b) => b.addEventListener("click", closeModals));
$$(".modal-back").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeModals(); }));

function renderMedList() {
  $("#med-list").innerHTML = listMedecins().map((m) => `
    <div class="med-row">
      <div class="info">
        <div class="nom">${m.nom}</div>
        <div class="det">${m.specialite}${m.tel ? " · Secr. " + m.tel : ""}${m.rpps ? " · RPPS " + m.rpps : ""}</div>
      </div>
      <button class="subtle small" data-med-edit="${m.id}">Modifier</button>
      <button class="danger small" data-med-del="${m.id}">Suppr.</button>
    </div>`).join("");

  $$("[data-med-edit]").forEach((b) => b.addEventListener("click", () => {
    const m = listMedecins().find((x) => x.id === b.dataset.medEdit);
    if (!m) return;
    $("#mf-id").value = m.id; $("#mf-nom").value = m.nom; $("#mf-spec").value = m.specialite;
    $("#mf-tel").value = m.tel; $("#mf-fax").value = m.fax || ""; $("#mf-rpps").value = m.rpps || "";
    $("#med-form").style.display = "block";
  }));
  $$("[data-med-del]").forEach((b) => b.addEventListener("click", () => {
    const m = listMedecins().find((x) => x.id === b.dataset.medDel);
    if (m && confirm(`Retirer ${m.nom} de la liste ?`)) {
      removeMedecin(m.id);
      renderMedList(); renderMedecinSelect(); refreshSoon();
    }
  }));
}

$("#btn-medecins").addEventListener("click", () => { renderMedList(); openModal("#modal-medecins"); });
$("#btn-med-add").addEventListener("click", () => {
  $("#med-form").reset(); $("#mf-id").value = ""; $("#mf-spec").value = "Hépato-Gastroentérologie";
  $("#med-form").style.display = "block"; $("#mf-nom").focus();
});
$("#mf-cancel").addEventListener("click", () => { $("#med-form").style.display = "none"; });
$("#med-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const err = checkRpps($("#mf-rpps").value.trim());
  const errBox = $("#mf-err");
  if (err) { errBox.textContent = err; errBox.style.display = "block"; return; }
  errBox.style.display = "none";
  saveMedecin({
    id: $("#mf-id").value || undefined,
    nom: $("#mf-nom").value, specialite: $("#mf-spec").value,
    tel: $("#mf-tel").value, fax: $("#mf-fax").value, rpps: $("#mf-rpps").value,
  });
  $("#med-form").style.display = "none";
  renderMedList(); renderMedecinSelect(); refreshSoon();
});
$("#btn-med-export").addEventListener("click", () => download("medecins-endoscopie-chu.json", exportMedecins()));
$("#btn-med-import").addEventListener("click", () => pickFile((txt) => {
  try {
    const { added, updated } = importMedecins(txt);
    alert(`Import terminé : ${added} ajouté(s), ${updated} mis à jour.`);
    renderMedList(); renderMedecinSelect(); refreshSoon();
  } catch (e) { alert("Import impossible : " + e.message); }
}));

// --------------------------------------------------------------- reprographie
$("#btn-repro").addEventListener("click", () => {
  for (const g of CATALOG) for (const it of g.items) if (!it.local) selection.add(it.id);
  $("#chk-generic").checked = true;
  renderCatalog();
  refresh().then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
});

// ------------------------------------------------------------------- wizard
let wizardDoc = null;

function wizGo(n) {
  $$(".ws").forEach((el) => el.classList.toggle("on", Number(el.dataset.ws) <= n));
  $$(".wpane").forEach((el) => el.classList.toggle("on", Number(el.dataset.wp) === n));
}

function renderWizardSections() {
  const sel = $("#wz-section");
  sel.innerHTML =
    listSections().map((s) => `<option value="${s.id}">${s.title}</option>`).join("") +
    `<option value="__new">＋ Créer une nouvelle section…</option>`;
}

$("#btn-new-doc").addEventListener("click", () => {
  wizardDoc = null;
  renderWizardSections();
  $("#wz-json").value = ""; $("#wz-feedback").innerHTML = ""; $("#wz-preview").innerHTML = "";
  $("#wz-save").style.display = "none";
  wizGo(1);
  openModal("#modal-wizard");
});

$("#wz-section").addEventListener("change", () => {
  if ($("#wz-section").value === "__new") {
    const title = prompt("Nom de la nouvelle section (ex. « Traitements — MICI ») :");
    renderWizardSections();
    if (title && title.trim()) {
      const s = addSection(title);
      renderWizardSections();
      $("#wz-section").value = s.id;
      renderCatalog();
    }
  }
});

$("#wz-next-1").addEventListener("click", () => {
  if ($("#wz-section").value === "__new" || !$("#wz-section").value) {
    alert("Choisissez ou créez d'abord une section."); return;
  }
  wizGo(2);
});
$("#wz-next-2").addEventListener("click", () => {
  const src = $("#wz-source").value.trim();
  if (src.length < 40) { alert("Le texte source est trop court pour générer un document utile."); return; }
  $("#wz-prompt").value = buildPrompt({
    kind: $("#wz-kind").value,
    titleHint: $("#wz-title").value.trim(),
    sourceText: src,
  });
  wizGo(3);
});
$("#wz-copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText($("#wz-prompt").value);
  $("#wz-copy").textContent = "✔ Copié !";
  setTimeout(() => ($("#wz-copy").textContent = "📋 Copier le prompt"), 1600);
});
$("#wz-next-3").addEventListener("click", () => wizGo(4));
$$("[data-wback]").forEach((b) => b.addEventListener("click", () => wizGo(Number(b.dataset.wback))));

$("#wz-validate").addEventListener("click", () => {
  const fb = $("#wz-feedback");
  let doc;
  try {
    // tolère un éventuel bloc de code autour du JSON
    const raw = $("#wz-json").value.trim().replace(/^```(json)?\s*/i, "").replace(/```\s*$/, "");
    doc = JSON.parse(raw);
  } catch (e) {
    fb.innerHTML = `<div class="validation-err">JSON illisible : ${e.message}</div>`;
    $("#wz-save").style.display = "none";
    return;
  }
  const errs = validateDoc(doc);
  if (errs.length) {
    fb.innerHTML = `<div class="validation-err">À corriger :\n– ${errs.join("\n– ")}</div>`;
    $("#wz-save").style.display = "none";
    $("#wz-preview").innerHTML = "";
    return;
  }
  wizardDoc = doc;
  fb.innerHTML = `<div class="validation-ok">✔ Document valide — vérifiez l'aperçu ci-dessous puis enregistrez.</div>`;
  $("#wz-preview").innerHTML = renderNote(doc, { medecin: null, patient: null });
  $("#wz-save").style.display = "inline-block";
});

$("#wz-save").addEventListener("click", () => {
  if (!wizardDoc) return;
  wizardDoc.category = $("#wz-section").value;
  const saved = saveLocalDoc(wizardDoc);
  closeModals();
  renderCatalog();
  selection.add("local:" + saved.id);
  renderCatalog();
  refresh();
});

$("#btn-import-doc").addEventListener("click", () => pickFile((txt) => {
  try {
    const doc = importLocalDoc(txt);
    if (!doc.category || !listSections().some((s) => s.id === doc.category)) doc.category = null;
    renderCatalog();
    alert(`« ${doc.title} » importé dans le catalogue.`);
  } catch (e) { alert("Import impossible : " + e.message); }
}));

// --------------------------------------------------------------- impression
$("#btn-print").addEventListener("click", async () => {
  await refresh(); // aperçu à jour avant impression
  window.print();
});

// ------------------------------------------------------------------ liaison
$("#sel-medecin").addEventListener("change", () => {
  $("#medecin-libre").style.display = $("#sel-medecin").value === "__libre" ? "block" : "none";
  refreshSoon();
});
["#ml-nom", "#ml-spec", "#ml-tel", "#ml-rpps", "#pt-nom", "#pt-prenom", "#pt-ddn", "#pt-examen"]
  .forEach((id) => $(id).addEventListener("input", refreshSoon));
$("#chk-generic").addEventListener("change", () => {
  $("#panel-patient").style.opacity = $("#chk-generic").checked ? ".45" : "1";
  refreshSoon();
});

renderCatalog();
renderMedecinSelect();
refresh();
