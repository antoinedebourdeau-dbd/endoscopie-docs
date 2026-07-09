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
  // Les fiches illustrées sont des notes d'information & consentement comme les autres.
  for (const f of FICHE_ITEMS)
    notesEndo.push({ id: "fiche:" + f.key, type: "fiche", key: f.key, label: f.label, sub: "Note d'information illustrée (recto-verso)" });
  notesEndo.sort((a, b) => a.label.localeCompare(b.label, "fr"));
  notesExplo.sort((a, b) => a.label.localeCompare(b.label, "fr"));

  const groups = [
    { id: "g-ordo", title: "Préparations coliques & ordonnances", items: ORDO_ITEMS.map((o) => ({ id: "ordo:" + o.key, type: "ordo", key: o.key, label: o.label, sub: "Ordonnance (page 1) + guide patient" })) },
    { id: "g-notes", title: "Notes d'information & consentement — Endoscopie", items: notesEndo },
    { id: "g-explo", title: "Explorations fonctionnelles digestives", items: notesExplo },
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
      mail: $("#ml-mail").value.trim(),
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
let ordoOpen = false;

function ordoLibreItem() {
  if (!ordoOpen) return null;
  return {
    id: "ordolibre",
    type: "ordolibre",
    opts: {
      mode: $("#ol-mode").value,
      texte: $("#ol-texte").value,
      textAld: $("#ol-ald").value,
      textNonAld: $("#ol-nonald").value,
      duree: $("#ol-duree").value.trim(),
    },
  };
}

function selectedItems() {
  const items = [];
  const ol = ordoLibreItem();
  if (ol) items.push(ol);
  for (const d of demandes)
    if (d.type === "endo") items.push({ id: d.id, type: "demande-endo", opts: { ...d.opts, telPatient: $("#pt-tel").value.trim() } });
  for (const g of CATALOG) for (const it of g.items) if (selection.has(it.id)) items.push(it);
  return items;
}

let renderSeq = 0;
async function refresh() {
  const items = selectedItems();
  $("#btn-print").disabled = !items.length;
  $("#preview-empty").style.display = items.length ? "none" : "block";

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
  saveMedecin({
    id: $("#mf-id").value || undefined,
    nom: $("#mf-nom").value, specialite: $("#mf-spec").value,
    tel: $("#mf-tel").value, fax: $("#mf-fax").value, rpps: $("#mf-rpps").value,
    mail: $("#mf-mail").value,
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

// ------------------------------------------------- e-mails des secrétariats
const MAIL_KEY = "endoc.mails.v1";
const MAIL_DEFAULTS = {
  endo: "endoscopie.ste@chu-montpellier.fr",
  explo: "explo-dig-ad@chu-montpellier.fr",
  radio_ste: "radiologie-ste@chu-montpellier.fr",
};
function mailCfg() {
  try { return { ...MAIL_DEFAULTS, ...JSON.parse(localStorage.getItem(MAIL_KEY) || "{}") }; }
  catch (_) { return { ...MAIL_DEFAULTS }; }
}
function openMailModal() {
  const c = mailCfg();
  $("#mc-endo").value = c.endo; $("#mc-explo").value = c.explo; $("#mc-radio-ste").value = c.radio_ste;
  openModal("#modal-mails");
}
$("#mc-save").addEventListener("click", () => {
  localStorage.setItem(MAIL_KEY, JSON.stringify({
    endo: $("#mc-endo").value.trim(), explo: $("#mc-explo").value.trim(), radio_ste: $("#mc-radio-ste").value.trim(),
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

/** Rend un item en PDF (A4, rasterisé) et retourne { blob, filename }. */
async function itemToPdf(item, ctx, filename) {
  await Promise.all([loadScript("vendor/html2canvas.min.js"), loadScript("vendor/jspdf.umd.min.js")]);
  await document.fonts.ready;
  const host = document.createElement("div");
  host.style.cssText = "position:absolute; top:0; left:-9999px; width:210mm; background:#fff;";
  host.innerHTML = await assembleDocs([item], ctx);
  const sec = host.querySelector("section.doc");
  sec.style.cssText += "box-shadow:none; margin:0; min-height:0; padding:10mm 12mm;";
  document.body.appendChild(host);
  try {
    const canvas = await html2canvas(sec, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const pdf = new jspdf.jsPDF({ unit: "mm", format: "a4", compress: true });
    const pageW = 210, pageH = 297;
    const imgH = (canvas.height * pageW) / canvas.width;
    const pages = Math.max(1, Math.ceil(imgH / pageH));
    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, -i * pageH, pageW, imgH);
    }
    return { blob: pdf.output("blob"), filename };
  } finally {
    host.remove();
  }
}

function mailTexts(d) {
  const p = currentPatient();
  const med = currentMedecin();
  const civ = $("#pt-civ").value;
  const ne = civ === "Mme" ? "née" : civ === "M." ? "né" : "né(e)";
  const qui = [civ || "M./Mme", p?.prenom, p?.nom?.toUpperCase()].filter(Boolean).join(" ");
  const ddn = p?.ddn ? " " + ne + " le " + p.ddn.split("-").reverse().join("/") : "";
  const exLbls = d.opts.examens.map((k) => (EXAMENS_ENDO_UI.find(([kk]) => kk === k) || [])[1]).filter(Boolean);
  const delaiLbl = { urgent48: "Urgent ++ (< 48 h)", urgent7: "Urgent (< 7 jours)", semi15: "Semi-urgent (< 15 jours)", autre: d.opts.delaiAutre || "autre" }[d.opts.delai];
  const sujet = `Demande d'examen endoscopique — ${[p?.nom?.toUpperCase(), p?.prenom].filter(Boolean).join(" ") || "patient"}`;
  const corps = `Bonjour,

Veuillez trouver en pièce jointe une demande d'examen endoscopique pour ${qui}${ddn}.

Examens demandés : ${exLbls.join(", ") || "—"}
Délai souhaité : ${delaiLbl}

Cordialement,
${med ? med.nom : ""}${med?.tel ? "\nSecrétariat : " + med.tel : ""}${med?.mail ? "\n" + med.mail : ""}`;
  const fichier = `Demande endoscopie - ${[p?.nom?.toUpperCase(), p?.prenom].filter(Boolean).join(" ") || "patient"}.pdf`
    .replace(/[\/\\:*?"<>|]/g, "");
  return { sujet, corps, fichier };
}

function demandeCtx() {
  return { medecin: currentMedecin(), patient: currentPatient(), dateDoc: $("#doc-date").value || null };
}

async function sendDemandeMail(d) {
  const to = (d.opts.sendTo || mailCfg().endo).trim();
  const { sujet, corps, fichier } = mailTexts(d);
  const item = { type: "demande-endo", opts: { ...d.opts, telPatient: $("#pt-tel").value.trim() } };
  toast("⏳ Génération du PDF…", 20000);
  const { blob } = await itemToPdf(item, demandeCtx(), fichier);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = fichier; a.click();
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
  window.__lastMailto = mailto; // pour les tests
  setTimeout(() => { location.href = mailto; }, 400);
  toast(`📎 PDF téléchargé : <strong>${fichier}</strong><br>Le brouillon s'ouvre dans votre messagerie — <strong>glissez-y le PDF</strong> puis envoyez.`, 12000);
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}

/** Brouillon .eml avec le PDF déjà en pièce jointe (Outlook Windows). */
async function sendDemandeEml(d) {
  const to = (d.opts.sendTo || mailCfg().endo).trim();
  const { sujet, corps, fichier } = mailTexts(d);
  const item = { type: "demande-endo", opts: { ...d.opts, telPatient: $("#pt-tel").value.trim() } };
  toast("⏳ Génération du brouillon…", 20000);
  const { blob } = await itemToPdf(item, demandeCtx(), fichier);
  const b64 = await new Promise((ok) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",")[1]);
    r.readAsDataURL(blob);
  });
  const b64utf8 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const eml = [
    "X-Unsent: 1",
    `To: ${to}`,
    `Subject: =?UTF-8?B?${b64utf8(sujet)}?=`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/mixed; boundary="ENDOC-BOUNDARY"',
    "",
    "--ENDOC-BOUNDARY",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    b64utf8(corps).replace(/(.{76})/g, "$1\r\n"),
    "--ENDOC-BOUNDARY",
    `Content-Type: application/pdf; name="${fichier}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${fichier}"`,
    "",
    b64.replace(/(.{76})/g, "$1\r\n"),
    "--ENDOC-BOUNDARY--",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([eml], { type: "message/rfc822" }));
  a.download = fichier.replace(/\.pdf$/, ".eml");
  a.click();
  toast(`📧 Brouillon téléchargé (<strong>PJ incluse</strong>) — double-cliquez dessus : il s'ouvre dans Outlook prêt à envoyer.`, 12000);
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}

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

function newDemande() {
  const d = {
    id: "dem" + (++demandeSeq),
    type: null, // choisi à l'étape 1
    opts: {
      examens: [], gepMode: "pose", actes: "", indications: "",
      delai: "semi15", delaiAutre: "", hospit: "hdj", hdjService: "Gastro", hospJ: "J0",
      ag: "oui", infosPatient: "oui",
      service: "Hépato-Gastroentérologie", uf: "", telDemandeur: "",
      crit: {}, iso: "", isoAutre: "", cjd: "non",
      antico: "", anticoStop: "", antiagreg: "", antiagregStop: "", tp: "", plaquettes: "",
      sendTo: mailCfg().endo,
    },
  };
  demandes.push(d);
  renderDemandes();
}

function demandeCard(d) {
  if (!d.type) {
    return `<div style="margin-top:6px;">
      <div class="hint" style="margin:0 0 6px;">Quel type d'examen ?</div>
      <div class="btnrow" style="margin:0;">
        <button class="small" data-dtype="endo" data-d="${d.id}">Endoscopie digestive</button>
        <button class="subtle small" disabled title="Bientôt disponible">Radiologie (bientôt)</button>
        <button class="subtle small" disabled title="Bientôt disponible">Explorations fonct. (bientôt)</button>
      </div>
    </div>`;
  }
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
  <label class="field"><span class="lbl">Indications *</span>
    <textarea data-d="${d.id}" data-k="indications" rows="3" placeholder="Contexte clinique et indication de l'examen">${o.indications}</textarea>
  </label>
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
    <div style="display:flex; flex-wrap:wrap; margin-top:6px;">
      ${[["imc", "IMC > 40"], ["htap", "HTAP > 50 mmHg"], ["fevg", "FEVG < 35 % / assist."], ["htic", "HTIC"]].map(([k, l]) =>
        `<label class="doc-item" style="width:50%; padding:2px 4px;"><input type="checkbox" data-d="${d.id}" data-crit="${k}" ${o.crit[k] ? "checked" : ""}><span style="font-size:12px;">${l}</span></label>`).join("")}
    </div>
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
  <div style="border-top:1px solid #cfe1f0; margin-top:8px; padding-top:8px;">
    <label class="field"><span class="lbl">Envoyer à (e-mail du secrétariat) — <a href="#" data-mailcfg>⚙ paramètres</a></span>${inp("sendTo", o.sendTo)}</label>
    <div class="btnrow" style="margin-top:0;">
      <button class="small" data-send-dem="${d.id}">📧 Envoyer au secrétariat</button>
      <button class="subtle small" data-eml-dem="${d.id}" title="Brouillon Outlook (.eml) avec le PDF déjà en pièce jointe — double-clic pour l'ouvrir prêt à envoyer">Brouillon .eml (PJ incluse)</button>
    </div>
  </div>`;
}

function renderDemandes() {
  const root = $("#demandes");
  root.innerHTML = demandes.map((d) => {
    const exLbls = d.opts.examens.map((k) => (EXAMENS_ENDO_UI.find(([kk]) => kk === k) || [])[1]).filter(Boolean);
    return `<div style="border:1.5px solid var(--bleu); border-radius:10px; padding:8px 10px; margin-bottom:10px; background:var(--bleu-pale);" data-card="${d.id}">
      <div style="display:flex; align-items:center; gap:8px;">
        <strong style="flex:1; font-size:13px;">🩺 Demande d'examen${d.type ? " — " + (exLbls.join(", ") || "endoscopie") : ""}</strong>
        <button class="subtle small" data-del-dem="${d.id}">✕ retirer</button>
      </div>
      ${demandeCard(d)}
    </div>`;
  }).join("");

  // structure : choix du type / suppression (re-render nécessaire)
  root.querySelectorAll("[data-dtype]").forEach((b) => b.addEventListener("click", () => {
    demandes.find((x) => x.id === b.dataset.d).type = b.dataset.dtype;
    renderDemandes(); refreshSoon();
  }));
  root.querySelectorAll("[data-del-dem]").forEach((b) => b.addEventListener("click", () => {
    demandes.splice(demandes.findIndex((x) => x.id === b.dataset.delDem), 1);
    renderDemandes(); refreshSoon();
  }));
  root.querySelectorAll("[data-send-dem]").forEach((b) => b.addEventListener("click", () => {
    const d = demandes.find((x) => x.id === b.dataset.sendDem);
    sendDemandeMail(d).catch((e) => toast("❌ " + e.message, 8000));
  }));
  root.querySelectorAll("[data-eml-dem]").forEach((b) => b.addEventListener("click", () => {
    const d = demandes.find((x) => x.id === b.dataset.emlDem);
    sendDemandeEml(d).catch((e) => toast("❌ " + e.message, 8000));
  }));
  root.querySelectorAll("[data-mailcfg]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); e.stopPropagation();
    openMailModal();
  }));
}

// Saisie dans les formulaires de demande : mise à jour sans re-render (focus conservé),
// sauf changements structurels (examens cochés, délai/hospit/iso) qui re-rendent la carte.
$("#demandes").addEventListener("input", (e) => {
  const t = e.target, d = demandes.find((x) => x.id === t.dataset.d);
  if (!d) return;
  if (t.dataset.k) d.opts[t.dataset.k] = t.value;
  if (t.dataset.crit) d.opts.crit[t.dataset.crit] = t.checked;
  if (t.dataset.ex) {
    const set = new Set(d.opts.examens);
    t.checked ? set.add(t.dataset.ex) : set.delete(t.dataset.ex);
    d.opts.examens = [...set];
  }
  refreshSoon();
});
$("#demandes").addEventListener("change", (e) => {
  const t = e.target, d = demandes.find((x) => x.id === t.dataset.d);
  if (!d) return;
  if (t.dataset.ex || ["delai", "hospit", "iso"].includes(t.dataset.k || "")) renderDemandes();
});

$("#btn-create-demande").addEventListener("click", () => {
  newDemande();
  $("#demandes").lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// ------------------------------------------------------------------ recherche
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
$("#search").addEventListener("input", () => {
  const q = norm($("#search").value.trim());
  $$("#catalogue .cat-group").forEach((g) => {
    let visible = 0;
    g.querySelectorAll(".doc-item").forEach((it) => {
      const hit = !q || norm(it.textContent).includes(q);
      it.style.display = hit ? "" : "none";
      if (hit) visible++;
    });
    g.style.display = q && !visible ? "none" : "";
    if (q && visible) g.classList.add("open");
  });
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
  // Documents cochés + recherche
  selection.clear();
  $("#search").value = "";
  // Ordonnance libre
  ordoOpen = false;
  $("#ordolibre-card").style.display = "none";
  ["#ol-texte", "#ol-ald", "#ol-nonald", "#ol-duree"].forEach((id) => ($(id).value = ""));
  $("#ol-mode").value = "simple";
  $("#ol-zone-simple").style.display = "block";
  $("#ol-zone-ald").style.display = "none";
  // Demandes d'examen
  demandes.length = 0;
  renderDemandes();
  // Patient + générique + date du jour
  ["#pt-nom", "#pt-prenom", "#pt-ddn", "#pt-examen", "#pt-tel", "#pt-civ"].forEach((id) => ($(id).value = ""));
  $("#chk-generic").checked = false;
  $("#panel-patient").style.opacity = "1";
  const d = new Date();
  $("#doc-date").value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  // Le médecin sélectionné est conservé.
  renderCatalog();
  refresh();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

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
["#ml-nom", "#ml-spec", "#ml-tel", "#ml-rpps", "#ml-mail", "#pt-nom", "#pt-prenom", "#pt-ddn", "#pt-examen",
 "#pt-tel", "#ol-texte", "#ol-ald", "#ol-nonald", "#ol-duree"]
  .forEach((id) => $(id).addEventListener("input", refreshSoon));

$("#btn-create-ordo").addEventListener("click", () => {
  ordoOpen = true;
  $("#ordolibre-card").style.display = "block";
  $("#ol-texte").focus();
  refreshSoon();
});
$("#btn-remove-ordo").addEventListener("click", () => {
  ordoOpen = false;
  $("#ordolibre-card").style.display = "none";
  refreshSoon();
});
$("#ol-mode").addEventListener("change", () => {
  const ald = $("#ol-mode").value === "ald";
  $("#ol-zone-simple").style.display = ald ? "none" : "block";
  $("#ol-zone-ald").style.display = ald ? "block" : "none";
  refreshSoon();
});
$("#chk-generic").addEventListener("change", () => {
  $("#panel-patient").style.opacity = $("#chk-generic").checked ? ".45" : "1";
  refreshSoon();
});

// Date du document : pré-remplie à aujourd'hui (fuseau local)
const now = new Date();
$("#doc-date").value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
$("#doc-date").addEventListener("input", refreshSoon);

renderCatalog();
renderMedecinSelect();
refresh();
