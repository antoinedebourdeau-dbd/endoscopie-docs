// Interface principale — catalogue, médecin, patient, aperçu, impression.

// Version affichée dans le bandeau — à incrémenter à chaque déploiement
// (permet de vérifier qu'un poste n'exécute pas une version en cache).
export const APP_VERSION = "3.5";

import { DOCS } from "./endoc-docs.js";
import { assembleDocs } from "./render.js";
import { listMedecins, saveMedecin, removeMedecin, exportMedecins, importMedecins, checkRpps } from "./doctors.js";
import {
  listSections, addSection, listLocalDocs, saveLocalDoc, removeLocalDoc,
  exportLocalDoc, importLocalDoc, validateDoc, buildPrompt,
} from "./localdocs.js";
import { renderNote, sanitizeRich } from "./render.js";
import { ORDO_TYPES } from "./tpl-ordotypes.js";
import { REGIMES, REGIME_NIVEAUX } from "./tpl-regimes.js";
import { ETP } from "./tpl-etp.js";
import { PARCOURS_DEFS } from "./tpl-parcours.js";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

// ---------------------------------------------------------------- catalogue
const ORDO_ITEMS = [
  { key: "citrafleet", label: "Ordonnance + guide — CITRAFLEET®" },
  { key: "izinova", label: "Ordonnance + guide — IZINOVA®" },
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
  // Les fiches illustrées et les notes des explorations fonctionnelles sont
  // des notes d'information & consentement comme les autres.
  for (const f of FICHE_ITEMS)
    notesEndo.push({ id: "fiche:" + f.key, type: "fiche", key: f.key, label: f.label, sub: "Note d'information illustrée (recto-verso)" });
  notesEndo.push(...notesExplo);
  notesEndo.sort((a, b) => a.label.localeCompare(b.label, "fr"));

  const regimeItems = REGIMES.flatMap((c) => c.items.map((f) => ({
    id: "regime:" + f.id, type: "regime", key: f.id, label: f.name,
    sub: `Fiche régime · ${c.cat} · ${REGIME_NIVEAUX[f.niveau].badge} niveau ${f.niveau}`,
  })));

  const groups = [
    { id: "g-ordo", title: "Préparations coliques & ordonnances", items: ORDO_ITEMS.map((o) => ({ id: "ordo:" + o.key, type: "ordo", key: o.key, label: o.label, sub: "Ordonnance (page 1) + guide patient" })) },
    { id: "g-notes", title: "Notes d'information & consentement", items: notesEndo },
    { id: "g-regimes", title: "Fiches régimes", items: regimeItems },
    { id: "g-etp", title: "Éducation thérapeutique", items: ETP.flatMap((ax) => ax.items.map((f) => ({
      id: "etp:" + f.id, type: "etp", key: f.id, label: f.name,
      sub: `${f.type === "livret" ? "Livret rééducation" : "Fiche ETP"} · ${ax.cat || ax.axe}${f.star ? " · " + "★".repeat(f.star) : ""}`,
    }))) },
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
let activeCat = null; // catégorie affichée (null = catalogue masqué)
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function applyCatalogVisibility() {
  const words = norm($("#search").value.trim()).split(/\s+/).filter(Boolean);
  const q = words.length > 0;
  $$("#catalogue .cat-group").forEach((g) => {
    if (q) {
      let visible = 0;
      g.querySelectorAll(".doc-item").forEach((it) => {
        const hay = norm(it.textContent);
        const hit = words.every((w) => hay.includes(w));
        it.style.display = hit ? "" : "none";
        if (hit) visible++;
      });
      g.style.display = visible ? "" : "none";
      g.classList.toggle("open", visible > 0);
    } else {
      g.querySelectorAll(".doc-item").forEach((it) => (it.style.display = ""));
      g.style.display = g.dataset.g === activeCat ? "" : "none";
      g.classList.toggle("open", g.dataset.g === activeCat);
    }
  });
  $("#btn-cat-prepa")?.classList.toggle("active", activeCat === "g-ordo");
  $("#btn-cat-notes")?.classList.toggle("active", activeCat === "g-notes");
}

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
    return `<div class="cat-group" data-g="${g.id}">
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

  applyCatalogVisibility();
}

// ------------------------------------------------------------------ médecin
const LASTMED_KEY = "endoc.lastMedecin"; // mémorise le médecin choisi sur ce poste

function renderMedecinSelect() {
  const sel = $("#sel-medecin");
  const current = sel.value || localStorage.getItem(LASTMED_KEY);
  sel.innerHTML =
    listMedecins().map((m) => `<option value="${m.id}">${m.nom}${m.tel ? " — secr. " + m.tel : ""}</option>`).join("") +
    `<option value="__libre">Autre médecin (saisie libre)…</option>`;
  if (current && [...sel.options].some((o) => o.value === current)) sel.value = current;
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
      mail: $("#ml-mail").value.trim(),
    };
  }
  return listMedecins().find((m) => m.id === v) || null;
}

function currentPatient() {
  if ($("#chk-generic").checked) return null;
  const p = {
    civ: $("#pt-civ").value,
    nom: $("#pt-nom").value.trim(),
    prenom: $("#pt-prenom").value.trim(),
    ddn: $("#pt-ddn").value,
    examen: $("#pt-examen").value,
  };
  return p.nom || p.prenom || p.ddn || p.examen ? p : null;
}

// ------------------------------------------------------------------- aperçu
// ------------------------------------------------ ordonnances (cartes multiples)
const ordos = [];
let ordoSeq = 0;
let activeOrdoId = null; // carte concernée par le sélecteur de types / l'enregistrement

function newOrdo(prefill) {
  const o = {
    id: "ord" + (++ordoSeq),
    fresh: !prefill, // affiche le choix type/vierge
    mode: prefill?.mode || "simple",
    texte: prefill?.texte || "",
    textAld: prefill?.textAld || "",
    textNonAld: prefill?.textNonAld || "",
    duree: prefill?.duree || "",
  };
  ordos.push(o);
  renderOrdos();
  return o;
}

const RICHBAR = `
  <div class="richbar">
    <button type="button" data-cmd="bold" title="Gras"><b>G</b></button>
    <button type="button" data-cmd="italic" title="Italique"><i>I</i></button>
    <button type="button" data-cmd="underline" title="Souligné"><u>S</u></button>
    <button type="button" data-cmd="insertUnorderedList" title="Liste à puces">•&nbsp;Liste</button>
    <button type="button" data-cmd="insertOrderedList" title="Liste numérotée">1.&nbsp;Liste</button>
    <button type="button" data-cmd="indent" title="Augmenter le retrait (Tab)">⇥</button>
    <button type="button" data-cmd="outdent" title="Diminuer le retrait (Maj+Tab)">⇤</button>
    <button type="button" data-insert="℞ " title="Insérer le symbole ℞">℞</button>
  </div>`;

function ordoResume(o) {
  const t = (o.mode === "ald" ? o.textAld : o.texte).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return t ? " — " + t.slice(0, 42) + (t.length > 42 ? "…" : "") : "";
}

function renderOrdos() {
  const root = $("#ordos");
  root.innerHTML = ordos.map((o, idx) => `
  <div style="border:1.5px solid var(--bleu); border-radius:10px; padding:8px 10px; margin-bottom:10px; background:var(--bleu-pale);" data-ordo-card="${o.id}">
    <div style="display:flex; align-items:center; gap:8px;">
      <strong style="flex:1; font-size:13px;">💊 Ordonnance${ordos.length > 1 ? " " + (idx + 1) : ""}${o.mode === "ald" ? " (ALD)" : ""}${ordoResume(o)}</strong>
      <button class="subtle small" data-del-ordo="${o.id}">✕ retirer</button>
    </div>
    ${o.fresh ? `
    <div style="margin-top:8px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <button data-ordo-type-btn="${o.id}" style="padding:16px 10px; border-radius:12px; line-height:1.5;">📋<br><strong>Ordonnance type</strong><br><span style="font-weight:400; font-size:11px;">modèles classés, modifiables</span></button>
        <button data-ordo-vierge="${o.id}" class="ghost" style="padding:16px 10px; border-radius:12px; line-height:1.5; background:#fff;">🗒<br><strong>Ordonnance vierge</strong></button>
      </div>
      <div class="hint">Vous choisirez ensuite ordonnance simple ou ALD (bizone).</div>
    </div>` : `
    <div style="margin-top:8px;">
      <div class="btnrow" style="margin:0 0 8px;">
        <button type="button" class="small" data-ordo-type-btn="${o.id}" title="Charger une ordonnance type">📋 Types</button>
        <button type="button" class="subtle small" data-save-type="${o.id}" title="Enregistrer cette ordonnance comme type">💾 Enregistrer comme type</button>
      </div>
      <label class="field"><span class="lbl">Type d'ordonnance</span>
        <select data-oid="${o.id}" data-ok="mode">
          <option value="simple" ${o.mode !== "ald" ? "selected" : ""}>Ordonnance simple (une zone)</option>
          <option value="ald" ${o.mode === "ald" ? "selected" : ""}>Ordonnance ALD — bizone (100 % / hors ALD)</option>
        </select>
      </label>
      ${RICHBAR}
      <div style="display:${o.mode === "ald" ? "none" : "block"};">
        <label class="field" style="margin-bottom:2px;"><span class="lbl">Prescription</span></label>
        <div class="rich" contenteditable="true" data-oid="${o.id}" data-zone="texte" data-placeholder="PANTOPRAZOLE 40 mg : 1 comprimé le matin…"></div>
      </div>
      <div style="display:${o.mode === "ald" ? "block" : "none"};">
        <label class="field" style="margin-bottom:2px;"><span class="lbl">Zone ALD — prescriptions en rapport (100 %)</span></label>
        <div class="rich" contenteditable="true" data-oid="${o.id}" data-zone="textAld"></div>
        <label class="field" style="margin:8px 0 2px;"><span class="lbl">Zone hors ALD — sans rapport (optionnel)</span></label>
        <div class="rich" contenteditable="true" data-oid="${o.id}" data-zone="textNonAld" style="min-height:60px;"></div>
      </div>
      <label class="field"><span class="lbl">Durée du traitement (texte libre, optionnel)</span>
        <input type="text" data-oid="${o.id}" data-ok="duree" value="${(o.duree || "").replace(/"/g, "&quot;")}" placeholder="ex. 3 mois — QSP 6 mois">
      </label>
    </div>`}
  </div>`).join("");

  // injecte le contenu riche (innerHTML ne peut pas être mis dans le template sans double-échappement)
  root.querySelectorAll(".rich[data-oid]").forEach((ed) => {
    const o = ordos.find((x) => x.id === ed.dataset.oid);
    if (o) ed.innerHTML = o[ed.dataset.zone] || "";
  });

  // interactions structurelles
  root.querySelectorAll("[data-del-ordo]").forEach((b) => b.addEventListener("click", () => {
    ordos.splice(ordos.findIndex((x) => x.id === b.dataset.delOrdo), 1);
    renderOrdos(); refreshSoon();
  }));
  root.querySelectorAll("[data-ordo-vierge]").forEach((b) => b.addEventListener("click", () => {
    const o = ordos.find((x) => x.id === b.dataset.ordoVierge);
    o.fresh = false;
    renderOrdos(); refreshSoon();
    root.querySelector(`.rich[data-oid="${o.id}"]`)?.focus();
  }));
  root.querySelectorAll("[data-ordo-type-btn]").forEach((b) => b.addEventListener("click", () => {
    activeOrdoId = b.dataset.ordoTypeBtn;
    renderOrdoTypes();
    openModal("#modal-ordotypes");
  }));
  root.querySelectorAll("[data-save-type]").forEach((b) => b.addEventListener("click", () => {
    activeOrdoId = b.dataset.saveType;
    openSaveTypeModal();
  }));
}

// saisie : mise à jour du modèle sans re-rendu (conserve le focus)
$("#ordos").addEventListener("input", (e) => {
  const t = e.target;
  const o = ordos.find((x) => x.id === t.dataset.oid);
  if (!o) return;
  if (t.dataset.zone) o[t.dataset.zone] = t.innerHTML;
  if (t.dataset.ok === "duree") o.duree = t.value;
  refreshSoon();
});
$("#ordos").addEventListener("change", (e) => {
  const t = e.target;
  const o = ordos.find((x) => x.id === t.dataset.oid);
  if (!o || t.dataset.ok !== "mode") return;
  const ald = t.value === "ald";
  // le contenu suit le changement de mode si la zone cible est vide
  if (ald && !o.textAld.replace(/<[^>]*>/g, "").trim() && o.texte.replace(/<[^>]*>/g, "").trim()) { o.textAld = o.texte; o.texte = ""; }
  else if (!ald && !o.texte.replace(/<[^>]*>/g, "").trim() && o.textAld.replace(/<[^>]*>/g, "").trim()) { o.texte = o.textAld; o.textAld = ""; }
  o.mode = t.value;
  renderOrdos(); refreshSoon();
});

// barre de mise en forme + Tab + collage sécurisé (délégation sur le conteneur)
$("#ordos").addEventListener("mousedown", (e) => {
  if (e.target.closest(".richbar button")) e.preventDefault(); // conserve la sélection
});
$("#ordos").addEventListener("click", (e) => {
  const b = e.target.closest(".richbar button");
  if (!b) return;
  if (b.dataset.cmd) document.execCommand(b.dataset.cmd, false, null);
  else if (b.dataset.insert) document.execCommand("insertText", false, b.dataset.insert);
  refreshSoon();
});
$("#ordos").addEventListener("keydown", (e) => {
  if (e.key !== "Tab" || !e.target.classList.contains("rich")) return;
  e.preventDefault();
  document.execCommand(e.shiftKey ? "outdent" : "indent", false, null);
  refreshSoon();
});
$("#ordos").addEventListener("paste", (e) => {
  if (!e.target.classList.contains("rich")) return;
  e.preventDefault();
  const html = e.clipboardData.getData("text/html");
  const text = e.clipboardData.getData("text/plain");
  const safe = html ? sanitizeRich(html) : (text || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>");
  document.execCommand("insertHTML", false, safe);
});

$("#btn-create-ordo").addEventListener("click", () => {
  newOrdo();
  refreshSoon();
  $("#ordos").lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

function selectedItems() {
  const items = [];
  for (const o of ordos) {
    if (o.fresh) continue;
    items.push({ id: o.id, type: "ordolibre", opts: { mode: o.mode, texte: o.texte, textAld: o.textAld, textNonAld: o.textNonAld, duree: o.duree.trim() } });
  }
  for (const d of demandes) {
    if (!d.type) continue;
    const opts = { ...d.opts, telPatient: $("#pt-tel").value.trim(), dialyse: d.opts.dialyse === "1" || d.opts.dialyse === true };
    if (d.type === "endo") items.push({ id: d.id, type: "demande-endo", opts });
    else items.push({ id: d.id, type: "demande-imagerie", kind: d.type, opts });
  }
  for (const g of CATALOG) for (const it of g.items) if (selection.has(it.id)) items.push(it);
  return items;
}

let renderSeq = 0;
async function refresh() {
  const items = selectedItems();
  $("#btn-print").disabled = !items.length;
  $("#preview-empty").style.display = items.length ? "none" : "block";
  const selItems = [];
  for (const g of CATALOG) for (const it of g.items) if (selection.has(it.id)) selItems.push(it);
  const extraChips = [
    ...ordos.filter((o) => !o.fresh).map((o) => ({ kind: "ordo", id: o.id, label: "💊 Ordonnance" + ordoResume(o) })),
    ...demandes.filter((d) => d.type).map((d) => ({ kind: "dem", id: d.id, label: "🩺 " + (DEM_LABELS[d.type] || "Demande") })),
  ];
  $("#sel-count").style.display = selItems.length || extraChips.length ? "block" : "none";
  if (selItems.length || extraChips.length) {
    const total = selItems.length + extraChips.length;
    const chip = (label, attr) => `<span style="display:inline-flex; align-items:center; gap:5px; background:var(--bleu-pale); border:1px solid #cfe1f0; border-radius:20px; padding:2px 4px 2px 9px; font-size:11px; color:var(--bleu-fonce); max-width:100%;">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:240px;">${label}</span>
          <a href="#" ${attr} title="Retirer" style="flex:none; width:15px; height:15px; border-radius:50%; background:#fff; color:var(--rouge); font-weight:800; font-size:10px; display:inline-flex; align-items:center; justify-content:center; text-decoration:none; border:1px solid #e7b3ab;">✕</a>
        </span>`;
    $("#sel-count").innerHTML =
      `<div style="margin-bottom:4px;"><strong>${total} élément${total > 1 ? "s" : ""} dans le dossier</strong> — <a href="#" id="clear-sel">tout retirer</a></div>
      <div style="display:flex; flex-wrap:wrap; gap:4px;">
        ${selItems.map((it) => chip(it.label, `data-unsel="${it.id}"`)).join("")}
        ${extraChips.map((c) => chip(c.label, `data-unchip="${c.kind}:${c.id}"`)).join("")}
      </div>`;
  }

  saveSession();
  const seq = ++renderSeq;
  const ctx = {
    medecin: currentMedecin(),
    patient: currentPatient(),
    // Date du document : aujourd'hui par défaut, modifiable ; jamais en mode générique.
    dateDoc: $("#chk-generic").checked ? null : $("#doc-date").value || null,
  };
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
        <div class="det">${m.specialite}${m.tel ? " · Secr. " + m.tel : ""}${m.rpps ? " · RPPS " + m.rpps : ""}${m.mail ? "<br>BALF : " + m.mail : ""}</div>
      </div>
      <button class="subtle small" data-med-edit="${m.id}">Modifier</button>
      <button class="danger small" data-med-del="${m.id}">Suppr.</button>
    </div>`).join("");

  $$("[data-med-edit]").forEach((b) => b.addEventListener("click", () => {
    const m = listMedecins().find((x) => x.id === b.dataset.medEdit);
    if (!m) return;
    $("#mf-id").value = m.id; $("#mf-nom").value = m.nom; $("#mf-spec").value = m.specialite;
    $("#mf-tel").value = m.tel; $("#mf-fax").value = m.fax || ""; $("#mf-rpps").value = m.rpps || "";
    $("#mf-mail").value = m.mail || "";
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
  const saved = saveMedecin({
    id: $("#mf-id").value || undefined,
    nom: $("#mf-nom").value, specialite: $("#mf-spec").value,
    tel: $("#mf-tel").value, fax: $("#mf-fax").value, rpps: $("#mf-rpps").value,
    mail: $("#mf-mail").value,
  });
  const prof = getProfile();
  if (prof?.type === "medecin" && !prof.medecinId) {
    setProfile({ type: "medecin", medecinId: saved.id });
    localStorage.setItem(LASTMED_KEY, saved.id);
    renderMedecinSelect();
    $("#sel-medecin").value = saved.id;
  }
  $("#med-form").style.display = "none";
  renderMedList(); renderMedecinSelect(); renderProfileChip(); refreshSoon();
});
$("#btn-med-export").addEventListener("click", () => download("medecins-endoscopie-chu.json", exportMedecins()));
$("#btn-cfg-export").addEventListener("click", () => {
  const cfg = {
    type: "dochge-config", version: 1,
    medecins: listMedecins(),
    ordotypes: listUserTypes(),
    ordotypecats: listUserCats(),
    packs: listParcoursPerso(),
    mails: mailCfg(),
  };
  download("dochge-configuration-poste.json", JSON.stringify(cfg, null, 2));
  toast("💾 Configuration du poste exportée (médecins, ordonnances perso, packs, e-mails).", 6000);
});
$("#btn-cfg-import").addEventListener("click", () => pickFile((txt) => {
  try {
    const cfg = JSON.parse(txt);
    if (cfg.type !== "dochge-config") throw new Error("Ce fichier n'est pas une configuration Doc'HGE.");
    if (Array.isArray(cfg.medecins)) importMedecins(JSON.stringify({ medecins: cfg.medecins }));
    if (Array.isArray(cfg.ordotypes)) {
      const cur = listUserTypes();
      for (const t of cfg.ordotypes) if (!cur.some((x) => x.name === t.name && x.cat === t.cat)) cur.push({ ...t, id: "ut" + Math.random().toString(36).slice(2, 9) });
      saveUserTypes(cur);
    }
    if (Array.isArray(cfg.ordotypecats)) saveUserCats([...new Set([...listUserCats(), ...cfg.ordotypecats])]);
    if (Array.isArray(cfg.packs)) {
      const cur = listParcoursPerso();
      for (const p of cfg.packs) if (!cur.some((x) => x.name === p.name)) cur.push(p);
      localStorage.setItem(PARCOURS_KEY, JSON.stringify(cur));
    }
    if (cfg.mails) localStorage.setItem(MAIL_KEY, JSON.stringify(cfg.mails));
    renderMedList(); renderMedecinSelect(); renderProfileChip();
    toast("📥 Configuration importée : médecins, ordonnances perso, packs et e-mails fusionnés.", 7000);
  } catch (e) { alert("Import impossible : " + e.message); }
}));
$("#btn-med-import").addEventListener("click", () => pickFile((txt) => {
  try {
    const { added, updated } = importMedecins(txt);
    alert(`Import terminé : ${added} ajouté(s), ${updated} mis à jour.`);
    renderMedList(); renderMedecinSelect(); refreshSoon();
  } catch (e) { alert("Import impossible : " + e.message); }
}));

// ------------------------------------------------- e-mails des secrétariats
const MAIL_KEY = "endoc.mails.v1";
const MAIL_DEFAULTS = {
  endo: "endoscopie.ste@chu-montpellier.fr",
  explo: "explo-dig-ad@chu-montpellier.fr",
  radio_ste: "radiologie-ste@chu-montpellier.fr",
  tep: "medecinenucleairelap@chu-montpellier.fr",
};
const TPL_DEMANDE_DEFAUT = `Bonjour,

Veuillez trouver en pièce jointe une demande d'examen endoscopique pour {civilite} {prenom} {nom} {ne_le} {ddn}.

Examens demandés : {examens}
Délai souhaité : {delai}

Cordialement,
{medecin}
Secrétariat : {tel_secretariat}
{balf}`;

const TPL_PATIENT_DEFAUT = `Bonjour {civilite} {nom},

Veuillez trouver en pièce jointe les documents concernant votre prise en charge :
{liste_documents}

Merci de les lire attentivement et d'apporter les documents signés le jour de l'examen.

Cordialement,
{medecin}
Secrétariat : {tel_secretariat}
{balf}`;

function mailCfg() {
  const base = { ...MAIL_DEFAULTS, tplDemande: TPL_DEMANDE_DEFAUT, tplPatient: TPL_PATIENT_DEFAUT };
  try { return { ...base, ...JSON.parse(localStorage.getItem(MAIL_KEY) || "{}") }; }
  catch (_) { return base; }
}

/** Remplit un modèle {variable} puis nettoie lignes/espaces orphelins. */
function fillTpl(tpl, vars) {
  return tpl
    .replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? "").toString())
    .replace(/[ \t]+([.,\n])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+$/gm, "")
    .trim();
}

