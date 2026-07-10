// Annuaire des médecins — stocké dans le navigateur (localStorage), rien ne
// part sur un serveur. Export / import JSON pour partager entre postes.

const KEY = "endoc.medecins.v1";

const SEED = [
  {
    id: "debourdeau",
    nom: "Dr Antoine DEBOURDEAU",
    specialite: "Hépato-Gastroentérologie",
    tel: "04 67 33 02 24",
    fax: "04 67 33 69 42",
    rpps: "10101156171",
  },
];

const uid = () => "m" + Math.random().toString(36).slice(2, 9);

export function listMedecins() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch (_) { /* stockage corrompu → seed */ }
  return [...SEED];
}

function persist(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function saveMedecin(m) {
  const arr = listMedecins();
  const clean = {
    id: m.id || uid(),
    nom: (m.nom || "").trim(),
    specialite: (m.specialite || "Hépato-Gastroentérologie").trim(),
    tel: (m.tel || "").trim(),
    fax: (m.fax || "").trim(),
    rpps: (m.rpps || "").replace(/\s+/g, ""),
    mail: (m.mail || "").trim(), // BALF générique gérée par le secrétariat
    sign: m.sign || undefined, // signature (image dataURL) — locale au navigateur
  };
  const i = arr.findIndex((x) => x.id === clean.id);
  if (i >= 0) arr[i] = clean;
  else arr.push(clean);
  persist(arr);
  return clean;
}

export function removeMedecin(id) {
  persist(listMedecins().filter((m) => m.id !== id));
}

export function exportMedecins() {
  return JSON.stringify({ type: "endoc-medecins", version: 1, medecins: listMedecins() }, null, 2);
}

/** Importe un export JSON ; fusionne par id (ajoute les nouveaux, met à jour les existants). */
export function importMedecins(json) {
  const data = JSON.parse(json);
  const incoming = Array.isArray(data) ? data : data.medecins;
  if (!Array.isArray(incoming)) throw new Error("Format non reconnu : liste de médecins absente.");
  const arr = listMedecins();
  let added = 0, updated = 0;
  for (const m of incoming) {
    if (!m || !m.nom) continue;
    const i = arr.findIndex((x) => x.id === m.id || x.nom.toLowerCase() === m.nom.toLowerCase());
    if (i >= 0) { arr[i] = { ...arr[i], ...m, id: arr[i].id }; updated++; }
    else { arr.push({ ...m, id: m.id || uid() }); added++; }
  }
  persist(arr);
  return { added, updated };
}

/** Validation légère d'un RPPS (11 chiffres). Retourne un message ou null. */
export function checkRpps(rpps) {
  if (!rpps) return null;
  const n = rpps.replace(/\s+/g, "");
  if (!/^\d{11}$/.test(n)) return "Le RPPS doit comporter 11 chiffres.";
  return null;
}
