// Parcours patients — situations cliniques regroupant documents, ordonnances,
// régimes, ETP et demandes. « on » = pré-coché (essentiel) ; sinon option.
// Types d'éléments :
//   doc       { ref }                          — élément du catalogue (note:/fiche:/ordo:/regime:/etp:)
//   prep      {}                               — préparation colique (sélecteur, défaut PLENVU)
//   ordotype  { name }                         — ordonnance type (une carte d'ordonnance est créée)
//   ordochoice{ label, options:[names], def? } — ordonnance type au choix (sélecteur)
//   demande   { label, kind, opts }            — demande d'examen pré-remplie

export const PARCOURS_DEFS = [
 {cat: "Endoscopie & gestes", icon: "🔬", items: [
  {id: "colo", name: "Coloscopie", desc: "Note info + préparation + bilan + demande", elements: [
    {t: "doc", ref: "note:coloscopie", on: true},
    {t: "prep", on: true},
    {t: "ordotype", name: "Bilan biologique pré-coloscopie", on: true},
    {t: "doc", ref: "regime:prep_colo", on: false},
    {t: "demande", label: "Demande d'endoscopie — coloscopie (AG)", kind: "endo", opts: {examens: ["coloscopie"], ag: "oui"}, on: true},
    {t: "doc", ref: "etp:anticoag_geste", on: false},
  ]},
  {id: "gastroscopie", name: "Gastroscopie", elements: [
    {t: "doc", ref: "note:gastroscopie", on: true},
    {t: "demande", label: "Demande d'endoscopie — gastroscopie", kind: "endo", opts: {examens: ["gastroscopie"], ag: "oui"}, on: true},
  ]},
  {id: "gastro_colo", name: "Gastroscopie + coloscopie", elements: [
    {t: "doc", ref: "note:gastroscopie", on: true},
    {t: "doc", ref: "note:coloscopie", on: true},
    {t: "prep", on: true},
    {t: "ordotype", name: "Bilan biologique pré-coloscopie", on: false},
    {t: "demande", label: "Demande d'endoscopie — gastro + colo (AG)", kind: "endo", opts: {examens: ["gastroscopie", "coloscopie"], ag: "oui"}, on: true},
  ]},
  {id: "mucosectomie", name: "Mucosectomie / polypectomie colique", elements: [
    {t: "doc", ref: "note:colo_muco", on: true},
    {t: "prep", on: true},
    {t: "demande", label: "Demande d'endoscopie — coloscopie (mucosectomie)", kind: "endo", opts: {examens: ["coloscopie"], ag: "oui", actes: "Mucosectomie"}, on: true},
    {t: "doc", ref: "etp:esd_emr", on: true},
    {t: "doc", ref: "etp:polype_surveillance", on: false},
    {t: "doc", ref: "etp:anticoag_geste", on: false},
  ]},
  {id: "esd_colique", name: "Dissection colique (ESD)", elements: [
    {t: "doc", ref: "note:dsm_colique", on: true},
    {t: "prep", on: true},
    {t: "demande", label: "Demande d'endoscopie — coloscopie (ESD)", kind: "endo", opts: {examens: ["coloscopie"], ag: "oui", actes: "Dissection sous-muqueuse colique (ESD)"}, on: true},
    {t: "doc", ref: "etp:esd_emr", on: true},
    {t: "doc", ref: "etp:anticoag_geste", on: false},
  ]},
  {id: "esd_og", name: "Dissection œso-gastrique (ESD)", elements: [
    {t: "doc", ref: "note:dsm_oeso_gastrique", on: true},
    {t: "demande", label: "Demande d'endoscopie — gastroscopie (ESD)", kind: "endo", opts: {examens: ["gastroscopie"], ag: "oui", actes: "Dissection sous-muqueuse œso-gastrique (ESD)"}, on: true},
    {t: "doc", ref: "etp:esd_emr", on: true},
    {t: "doc", ref: "etp:anticoag_geste", on: false},
  ]},
  {id: "cpre", name: "CPRE", elements: [
    {t: "doc", ref: "note:cpre", on: true},
    {t: "demande", label: "Demande d'endoscopie — CPRE", kind: "endo", opts: {examens: ["cpre"], ag: "oui"}, on: true},
    {t: "doc", ref: "etp:cpre_prothese", on: true},
    {t: "doc", ref: "etp:drainage_biliaire", on: false},
    {t: "doc", ref: "etp:anticoag_geste", on: false},
  ]},
  {id: "poem", name: "POEM (achalasie)", elements: [
    {t: "doc", ref: "note:poem", on: true},
    {t: "demande", label: "Demande d'endoscopie — POEM", kind: "endo", opts: {examens: ["gastroscopie"], ag: "oui", actes: "POEM (achalasie)"}, on: true},
    {t: "doc", ref: "etp:poem", on: true},
    {t: "doc", ref: "regime:dysphagie", on: false},
  ]},
  {id: "gep", name: "Gastrostomie (GEP) — pose", elements: [
    {t: "doc", ref: "fiche:gep", on: true},
    {t: "demande", label: "Demande d'endoscopie — GEP (pose)", kind: "endo", opts: {examens: ["gep"], gepMode: "pose", ag: "oui"}, on: true},
    {t: "ordotype", name: "GEP — conseils avant la pose", on: true},
    {t: "doc", ref: "etp:gpe_soins", on: true},
    {t: "ordotype", name: "GEP — soins IDE", on: false},
    {t: "ordotype", name: "GEP — matériel : délivrance pharmacie", on: false},
    {t: "doc", ref: "etp:denutrition", on: false},
  ]},
  {id: "echoendo", name: "Échoendoscopie ± ponction", elements: [
    {t: "doc", ref: "note:ponction_echo", on: true},
    {t: "demande", label: "Demande d'endoscopie — échoendoscopie", kind: "endo", opts: {examens: ["echoendoscopie"], ag: "oui"}, on: true},
  ]},
 ]},

 {cat: "MICI", icon: "🟣", items: [
  {id: "biotherapie", name: "Initiation d'une biothérapie", desc: "Bilan pré-thérapeutique, vaccinations, éducation, consultations de dépistage", elements: [
    {t: "ordotype", name: "Bilan pré-anti-TNF — biologie + imagerie", on: true},
    {t: "ordotype", name: "Vaccinations MICI — avant immunosuppression", on: true},
    {t: "doc", ref: "etp:mici_biotherapies", on: true},
    {t: "doc", ref: "etp:mici_vaccins", on: true},
    {t: "doc", ref: "etp:mici_comprendre", on: false},
    {t: "ordotype", name: "Consultation dermatologie — dépistage sous anti-TNF / azathioprine", on: false},
    {t: "ordotype", name: "Consultation gynécologie — dépistage sous anti-TNF / azathioprine", on: false},
    {t: "ordotype", name: "Consultation rhumatologie — avis sous anti-TNF", on: false},
    {t: "ordochoice", label: "Surveillance biologique du produit", options: ["Surveillance biologique — ENTYVIO (védolizumab)", "Surveillance biologique — HUMIRA (adalimumab)", "Surveillance biologique — INFLECTRA (infliximab)", "Surveillance biologique — REMICADE (infliximab)", "Surveillance biologique — STELARA (ustékinumab)"], on: false},
  ]},
  {id: "poussee_mici", name: "Poussée de MICI", elements: [
    {t: "ordotype", name: "Corticoïdes — schéma de décroissance", on: true},
    {t: "doc", ref: "etp:mici_poussee_reagir", on: true},
    {t: "doc", ref: "etp:mici_corticoides", on: true},
    {t: "doc", ref: "regime:mici_poussee", on: true},
    {t: "doc", ref: "regime:sans_residu", on: false},
  ]},
  {id: "azathioprine", name: "Initiation azathioprine (Imurel)", elements: [
    {t: "ordotype", name: "Azathioprine — IMUREL + surveillance biologique", on: true},
    {t: "doc", ref: "etp:mici_biotherapies", on: true},
    {t: "ordotype", name: "Vaccinations MICI — avant immunosuppression", on: false},
    {t: "doc", ref: "etp:immunosup_peau", on: false},
  ]},
  {id: "mici_remission", name: "MICI en rémission — suivi", elements: [
    {t: "doc", ref: "regime:mici_entretien", on: true},
    {t: "doc", ref: "etp:mici_surveillance", on: true},
    {t: "ordotype", name: "Bilan MICI — standard + carences", on: true},
    {t: "doc", ref: "etp:mici_vie", on: false},
  ]},
 ]},

 {cat: "Hépatologie", icon: "🫀", items: [
  {id: "cirrhose", name: "Cirrhose — annonce & surveillance", elements: [
    {t: "doc", ref: "etp:cirrhose_autosurv", on: true},
    {t: "doc", ref: "etp:cirrhose_complications", on: true},
    {t: "doc", ref: "regime:cirrhose", on: true},
    {t: "ordotype", name: "Cirrhose — surveillance semestrielle (bio + échographie)", on: true},
    {t: "doc", ref: "regime:hyposode", on: false},
    {t: "ordochoice", label: "Bêtabloquant (prophylaxie rupture de VO)", options: ["Carvédilol — prophylaxie de rupture de VO (Baveno VII)", "Propranolol — AVLOCARDYL (prophylaxie rupture de VO)"], on: false},
    {t: "doc", ref: "etp:betabloquant_vo", on: false},
  ]},
  {id: "ascite", name: "Décompensation ascitique", elements: [
    {t: "doc", ref: "regime:hyposode", on: true},
    {t: "doc", ref: "etp:cirrhose_autosurv", on: true},
    {t: "doc", ref: "etp:cirrhose_complications", on: true},
    {t: "doc", ref: "regime:encephalopathie", on: false},
  ]},
  {id: "hepatite", name: "Hépatite virale B / C", elements: [
    {t: "doc", ref: "etp:hepatites_bc", on: true},
    {t: "ordochoice", label: "Bilan biologique", options: ["Hépatite B — bilan initial", "Hépatite B — suivi", "Hépatite C — bilan pré-thérapeutique", "Hépatite C — suivi sous / après traitement"], on: true},
    {t: "ordotype", name: "Hépatite B — vaccination", on: false},
  ]},
  {id: "mash", name: "Stéatose / MASH", elements: [
    {t: "doc", ref: "regime:mash", on: true},
    {t: "doc", ref: "etp:masld_objectifs", on: true},
    {t: "ordotype", name: "Stéatose / NASH — prise en charge", on: false},
    {t: "ordotype", name: "FIBROTEST — évaluation de la fibrose", on: false},
  ]},
  {id: "alcool", name: "Accompagnement alcool", elements: [
    {t: "doc", ref: "etp:alcool", on: true},
    {t: "ordotype", name: "Bilan biologique de suivi (avant consultation)", on: false},
  ]},
  {id: "greffe", name: "Après greffe hépatique", elements: [
    {t: "doc", ref: "etp:greffe_foie", on: true},
    {t: "ordotype", name: "Vaccinations après greffe hépatique", on: true},
    {t: "doc", ref: "etp:immunosup_peau", on: false},
  ]},
 ]},

 {cat: "Troubles fonctionnels", icon: "🌀", items: [
  {id: "sii", name: "SII — nouveau diagnostic", elements: [
    {t: "doc", ref: "etp:sii_comprendre", on: true},
    {t: "doc", ref: "regime:fodmap", on: true},
    {t: "ordotype", name: "SII — antispasmodiques (1ʳᵉ ligne douleur, au choix)", on: true},
    {t: "ordochoice", label: "Traitement selon le sous-type", options: ["SII-D — 1ʳᵉ ligne (lopéramide + antispasmodique)", "SII-C — 1ʳᵉ ligne (fibres / macrogol + antispasmodique)", "SII-M (mixte) — prise en charge"], on: false},
    {t: "doc", ref: "etp:sii_poussees", on: false},
    {t: "doc", ref: "etp:resp_diaphragme", on: false},
  ]},
  {id: "gastroparesie", name: "Gastroparésie", desc: "Régime + ETP + traitement, et G-POEM si envisagé", elements: [
    {t: "doc", ref: "regime:gastroparesie", on: true},
    {t: "doc", ref: "etp:dyspepsie_quotidien", on: true},
    {t: "ordochoice", label: "Traitement selon la forme", options: ["Gastroparésie — nausées / vomissements prédominants", "Gastroparésie — plénitude / satiété précoce prédominante", "Gastroparésie — forme mixte (nausées + plénitude)"], on: true},
    {t: "doc", ref: "note:gpoem", on: false},
    {t: "demande", label: "Demande d'endoscopie — G-POEM", kind: "endo", opts: {examens: ["gastroscopie"], ag: "oui", actes: "G-POEM (gastroparésie)"}, on: false},
    {t: "doc", ref: "etp:resp_diaphragme", on: false},
  ]},
  {id: "dyspepsie", name: "Dyspepsie fonctionnelle", elements: [
    {t: "doc", ref: "regime:dyspepsie", on: true},
    {t: "doc", ref: "etp:dyspepsie_quotidien", on: true},
    {t: "ordotype", name: "Dyspepsie fonctionnelle — EPS : IPP 1ʳᵉ ligne", on: true},
    {t: "ordotype", name: "Dyspepsie fonctionnelle — PDS : dompéridone (≤ 7 jours)", on: false},
    {t: "ordotype", name: "Dyspepsie fonctionnelle — 2ᵉ ligne (options au choix)", on: false},
  ]},
  {id: "rgo", name: "RGO", elements: [
    {t: "doc", ref: "regime:rgo", on: true},
    {t: "doc", ref: "etp:rgo_vivre", on: true},
    {t: "ordotype", name: "RGO simple — IPP", on: true},
    {t: "doc", ref: "etp:ipp_longcours", on: false},
    {t: "doc", ref: "note:phmetrie", on: false},
    {t: "doc", ref: "note:manometrie", on: false},
  ]},
  {id: "eructations", name: "Éructations / rumination", elements: [
    {t: "doc", ref: "etp:resp_diaphragme", on: true},
    {t: "doc", ref: "etp:eructations", on: true},
    {t: "doc", ref: "etp:rumination", on: false},
    {t: "doc", ref: "etp:ballonnement", on: false},
    {t: "doc", ref: "etp:aerophagie", on: false},
  ]},
  {id: "constipation", name: "Constipation / dyschésie", elements: [
    {t: "doc", ref: "regime:fibres", on: true},
    {t: "doc", ref: "etp:constipation_chronique", on: true},
    {t: "ordotype", name: "Constipation de transit — 1ʳᵉ ligne (macrogol / ispaghul)", on: true},
    {t: "ordotype", name: "Constipation de transit — 2ᵉ ligne (prucalopride, bisacodyl…)", on: false},
    {t: "doc", ref: "etp:dyschesie_reeduc", on: false},
    {t: "ordotype", name: "Dyschésie / constipation terminale — RHD + traitements locaux", on: false},
  ]},
  {id: "laroxyl", name: "Initiation Laroxyl (neuromodulateur)", elements: [
    {t: "ordotype", name: "Amitriptyline (LAROXYL) — titration + consignes patient", on: true},
    {t: "doc", ref: "etp:neuromodulateurs", on: true},
  ]},
 ]},

 {cat: "Pancréas", icon: "🧬", items: [
  {id: "pc", name: "Pancréatite chronique / insuffisance pancréatique", elements: [
    {t: "doc", ref: "regime:pancreatite_chronique", on: true},
    {t: "doc", ref: "etp:pc_douleur", on: true},
    {t: "doc", ref: "etp:ipe_enzymes", on: true},
    {t: "doc", ref: "etp:diabete_pancreas", on: false},
  ]},
  {id: "post_pa", name: "Après une pancréatite aiguë", elements: [
    {t: "doc", ref: "regime:pancreatite_aigue", on: true},
    {t: "doc", ref: "etp:alcool", on: false},
  ]},
 ]},

 {cat: "Nutrition & stomies", icon: "🥤", items: [
  {id: "denutrition", name: "Dénutrition", elements: [
    {t: "doc", ref: "etp:denutrition", on: true},
    {t: "doc", ref: "etp:cno", on: true},
    {t: "ordochoice", label: "Compléments nutritionnels", options: ["Compléments nutritionnels — CLINUTREN", "Compléments nutritionnels — hyperprotéinés / hypercaloriques", "Compléments nutritionnels — pâtes enrichies", "Compléments nutritionnels — CLINUTREN texture modifiée (dysphagie)"], on: true},
  ]},
  {id: "stomie", name: "Stomie (iléo / colostomie)", elements: [
    {t: "doc", ref: "etp:stomie_vivre", on: true},
    {t: "doc", ref: "regime:stomie", on: true},
  ]},
 ]},

 {cat: "Proctologie", icon: "🍑", items: [
  {id: "hemorroides", name: "Maladie hémorroïdaire", elements: [
    {t: "doc", ref: "etp:hemorroides", on: true},
    {t: "doc", ref: "regime:fibres", on: true},
    {t: "ordotype", name: "Thrombose hémorroïdaire — traitement", on: false},
  ]},
  {id: "fissure", name: "Fissure anale", elements: [
    {t: "ordotype", name: "Fissure anale — traitement de 1ère intention", on: true},
    {t: "doc", ref: "regime:fibres", on: true},
    {t: "ordochoice", label: "Si résistance", options: ["Fissure anale résistante — option 1", "Fissure anale résistante — option 2"], on: false},
  ]},
  {id: "incontinence", name: "Incontinence anale", elements: [
    {t: "doc", ref: "etp:incontinence", on: true},
    {t: "doc", ref: "etp:incontinence_reeduc", on: true},
  ]},
 ]},
];