function openMailModal() {
  const c = mailCfg();
  $("#mc-endo").value = c.endo; $("#mc-explo").value = c.explo; $("#mc-radio-ste").value = c.radio_ste;
  $("#mc-tep").value = c.tep;
  $("#mc-tpl-demande").value = c.tplDemande;
  $("#mc-tpl-patient").value = c.tplPatient;
  openModal("#modal-mails");
}
$("#mc-save").addEventListener("click", () => {
  localStorage.setItem(MAIL_KEY, JSON.stringify({
    endo: $("#mc-endo").value.trim(), explo: $("#mc-explo").value.trim(), radio_ste: $("#mc-radio-ste").value.trim(),
    tep: $("#mc-tep").value.trim(),
    tplDemande: $("#mc-tpl-demande").value, tplPatient: $("#mc-tpl-patient").value,
  }));
  closeModals();
});
$("#mc-defaults").addEventListener("click", () => {
  localStorage.removeItem(MAIL_KEY);
  openMailModal();
});

let toastTimer = null;
function toast(msg, ms = 6000) {
  const t = $("#toast");
  t.innerHTML = msg; t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.style.display = "none"), ms);
}

// ------------------------------------------------- génération PDF (envoi mail)
const loadedScripts = {};
function loadScript(src) {
  return loadedScripts[src] || (loadedScripts[src] = new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = src; s.onload = ok; s.onerror = () => ko(new Error("Chargement impossible : " + src));
    document.head.appendChild(s);
  }));
}

/** Cherche une rangée blanche proche de `target` (px) pour couper sans traverser une ligne de texte. */
function safeCutRow(canvas, cctx, target, window_) {
  const w = canvas.width;
  const from = Math.max(0, target - window_), to = Math.min(canvas.height - 1, target);
  const data = cctx.getImageData(0, from, w, to - from + 1).data;
  for (let y = to; y >= from; y--) {
    let white = true;
    const row = (y - from) * w * 4;
    for (let x = 0; x < w * 4; x += 16) { // échantillonnage 1 px sur 4
      if (data[row + x] < 246 || data[row + x + 1] < 246 || data[row + x + 2] < 246) { white = false; break; }
    }
    if (white) return y;
  }
  return target;
}

/** Rend des items en un PDF A4 multi-pages (rasterisé, coupures sur zones blanches). */
async function docsToPdf(items, ctx, filename) {
  await Promise.all([loadScript("vendor/html2canvas.min.js"), loadScript("vendor/jspdf.umd.min.js")]);
  await document.fonts.ready;
  const host = document.createElement("div");
  host.style.cssText = "position:absolute; top:0; left:-9999px; width:210mm; background:#fff;";
  host.innerHTML = await assembleDocs(items, ctx);
  document.body.appendChild(host);
  try {
    const pdf = new jspdf.jsPDF({ unit: "mm", format: "a4", compress: true });
    const pageW = 210, pageH = 297;
    let first = true;
    const blocks = host.querySelectorAll("section.doc, .fichepage");
    for (const el of blocks) {
      if (el.classList.contains("fichepage")) el.style.cssText += "box-shadow:none; margin:0; border-radius:0;";
      else el.style.cssText += "box-shadow:none; margin:0; min-height:0; padding:10mm 12mm; border-radius:0;";
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const cctx = canvas.getContext("2d");
      const pageHpx = Math.floor((canvas.width * pageH) / pageW);
      let y = 0;
      while (y < canvas.height - 4) {
        let cut = Math.min(y + pageHpx, canvas.height);
        if (cut < canvas.height) cut = Math.max(y + Math.floor(pageHpx / 2), safeCutRow(canvas, cctx, cut, Math.floor(pageHpx * 0.18)));
        const slice = document.createElement("canvas");
        slice.width = canvas.width; slice.height = cut - y;
        slice.getContext("2d").drawImage(canvas, 0, y, canvas.width, cut - y, 0, 0, canvas.width, cut - y);
        if (!first) pdf.addPage();
        first = false;
        pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, pageW, (slice.height * pageW) / slice.width);
        y = cut;
      }
    }
    return { blob: pdf.output("blob"), filename };
  } finally {
    host.remove();
  }
}

function mailVars(extra = {}) {
  const p = currentPatient();
  const med = currentMedecin();
  const civ = $("#pt-civ").value;
  return {
    civilite: civ || "M./Mme",
    prenom: p?.prenom || "",
    nom: p?.nom?.toUpperCase() || "",
    ne_le: p?.ddn ? (civ === "Mme" ? "née le" : civ === "M." ? "né le" : "né(e) le") : "",
    ddn: p?.ddn ? p.ddn.split("-").reverse().join("/") : "",
    medecin: med?.nom || "",
    tel_secretariat: med?.tel || "",
    balf: med?.mail || "",
    ...extra,
  };
}

function mailTexts(d) {
  const p = currentPatient();
  const nomAff = [p?.nom?.toUpperCase(), p?.prenom].filter(Boolean).join(" ") || "patient";
  let examens, delai;
  if (d.type === "endo") {
    examens = d.opts.examens.map((k) => (EXAMENS_ENDO_UI.find(([kk]) => kk === k) || [])[1]).filter(Boolean).join(", ") || "—";
    delai = { urgent48: "Urgent ++ (< 48 h)", urgent7: "Urgent (< 7 jours)", semi15: "Semi-urgent (< 15 jours)", autre: d.opts.delaiAutre || "autre" }[d.opts.delai];
  } else {
    examens = `${DEM_LABELS[d.type]}${d.opts.examen ? " — " + d.opts.examen : ""}`;
    delai = d.opts.dateSouhaitee || "—";
  }
  const sujet = `Demande ${DEM_MAIL_LABEL[d.type]} — ${nomAff}`;
  const corps = fillTpl(mailCfg().tplDemande, mailVars({ examens, delai }))
    .replace("demande d'examen endoscopique", `demande ${DEM_MAIL_LABEL[d.type] === "examen endoscopique" ? "d'examen endoscopique" : "d'" + DEM_MAIL_LABEL[d.type]}`);
  const fichier = `Demande ${DEM_LABELS[d.type]} - ${nomAff}.pdf`.replace(/[\/\\:*?"<>|]/g, "");
  return { sujet, corps, fichier };
}

function demandeCtx() {
  return { medecin: currentMedecin(), patient: currentPatient(), dateDoc: $("#doc-date").value || null };
}

/**
 * Encodage d'un composant mailto. Outlook Windows décode les liens mailto en
 * ANSI (cp1252), pas en UTF-8 → sur Windows on encode les accents en latin-1
 * et on remplace les caractères typographiques absents (— ’ « » …).
 */
const MAILTO_SUBST = { "—": "-", "–": "-", "’": "'", "‘": "'", "«": '"', "»": '"', "…": "...", "•": "-", "œ": "oe", "Œ": "OE", "€": "EUR", " ": " ", "☑": "[x]", "☐": "[ ]" };
function mailtoEncode(s) {
  s = String(s).replace(/[—–’‘«»…•œŒ€ ☑☐]/g, (c) => MAILTO_SUBST[c] ?? "");
  s = s.replace(/\r?\n/g, "\r\n");
  if (!/Windows/i.test(navigator.userAgent)) return encodeURIComponent(s);
  let out = "";
  for (const ch of s) {
    let cp = ch.codePointAt(0);
    if (cp > 255) {
      const ascii = ch.normalize("NFD").replace(/[̀-ͯ]/g, ""); // dernier recours : sans accent
      cp = ascii.codePointAt(0) ?? 63;
      if (cp > 255) cp = 63; // "?"
    }
    const c = String.fromCodePoint(cp);
    out += /[A-Za-z0-9\-_.~]/.test(c) ? c : "%" + cp.toString(16).toUpperCase().padStart(2, "0");
  }
  return out;
}

/**
 * Construit et télécharge un brouillon .eml (X-Unsent) avec le PDF en pièce
 * jointe. Texte encodé en windows-1252 (l'encodage qu'Outlook PC utilise par
 * défaut) : les accents restent corrects même si Outlook ignore le charset.
 */
function qpCp1252(s) {
  // même substitution typographique que mailtoEncode, puis octets latin-1
  s = String(s).replace(/[—–’‘«»…•œŒ€ ☑☐]/g, (c) => MAILTO_SUBST[c] ?? "");
  s = s.replace(/\r?\n/g, "\r\n");
  let out = "", line = "";
  for (const ch of s) {
    let cp = ch.codePointAt(0);
    if (cp === 13) continue;
    if (cp === 10) { out += line + "\r\n"; line = ""; continue; }
    if (cp > 255) {
      const a = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
      cp = a.codePointAt(0) ?? 63;
      if (cp > 255) cp = 63;
    }
    const tok = (cp >= 33 && cp <= 126 && cp !== 61) || cp === 32 || cp === 9
      ? String.fromCharCode(cp)
      : "=" + cp.toString(16).toUpperCase().padStart(2, "0");
    if (line.length + tok.length >= 74) { out += line + "=\r\n"; line = ""; }
    line += tok;
  }
  return out + line;
}

async function downloadEml(to, sujet, corps, pdfBlob, fichierPdf) {
  const b64 = await new Promise((ok) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",")[1]);
    r.readAsDataURL(pdfBlob);
  });
  // Sujet en windows-1252 (Q-encoding) — accents fiables sur Outlook PC
  const subjQ = [...sujet.replace(/[—–’‘«»…•œŒ€ ☑☐]/g, (c) => MAILTO_SUBST[c] ?? "")]
    .map((ch) => {
      let cp = ch.codePointAt(0);
      if (cp > 255) { const a = ch.normalize("NFD").replace(/[̀-ͯ]/g, ""); cp = a.codePointAt(0) ?? 63; if (cp > 255) cp = 63; }
      if (cp === 32) return "_";
      return /[A-Za-z0-9!*+\-/]/.test(String.fromCharCode(cp)) ? String.fromCharCode(cp) : "=" + cp.toString(16).toUpperCase().padStart(2, "0");
    }).join("");
  const eml = [
    "X-Unsent: 1",
    `To: ${to}`,
    `Subject: =?windows-1252?Q?${subjQ}?=`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="=_ENDOC_1"',
    "",
    "--=_ENDOC_1",
    "Content-Type: text/plain; charset=windows-1252",
    "Content-Transfer-Encoding: quoted-printable",
    "",
    qpCp1252(corps),
    "",
    "--=_ENDOC_1",
    `Content-Type: application/pdf; name="${fichierPdf}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${fichierPdf}"`,
    "",
    b64.replace(/(.{76})/g, "$1\r\n"),
    "--=_ENDOC_1--",
    "",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([eml], { type: "message/rfc822" }));
  a.download = fichierPdf.replace(/\.pdf$/, ".eml");
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}

