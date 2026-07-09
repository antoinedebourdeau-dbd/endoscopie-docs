// Documents locaux & sections personnalisées — créés depuis le wizard
// « Nouveau document », stockés dans le navigateur, export / import JSON.
// Un document local porte un badge « Document local » à l'écran (jamais à
// l'impression) tant qu'il n'a pas été officialisé dans le site.

const KEY_DOCS = "endoc.localdocs.v1";
const KEY_SECTIONS = "endoc.sections.v1";

const uid = (p) => p + Math.random().toString(36).slice(2, 9);

// ------------------------------------------------------------------ sections
export function listSections() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY_SECTIONS) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch (_) { return []; }
}

export function addSection(title) {
  const arr = listSections();
  const s = { id: uid("s"), title: title.trim() };
  arr.push(s);
  localStorage.setItem(KEY_SECTIONS, JSON.stringify(arr));
  return s;
}

export function removeSection(id) {
  localStorage.setItem(KEY_SECTIONS, JSON.stringify(listSections().filter((s) => s.id !== id)));
}

// ---------------------------------------------------------------- documents
export function listLocalDocs() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY_DOCS) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch (_) { return []; }
}

export function saveLocalDoc(doc) {
  const arr = listLocalDocs();
  if (!doc.id) doc.id = uid("d");
  const i = arr.findIndex((d) => d.id === doc.id);
  if (i >= 0) arr[i] = doc;
  else arr.push(doc);
  localStorage.setItem(KEY_DOCS, JSON.stringify(arr));
  return doc;
}

export function removeLocalDoc(id) {
  localStorage.setItem(KEY_DOCS, JSON.stringify(listLocalDocs().filter((d) => d.id !== id)));
}

export function exportLocalDoc(doc) {
  return JSON.stringify({ type: "endoc-document", version: 1, document: doc }, null, 2);
}

export function importLocalDoc(json) {
  const data = JSON.parse(json);
  const doc = data.document || data;
  const errs = validateDoc(doc);
  if (errs.length) throw new Error("Document invalide :\n– " + errs.join("\n– "));
  doc.id = null; // nouvel id local
  return saveLocalDoc(doc);
}

// ---------------------------------------------------------------- validation
const TONES = ["", "info", "warn", "danger", "steps"];
const PREFIX = /^(p:|-:|--:|n:)/;

/** Vérifie la structure d'un document (schéma des notes). Retourne [erreurs]. */
export function validateDoc(d) {
  const errs = [];
  if (!d || typeof d !== "object") return ["Le JSON ne décrit pas un objet document."];
  if (!d.title || typeof d.title !== "string") errs.push("« title » (titre du document) manquant.");
  if (!d.geste || typeof d.geste !== "string") errs.push("« geste » (surtitre, ex. « Fiche d'information — Traitement ») manquant.");
  if (d.lead && typeof d.lead !== "string") errs.push("« lead » doit être un texte.");
  if (!Array.isArray(d.sections) || !d.sections.length) errs.push("« sections » doit être une liste non vide.");
  (d.sections || []).forEach((s, i) => {
    if (!s.h) errs.push(`Section ${i + 1} : titre « h » manquant.`);
    if (s.tone && !TONES.includes(s.tone)) errs.push(`Section ${i + 1} : ton « ${s.tone} » inconnu (info, warn, danger ou vide).`);
    if (!Array.isArray(s.body) || !s.body.length) errs.push(`Section ${i + 1} : « body » doit être une liste non vide.`);
    (s.body || []).forEach((l, j) => {
      if (typeof l !== "string") errs.push(`Section ${i + 1}, ligne ${j + 1} : doit être un texte.`);
      else if (!PREFIX.test(l)) errs.push(`Section ${i + 1}, ligne ${j + 1} : doit commencer par « p: », « -: », « --: » ou « n: ».`);
    });
  });
  if (d.consent) {
    const c = d.consent;
    if (!Array.isArray(c.lines) && !c.soussigne)
      errs.push("« consent » : préciser soit « lines » (liste), soit « soussigne: true » + « objet ».");
    if (c.soussigne && !c.objet) errs.push("« consent » : « objet » manquant (ex. « ce traitement, ses avantages et ses risques »).");
  }
  if (d.illus) errs.push("« illus » : les illustrations ne sont pas prises en charge pour les documents locaux (retirer ce champ).");
  return errs;
}

