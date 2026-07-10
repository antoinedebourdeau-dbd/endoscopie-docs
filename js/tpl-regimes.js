// GÉNÉRÉ par tools/extract-regimes.py depuis les briefs v3 (~/Downloads/regimes-v3/)
// — contenu médical validé A. Debourdeau. Ne pas éditer à la main.
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
  "sens": "Des habitudes protectrices à installer durablement, sans interdit strict.",
  "ecart": "Aucun aliment n'est « interdit » : c'est la tendance générale qui compte, pas l'écart ponctuel."
 }
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
    "ecart": "symptôme transitoire qui vous renseigne sur votre limite. Rien de dangereux ; on personnalise.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le reflux = remontée du contenu acide de l'estomac vers l'œsophage. Repas gras/copieux, position allongée après manger et surpoids favorisent ces remontées ; certains aliments irritent l'œsophage déjà sensible. En corrigeant ces facteurs, on réduit les brûlures — souvent assez pour alléger les médicaments."
     },
     {
      "k": "principes",
      "items": [
       "Alléger et étaler (petits repas fréquents).",
       "Ne pas s'allonger le ventre plein (dîner ≥ 3 h avant le coucher, tête de lit surélevée).",
       "Repérer <strong>vos</strong> déclencheurs (on ne supprime que ce qui gêne)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "<strong>Ce soir</strong> : dîner plus tôt et plus léger + surélever la tête du lit (cales de 10–15 cm sous les pieds du lit, pas des oreillers).",
       "<strong>Semaine 1</strong> : carnet « aliment → brûlure oui/non » pour trouver vos déclencheurs.",
       "<strong>Si surpoids</strong> : objectif de perte de poids progressive (le levier le plus efficace)."
      ]
     },
     {
      "k": "portions",
      "text": "Assiette = ½ légumes cuits + ¼ féculent + ¼ protéine maigre. Éviter de « faire le plein » : sortir de table sans lourdeur. Verre d'eau plutôt qu'un grand volume d'un coup."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "Petit-déjeuner",
       "Déjeuner",
       "Collation",
       "Dîner (tôt)"
      ],
      "rows": [
       [
        "Lun",
        "Avoine + banane + lait ½",
        "Poisson vapeur, riz, courgettes",
        "Yaourt nature",
        "Poulet, purée pdt, compote"
       ],
       [
        "Mar",
        "Pain complet + miel, tisane",
        "Dinde, pâtes, haricots verts",
        "Poire mûre",
        "Velouté légumes + œuf poché + riz"
       ],
       [
        "Mer",
        "Fromage blanc + biscottes",
        "Cabillaud, semoule, carottes",
        "Banane",
        "Blanc de dinde, riz, courgette"
       ],
       [
        "Jeu",
        "Flocons + poire",
        "Œufs, pdt vapeur, épinards",
        "Yaourt",
        "Soupe + jambon blanc + pain"
       ],
       [
        "Ven",
        "Pain + fromage frais",
        "Merlu, riz, fenouil braisé",
        "Compote",
        "Omelette + purée + salade douce"
       ],
       [
        "Sam",
        "Porridge + melon",
        "Poulet rôti, pdt, haricots verts",
        "Amandes (petite poignée)",
        "Poisson four, semoule, courgettes"
       ],
       [
        "Dim",
        "Pain perdu léger (four)",
        "Rôti de veau maigre, riz, carottes",
        "Fromage blanc",
        "Velouté + tartine + œuf"
       ]
      ]
     },
     {
      "k": "options",
      "text": "<em>P-déj</em> : avoine / pain complet / fromage blanc + fruit peu acide (banane, poire, melon). <em>Déj-dîner protéine</em> : poisson blanc, volaille, œuf, veau maigre. <em>Féculent</em> : riz, pâtes, pdt, semoule. <em>Légume cuit</em> : courgette, haricot vert, carotte, épinard, fenouil."
     },
     {
      "k": "recettes",
      "items": [
       "<strong>Papillote express</strong> : poisson blanc + rondelles de courgette + filet d'huile d'olive, four 15 min.",
       "<strong>Bowl doux</strong> : riz + blanc de poulet + carottes fondantes + un peu d'huile d'olive.",
       "<strong>Velouté minute</strong> : courgette + pdt mixées, une pointe de fromage frais."
      ]
     },
     {
      "k": "batch",
      "text": "Cuire d'avance une base de <strong>riz</strong> et de <strong>légumes fondants</strong> (courgette/carotte) ; portionner du <strong>poulet cuit</strong> ; compotes maison sans sucre. Assemblage en 5 min les soirs."
     },
     {
      "k": "collations",
      "text": "Yaourt nature, banane, poire mûre, melon, fromage blanc, biscottes, quelques amandes."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Café serré",
        "Café léger/déca, tisane (pas menthe)"
       ],
       [
        "Sauce tomate",
        "Légumes fondants, un peu de crème allégée"
       ],
       [
        "Friture",
        "Vapeur / four / poêle antiadhésive"
       ],
       [
        "Chocolat",
        "Fruit cuit, biscuit sec"
       ],
       [
        "Gros dîner tardif",
        "Dîner plus tôt + collation l'après-midi"
       ],
       [
        "Soda",
        "Eau plate / eau aromatisée maison"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Confort",
      "koT": "Souvent en cause",
      "ok": [
       "Viandes maigres, volaille, poisson, œufs",
       "Riz, pâtes, pain, pdt, semoule",
       "Légumes cuits (courgette, haricot, carotte, fenouil)",
       "Fruits peu acides (banane, poire, melon)",
       "Laitages allégés",
       "Eau, tisanes douces"
      ],
      "ko": [
       "Fritures, panures, sauces",
       "Charcuterie grasse",
       "Tomate, agrumes, jus acides",
       "Chocolat, menthe",
       "Café serré, alcool, sodas",
       "Repas copieux du soir"
      ]
     },
     {
      "k": "courses",
      "text": "Avoine, pain complet, riz, pâtes, pdt, semoule, biscottes ; poulet, dinde, poisson blanc, veau maigre, œufs ; courgette, haricot vert, carotte, épinard, fenouil ; banane, poire, melon ; yaourt nature, fromage blanc, fromage frais ; huile d'olive."
     },
     {
      "k": "deplacement",
      "text": "Grillades + légumes/féculents plutôt que fritures ; éviter café/alcool en fin de repas ; ne pas se coucher juste après."
     },
     {
      "k": "pieges",
      "text": "Manger vite ; dîner tard ; tout supprimer (inutile) ; oublier que <strong>poids + horaires</strong> priment sur la liste d'aliments."
     },
     {
      "k": "vigilance",
      "text": "Régime d'accompagnement, personnalisable. <strong>Consultez</strong> si : difficulté à avaler, amaigrissement, vomissements, anémie, brûlures persistantes."
     }
    ]
   },
   {
    "id": "dysphagie",
    "name": "Textures adaptées (dysphagie / sténose)",
    "niveau": 2,
    "ecart": "risque de blocage / fausse route. À respecter tant que la sténose n'est pas traitée.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Un rétrécissement de l'œsophage peut bloquer les solides et provoquer des fausses routes. Adapter la texture sécurise l'alimentation en attendant le traitement (dilatation, prothèse)."
     },
     {
      "k": "principes",
      "items": [
       "Texture selon le calibre (mixé/mouliné/tendre).",
       "Épaissir les liquides si fausses routes.",
       "Manger assis, lentement, petites bouchées, bien mâcher."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Adapter la texture au niveau indiqué.",
       "Préparer des bases « passe-partout » (purées, veloutés <strong>enrichis</strong>).",
       "Toujours un liquide (épaissi si besoin) pour faire passer."
      ]
     },
     {
      "k": "portions",
      "text": "Petits volumes fréquents (l'objectif est d'éviter fatigue et blocage) ; enrichir pour ne pas perdre de poids malgré de petites quantités."
     },
     {
      "k": "menu",
      "note": "mixé/tendre",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Semoule au lait lisse",
        "Poisson mixé + purée + carottes moulinées",
        "Yaourt lisse",
        "Velouté enrichi + pain de mie trempé"
       ],
       [
        "Mar",
        "Bouillie de céréales + compote",
        "Hachis parmentier lisse",
        "Crème dessert",
        "Soupe moulinée + œufs brouillés"
       ],
       [
        "Mer",
        "Fromage blanc lisse + compote",
        "Volaille mixée + polenta crémeuse",
        "Compote",
        "Velouté + fromage fondu"
       ],
       [
        "Jeu",
        "Porridge fin",
        "Poisson + purée de brocolis lisse",
        "Yaourt",
        "Semoule fine au bouillon + œuf"
       ],
       [
        "Ven",
        "Semoule au lait",
        "Bœuf mixé + purée + jus",
        "Crème",
        "Velouté pdt-courgette enrichi"
       ],
       [
        "Sam",
        "Compote + biscuit trempé",
        "Parmentier de poisson lisse",
        "Yaourt à boire",
        "Soupe moulinée + fromage frais"
       ],
       [
        "Dim",
        "Riz au lait lisse",
        "Volaille + purée patate douce",
        "Compote",
        "Velouté enrichi + œuf poché écrasé"
       ]
      ]
     },
     {
      "k": "options",
      "text": "Bases : purée pdt/patate douce, polenta, semoule fine, veloutés. Protéines : poisson tendre, viande <strong>mixée/hachée</strong>, œufs brouillés. Desserts : compotes lisses, crèmes, laitages lisses."
     },
     {
      "k": "recettes",
      "items": [
       "<strong>Velouté 3-2-1 enrichi</strong> : 3 louches de légumes cuits + 2 c.à.s de crème + 1 portion de fromage fondu, mixer lisse.",
       "<strong>Parmentier lisse</strong> : purée + poisson/viande mixé(e) en couches, un peu de jus."
      ]
     },
     {
      "k": "batch",
      "text": "Préparer et <strong>congeler en portions</strong> des veloutés et purées enrichis ; décongélation rapide, texture homogène garantie."
     },
     {
      "k": "collations",
      "text": "Yaourt lisse, compote, crème dessert, laitage à boire."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Viande en morceaux",
        "Viande mixée/hachée + sauce"
       ],
       [
        "Pain croûté",
        "Pain de mie trempé, sans croûte"
       ],
       [
        "Riz sec",
        "Purée, semoule fine, polenta crémeuse"
       ],
       [
        "Crudités",
        "Légumes cuits moulinés"
       ],
       [
        "Eau pure (si fausses routes)",
        "Liquide <strong>épaissi</strong>"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Sécurisés",
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
       "Peaux, pépins, graines",
       "Biscottes, aliments friables/secs"
      ]
     },
     {
      "k": "courses",
      "text": "Semoule fine, flocons pdt, polenta, patate douce ; poisson tendre, viande à hacher, œufs ; compotes/crèmes/yaourts lisses ; crème, fromage à fondre, poudre de lait ; poudre épaississante si prescrite."
     },
     {
      "k": "deplacement",
      "text": "Portions mixées maison en petits contenants ; au resto : velouté / purée / poisson tendre."
     },
     {
      "k": "pieges",
      "text": "Grosses bouchées ; parler en mangeant ; rester en mixé <strong>au-delà</strong> du nécessaire."
     },
     {
      "k": "vigilance",
      "text": "Texture à réévaluer après traitement. <strong>Urgence</strong> si : blocage complet, douleur thoracique, impossibilité d'avaler la salive."
     }
    ]
   },
   {
    "id": "eoe",
    "name": "Éviction Œsophagite à éosinophiles (6-FED / step-up)",
    "niveau": 3,
    "ecart": "réactive l'inflammation ; utile pour identifier l'aliment responsable pendant la réintroduction.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "L'œsophage réagit à certains aliments. On retire temporairement les plus souvent en cause, puis on <strong>réintroduit un par un</strong> pour trouver <strong>le vôtre</strong>. C'est un test, pas une privation à vie."
     },
     {
      "k": "principes",
      "items": [
       "Exclusion (quelques semaines).",
       "Contrôle endoscopique.",
       "Réintroductions successives → on ne garde que l'éviction responsable."
      ]
     },
     {
      "k": "demarrer",
      "text": "Avec un(e) diététicien(ne) : repérer les allergènes cachés (lait, blé, œuf, soja, fruits à coque, poisson/fruits de mer) dans l'industriel ; cuisiner maison pour maîtriser les ingrédients ; planifier le calendrier de réintroduction."
     },
     {
      "k": "portions",
      "text": "Alimentation normale en quantité — seule la <strong>liste d'aliments</strong> change en phase d'exclusion."
     },
     {
      "k": "menu",
      "note": "phase 6-FED",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Porridge à l'eau + fruits + sirop d'érable",
        "Poulet rôti, riz, légumes, huile d'olive",
        "Fruit",
        "Bœuf, pdt, courgettes"
       ],
       [
        "Mar",
        "Galettes de riz + purée de pomme",
        "Dinde, quinoa, ratatouille",
        "Compote",
        "Porc maigre, pdt, haricots verts"
       ],
       [
        "Mer",
        "Flocons de sarrasin (eau) + banane",
        "Poisson autorisé ou volaille, riz, légumes",
        "Fruit",
        "Agneau, semoule de maïs, légumes"
       ],
       [
        "Jeu",
        "Fruits + oléagineux (si non exclus)",
        "Poulet, pdt, brocolis",
        "Compote",
        "Bœuf haché, riz, ratatouille"
       ],
       [
        "Ven",
        "Porridge riz + fruits",
        "Dinde, quinoa, carottes",
        "Fruit",
        "Porc, pdt, épinards"
       ],
       [
        "Sam",
        "Purée de fruits + galette maïs",
        "Poulet, riz, courgettes",
        "Compote",
        "Bœuf, polenta, légumes"
       ],
       [
        "Dim",
        "Flocons sarrasin + fruits",
        "Rôti de porc maigre, pdt, légumes",
        "Fruit",
        "Volaille, quinoa, ratatouille"
       ]
      ],
      "text": "<em>(</em>* le poisson fait partie des groupes exclus dans le 6-FED : à retirer si c'est un des 6 groupes ciblés — adapter selon la phase.)*"
     },
     {
      "k": "options",
      "text": "Protéines : bœuf, porc, agneau, volaille. Féculents : riz, maïs, pdt, quinoa, sarrasin. Légumes/fruits libres. Matières grasses : huile d'olive."
     },
     {
      "k": "recettes",
      "items": [
       "<strong>Assiette « 6-FED »</strong> : 1 protéine (viande/volaille) + 1 féculent autorisé + légumes + huile d'olive.",
       "<strong>Porridge sans lait ni gluten</strong> : flocons de riz/sarrasin cuits à l'eau + fruits."
      ]
     },
     {
      "k": "batch",
      "text": "Cuire d'avance riz/quinoa et une <strong>ratatouille</strong> ; portionner viandes rôties ; compotes maison."
     },
     {
      "k": "collations",
      "text": "Fruits, compotes, galettes de riz/maïs, (fruits à coque <strong>seulement si non exclus</strong>)."
     },
     {
      "k": "substitutions",
      "note": "exclusion",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Lait de vache",
        "Boisson végétale <strong>hors soja</strong> (riz, coco) selon phase"
       ],
       [
        "Blé/pâtes",
        "Riz, maïs, pdt, quinoa, sarrasin"
       ],
       [
        "Œuf (liant)",
        "Compote/banane écrasée, fécule"
       ],
       [
        "Beurre",
        "Huile d'olive"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Autorisés",
      "koT": "Exclus temporairement",
      "ok": [
       "Viandes, volailles",
       "Riz, pdt, maïs, quinoa, sarrasin",
       "Fruits, légumes",
       "Huiles végétales"
      ],
      "ko": [
       "Lait &amp; produits laitiers",
       "Blé/gluten",
       "Œuf",
       "Soja, fruits à coque, poisson/fruits de mer"
      ]
     },
     {
      "k": "courses",
      "text": "Riz, quinoa, maïs, pdt, sarrasin ; bœuf, porc, agneau, volaille ; fruits, légumes variés ; huile d'olive ; produits <strong>certifiés sans les allergènes ciblés</strong>."
     },
     {
      "k": "deplacement",
      "text": "Difficile en phase stricte → privilégier maison ; au resto, grillade + féculent + légumes en vérifiant les ingrédients."
     },
     {
      "k": "pieges",
      "text": "Rester en exclusion large <strong>trop longtemps</strong> (la réintroduction est essentielle) ; oublier les allergènes cachés (sauces, plats préparés)."
     },
     {
      "k": "vigilance",
      "text": "Toujours <strong>encadré</strong> (risque de carences si éviction du lait) ; contrôles endoscopiques nécessaires."
     }
    ]
   }
  ]
 },
 {
  "cat": "Estomac",
  "icon": "🍽",
  "items": [
   {
    "id": "dyspepsie",
    "name": "Dyspepsie fonctionnelle",
    "niveau": 3,
    "ecart": "inconfort passager ; on ajuste selon la tolérance.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Estomac hypersensible qui se remplit/vide de façon inconfortable (lourdeurs, satiété rapide, douleurs). Alléger et fractionner diminue ces sensations."
     },
     {
      "k": "principes",
      "items": [
       "Petits repas fréquents (4–6/j).",
       "Pauvre en graisses (elles ralentissent la vidange).",
       "Manger lentement ; limiter café/alcool/sodas."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Diviser 3 repas en <strong>5 prises</strong> plus petites.",
       "Alléger les matières grasses (vapeur/four).",
       "Ralentir (poser les couverts entre les bouchées)."
      ]
     },
     {
      "k": "portions",
      "text": "Assiette modérée + collations ; ne pas « faire le plein » ; protéine maigre à chaque repas principal."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Collation matin",
       "Déjeuner",
       "Collation",
       "Dîner léger"
      ],
      "rows": [
       [
        "Lun",
        "Pain + miel + thé",
        "Yaourt",
        "Poisson, riz, légumes cuits",
        "Compote",
        "Soupe + jambon blanc"
       ],
       [
        "Mar",
        "Biscottes + fromage blanc",
        "Banane",
        "Dinde, pdt vapeur, carottes",
        "Yaourt",
        "Velouté + œuf poché"
       ],
       [
        "Mer",
        "Flocons + lait ½",
        "Compote",
        "Œufs, semoule, courgettes",
        "Fruit doux",
        "Bouillon + pâtes fines + fromage"
       ],
       [
        "Jeu",
        "Pain + fromage frais",
        "Yaourt",
        "Poulet, riz, épinards",
        "Banane",
        "Soupe + tartine + œuf"
       ],
       [
        "Ven",
        "Porridge léger",
        "Compote",
        "Merlu, pdt, haricots verts",
        "Yaourt",
        "Velouté + jambon"
       ],
       [
        "Sam",
        "Fromage blanc + biscuit",
        "Fruit doux",
        "Veau maigre, riz, carottes",
        "Compote",
        "Soupe + omelette fine"
       ],
       [
        "Dim",
        "Pain + miel",
        "Yaourt",
        "Volaille, semoule, courgettes",
        "Banane",
        "Bouillon + riz + fromage"
       ]
      ]
     },
     {
      "k": "options",
      "text": "Protéines maigres au choix ; féculents variés ; légumes <strong>cuits</strong> ; desserts : compotes/laitages."
     },
     {
      "k": "recettes",
      "text": "<strong>Assiette légère</strong> : ¼ protéine maigre + ¼ féculent + ½ légumes cuits, cuisson sans matière grasse ajoutée. <strong>Bouillon repas</strong> : bouillon + pâtes fines + œuf + fromage."
     },
     {
      "k": "batch",
      "text": "Soupes/veloutés en portions ; riz/semoule d'avance ; volaille cuite portionnée."
     },
     {
      "k": "collations",
      "text": "Yaourt, banane, compote, biscottes."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Fritures/sauces",
        "Vapeur, four, grill"
       ],
       [
        "3 gros repas",
        "5–6 petits repas"
       ],
       [
        "Café serré",
        "Café léger, tisane"
       ],
       [
        "Plat épicé",
        "Assaisonnement doux (herbes)"
       ]
      ]
     },
     {
      "k": "tab",
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
     {
      "k": "courses",
      "text": "Poisson blanc, dinde, volaille, veau maigre, œufs ; riz, pdt, semoule, biscottes, pâtes fines ; carotte, courgette, épinard, haricot vert ; yaourt, fromage blanc/frais ; compotes."
     },
     {
      "k": "deplacement",
      "text": "Portions raisonnables, éviter fritures/gros plats ; fractionner avec une collation."
     },
     {
      "k": "pieges",
      "text": "Manger vite ; sauter un repas puis se rattraper par un gros repas."
     },
     {
      "k": "vigilance",
      "text": "Rien d'interdit, on ajuste. <strong>Consultez</strong> si amaigrissement, vomissements, sang."
     }
    ]
   },
   {
    "id": "gastroparesie",
    "name": "Gastroparésie",
    "niveau": 3,
    "ecart": "nausées/lourdeurs passagères ; on cale sur votre tolérance.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "L'estomac se vide trop lentement : stagnation (nausées, ballonnements, satiété précoce). On choisit des aliments faciles et rapides à évacuer."
     },
     {
      "k": "principes",
      "items": [
       "Petit, fréquent, pauvre en graisses.",
       "Pauvre en fibres insolubles (peaux, crudités).",
       "Petites particules / textures molles ; <strong>boire les calories</strong> si les solides passent mal."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Passer à <strong>5–6 mini-repas</strong>.",
       "Privilégier purées/veloutés/smoothies.",
       "Rester assis/droit après manger ; si diabète, surveiller la <strong>glycémie</strong>."
      ]
     },
     {
      "k": "portions",
      "text": "Petits volumes ++ ; privilégier liquides/mixés nutritifs ; éviter un gros volume d'un coup."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Collation",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Smoothie banane + yaourt",
        "Compote",
        "Purée + poisson mixé",
        "Crème dessert",
        "Velouté lisse + fromage frais"
       ],
       [
        "Mar",
        "Bouillie fine + compote",
        "Yaourt à boire",
        "Polenta crémeuse + volaille hachée",
        "Jus dilué",
        "Soupe moulinée + œuf"
       ],
       [
        "Mer",
        "Yaourt + banane mûre écrasée",
        "Compote",
        "Purée patate douce + poisson",
        "Smoothie",
        "Velouté carotte lisse + fromage"
       ],
       [
        "Jeu",
        "Smoothie fruits mûrs",
        "Crème",
        "Semoule fine + bœuf mixé",
        "Yaourt",
        "Bouillon + purée + œuf"
       ],
       [
        "Ven",
        "Porridge très fin",
        "Compote",
        "Purée + volaille mixée",
        "Jus dilué",
        "Velouté courgette + fromage frais"
       ],
       [
        "Sam",
        "Smoothie + biscuit trempé",
        "Yaourt à boire",
        "Polenta + poisson mixé",
        "Compote",
        "Soupe moulinée enrichie"
       ],
       [
        "Dim",
        "Yaourt + compote",
        "Crème",
        "Purée + bœuf haché fin",
        "Smoothie",
        "Velouté patate douce + œuf"
       ]
      ]
     },
     {
      "k": "options",
      "text": "Smoothies (fruits mûrs + yaourt), soupes/veloutés enrichis, laitages à boire, compotes. Éviter gros volumes."
     },
     {
      "k": "recettes",
      "text": "<strong>Smoothie repas</strong> : banane mûre + yaourt + un peu de miel + flocons fins mixés. <strong>Velouté nutritif</strong> : légume cuit mixé + fromage frais + un peu d'huile."
     },
     {
      "k": "batch",
      "text": "Veloutés/purées enrichis congelés en portions ; bases de smoothie (fruits mûrs congelés)."
     },
     {
      "k": "collations",
      "text": "Compote, yaourt à boire, smoothie, crème dessert."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Steak/viande fibreuse",
        "Viande mixée/hachée, poisson tendre"
       ],
       [
        "Crudités",
        "Légumes cuits mixés"
       ],
       [
        "Pain complet",
        "Pain blanc / purée / semoule"
       ],
       [
        "Fruits à peau",
        "Compotes, banane mûre, fruits mixés"
       ],
       [
        "Repas gras",
        "Version allégée + fractionnée"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Conseillés",
      "koT": "À éviter",
      "ok": [
       "Purées, veloutés, compotes",
       "Poisson/volaille tendres, mixés",
       "Laitages, œufs",
       "Jus, smoothies, soupes",
       "Féculents bien cuits"
      ],
      "ko": [
       "Fritures, plats gras",
       "Viandes fibreuses en morceaux",
       "Crudités, légumes à peau/graines",
       "Légumineuses entières, chou, maïs",
       "Fruits à peau, agrumes fibreux"
      ]
     },
     {
      "k": "courses",
      "text": "Flocons fins, semoule, polenta, pdt, patate douce ; poisson tendre, volaille/bœuf à hacher, œufs ; courgette, carotte (à mixer) ; banane mûre, compotes ; yaourts, laits à boire, fromage frais."
     },
     {
      "k": "deplacement",
      "text": "Emporter smoothies/compotes ; au resto : veloutés, purées, poisson tendre ; éviter le gras."
     },
     {
      "k": "pieges",
      "text": "Gros repas d'un coup ; excès de fibres « santé » (contre-productif ici) ; s'allonger après manger."
     },
     {
      "k": "vigilance",
      "text": "Se cale sur votre tolérance. Risque de <strong>dénutrition</strong> → accompagnement diététique. <strong>Consultez</strong> si vomissements persistants, amaigrissement, déshydratation."
     }
    ]
   },
   {
    "id": "dumping",
    "name": "Anti-dumping (post-gastrectomie / bariatrique)",
    "niveau": 3,
    "ecart": "malaise/diarrhée après un repas sucré ou bu trop vite ; réversible, informatif.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Après chirurgie de l'estomac, les aliments — surtout les sucres rapides — arrivent trop vite dans l'intestin (malaise, palpitations, sueurs, diarrhée : « syndrome de chasse »). On ralentit ce passage."
     },
     {
      "k": "principes",
      "items": [
       "Séparer solides et boissons (boire ~30 min <strong>après</strong>).",
       "Petits repas fréquents, manger lentement.",
       "Limiter les sucres rapides ; privilégier protéines + fibres."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Ne plus boire <strong>pendant</strong> les repas.",
       "Supprimer sodas/jus/sucreries.",
       "Une <strong>protéine</strong> à chaque prise ; s'allonger 15–20 min après si malaises."
      ]
     },
     {
      "k": "portions",
      "text": "Petites assiettes fréquentes ; boissons <strong>entre</strong> les repas par petites gorgées ; protéine à chaque prise."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj (boire à distance)",
       "Collation",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Œuf + pain complet",
        "Fromage + amandes",
        "Viande + légumes + féculent complet",
        "Yaourt nature",
        "Poisson + quinoa + légumes"
       ],
       [
        "Mar",
        "Fromage blanc + flocons + noix",
        "Blanc de dinde",
        "Lentilles + légumes + riz",
        "Yaourt",
        "Omelette + légumes"
       ],
       [
        "Mer",
        "Œufs brouillés + pain complet",
        "Fromage",
        "Poulet + boulgour + légumes",
        "Skyr",
        "Poisson + pdt + haricots verts"
       ],
       [
        "Jeu",
        "Fromage blanc + oléagineux",
        "Œuf dur",
        "Bœuf maigre + quinoa + légumes",
        "Yaourt",
        "Tofu/volaille + légumes + riz complet"
       ],
       [
        "Ven",
        "Pain complet + jambon",
        "Fromage",
        "Pois chiches + légumes + riz",
        "Skyr",
        "Poisson + patate douce + légumes"
       ],
       [
        "Sam",
        "Œuf + avoine",
        "Amandes",
        "Volaille + boulgour + légumes",
        "Yaourt",
        "Omelette + légumes + pain complet"
       ],
       [
        "Dim",
        "Fromage blanc + flocons",
        "Œuf dur",
        "Rôti maigre + quinoa + légumes",
        "Yaourt",
        "Poisson + légumes + riz complet"
       ]
      ]
     },
     {
      "k": "options",
      "text": "Protéines : œuf, volaille, poisson, légumineuses, fromage. Féculents <strong>complets</strong> : riz/pain complets, quinoa, boulgour, patate douce. Laitages <strong>nature</strong>."
     },
     {
      "k": "recettes",
      "text": "<strong>Assiette anti-dumping</strong> : protéine + féculent complet + légumes ; <strong>boire à distance</strong>. <strong>Collation protéinée</strong> : fromage + oléagineux."
     },
     {
      "k": "batch",
      "text": "Quinoa/boulgour d'avance ; légumineuses cuites ; volaille portionnée ; œufs durs."
     },
     {
      "k": "collations",
      "text": "Fromage + oléagineux, yaourt/skyr nature, œuf dur, blanc de dinde."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Soda/jus",
        "Eau <strong>entre</strong> les repas"
       ],
       [
        "Dessert sucré",
        "Fruit entier + laitage nature"
       ],
       [
        "Pain blanc seul",
        "Pain complet + protéine"
       ],
       [
        "Grand verre en mangeant",
        "Boire à distance du repas"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Conseillés",
      "koT": "À éviter",
      "ok": [
       "Protéines (viande, poisson, œuf, légumineuses)",
       "Féculents complets, légumes",
       "Boissons <strong>entre</strong> les repas",
       "Laitages nature"
      ],
      "ko": [
       "Sodas, jus, sirops",
       "Bonbons, pâtisseries, glaces",
       "Boire en mangeant",
       "Grands volumes de liquide sucré"
      ]
     },
     {
      "k": "courses",
      "text": "Œufs, volaille, poisson, fromage ; pain/riz complets, quinoa, boulgour, patate douce, légumineuses ; légumes ; yaourts/skyr nature ; oléagineux."
     },
     {
      "k": "deplacement",
      "text": "Éviter menus sucrés/sodas ; boire à distance ; collation protéinée dans le sac."
     },
     {
      "k": "pieges",
      "text": "Boire en mangeant ; desserts sucrés ; sauter un repas puis se resucrer."
     },
     {
      "k": "vigilance",
      "text": "Réglages <strong>individuels</strong>. Surveiller <strong>poids</strong> et carences (<strong>fer, B12</strong>) selon la chirurgie. Consultez si malaises fréquents, amaigrissement."
     }
    ]
   }
  ]
 },
 {
  "cat": "Intolérances & malabsorptions",
  "icon": "🥛",
  "items": [
   {
    "id": "gluten",
    "name": "Sans gluten (maladie cœliaque)",
    "niveau": 1,
    "ecart": "chaque contamination, même une miette, entretient la maladie. Pas de seuil toléré. À vie.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le gluten abîme l'intestin grêle et empêche l'absorption des nutriments. L'éviction <strong>totale et à vie</strong> est le <strong>seul traitement</strong> : l'intestin cicatrise, le risque de complications diminue."
     },
     {
      "k": "principes",
      "items": [
       "Zéro gluten (blé, orge, seigle et dérivés), définitivement.",
       "Traquer les <strong>traces/contaminations</strong>.",
       "Lire <strong>toutes</strong> les étiquettes (logo épi barré)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "<strong>Sécuriser la cuisine</strong> : grille-pain <strong>dédié</strong>, planche/ustensiles propres, beurre/pots <strong>sans miettes</strong>, éponge propre ; zone sans-gluten séparée.",
       "<strong>Refaire les placards</strong> : remplacer farine/pâtes/pain/biscuits par des versions <strong>certifiées</strong> ; identifier les naturellement SG (riz, pdt, maïs, légumineuses, quinoa, sarrasin).",
       "<strong>Apprendre à lire</strong> : « épi barré » ; fuir « peut contenir des traces de gluten » ; méfiance sauces/plats préparés/charcuteries/bière."
      ]
     },
     {
      "k": "portions",
      "text": "Alimentation normale et variée — seule la <strong>source de féculents/farine</strong> change. Compenser les fibres avec légumineuses, riz complet SG, fruits/légumes."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain SG + confiture + œuf",
        "Steak, riz, légumes, huile d'olive",
        "Yaourt + fruit",
        "Omelette, pdt, salade"
       ],
       [
        "Mar",
        "Flocons de sarrasin + lait + banane",
        "Poisson, quinoa, ratatouille",
        "Fromage + galette de riz",
        "Dahl de lentilles + riz"
       ],
       [
        "Mer",
        "Pain SG + fromage frais",
        "Poulet, pdt, haricots verts",
        "Fruit + oléagineux",
        "Poêlée légumes + œufs + polenta"
       ],
       [
        "Jeu",
        "Porridge riz + fruits rouges",
        "Bœuf, riz complet SG, courgettes",
        "Yaourt",
        "Poisson, purée, épinards"
       ],
       [
        "Ven",
        "Galettes de maïs + purée d'amande",
        "Salade de quinoa + thon + légumes",
        "Fromage blanc",
        "Risotto (riz) + légumes"
       ],
       [
        "Sam",
        "Pancakes farine de riz + fruits",
        "Volaille rôtie, pdt, légumes",
        "Fruit",
        "Chili (viande + haricots) + riz"
       ],
       [
        "Dim",
        "Pain SG + œufs brouillés",
        "Rôti, polenta, légumes",
        "Yaourt",
        "Soupe + galettes SG + fromage"
       ]
      ]
     },
     {
      "k": "options",
      "text": "Épaissir/paner avec <strong>fécule de maïs, farine de riz/sarrasin/châtaigne</strong> ; pâtes de maïs/riz ; <strong>avoine seulement si certifiée</strong>."
     },
     {
      "k": "recettes",
      "items": [
       "<strong>Pancakes SG</strong> : farine de riz + œuf + lait + levure ; poêle.",
       "<strong>Panure SG</strong> : œuf + <strong>poudre d'amande ou flocons de maïs écrasés</strong>.",
       "<strong>Bowl protéiné</strong> : quinoa + légumineuses + légumes + huile d'olive."
      ]
     },
     {
      "k": "batch",
      "text": "Cuire riz/quinoa/légumineuses d'avance ; congeler du pain SG (tranché) ; préparer une base de chili/dahl."
     },
     {
      "k": "collations",
      "text": "Fruits, yaourt nature, oléagineux, galettes de riz/maïs, fromage."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Pain/pâtes de blé",
        "Versions <strong>certifiées SG</strong> ; riz, pdt, quinoa, sarrasin"
       ],
       [
        "Farine de blé",
        "Farine de riz, maïs, sarrasin, châtaigne ; fécules"
       ],
       [
        "Chapelure/panure",
        "Poudre d'amande, flocons de maïs, polenta"
       ],
       [
        "Sauce soja",
        "<strong>Tamari sans gluten</strong>"
       ],
       [
        "Bière",
        "Cidre, vin, bière <strong>sans gluten</strong>"
       ],
       [
        "Bouillon cube",
        "Bouillon certifié SG / maison"
       ]
      ]
     },
     {
      "k": "tab",
      "note": "élargi",
      "okT": "Naturellement/certifié SG",
      "koT": "Interdits (gluten)",
      "ok": [
       "Riz, maïs, pdt, quinoa, sarrasin, millet",
       "Viandes, poissons, œufs <strong>non panés</strong>",
       "Légumes, fruits, légumineuses",
       "Produits laitiers nature",
       "Produits « épi barré »"
      ],
      "ko": [
       "Blé, orge, seigle, épeautre, kamut",
       "Pain, pâtes, semoule, couscous, biscuits",
       "Panure, chapelure, pâtisseries",
       "Bière, sauce soja classique",
       "Plats/sauces sans mention SG, « traces »"
      ]
     },
     {
      "k": "courses",
      "text": "Riz, quinoa, sarrasin, maïs, pdt ; pâtes/pain/farine <strong>certifiés SG</strong> ; viandes/poissons/œufs ; légumes, fruits, légumineuses ; laitages nature ; tamari SG."
     },
     {
      "k": "deplacement",
      "text": "<strong>Prévenir au restaurant</strong> (contamination !) ; plats non panés/non farinés ; applis restos SG ; collation SG dans le sac ; à l'étranger, <strong>carte de traduction « maladie cœliaque »</strong>."
     },
     {
      "k": "pieges",
      "text": "Contamination <strong>grille-pain/friteuse/ustensiles partagés</strong> ; farine « en suspension » ; sauces/bouillons/médicaments ; « juste une miette » (<strong>non</strong>)."
     },
     {
      "k": "erreur",
      "text": "Ne <strong>jamais</strong> débuter le sans-gluten <strong>avant</strong> le diagnostic (fausse les tests). Le sans-gluten « bien-être » sans cœliaque est inutile."
     },
     {
      "k": "vigilance",
      "text": "Suivi diététique + carences (fer, B9, B12, calcium, vitamine D) ; vérifier l'absence de gluten des médicaments si besoin."
     }
    ]
   },
   {
    "id": "lactose",
    "name": "Pauvre en lactose",
    "niveau": 3,
    "ecart": "ballonnements/gaz transitoires ; on cherche votre seuil (souvent une petite quantité passe).",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le lactose est mal digéré par manque d'enzyme : ballonnements, gaz, diarrhée. <strong>Pas une allergie</strong> : la plupart tolèrent une petite quantité. But : trouver <strong>votre</strong> seuil."
     },
     {
      "k": "principes",
      "items": [
       "Réduire, pas éliminer.",
       "Mieux toléré en petite quantité et <strong>pendant un repas</strong>.",
       "Fromages affinés et yaourts passent souvent bien ; garder assez de <strong>calcium</strong>."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Repérer les grosses sources (grand bol de lait à jeun).",
       "Remplacer par <strong>sans lactose</strong> ou <strong>végétal enrichi calcium</strong>.",
       "Tester sa tolérance (yaourt, fromage affiné souvent OK)."
      ]
     },
     {
      "k": "portions",
      "text": "Fractionner les laitages ; privilégier fromages affinés (quasi sans lactose) ; viser ~3 produits calciques/j (sans/pauvre en lactose)."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Lait <strong>sans lactose</strong> + tartines",
        "Viande + légumes + <strong>comté</strong>",
        "Yaourt",
        "Poisson + riz + amandes"
       ],
       [
        "Mar",
        "Boisson végétale enrichie + flocons",
        "Omelette + légumes + parmesan",
        "Fromage blanc SL",
        "Poulet + pdt + salade"
       ],
       [
        "Mer",
        "Yaourt SL + pain",
        "Poisson + quinoa + légumes",
        "Fruit + comté",
        "Bœuf + riz + haricots verts"
       ],
       [
        "Jeu",
        "Lait SL + porridge",
        "Dinde + boulgour + légumes",
        "Yaourt SL",
        "Œufs + pdt + épinards"
       ],
       [
        "Ven",
        "Végétal enrichi + tartines",
        "Salade + thon + emmental",
        "Fromage affiné",
        "Poisson + semoule + légumes"
       ],
       [
        "Sam",
        "Yaourt SL + fruits",
        "Volaille + riz + légumes",
        "Amandes",
        "Omelette + pdt + salade"
       ],
       [
        "Dim",
        "Lait SL + pain",
        "Rôti + légumes + parmesan",
        "Yaourt SL",
        "Soupe + tartine + fromage affiné"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "<strong>Béchamel SL</strong> (lait sans lactose + farine + beurre) ; <strong>gratin</strong> au comté (affiné, bien toléré)."
     },
     {
      "k": "batch",
      "text": "Portionner fromages affinés ; laitages SL en stock."
     },
     {
      "k": "collations",
      "text": "Yaourt/fromage blanc <strong>sans lactose</strong>, fromage <strong>affiné</strong>, amandes, fruit."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Lait ordinaire",
        "Lait <strong>sans lactose</strong> ou végétal enrichi calcium"
       ],
       [
        "Crème fraîche",
        "Crème sans lactose / végétale"
       ],
       [
        "Fromage frais",
        "Fromage <strong>affiné</strong> (comté, emmental)"
       ],
       [
        "Béchamel au lait",
        "Version lait SL/végétal"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Bien tolérés",
      "koT": "Riches en lactose (tester/limiter)",
      "ok": [
       "Fromages affinés (comté, parmesan)",
       "Yaourts, laits fermentés",
       "Laits SL / végétaux enrichis",
       "Beurre (peu)"
      ],
      "ko": [
       "Lait (à jeun, en grande quantité)",
       "Crème dessert, béchamel",
       "Fromage frais, crème fraîche",
       "Glaces, lait concentré"
      ]
     },
     {
      "k": "courses",
      "text": "Lait/yaourts <strong>sans lactose</strong>, boisson végétale enrichie ; fromages affinés ; sources de <strong>calcium</strong> (sardines, amandes, eaux calciques, légumes verts)."
     },
     {
      "k": "deplacement",
      "text": "Demander « sans lait/crème » ; un fromage affiné passe souvent ; garder une petite quantité au repas."
     },
     {
      "k": "pieges",
      "text": "Éliminer <strong>tout</strong> le calcium sans compenser ; croire à une allergie (c'est <strong>dose-dépendant</strong>)."
     },
     {
      "k": "vigilance",
      "text": "Assurer <strong>calcium/vitamine D</strong> ; un test exclusion/réintroduction confirme le seuil."
     }
    ]
   },
   {
    "id": "fructose",
    "name": "Pauvre en fructose / sorbitol",
    "niveau": 3,
    "ecart": "gaz/douleurs transitoires ; seuil individuel à trouver.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Fructose (sucre des fruits) et sorbitol (édulcorant) parfois mal absorbés → fermentation, gaz, douleurs, diarrhée. On réduit selon <strong>votre</strong> tolérance."
     },
     {
      "k": "principes",
      "items": [
       "Limiter les aliments <strong>très riches en fructose libre</strong> et en <strong>sorbitol</strong>.",
       "Petites portions de fruits, réparties.",
       "Le fructose passe mieux <strong>avec du glucose</strong> (fruits « équilibrés »)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Couper sodas/jus/miel/sirops et bonbons « sans sucre » (sorbitol).",
       "Petites portions de fruits <strong>bien tolérés</strong>.",
       "Réintroduction progressive."
      ]
     },
     {
      "k": "portions",
      "text": "1 petite portion de fruit à la fois, de préférence en fin de repas ; éviter jus (concentrés)."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain + beurre + kiwi",
        "Viande + riz + carottes",
        "Quelques fraises",
        "Poisson + pdt + courgettes"
       ],
       [
        "Mar",
        "Flocons + lait + banane (petite)",
        "Œufs + quinoa + haricots verts",
        "Orange",
        "Dinde + polenta + épinards"
       ],
       [
        "Mer",
        "Pain + fromage + kiwi",
        "Poulet + riz + légumes",
        "Fraises",
        "Poisson + semoule + carottes"
       ],
       [
        "Jeu",
        "Porridge + banane",
        "Bœuf + pdt + haricots verts",
        "Mandarine",
        "Œufs + polenta + courgettes"
       ],
       [
        "Ven",
        "Pain + beurre + orange",
        "Volaille + quinoa + légumes",
        "Kiwi",
        "Poisson + riz + épinards"
       ],
       [
        "Sam",
        "Flocons + lait",
        "Salade + thon + pdt",
        "Fraises",
        "Dinde + semoule + carottes"
       ],
       [
        "Dim",
        "Pain + fromage",
        "Rôti + riz + légumes",
        "Banane (petite)",
        "Soupe + œufs + polenta"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "<strong>Compote « équilibrée »</strong> en petite portion ; <strong>salade tiède</strong> riz + protéine + légumes."
     },
     {
      "k": "batch",
      "text": "Riz/quinoa/polenta d'avance ; légumes cuits."
     },
     {
      "k": "collations",
      "text": "Kiwi, agrumes, fraises, petite banane ; fromage ; oléagineux."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Miel/sirop d'agave",
        "Sucre de table (modéré), sirop d'érable en petite quantité"
       ],
       [
        "Jus de fruits",
        "Fruit entier (petite portion)"
       ],
       [
        "Pomme/poire",
        "Kiwi, agrumes, fraise, banane (petites quantités)"
       ],
       [
        "Bonbons « sans sucre »",
        "Éviter (sorbitol)"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Mieux tolérés",
      "koT": "À limiter",
      "ok": [
       "Banane, agrumes, fraise, kiwi (petites quantités)",
       "Légumes, féculents",
       "Sucre de table modéré"
      ],
      "ko": [
       "Pomme, poire, mangue, cerise, pastèque",
       "Miel, sirops (agave, glucose-fructose)",
       "Chewing-gums/bonbons « sans sucre » (sorbitol)",
       "Jus de fruits, fruits secs"
      ]
     },
     {
      "k": "courses",
      "text": "Kiwi, agrumes, fraises, banane ; légumes, riz, quinoa, polenta, pdt ; protéines variées."
     },
     {
      "k": "deplacement",
      "text": "Éviter jus/sodas ; dessert = laitage ou petite portion de fruit toléré."
     },
     {
      "k": "pieges",
      "text": "Sur-restreindre les fruits (fibres/vitamines) ; sorbitol caché (chewing-gums, médicaments)."
     },
     {
      "k": "vigilance",
      "text": "Seuil <strong>individuel</strong> ; réintroduire progressivement."
     }
    ]
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
    "ecart": "symptômes transitoires informatifs. NE PAS rester en exclusion à vie (appauvrissant). Réintroduction obligatoire.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Les FODMAP (sucres fermentescibles) provoquent gaz, ballonnements, douleurs, troubles du transit chez les personnes au côlon irritable. Les réduire <strong>temporairement</strong> soulage, puis on <strong>réintroduit</strong> pour manger le plus large possible."
     },
     {
      "k": "principes",
      "items": [
       "<strong>Exclusion</strong> (2–6 sem) → juger l'amélioration.",
       "<strong>Réintroduction</strong> groupe par groupe → repérer <strong>vos</strong> déclencheurs et <strong>doses</strong>.",
       "<strong>Personnalisation</strong> → ne garder que les évictions utiles."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Idéalement avec un(e) diététicien(ne) + une <strong>appli FODMAP</strong> fiable.",
       "Vider le <strong>piège n°1</strong> : oignon &amp; ail → <strong>huile infusée à l'ail</strong>, vert de poireau, ciboulette.",
       "Composer chaque assiette avec la colonne verte ; <strong>planifier la réintroduction</strong> (ne pas rester bloqué en phase 1)."
      ]
     },
     {
      "k": "portions",
      "text": "La <strong>dose</strong> compte : une petite portion d'un aliment « rouge » (ex. lentilles rincées) est souvent tolérée. Assiette : ½ légumes verts autorisés + ¼ féculent pauvre en FODMAP + ¼ protéine."
     },
     {
      "k": "menu",
      "note": "phase exclusion",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain au levain/SG + œuf + kiwi",
        "Poulet + riz + carottes/épinards + huile à l'ail",
        "Myrtilles + noix",
        "Poisson + pdt + courgettes"
       ],
       [
        "Mar",
        "Flocons d'avoine + lait SL + fraises",
        "Bœuf + quinoa + haricots verts",
        "Yaourt SL + banane peu mûre",
        "Omelette + polenta + épinards"
       ],
       [
        "Mer",
        "Pain levain + fromage affiné",
        "Salade riz + thon + poivron + concombre",
        "Orange + noix",
        "Dinde + pdt + courgettes"
       ],
       [
        "Jeu",
        "Porridge (lait SL) + myrtilles",
        "Poulet + polenta + carottes",
        "Fromage + galette de riz",
        "Poisson + riz + haricots verts"
       ],
       [
        "Ven",
        "Œufs brouillés + pain levain",
        "Quinoa + tofu ferme + légumes verts",
        "Kiwi + noix",
        "Bœuf + pdt + épinards"
       ],
       [
        "Sam",
        "Flocons + fraises",
        "Poulet rôti + riz + courgettes",
        "Yaourt SL",
        "Omelette + polenta + poivron"
       ],
       [
        "Dim",
        "Pain levain + fromage",
        "Rôti + pdt + carottes",
        "Myrtilles",
        "Poisson + riz + haricots verts"
       ]
      ]
     },
     {
      "k": "options",
      "text": "Féculents : riz, quinoa, avoine, pdt, polenta. Légumes : carotte, courgette, épinard, haricot vert, poivron, aubergine, concombre. Fruits : kiwi, orange, fraise, myrtille, raisin, banane peu mûre. Protéines : viande, poisson, œuf, tofu ferme."
     },
     {
      "k": "recettes",
      "note": "le vrai gain",
      "items": [
       "<strong>Huile à l'ail maison</strong> : faire chauffer doucement de l'huile d'olive avec des gousses écrasées, <strong>retirer l'ail</strong> (l'arôme passe, pas les FODMAP).",
       "<strong>Bowl FODMAP-safe</strong> : riz + poulet + carottes/épinards + huile à l'ail + graines.",
       "<strong>Poêlée express</strong> : courgette + poivron + protéine, huile à l'ail."
      ]
     },
     {
      "k": "batch",
      "text": "Riz/quinoa/polenta d'avance ; poulet rôti portionné ; légumes verts cuits ; bocaux d'huile à l'ail."
     },
     {
      "k": "collations",
      "text": "Kiwi, orange, fraise, myrtille ; fromage affiné ; petite poignée de noix ; yaourt sans lactose ; banane peu mûre."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Oignon / ail",
        "<strong>Huile à l'ail</strong>, vert de poireau, ciboulette, asafoetida"
       ],
       [
        "Blé (pain/pâtes)",
        "Pain au <strong>levain</strong>/SG, pâtes de riz/maïs"
       ],
       [
        "Lait/yaourt",
        "Sans lactose / végétal adapté"
       ],
       [
        "Pomme/poire",
        "Kiwi, orange, fraise, myrtille, banane peu mûre"
       ],
       [
        "Légumineuses (grande portion)",
        "<strong>Petite portion</strong> de lentilles en conserve <strong>rincées</strong>"
       ],
       [
        "Miel",
        "Sirop d'érable"
       ],
       [
        "Chou-fleur/champignon",
        "Carotte, courgette, épinard, haricot vert, poivron"
       ]
      ]
     },
     {
      "k": "tab",
      "note": "élargi",
      "okT": "Pauvres en FODMAP",
      "koT": "Riches en FODMAP (phase 1)",
      "ok": [
       "Riz, quinoa, avoine, pdt, polenta",
       "Carotte, courgette, épinard, haricot vert, poivron, aubergine",
       "Kiwi, orange, fraise, myrtille, raisin, banane peu mûre",
       "Viande, poisson, œuf, tofu ferme",
       "Fromages affinés, sans lactose"
      ],
      "ko": [
       "Blé en grande quantité, seigle",
       "Oignon, ail, chou-fleur, champignon, choux",
       "Pomme, poire, mangue, pastèque, cerise, fruits secs",
       "Légumineuses en grande portion",
       "Lait, yaourt ordinaire, miel, édulcorants « -ol »"
      ]
     },
     {
      "k": "courses",
      "text": "Riz, quinoa, avoine, pdt, polenta ; pain au levain/SG ; carotte, courgette, épinard, haricot vert, poivron ; kiwi, orange, fraise, myrtille ; protéines variées ; lait/yaourt sans lactose ; huile d'olive + <strong>huile à l'ail</strong>."
     },
     {
      "k": "deplacement",
      "text": "Grillé + riz/pdt + légumes verts ; « sans oignon/ail » ; éviter sauces ; collations sûres dans le sac."
     },
     {
      "k": "pieges",
      "text": "Rester <strong>trop longtemps</strong> en exclusion ; croire « bio/SG = pauvre FODMAP » ; ignorer la <strong>dose</strong> ; sauter la <strong>réintroduction</strong>."
     },
     {
      "k": "erreur",
      "text": "Ce <strong>n'est pas</strong> un régime à vie ; l'exclusion prolongée appauvrit alimentation et microbiote. <strong>Réintroduction obligatoire.</strong>"
     },
     {
      "k": "vigilance",
      "text": "Idéalement avec diététicien(ne) ; si peu d'effet après une exclusion bien menée, réévaluer."
     }
    ]
   },
   {
    "id": "fibres",
    "name": "Riche en fibres + hydratation (constipation, hémorroïdes)",
    "niveau": 4,
    "ecart": "simple ralentissement passager ; orientation de fond, pas d'interdit.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Fibres + eau augmentent le volume des selles et les ramollissent : transit plus rapide, exonération plus facile ; soulage la maladie hémorroïdaire."
     },
     {
      "k": "principes",
      "items": [
       "Augmenter les fibres <strong>progressivement</strong>.",
       "Boire <strong>≥ 1,5 L/j</strong>.",
       "Bouger + horaires réguliers."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "+1 portion de fibres/j chaque semaine.",
       "Un grand verre d'eau à chaque repas + au réveil.",
       "Marche quotidienne ; toilettes après le petit-déjeuner."
      ]
     },
     {
      "k": "portions",
      "text": "Viser ~25–30 g de fibres/j <strong>atteints graduellement</strong> ; ½ assiette de légumes ; 2 fruits/j ; légumineuses 2–3×/sem."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Avoine + <strong>pruneaux</strong> + kiwi",
        "Lentilles + légumes + pain complet",
        "Fruit + eau",
        "Soupe + poisson + riz complet"
       ],
       [
        "Mar",
        "Muesli + yaourt + fruits rouges",
        "Pois chiches + légumes rôtis + boulgour",
        "Poire + noix",
        "Velouté + omelette + pain complet"
       ],
       [
        "Mer",
        "Pain complet + purée d'amande + kiwi",
        "Poulet + riz complet + légumes",
        "Pruneaux",
        "Soupe + œufs + pain complet"
       ],
       [
        "Jeu",
        "Flocons + fruits + graines",
        "Haricots rouges + légumes + quinoa",
        "Fruit",
        "Poisson + patate douce + épinards"
       ],
       [
        "Ven",
        "Muesli + kiwi",
        "Salade + thon + légumineuses + pain complet",
        "Poire",
        "Velouté + volaille + riz complet"
       ],
       [
        "Sam",
        "Avoine + pruneaux",
        "Curry de pois chiches + riz complet",
        "Noix + fruit",
        "Soupe + poisson + boulgour"
       ],
       [
        "Dim",
        "Pain complet + fruits",
        "Rôti + légumes + lentilles",
        "Kiwi",
        "Velouté + œufs + pain complet"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "<strong>Overnight oats</strong> (avoine + lait + graines de chia + fruits) ; <strong>verre de psyllium</strong> matin/soir dans un grand verre d'eau."
     },
     {
      "k": "batch",
      "text": "Légumineuses cuites en portions ; soupes ; céréales complètes d'avance."
     },
     {
      "k": "collations",
      "text": "Pruneaux, kiwi, poire, oléagineux, yaourt + fruits rouges."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Pain blanc",
        "Pain complet / au son"
       ],
       [
        "Riz/pâtes blancs",
        "Versions complètes, boulgour, quinoa"
       ],
       [
        "Compote lisse",
        "Fruit entier (peau lavée)"
       ],
       [
        "Grignotage sucré",
        "Fruits, pruneaux, oléagineux"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "À privilégier",
      "koT": "À limiter",
      "ok": [
       "Fruits/légumes (peau lavée), pruneaux, kiwi",
       "Céréales complètes, avoine, son",
       "Légumineuses, psyllium, graines",
       "Eau (+++)"
      ],
      "ko": [
       "Excès de pain/riz blancs seuls",
       "Plats gras/industriels pauvres en fibres",
       "Manque de boisson",
       "Sédentarité"
      ]
     },
     {
      "k": "courses",
      "text": "Avoine, pain/riz complets, boulgour, quinoa ; lentilles, pois chiches, haricots rouges ; fruits/légumes variés, pruneaux, kiwi ; psyllium, graines ; eau."
     },
     {
      "k": "deplacement",
      "text": "Versions complètes, fruits ; pruneaux/oléagineux dans le sac ; boire régulièrement."
     },
     {
      "k": "pieges",
      "text": "Augmenter les fibres <strong>trop vite</strong> (ballonnements) ; fibres <strong>sans boire</strong> (aggrave) ; oublier l'activité."
     },
     {
      "k": "vigilance",
      "text": "Orientation durable. <strong>Consultez</strong> si constipation <strong>récente/inhabituelle</strong>, sang, amaigrissement."
     }
    ]
   },
   {
    "id": "sans_residu",
    "name": "Sans résidu / pauvre en fibres",
    "niveau": 2,
    "ecart": "relance l'inconfort/le résidu ; à tenir seulement pendant la durée fixée.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "En cas de sténose, poussée, ou avant examen/chirurgie, on met l'intestin <strong>au repos</strong> en réduisant les résidus (fibres). <strong>Transitoire.</strong>"
     },
     {
      "k": "principes",
      "items": [
       "Supprimer <strong>temporairement</strong> fibres/crudités/peaux/légumineuses/complets.",
       "Privilégier <strong>cuit, raffiné, tendre</strong>.",
       "<strong>Réélargir</strong> dès que le médecin l'autorise."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Basculer en <strong>blanc</strong> (pain/riz/pâtes blancs).",
       "Légumes <strong>bien cuits sans peau</strong>, fruits en compote lisse.",
       "Noter la <strong>date de fin</strong>."
      ]
     },
     {
      "k": "portions",
      "text": "Repas normaux mais <strong>sans résidu</strong> ; enrichir si l'appétit baisse."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain blanc + gelée + thé",
        "Jambon + riz blanc + carottes très cuites",
        "Compote lisse",
        "Poisson + purée + fromage"
       ],
       [
        "Mar",
        "Biscottes + miel",
        "Poulet + pâtes blanches + courgette sans peau",
        "Gelée de fruits",
        "Bouillon + semoule fine + œuf"
       ],
       [
        "Mer",
        "Pain de mie + confiture",
        "Poisson + riz blanc + carottes",
        "Yaourt",
        "Purée + jambon"
       ],
       [
        "Jeu",
        "Biscottes + fromage à pâte dure",
        "Volaille + pâtes + courgette cuite",
        "Compote",
        "Bouillon + riz + œuf"
       ],
       [
        "Ven",
        "Pain blanc + miel",
        "Poisson + purée + carottes",
        "Gelée",
        "Semoule fine + fromage"
       ],
       [
        "Sam",
        "Biscottes + gelée",
        "Jambon + riz + courgette sans peau",
        "Yaourt",
        "Purée + œuf"
       ],
       [
        "Dim",
        "Pain de mie + confiture",
        "Poulet + pâtes + carottes",
        "Compote lisse",
        "Bouillon + riz + fromage"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "<strong>Bouillon-repas</strong> : bouillon clair + pâtes/riz + œuf + fromage. <strong>Purée enrichie</strong> si dénutrition."
     },
     {
      "k": "batch",
      "text": "Riz/pâtes blancs d'avance ; carottes très cuites ; compotes lisses."
     },
     {
      "k": "collations",
      "text": "Compote lisse, gelée de fruits, yaourt, biscottes."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends… (temporairement)"
      ],
      "rows": [
       [
        "Pain complet",
        "Pain blanc / biscottes"
       ],
       [
        "Légumes crus",
        "Légumes cuits sans peau, moulinés"
       ],
       [
        "Fruits crus",
        "Compotes lisses, banane mûre"
       ],
       [
        "Légumineuses",
        "Éviter temporairement"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Autorisés",
      "koT": "À éviter (temporaire)",
      "ok": [
       "Pain/riz/pâtes blancs",
       "Viandes/poissons tendres, œufs",
       "Légumes bien cuits sans peau",
       "Compotes lisses, banane mûre",
       "Fromages"
      ],
      "ko": [
       "Légumes crus, peaux, pépins",
       "Légumineuses, maïs, choux",
       "Céréales complètes, son",
       "Fruits secs, oléagineux, fruits crus"
      ]
     },
     {
      "k": "courses",
      "text": "Pain/riz/pâtes blancs, semoule fine ; jambon, volaille, poisson tendre, œufs ; carotte/courgette (à cuire), compotes."
     },
     {
      "k": "deplacement",
      "text": "Plats simples cuits (riz + viande tendre) ; éviter crudités/complets."
     },
     {
      "k": "pieges",
      "text": "<strong>Prolonger</strong> au-delà du prescrit ; réintroduire les fibres <strong>trop vite</strong> ensuite."
     },
     {
      "k": "vigilance",
      "text": "<strong>Temporaire</strong> ; réintroduction <strong>progressive</strong> des fibres."
     }
    ]
   },
   {
    "id": "diverticules",
    "name": "Diverticules (diverticulose / diverticulite)",
    "niveau": 2,
    "niveauNote": "🟠 (crise) / 🟢 (prévention)",
    "ecart": "en crise, relance l'inconfort ; en prévention, aucun interdit.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Poches sur le côlon. <strong>Hors crise</strong>, les fibres <strong>protègent</strong> (🟢). <strong>En crise</strong>, on met le côlon <strong>au repos</strong> quelques jours (🟠), puis on réélargit."
     },
     {
      "k": "principes",
      "text": "<em>En crise</em> : pauvre en résidus/liquide selon consignes, <strong>temporairement</strong> (voir D3). <em>En prévention</em> : <strong>riche en fibres</strong>, hydratation, activité (voir D2)."
     },
     {
      "k": "demarrer",
      "text": "Comme D2 : fibres progressives, eau, mouvement."
     },
     {
      "k": "menu",
      "note": "prévention",
      "text": "Identique au menu <strong>D2</strong> (riche en fibres)."
     },
     {
      "k": "recettes",
      "text": "Voir D2 (prévention) et D3 (crise)."
     },
     {
      "k": "tab",
      "note": "prévention",
      "okT": "Conseillés",
      "koT": "À limiter",
      "ok": [
       "Fruits, légumes, céréales complètes, légumineuses",
       "Eau"
      ],
      "ko": [
       "Excès de plats gras/industriels",
       "Alimentation pauvre en fibres"
      ]
     },
     {
      "k": "erreur",
      "text": "Les <strong>graines, pépins, fraises, tomates NE sont PAS interdits</strong> : ils n'augmentent pas le risque de diverticulite ; les fibres <strong>protègent</strong>."
     },
     {
      "k": "vigilance",
      "text": "En crise, suivre les consignes temporaires. <strong>Consultez</strong> si fièvre, douleur intense, arrêt du transit."
     }
    ]
   }
  ]
 },
 {
  "cat": "MICI (Crohn, RCH)",
  "icon": "🎗",
  "items": [
   {
    "id": "mici_poussee",
    "name": "MICI en poussée (pauvre en résidus)",
    "niveau": 2,
    "ecart": "peut relancer l'inconfort. Régime de la POUSSÉE, pas de la vie courante — on réélargit en rémission.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "En poussée (ou sténose), réduire les fibres limite l'inconfort et le volume des selles le temps que l'inflammation régresse."
     },
     {
      "k": "principes",
      "items": [
       "Pauvre en résidus <strong>temporairement</strong> (cuit, raffiné, tendre).",
       "Fractionner, s'hydrater.",
       "<strong>Réélargir</strong> en rémission (pas de restriction permanente)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Basculer en <strong>blanc</strong> (pain/riz/pâtes blancs), légumes bien cuits sans peau.",
       "Fractionner.",
       "Noter la <strong>date de réévaluation</strong> avec le médecin."
      ]
     },
     {
      "k": "portions",
      "text": "Repas fractionnés sans résidu ; <strong>enrichir</strong> si l'appétit/poids baissent (risque de dénutrition en MICI)."
     },
     {
      "k": "menu",
      "text": "Identique au menu <strong>D3 (sans résidu)</strong> — voir fichier 2/4."
     },
     {
      "k": "recettes",
      "text": "Voir D3 (bouillon-repas, purées enrichies, compotes)."
     },
     {
      "k": "tab",
      "okT": "Autorisés",
      "koT": "À éviter (temporaire)",
      "ok": [
       "Pain/riz/pâtes blancs, viandes tendres, œufs",
       "Légumes bien cuits sans peau, compotes lisses"
      ],
      "ko": [
       "Légumes crus, peaux, pépins",
       "Légumineuses, complets, son, oléagineux"
      ]
     },
     {
      "k": "vigilance",
      "text": "Réélargir en rémission ; <strong>pas</strong> de restriction permanente (dénutrition). En rémission → alimentation <strong>variée/méditerranéenne</strong> (E4)."
     }
    ]
   },
   {
    "id": "nee",
    "name": "Nutrition entérale exclusive (NEE)",
    "niveau": 2,
    "ecart": "compromet l'induction de rémission. Uniquement le mélange prescrit, sur la durée fixée.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Remplacer <strong>toute</strong> l'alimentation par un mélange nutritionnel complet quelques semaines peut <strong>induire la rémission</strong> (surtout enfant/ado), sans corticoïdes."
     },
     {
      "k": "principes",
      "items": [
       "Uniquement le <strong>produit prescrit</strong>, aux quantités indiquées.",
       "Réparti sur la journée (oral ou sonde) ; eau si autorisée.",
       "<strong>Réintroduction alimentaire progressive</strong> ensuite."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Organiser les prises fractionnées du mélange.",
       "Varier arômes/température pour la tolérance (oral).",
       "Planifier la réintroduction avec l'équipe."
      ]
     },
     {
      "k": "menu",
      "note": "Menu",
      "text": "Prises fractionnées du <strong>mélange prescrit</strong> (ex. 5–6 prises/j), quantités selon prescription ; eau si autorisée."
     },
     {
      "k": "tab",
      "okT": "Pendant la NEE",
      "koT": "Pendant la NEE",
      "ok": [
       "Le <strong>mélange nutritionnel prescrit</strong>"
      ],
      "ko": [
       "Tout autre aliment/boisson (sauf eau si autorisée)"
      ]
     },
     {
      "k": "batch",
      "text": "Répartir/planifier les prises ; certains tolèrent mieux <strong>frais</strong> et à la paille."
     },
     {
      "k": "vigilance",
      "text": "Encadrement médical/diététique strict ; réintroduction progressive ; ne pas interrompre sans avis."
     }
    ]
   },
   {
    "id": "cded",
    "name": "Régime d'exclusion de Crohn (CDED) ± NE partielle",
    "niveau": 2,
    "niveauNote": "🟠/🟡",
    "ecart": "sort du cadre du protocole ; suivre les phases imposées.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Alimentation <strong>structurée</strong> (aliments choisis) + complément nutritionnel, pour réduire l'exposition aux composants suspectés d'entretenir l'inflammation."
     },
     {
      "k": "principes",
      "items": [
       "Suivre les <strong>phases</strong> et <strong>listes imposées</strong>.",
       "Complément nutritionnel <strong>partiel</strong> associé.",
       "Assouplissement <strong>progressif</strong> selon les phases."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Récupérer les listes de la phase en cours auprès de l'équipe.",
       "Cuisiner <strong>maison</strong> (poulet, œuf, pdt, riz, banane, pomme…).",
       "Intégrer le complément prescrit."
      ]
     },
     {
      "k": "menu",
      "text": "Selon la <strong>phase</strong> (aliments autorisés imposés : poulet, œuf, pdt, riz, banane, pomme, etc.) + complément prescrit — grille fournie par l'équipe."
     },
     {
      "k": "tab",
      "text": "Selon protocole/phase (fourni par l'équipe)."
     },
     {
      "k": "vigilance",
      "text": "Cadre médical structuré ; <strong>ne pas improviser</strong> ; suivi diététique."
     }
    ]
   },
   {
    "id": "mici_entretien",
    "name": "MICI en entretien (méditerranéen)",
    "niveau": 4,
    "ecart": "aucune ; orientation de fond, à adapter à sa tolérance.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Hors poussée, une alimentation variée méditerranéenne soutient l'état nutritionnel et pourrait limiter l'inflammation de bas grade. <strong>Aucun interdit strict.</strong>"
     },
     {
      "k": "principes",
      "items": [
       "Fruits, légumes, poisson, huile d'olive, légumineuses, complets.",
       "Limiter ultra-transformés/charcuteries/sodas.",
       "<strong>Adapter à SA tolérance</strong> (certaines fibres gênent selon les personnes)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Assiette med (½ légumes + protéine + complet/légumineuses + huile d'olive).",
       "Réduire ultra-transformés.",
       "Réintroduire fibres <strong>progressivement</strong> après une poussée."
      ]
     },
     {
      "k": "portions",
      "text": "½ légumes, ¼ protéine, ¼ féculent complet ; poisson 2×/sem ; légumineuses selon tolérance."
     },
     {
      "k": "menu",
      "text": "Identique au menu <strong>G4 (méditerranéen)</strong> — voir fichier 3/4 (adapter les fibres à la tolérance)."
     },
     {
      "k": "recettes",
      "text": "Voir G4."
     },
     {
      "k": "tab",
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
     {
      "k": "vigilance",
      "text": "Adapter à la <strong>tolérance individuelle</strong> ; si une fibre gêne, la cuire/réduire."
     }
    ]
   }
  ]
 },
 {
  "cat": "Pancréas",
  "icon": "🧬",
  "items": [
   {
    "id": "pancreatite_aigue",
    "name": "Reprise après pancréatite aiguë",
    "niveau": 2,
    "secs": [
     {
      "k": "pourquoi",
      "text": "Après l'inflammation aiguë, reprise <strong>progressive</strong> et <strong>pauvre en graisses</strong> pour ne pas trop solliciter le pancréas."
     },
     {
      "k": "principes",
      "items": [
       "Reprise <strong>précoce</strong> dès que possible.",
       "<strong>Pauvre en graisses</strong>, petites portions.",
       "<strong>Élargir</strong> selon tolérance ; <strong>arrêt de l'alcool</strong>."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Débuter par des repas légers <strong>pauvres en graisses</strong>.",
       "Fractionner.",
       "Élargir progressivement ; <strong>zéro alcool</strong>."
      ]
     },
     {
      "k": "portions",
      "text": "Petites portions maigres, fractionnées ; augmenter selon tolérance."
     },
     {
      "k": "menu",
      "note": "pauvre en graisses, progressif",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain + confiture + compote",
        "Poulet maigre + riz + légumes vapeur",
        "Yaourt maigre",
        "Poisson maigre + purée à l'eau"
       ],
       [
        "Mar",
        "Biscottes + fromage blanc 0%",
        "Dinde + pdt + carottes",
        "Compote",
        "Blanc de volaille + semoule + courgettes"
       ],
       [
        "Mer",
        "Pain + miel",
        "Poisson blanc + riz + haricots verts",
        "Yaourt 0%",
        "Œufs (peu de MG) + purée"
       ],
       [
        "Jeu",
        "Flocons + lait écrémé",
        "Volaille + pdt + légumes",
        "Compote",
        "Poisson + semoule + légumes"
       ],
       [
        "Ven",
        "Pain + confiture",
        "Dinde + riz + courgettes",
        "Yaourt 0%",
        "Poulet + purée + carottes"
       ],
       [
        "Sam",
        "Biscottes + fromage blanc",
        "Poisson + pdt + haricots verts",
        "Fruit cuit",
        "Volaille + semoule + légumes"
       ],
       [
        "Dim",
        "Pain + miel + compote",
        "Rôti maigre + riz + légumes",
        "Yaourt",
        "Soupe + poisson maigre + purée"
       ]
      ]
     },
     {
      "k": "batch",
      "text": "Riz/purées à l'eau ; volaille/poisson maigres portionnés."
     },
     {
      "k": "tab",
      "okT": "Au début",
      "koT": "À éviter au début",
      "ok": [
       "Féculents, légumes cuits",
       "Viandes/poissons <strong>maigres</strong>",
       "Laitages maigres",
       "Fruits cuits/compotes"
      ],
      "ko": [
       "Fritures, plats gras, sauces",
       "Charcuterie, fromages gras",
       "<strong>Alcool</strong>",
       "Pâtisseries riches"
      ]
     },
     {
      "k": "courses",
      "text": "Volaille/poisson maigres, œufs ; riz, pdt, semoule ; légumes ; laitages maigres ; compotes."
     },
     {
      "k": "vigilance",
      "text": "Restriction lipidique <strong>transitoire</strong> ; alcool à arrêter durablement si en cause."
     }
    ]
   },
   {
    "id": "pancreatite_chronique",
    "name": "Pancréatite chronique / insuffisance pancréatique (IPE)",
    "niveau": 3,
    "ecart": "diarrhée grasse si enzymes oubliées. L'enjeu n'est PAS de couper les graisses mais de les digérer.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le pancréas ne fabrique plus assez d'enzymes → graisses mal digérées (diarrhée grasse, amaigrissement). La solution n'est <strong>pas</strong> de supprimer les graisses mais de <strong>manger normalement AVEC les enzymes</strong>."
     },
     {
      "k": "principes",
      "items": [
       "Graisses en quantité <strong>normale</strong>, réparties.",
       "<strong>Enzymes pendant chaque repas/collation grasse</strong>, dose adaptée.",
       "<strong>Arrêt alcool + tabac</strong> ; corriger les vitamines (A, D, E, K)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Prendre les enzymes <strong>au début (et milieu) du repas</strong>.",
       "Ne pas sauter de repas.",
       "Ajuster la dose selon le <strong>gras</strong> du repas ; sevrage alcool/tabac."
      ]
     },
     {
      "k": "portions",
      "text": "Repas complets <strong>avec enzymes</strong> ; fractionner ; graisses <strong>normales</strong> (huile d'olive, poisson gras) accompagnées d'enzymes."
     },
     {
      "k": "menu",
      "note": "+ enzymes à chaque repas gras",
      "head": [
       "Jour",
       "P-déj (+E)",
       "Déjeuner (+E)",
       "Collation (+E si gras)",
       "Dîner (+E)"
      ],
      "rows": [
       [
        "Lun",
        "Pain + beurre + œuf",
        "Viande + féculents + légumes + huile d'olive",
        "Fromage + fruit",
        "Poisson + pdt + légumes"
       ],
       [
        "Mar",
        "Flocons + lait entier + noix",
        "Poisson gras + riz + légumes",
        "Yaourt + oléagineux",
        "Volaille + semoule + légumes"
       ],
       [
        "Mer",
        "Pain + beurre + fromage",
        "Bœuf + pâtes + légumes + huile",
        "Fromage + fruit",
        "Œufs + purée + légumes"
       ],
       [
        "Jeu",
        "Œufs + pain + avocat",
        "Volaille + riz + légumes + huile",
        "Yaourt + noix",
        "Poisson + pdt + légumes"
       ],
       [
        "Ven",
        "Flocons + lait entier",
        "Poisson + féculents + légumes + huile",
        "Fromage + fruit",
        "Viande + semoule + légumes"
       ],
       [
        "Sam",
        "Pain + beurre + œuf",
        "Rôti + pdt + légumes + huile",
        "Yaourt + oléagineux",
        "Poisson + riz + légumes"
       ],
       [
        "Dim",
        "Œufs + pain",
        "Légumineuses + légumes + féculents + huile",
        "Fromage + fruit",
        "Volaille + purée + légumes"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "Repas complets <strong>normaux</strong> (avec huile d'olive), à condition de <strong>prendre les enzymes</strong> ; enrichir si amaigrissement."
     },
     {
      "k": "batch",
      "text": "Féculents/légumes d'avance ; viandes/poissons portionnés."
     },
     {
      "k": "collations",
      "text": "Fromage + fruit, yaourt + oléagineux (<strong>enzymes si gras</strong>)."
     },
     {
      "k": "substitutions",
      "text": "Ne pas « dégraisser » à l'excès ; garder huile d'olive, poisson gras (<strong>avec enzymes</strong>) ; <strong>alcool → eau</strong>."
     },
     {
      "k": "tab",
      "okT": "Conseillés",
      "koT": "À éviter",
      "ok": [
       "Repas complets <strong>avec enzymes</strong>",
       "Protéines, féculents, légumes",
       "Graisses en quantité <strong>normale</strong>",
       "Fractionnement"
      ],
      "ko": [
       "<strong>Alcool</strong>",
       "Jeûne / sauts de repas",
       "<strong>Restriction sévère des graisses</strong>",
       "Grands repas espacés"
      ]
     },
     {
      "k": "courses",
      "text": "Viandes/poissons (dont gras), œufs, laitages ; féculents variés ; légumes ; huile d'olive, oléagineux ; <strong>extraits pancréatiques</strong> (ordonnance) ; vitamines si prescrites."
     },
     {
      "k": "deplacement",
      "text": "Toujours avoir ses <strong>enzymes</strong> ; ne pas sauter de repas."
     },
     {
      "k": "erreur",
      "text": "Supprimer les graisses <strong>aggrave</strong> la dénutrition : ajuster plutôt la <strong>dose d'enzymes</strong>."
     },
     {
      "k": "vigilance",
      "text": "Surveillance du <strong>poids</strong> et des <strong>vitamines</strong> ; sevrage alcool/tabac. → renvoi ETP IPE."
     }
    ]
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
    "niveauNote": "🟢 apports RENFORCÉS",
    "ecart": "sauter des repas/jeûner « attaque » les muscles. Ici l'enjeu est d'apporter ASSEZ, pas de restreindre.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "La cirrhose fait fondre les muscles et épuise les réserves. Bien manger, <strong>avec assez de protéines et d'énergie</strong>, protège la masse musculaire et diminue les complications."
     },
     {
      "k": "principes",
      "items": [
       "<strong>Ne pas réduire les protéines</strong> (au contraire : 1,2–1,5 g/kg/j).",
       "<strong>Fractionner</strong> (3 repas + collations).",
       "<strong>Collation le soir tard</strong> (éviter le jeûne nocturne)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Une <strong>protéine à chaque repas</strong>.",
       "Ajouter 2–3 collations.",
       "Instaurer la <strong>collation nocturne</strong> (laitage + pain/biscuits)."
      ]
     },
     {
      "k": "portions",
      "text": "Protéine à chaque repas (~1 paume de main) ; énergie suffisante ; <strong>collation nocturne</strong> systématique ; <strong>zéro alcool</strong> ; éviter AINS."
     },
     {
      "k": "menu",
      "note": "+ collation nocturne",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner",
       "Nuit"
      ],
      "rows": [
       [
        "Lun",
        "Œufs + pain + laitage",
        "Viande + féculents + légumes + huile d'olive",
        "Fromage + fruit",
        "Poisson + pdt",
        "Lait + pain"
       ],
       [
        "Mar",
        "Fromage blanc + flocons + noix",
        "Poisson + riz + légumes",
        "Yaourt + biscuits",
        "Volaille + semoule",
        "Yaourt + biscotte"
       ],
       [
        "Mer",
        "Œufs + pain + jus",
        "Légumineuses + légumes + riz",
        "Fromage + fruit",
        "Bœuf + pdt",
        "Lait + pain"
       ],
       [
        "Jeu",
        "Pain + jambon + laitage",
        "Poisson + pâtes + légumes",
        "Yaourt + oléagineux",
        "Œufs + purée",
        "Riz au lait"
       ],
       [
        "Ven",
        "Flocons + lait + noix",
        "Volaille + riz + légumes",
        "Fromage + fruit",
        "Poisson + semoule",
        "Lait + biscuits"
       ],
       [
        "Sam",
        "Œufs + pain + fromage",
        "Rôti maigre + pdt + légumes",
        "Yaourt + fruit",
        "Poisson + riz",
        "Yaourt + pain"
       ],
       [
        "Dim",
        "Pain perdu (four) + laitage",
        "Légumineuses + légumes + féculents",
        "Fromage + noix",
        "Volaille + purée",
        "Lait + pain"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "Enrichir purées/soupes avec <strong>fromage, œuf, poudre de lait, crème, huile</strong> ; <strong>CNO</strong> en collation si besoin ; <strong>riz au lait</strong> en collation nocturne."
     },
     {
      "k": "batch",
      "text": "Portions de viande/poisson cuits ; soupes enrichies ; féculents d'avance ; collations nocturnes prêtes."
     },
     {
      "k": "collations",
      "text": "Fromage + fruit, yaourt + biscuits, laitage + oléagineux, CNO."
     },
     {
      "k": "tab",
      "okT": "À privilégier",
      "koT": "À éviter",
      "ok": [
       "Protéines à chaque repas",
       "Collation du soir (nocturne)",
       "Féculents, énergie suffisante"
      ],
      "ko": [
       "<strong>Sauter des repas / jeûner</strong>",
       "<strong>Restriction protéique</strong>",
       "Alcool, AINS"
      ]
     },
     {
      "k": "courses",
      "text": "Œufs, viandes/poissons, laitages, fromages, légumineuses ; pain, riz, pâtes, semoule, pdt ; huile d'olive, poudre de lait, oléagineux ; CNO si prescrits."
     },
     {
      "k": "deplacement",
      "text": "Ne jamais sauter un repas ; collations dans le sac ; éviter l'alcool."
     },
     {
      "k": "pieges",
      "text": "Croire qu'il faut « ménager » le foie en mangeant moins ; automédication (AINS)."
     },
     {
      "k": "vigilance",
      "text": "Si <strong>ascite</strong> → associer <strong>G2</strong> ; si <strong>encéphalopathie</strong> → <strong>maintenir</strong> protéines (<strong>G3</strong>). Suivi diététique conseillé."
     }
    ]
   },
   {
    "id": "hyposode",
    "name": "Hyposodé (ascite, rétention d'eau)",
    "niveau": 3,
    "niveauNote": "🟡 (important)",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le sel retient l'eau → ascite/œdèmes. Réduire le sel aide les <strong>diurétiques</strong> à évacuer cette eau."
     },
     {
      "k": "principes",
      "items": [
       "Viser <strong>~2 g de sodium/j</strong> (≈ 5 g de sel).",
       "<strong>Ne pas ajouter de sel</strong> ; traquer le <strong>sel caché</strong>.",
       "<strong>Assaisonner autrement</strong> (herbes, épices, citron). Pas de restriction d'eau <strong>sauf</strong> hyponatrémie."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Ranger la salière ; cuisiner maison.",
       "Repérer les gros pourvoyeurs (pain, charcuterie, fromages, plats préparés, conserves).",
       "Remplacer par du <strong>sans/peu salé</strong> + herbes/épices."
      ]
     },
     {
      "k": "portions",
      "text": "Pas d'ajout de sel à table ni en cuisine ; lire les étiquettes (viser &lt; 0,3 g sodium/100 g) ; herbes/épices/citron à volonté."
     },
     {
      "k": "menu",
      "note": "hyposodé",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "<strong>Pain sans sel</strong> + confiture + fruit",
        "Viande non salée + légumes frais + riz + herbes",
        "Fruit + yaourt nature",
        "Poisson + pdt + huile d'olive + citron"
       ],
       [
        "Mar",
        "Flocons + lait + banane",
        "Poulet + légumes + semoule + épices",
        "Compote",
        "Œufs + purée maison + salade + vinaigrette maison"
       ],
       [
        "Mer",
        "Pain sans sel + miel",
        "Poisson frais + riz + courgettes",
        "Yaourt nature",
        "Volaille + pdt + légumes + herbes"
       ],
       [
        "Jeu",
        "Flocons + fruits",
        "Bœuf + légumes + quinoa",
        "Fruit",
        "Poisson + semoule + ratatouille maison"
       ],
       [
        "Ven",
        "Pain sans sel + fromage frais non salé",
        "Volaille + riz + haricots verts",
        "Compote",
        "Œufs + pdt + légumes"
       ],
       [
        "Sam",
        "Porridge + fruits",
        "Poisson + légumes + riz + citron",
        "Yaourt nature",
        "Viande + purée + salade"
       ],
       [
        "Dim",
        "Pain sans sel + confiture",
        "Rôti maison + légumes + pdt",
        "Fruit",
        "Soupe <strong>maison</strong> + poisson + semoule"
       ]
      ]
     },
     {
      "k": "recettes",
      "note": "goût sans sel",
      "text": "Vinaigrette <strong>maison</strong> (huile + citron/vinaigre + herbes) ; marinades citron-herbes-ail ; bouillon <strong>maison</strong> ; épices (cumin, paprika, curcuma)."
     },
     {
      "k": "batch",
      "text": "Bouillon maison en portions ; légumes rôtis aux herbes ; ratatouille ; viandes rôties non salées."
     },
     {
      "k": "collations",
      "text": "Fruits, yaourt <strong>nature</strong>, compote, oléagineux <strong>non salés</strong>."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Sel de table",
        "Herbes, épices, ail/oignon frais, citron, vinaigre"
       ],
       [
        "Pain ordinaire",
        "<strong>Pain sans sel</strong>"
       ],
       [
        "Charcuterie/fromages salés",
        "Viande fraîche, fromages <strong>peu salés</strong> en petite quantité"
       ],
       [
        "Plats préparés/conserves",
        "Fait maison, légumes frais/surgelés <strong>nature</strong>"
       ],
       [
        "Bouillon cube",
        "Bouillon <strong>maison</strong>"
       ],
       [
        "Eau gazeuse salée",
        "Eau plate peu minéralisée"
       ]
      ]
     },
     {
      "k": "tab",
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
     {
      "k": "courses",
      "text": "Pain sans sel, légumes frais/surgelés nature, viandes/poissons frais, herbes/épices, citron, huile d'olive, oléagineux non salés."
     },
     {
      "k": "deplacement",
      "text": "Demander « sans sel ajouté » ; éviter charcuteries/fromages/plats industriels ; citron/herbes pour relever."
     },
     {
      "k": "pieges",
      "text": "Confondre avec <strong>restriction d'eau</strong> (inutile/dangereuse sauf hyponatrémie) ; viser un « zéro sel » qui coupe l'appétit → <strong>hyposodé réaliste</strong>."
     },
     {
      "k": "vigilance",
      "text": "Ne pas restreindre l'eau sans avis ; garder de l'appétit (risque de dénutrition — associer G1)."
     }
    ]
   },
   {
    "id": "encephalopathie",
    "name": "Encéphalopathie hépatique",
    "niveau": 4,
    "niveauNote": "🟢 protéines MAINTENUES",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Foie qui filtre mal → toxines vers le cerveau (confusion). <strong>Contrairement à une idée ancienne, on ne réduit PAS les protéines</strong> : on les maintient, en privilégiant certaines sources."
     },
     {
      "k": "principes",
      "items": [
       "<strong>Protéines normales à élevées</strong>.",
       "Privilégier <strong>végétales et laitières</strong>.",
       "<strong>Fractionner + collation nocturne</strong> ; traiter la <strong>constipation</strong> (facteur déclenchant)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Garder les protéines (végétales/laitières en priorité).",
       "Fractionner + collation du soir.",
       "Éviter la constipation (fibres, hydratation, lactulose si prescrit)."
      ]
     },
     {
      "k": "portions",
      "text": "Protéines réparties sur la journée ; <strong>légumineuses/laitages</strong> privilégiés ; collation nocturne."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner",
       "Nuit"
      ],
      "rows": [
       [
        "Lun",
        "Laitage + pain + fruit",
        "<strong>Lentilles</strong> + légumes + féculents + un peu de fromage",
        "Yaourt",
        "Œufs + pdt",
        "Laitage"
       ],
       [
        "Mar",
        "Fromage blanc + flocons",
        "Pois chiches + légumes + riz",
        "Fruit + laitage",
        "Poisson + semoule",
        "Yaourt"
       ],
       [
        "Mer",
        "Laitage + pain",
        "Haricots + légumes + quinoa",
        "Yaourt",
        "Œufs + purée",
        "Lait + biscuits"
       ],
       [
        "Jeu",
        "Flocons + lait",
        "Dahl de lentilles + riz + légumes",
        "Fromage blanc",
        "Poisson + pdt",
        "Laitage"
       ],
       [
        "Ven",
        "Laitage + pain + fruit",
        "Légumineuses + légumes + féculents",
        "Yaourt",
        "Œufs + semoule",
        "Lait"
       ],
       [
        "Sam",
        "Fromage blanc + flocons",
        "Tofu/légumineuses + légumes + riz",
        "Fruit + laitage",
        "Poisson + purée",
        "Yaourt"
       ],
       [
        "Dim",
        "Laitage + pain",
        "Curry de pois chiches + riz",
        "Yaourt",
        "Œufs + légumes + féculents",
        "Laitage"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "<strong>Dahl de lentilles</strong> ; <strong>curry de pois chiches</strong> ; laitages en collation."
     },
     {
      "k": "batch",
      "text": "Légumineuses cuites en portions ; dahl/curry en base ; féculents d'avance."
     },
     {
      "k": "collations",
      "text": "Laitages, fromage blanc, fruit + yaourt."
     },
     {
      "k": "tab",
      "okT": "À privilégier",
      "koT": "À éviter",
      "ok": [
       "Protéines <strong>végétales</strong> (légumineuses)",
       "Laitages, œufs",
       "Fractionnement + collation du soir"
      ],
      "ko": [
       "<strong>Restriction protéique</strong>",
       "Jeûne prolongé",
       "Alcool, constipation"
      ]
     },
     {
      "k": "courses",
      "text": "Lentilles, pois chiches, haricots, tofu ; laitages, fromage blanc, œufs ; riz, semoule, quinoa, pdt ; légumes, fruits ; (lactulose si prescrit)."
     },
     {
      "k": "deplacement",
      "text": "Ne pas sauter de repas ; privilégier plats à base de légumineuses/laitages."
     },
     {
      "k": "erreur",
      "text": "Réduire les protéines <strong>aggrave</strong> la fonte musculaire <strong>sans</strong> améliorer l'encéphalopathie."
     },
     {
      "k": "vigilance",
      "text": "Suivre le traitement (lactulose…) ; <strong>éviter la constipation</strong> ; l'entourage guette confusion/somnolence (→ ETP)."
     }
    ]
   },
   {
    "id": "mash",
    "name": "Stéatose / MASH (foie gras",
    "niveau": 4,
    "niveauNote": "MASLD) — 🟢 HYGIÈNE DE VIE",
    "ecart": "aucun impact ponctuel ; c'est la régularité et le poids qui comptent.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Excès de graisse dans le foie lié au poids, au sucre (fructose/boissons sucrées) et à l'alcool. Souvent <strong>réversible</strong> : perte de poids progressive + méditerranéen peuvent le faire régresser."
     },
     {
      "k": "principes",
      "items": [
       "<strong>Réduire sucres rapides/boissons sucrées</strong>.",
       "<strong>Réduire l'alcool</strong>.",
       "<strong>Méditerranéen</strong> + activité + <strong>perte de 7–10 %</strong> si surpoids (progressive)."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Supprimer sodas/jus (→ eau/eau aromatisée).",
       "30 min d'activité/j.",
       "Assiette méditerranéenne (légumes + huile d'olive + protéine + légumineuses/complets)."
      ]
     },
     {
      "k": "portions",
      "text": "½ assiette légumes, ¼ protéine, ¼ féculent <strong>complet</strong> ; huile d'olive comme graisse principale ; 2 fruits <strong>entiers</strong>/j."
     },
     {
      "k": "menu",
      "note": "méditerranéen",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Yaourt nature + fruits + noix",
        "Poisson + légumes + huile d'olive + quinoa",
        "Fruit",
        "Légumineuses + légumes"
       ],
       [
        "Mar",
        "Flocons + lait + fruits rouges",
        "Poulet + ratatouille + riz complet",
        "Oléagineux",
        "Salade + thon + pois chiches"
       ],
       [
        "Mer",
        "Pain complet + fromage frais + tomate",
        "Lentilles + légumes + boulgour",
        "Fruit",
        "Poisson + légumes rôtis"
       ],
       [
        "Jeu",
        "Yaourt + fruits + graines",
        "Volaille + légumes + patate douce",
        "Fruit + noix",
        "Omelette + légumes + pain complet"
       ],
       [
        "Ven",
        "Flocons + fruits",
        "Poisson + légumes + quinoa",
        "Oléagineux",
        "Curry de légumineuses + riz complet"
       ],
       [
        "Sam",
        "Pain complet + œuf + avocat (peu)",
        "Rôti maigre + légumes + boulgour",
        "Fruit",
        "Poisson + légumes + huile d'olive"
       ],
       [
        "Dim",
        "Yaourt + fruits + noix",
        "Salade méditerranéenne complète",
        "Fruit",
        "Soupe + légumineuses + pain complet"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "<strong>Assiette med</strong> : légumes + huile d'olive + protéine + complet/légumineuses. <strong>Eau aromatisée</strong> (citron/menthe/concombre) pour remplacer les sodas."
     },
     {
      "k": "batch",
      "text": "Légumes rôtis, légumineuses cuites, céréales complètes d'avance."
     },
     {
      "k": "collations",
      "text": "Fruits entiers, oléagineux, yaourt nature."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Soda/jus",
        "Eau, eau aromatisée maison"
       ],
       [
        "Pâtisserie",
        "Fruit + oléagineux"
       ],
       [
        "Ultra-transformés",
        "Fait maison, légumineuses, complets"
       ],
       [
        "Beurre/friture",
        "Huile d'olive, cuisson douce"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "À privilégier",
      "koT": "À limiter",
      "ok": [
       "Légumes, fruits <strong>entiers</strong>, poisson, huile d'olive",
       "Oléagineux, complets, légumineuses"
      ],
      "ko": [
       "Sodas, jus, sirops",
       "Pâtisseries, ultra-transformés",
       "Alcool, fritures"
      ]
     },
     {
      "k": "courses",
      "text": "Légumes/fruits, poisson, huile d'olive, oléagineux, légumineuses, céréales complètes."
     },
     {
      "k": "deplacement",
      "text": "Grillade + légumes + féculent complet ; eau plutôt que soda ; dessert = fruit."
     },
     {
      "k": "pieges",
      "text": "Perte de poids <strong>trop rapide</strong> (contre-productive) ; « light » sucrés ; oublier l'alcool."
     },
     {
      "k": "vigilance",
      "text": "Régularité &gt; perfection ; dépister diabète/HTA/cholestérol. → renvoi ETP MASLD."
     }
    ]
   },
   {
    "id": "vesicule",
    "name": "Lithiase biliaire / post-cholécystectomie",
    "niveau": 3,
    "niveauNote": "🟡 (souvent transitoire)",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Les graisses stimulent la vésicule → douleurs (colique). Avant l'intervention/juste après l'ablation, <strong>pauvre en graisses</strong> limite l'inconfort ; la tolérance revient ensuite le plus souvent."
     },
     {
      "k": "principes",
      "items": [
       "Réduire <strong>temporairement</strong> les graisses (surtout fritures/sauces).",
       "Fractionner.",
       "<strong>Réintroduire progressivement</strong> après l'opération."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Cuissons sans matière grasse (vapeur/four).",
       "Choisir maigre (viandes/laitages).",
       "Réintroduire les graisses <strong>par étapes</strong> après l'ablation."
      ]
     },
     {
      "k": "portions",
      "text": "Repas légers en graisses, fractionnés ; huile en petite quantité au début."
     },
     {
      "k": "menu",
      "note": "pauvre en graisses",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain + un peu de confiture + fruit",
        "Volaille maigre + riz + légumes",
        "Compote",
        "Poisson maigre + purée à l'eau"
       ],
       [
        "Mar",
        "Biscottes + fromage blanc 0%",
        "Dinde + pdt + carottes",
        "Yaourt maigre",
        "Blanc de poulet + semoule + courgettes"
       ],
       [
        "Mer",
        "Pain + miel + fruit",
        "Poisson blanc + riz + haricots verts",
        "Compote",
        "Œufs (peu de matière grasse) + purée"
       ],
       [
        "Jeu",
        "Flocons + lait écrémé",
        "Volaille + pdt + légumes",
        "Yaourt 0%",
        "Poisson + semoule + légumes"
       ],
       [
        "Ven",
        "Pain + confiture",
        "Dinde + riz + courgettes",
        "Compote",
        "Poulet + purée + carottes"
       ],
       [
        "Sam",
        "Biscottes + fromage blanc",
        "Poisson + pdt + haricots verts",
        "Fruit",
        "Volaille + semoule + légumes"
       ],
       [
        "Dim",
        "Pain + miel",
        "Rôti maigre + riz + légumes",
        "Compote",
        "Soupe + poisson maigre + purée"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "Papillotes de poisson <strong>sans matière grasse</strong> ; purées <strong>à l'eau</strong> ; volaille grillée."
     },
     {
      "k": "batch",
      "text": "Riz/purées d'avance ; volaille/poisson maigres portionnés."
     },
     {
      "k": "collations",
      "text": "Compote, yaourt maigre, fruit."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Fritures/sauces",
        "Vapeur/four"
       ],
       [
        "Charcuterie/fromages gras",
        "Maigres"
       ],
       [
        "Pâtisseries riches",
        "Fruits/laitages maigres"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Conseillés",
      "koT": "À limiter",
      "ok": [
       "Viandes/poissons maigres",
       "Féculents, légumes cuits",
       "Laitages maigres"
      ],
      "ko": [
       "Fritures, plats en sauce",
       "Charcuterie, fromages gras",
       "Pâtisseries riches, crème"
      ]
     },
     {
      "k": "courses",
      "text": "Volaille/poisson maigres, œufs ; riz, pdt, semoule ; légumes ; laitages maigres ; compotes."
     },
     {
      "k": "deplacement",
      "text": "Grillades + féculents + légumes ; éviter fritures/sauces."
     },
     {
      "k": "vigilance",
      "text": "Souvent <strong>transitoire</strong> : réintroduire les graisses <strong>par étapes</strong> après l'ablation."
     }
    ]
   },
   {
    "id": "wilson",
    "name": "Maladie de Wilson (pauvre en cuivre)",
    "niveau": 1,
    "niveauNote": "🔴 STRICT (appoint du traitement)",
    "ecart": "apport de cuivre toxique. À vie, en complément du traitement.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le cuivre s'accumule et devient toxique (foie, cerveau). En <strong>complément indispensable</strong> du traitement (chélateur/zinc), on évite les aliments <strong>très riches en cuivre</strong>, surtout en début de traitement."
     },
     {
      "k": "principes",
      "items": [
       "Éviter les aliments <strong>très riches en cuivre</strong>.",
       "Attention à l'<strong>eau</strong> (canalisations en cuivre).",
       "Démarche <strong>à vie</strong>, avec le traitement."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Retirer foie/abats, fruits de mer, chocolat, fruits à coque des placards.",
       "Vérifier la teneur en cuivre de l'eau si canalisations anciennes.",
       "Cuisiner « courant » en évitant la liste rouge."
      ]
     },
     {
      "k": "portions",
      "text": "Alimentation normale <strong>en excluant</strong> les aliments riches en cuivre."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain + beurre + confiture",
        "Poulet + riz + carottes",
        "Yaourt",
        "Poisson (hors coquillages) + pdt + courgettes"
       ],
       [
        "Mar",
        "Flocons + lait + banane",
        "Dinde + pâtes + haricots verts",
        "Fruit",
        "Œufs + purée + salade"
       ],
       [
        "Mer",
        "Pain + fromage",
        "Bœuf + riz + légumes",
        "Yaourt",
        "Volaille + semoule + carottes"
       ],
       [
        "Jeu",
        "Flocons + lait",
        "Poulet + pdt + courgettes",
        "Fruit",
        "Poisson + riz + légumes"
       ],
       [
        "Ven",
        "Pain + beurre",
        "Dinde + pâtes + légumes",
        "Yaourt",
        "Œufs + purée + haricots verts"
       ],
       [
        "Sam",
        "Flocons + lait + fruit",
        "Bœuf + riz + carottes",
        "Fruit",
        "Volaille + semoule + légumes"
       ],
       [
        "Dim",
        "Pain + fromage",
        "Rôti + pdt + légumes",
        "Yaourt",
        "Soupe (sans champignons) + poisson + riz"
       ]
      ]
     },
     {
      "k": "collations",
      "text": "Yaourt, fruits (hors exceptions), pain, produits laitiers."
     },
     {
      "k": "tab",
      "okT": "Autorisés",
      "koT": "À éviter (riches en cuivre)",
      "ok": [
       "Aliments courants, viandes/volailles/œufs",
       "Laitages, féculents",
       "Légumes/fruits (hors exceptions)"
      ],
      "ko": [
       "<strong>Foie, abats</strong>",
       "<strong>Fruits de mer, crustacés</strong>",
       "<strong>Chocolat, cacao</strong>",
       "<strong>Fruits à coque, graines</strong>",
       "Champignons ; légumineuses (à limiter)"
      ]
     },
     {
      "k": "courses",
      "text": "Viandes/volailles/œufs, laitages, riz/pâtes/pdt, légumes/fruits courants ; <strong>éviter</strong> la colonne rouge."
     },
     {
      "k": "retenir",
      "text": "Le régime <strong>accompagne</strong> le traitement, il ne le remplace pas. Suivi spécialisé strict."
     }
    ]
   },
   {
    "id": "hemochromatose",
    "name": "Hémochromatose (surcharge en fer)",
    "niveau": 4,
    "niveauNote": "🟢 précautions ciblées",
    "ecart": "impact mineur ; le traitement clé reste la saignée.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Absorption excessive de fer. Le traitement principal est la <strong>saignée</strong> ; l'alimentation joue un rôle <strong>secondaire</strong> (quelques précautions, <strong>pas</strong> de régime « sans fer » drastique)."
     },
     {
      "k": "principes",
      "items": [
       "<strong>Pas de vitamine C pendant les repas</strong> (augmente l'absorption du fer).",
       "<strong>Pas de compléments en fer</strong>.",
       "<strong>Limiter l'alcool</strong> ; le <strong>thé</strong> au repas réduit un peu l'absorption."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Décaler les fruits riches en vitamine C <strong>à distance</strong> des repas.",
       "Arrêter suppléments/multivitamines contenant du fer.",
       "Réduire l'alcool ; thé au repas."
      ]
     },
     {
      "k": "portions",
      "text": "Alimentation variée normale ; inutile de bannir la viande rouge."
     },
     {
      "k": "menu",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Thé + pain + fromage",
        "Poulet + légumes + riz",
        "Fruit (à distance)",
        "Poisson + pdt + légumes"
       ],
       [
        "…",
        "<em>(schéma répété : repas variés + <strong>thé au repas</strong> ; fruits riches en vitamine C en collation, pas au repas)</em>",
        "",
        "",
        ""
       ]
      ],
      "text": "(repères) <em>Thé au repas ; vitamine C à distance.</em>"
     },
     {
      "k": "substitutions",
      "text": "Fruits riches en vitamine C <strong>hors repas</strong> ; thé/café au repas ; éviter suppléments fer, jus d'orange <strong>au</strong> repas, alcool."
     },
     {
      "k": "tab",
      "okT": "Conseillés",
      "koT": "À éviter",
      "ok": [
       "Thé au cours des repas",
       "Alimentation variée"
      ],
      "ko": [
       "Compléments en fer",
       "Vitamine C <strong>pendant</strong> les repas",
       "Alcool (surtout)",
       "Excès de foie/abats (fer héminique)"
      ]
     },
     {
      "k": "vigilance",
      "text": "La <strong>saignée</strong> reste le traitement clé ; pas de restriction inutile."
     }
    ]
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
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le tube digestif redémarre par étapes : <strong>liquide → mixé → normal</strong> pour éviter douleurs et complications."
     },
     {
      "k": "principes",
      "items": [
       "Respecter les <strong>paliers</strong> indiqués.",
       "Petites quantités, mastication.",
       "Passer au palier suivant <strong>si bien toléré</strong>."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Repérer le palier en cours.",
       "Petites prises fréquentes.",
       "Avancer d'un palier <strong>seulement</strong> si bien toléré."
      ]
     },
     {
      "k": "menu",
      "note": "Menu",
      "items": [
       "<strong>Palier liquide</strong> : bouillons clairs, jus sans pulpe, tisanes, eau.",
       "<strong>Palier mixé/lisse</strong> : veloutés, purées, compotes, laitages lisses (enrichis).",
       "<strong>Palier normal fractionné</strong> : alimentation normale en <strong>petites portions fréquentes</strong>."
      ]
     },
     {
      "k": "tab",
      "okT": "Selon palier",
      "koT": "Trop tôt",
      "ok": [
       "Progression liquide→mixé→normal, petites portions",
       "Aliments tendres au bon moment"
      ],
      "ko": [
       "<strong>Sauter des paliers</strong>",
       "Grosses portions, aliments durs"
      ]
     },
     {
      "k": "batch",
      "text": "Veloutés/purées enrichis congelés (utiles au palier mixé)."
     },
     {
      "k": "vigilance",
      "text": "<strong>Temporaire</strong> ; suivre les consignes de l'équipe chirurgicale."
     }
    ]
   },
   {
    "id": "stomie",
    "name": "Iléostomie / colostomie",
    "niveau": 3,
    "ecart": "débit/gaz modifiés ; réversible. Priorité = hydratation et sel (iléostomie).",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Objectif : <strong>maîtriser débit et hydratation</strong> (iléostomie : pertes d'eau et de sel importantes) ; réintroduction alimentaire <strong>progressive</strong>."
     },
     {
      "k": "principes",
      "items": [
       "<strong>Bien s'hydrater et saler</strong> (iléostomie).",
       "<strong>Réintroduire les fibres progressivement</strong>.",
       "<strong>Mâcher longuement</strong> ; repérer aliments accélérateurs/épaississants/gazogènes."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Boire suffisamment + apport de <strong>sel</strong> (iléostomie).",
       "Base « sécurisante » (riz, pdt, banane).",
       "Réintroduire <strong>un aliment à la fois</strong>, noter la tolérance."
      ]
     },
     {
      "k": "portions",
      "text": "Repas réguliers ; boissons réparties ; <strong>sel</strong> suffisant (iléostomie) ; introduire les fibres par petites touches."
     },
     {
      "k": "menu",
      "note": "base bien tolérée + réintroductions",
      "head": [
       "Jour",
       "P-déj",
       "Déjeuner",
       "Collation",
       "Dîner"
      ],
      "rows": [
       [
        "Lun",
        "Pain blanc + fromage + banane",
        "Viande tendre + riz + carottes cuites",
        "Yaourt",
        "Poisson + purée"
       ],
       [
        "Mar",
        "Biscottes + fromage + compote",
        "Volaille + pâtes + courgette cuite",
        "Yaourt",
        "Œufs + purée + carottes"
       ],
       [
        "Mer",
        "Pain de mie + banane",
        "Poisson + riz + carottes",
        "Compote",
        "Viande tendre + pdt"
       ],
       [
        "Jeu",
        "Flocons + lait",
        "Volaille + riz + courgette (test)",
        "Yaourt",
        "Poisson + purée + carottes"
       ],
       [
        "Ven",
        "Pain + fromage",
        "Bœuf tendre + pâtes + carottes",
        "Banane",
        "Œufs + purée"
       ],
       [
        "Sam",
        "Biscottes + compote",
        "Poisson + riz + courgette",
        "Yaourt",
        "Volaille + pdt + carottes"
       ],
       [
        "Dim",
        "Pain + banane",
        "Rôti tendre + riz + carottes",
        "Compote",
        "Soupe lisse + poisson + purée"
       ]
      ]
     },
     {
      "k": "recettes",
      "text": "Plats <strong>épaississants</strong> (riz, banane, pdt) utiles si débit liquide ; bien <strong>mâcher</strong> les aliments filandreux."
     },
     {
      "k": "batch",
      "text": "Riz/purées d'avance ; viandes tendres portionnées ; boissons de réhydratation prêtes."
     },
     {
      "k": "collations",
      "text": "Banane, yaourt, compote, fromage."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends…"
      ],
      "rows": [
       [
        "Crudités",
        "Légumes cuits"
       ],
       [
        "Complets (au début)",
        "Blancs (riz, pain)"
       ],
       [
        "Aliments filandreux",
        "Bien <strong>mâchés</strong> / hachés"
       ],
       [
        "Débit trop liquide",
        "Riz/banane/pdt (épaississants)"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Souvent bien tolérés",
      "koT": "⚠️ À introduire prudemment",
      "ok": [
       "Riz, pâtes, pdt, banane, compotes",
       "Viandes tendres, poisson",
       "Boissons + apport de <strong>sel</strong>"
      ],
      "ko": [
       "Légumes fibreux, peaux, pépins",
       "Maïs, champignons, fruits secs",
       "Légumineuses (gaz), excès de crudités"
      ]
     },
     {
      "k": "courses",
      "text": "Riz, pdt, pâtes, banane, compotes ; viandes tendres/poisson ; boissons de réhydratation/sel."
     },
     {
      "k": "deplacement",
      "text": "Repérer les toilettes ; matériel de rechange ; hydratation ; éviter les aliments gazogènes avant une sortie."
     },
     {
      "k": "pieges",
      "text": "Sous-boire (déshydratation en iléostomie) ; réintroduire fibres <strong>trop vite</strong>."
     },
     {
      "k": "vigilance",
      "text": "Iléostomie = surveiller la <strong>déshydratation</strong> (fatigue, urines foncées, débit élevé). Accompagnement <strong>stomathérapeute</strong>. → renvoi ETP stomie."
     }
    ]
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
    "ecart": "côlon mal préparé → examen de mauvaise qualité, parfois à REFAIRE. Respect strict sur 3–5 jours.",
    "secs": [
     {
      "k": "pourquoi",
      "text": "Le côlon doit être <strong>parfaitement propre</strong> : régime sans résidu les jours précédents + préparation évacuatrice → coloscopie de qualité (évite de recommencer)."
     },
     {
      "k": "principes",
      "items": [
       "<strong>3–5 jours avant</strong> : supprimer fibres/fruits/légumes/complets/graines.",
       "<strong>La veille</strong> : alimentation légère puis <strong>liquides clairs</strong> + préparation prescrite.",
       "<strong>À jeun</strong> le jour J selon consignes ; éviter le <strong>rouge/violet</strong> les derniers jours."
      ]
     },
     {
      "k": "demarrer",
      "items": [
       "Basculer en <strong>blanc</strong> (pain/riz/pâtes blancs).",
       "Préparer bouillons clairs/gelées pour la veille.",
       "Respecter <strong>les horaires</strong> de la préparation."
      ]
     },
     {
      "k": "portions",
      "text": "Repas légers sans résidu J-3 à J-1 ; <strong>liquides clairs</strong> la veille ; à jeun le jour J."
     },
     {
      "k": "menu",
      "note": "Plan des 3 derniers jours",
      "head": [
       "Jour",
       "Matin",
       "Midi",
       "Après-midi",
       "Soir"
      ],
      "rows": [
       [
        "J-3",
        "Pain blanc + miel, thé/café <strong>sans lait</strong>",
        "Jambon + riz blanc",
        "Gelée / bouillon",
        "Pâtes blanches + fromage à pâte dure"
       ],
       [
        "J-2",
        "Biscottes + gelée",
        "Poisson + pâtes blanches",
        "Bouillon clair",
        "Riz blanc + œuf"
       ],
       [
        "J-1 (veille)",
        "Pain blanc + miel",
        "Bouillon + pâtes fines (repas léger)",
        "<strong>Liquides clairs</strong> + début de préparation",
        "<strong>Liquides clairs</strong> + préparation prescrite"
       ],
       [
        "Jour J",
        "À jeun / liquides selon consignes",
        "—",
        "—",
        "—"
       ]
      ]
     },
     {
      "k": "libre",
      "note": "Liquides clairs autorisés (veille)",
      "text": "Eau, bouillon <strong>filtré</strong>, thé/café <strong>sans lait</strong>, jus <strong>sans pulpe</strong> non rouges, boissons claires, gelées non rouges."
     },
     {
      "k": "substitutions",
      "head": [
       "À la place de…",
       "Je prends… (temporairement)"
      ],
      "rows": [
       [
        "Complets",
        "Blancs (pain/riz/pâtes)"
       ],
       [
        "Fruits/légumes",
        "Jus sans pulpe / bouillons"
       ],
       [
        "Laitages en grande quantité",
        "Éviter"
       ]
      ]
     },
     {
      "k": "tab",
      "okT": "Autorisés",
      "koT": "Interdits avant l'examen",
      "ok": [
       "Pain/riz blancs, pâtes",
       "Viandes/poissons maigres, œufs",
       "Bouillons clairs, gelées",
       "Fromage à pâte dure",
       "Eau, thé/café sans lait, boissons claires non rouges"
      ],
      "ko": [
       "Fruits/légumes, peaux, pépins",
       "Céréales complètes, légumineuses",
       "Graines, oléagineux",
       "Laitages en grande quantité",
       "Aliments/boissons <strong>rouges ou violets</strong>"
      ]
     },
     {
      "k": "courses",
      "text": "Pain/riz/pâtes blancs, jambon/poisson maigre, œufs, bouillons, gelées non rouges, boissons claires ; <strong>la préparation prescrite</strong>."
     },
     {
      "k": "deplacement",
      "text": "Difficile la veille (rester près des toilettes) ; anticiper la journée."
     },
     {
      "k": "pieges",
      "text": "Manger des fibres « par habitude » les derniers jours ; boire <strong>rouge/violet</strong> ; mal respecter les <strong>horaires</strong> de la préparation."
     },
     {
      "k": "retenir",
      "text": "Le respect de ce régime <strong>conditionne la réussite</strong> de l'examen ; un côlon mal préparé peut obliger à <strong>recommencer</strong>."
     }
    ]
   }
  ]
 }
];