/** Prépare le job d'envoi d'une demande (PDF généré, mail rédigé). */
async function buildDemandeJob(d) {
  const to = (d.opts.sendTo || mailCfg().endo).trim();
  const { sujet, corps, fichier } = mailTexts(d);
  const item = d.type === "endo"
    ? { type: "demande-endo", opts: { ...d.opts, telPatient: $("#pt-tel").value.trim() } }
    : { type: "demande-imagerie", kind: d.type, opts: { ...d.opts, telPatient: $("#pt-tel").value.trim(), dialyse: d.opts.dialyse === "1" || d.opts.dialyse === true } };
  const { blob } = await docsToPdf([item], demandeCtx(), fichier);
  return { label: sujet, to, sujet, corps, fichier, blob };
}

/** Prépare le job d'envoi au patient (tous les documents cochés, hors demandes). */
async function buildPatientJob() {
  const to = $("#pt-mail").value.trim();
  if (!to || !to.includes("@")) throw new Error("Renseignez l'e-mail du patient.");
  const items = selectedItems().filter((it) => it.type !== "demande-endo");
  if (!items.length) throw new Error("Aucun document coché à envoyer au patient.");
  const p = currentPatient();
  const nomAff = [p?.nom?.toUpperCase(), p?.prenom].filter(Boolean).join(" ");
  const titres = items.map((it) => it.label || (it.type === "ordolibre" ? "Ordonnance" : "Document"));
  const fichier = `Documents - ${nomAff || "patient"}.pdf`.replace(/[\/\\:*?"<>|]/g, "");
  const sujet = `Vos documents — CHU de Montpellier${nomAff ? " — " + nomAff : ""}`;
  const corps = fillTpl(mailCfg().tplPatient, mailVars({ liste_documents: titres.map((t) => "  - " + t).join("\n") }));
  const { blob } = await docsToPdf(items, demandeCtx(), fichier);
  return { label: `Documents pour le patient${nomAff ? " — " + nomAff : ""}`, to, sujet, corps, fichier, blob };
}

/** Bouton « Générer les e-mails » : PDF téléchargés + modale guidée. */
let sendJobs = [];
async function generateAllEmails() {
  const todo = demandes.filter((x) => x.type && x.opts.sendMail);
  const totalJobs = todo.length + ($("#chk-mail-patient").checked ? 1 : 0);
  let done = 0;
  const prog = () => toast(`⏳ Génération des PDF… ${++done} / ${totalJobs}`, 60000);
  const jobs = [];
  for (const d of todo) { jobs.push(await buildDemandeJob(d)); prog(); }
  if ($("#chk-mail-patient").checked) { jobs.push(await buildPatientJob()); prog(); }
  if (!jobs.length) throw new Error("Aucun envoi coché.");
  for (const j of jobs) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(j.blob); a.download = j.fichier; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    await new Promise((ok) => setTimeout(ok, 600)); // téléchargements successifs
  }
  sendJobs = jobs;
  $("#toast").style.display = "none";
  renderSendModal();
  openModal("#modal-send");
}

function openMailDraft(j) {
  const url = `mailto:${encodeURIComponent(j.to)}?subject=${mailtoEncode(j.sujet)}&body=${mailtoEncode(j.corps)}`;
  window.__lastMailto = url; // témoin pour les tests automatisés
  window.__allMailtos = (window.__allMailtos || []).concat(url);
  location.href = url;
}

function renderSendModal() {
  $("#send-list").innerHTML = sendJobs.map((j, i) => `
    <div class="med-row" style="align-items:flex-start;">
      <input type="checkbox" data-send-chk="${i}" checked style="margin-top:6px; accent-color:var(--bleu); flex:none;">
      <div class="info">
        <div class="nom">${j.label}</div>
        <div class="det">À : <strong>${j.to}</strong><br>PJ à glisser : ${j.fichier} <span style="color:#146c3a;">(téléchargé ✓)</span> <span data-status="${i}" style="color:#146c3a; font-weight:700;"></span></div>
      </div>
      <button class="subtle small" data-open-mail="${i}">📧 Ouvrir seul</button>
    </div>`).join("") +
    `<div class="btnrow" style="margin-top:10px;">
      <button class="big orange" id="send-all-mails">📧 Ouvrir tous les mails sélectionnés (l'un après l'autre)</button>
    </div>
    <div class="hint" style="margin-top:8px;">Les brouillons s'ouvrent automatiquement <strong>toutes les ~2 secondes</strong> — laissez-les s'ouvrir, puis glissez dans chacun le PDF portant le même nom, et envoyez.</div>
    <div class="hint" style="margin-top:6px;">Selon votre version d'Outlook, vous pouvez aussi essayer les <a href="#" id="send-eml-all">brouillons .eml avec PJ déjà incluse</a> — si le texte ou la pièce jointe s'affichent mal, restez sur la méthode principale.</div>`;

  $$("#send-list [data-open-mail]").forEach((b) =>
    b.addEventListener("click", () => {
      openMailDraft(sendJobs[Number(b.dataset.openMail)]);
      document.querySelector(`[data-status="${b.dataset.openMail}"]`).textContent = "· mail ouvert ✓";
    }));

  $("#send-all-mails").addEventListener("click", async () => {
    const chosen = sendJobs.map((j, i) => ({ j, i })).filter(({ i }) => document.querySelector(`[data-send-chk="${i}"]`)?.checked);
    if (!chosen.length) { toast("Aucun envoi coché.", 4000); return; }
    const btn = $("#send-all-mails");
    btn.disabled = true;
    for (let k = 0; k < chosen.length; k++) {
      const { j, i } = chosen[k];
      btn.textContent = `📧 Ouverture ${k + 1} / ${chosen.length}…`;
      openMailDraft(j);
      const st = document.querySelector(`[data-status="${i}"]`);
      if (st) st.textContent = "· mail ouvert ✓";
      if (k < chosen.length - 1) await new Promise((ok) => setTimeout(ok, 2200)); // laisse Outlook ouvrir chaque brouillon
    }
    btn.textContent = `✓ ${chosen.length} brouillon(s) ouvert(s) — joignez les PDF puis envoyez`;
    toastNext(`📧 ${chosen.length} brouillon(s) ouvert(s) — joignez les PDF puis envoyez.`);
  });

  const emlAll = document.querySelector("#send-eml-all");
  if (emlAll) emlAll.addEventListener("click", async (e) => {
    e.preventDefault();
    const chosen = sendJobs.filter((j, i) => document.querySelector(`[data-send-chk="${i}"]`)?.checked);
    for (const j of chosen) {
      await downloadEml(j.to, j.sujet, j.corps, j.blob, j.fichier);
      await new Promise((ok) => setTimeout(ok, 600));
    }
  });
}

function updateEmailButton() {
  const any = demandes.some((d) => d.type && d.opts.sendMail) || $("#chk-mail-patient").checked;
  $("#btn-emails").style.display = any ? "block" : "none";
  $("#btn-all").style.display = any ? "block" : "none";
}
$("#btn-emails").addEventListener("click", () => {
  if (!checkBeforeOutput()) return;
  generateAllEmails().catch((e) => toast("❌ " + e.message, 8000));
});
$("#btn-all").addEventListener("click", () => {
  if (!checkBeforeOutput()) return;
  openPrintChooser(true);
});
$("#chk-mail-patient").addEventListener("change", () => {
  $("#mail-patient-fields").style.display = $("#chk-mail-patient").checked ? "block" : "none";
  updateEmailButton();
});

// ------------------------------------------------------ demandes d'examen
const demandes = [];
let demandeSeq = 0;

const EXAMENS_ENDO_UI = [
  ["gastroscopie", "Gastroscopie"], ["coloscopie", "Coloscopie"],
  ["coloscopie_courte", "Coloscopie courte"], ["videocapsule", "Vidéocapsule"],
  ["cpre", "CPRE"], ["echoendoscopie", "Échoendoscopie"],
  ["enteroscopie", "Entéroscopie"], ["duodenoscopie", "Duodénoscopie"],
  ["gep", "GEP"], ["biopsie_transjug", "Biopsie hép. transjugulaire"],
];

const SUGG_INDICATIONS = ["Dépistage", "Surveillance de polypes", "Anémie ferriprive", "Douleurs abdominales", "Rectorragies", "Troubles du transit", "Bilan d'extension", "Contrôle"];

const DEM_LABELS = {
  endo: "Endoscopie digestive", echo: "Échographie / Doppler", radio: "Radiographie",
  tdm: "Scanner (TDM)", irm: "IRM", interv: "Radio interventionnelle", tep: "TEP-TDM (méd. nucléaire)",
};
const DEM_MAIL_LABEL = {
  endo: "examen endoscopique", echo: "échographie / doppler", radio: "examen de radiologie",
  tdm: "scanner (TDM)", irm: "IRM", interv: "examen de radiologie interventionnelle", tep: "TEP-TDM",
};

function initDemandeOpts(type) {
  const commun = { service: "Hépato-Gastroentérologie", uf: "", telDemandeur: "", sendMail: false };
  if (type === "endo") return {
    ...commun, examens: [], gepMode: "pose", actes: "", indications: "", lieu: "pted",
    delai: "semi15", delaiAutre: "", hospit: "hdj", hdjService: "Gastro", hospJ: "J0",
    ag: "oui", infosPatient: "oui",
    crit: {}, iso: "", isoAutre: "", cjd: "non",
    antico: "", anticoStop: "", antiagreg: "", antiagregStop: "", tp: "", plaquettes: "",
    sendTo: mailCfg().endo,
  };
  // Imagerie — site Saint Eloi par défaut, contre-indications « non » par défaut
  const img = { ...commun, site: "steloi", examen: "", indications: "", sendTo: type === "tep" ? mailCfg().tep : mailCfg().radio_ste };
  if (type === "echo" || type === "radio") return { ...img, lit: "non", transport: "valide", risqueInf: "non", risqueInfType: "", autonomie: "" };
  if (type === "tdm") return { ...img, asthme: "non", reactionPci: "non", risqueInf: "non", risqueInfType: "", diabete: "non", ir: "non", creat: "", dialyse: false, betabloquants: "non", grossesse: "non", gammapathie: "non", ag: "non", mobilite: "normale", dateSouhaitee: "" };
  if (type === "irm") return { ...img, gado: "non", grossesse: "non", risqueInf: "non", risqueInfType: "", ir: "non", creat: "", clairance: "", materiel: {}, mobilite: "normale", cooperation: "" };
  if (type === "interv") return { ...img, bilanDate: "", tp: "", plaquettes: "", antico: "non", antiagreg: "non", ag: "non", agDate: "", reactionPci: "non", asthme: "non", diabete: "non", ir: "non", creat: "", dialyse: false, betabloquants: "non" };
  if (type === "tep") return { ...img, statut: "hospitalise", cadre: "amm", localisation: [], localisationAutre: "", interet: [], tepDeja: "non", tepDejaDetail: "", ttAucun: false, ttChirurgie: "", ttChimio: "", ttRadio: "", strategie: [], poids: "", taille: "", diabete: "non", glycemie: "", grossesse: "non", allaitement: "non", pathoInf: "", chirNonOnco: "", dateSouhaitee: "" };
  return img;
}

function newDemande() {
  const d = { id: "dem" + (++demandeSeq), type: null, opts: {} };
  demandes.push(d);
  renderDemandes();
}

const SITES_UI = {
  echo: [["steloi", "Saint Eloi"], ["adv", "ADV"], ["lapeyronie", "Lapeyronie"], ["radioped", "Radiopédiatrie ADV"], ["guichauliac", "Neuroradio Gui de Chauliac"], ["balmes", "Balmès / La Colombière"]],
  tdm4: [["steloi", "Saint Eloi"], ["adv", "ADV"], ["lapeyronie", "Lapeyronie"], ["guichauliac", "Neuroradio Gui de Chauliac"]],
};

function demandeCardImagerie(d) {
  const o = d.opts;
  const sel = (k, options, val) =>
    `<select data-d="${d.id}" data-k="${k}">${options.map(([v, l]) => `<option value="${v}" ${val === v ? "selected" : ""}>${l}</option>`).join("")}</select>`;
  const inp = (k, val, ph = "") =>
    `<input type="text" data-d="${d.id}" data-k="${k}" value="${(val || "").replace(/"/g, "&quot;")}" placeholder="${ph}">`;
  const nonOui = (k, val, label) =>
    `<label class="field"><span class="lbl">${label}</span>${sel(k, [["non", "NON"], ["oui", "OUI"]], val)}</label>`;
  const t = d.type;

  // site (pas pour interventionnel ni TEP)
  const siteRow = (t === "echo" || t === "radio")
    ? `<label class="field"><span class="lbl">Site de réalisation</span>${sel("site", SITES_UI.echo, o.site)}</label>`
    : (t === "tdm" || t === "irm")
      ? `<label class="field"><span class="lbl">Site de réalisation</span>${sel("site", SITES_UI.tdm4, o.site)}</label>`
      : "";

  const examenRow = t === "tep" ? "" :
    `<label class="field"><span class="lbl">${t === "tdm" || t === "irm" ? "Région anatomique à explorer *" : "Examen demandé *"}</span>${inp("examen", o.examen, t === "interv" ? "ex. drainage biliaire, TIPS, chimio-embolisation…" : "")}</label>`;

  const indicRow = `<label class="field"><span class="lbl">${t === "tep" ? "Histologie et commentaires *" : "Indication / contexte clinique *"}</span>
    <textarea data-d="${d.id}" data-k="indications" rows="3">${o.indications || ""}</textarea></label>
    <div style="display:flex; flex-wrap:wrap; gap:4px; margin:-4px 0 8px;">
      ${SUGG_INDICATIONS.map((s) => `<button type="button" class="subtle small" data-d="${d.id}" data-sugg="${s.replace(/"/g, "&quot;")}" style="padding:2px 8px; font-size:10.5px;">${s}</button>`).join("")}
    </div>`;

  const isoRows = `
    ${nonOui("risqueInf", o.risqueInf, "Risque infectieux / isolement")}
    ${o.risqueInf === "oui" ? `<label class="field"><span class="lbl">Type de contamination</span>${sel("risqueInfType", [["", "—"], ["contact", "Contact"], ["air", "Air"], ["gouttelettes", "Gouttelettes"]], o.risqueInfType)}</label>` : "<span></span>"}`;

  let specifics = "";
  if (t === "echo" || t === "radio") {
    specifics = `<div class="grid2">
      ${nonOui("lit", o.lit, "Examen au lit du patient")}
      <label class="field"><span class="lbl">Transport</span>${sel("transport", [["valide", "Patient valide"], ["fauteuil", "Fauteuil"], ["brancard", "Brancard"], ["litT", "Lit"]], o.transport)}</label>
      ${isoRows}
      <label class="field" style="grid-column:1 / -1;"><span class="lbl">Autonomie relationnelle (confus…)</span>${inp("autonomie", o.autonomie)}</label>
    </div>`;
  } else if (t === "tdm") {
    specifics = `<details><summary style="cursor:pointer; font-size:12.5px; font-weight:700; color:var(--rouge);">Préalables TDM obligatoires (par défaut : tout à NON)</summary>
      <div class="grid2" style="margin-top:6px;">
        ${nonOui("asthme", o.asthme, "Asthme non équilibré (< 8 j)")}
        ${nonOui("reactionPci", o.reactionPci, "Réaction sévère PCI antérieure")}
        ${isoRows}
        ${nonOui("diabete", o.diabete, "Diabète (METFORMINE : arrêt)")}
        ${nonOui("ir", o.ir, "Insuffisance rénale")}
        ${o.ir === "oui" ? `<label class="field"><span class="lbl">Créatininémie (µmol/L)</span>${inp("creat", o.creat)}</label><label class="field"><span class="lbl">Dialysé</span>${sel("dialyse", [["", "NON"], ["1", "OUI"]], o.dialyse ? "1" : "")}</label>` : ""}
        ${nonOui("betabloquants", o.betabloquants, "Bêta-bloquants")}
        ${nonOui("grossesse", o.grossesse, "Grossesse")}
        ${nonOui("gammapathie", o.gammapathie, "Gammapathie (myélome)")}
        ${nonOui("ag", o.ag, "Anesthésie générale")}
        <label class="field"><span class="lbl">Mobilité</span>${sel("mobilite", [["normale", "Normale"], ["fauteuil", "Fauteuil"], ["brancard", "Brancard"]], o.mobilite)}</label>
        <label class="field"><span class="lbl">Date souhaitée (texte libre)</span>${inp("dateSouhaitee", o.dateSouhaitee)}</label>
      </div>
    </details>`;
  } else if (t === "irm") {
    specifics = `<details><summary style="cursor:pointer; font-size:12.5px; font-weight:700; color:var(--rouge);">Préalables & contre-indications IRM (par défaut : tout à NON)</summary>
      <div class="grid2" style="margin-top:6px;">
        ${nonOui("gado", o.gado, "Allergie au gadolinium")}
        ${nonOui("grossesse", o.grossesse, "Grossesse / allaitement")}
        ${isoRows}
        ${nonOui("ir", o.ir, "Insuffisance rénale")}
        ${o.ir === "oui" ? `<label class="field"><span class="lbl">Créatininémie</span>${inp("creat", o.creat)}</label><label class="field"><span class="lbl">Clairance</span>${inp("clairance", o.clairance)}</label>` : ""}
        <label class="field"><span class="lbl">Mobilité</span>${sel("mobilite", [["normale", "Normale"], ["fauteuil", "Fauteuil"], ["brancard", "Brancard"]], o.mobilite)}</label>
        <label class="field"><span class="lbl">Coopération prévisible</span>${sel("cooperation", [["", "—"], ["claustro", "Claustrophobie"], ["ag", "Anesthésie générale"], ["ag_enfant", "AG enfant"]], o.cooperation)}</label>
      </div>
      <div class="hint" style="margin:6px 0 4px;"><strong>Matériel présent</strong> — cocher uniquement si OUI, préciser localisation/référence :</div>
      ${[["stimulateur", "Stimulateur cardiaque"], ["neuro", "Neurostimulateur"], ["clips", "Clips / structures métalliques / agrafes"], ["valves", "Valves cardiaques / matériel endo-vasculaire"], ["protheses_aud", "Prothèses auditives ou dentaires"], ["autres_protheses", "Autres prothèses"], ["osteo", "Matériel d'ostéosynthèse"], ["metaux", "Travailleur métaux / corps étrangers oculaires"], ["rea", "Matériel de réanimation"]].map(([k, l]) => `
        <div style="display:flex; gap:6px; align-items:center; margin-top:3px;">
          <input type="checkbox" data-d="${d.id}" data-mat="${k}" ${o.materiel[k] !== undefined && o.materiel[k] !== "" ? "checked" : ""} style="flex:none; accent-color:var(--bleu);">
          <span style="flex:1.4; font-size:12px;">${l}</span>
          ${o.materiel[k] !== undefined && o.materiel[k] !== "" ? `<input type="text" data-d="${d.id}" data-matloc="${k}" value="${(o.materiel[k] === true ? "" : o.materiel[k] || "").replace(/"/g, "&quot;")}" placeholder="localisation / référence" style="flex:1;">` : ""}
        </div>`).join("")}
    </details>`;
  } else if (t === "interv") {
    specifics = `<details open><summary style="cursor:pointer; font-size:12.5px; font-weight:700; color:var(--rouge);">Bilan de coagulation & préalables (obligatoire)</summary>
      <div class="grid2" style="margin-top:6px;">
        <label class="field"><span class="lbl">Date du bilan de coagulation</span>${inp("bilanDate", o.bilanDate)}</label>
        <span></span>
        <label class="field"><span class="lbl">TP</span>${inp("tp", o.tp)}</label>
        <label class="field"><span class="lbl">Plaquettes</span>${inp("plaquettes", o.plaquettes)}</label>
        ${nonOui("antico", o.antico, "Anticoagulant")}
        ${nonOui("antiagreg", o.antiagreg, "Anti-agrégants plaquettaires")}
        ${nonOui("ag", o.ag, "Geste prévu sous AG")}
        ${o.ag === "oui" ? `<label class="field"><span class="lbl">Date consultation AG</span>${inp("agDate", o.agDate)}</label>` : "<span></span>"}
        ${nonOui("reactionPci", o.reactionPci, "Réaction sévère PCI antérieure")}
        ${nonOui("asthme", o.asthme, "Asthme non équilibré (< 8 j)")}
        ${nonOui("diabete", o.diabete, "Diabète (METFORMINE)")}
        ${nonOui("betabloquants", o.betabloquants, "Bêta-bloquants")}
        ${nonOui("ir", o.ir, "Insuffisance rénale")}
        ${o.ir === "oui" ? `<label class="field"><span class="lbl">Créatininémie</span>${inp("creat", o.creat)}</label>` : "<span></span>"}
      </div>
    </details>`;
  } else if (t === "tep") {
    const multi = (k, list, sel_) => list.map(([v, l]) => `
      <label class="doc-item" style="width:50%; padding:2px 4px;"><input type="checkbox" data-d="${d.id}" data-multi="${k}" value="${v}" ${(sel_ || []).includes(v) ? "checked" : ""}><span style="font-size:12px;">${l}</span></label>`).join("");
    specifics = `
      <label class="field"><span class="lbl">Cadre de prescription</span>${sel("cadre", [["amm", "Conforme AMM"], ["sor", "Standard des SOR"], ["option_sor", "Option des SOR"], ["ucp", "Décision des UCP"], ["recherche", "Recherche"]], o.cadre)}</label>
      <div class="hint" style="margin:2px 0;">Localisation :</div>
      <div style="display:flex; flex-wrap:wrap;">${multi("localisation", [["sein", "Sein"], ["orl", "ORL"], ["colorectale", "Colo-rectale"], ["primitif", "Recherche de primitif"], ["ovaire", "Ovaire"], ["hemopathie", "Hémopathie"], ["poumon", "Poumon"], ["thyroide", "Thyroïde"], ["seminome", "Séminome"], ["autre", "Autre"]], o.localisation)}</div>
      ${(o.localisation || []).includes("autre") ? `<label class="field"><span class="lbl">Autre localisation</span>${inp("localisationAutre", o.localisationAutre)}</label>` : ""}
      <div class="hint" style="margin:2px 0;">Intérêt de la TEP :</div>
      <div style="display:flex; flex-wrap:wrap;">${multi("interet", [["diagnostic", "Diagnostic de malignité"], ["stadification", "Stadification"], ["surveillance", "Surveillance du traitement"], ["recidive_syst", "Récidive (recherche syst.)"], ["image_anormale", "Image anormale / douteuse"], ["masse_residuelle", "Masse résiduelle"], ["marqueur", "Élévation du marqueur"], ["preop_recidive", "Bilan préop. récidive"], ["autre", "Autre"]], o.interet)}</div>
      <details><summary style="cursor:pointer; font-size:12.5px; font-weight:700; color:var(--gris);">Antécédents, traitements, biométrie</summary>
        <div class="grid2" style="margin-top:6px;">
          ${nonOui("tepDeja", o.tepDeja, "TEP déjà réalisée")}
          ${o.tepDeja === "oui" ? `<label class="field"><span class="lbl">Date et lieu</span>${inp("tepDejaDetail", o.tepDejaDetail)}</label>` : "<span></span>"}
          <label class="field"><span class="lbl">Chirurgie tumorale (date)</span>${inp("ttChirurgie", o.ttChirurgie)}</label>
          <label class="field"><span class="lbl">Chimiothérapie (dernière cure)</span>${inp("ttChimio", o.ttChimio)}</label>
          <label class="field"><span class="lbl">Radiothérapie (dernière séance)</span>${inp("ttRadio", o.ttRadio)}</label>
          <label class="field"><span class="lbl">Statut patient</span>${sel("statut", [["hospitalise", "Hospitalisé (CHU)"], ["externe", "Externe"]], o.statut)}</label>
          <label class="field"><span class="lbl">Poids (kg)</span>${inp("poids", o.poids)}</label>
          <label class="field"><span class="lbl">Taille (cm)</span>${inp("taille", o.taille)}</label>
          ${nonOui("diabete", o.diabete, "Diabète")}
          ${o.diabete === "oui" ? `<label class="field"><span class="lbl">Glycémie à jeun</span>${inp("glycemie", o.glycemie)}</label>` : "<span></span>"}
          ${nonOui("grossesse", o.grossesse, "Grossesse")}
          ${nonOui("allaitement", o.allaitement, "Allaitement")}
          <label class="field"><span class="lbl">Pathologie infectieuse (préciser)</span>${inp("pathoInf", o.pathoInf)}</label>
          <label class="field"><span class="lbl">Chirurgie non oncologique</span>${inp("chirNonOnco", o.chirNonOnco)}</label>
          <label class="field" style="grid-column:1 / -1;"><span class="lbl">Date / délai de rendez-vous souhaité</span>${inp("dateSouhaitee", o.dateSouhaitee)}</label>
        </div>
      </details>`;
  }

  return `
  ${siteRow}
  ${examenRow}
  ${indicRow}
  ${specifics}
  <details style="margin-top:2px;">
    <summary style="cursor:pointer; font-size:12.5px; color:var(--gris);">Service demandeur (pré-rempli)</summary>
    <div class="grid2" style="margin-top:6px;">
      <label class="field"><span class="lbl">Service</span>${inp("service", o.service)}</label>
      <label class="field"><span class="lbl">Code UF</span>${inp("uf", o.uf)}</label>
      <label class="field" style="grid-column:1 / -1;"><span class="lbl">Téléphone (défaut : secrétariat du médecin)</span>${inp("telDemandeur", o.telDemandeur)}</label>
    </div>
  </details>
  <div style="border-top:1px solid #cfe1f0; margin-top:8px; padding-top:6px;">
    <label class="doc-item" style="padding:2px 0;">
      <input type="checkbox" data-d="${d.id}" data-sendmail ${o.sendMail ? "checked" : ""}>
      <span>📧 <strong>Envoyer la demande par mail</strong> (${d.type === "tep" ? "médecine nucléaire" : "radiologie"})</span>
    </label>
    ${o.sendMail ? `<label class="field" style="margin-top:4px;"><span class="lbl">Envoyer à — <a href="#" data-mailcfg>⚙ paramètres</a></span>${inp("sendTo", o.sendTo)}</label>` : ""}
  </div>
  <div data-warn="${d.id}"></div>`;
}

