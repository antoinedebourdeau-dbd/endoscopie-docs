// GÉNÉRÉ depuis le brief « Fiches régimes HGE » (contenu médical validé par A. Debourdeau).
// Ne pas modifier le contenu médical à la main : passer par le brief.
export const REGIME_NIVEAUX = {
 "1": {
  "badge": "🔴",
  "label": "STRICT & DÉFINITIF",
  "color": "#C0392B",
  "bg": "#FCECEA",
  "border": "#C0392B",
  "sens": "Régime absolu, à vie. Aucune « petite quantité tolérée ».",
  "ecart": "Chaque écart, même minime, entretient la maladie et expose à des complications. Il n'y a pas de seuil « acceptable »."
 },
 "2": {
  "badge": "🟠",
  "label": "STRICT & TEMPORAIRE",
  "color": "#b35a00",
  "bg": "#FFF4E6",
  "border": "#EF7D00",
  "sens": "À respecter à la lettre, mais sur une durée limitée définie par le médecin.",
  "ecart": "Un écart pendant la période peut faire échouer l'examen ou prolonger la crise. Après la date fixée, vous reprenez une alimentation normale."
 },
 "3": {
  "badge": "🟡",
  "label": "SUR-MESURE",
  "color": "#8a6d00",
  "bg": "#FFF9E0",
  "border": "#E1A500",
  "sens": "Pas de règle universelle : on part large puis on ajuste à votre tolérance. Le but est de trouver votre seuil, pas de tout supprimer.",
  "ecart": "Un écart occasionnel n'est pas dangereux : il vous renseigne sur votre limite. À l'inverse, trop se restreindre est inutile et risqué (carences)."
 },
 "4": {
  "badge": "🟢",
  "label": "HYGIÈNE DE VIE",
  "color": "#146c3a",
  "bg": "#E6F4EC",
  "border": "#146c3a",
  "sens": "Une orientation de fond, durable. Aucun aliment strictement interdit.",
  "ecart": "Il s'agit d'une tendance à installer sur le long terme. Un repas « à part » ne compromet rien ; c'est la régularité qui compte."
 }
};

export const REGIME_ERREURS = {
 "encephalopathie": "Ne réduisez PAS vos protéines. Diminuer les protéines aggrave la fonte musculaire et <strong>n'améliore pas</strong> l'encéphalopathie. On maintient les protéines (en privilégiant végétales et laitières).",
 "pancreatite": "Ne supprimez PAS les graisses de façon drastique. Une restriction lipidique sévère aggrave la dénutrition. On garde un apport normal en graisses <strong>avec les enzymes pancréatiques</strong>.",
 "diverticules": "Les graines, pépins, fraises, tomates ne sont PAS interdits. Cette croyance est fausse : ils n'augmentent pas le risque de diverticulite. Au contraire, les fibres protègent.",
 "fodmap": "Ce n'est pas un régime à vie. Rester en phase d'exclusion stricte des mois appauvrit l'alimentation et le microbiote. La phase de réintroduction est <strong>obligatoire</strong>.",
 "gluten_bienetre": "Inutile et coûteux sans maladie cœliaque prouvée. Ne commencez jamais un régime sans gluten <strong>avant</strong> le diagnostic : cela fausse les tests."
};