// ------------------------------------------------------------ prompt calibré
const EXAMPLE = {
  geste: "Fiche d'information — Traitement",
  title: "Traitement par azathioprine (Imurel®)",
  lead: "L'azathioprine est un traitement immunomodulateur utilisé dans les maladies inflammatoires chroniques de l'intestin (MICI). Cette fiche résume son fonctionnement, ses modalités de prise et la surveillance nécessaire.",
  noConsent: true,
  sections: [
    { h: "Pourquoi ce traitement ?", body: [
      "p:L'azathioprine diminue l'activité excessive du système immunitaire responsable de l'inflammation intestinale.",
      "-:Maintien de la rémission de la maladie de Crohn et de la rectocolite hémorragique.",
      "-:Diminution du recours aux corticoïdes.",
    ]},
    { h: "Comment le prendre ?", tone: "info", body: [
      "n:Prise quotidienne, au cours d'un repas.",
      "n:La dose est adaptée à votre poids par votre médecin.",
      "n:L'effet complet apparaît après <strong>2 à 3 mois</strong> de traitement.",
    ]},
    { h: "Quand consulter en urgence ?", tone: "danger", body: [
      "p:Contactez rapidement votre médecin en cas de <strong>fièvre</strong>, d'angine, de fatigue inhabituelle ou de saignements.",
    ]},
  ],
};

/**
 * Construit le prompt à coller dans Claude pour générer un document au format
 * du site à partir d'un texte source fourni par le médecin.
 */
export function buildPrompt({ kind, titleHint, sourceText }) {
  const consigneConsent =
    kind === "consent"
      ? `Le document est une note d'information AVEC consentement : ajoute un champ "consent" avec soit "lines" (liste de points que le patient reconnaît, chaque point en HTML simple), soit { "soussigne": true, "objet": "…", "retrait": true, "accept": "…", "mention": true }. N'ajoute PAS "noConsent".`
      : `Le document est une fiche d'information SANS consentement : ajoute "noConsent": true et aucun champ "consent".`;

  return `Tu es rédacteur médical pour le CHU de Montpellier (Hépato-Gastroentérologie). À partir du texte source ci-dessous, rédige un document patient au FORMAT JSON STRICT suivant — réponds UNIQUEMENT avec le JSON, sans texte autour, sans bloc de code.

SCHÉMA :
{
  "geste": "surtitre court (ex. « Fiche d'information — Traitement », « Note d'information & consentement »)",
  "title": "titre du document",
  "subtitle": "sous-titre optionnel (omettre si inutile)",
  "lead": "chapeau de 2-3 phrases résumant l'essentiel (affiché dans un encadré bleu)",
  "sections": [
    { "h": "titre de section", "tone": "« info » (encadré bleu), « warn » (orange), « danger » (rouge, réservé aux urgences) ou omis (fond blanc)", "body": ["…lignes…"] }
  ]
}

RÈGLES POUR "body" — chaque ligne commence par un préfixe :
- "p:" paragraphe
- "-:" puce
- "--:" sous-puce (grisée)
- "n:" étape numérotée (la numérotation est automatique)
Mise en gras des mots-clés importants avec <strong>…</strong> (seule balise autorisée, avec <em>).

RÈGLES DE STYLE :
- Français, vouvoiement, phrases courtes, ton rassurant et factuel — style des notes d'information hospitalières.
- Aéré : 4 à 8 sections, puces courtes plutôt que longs paragraphes.
- Une section « Quand consulter en urgence ? » en tone "danger" si pertinent.
- Ne rien inventer médicalement : uniquement reformuler/structurer le texte source. Signaler [À COMPLÉTER] si une information indispensable manque.
${consigneConsent}

EXEMPLE DE SORTIE ATTENDUE :
${JSON.stringify(EXAMPLE, null, 2)}

TITRE SOUHAITÉ : ${titleHint || "(à déduire du texte source)"}

TEXTE SOURCE :
"""
${sourceText}
"""`;
}