function demandeCard(d) {
  if (!d.type) {
    return `<div style="margin-top:6px;">
      <div class="hint" style="margin:0 0 6px;">Quel type d'examen ?</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
        ${Object.entries(DEM_LABELS).map(([k, l]) => `<button class="small" data-dtype="${k}" data-d="${d.id}">${l}</button>`).join("")}
        <button class="subtle small" disabled title="Bientôt disponible">Explorations fonct. (bientôt)</button>
      </div>
    </div>`;
  }
  if (d.type !== "endo") return demandeCardImagerie(d);
  const o = d.opts;
  const ex = EXAMENS_ENDO_UI.map(([k, lbl]) => `
    <label class="doc-item" style="width:50%; padding:2px 4px;">
      <input type="checkbox" data-d="${d.id}" data-ex="${k}" ${o.examens.includes(k) ? "checked" : ""}>
      <span style="font-size:12.5px;">${lbl}</span>
    </label>`).join("");
  const gepModes = o.examens.includes("gep")
    ? `<div style="display:flex; gap:12px; font-size:12px; margin:2px 0 4px 4px;">
        ${["pose", "changement", "retrait"].map((m) => `<label style="cursor:pointer;"><input type="radio" name="gep-${d.id}" data-d="${d.id}" data-k="gepMode" value="${m}" ${o.gepMode === m ? "checked" : ""}> ${m}</label>`).join("")}
      </div>` : "";
  const sel = (k, options, val) =>
    `<select data-d="${d.id}" data-k="${k}">${options.map(([v, l]) => `<option value="${v}" ${val === v ? "selected" : ""}>${l}</option>`).join("")}</select>`;
  const inp = (k, val, ph = "") =>
    `<input type="text" data-d="${d.id}" data-k="${k}" value="${(val || "").replace(/"/g, "&quot;")}" placeholder="${ph}">`;

  return `
  <div style="display:flex; flex-wrap:wrap; margin-top:4px;">${ex}</div>
  ${gepModes}
  <label class="field"><span class="lbl">Actes thérapeutiques probables (optionnel)</span>${inp("actes", o.actes, "prothèse, ligature, dilatation…")}</label>
  <div style="border:1.5px solid var(--rouge); border-radius:10px; padding:8px 10px; margin:4px 0 8px; background:#FCECEA;">
    <div style="font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; letter-spacing:.05em; font-weight:700; font-size:12px; color:var(--rouge);">Lieu de réalisation *</div>
    <div style="display:flex; gap:8px; margin-top:6px;">
      <button type="button" class="small ${o.lieu !== "bloc" ? "" : "subtle"}" data-d="${d.id}" data-lieu="pted" ${Object.values(o.crit).some(Boolean) ? "disabled" : ""} style="flex:1;">PTED</button>
      <button type="button" class="small ${o.lieu === "bloc" ? "" : "subtle"}" data-d="${d.id}" data-lieu="bloc" style="flex:1;">Bloc opératoire</button>
    </div>
    <div class="hint" style="margin-top:6px;">Critères imposant le bloc <strong>(cocher = bascule automatique)</strong> :</div>
    <div style="display:flex; flex-wrap:wrap;">
      ${[["imc", "IMC > 40"], ["htap", "HTAP > 50 mmHg"], ["fevg", "FEVG < 35 % / assist."], ["htic", "HTIC"], ["irc", "Insuff. respiratoire chronique"]].map(([k, l]) =>
        `<label class="doc-item" style="width:50%; padding:2px 4px;"><input type="checkbox" data-d="${d.id}" data-crit="${k}" ${o.crit[k] ? "checked" : ""}><span style="font-size:12px;">${l}</span></label>`).join("")}
    </div>
  </div>
  <label class="field"><span class="lbl">Indications *</span>
    <textarea data-d="${d.id}" data-k="indications" rows="3" placeholder="Contexte clinique et indication de l'examen">${o.indications}</textarea>
  </label>
  <div style="display:flex; flex-wrap:wrap; gap:4px; margin:-4px 0 8px;">
    ${SUGG_INDICATIONS.map((s) => `<button type="button" class="subtle small" data-d="${d.id}" data-sugg="${s.replace(/"/g, "&quot;")}" style="padding:2px 8px; font-size:10.5px;">${s}</button>`).join("")}
  </div>
  <div class="grid2">
    <label class="field"><span class="lbl">Délai souhaité</span>
      ${sel("delai", [["urgent48", "Urgent ++ (< 48 h)"], ["urgent7", "Urgent (< 7 jours)"], ["semi15", "Semi-urgent (< 15 jours)"], ["autre", "Autre…"]], o.delai)}
    </label>
    ${o.delai === "autre" ? `<label class="field"><span class="lbl">Précision délai</span>${inp("delaiAutre", o.delaiAutre)}</label>` : "<span></span>"}
    <label class="field"><span class="lbl">Hospitalisation</span>
      ${sel("hospit", [["deja", "Déjà hospitalisé"], ["hdj", "Hôpital de jour"], ["hosp", "Hospitalisation"], ["externe", "Externe (sans AG)"]], o.hospit)}
    </label>
    ${o.hospit === "hdj" ? `<label class="field"><span class="lbl">Service HDJ</span>${inp("hdjService", o.hdjService)}</label>` :
      o.hospit === "hosp" ? `<label class="field"><span class="lbl">Entrée</span>${sel("hospJ", [["J0", "J0"], ["J-1", "J-1"], ["J-2", "J-2"]], o.hospJ)}</label>` : "<span></span>"}
    <label class="field"><span class="lbl">Anesthésie générale</span>${sel("ag", [["oui", "OUI"], ["non", "NON"]], o.ag)}</label>
    <label class="field"><span class="lbl">Infos délivrées au patient</span>${sel("infosPatient", [["oui", "OUI"], ["non", "NON"]], o.infosPatient)}</label>
  </div>
  <details style="margin-top:4px;">
    <summary style="cursor:pointer; font-size:12.5px; font-weight:700; color:var(--rouge);">Informations cliniques obligatoires (risques, anticoagulants…)</summary>

    <div class="grid2">
      <label class="field"><span class="lbl">Isolement</span>
        ${sel("iso", [["", "Aucun"], ["bhre", "BHRe"], ["tuberculose", "Tuberculose"], ["autre", "Autre…"]], o.iso)}
      </label>
      ${o.iso === "autre" ? `<label class="field"><span class="lbl">Précision isolement</span>${inp("isoAutre", o.isoAutre)}</label>` :
        `<label class="field"><span class="lbl">Risque Creutzfeldt-Jakob</span>${sel("cjd", [["non", "NON"], ["oui", "OUI"]], o.cjd)}</label>`}
      ${o.iso === "autre" ? `<label class="field"><span class="lbl">Risque Creutzfeldt-Jakob</span>${sel("cjd", [["non", "NON"], ["oui", "OUI"]], o.cjd)}</label>` : "<span></span>"}
      <label class="field"><span class="lbl">Anticoagulant (lequel)</span>${inp("antico", o.antico)}</label>
      <label class="field"><span class="lbl">Stoppé quand</span>${inp("anticoStop", o.anticoStop)}</label>
      <label class="field"><span class="lbl">Anti-agrégant (lequel)</span>${inp("antiagreg", o.antiagreg)}</label>
      <label class="field"><span class="lbl">Stoppé quand</span>${inp("antiagregStop", o.antiagregStop)}</label>
      <label class="field"><span class="lbl">TP</span>${inp("tp", o.tp)}</label>
      <label class="field"><span class="lbl">Plaquettes</span>${inp("plaquettes", o.plaquettes)}</label>
    </div>
  </details>
  <details style="margin-top:2px;">
    <summary style="cursor:pointer; font-size:12.5px; color:var(--gris);">Service demandeur (pré-rempli)</summary>
    <div class="grid2" style="margin-top:6px;">
      <label class="field"><span class="lbl">Service</span>${inp("service", o.service)}</label>
      <label class="field"><span class="lbl">Code UF</span>${inp("uf", o.uf)}</label>
      <label class="field" style="grid-column:1 / -1;"><span class="lbl">Téléphone (défaut : secrétariat du médecin)</span>${inp("telDemandeur", o.telDemandeur)}</label>
    </div>
  </details>
  <div style="border-top:1px solid #cfe1f0; margin-top:8px; padding-top:6px;">
    <label class="doc-item" style="padding:2px 0;">
      <input type="checkbox" data-d="${d.id}" data-sendmail ${o.sendMail ? "checked" : ""}>
      <span>📧 <strong>Envoyer la demande par mail au secrétariat</strong></span>
    </label>
    ${o.sendMail ? `<label class="field" style="margin-top:4px;"><span class="lbl">Envoyer à — <a href="#" data-mailcfg>⚙ paramètres</a></span>${inp("sendTo", o.sendTo)}</label>` : ""}
  </div>
  <div data-warn="${d.id}"></div>`;
}

function refreshDemandeWarnings() {
  for (const d of demandes) {
    const el = document.querySelector(`[data-warn="${d.id}"]`);
    if (!el || !d.type) continue;
    const w = demandeWarnings(d);
    el.innerHTML = w.length
      ? `<div style="background:#FFF4E6; border:1px solid #f3c98a; border-radius:8px; padding:6px 10px; margin-top:6px; font-size:11.5px; color:#6b4a1a; line-height:1.5;">⚠ À compléter : ${w.join(" · ")}</div>`
      : "";
  }
}

function renderDemandes() {
  const root = $("#demandes");
  // mémorise les sections dépliées de chaque carte (le re-rendu les refermerait)
  const openMap = {};
  root.querySelectorAll("[data-card]").forEach((card) => {
    openMap[card.dataset.card] = [...card.querySelectorAll("details")].map((dt) => dt.open);
  });
  root.innerHTML = demandes.map((d) => {
    let resume = "";
    if (d.type === "endo") {
      const exLbls = (d.opts.examens || []).map((k) => (EXAMENS_ENDO_UI.find(([kk]) => kk === k) || [])[1]).filter(Boolean);
      resume = " — " + (exLbls.join(", ") || "endoscopie");
    } else if (d.type) {
      resume = " — " + DEM_LABELS[d.type] + (d.opts.examen ? " · " + d.opts.examen : "");
    }
    return `<div style="border:1.5px solid var(--bleu); border-radius:10px; padding:8px 10px; margin-bottom:10px; background:var(--bleu-pale);" data-card="${d.id}">
      <div style="display:flex; align-items:center; gap:8px;">
        <strong style="flex:1; font-size:13px;">🩺 Demande d'examen${resume}</strong>
        <button class="subtle small" data-del-dem="${d.id}">✕ retirer</button>
      </div>
      ${demandeCard(d)}
    </div>`;
  }).join("");

  // structure : choix du type / suppression (re-render nécessaire)
  root.querySelectorAll("[data-dtype]").forEach((b) => b.addEventListener("click", () => {
    const d = demandes.find((x) => x.id === b.dataset.d);
    d.type = b.dataset.dtype;
    d.opts = initDemandeOpts(d.type);
    renderDemandes(); updateEmailButton(); refreshSoon();
  }));
  root.querySelectorAll("[data-del-dem]").forEach((b) => b.addEventListener("click", () => {
    demandes.splice(demandes.findIndex((x) => x.id === b.dataset.delDem), 1);
    renderDemandes(); updateEmailButton(); refreshSoon();
  }));
  root.querySelectorAll("[data-sendmail]").forEach((cb) => cb.addEventListener("change", () => {
    demandes.find((x) => x.id === cb.dataset.d).opts.sendMail = cb.checked;
    renderDemandes();
    updateEmailButton();
  }));
  root.querySelectorAll("[data-lieu]").forEach((b) => b.addEventListener("click", () => {
    const d = demandes.find((x) => x.id === b.dataset.d);
    d.opts.lieu = b.dataset.lieu;
    renderDemandes(); refreshSoon();
  }));
  root.querySelectorAll("[data-mailcfg]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    openMailModal();
  }));

  // restaure les sections dépliées
  root.querySelectorAll("[data-card]").forEach((card) => {
    const states = openMap[card.dataset.card];
    if (states) [...card.querySelectorAll("details")].forEach((dt, i) => { if (states[i]) dt.open = true; });
  });

  refreshDemandeWarnings();
}

// Saisie dans les formulaires de demande : mise à jour sans re-render (focus conservé),
// sauf changements structurels (examens cochés, délai/hospit/iso) qui re-rendent la carte.
$("#demandes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-sugg]");
  if (!b) return;
  const d = demandes.find((x) => x.id === b.dataset.d);
  if (!d) return;
  d.opts.indications = (d.opts.indications ? d.opts.indications.replace(/\s+$/, "") + ". " : "") + b.dataset.sugg;
  const ta = document.querySelector(`textarea[data-d="${d.id}"][data-k="indications"]`);
  if (ta) ta.value = d.opts.indications;
  refreshDemandeWarnings();
  refreshSoon();
});

$("#demandes").addEventListener("input", (e) => {
  const t = e.target, d = demandes.find((x) => x.id === t.dataset.d);
  if (!d) return;
  if (t.dataset.k) d.opts[t.dataset.k] = t.value;
  if (t.dataset.crit) {
    d.opts.crit[t.dataset.crit] = t.checked;
    if (d.type === "endo" && Object.values(d.opts.crit).some(Boolean)) d.opts.lieu = "bloc";
  }
  if (t.dataset.ex) {
    const set = new Set(d.opts.examens);
    t.checked ? set.add(t.dataset.ex) : set.delete(t.dataset.ex);
    d.opts.examens = [...set];
  }
  if (t.dataset.multi) {
    const set = new Set(d.opts[t.dataset.multi] || []);
    t.checked ? set.add(t.value) : set.delete(t.value);
    d.opts[t.dataset.multi] = [...set];
  }
  if (t.dataset.mat) {
    if (t.checked) d.opts.materiel[t.dataset.mat] = d.opts.materiel[t.dataset.mat] || " ";
    else delete d.opts.materiel[t.dataset.mat];
  }
  if (t.dataset.matloc) d.opts.materiel[t.dataset.matloc] = t.value;
  refreshDemandeWarnings();
  refreshSoon();
});
$("#demandes").addEventListener("change", (e) => {
  const t = e.target, d = demandes.find((x) => x.id === t.dataset.d);
  if (!d) return;
  if (t.dataset.ex || t.dataset.mat || t.dataset.multi || t.dataset.crit ||
      ["delai", "hospit", "iso", "risqueInf", "ir", "ag", "diabete", "tepDeja"].includes(t.dataset.k || "")) renderDemandes();
});

$("#btn-create-demande").addEventListener("click", () => {
  newDemande();
  $("#demandes").lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Boutons d'accès rapide : ouvrent / referment une catégorie (masquée par défaut)
function openCategory(gid) {
  $("#search").value = "";
  activeCat = activeCat === gid ? null : gid;
  applyCatalogVisibility();
  if (activeCat)
    document.querySelector(`#catalogue .cat-group[data-g="${gid}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