export const REGIMES = [
 {
  "cat": "Reflux & œsophage",
  "icon": "🫁",
  "items": [
   {
    "id": "rgo",
    "name": "Régime anti-reflux (RGO)",
    "niveau": 3,
    "pourquoi": "Le reflux, c'est la remontée du contenu acide de l'estomac vers l'œsophage. Certaines habitudes favorisent ces remontées ou irritent l'œsophage. En les corrigeant, on réduit les brûlures sans forcément recourir aux médicaments, ou en en prenant moins.",
    "principes": [
     "Fractionnez : repas plus légers, sans se remplir.",
     "Ne vous allongez pas juste après manger : <strong>dernier repas au moins 3 h avant le coucher</strong>.",
     "<strong>Surélevez la tête du lit</strong> (cales sous les pieds, pas seulement des oreillers).",
     "Identifiez <strong>vos</strong> aliments déclencheurs : ils varient d'une personne à l'autre.",
     "En cas de surpoids, <strong>la perte de poids est la mesure la plus efficace</strong>."
    ],
    "journee": {
     "pdj": "Flocons d'avoine + banane, thé léger",
     "dej": "Poisson vapeur, riz, courgettes",
     "col": "Yaourt nature",
     "din": "(Tôt) Blanc de poulet, purée, compote"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À limiter / éviter",
     "ok": [
      "Viandes maigres, poisson, œufs",
      "Féculents, pain, riz, pâtes",
      "Légumes cuits, fruits peu acides (banane, poire)",
      "Eau, tisanes douces",
      "Laitages allégés"
     ],
     "ko": [
      "Fritures, plats gras, charcuterie grasse",
      "Chocolat, menthe",
      "Tomate, agrumes, jus acides",
      "Café, alcool, boissons gazeuses",
      "Repas copieux du soir"
     ]
    },
    "vigilance": "Aucun aliment n'est interdit universellement : testez et gardez ce qui <strong>vous</strong> gêne. Poids et horaire du dîner comptent plus que la liste d'aliments. Consultez si : difficulté à avaler, amaigrissement, vomissements, anémie."
   },
   {
    "id": "dysphagie",
    "name": "Textures adaptées (dysphagie / sténose œsophagienne)",
    "niveau": 2,
    "pourquoi": "Un rétrécissement de l'œsophage peut bloquer les aliments solides et provoquer des fausses routes. Adapter la texture sécurise l'alimentation en attendant le traitement (dilatation, etc.).",
    "principes": [
     "Alimentation <strong>mixée / moulinée</strong> selon le calibre.",
     "<strong>Liquides épaissis</strong> si fausses routes.",
     "Petites bouchées, bien mâcher, manger assis, sans se presser.",
     "Boire pendant / après pour faire passer."
    ],
    "journee": {
     "pdj": "Semoule au lait lisse",
     "dej": "Poisson mixé + purée + légumes moulinés",
     "col": "Yaourt / compote",
     "din": "Velouté enrichi + fromage fondu"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À éviter",
     "ok": [
      "Purées, veloutés, mixés lisses",
      "Compotes, laitages lisses",
      "Œufs brouillés, poisson tendre",
      "Liquides épaissis si besoin"
     ],
     "ko": [
      "Viandes fibreuses en morceaux",
      "Pain croûté, riz sec, pâtes fermes",
      "Aliments à peau / pépins durs",
      "Aliments secs et friables (biscottes)"
     ]
    },
    "vigilance": "Texture à <strong>réévaluer</strong> après traitement (ne pas rester en mixé sans raison). Consultez en urgence si blocage complet, douleur thoracique, impossibilité d'avaler la salive."
   },
   {
    "id": "eoe",
    "name": "Éviction — œsophagite à éosinophiles (6-FED / step-up)",
    "niveau": 3,
    "pourquoi": "Dans cette maladie, l'œsophage réagit à certains aliments. On retire temporairement les aliments les plus souvent en cause, puis on les <strong>réintroduit un par un</strong> pour identifier <strong>le vôtre</strong> — c'est une démarche de test, pas une punition définitive.",
    "principes": [
     "Phase d'exclusion (souvent lait, gluten ± œuf, soja, fruits à coque, poisson / fruits de mer) pendant quelques semaines.",
     "Contrôle endoscopique, puis <strong>réintroductions successives encadrées</strong>.",
     "On ne garde à long terme que l'éviction réellement responsable."
    ],
    "journee": {
     "pdj": "(6-FED) Porridge à base d'eau + fruits",
     "dej": "Poulet, riz, légumes, huile d'olive",
     "col": "Fruit",
     "din": "Bœuf, pommes de terre, courgettes"
    },
    "tab": {
     "okT": "Autorisés",
     "koT": "Exclus temporairement",
     "ok": [
      "Viandes, volailles",
      "Riz, pomme de terre, maïs",
      "Fruits, légumes",
      "Huiles végétales"
     ],
     "ko": [
      "Lait et produits laitiers",
      "Blé / gluten",
      "Œuf",
      "Soja, fruits à coque",
      "Poisson & fruits de mer"
     ]
    },
    "vigilance": "Se fait <strong>avec un(e) diététicien(ne)</strong> (risque de carences, éviction du lait). La réintroduction est <strong>la partie essentielle</strong> : ne restez pas en exclusion large indéfiniment. Contrôles endoscopiques nécessaires."
   }
  ]
 },
 {
  "cat": "Estomac",
  "icon": "🍽",
  "items": [
   {
    "id": "dyspepsie",
    "name": "Régime dyspepsie fonctionnelle",
    "niveau": 3,
    "pourquoi": "L'estomac se remplit et se vide de façon inconfortable (lourdeurs, satiété rapide, douleurs). Alléger et fractionner les repas diminue ces sensations.",
    "principes": [
     "Repas <strong>petits et fréquents</strong> (4–6/j).",
     "<strong>Pauvres en graisses</strong> (qui ralentissent la vidange).",
     "Manger lentement.",
     "Limiter café, alcool, boissons gazeuses.",
     "Repérer ses aliments déclencheurs."
    ],
    "journee": {
     "pdj": "Pain + un peu de miel, thé",
     "dej": "Poisson, riz, légumes cuits",
     "col": "Yaourt",
     "din": "(Léger) Soupe + jambon blanc + compote"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À limiter",
     "ok": [
      "Aliments maigres, cuits",
      "Petites portions",
      "Légumes cuits",
      "Eau, tisanes"
     ],
     "ko": [
      "Fritures, sauces grasses",
      "Repas copieux",
      "Café, alcool, sodas",
      "Aliments très épicés"
     ]
    },
    "vigilance": "Rien d'interdit : on ajuste. Régime associé aux traitements si besoin. Consultez si amaigrissement, vomissements, sang."
   },
   {
    "id": "gastroparesie",
    "name": "Régime gastroparésie",
    "niveau": 3,
    "pourquoi": "L'estomac se vide trop lentement : les aliments stagnent, d'où nausées, ballonnements, satiété précoce. On choisit des aliments <strong>faciles et rapides à évacuer</strong>.",
    "principes": [
     "Repas <strong>petits et fréquents</strong>, texture <strong>molle ou liquide</strong> (mixé, velouté, purée).",
     "<strong>Pauvres en graisses et en fibres insolubles</strong> (peaux, crudités fibreuses) qui ralentissent la vidange.",
     "Privilégier les <strong>petites particules</strong> : bien mâcher, mixer.",
     "Boire les calories quand les solides passent mal (soupes, smoothies).",
     "Rester assis / droit après les repas ; marcher un peu.",
     "Si diabète : <strong>bon équilibre glycémique</strong> (l'hyperglycémie ralentit encore la vidange)."
    ],
    "journee": {
     "pdj": "Smoothie banane + yaourt",
     "dej": "Purée + poisson mixé",
     "col": "Compote",
     "din": "Velouté de légumes lisse + fromage frais"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À éviter",
     "ok": [
      "Purées, veloutés, compotes",
      "Poisson / volaille tendres, mixés",
      "Laitages, œufs",
      "Jus, smoothies, soupes",
      "Féculents bien cuits"
     ],
     "ko": [
      "Fritures, plats gras",
      "Viandes fibreuses en morceaux",
      "Crudités, légumes à peau / graines",
      "Légumineuses entières, chou, maïs",
      "Fruits à peau, agrumes fibreux"
     ]
    },
    "vigilance": "Se cale sur <strong>votre</strong> tolérance et l'évolution. Risque de dénutrition → accompagnement diététique conseillé. Consultez si vomissements persistants, amaigrissement, signes de déshydratation."
   },
   {
    "id": "dumping",
    "name": "Régime anti-dumping (post-gastrectomie / post-bariatrique)",
    "niveau": 3,
    "pourquoi": "Après chirurgie de l'estomac, les aliments — surtout les sucres rapides — arrivent trop vite dans l'intestin : malaise, palpitations, sueurs, diarrhée (« syndrome de chasse »). On ralentit ce passage.",
    "principes": [
     "<strong>Séparez les solides et les boissons</strong> : ne buvez pas pendant le repas (attendez ~30 min après).",
     "Repas <strong>petits et fréquents</strong>.",
     "<strong>Limitez les sucres rapides</strong> (sodas, jus, sucreries, desserts sucrés).",
     "Privilégiez protéines et fibres à chaque repas ; mangez lentement.",
     "Allongez-vous 15–20 min après le repas si malaises."
    ],
    "journee": {
     "pdj": "Œuf + pain complet (boire à distance)",
     "dej": "Viande + légumes + féculent complet",
     "col": "Fromage + quelques oléagineux",
     "din": "Poisson + quinoa + légumes"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À éviter",
     "ok": [
      "Protéines (viande, poisson, œuf)",
      "Féculents complets, légumes",
      "Boissons <strong>entre</strong> les repas",
      "Laitages nature"
     ],
     "ko": [
      "Sodas, jus de fruits, sirops",
      "Bonbons, pâtisseries, glaces",
      "Boire en mangeant",
      "Grands verres de liquide sucré"
     ]
    },
    "vigilance": "Réglages individuels (chaque estomac opéré réagit différemment). Surveillez le poids et d'éventuelles carences (fer, B12) selon la chirurgie. Consultez si malaises fréquents, amaigrissement."
   }
  ]
 },
 {
  "cat": "Intolérances & malabsorptions",
  "icon": "🥛",
  "items": [
   {
    "id": "gluten",
    "name": "Sans gluten — maladie cœliaque",
    "niveau": 1,
    "pourquoi": "Dans la maladie cœliaque, le gluten déclenche une réaction qui <strong>abîme l'intestin grêle</strong> et empêche l'absorption des nutriments. Le <strong>seul traitement</strong> est l'éviction <strong>totale et à vie</strong> du gluten : l'intestin cicatrise alors et le risque de complications diminue.",
    "principes": [
     "<strong>Zéro gluten</strong> : blé, orge, seigle (et dérivés) supprimés <strong>définitivement</strong>.",
     "Attention aux <strong>traces et contaminations</strong> (même miette) : ustensiles, grille-pain, farines en suspension, plats préparés, sauces, additifs.",
     "Lisez <strong>toutes</strong> les étiquettes ; repérez le logo « épi barré ».",
     "L'avoine est tolérée seulement si <strong>certifiée sans contamination</strong>."
    ],
    "journee": {
     "pdj": "Pain sans gluten + confiture, œuf",
     "dej": "Steak + riz + légumes",
     "col": "Yaourt + fruit",
     "din": "Omelette + pommes de terre + salade"
    },
    "tab": {
     "okT": "Naturellement sans gluten",
     "koT": "Interdits (contiennent du gluten)",
     "ok": [
      "Riz, maïs, pomme de terre, quinoa, sarrasin",
      "Viandes, poissons, œufs <strong>non panés</strong>",
      "Légumes, fruits, légumineuses",
      "Produits laitiers nature",
      "Produits certifiés « sans gluten »"
     ],
     "ko": [
      "Blé, orge, seigle, épeautre",
      "Pain, pâtes, semoule, biscuits ordinaires",
      "Bière, panures, chapelure",
      "Sauce soja classique, plats préparés (sauf mention)",
      "Aliments « traces de gluten »"
     ]
    },
    "vigilance": "⚠️ <strong>Niveau absolu</strong> : il n'existe <strong>aucune</strong> quantité tolérée. Ne débutez jamais le régime <strong>avant</strong> le diagnostic (cela fausse les tests). Suivi diététique + surveillance des carences (fer, B9, B12, calcium).",
    "erreur": "gluten_bienetre",
    "retenir": "Ici, pas de « petit écart » : chaque contamination entretient la maladie."
   },
   {
    "id": "lactose",
    "name": "Pauvre en lactose",
    "niveau": 3,
    "pourquoi": "Le lactose (sucre du lait) est mal digéré par manque d'une enzyme : d'où ballonnements, gaz, diarrhée. Ce n'est <strong>pas une allergie</strong> : la plupart des gens en tolèrent une <strong>petite quantité</strong>. Le but est de trouver <strong>votre</strong> seuil, pas de tout supprimer.",
    "principes": [
     "Réduisez les sources de lactose, ne les supprimez pas forcément toutes.",
     "Le lactose se tolère mieux <strong>en petite quantité et au cours d'un repas</strong>.",
     "<strong>Fromages affinés</strong> (comté, emmental…) et <strong>yaourts</strong> sont souvent bien tolérés (peu de lactose).",
     "Laits et produits « sans lactose » ou végétaux en alternative.",
     "Gardez un <strong>apport suffisant en calcium</strong>."
    ],
    "journee": {
     "pdj": "Lait sans lactose + tartines",
     "dej": "Viande + légumes + fromage affiné",
     "col": "Yaourt",
     "din": "Poisson + riz + amandes"
    },
    "tab": {
     "okT": "Bien tolérés",
     "koT": "Riches en lactose (à limiter / tester)",
     "ok": [
      "Fromages affinés (comté, parmesan)",
      "Yaourts, laits fermentés",
      "Laits sans lactose / végétaux enrichis",
      "Beurre (en petite quantité)"
     ],
     "ko": [
      "Lait (surtout à jeun, en grande quantité)",
      "Crème dessert, béchamel",
      "Fromage frais, crème fraîche",
      "Glaces, lait concentré"
     ]
    },
    "vigilance": "Sur-mesure : inutile d'éliminer ce que vous tolérez. Attention à ne pas manquer de <strong>calcium / vitamine D</strong>. Un test d'exclusion / réintroduction aide à confirmer."
   },
   {
    "id": "fructose",
    "name": "Pauvre en fructose / sorbitol",
    "niveau": 3,
    "pourquoi": "Certaines personnes absorbent mal le fructose (sucre des fruits) et le sorbitol (édulcorant) : fermentation, gaz, douleurs, diarrhée. On réduit selon <strong>votre</strong> tolérance.",
    "principes": [
     "Limiter les aliments très riches en fructose libre et en sorbitol.",
     "Répartir les fruits dans la journée (petites quantités).",
     "Le fructose passe mieux <strong>accompagné de glucose</strong> (fruits « équilibrés »).",
     "Éviter les édulcorants en « -ol »."
    ],
    "journee": {
     "pdj": "Pain + beurre + kiwi",
     "dej": "Viande + riz + carottes",
     "col": "Quelques fraises",
     "din": "Poisson + pommes de terre + courgettes"
    },
    "tab": {
     "okT": "Mieux tolérés",
     "koT": "À limiter",
     "ok": [
      "Banane, agrumes, fraise, kiwi (petites quantités)",
      "Légumes, féculents",
      "Sucre de table modéré"
     ],
     "ko": [
      "Pomme, poire, mangue, cerise",
      "Miel, sirops (agave, glucose-fructose)",
      "Chewing-gums / bonbons « sans sucre » (sorbitol)",
      "Jus de fruits, fruits secs"
     ]
    },
    "vigilance": "Seuil individuel ; réintroduire progressivement. Éviter la sur-restriction des fruits (fibres, vitamines)."
   }
  ]
 },
 {
  "cat": "Intestin & troubles fonctionnels",
  "icon": "🌀",
  "items": [
   {
    "id": "fodmap",
    "name": "Pauvre en FODMAP (côlon irritable)",
    "niveau": 3,
    "pourquoi": "Les FODMAP sont des sucres fermentescibles présents dans de nombreux aliments : chez les personnes au <strong>côlon irritable</strong>, ils provoquent gaz, ballonnements, douleurs, troubles du transit. Les réduire <strong>temporairement</strong> soulage, puis on réintroduit pour bâtir une alimentation la plus large possible.",
    "principes": [
     "<strong>Phase 1 — Exclusion</strong> (2–6 semaines) : on réduit fortement les FODMAP → on juge l'amélioration.",
     "<strong>Phase 2 — Réintroduction</strong> (progressive) : on teste chaque groupe pour repérer <strong>ceux qui VOUS gênent</strong> et à quelle dose.",
     "<strong>Phase 3 — Personnalisation</strong> : on ne garde que les évictions utiles → régime durable et varié."
    ],
    "journee": {
     "pdj": "(Exclusion) Pain au levain / sans gluten + œuf",
     "dej": "Poulet + riz + carottes / épinards",
     "col": "Quelques myrtilles + noix",
     "din": "Poisson + pommes de terre + courgettes"
    },
    "tab": {
     "okT": "Pauvres en FODMAP",
     "koT": "Riches en FODMAP (phase 1)",
     "ok": [
      "Riz, quinoa, pomme de terre, avoine",
      "Carotte, courgette, épinard, haricot vert",
      "Banane, orange, kiwi, myrtille, fraise",
      "Viande, poisson, œuf, fromages affinés",
      "Lait sans lactose, boissons végétales adaptées"
     ],
     "ko": [
      "Blé en grande quantité, seigle",
      "Oignon, ail, chou-fleur, champignon",
      "Pomme, poire, pastèque, fruits secs",
      "Légumineuses (pois chiches, lentilles)",
      "Lait, miel, édulcorants en « -ol »"
     ]
    },
    "vigilance": "⚠️ <strong>Ne restez pas en phase d'exclusion à long terme</strong> : c'est appauvrissant (nutrition, microbiote). La <strong>réintroduction est obligatoire</strong>. Idéalement accompagné par un(e) diététicien(ne).",
    "erreur": "fodmap",
    "retenir": "Le but n'est pas de manger le moins possible, mais de retrouver le plus d'aliments possible."
   },
   {
    "id": "fibres",
    "name": "Riche en fibres + hydratation (constipation, hémorroïdes)",
    "niveau": 4,
    "pourquoi": "Les fibres et l'eau augmentent le volume des selles et les ramollissent : le transit s'accélère et l'exonération est plus facile, ce qui soulage aussi la maladie hémorroïdaire.",
    "principes": [
     "Augmentez les fibres <strong>progressivement</strong> (sinon ballonnements).",
     "Buvez ≥ 1,5 L/j.",
     "Bougez ; horaires réguliers aux toilettes.",
     "Les fibres solubles (avoine, psyllium) sont souvent les mieux tolérées."
    ],
    "journee": {
     "pdj": "Flocons d'avoine + pruneaux",
     "dej": "Légumineuses + légumes + pain complet",
     "col": "Fruit + eau",
     "din": "Soupe de légumes + poisson + riz complet"
    },
    "tab": {
     "okT": "À privilégier",
     "koT": "À limiter",
     "ok": [
      "Fruits et légumes (avec peau lavée)",
      "Céréales complètes, avoine",
      "Légumineuses, pruneaux",
      "Eau (+++)"
     ],
     "ko": [
      "Excès d'aliments raffinés (pain blanc)",
      "Excès de riz blanc / pâtes seuls",
      "Plats gras / industriels pauvres en fibres",
      "Manque de boisson"
     ]
    },
    "vigilance": "Aucune interdiction : c'est une orientation durable. Augmentation trop rapide = ballonnements. Consultez si constipation récente et inhabituelle, sang, amaigrissement."
   },
   {
    "id": "sans_residu",
    "name": "Sans résidu / pauvre en fibres",
    "niveau": 2,
    "pourquoi": "En cas de rétrécissement (sténose), de poussée intestinale ou avant certains examens / chirurgies, on met l'intestin <strong>au repos</strong> en réduisant ce qui fait du « résidu » (fibres). C'est <strong>transitoire</strong>.",
    "principes": [
     "Supprimer temporairement fibres, crudités, peaux, légumineuses, céréales complètes.",
     "Privilégier aliments <strong>cuits, raffinés, tendres</strong>.",
     "Réélargir dès que le médecin l'autorise."
    ],
    "journee": {
     "pdj": "Pain blanc + gelée, thé",
     "dej": "Jambon + riz blanc + carottes bien cuites",
     "col": "Compote lisse",
     "din": "Poisson + purée + fromage"
    },
    "tab": {
     "okT": "Autorisés",
     "koT": "À éviter (temporairement)",
     "ok": [
      "Pain blanc, riz blanc, pâtes",
      "Viandes / poissons tendres, œufs",
      "Légumes bien cuits sans peau",
      "Compotes lisses, banane mûre",
      "Fromages"
     ],
     "ko": [
      "Légumes crus, peaux, pépins",
      "Légumineuses, maïs, chou",
      "Céréales complètes, son",
      "Fruits secs, oléagineux",
      "Fruits crus fibreux"
     ]
    },
    "vigilance": "⚠️ <strong>Ne pas prolonger</strong> au-delà de la durée prescrite (appauvrissant). Réintroduction progressive des fibres ensuite."
   },
   {
    "id": "diverticules",
    "name": "Diverticules (diverticulose / diverticulite)",
    "niveau": 4,
    "niveauNote": "Niveau 2 (strict & temporaire) pendant une crise — niveau 4 (hygiène de vie) en prévention.",
    "pourquoi": "Les diverticules sont de petites poches sur le côlon. <strong>Hors crise</strong>, les fibres les protègent. <strong>En crise (diverticulite)</strong>, on met le côlon au repos avec un régime pauvre en résidus quelques jours, puis on réélargit.",
    "principes": [
     "<strong>En crise</strong> : pauvre en résidus / liquide, selon consignes, temporairement.",
     "<strong>En prévention</strong> : alimentation <strong>riche en fibres</strong>, hydratation, activité."
    ],
    "journee": {
     "pdj": "(Prévention) Muesli + fruit",
     "dej": "Légumes + légumineuses + pain complet",
     "col": "Fruit",
     "din": "Soupe + poisson + riz complet"
    },
    "tab": {
     "okT": "Conseillés (prévention)",
     "koT": "À limiter",
     "ok": [
      "Fruits, légumes, céréales complètes",
      "Légumineuses, eau"
     ],
     "ko": [
      "Excès de plats gras / industriels",
      "Alimentation pauvre en fibres"
     ]
    },
    "vigilance": "En crise, suivez les consignes temporaires ; consultez si fièvre, douleur intense, arrêt du transit.",
    "erreur": "diverticules"
   }
  ]
 },
 {
  "cat": "MICI (Crohn, RCH)",
  "icon": "🎗",
  "items": [
   {
    "id": "mici_poussee",
    "name": "Alimentation en poussée (pauvre en résidus)",
    "niveau": 2,
    "pourquoi": "Pendant une poussée (ou en cas de rétrécissement), réduire les fibres limite l'inconfort et le volume des selles, le temps que l'inflammation régresse. <strong>Ce n'est pas le régime de fond de la maladie.</strong>",
    "principes": [
     "Pauvre en résidus temporairement (voir fiche « Sans résidu »).",
     "Réélargir en rémission.",
     "Hors poussée, <strong>pas de régime restrictif systématique</strong> (risque de dénutrition)."
    ],
    "journee": {
     "pdj": "Pain blanc + gelée, thé",
     "dej": "Jambon + riz blanc + carottes bien cuites",
     "col": "Compote lisse",
     "din": "Poisson + purée + fromage"
    },
    "tab": {
     "okT": "Autorisés",
     "koT": "À éviter (temporairement)",
     "ok": [
      "Pain blanc, riz blanc, pâtes",
      "Viandes / poissons tendres, œufs",
      "Légumes bien cuits sans peau",
      "Compotes lisses, banane mûre"
     ],
     "ko": [
      "Légumes crus, peaux, pépins",
      "Légumineuses, maïs, chou",
      "Céréales complètes, son",
      "Fruits secs, oléagineux"
     ]
    },
    "vigilance": "En <strong>rémission</strong>, l'objectif est une alimentation <strong>variée</strong> (souvent de type méditerranéen). Ne vous sur-restreignez pas entre les poussées."
   },
   {
    "id": "nee",
    "name": "Nutrition entérale exclusive (NEE)",
    "niveau": 2,
    "pourquoi": "Dans la maladie de Crohn (surtout chez l'enfant / adolescent), remplacer <strong>toute</strong> l'alimentation par un mélange nutritionnel complet pendant quelques semaines peut <strong>calmer l'inflammation</strong> (induire la rémission), sans corticoïdes.",
    "principes": [
     "Uniquement le <strong>produit nutritionnel prescrit</strong>, à la quantité indiquée, pendant la durée fixée (souvent 6–8 semaines).",
     "Réintroduction alimentaire <strong>progressive et encadrée</strong>."
    ],
    "journee": {
     "libre": "Prises fractionnées du mélange nutritionnel prescrit (oral ou par sonde), réparties sur la journée."
    },
    "tab": {
     "okT": "Pendant la NEE",
     "koT": "Pendant la NEE",
     "ok": [
      "Le mélange nutritionnel prescrit"
     ],
     "ko": [
      "Tout autre aliment / boisson (sauf eau si autorisée)"
     ]
    },
    "vigilance": "Encadrement médical / diététique strict. Réintroduction progressive ensuite. Ne pas interrompre sans avis."
   },
   {
    "id": "cded",
    "name": "Régime d'exclusion de Crohn (CDED) ± nutrition partielle",
    "niveau": 2,
    "niveauNote": "Niveau 2 à 3 selon la phase du protocole.",
    "pourquoi": "Combine une <strong>alimentation structurée</strong> (aliments choisis) et un complément nutritionnel, pour réduire l'exposition aux composants alimentaires suspectés d'entretenir l'inflammation.",
    "principes": [
     "Phases définies avec listes d'aliments imposées et complément nutritionnel partiel.",
     "Suivi diététique indispensable.",
     "Assouplissement progressif selon les phases."
    ],
    "journee": {
     "libre": "Aliments « autorisés de la phase » (poulet, œuf, pomme de terre, riz, banane, pomme…) + complément prescrit."
    },
    "tab": {
     "okT": "Autorisés",
     "koT": "Exclus",
     "ok": [
      "Selon protocole / phase (liste fournie par l'équipe)"
     ],
     "ko": [
      "Selon protocole / phase"
     ]
    },
    "vigilance": "Uniquement dans un cadre médical structuré ; ne pas improviser."
   },
   {
    "id": "mici_entretien",
    "name": "Alimentation d'entretien (méditerranéenne)",
    "niveau": 4,
    "pourquoi": "Hors poussée, une alimentation variée de type méditerranéen soutient l'état nutritionnel et pourrait limiter l'inflammation de bas grade. Aucun interdit strict.",
    "principes": [
     "Fruits, légumes, poisson, huile d'olive, légumineuses, céréales complètes.",
     "Limiter ultra-transformés, sucres ajoutés, viandes transformées."
    ],
    "journee": {
     "pdj": "Yaourt + fruits + noix",
     "dej": "Poisson + légumes + huile d'olive + quinoa",
     "col": "Fruit",
     "din": "Légumineuses + légumes + pain complet"
    },
    "tab": {
     "okT": "À privilégier",
     "koT": "À limiter",
     "ok": [
      "Légumes, fruits, poisson, huile d'olive",
      "Légumineuses, céréales complètes"
     ],
     "ko": [
      "Charcuteries, viandes transformées",
      "Plats ultra-transformés, sodas"
     ]
    },
    "vigilance": "À adapter à la tolérance individuelle (certaines fibres gênent selon les personnes)."
   }
  ]
 },
 {
  "cat": "Pancréas",
  "icon": "🧬",
  "items": [
   {
    "id": "pancreatite_aigue",
    "name": "Reprise alimentaire après pancréatite aiguë",
    "niveau": 2,
    "pourquoi": "Après une inflammation aiguë du pancréas, on reprend l'alimentation <strong>progressivement</strong> et <strong>pauvre en graisses</strong> pour ne pas trop solliciter l'organe, puis on élargit selon la tolérance.",
    "principes": [
     "Reprise précoce dès que possible.",
     "<strong>Pauvre en graisses</strong> au début ; petites portions.",
     "Élargissement progressif.",
     "<strong>Arrêt de l'alcool</strong>."
    ],
    "journee": {
     "pdj": "Pain + confiture, compote",
     "dej": "Blanc de poulet + riz + légumes vapeur",
     "col": "Yaourt maigre",
     "din": "Poisson maigre + purée à l'eau"
    },
    "tab": {
     "okT": "Au début",
     "koT": "À éviter au début",
     "ok": [
      "Féculents, légumes cuits",
      "Viandes / poissons maigres",
      "Laitages maigres",
      "Fruits cuits / compotes"
     ],
     "ko": [
      "Fritures, plats gras, sauces",
      "Charcuterie, fromages gras",
      "Alcool (à supprimer)",
      "Pâtisseries riches"
     ]
    },
    "vigilance": "Restriction lipidique <strong>transitoire</strong>. Alcool à arrêter durablement si en cause. Réélargir selon tolérance."
   },
   {
    "id": "pancreatite_chronique",
    "name": "Pancréatite chronique / insuffisance pancréatique",
    "niveau": 3,
    "pourquoi": "Le pancréas ne fabrique plus assez d'enzymes : les graisses sont mal digérées (diarrhée grasse, amaigrissement). La solution n'est <strong>pas</strong> de supprimer les graisses, mais de <strong>manger normalement AVEC les enzymes pancréatiques</strong> prescrites.",
    "principes": [
     "Apport en graisses <strong>normal</strong> réparti sur des repas fractionnés.",
     "<strong>Prendre les extraits pancréatiques pendant chaque repas / collation grasse</strong>.",
     "<strong>Arrêt de l'alcool et du tabac</strong>.",
     "Corriger les carences en vitamines (A, D, E, K).",
     "TCM seulement si malabsorption sévère persistante."
    ],
    "journee": {
     "pdj": "Pain + beurre + œuf (+ enzymes)",
     "dej": "Viande + féculents + légumes + huile d'olive (+ enzymes)",
     "col": "Fromage + fruit",
     "din": "Poisson + pommes de terre + légumes (+ enzymes)"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À éviter",
     "ok": [
      "Repas complets <strong>avec enzymes</strong>",
      "Protéines, féculents, légumes",
      "Graisses en quantité <strong>normale</strong>",
      "Fractionnement"
     ],
     "ko": [
      "Alcool (à supprimer)",
      "Jeûne / sauts de repas",
      "Restriction sévère des graisses",
      "Grands repas espacés"
     ]
    },
    "vigilance": "Ajustez plutôt la dose d'enzymes. Surveillance du poids et des vitamines.",
    "erreur": "pancreatite"
   }
  ]
 },
 {
  "cat": "Foie & voies biliaires",
  "icon": "🫀",
  "items": [
   {
    "id": "cirrhose",
    "name": "Cirrhose & dénutrition",
    "niveau": 4,
    "niveauNote": "Hygiène de vie avec apports renforcés — les protéines sont à maintenir.",
    "pourquoi": "La cirrhose fait fondre les muscles et épuise les réserves. Bien manger, <strong>avec assez de protéines et d'énergie</strong>, protège la masse musculaire et diminue les complications.",
    "principes": [
     "<strong>Ne réduisez PAS les protéines</strong> : au contraire, apport <strong>élevé</strong> (viande, poisson, œufs, laitages, légumineuses).",
     "<strong>Fractionnez</strong> (3 repas + collations).",
     "<strong>Collation le soir tard</strong> (avant le coucher) pour éviter le jeûne nocturne qui « attaque » les muscles.",
     "Apport calorique suffisant."
    ],
    "journee": {
     "pdj": "Œufs + pain + laitage",
     "dej": "Viande / poisson + féculents + légumes + huile d'olive",
     "col": "Fromage + fruit",
     "din": "Poisson + féculents — puis collation nocturne : lait / yaourt + biscuits ou pain"
    },
    "tab": {
     "okT": "À privilégier",
     "koT": "À éviter",
     "ok": [
      "Protéines à chaque repas",
      "Collation du soir",
      "Féculents, énergie suffisante"
     ],
     "ko": [
      "Sauter des repas / jeûner",
      "Restriction protéique (fausse bonne idée)",
      "Alcool (à supprimer)"
     ]
    },
    "vigilance": "Si ascite → associer le <strong>régime hyposodé</strong>. Si encéphalopathie → <strong>maintenir</strong> les protéines. Suivi diététique recommandé."
   },
   {
    "id": "hyposode",
    "name": "Hyposodé (ascite, rétention d'eau)",
    "niveau": 3,
    "niveauNote": "Sur-mesure mais important : visez un hyposodé réaliste et tenable.",
    "pourquoi": "Le sel retient l'eau et favorise l'ascite et les œdèmes. Réduire le sel aide les médicaments (diurétiques) à évacuer cette eau.",
    "principes": [
     "Viser <strong>~2 g de sodium/j</strong> (≈ 5 g de sel).",
     "Ne pas <strong>ajouter de sel</strong> ; cuisiner avec herbes / épices.",
     "Traquer le <strong>sel caché</strong> (pain, charcuterie, fromages, plats préparés, conserves, eaux gazeuses salées).",
     "<strong>Pas de restriction d'eau</strong> sauf hyponatrémie (sur avis médical)."
    ],
    "journee": {
     "pdj": "Pain sans sel + confiture + fruit",
     "dej": "Viande non salée + légumes frais + riz + herbes",
     "col": "Fruit + yaourt nature",
     "din": "Poisson + pommes de terre + huile d'olive"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À éviter (riches en sel)",
     "ok": [
      "Aliments frais, faits maison",
      "Herbes, épices, citron",
      "Pain sans sel",
      "Eau plate peu minéralisée"
     ],
     "ko": [
      "Charcuterie, fromages salés",
      "Plats préparés, conserves, soupes industrielles",
      "Chips, biscuits apéritifs, olives",
      "Eaux gazeuses salées, bouillons cubes"
     ]
    },
    "vigilance": "Ne pas confondre avec une restriction d'eau (inutile voire dangereuse sauf hyponatrémie). Le régime « sans aucun sel » est difficile à tenir et peut couper l'appétit → viser un <strong>hyposodé réaliste</strong>."
   },
   {
    "id": "encephalopathie",
    "name": "Encéphalopathie hépatique",
    "niveau": 4,
    "niveauNote": "Protéines à maintenir — c'est le message clé.",
    "pourquoi": "Quand le foie filtre mal, des toxines atteignent le cerveau (confusion). <strong>Contrairement à une idée ancienne, il ne faut PAS diminuer les protéines</strong> : on les maintient, en privilégiant certaines sources mieux tolérées.",
    "principes": [
     "<strong>Apport protéique normal à élevé</strong>.",
     "Privilégier protéines <strong>végétales et laitières</strong>.",
     "<strong>Fractionner</strong> + <strong>collation nocturne</strong>.",
     "Associer le traitement prescrit (lactulose…)."
    ],
    "journee": {
     "pdj": "Laitage + pain + fruit",
     "dej": "Légumineuses + légumes + féculents + un peu de fromage",
     "col": "Yaourt",
     "din": "Œufs / poisson + féculents — collation nocturne : laitage"
    },
    "tab": {
     "okT": "À privilégier",
     "koT": "À éviter",
     "ok": [
      "Protéines végétales (légumineuses)",
      "Laitages, œufs",
      "Fractionnement + collation du soir"
     ],
     "ko": [
      "Restriction protéique",
      "Jeûne prolongé",
      "Alcool"
     ]
    },
    "vigilance": "Suivez le traitement et maintenez les apports.",
    "erreur": "encephalopathie"
   },
   {
    "id": "mash",
    "name": "Stéatose / MASH (foie gras — MASLD)",
    "niveau": 4,
    "pourquoi": "L'excès de graisse dans le foie est lié au surpoids, au sucre et à l'alcool. Une <strong>perte de poids progressive</strong> et une alimentation de type méditerranéen peuvent <strong>faire régresser</strong> cette atteinte.",
    "principes": [
     "Réduire les <strong>sucres rapides</strong> et <strong>boissons sucrées</strong> (fructose ++).",
     "Réduire l'alcool.",
     "Type <strong>méditerranéen</strong>.",
     "<strong>Perte de poids</strong> 7–10 % si surpoids, progressive.",
     "Activité physique régulière."
    ],
    "journee": {
     "pdj": "Yaourt nature + fruits + noix",
     "dej": "Poisson + légumes + huile d'olive + quinoa",
     "col": "Fruit",
     "din": "Légumineuses + légumes"
    },
    "tab": {
     "okT": "À privilégier",
     "koT": "À limiter",
     "ok": [
      "Légumes, fruits entiers, poisson",
      "Huile d'olive, oléagineux",
      "Céréales complètes, légumineuses"
     ],
     "ko": [
      "Sodas, jus, sirops (fructose)",
      "Pâtisseries, ultra-transformés",
      "Alcool",
      "Fritures, fast-food"
     ]
    },
    "vigilance": "Pas d'interdit absolu : la <strong>régularité</strong> et le poids comptent. Perte de poids <strong>progressive</strong> (une perte trop rapide peut être contre-productive)."
   },
   {
    "id": "vesicule",
    "name": "Lithiase biliaire / après ablation de la vésicule",
    "niveau": 3,
    "niveauNote": "Souvent transitoire : la tolérance revient le plus souvent à la normale après l'opération.",
    "pourquoi": "Les graisses stimulent la vésicule et peuvent déclencher des douleurs (colique). Avant l'intervention, ou juste après l'ablation, un régime <strong>pauvre en graisses</strong> limite l'inconfort. Après cholécystectomie, la tolérance revient le plus souvent à la normale.",
    "principes": [
     "Réduire temporairement les graisses (surtout fritures, sauces).",
     "Fractionner.",
     "Réintroduire progressivement après l'opération selon la tolérance."
    ],
    "journee": {
     "pdj": "Pain + un peu de confiture + fruit",
     "dej": "Volaille maigre + riz + légumes",
     "col": "Compote",
     "din": "Poisson maigre + purée à l'eau"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À limiter",
     "ok": [
      "Viandes / poissons maigres",
      "Féculents, légumes cuits",
      "Laitages maigres"
     ],
     "ko": [
      "Fritures, plats en sauce",
      "Charcuterie, fromages gras",
      "Pâtisseries riches, crème"
     ]
    },
    "vigilance": "Souvent <strong>transitoire</strong> : la plupart des patients remangent normalement après l'ablation. Réintroduire les graisses par étapes."
   },
   {
    "id": "wilson",
    "name": "Maladie de Wilson (pauvre en cuivre)",
    "niveau": 1,
    "niveauNote": "Strict, en appoint du traitement médicamenteux — qu'il ne remplace jamais.",
    "pourquoi": "Le cuivre s'accumule et devient toxique (foie, cerveau). En complément <strong>indispensable</strong> du traitement médicamenteux, on évite les aliments <strong>très riches en cuivre</strong>, surtout en début de traitement.",
    "principes": [
     "Éviter les aliments à forte teneur en cuivre.",
     "Attention à l'<strong>eau</strong> (canalisations en cuivre).",
     "Démarche <strong>à vie</strong>, associée au traitement (chélateur / zinc)."
    ],
    "journee": {
     "libre": "Alimentation normale en excluant les aliments riches en cuivre listés ci-dessous."
    },
    "tab": {
     "okT": "Autorisés",
     "koT": "À éviter (riches en cuivre)",
     "ok": [
      "La plupart des aliments courants",
      "Viandes, volailles, œufs",
      "Laitages, féculents",
      "Légumes / fruits (hors exceptions)"
     ],
     "ko": [
      "Foie, abats",
      "Fruits de mer, crustacés",
      "Chocolat, cacao",
      "Fruits à coque, graines",
      "Champignons, légumineuses (à limiter)"
     ]
    },
    "vigilance": "⚠️ Le régime <strong>ne remplace pas</strong> le traitement : il l'accompagne. Suivi spécialisé strict."
   },
   {
    "id": "hemochromatose",
    "name": "Hémochromatose (surcharge en fer)",
    "niveau": 4,
    "niveauNote": "Précautions ciblées — pas de régime « sans fer » drastique.",
    "pourquoi": "Le corps absorbe trop de fer, qui s'accumule. Le traitement principal est la <strong>saignée</strong> (phlébotomie). L'alimentation joue un rôle <strong>secondaire</strong> : quelques précautions ciblées suffisent, <strong>pas</strong> un régime « sans fer » drastique.",
    "principes": [
     "Ne pas prendre de <strong>vitamine C</strong> pendant les repas (elle augmente l'absorption du fer).",
     "<strong>Pas de compléments en fer</strong> ni multivitamines contenant du fer.",
     "<strong>Limiter l'alcool</strong> (toxique pour le foie surchargé).",
     "Le thé au cours du repas réduit un peu l'absorption.",
     "Inutile de bannir la viande rouge."
    ],
    "journee": {
     "pdj": "Thé + pain + fromage",
     "dej": "Repas normal (fruits riches en vit. C à distance)",
     "col": "Fruit",
     "din": "Normal, sans alcool"
    },
    "tab": {
     "okT": "Conseillés",
     "koT": "À éviter",
     "ok": [
      "Thé au cours des repas",
      "Alimentation variée"
     ],
     "ko": [
      "Compléments en fer",
      "Vitamine C pendant les repas",
      "Alcool (surtout)",
      "Excès de foie / abats (fer héminique)"
     ]
    },
    "vigilance": "La <strong>saignée</strong> reste le traitement clé. Pas de régime restrictif inutile : quelques précautions suffisent."
   }
  ]
 },
 {
  "cat": "Chirurgie digestive & stomies",
  "icon": "🩹",
  "items": [
   {
    "id": "postop",
    "name": "Progression des textures après chirurgie",
    "niveau": 2,
    "pourquoi": "Après une opération digestive, le tube digestif redémarre par étapes. On progresse <strong>liquide → mixé → normal</strong> pour éviter douleurs et complications.",
    "principes": [
     "Respecter les paliers indiqués.",
     "Petites quantités, mastication.",
     "Hydratation.",
     "Passer au palier suivant seulement si bien toléré."
    ],
    "journee": {
     "libre": "Selon palier : bouillons / veloutés → purées / mixés → alimentation normale fractionnée."
    },
    "tab": {
     "okT": "Selon palier",
     "koT": "Trop tôt",
     "ok": [
      "Liquides puis mixés puis normal",
      "Petites portions"
     ],
     "ko": [
      "Sauter les paliers",
      "Grosses portions, aliments durs"
     ]
    },
    "vigilance": "Progression <strong>temporaire</strong>. Suivre les consignes de l'équipe chirurgicale."
   },
   {
    "id": "stomie",
    "name": "Iléostomie / colostomie",
    "niveau": 3,
    "pourquoi": "Après une stomie, l'objectif est de <strong>maîtriser le débit et l'hydratation</strong>, surtout en cas d'iléostomie (pertes d'eau et de sel importantes). On réintroduit les aliments progressivement selon la tolérance.",
    "principes": [
     "<strong>Bien s'hydrater</strong> et <strong>saler</strong> suffisamment (iléostomie).",
     "Réintroduire les fibres <strong>progressivement</strong>.",
     "Mâcher longuement (aliments filandreux).",
     "Repérer les aliments qui accélèrent ou épaississent le débit, ceux qui donnent des gaz / odeurs."
    ],
    "journee": {
     "pdj": "Pain blanc + fromage + banane",
     "dej": "Viande tendre + riz + carottes cuites",
     "col": "Yaourt",
     "din": "Poisson + purée — + boissons salées / réhydratation"
    },
    "tab": {
     "okT": "Souvent bien tolérés",
     "koT": "À introduire prudemment",
     "ok": [
      "Riz, pâtes, pommes de terre",
      "Banane, compotes",
      "Viandes tendres, poisson",
      "Boissons + apport de sel"
     ],
     "ko": [
      "Légumes fibreux, peaux, pépins",
      "Maïs, champignons, fruits secs",
      "Légumineuses (gaz)",
      "Excès de crudités"
     ]
    },
    "vigilance": "Iléostomie = <strong>surveiller la déshydratation</strong> (fatigue, urines foncées, débit élevé). Accompagnement par une infirmière stomathérapeute."
   }
  ]
 },
 {
  "cat": "Régimes préparatoires (examens)",
  "icon": "🔬",
  "items": [
   {
    "id": "prep_colo",
    "name": "Pauvre en résidus avant coloscopie",
    "niveau": 2,
    "pourquoi": "Pour bien voir le côlon, il doit être <strong>parfaitement propre</strong>. Un régime sans résidu les jours précédant l'examen + la préparation évacuatrice permettent une coloscopie de qualité (et évitent de devoir la refaire).",
    "principes": [
     "<strong>3 à 5 jours avant</strong> : supprimer fibres, fruits / légumes, graines, céréales complètes.",
     "<strong>La veille</strong> : alimentation légère puis <strong>liquides clairs</strong> + préparation prescrite.",
     "<strong>À jeun</strong> le jour J selon consignes.",
     "Éviter les aliments <strong>rouges / violets</strong> (colorants) les derniers jours."
    ],
    "journee": {
     "pdj": "(J-3 à J-1) Pain blanc + miel, thé / café sans lait",
     "dej": "Jambon / poisson + riz blanc + pâtes",
     "col": "Gelée de fruits, bouillon",
     "din": "Bouillon clair + pâtes fines"
    },
    "tab": {
     "okT": "Autorisés",
     "koT": "Interdits avant l'examen",
     "ok": [
      "Pain blanc, riz blanc, pâtes",
      "Viandes / poissons maigres, œufs",
      "Bouillons clairs, gelées",
      "Fromage à pâte dure",
      "Eau, thé / café sans lait, boissons claires non rouges"
     ],
     "ko": [
      "Fruits et légumes, peaux, pépins",
      "Céréales complètes, légumineuses",
      "Graines, oléagineux",
      "Laitages en grande quantité",
      "Aliments / boissons <strong>rouges ou violets</strong>"
     ]
    },
    "vigilance": "⚠️ Le respect de ce régime <strong>conditionne la réussite de l'examen</strong> : un côlon mal préparé peut obliger à <strong>recommencer</strong>. Suivez précisément les horaires de la préparation prescrite."
   }
  ]
 }
];