$("#btn-cat-prepa").addEventListener("click", () => openCategory("g-ordo"));
$("#btn-cat-notes").addEventListener("click", () => openCategory("g-notes"));

// ------------------------------------------------------------ parcours types
const PARCOURS_KEY = "endoc.parcours.v1";
const PREPS = [["plenvu", "PLENVU®"], ["izinova", "IZINOVA®"], ["moviprep", "MOVIPREP®"], ["ximepeg", "XIMEPEG®"], ["citrafleet", "CITRAFLEET®"]];
const listParcoursPerso = () => {
  try { return JSON.parse(localStorage.getItem(PARCOURS_KEY) || "[]"); } catch (_) { return []; }
};

function findCatalogItem(ref) {
  for (const g of CATALOG) for (const it of g.items) if (it.id === ref) return it;
  return null;
}
function findOrdoType(name) {
  for (const c of ORDO_TYPES) {
    const it = c.items.find((i) => i.name === name);
    if (it) return it;
  }
  return null;
}

const ELEM_ICON = { doc: "📄", prep: "🧴", ordotype: "💊", ordochoice: "💊", demande: "🩺" };
function elemIcon(el) {
  if (el.t === "doc") {
    if (el.ref.startsWith("regime:")) return "🍽";
    if (el.ref.startsWith("etp:")) return el.ref.includes("reeduc") || ["etp:resp_diaphragme", "etp:eructations", "etp:rumination", "etp:ballonnement", "etp:aerophagie"].includes(el.ref) ? "📘" : "🎓";
    if (el.ref.startsWith("ordo:")) return "🧴";
  }
  return ELEM_ICON[el.t] || "📄";
}
function elemLabel(el) {
  if (el.t === "doc") return findCatalogItem(el.ref)?.label || el.ref;
  if (el.t === "prep") return "Ordonnance + guide de préparation colique";
  if (el.t === "ordotype") return "Ordonnance : " + el.name;
  if (el.t === "ordochoice") return "Ordonnance : " + el.label;
  if (el.t === "demande") return el.label;
  return "?";
}

let currentPack = null; // {name, elements} affiché dans l'écran de composition

const PACKRECENT_KEY = "endoc.packrecents.v1";
function pushRecentPack(ci, id) {
  let arr = [];
  try { arr = JSON.parse(localStorage.getItem(PACKRECENT_KEY) || "[]"); } catch (_) {}
  arr = [`${ci}:${id}`, ...arr.filter((x) => x !== `${ci}:${id}`)].slice(0, 4);
  localStorage.setItem(PACKRECENT_KEY, JSON.stringify(arr));
}
function recentPacks() {
  let arr = [];
  try { arr = JSON.parse(localStorage.getItem(PACKRECENT_KEY) || "[]"); } catch (_) {}
  return arr.map((s) => {
    const [ci, id] = s.split(":");
    const p = PARCOURS_DEFS[Number(ci)]?.items.find((x) => x.id === id);
    return p ? { ci: Number(ci), p } : null;
  }).filter(Boolean);
}

function renderParcoursList() {
  const perso = listParcoursPerso();
  const recents = recentPacks();
  $("#parcours-list").innerHTML =
    (recents.length ? `<div class="mhint" style="margin:0 0 4px;"><strong>⭐ Récents</strong></div>
      <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:8px;">
        ${recents.map((r, i) => `<button class="small" data-recent="${i}">${r.p.name}</button>`).join("")}
      </div>` : "") +
    PARCOURS_DEFS.map((c, ci) => `<details ${ci === 0 ? "open" : ""} style="margin-bottom:6px;">
      <summary style="cursor:pointer; font-weight:700; font-size:13px; color:var(--bleu-fonce); padding:4px 2px;">${c.icon} ${c.cat} <span style="color:var(--gris-clair); font-weight:600; font-size:11px;">${c.items.length}</span></summary>
      ${c.items.map((p) => `<button class="subtle small" data-pack="${ci}:${p.id}" style="display:block; width:100%; text-align:left; margin-top:3px;">${p.name}${p.desc ? `<br><span style="font-weight:400; color:var(--gris-clair); font-size:10.5px;">${p.desc}</span>` : ""}</button>`).join("")}
    </details>`).join("") +
    (perso.length ? `<div class="mhint" style="margin:10px 0 4px;"><strong>📦 Mes packs (ce poste)</strong></div>` +
      perso.map((p, i) => `<div style="display:flex; gap:4px; margin-top:3px;">
        <button class="subtle small" data-pack-perso="${i}" style="flex:1; text-align:left;">${p.name} <span class="badge-local">perso</span></button>
        <button class="danger small" data-del-pack="${i}">✕</button>
      </div>`).join("") : "");

  $$("#parcours-list [data-recent]").forEach((b) => b.addEventListener("click", () => {
    openPackCompose(recentPacks()[Number(b.dataset.recent)].p);
  }));
  $$("#parcours-list [data-pack]").forEach((b) => b.addEventListener("click", () => {
    const [ci, id] = b.dataset.pack.split(":");
    const p = PARCOURS_DEFS[Number(ci)].items.find((x) => x.id === id);
    openPackCompose(p);
  }));
  $$("#parcours-list [data-pack-perso]").forEach((b) => b.addEventListener("click", () => {
    applyPersoPack(listParcoursPerso()[Number(b.dataset.packPerso)]);
  }));
  $$("#parcours-list [data-del-pack]").forEach((b) => b.addEventListener("click", () => {
    const arr = listParcoursPerso();
    if (!confirm(`Supprimer le pack « ${arr[Number(b.dataset.delPack)].name} » ?`)) return;
    arr.splice(Number(b.dataset.delPack), 1);
    localStorage.setItem(PARCOURS_KEY, JSON.stringify(arr));
    renderParcoursList();
  }));
}

function openPackCompose(p) {
  currentPack = p;
  $("#parcours-home").style.display = "none";
  $("#parcours-compose").style.display = "block";
  $("#pc-title").textContent = p.name;
  $("#pc-desc").textContent = p.desc || "Les essentiels sont cochés — ajustez puis ajoutez.";
  $("#pc-elements").innerHTML = p.elements.map((el, i) => `
    <div style="display:flex; gap:8px; align-items:center; border:1px solid var(--bord); border-radius:9px; padding:6px 10px; margin-top:5px; ${el.on ? "" : "background:#f7fafc;"}">
      <input type="checkbox" data-pc-el="${i}" ${el.on ? "checked" : ""} style="flex:none; accent-color:var(--bleu);">
      <span style="flex:none;">${elemIcon(el)}</span>
      <span style="flex:1; font-size:12.5px; ${el.on ? "" : "color:var(--gris);"}">${elemLabel(el)}${el.on ? "" : ' <span style="font-size:10px; color:var(--gris-clair);">(option)</span>'}</span>
      ${el.t === "prep" ? `<select data-pc-prep="${i}" style="width:120px; flex:none;">${PREPS.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select>` : ""}
      ${el.t === "ordochoice" ? `<select data-pc-choice="${i}" style="max-width:220px; flex:none;">${el.options.map((o2) => `<option value="${o2.replace(/"/g, "&quot;")}">${o2}</option>`).join("")}</select>` : ""}
    </div>`).join("");
}

$("#pc-back").addEventListener("click", (e) => {
  e.preventDefault();
  $("#parcours-compose").style.display = "none";
  $("#parcours-home").style.display = "block";
});

$("#pc-apply").addEventListener("click", () => {
  if (!currentPack) return;
  let n = 0;
  currentPack.elements.forEach((el, i) => {
    if (!document.querySelector(`[data-pc-el="${i}"]`)?.checked) return;
    n++;
    if (el.t === "doc") selection.add(el.ref);
    else if (el.t === "prep") selection.add("ordo:" + (document.querySelector(`[data-pc-prep="${i}"]`)?.value || "plenvu"));
    else if (el.t === "ordotype" || el.t === "ordochoice") {
      const name = el.t === "ordotype" ? el.name : document.querySelector(`[data-pc-choice="${i}"]`)?.value;
      const it = findOrdoType(name);
      if (!it) { toast("Ordonnance type introuvable : " + name, 6000); return; }
      const med = currentMedecin();
      const texte = it.content.replaceAll("{MEDECIN}", med ? med.nom : "votre médecin").replaceAll("{FAX}", med?.fax || "………………");
      const strip = (s) => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (ordos.some((o) => strip(o.texte + o.textAld) === strip(texte))) { n--; return; } // déjà présent
      newOrdo({ mode: "simple", texte });
    } else if (el.t === "demande") {
      const sig = JSON.stringify([el.kind || "endo", el.opts?.examens || [], el.opts?.actes || ""]);
      if (demandes.some((d) => JSON.stringify([d.type, d.opts.examens || [], d.opts.actes || ""]) === sig)) { n--; return; } // déjà présente
      newDemande();
      const d = demandes[demandes.length - 1];
      d.type = el.kind || "endo";
      d.opts = { ...initDemandeOpts(d.type), ...JSON.parse(JSON.stringify(el.opts || {})) };
    }
  });
  for (let ci = 0; ci < PARCOURS_DEFS.length; ci++)
    if (PARCOURS_DEFS[ci].items.some((x) => x.id === currentPack.id)) pushRecentPack(ci, currentPack.id);
  renderDemandes();
  renderCatalog();
  refresh();
  closeModals();
  $("#parcours-compose").style.display = "none";
  $("#parcours-home").style.display = "block";
  toast(`📦 Pack « ${currentPack.name} » : ${n} élément(s) ajouté(s) — ajustez si besoin puis imprimez / envoyez.`, 7000);
});

// pack personnel : instantané complet (documents + ordonnances + demandes)
function applyPersoPack(p) {
  for (const ref of p.docs || []) selection.add(ref);
  for (const o of p.ordos || []) newOrdo(o);
  for (const def of p.demandes || []) {
    newDemande();
    const d = demandes[demandes.length - 1];
    d.type = def.type || "endo";
    d.opts = { ...initDemandeOpts(d.type), ...JSON.parse(JSON.stringify(def.opts || {})) };
  }
  renderDemandes();
  renderCatalog();
  refresh();
  closeModals();
  toast(`📦 Pack « ${p.name} » appliqué.`, 5000);
}

$("#btn-parcours").addEventListener("click", () => {
  $("#parcours-compose").style.display = "none";
  $("#parcours-home").style.display = "block";
  renderParcoursList();
  openModal("#modal-parcours");
});
$("#btn-save-parcours").addEventListener("click", () => {
  if (!selection.size && !demandes.some((d) => d.type) && !ordos.some((o) => !o.fresh)) {
    alert("Préparez d'abord un dossier (documents cochés, ordonnances, demandes)."); return;
  }
  const name = prompt("Nom du pack (ex. « Ma colo standard ») :");
  if (!name || !name.trim()) return;
  const arr = listParcoursPerso().filter((x) => x.name !== name.trim());
  arr.push({
    name: name.trim(),
    docs: [...selection],
    ordos: ordos.filter((o) => !o.fresh).map((o) => ({ mode: o.mode, texte: o.texte, textAld: o.textAld, textNonAld: o.textNonAld, duree: o.duree })),
    demandes: demandes.filter((d) => d.type).map((d) => ({ type: d.type, opts: { ...d.opts, sendMail: false } })),
  });
  localStorage.setItem(PARCOURS_KEY, JSON.stringify(arr));
  renderParcoursList();
  toast(`💾 Pack « ${name.trim()} » enregistré sur ce poste.`, 5000);
});

// -------------------------------------------------- validation douce demandes
function demandeWarnings(d) {
  const w = [], o = d.opts;
  if (d.type === "endo") {
    if (!o.examens.length) w.push("aucun examen coché");
    if (!o.indications.trim()) w.push("indications non renseignées");
    if (o.ag === "oui" && o.hospit === "externe") w.push("AG cochée avec hospitalisation « Externe » (réservée aux examens sans AG)");
    if (o.infosPatient === "non") w.push("informations non délivrées au patient (le consentement doit être joint)");
    return w;
  }
  if (d.type === "tep") {
    if (!(o.localisation || []).length) w.push("localisation non cochée");
    if (!(o.interet || []).length) w.push("intérêt de la TEP non coché");
    if (!o.indications.trim()) w.push("histologie / commentaires non renseignés");
    return w;
  }
  if (!o.examen.trim()) w.push(d.type === "tdm" || d.type === "irm" ? "région anatomique non renseignée" : "examen demandé non renseigné");
  if (!o.indications.trim()) w.push("indication / contexte clinique non renseigné");
  if (d.type === "interv" && (!o.tp.trim() || !o.plaquettes.trim())) w.push("bilan de coagulation incomplet (TP / plaquettes)");
  return w;
}

/** Contrôle non bloquant avant impression / envoi. Retourne false si l'utilisateur annule. */
function confirmDemandeWarnings() {
  const msgs = demandes.filter((d) => d.type).flatMap((d, i) =>
    demandeWarnings(d).map((w) => `Demande ${i + 1} : ${w}`));
  if (!msgs.length) return true;
  return confirm(`⚠ Le PTED rejette les demandes incomplètes :\n\n– ${msgs.join("\n– ")}\n\nGénérer quand même ?`);
}

// ---------------------------------------------------------------- affiche QR
const SITE_URL = "https://dochge.pages.dev/";
$("#btn-affiche").addEventListener("click", async (e) => {
  e.preventDefault();
  await loadScript("vendor/qrcode.min.js");
  const qr = qrcode(0, "M");
  qr.addData(SITE_URL);
  qr.make();
  const svg = qr.createSvgTag({ cellSize: 6, margin: 2 });
  const logo = new URL("chu-logo.webp", location.href).href;
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Affiche — Doc'HGE</title>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet">
    <style>@page{size:A4;margin:0} *{box-sizing:border-box} body{margin:0;font-family:'Barlow',sans-serif}
    .page{width:210mm;height:297mm;padding:22mm 20mm;display:flex;flex-direction:column;align-items:center;text-align:center}
    @media print{.no-print{display:none}}</style></head><body>
    <div class="no-print" style="position:fixed;top:14px;right:14px;"><button onclick="print()" style="font:700 14px Barlow;background:#0072BC;color:#fff;border:none;border-radius:8px;padding:10px 18px;cursor:pointer;">Imprimer</button></div>
    <div class="page">
      <img src="${logo}" style="height:64px;">
      <div style="font-family:'Barlow Condensed';text-transform:uppercase;letter-spacing:.08em;color:#0072BC;font-weight:700;font-size:17px;margin-top:20px;">CHU de Montpellier · Hépato-Gastroentérologie</div>
      <h1 style="font-weight:800;color:#0d2b45;font-size:37px;line-height:1.1;margin:8px 0 0;">Doc'HGE<br>Documents patients</h1>
      <div style="height:4px;width:90px;background:#EF7D00;border-radius:2px;margin:16px 0 22px;"></div>
      <div style="font-size:17px;color:#1c3a52;line-height:1.6;max-width:150mm;">Notes d'information &amp; consentement · ordonnances de préparation colique · ordonnances · demandes d'examen — <strong>au nom de chaque médecin</strong>, imprimables et envoyables par e-mail en quelques clics.</div>
      <div style="margin:26px 0 10px;">${svg.replace("<svg ", '<svg style="width:70mm;height:70mm;" ')}</div>
      <div style="font-weight:700;color:#0072BC;font-size:19px;">${SITE_URL.replace("https://", "")}</div>
      <div style="margin-top:auto;background:#EAF3FB;border-radius:12px;padding:12px 22px;font-size:13.5px;color:#1c3a52;line-height:1.6;max-width:160mm;">Première utilisation : « Gérer les médecins » → ajoutez votre nom, secrétariat, RPPS et BALF (une seule fois par poste).<br><span style="color:#4a5b68;">Aucune donnée patient n'est transmise : tout reste sur votre ordinateur.</span></div>
    </div></body></html>`);
  w.document.close();
});

// ------------------------------------------------------------------- régimes
function renderRegimesModal(query = "") {
  const words = norm(query.trim()).split(/\s+/).filter(Boolean);
  const q = words.length > 0;
  $("#rg-list").innerHTML = REGIMES.map((c) => {
    const items = c.items.filter((f) => {
      if (!q) return true;
      const hay = norm(f.name + " " + c.cat + " " + f.pourquoi);
      return words.every((w) => hay.includes(w));
    });
    if (!items.length) return "";
    return `<details ${q ? "open" : ""} style="margin-bottom:6px;">
      <summary style="cursor:pointer; font-weight:700; font-size:13px; color:var(--bleu-fonce); padding:4px 2px;">${c.icon || ""} ${c.cat} <span style="color:var(--gris-clair); font-weight:600; font-size:11px;">${items.length}</span></summary>
      ${items.map((f) => {
        const N = REGIME_NIVEAUX[f.niveau];
        const on = selection.has("regime:" + f.id);
        return `<button class="subtle small" data-rg="${f.id}" style="display:flex; width:100%; text-align:left; margin-top:3px; gap:8px; align-items:center; ${on ? "background:var(--bleu-pale); border:1px solid var(--bleu);" : ""}">
          <span style="flex:none;">${N.badge}</span>
          <span style="flex:1;">${f.name}</span>
          <span style="flex:none; font-weight:800; color:${on ? "var(--bleu)" : "var(--gris-clair)"};">${on ? "✓ ajoutée" : "+"}</span>
        </button>`;
      }).join("")}
    </details>`;
  }).join("") || `<div class="hint">Aucun résultat.</div>`;

  $$("#rg-list [data-rg]").forEach((b) => b.addEventListener("click", () => {
    const id = "regime:" + b.dataset.rg;
    selection.has(id) ? selection.delete(id) : selection.add(id);
    renderCatalog();
    refresh();
    renderRegimesModal($("#rg-search").value);
  }));
}
$("#btn-regimes").addEventListener("click", () => { renderRegimesModal(); openModal("#modal-regimes"); });
$("#rg-search").addEventListener("input", () => renderRegimesModal($("#rg-search").value));

// ------------------------------------------------------- éducation thérapeutique
function renderEtpModal(query = "") {
  const words = norm(query.trim()).split(/\s+/).filter(Boolean);
  const q = words.length > 0;
  $("#etp-list").innerHTML = ETP.map((ax) => {
    const items = ax.items.filter((f) => {
      if (!q) return true;
      const hay = norm(f.name + " " + ax.axe + " " + (f.enclair || "") + " " + (f.objectifs || []).join(" "));
      return words.every((w) => hay.includes(w));
    });
    if (!items.length) return "";
    return `<details ${q ? "open" : ""} style="margin-bottom:6px;">
      <summary style="cursor:pointer; font-weight:700; font-size:13px; color:var(--bleu-fonce); padding:4px 2px;">${ax.icon || ""} ${ax.axe} <span style="color:var(--gris-clair); font-weight:600; font-size:11px;">${items.length}</span></summary>
      ${items.map((f) => {
        const on = selection.has("etp:" + f.id);
        return `<button class="subtle small" data-etp="${f.id}" style="display:flex; width:100%; text-align:left; margin-top:3px; gap:8px; align-items:center; ${on ? "background:var(--bleu-pale); border:1px solid var(--bleu);" : ""}">
          <span style="flex:none;">${f.type === "livret" ? "📘" : "📄"}</span>
          <span style="flex:1;">${f.name}${f.star ? ` <span style="color:#E1A500;">${"★".repeat(f.star)}</span>` : ""}</span>
          <span style="flex:none; font-weight:800; color:${on ? "var(--bleu)" : "var(--gris-clair)"};">${on ? "✓ ajoutée" : "+"}</span>
        </button>`;
      }).join("")}
    </details>`;
  }).join("") || `<div class="hint">Aucun résultat.</div>`;

  $$("#etp-list [data-etp]").forEach((b) => b.addEventListener("click", () => {
    const id = "etp:" + b.dataset.etp;
    selection.has(id) ? selection.delete(id) : selection.add(id);
    renderCatalog();
    refresh();
    renderEtpModal($("#etp-search").value);
  }));
}
$("#btn-etp").addEventListener("click", () => { renderEtpModal(); openModal("#modal-etp"); });
$("#etp-search").addEventListener("input", () => renderEtpModal($("#etp-search").value));

// ------------------------------------------------------------------ recherche
function renderSearchExtra() {
  const words = norm($("#search").value.trim()).split(/\s+/).filter(Boolean);
  const box = $("#search-extra");
  if (!words.length) { box.style.display = "none"; box.innerHTML = ""; return; }
  const hits = [];
  // ordonnances types (nom + mots-clés + contenu)
  outer1:
  for (const c of ORDO_TYPES) for (const it of c.items) {
    const hay = norm(it.name + " " + (it.kw || "") + " " + it.content);
    if (words.every((w) => hay.includes(w))) {
      hits.push({ k: "type", label: it.name, cat: c.cat, name: it.name });
      if (hits.length >= 8) break outer1;
    }
  }
  // packs
  for (const c of PARCOURS_DEFS) for (const p of c.items) {
    const hay = norm(p.name + " " + c.cat + " " + (p.desc || ""));
    if (words.every((w) => hay.includes(w)) && hits.length < 10) hits.push({ k: "pack", label: p.name, ci: PARCOURS_DEFS.indexOf(c), id: p.id });
  }
  if (!hits.length) { box.style.display = "none"; box.innerHTML = ""; return; }
  box.style.display = "block";
  box.innerHTML = hits.slice(0, 6).map((h2, i) =>
    `<button class="subtle small" data-sx="${i}" style="display:flex; width:100%; text-align:left; gap:7px; margin-top:3px; align-items:center;">
      <span style="flex:none;">${h2.k === "type" ? "💊" : "📦"}</span>
      <span style="flex:1;">${h2.k === "type" ? "Ordonnance type : " : "Pack : "}<strong>${h2.label}</strong></span>
      <span style="flex:none; color:var(--gris-clair); font-weight:800;">＋</span>
    </button>`).join("");
  box.querySelectorAll("[data-sx]").forEach((b) => b.addEventListener("click", () => {
    const h2 = hits[Number(b.dataset.sx)];
    if (h2.k === "type") {
      activeOrdoId = null;
      applyOrdoType(findOrdoType(h2.name));
    } else {
      const p = PARCOURS_DEFS[h2.ci].items.find((x) => x.id === h2.id);
      openPackCompose(p);
      openModal("#modal-parcours");
      $("#parcours-home").style.display = "none";
      $("#parcours-compose").style.display = "block";
    }
    $("#search").value = "";
    applyCatalogVisibility();
    renderSearchExtra();
  }));
}
$("#search").addEventListener("input", () => { applyCatalogVisibility(); renderSearchExtra(); });
$("#search").addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  // 1er document visible non coché → cocher ; sinon 1re action étendue
  const cb = [...document.querySelectorAll("#catalogue .doc-item input[data-doc]")].find((x) => x.closest(".doc-item").offsetParent !== null && x.closest(".cat-group").style.display !== "none" && !x.checked);
  if (cb) {
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    toast("✓ " + cb.closest(".doc-item").textContent.trim().split("\n")[0].slice(0, 60), 2500);
    return;
  }
  document.querySelector("#search-extra [data-sx]")?.click();
});

// compteur de sélection : « tout décocher » + décocher un document précis
$("#sel-count").addEventListener("click", (e) => {
  const unsel = e.target.closest("[data-unsel]");
  if (unsel) {
    e.preventDefault();
    selection.delete(unsel.dataset.unsel);
    renderCatalog();
    refresh();
    return;
  }
  const unchip = e.target.closest("[data-unchip]");
  if (unchip) {
    e.preventDefault();
    const [kind, id] = unchip.dataset.unchip.split(":");
    if (kind === "ordo") { ordos.splice(ordos.findIndex((o) => o.id === id), 1); renderOrdos(); }
    else { demandes.splice(demandes.findIndex((d) => d.id === id), 1); renderDemandes(); updateEmailButton(); }
    refresh();
    return;
  }
  if (e.target.id !== "clear-sel") return;
  e.preventDefault();
  selection.clear();
  ordos.length = 0; renderOrdos();
  demandes.length = 0; renderDemandes(); updateEmailButton();
  renderCatalog();
  refresh();
});

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

// ------------------------------------------------------------ réinitialiser
$("#btn-reset").addEventListener("click", () => {
  // Documents cochés + recherche + catalogue replié
  selection.clear();
  $("#search").value = "";
  activeCat = null;
  // Ordonnance libre
  ordos.length = 0;
  renderOrdos();
  // Demandes d'examen
  demandes.length = 0;
  renderDemandes();
  // Patient + générique + date du jour
  ["#pt-nom", "#pt-prenom", "#pt-ddn", "#pt-examen", "#pt-tel", "#pt-civ", "#pt-mail"].forEach((id) => ($(id).value = ""));
  $("#chk-mail-patient").checked = false;
  $("#mail-patient-fields").style.display = "none";
  updateEmailButton();
  $("#chk-generic").checked = false;
  $("#panel-patient").style.opacity = "1";
  const d = new Date();
  $("#doc-date").value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  sessionStorage.removeItem("endoc.session.v1");
  // Le médecin sélectionné est conservé.
  renderCatalog();
  refresh();
  window.scrollTo({ top: 0, behavior: "smooth" });
});


// ------------------------------------------------------- choix d'impression
function itemLabel(it) {
  if (it.label) return it.label;
  if (it.type === "ordolibre") {
    const t = (it.opts.mode === "ald" ? it.opts.textAld : it.opts.texte).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return "Ordonnance" + (it.opts.mode === "ald" ? " ALD" : "") + (t ? " — " + t.slice(0, 30) + (t.length > 30 ? "…" : "") : "");
  }
  if (it.type === "demande-endo") {
    const ex = (it.opts.examens || []).map((k) => (EXAMENS_ENDO_UI.find(([kk]) => kk === k) || [])[1]).filter(Boolean);
    return "Demande d'examen — " + (ex.join(", ") || "endoscopie");
  }
  if (it.type === "demande-imagerie") return "Demande — " + DEM_LABELS[it.kind] + (it.opts.examen ? " · " + it.opts.examen : "");
  return "Document";
}

let printItems = [];
let printThenEmails = false;

/** Ouvre le choix d'impression (direct si un seul document). */
function openPrintChooser(thenEmails) {
  printItems = selectedItems();
  printThenEmails = !!thenEmails;
  if (printItems.length <= 1) { doPrint(printItems); return; }
  $("#print-list").innerHTML = printItems.map((it, i) => `
    <label class="doc-item" style="padding:5px 6px;">
      <input type="checkbox" data-print-idx="${i}" checked>
      <span>${itemLabel(it)}</span>
    </label>`).join("");
  openModal("#modal-print");
}

async function doPrint(chosen) {
  closeModals();
  if (chosen.length) {
    renderSeq++; // invalide les rendus en cours
    const ctx = {
      medecin: currentMedecin(), patient: currentPatient(),
      dateDoc: $("#chk-generic").checked ? null : $("#doc-date").value || null,
    };
    $("#print-root").innerHTML = await assembleDocs(chosen, ctx);
    // le PDF « Enregistrer en PDF » prendra le nom du patient
    const p = currentPatient();
    const oldTitle = document.title;
    document.title = p && (p.nom || p.prenom) ? `${[p.nom?.toUpperCase(), p.prenom].filter(Boolean).join(" ")} — Doc'HGE` : "Documents — Doc'HGE";
    window.print(); // bloquant jusqu'à fermeture du dialogue
    document.title = oldTitle;
    refresh(); // restaure l'aperçu complet
  }
  if (printThenEmails) generateAllEmails().catch((e) => toast("❌ " + e.message, 8000));
  else if (chosen.length) toastNext("🖨 Impression lancée.");
}

/** Toast avec enchaînement patient suivant / nouveau dossier. */
function toastNext(prefix) {
  toast(`${prefix}<br><a href="#" data-tnext="keep" style="color:#8fc2ea; font-weight:700;">🆕 Patient suivant (mêmes documents)</a> &nbsp;·&nbsp; <a href="#" data-tnext="new" style="color:#8fc2ea; font-weight:700;">↺ Nouveau dossier</a>`, 12000);
}
$("#toast").addEventListener("click", (e) => {
  const t = e.target.closest("[data-tnext]");
  if (!t) return;
  e.preventDefault();
  $("#toast").style.display = "none";
  if (t.dataset.tnext === "keep") newPatientKeepDocs();
  else $("#btn-reset").click();
});

$("#btn-print-go").addEventListener("click", () => {
  const chosen = printItems.filter((_, i) => document.querySelector(`[data-print-idx="${i}"]`)?.checked);
  if (!chosen.length && !printThenEmails) { toast("Aucun document coché.", 4000); return; }
  doPrint(chosen);
});

// --------------------------------------------------------------- impression
function checkBeforeOutput() {
  if (!$("#chk-generic").checked && !currentMedecin()) {
    if (!confirm("⚠ Aucun médecin sélectionné (saisie libre vide) : les documents sortiront en version GÉNÉRIQUE, sans nom de médecin ni RPPS.\n\nContinuer quand même ?")) return false;
  }
  return confirmDemandeWarnings();
}

$("#btn-print").addEventListener("click", () => {
  if (!checkBeforeOutput()) return;
  openPrintChooser(false);
});

// ------------------------------------------------------------------ liaison
$("#sel-medecin").addEventListener("change", () => {
  $("#medecin-libre").style.display = $("#sel-medecin").value === "__libre" ? "block" : "none";
  localStorage.setItem(LASTMED_KEY, $("#sel-medecin").value);
  renderTopbarMed();
  refreshSoon();
});
["#ml-nom", "#ml-spec", "#ml-tel", "#ml-rpps", "#ml-mail", "#pt-nom", "#pt-prenom", "#pt-ddn", "#pt-examen",
 "#pt-tel"]
  .forEach((id) => $(id).addEventListener("input", refreshSoon));

// ------------------------------------ ordonnances types personnelles (poste)
const UT_KEY = "endoc.ordotypes.v1";
const UTCAT_KEY = "endoc.ordotypecats.v1";
const listUserTypes = () => {
  try { return JSON.parse(localStorage.getItem(UT_KEY) || "[]"); } catch (_) { return []; }
};
const saveUserTypes = (arr) => localStorage.setItem(UT_KEY, JSON.stringify(arr));
const listUserCats = () => {
  let explicit = [];
  try { explicit = JSON.parse(localStorage.getItem(UTCAT_KEY) || "[]"); } catch (_) {}
  const fromItems = listUserTypes().map((t) => t.cat);
  return [...new Set([...explicit, ...fromItems])].filter((c) => !ORDO_TYPES.some((b) => b.cat === c));
};
const saveUserCats = (arr) => localStorage.setItem(UTCAT_KEY, JSON.stringify(arr));

// Migration : anciens « Mes modèles » → ordonnances types perso
(() => {
  try {
    const old = JSON.parse(localStorage.getItem("endoc.ordomodeles.v1") || "[]");
    if (old.length) {
      const arr = listUserTypes();
      for (const m of old) arr.push({ id: "ut" + Math.random().toString(36).slice(2, 9), cat: "MES ORDONNANCES", name: m.name, mode: m.mode || "simple", texte: m.texte || "", textAld: m.textAld || "", textNonAld: m.textNonAld || "", duree: m.duree || "" });
      saveUserTypes(arr);
      localStorage.removeItem("endoc.ordomodeles.v1");
    }
  } catch (_) {}
})();



// ------------------------------------------------- bibliothèque de types
function allTypeCats() {
  // catégories intégrées (ordre fixe) puis catégories perso
  const user = listUserTypes();
  const cats = ORDO_TYPES.map((c) => ({ cat: c.cat, builtin: c.items, perso: user.filter((t) => t.cat === c.cat) }));
  for (const c of listUserCats()) cats.push({ cat: c, builtin: [], perso: user.filter((t) => t.cat === c) });
  return cats;
}

const ORDO_CAT_ICONS = {
  "BILANS BIOLOGIQUES": "🧪", "RGO & H. PYLORI": "🔥", "HÉPATOLOGIE": "🫀",
  "MICI": "🟣", "FONCTIONNELS & MOTILITÉ": "🌀", "PROCTOLOGIE": "🍑",
  "ONCOLOGIE": "🎗", "NUTRITION & GEP": "🥤", "FER, VITAMINES & CARENCES": "🩸",
  "SOINS À DOMICILE (IDE)": "🏠", "AUTRES TRAITEMENTS": "💊",
};
const catIcon = (c) => ORDO_CAT_ICONS[c] || "📁";

function renderOrdoTypes(query = "") {
  const words = norm(query.trim()).split(/\s+/).filter(Boolean);
  const q = words.length > 0;
  const match = (name, content, kw) => {
    if (!q) return true;
    const hay = norm(name) + " " + norm(content || "") + " " + norm(kw || "");
    return words.every((w) => hay.includes(w));
  };
  $("#ot-list").innerHTML = allTypeCats().map((c) => {
    const builtin = c.builtin.filter((it) => match(it.name, it.content, it.kw));
    const perso = c.perso.filter((it) => match(it.name, (it.texte || "") + (it.textAld || ""), ""));
    const isUserCat = !ORDO_TYPES.some((b) => b.cat === c.cat);
    if (!builtin.length && !perso.length && (q || !isUserCat)) return "";
    return `<details ${q ? "open" : ""} style="margin-bottom:6px;">
      <summary style="cursor:pointer; font-weight:700; font-size:13px; color:var(--bleu-fonce); padding:4px 2px;">${catIcon(c.cat)} ${c.cat}
        <span style="color:var(--gris-clair); font-weight:600; font-size:11px;">${builtin.length + perso.length}</span>
        ${isUserCat ? `<span style="float:right;"><a href="#" data-cat-ren="${c.cat}" title="Renommer la catégorie">✎</a>&nbsp;&nbsp;<a href="#" data-cat-del="${c.cat}" title="Supprimer la catégorie" style="color:var(--rouge);">✕</a></span>` : ""}
      </summary>
      ${builtin.map((it) => `<button class="subtle small" data-ot-cat="${c.cat}" data-ot-name="${it.name.replace(/"/g, "&quot;")}" style="display:block; width:100%; text-align:left; margin-top:3px;">${it.name}</button>`).join("")}
      ${perso.map((it) => `<div style="display:flex; gap:4px; margin-top:3px;">
        <button class="subtle small" data-ut-id="${it.id}" style="flex:1; text-align:left;">${it.name} <span class="badge-local">perso</span></button>
        <button class="subtle small" data-ut-ren="${it.id}" title="Renommer / changer de catégorie">✎</button>
        <button class="subtle small" data-ut-del="${it.id}" title="Supprimer" style="color:var(--rouge);">✕</button>
      </div>`).join("")}
    </details>`;
  }).join("") || `<div class="hint">Aucun résultat.</div>`;

  $$("#ot-list [data-ot-name]").forEach((b) => b.addEventListener("click", () => {
    const item = ORDO_TYPES.find((c) => c.cat === b.dataset.otCat).items.find((i) => i.name === b.dataset.otName);
    applyOrdoType(item);
  }));
  $$("#ot-list [data-ut-id]").forEach((b) => b.addEventListener("click", () => {
    applyUserType(listUserTypes().find((t) => t.id === b.dataset.utId));
  }));
  $$("#ot-list [data-ut-del]").forEach((b) => b.addEventListener("click", () => {
    const t = listUserTypes().find((x) => x.id === b.dataset.utDel);
    if (t && confirm(`Supprimer « ${t.name} » ?`)) {
      saveUserTypes(listUserTypes().filter((x) => x.id !== t.id));
      renderOrdoTypes($("#ot-search").value);
    }
  }));
  $$("#ot-list [data-ut-ren]").forEach((b) => b.addEventListener("click", () => {
    const arr = listUserTypes();
    const t = arr.find((x) => x.id === b.dataset.utRen);
    if (!t) return;
    const name = prompt("Nom de l'ordonnance :", t.name);
    if (name === null) return;
    const cat = prompt("Catégorie (existante ou nouvelle) :", t.cat);
    if (cat === null) return;
    t.name = (name.trim() || t.name);
    t.cat = (cat.trim().toUpperCase() || t.cat);
    saveUserTypes(arr);
    renderOrdoTypes($("#ot-search").value);
  }));
  $$("#ot-list [data-cat-ren]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    const oldCat = el.dataset.catRen;
    const cat = prompt("Nouveau nom de la catégorie :", oldCat);
    if (!cat || !cat.trim()) return;
    const nc = cat.trim().toUpperCase();
    const arr = listUserTypes();
    arr.forEach((t) => { if (t.cat === oldCat) t.cat = nc; });
    saveUserTypes(arr);
    saveUserCats(listUserCats().map((x) => (x === oldCat ? nc : x)).filter((x) => x !== oldCat || x === nc).concat(nc).filter((v, i, s) => s.indexOf(v) === i));
    renderOrdoTypes($("#ot-search").value);
  }));
  $$("#ot-list [data-cat-del]").forEach((el) => el.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    const cat = el.dataset.catDel;
    const n = listUserTypes().filter((t) => t.cat === cat).length;
    if (!confirm(`Supprimer la catégorie « ${cat} »${n ? ` et ses ${n} ordonnance(s)` : ""} ?`)) return;
    saveUserTypes(listUserTypes().filter((t) => t.cat !== cat));
    saveUserCats(listUserCats().filter((x) => x !== cat));
    renderOrdoTypes($("#ot-search").value);
  }));
}
$("#ot-search").addEventListener("input", () => renderOrdoTypes($("#ot-search").value));

function targetOrdo() {
  let o = ordos.find((x) => x.id === activeOrdoId);
  if (!o) o = newOrdo({});
  return o;
}

function applyUserType(t) {
  if (!t) return;
  const toHtml = (v) => (/[<>]/.test(v || "") ? v : (v || "").replace(/\n/g, "<br>"));
  const o = targetOrdo();
  const hasContent = (o.texte + o.textAld).replace(/<[^>]*>/g, "").trim();
  if (hasContent && !confirm("Remplacer le contenu de cette ordonnance ?")) return;
  o.mode = t.mode || "simple";
  o.texte = toHtml(t.texte);
  o.textAld = toHtml(t.textAld);
  o.textNonAld = toHtml(t.textNonAld);
  o.duree = t.duree || "";
  o.fresh = false;
  closeModals();
  renderOrdos();
  toast(`📋 « ${t.name} » chargée.`, 4000);
  refreshSoon();
}

// Enregistrer l'ordonnance actuelle comme type (avec choix de catégorie)
function openSaveTypeModal() {
  const o = ordos.find((x) => x.id === activeOrdoId);
  if (!o || !(o.texte + o.textAld).replace(/<[^>]*>/g, "").trim()) { toast("L'ordonnance est vide.", 4000); return; }
  const cats = [...ORDO_TYPES.map((c) => c.cat), ...listUserCats()];
  $("#st-cat").innerHTML =
    cats.map((c) => `<option value="${c}">${catIcon(c)} ${c}</option>`).join("") +
    `<option value="__new">＋ Nouvelle catégorie…</option>`;
  $("#st-name").value = "";
  openModal("#modal-savetype");
  $("#st-name").focus();
}
$("#st-save").addEventListener("click", () => {
  const name = $("#st-name").value.trim();
  if (!name) { alert("Donnez un nom à l'ordonnance."); return; }
  let cat = $("#st-cat").value;
  if (cat === "__new") {
    const c = prompt("Nom de la nouvelle catégorie :");
    if (!c || !c.trim()) return;
    cat = c.trim().toUpperCase();
    saveUserCats([...listUserCats(), cat]);
  }
  const o = ordos.find((x) => x.id === activeOrdoId) || {};
  const arr = listUserTypes().filter((t) => !(t.name === name && t.cat === cat));
  arr.push({
    id: "ut" + Math.random().toString(36).slice(2, 9), cat, name,
    mode: o.mode || "simple", texte: o.texte || "",
    textAld: o.textAld || "", textNonAld: o.textNonAld || "", duree: o.duree || "",
  });
  saveUserTypes(arr);
  closeModals();
  toast(`💾 « ${name} » enregistrée dans ${cat} (sur ce poste).`, 6000);
});

function applyOrdoType(item) {
  const med = currentMedecin();
  const content = item.content
    .replaceAll("{MEDECIN}", med ? med.nom : "votre médecin")
    .replaceAll("{FAX}", med?.fax || "………………");
  const o = targetOrdo();
  const target = o.mode === "ald" ? "textAld" : "texte";
  const hasContent = o[target].replace(/<[^>]*>/g, "").trim();
  if (hasContent && !confirm("Remplacer le contenu de cette ordonnance ?")) return;
  o[target] = content;
  o.fresh = false;
  closeModals();
  renderOrdos();
  toast(`📋 « ${item.name} » chargée — modifiez librement puis choisissez simple ou ALD.`, 6000);
  refreshSoon();
}
$("#chk-generic").addEventListener("change", () => {
  $("#panel-patient").style.opacity = $("#chk-generic").checked ? ".45" : "1";
  refreshSoon();
});

// ------------------------------------------------- profils & bienvenue
const PROFILE_KEY = "endoc.profile.v1";
const getProfile = () => {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch (_) { return null; }
};
function setProfile(p) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  renderProfileChip();
}
function renderTopbarMed() {
  const sel = $("#topbar-med");
  const isSec = getProfile()?.type === "secretariat";
  sel.style.display = isSec ? "block" : "none";
  if (!isSec) return;
  sel.innerHTML = listMedecins().map((m) => `<option value="${m.id}" ${$("#sel-medecin").value === m.id ? "selected" : ""}>👨‍⚕️ ${m.nom}</option>`).join("");
}

function renderProfileChip() {
  const p = getProfile();
  let label = "Choisir mon profil";
  if (p?.type === "secretariat") label = "🗂 Secrétariat";
  if (p?.type === "medecin") {
    const m = listMedecins().find((x) => x.id === p.medecinId);
    label = "👨‍⚕️ " + (m ? m.nom : "Médecin");
  }
  $("#profile-chip").textContent = label;
  renderTopbarMed();
}
$("#profile-chip").addEventListener("click", () => openModal("#modal-welcome"));
$("#topbar-med").addEventListener("change", () => {
  $("#sel-medecin").value = $("#topbar-med").value;
  localStorage.setItem(LASTMED_KEY, $("#topbar-med").value);
  refreshSoon();
});

if (!localStorage.getItem("endoc.welcomed")) {
  openModal("#modal-welcome");
}
$("#wl-close").addEventListener("click", () => {
  localStorage.setItem("endoc.welcomed", "1");
  closeModals();
});
$("#wl-medecin").addEventListener("click", () => {
  localStorage.setItem("endoc.welcomed", "1");
  closeModals();
  const p = getProfile();
  if (p?.type === "medecin" && p.medecinId) return; // déjà configuré
  setProfile({ type: "medecin", medecinId: null }); // complété à l'enregistrement de la fiche
  renderMedList();
  openModal("#modal-medecins");
  $("#btn-med-add").click();
});
$("#wl-secretariat").addEventListener("click", () => {
  localStorage.setItem("endoc.welcomed", "1");
  setProfile({ type: "secretariat" });
  closeModals();
  toast("🗂 Profil secrétariat : tous les médecins de la liste sont disponibles. Pensez à importer la liste du service (« Gérer les médecins » → Importer).", 9000);
});

// ---------------------------------------------- coller l'identité (DPI)
function parseIdentity(raw) {
  let s = raw.replace(/\s+/g, " ").trim();
  if (!s) return null;
  const out = {};
  // civilité
  const civ = s.match(/\b(M\.|Mr|Monsieur|Mme|Madame|Mlle)\b\.?/i);
  if (civ) {
    out.civ = /^m(r|\.|onsieur)?$/i.test(civ[1].replace(".", "")) || /^mr$/i.test(civ[1]) || /^monsieur$/i.test(civ[1]) || civ[1] === "M." ? "M." : "Mme";
    s = s.replace(civ[0], " ");
  }
  // date (jj/mm/aaaa, jj-mm-aaaa, jj.mm.aaaa ou aaaa-mm-jj)
  const d1 = s.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\b/);
  const d2 = s.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (d1) { out.ddn = `${d1[3]}-${d1[2].padStart(2, "0")}-${d1[1].padStart(2, "0")}`; s = s.replace(d1[0], " "); }
  else if (d2) { out.ddn = d2[0]; s = s.replace(d2[0], " "); }
  // né(e) le, etc.
  s = s.replace(/\bn[ée]e?\s*(\(e\))?\s*le\b/gi, " ").replace(/[,;·]/g, " ").replace(/\s+/g, " ").trim();
  const toks = s.split(" ").filter((t) => /[A-Za-zÀ-ÿ'-]{2,}/.test(t));
  if (toks.length) {
    const upper = toks.filter((t) => t === t.toUpperCase() && t !== t.toLowerCase());
    const rest = toks.filter((t) => !(t === t.toUpperCase() && t !== t.toLowerCase()));
    if (upper.length && rest.length) { out.nom = upper.join(" "); out.prenom = rest.join(" "); }
    else if (toks.length >= 2) { out.nom = toks[0].toUpperCase(); out.prenom = toks.slice(1).join(" "); }
    else out.nom = toks[0].toUpperCase();
  }
  return (out.nom || out.ddn) ? out : null;
}

$("#pt-paste").addEventListener("input", () => {
  const p = parseIdentity($("#pt-paste").value);
  if (!p || (!p.nom && !p.ddn)) return;
  if (p.civ) $("#pt-civ").value = p.civ;
  if (p.nom) $("#pt-nom").value = p.nom;
  if (p.prenom) $("#pt-prenom").value = p.prenom;
  if (p.ddn) $("#pt-ddn").value = p.ddn;
  $("#pt-paste").value = "";
  toast(`⚡ Identité remplie : ${p.civ || ""} ${p.nom || ""} ${p.prenom || ""}${p.ddn ? " · " + p.ddn.split("-").reverse().join("/") : ""}`, 4000);
  refreshSoon();
});

// ---------------------------------------------- patient suivant (mode série)
function newPatientKeepDocs() {
  ["#pt-nom", "#pt-prenom", "#pt-ddn", "#pt-examen", "#pt-tel", "#pt-civ", "#pt-mail", "#pt-paste"].forEach((id) => ($(id).value = ""));
  $("#chk-mail-patient").checked = false;
  $("#mail-patient-fields").style.display = "none";
  updateEmailButton();
  refresh();
  window.scrollTo({ top: 0, behavior: "smooth" });
  $("#pt-paste").focus();
  toast("🆕 Patient suivant — documents, ordonnances et demandes conservés.", 4000);
}
$("#btn-next-patient").addEventListener("click", newPatientKeepDocs);

// Date du document : pré-remplie à aujourd'hui (fuseau local)
const now = new Date();
$("#doc-date").value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
$("#doc-date").addEventListener("input", refreshSoon);

// Raccourcis : Ctrl/Cmd+Entrée = imprimer · Échap = fermer les fenêtres
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !$("#btn-print").disabled) {
    e.preventDefault();
    $("#btn-print").click();
  }
  if (e.key === "Escape") closeModals();
});

document.querySelector(".topbar .t2").textContent += ` · v${APP_VERSION}`;
renderProfileChip();

// ------------------------------------------- autosauvegarde de session
// sessionStorage : survit au rechargement / plantage d'onglet, disparaît à la
// fermeture — aucune donnée patient persistante sur poste partagé.
const SESSION_KEY = "endoc.session.v1";
function saveSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      sel: [...selection],
      ordos: ordos.map((o) => ({ ...o })),
      demandes: demandes.map((d) => ({ id: d.id, type: d.type, opts: d.opts })),
      patient: { civ: $("#pt-civ").value, nom: $("#pt-nom").value, prenom: $("#pt-prenom").value, ddn: $("#pt-ddn").value, examen: $("#pt-examen").value, tel: $("#pt-tel").value, mail: $("#pt-mail").value, mailChk: $("#chk-mail-patient").checked },
      date: $("#doc-date").value,
      generic: $("#chk-generic").checked,
    }));
  } catch (_) { /* stockage plein : tant pis */ }
}
function restoreSession() {
  let s;
  try { s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch (_) { return false; }
  if (!s) return false;
  const hasContent = (s.sel || []).length || (s.ordos || []).length || (s.demandes || []).length || s.patient?.nom;
  if (!hasContent) return false;
  (s.sel || []).forEach((id) => selection.add(id));
  (s.ordos || []).forEach((o) => { ordos.push({ ...o, id: "ord" + (++ordoSeq) }); });
  (s.demandes || []).forEach((d) => { demandes.push({ id: "dem" + (++demandeSeq), type: d.type, opts: d.opts }); });
  const p = s.patient || {};
  $("#pt-civ").value = p.civ || ""; $("#pt-nom").value = p.nom || ""; $("#pt-prenom").value = p.prenom || "";
  $("#pt-ddn").value = p.ddn || ""; $("#pt-examen").value = p.examen || ""; $("#pt-tel").value = p.tel || "";
  $("#pt-mail").value = p.mail || ""; $("#chk-mail-patient").checked = !!p.mailChk;
  $("#mail-patient-fields").style.display = p.mailChk ? "block" : "none";
  if (s.date) $("#doc-date").value = s.date;
  $("#chk-generic").checked = !!s.generic;
  renderOrdos(); renderDemandes(); updateEmailButton();
  toast("💾 Dossier en cours restauré — « ↺ Nouveau » pour repartir de zéro.", 6000);
  return true;
}

// Détection de nouvelle version (contre les caches) — toutes les 5 min + au focus
async function checkVersion() {
  try {
    const r = await fetch("version.json?t=" + Math.floor(Date.now() / 60000), { cache: "no-store" });
    if (!r.ok) return;
    const v = (await r.json()).version;
    if (v && v !== APP_VERSION) {
      toast(`🔄 Nouvelle version disponible (v${v}) — <a href="#" onclick="location.reload(true); return false;" style="color:#8fc2ea; font-weight:700;">Recharger</a>`, 30000);
    }
  } catch (_) { /* hors-ligne : silencieux */ }
}
setInterval(checkVersion, 5 * 60 * 1000);
window.addEventListener("focus", checkVersion);
setTimeout(checkVersion, 15000);

renderCatalog();
renderMedecinSelect();
restoreSession();
refresh();
