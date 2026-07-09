// Données structurées des notes d'information / consentement — Endoscopie digestive, CHU de Montpellier.
// Encodage des lignes de corps :
//   "p:..."  paragraphe   |  "-:..." puce   |  "--:..." sous-puce   |  "n:..." étape numérotée
// Section : { h:"titre", tone:"", body:[...] }  — tone: "" | "danger" | "info" | "warn"
// La mise en <strong> de quelques mots-clés est faite directement dans le texte.

export const PRATICIEN = {
  nom: "Dr Antoine DEBOURDEAU",
  specialite: "Hépato-Gastroentérologie",
  adresse: "80, avenue Augustin Fliche — 34295 Montpellier Cedex 5",
};

// Coordonnées par service. Chaque document porte une clé `service` (défaut "endoscopie").
export const SERVICES = {
  endoscopie: {
    nom: "Endoscopie digestive",
    tel: "04 67 33 70 67",
    mail: "endoscopie.ste@chu-montpellier.fr",
    urgence: "04 67 33 70 65",
  },
  explo: {
    nom: "Explorations fonctionnelles digestives",
    tel: "04 67 33 29 53",
    mail: "explo-dig-ad@chu-montpellier.fr",
    urgence: null,
  },
};

export const DOCS = {
  armb: {
    geste: "Note d'information & consentement",
    title: "Mucosectomies œsophagiennes élastiques à visée antireflux",
    lead: "La mucosectomie œsophagienne élastique à visée antireflux est un geste endoscopique visant à retirer, par morceaux, de petites zones de muqueuse œsophagienne situées juste au-dessus de la jonction œso-gastrique. L'objectif est de provoquer une fibrose cicatricielle localisée afin de renforcer la barrière anti-reflux et de diminuer les remontées acides.",
    sections: [
      { h: "Pour qui ?", body: [
        "p:Ce traitement s'adresse à certains patients présentant un reflux gastro-œsophagien (RGO) persistant malgré un traitement médical bien conduit, lorsque les explorations montrent un dysfonctionnement du sphincter inférieur de l'œsophage, sans indication chirurgicale immédiate.",
      ]},
      { h: "Principe et bénéfices attendus", body: [
        "-:Création d'une cicatrisation contrôlée qui « resserre » la jonction œso-gastrique.",
        "-:Diminution de l'exposition acide dans l'œsophage.",
        "-:Réduction des symptômes typiques (pyrosis, régurgitations).",
        "-:Diminution éventuelle de la dépendance aux inhibiteurs de la pompe à protons (IPP), selon l'évaluation ultérieure.",
        "p:Ce geste n'est pas un traitement curatif universel du RGO et peut ne pas suffire chez certains patients.",
      ]},
      { h: "Organisation et anesthésie", body: [
        "p:L'acte a lieu en salle d'endoscopie, sous <strong>anesthésie générale</strong> ou sédation profonde, en présence d'un anesthésiste. Une <strong>consultation d'anesthésie préalable est indispensable</strong>. Selon votre état général, l'acte peut se dérouler en hôpital de jour ou nécessiter une courte hospitalisation.",
      ]},
      { h: "Déroulement du geste", tone: "steps", body: [
        "n:Un endoscope souple est introduit par la bouche.",
        "n:De petites zones de muqueuse sont aspirées dans un capuchon et retirées par anse diathermique.",
        "n:Plusieurs zones sont retirées lors de la même séance, symétriquement, à 1–2 cm au-dessus de la jonction.",
        "n:Un contrôle endoscopique est réalisé en fin de geste pour vérifier l'absence de complication.",
      ]},
      { h: "Suites habituelles", body: [
        "-:Douleurs ou brûlures rétro-sternales modérées et transitoires les jours suivants.",
        "-:Alimentation adaptée : liquides puis textures molles pendant 24–48 h selon la tolérance.",
        "-:Poursuite temporaire ou réadaptation du traitement anti-acide.",
        "-:Consultation de contrôle et, le cas échéant, explorations fonctionnelles programmées.",
      ]},
      { h: "Risques et complications possibles", body: [
        "p:Bien que rares, des complications peuvent survenir :",
        "-:Douleur thoracique ou gêne à la déglutition (fréquente, transitoire).",
        "-:Hémorragie (rare, habituellement contrôlée par endoscopie).",
        "-:Ulcérations œsophagiennes étendues nécessitant un IPP intensifié.",
        "-:Sténose œsophagienne (rare ; peut nécessiter une ou plusieurs dilatations).",
        "-:Perforation œsophagienne (exceptionnelle, mais potentiellement grave : traitement endoscopique, drainage ou chirurgie).",
        "-:Complications liées à l'anesthésie (inhalation, réactions médicamenteuses).",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Une consultation médicale rapide est nécessaire en cas de <strong>douleurs thoraciques persistantes</strong>, fièvre, difficultés respiratoires, vomissements répétés, impossibilité de s'alimenter ou aggravation de la déglutition.",
      ]},
      { h: "Alternatives thérapeutiques", body: [
        "-:Poursuite / optimisation du traitement médical (IPP, mesures hygiéno-diététiques).",
        "-:Traitements endoscopiques alternatifs du reflux (selon indications).",
        "-:Chirurgie antireflux (fundoplicature) dans certaines situations.",
        "-:Absence de geste si le bénéfice attendu n'est pas démontré.",
      ]},
    ],
    consent: {
      intro: "Je reconnais que :",
      lines: [
        "le mécanisme et les objectifs du geste m'ont été expliqués ;",
        "j'ai été informé(e) des bénéfices attendus et des incertitudes thérapeutiques ;",
        "les risques potentiels et les alternatives m'ont été présentés ;",
        "je sais qu'une prise en charge complémentaire peut être nécessaire.",
      ],
      accept: "J'autorise l'équipe médicale à réaliser la mucosectomie œsophagienne élastique et tout geste complémentaire jugé nécessaire à ma sécurité.",
    },
  },

  ampullectomie: {
    geste: "Note d'information & consentement",
    title: "Ampullectomie endoscopique avec prothèse pancréatique prophylactique",
    lead: "L'ampullectomie endoscopique consiste à retirer, au moyen d'un endoscope, une lésion située au niveau de l'ampoule de Vater (région où arrivent le canal biliaire principal et le canal pancréatique). Elle est indiquée principalement pour le traitement de tumeurs bénignes ou pré-cancéreuses de l'ampoule (adénomes ampullaires), confirmées par biopsies.",
    sections: [
      { h: "Évaluation préalable obligatoire", body: [
        "p:Avant de proposer une ampullectomie, un bilan complet est nécessaire pour :",
        "-:confirmer le caractère résécable de la lésion ;",
        "-:éliminer une infiltration cancéreuse profonde ;",
        "-:analyser l'anatomie des canaux biliaire et pancréatique ;",
        "-:préciser le risque opératoire individuel.",
        "p:Ce bilan comprend généralement une <strong>échoendoscopie (EUS)</strong> pour vérifier l'absence d'invasion qui contre-indiquerait la résection endoscopique.",
      ]},
      { h: "Principe du geste", tone: "steps", body: [
        "n:Un endoscope est introduit par la bouche jusqu'au duodénum.",
        "n:Après repérage, une anse diathermique permet l'exérèse en un bloc ou par fragments.",
        "n:Une prothèse pancréatique temporaire (stent) est mise en place pour prévenir la pancréatite aiguë.",
        "n:Une surveillance ultérieure vérifie la chute spontanée ou procède au retrait de la prothèse.",
      ]},
      { h: "Anesthésie et hospitalisation", body: [
        "p:L'examen se déroule sous <strong>anesthésie générale</strong>, en présence d'un anesthésiste-réanimateur. Une <strong>hospitalisation</strong> est nécessaire, initialement en unité de surveillance ; une sortie peut être envisagée dans les 24–72 heures selon l'évolution.",
      ]},
      { h: "Bénéfices attendus", body: [
        "-:Traitement minimalement invasif d'une lésion ampullaire bénigne ou précancéreuse.",
        "-:Évite une chirurgie majeure lorsque les critères sont respectés.",
        "-:Contrôle endoscopique ultérieur et gestes complémentaires possibles en cas de résidu.",
      ]},
      { h: "Risques et complications possibles", body: [
        "p:Geste spécialisé, comportant des complications plus fréquentes que les endoscopies standards :",
        "-:<strong>Pancréatite aiguë</strong> post-procédure — la plus fréquente (5–20 %) ; la prothèse pancréatique réduit ce risque sans l'annuler.",
        "-:<strong>Hémorragie</strong> — immédiate ou secondaire, souvent contrôlable en endoscopie ; rarement embolisation ou chirurgie.",
        "-:<strong>Perforation duodénale</strong> — rare mais grave ; fermeture endoscopique, parfois chirurgie d'urgence.",
        "-:<strong>Sténose biliaire</strong> ou obstruction du cholédoque — prothèse biliaire temporaire possible.",
        "-:Migration, occlusion ou persistance de la prothèse pancréatique — retrait programmé possible.",
        "-:Infection (angiocholite, infection pancréatique) — antibioprophylaxie selon le terrain.",
        "-:Complications liées à l'anesthésie.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Consultation en urgence en cas de <strong>fièvre, douleurs abdominales croissantes, vomissements répétés, ictère, impossibilité de s'alimenter, rectorragies ou selles noires</strong>.",
      ]},
      { h: "Suivi et prises en charge ultérieures", body: [
        "-:Surveillance clinique pendant l'hospitalisation, antalgiques et réhydratation au besoin.",
        "-:Contrôle endoscopique à 1–3 mois (absence de résidu, situation du stent).",
        "-:Gestes complémentaires possibles (coagulation, résection secondaire).",
        "-:Surveillance prolongée au long cours (récidives possibles).",
      ]},
      { h: "Alternatives thérapeutiques", body: [
        "-:Surveillance simple si lésion très limitée et non dysplasique.",
        "-:Dissection sous-muqueuse endoscopique (ESD) en centre expert selon le type lésionnel.",
        "-:Chirurgie (duodéno-pancréatectomie céphalique) en cas de risque tumoral élevé.",
        "-:Abstention si le rapport bénéfice/risque est défavorable.",
      ]},
    ],
    consent: {
      intro: "Je confirme que :",
      lines: [
        "l'indication et les objectifs du geste m'ont été présentés ;",
        "j'ai été informé(e) du bilan préalable nécessaire et de ses implications ;",
        "les bénéfices et les risques potentiels m'ont été expliqués ;",
        "les alternatives ont été discutées.",
      ],
      accept: "J'autorise l'équipe médicale à réaliser l'ampullectomie endoscopique avec mise en place d'une prothèse pancréatique prophylactique, ainsi que tout geste nécessaire à ma sécurité.",
    },
  },

  colo_muco: {
    geste: "Note d'information & consentement",
    title: "Coloscopie avec mucosectomie",
    illus: { imgs: ["img/muco2.jpeg", "img/muco1.jpeg"], cap: "Mucosectomie : la lésion est d'abord soulevée par une injection sous-muqueuse, puis réséquée." },
    lead: "Ce document vous informe sur la coloscopie et sur l'ablation endoscopique de polypes par mucosectomie, telle qu'elle peut vous être proposée dans notre structure.",
    sections: [
      { h: "Pourquoi réaliser une coloscopie ?", body: [
        "p:La coloscopie permet d'examiner l'intérieur du côlon à l'aide d'un tube souple introduit par l'anus. Elle recherche des polypes, explique des symptômes digestifs, ou prévient le cancer colorectal par le dépistage et le retrait des lésions précancéreuses. Ne pas réaliser l'examen peut <strong>retarder un diagnostic important</strong>.",
      ]},
      { h: "Préparation nécessaire", body: [
        "p:Une <strong>préparation colique parfaite</strong> est indispensable à une visualisation optimale et à un traitement en sécurité.",
        "-:Régime sans résidu pendant 2 jours avant l'examen.",
        "-:Prise fractionnée de la préparation laxative, la veille et le jour du geste, selon les consignes remises.",
        "p:Une préparation insuffisante peut contraindre l'équipe à interrompre et reprogrammer l'examen.",
      ]},
      { h: "Hospitalisation et anesthésie", body: [
        "p:L'examen est habituellement réalisé sous <strong>anesthésie générale</strong>, en hospitalisation de jour, ou en hospitalisation conventionnelle si une surveillance accrue est nécessaire (âge avancé, comorbidités, geste étendu). Une <strong>consultation d'anesthésie est obligatoire</strong>. L'anesthésiste peut proposer de reporter la coloscopie au bloc opératoire pour un environnement plus sécurisé.",
      ]},
      { h: "Qu'est-ce qu'une mucosectomie ?", body: [
        "p:Les polypes sont souvent bénins, mais certains peuvent évoluer vers un cancer ; leur ablation réduit ce risque. La mucosectomie retire un polype :",
        "-:à l'aide d'une anse diathermique lorsqu'il est pédiculé ;",
        "-:ou après injection de liquide sous la lésion pour la soulever, puis section en sécurité.",
        "p:Les fragments sont recueillis et analysés au microscope. La technique est indiquée quand la taille et la localisation permettent une résection sûre, évitant une chirurgie.",
      ]},
      { h: "Déroulement du geste", tone: "steps", body: [
        "n:Introduction de l'endoscope par voie naturelle.",
        "n:Insufflation d'air ou de CO₂ (ballonnements possibles après l'examen).",
        "n:Réalisation éventuelle de biopsies.",
        "n:Ablation du polype si nécessaire.",
        "n:Mise en place de clips hémostatiques si besoin.",
      ]},
      { h: "Risques et complications possibles", body: [
        "p:Toute coloscopie présente un risque faible mais réel :",
        "-:<strong>Brèche de la paroi</strong> (≈ 0,04 % en diagnostic, ≈ 0,08 % lors d'une ablation) — souvent réparable par endoscopie ; exceptionnellement chirurgie.",
        "-:<strong>Hémorragie</strong> (≈ 0,26 %, jusqu'à 0,98 % après ablation) — immédiate ou retardée (J5–J10), parfois favorisée par les anticoagulants ; peut nécessiter clips, transfusion ou geste endoscopique.",
        "-:Plus rarement : hématome ou lésion splénique.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Toute <strong>fièvre, douleur abdominale importante, selles noires ou sang rouge</strong> doit conduire à contacter immédiatement l'équipe médicale ou les urgences.",
      ]},
      { h: "Après le geste", body: [
        "p:Selon la taille et l'analyse du polype, une surveillance endoscopique peut être nécessaire : d'autres lésions peuvent survenir et de petites lésions peuvent être méconnues en cas de préparation imparfaite.",
      ]},
    ],
    consent: {
      intro: "J'atteste avoir reçu une information complète et compréhensible concernant :",
      lines: [
        "la coloscopie et la mucosectomie éventuelle ;",
        "l'intérêt du dépistage et du traitement ;",
        "les modalités d'anesthésie et les possibilités d'hospitalisation et de surveillance ;",
        "les risques potentiels décrits ci-dessus ;",
        "l'importance d'une préparation colique parfaite et du régime sans résidu ;",
        "la possibilité que l'intervention soit reprogrammée ou réalisée au bloc opératoire selon mon état de santé.",
      ],
      accept: "J'ai pu poser toutes mes questions au médecin et j'accepte la réalisation de cet examen.",
    },
  },

  dilatation: {
    geste: "Note d'information & consentement",
    title: "Dilatation œsophagienne endoscopique",
    illus: { imgs: ["img/dilat_bougie.jpg", "img/dilat_ballon.jpg"], cap: "Deux techniques de dilatation : par bougies de diamètre croissant sur fil-guide (à gauche), ou par ballon gonflé au niveau du rétrécissement (à droite)." },
    lead: "La dilatation œsophagienne endoscopique traite un rétrécissement de l'œsophage (sténose) responsable d'une dysphagie (gêne à avaler). La zone rétrécie est agrandie au moyen d'un ballon gonflable ou de bougies introduits par un endoscope souple, pour faciliter le passage des aliments et améliorer le confort alimentaire.",
    sections: [
      { h: "Lieu et anesthésie", body: [
        "p:Le geste se déroule au plateau technique d'endoscopie, le plus souvent sous <strong>sédation profonde ou anesthésie générale</strong>, en présence d'un anesthésiste-réanimateur. Une <strong>consultation d'anesthésie est nécessaire</strong>. L'acte peut être réalisé en hôpital de jour ou nécessiter une hospitalisation conventionnelle.",
      ]},
      { h: "Déroulement du geste", body: [
        "p:Un endoscope souple est introduit par la bouche jusqu'à l'œsophage. Après repérage de la sténose, la zone rétrécie est dilatée progressivement :",
        "-:soit par passage de bougies de diamètre croissant ;",
        "-:soit par gonflage contrôlé d'un ballon.",
        "p:Plusieurs séances sont souvent nécessaires pour un résultat durable.",
      ]},
      { h: "Bénéfices attendus", body: [
        "-:Diminution de la dysphagie.",
        "-:Facilitation du passage des liquides et des solides.",
        "-:Réduction du risque d'impaction alimentaire.",
      ]},
      { h: "Préparation à respecter", tone: "info", body: [
        "-:Être à jeun : solides arrêtés depuis au moins <strong>6 h</strong>, liquides clairs depuis <strong>3 h</strong> avant l'anesthésie.",
        "-:Signaler tout traitement anticoagulant, antiagrégant ou trouble de la coagulation (arrêt temporaire parfois nécessaire).",
      ]},
      { h: "Risques et complications possibles", body: [
        "-:Douleurs ou gêne thoracique après le geste (fréquentes, transitoires).",
        "-:Saignement (rare, habituellement contrôlé par endoscopie).",
        "-:Perforation œsophagienne (rare mais potentiellement grave : drainage ou chirurgie).",
        "-:Complications respiratoires ou inhalation liées à l'anesthésie (rares).",
        "-:Infection (rare, antibioprophylaxie non systématique).",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Consultez en urgence en cas de <strong>douleurs thoraciques persistantes, fièvre, difficultés respiratoires, vomissements répétés ou aggravation de la dysphagie</strong>.",
      ]},
      { h: "Suites habituelles", body: [
        "-:Surveillance en salle de réveil.",
        "-:Reprise alimentaire progressive : liquides puis aliments mous pendant 24–48 h.",
        "-:Antalgiques si nécessaire.",
        "-:Une nouvelle séance de dilatation peut être proposée selon l'évolution.",
      ]},
      { h: "Alternatives éventuelles", body: [
        "-:Traitement médical d'un reflux ou d'une inflammation.",
        "-:Mise en place d'une prothèse œsophagienne (stent).",
        "-:Chirurgie dans certaines situations particulières.",
      ]},
    ],
    consent: {
      intro: "Je reconnais avoir reçu une information sur :",
      lines: [
        "le but du geste ;",
        "ses modalités et bénéfices attendus ;",
        "l'éventualité de plusieurs séances ;",
        "les risques potentiels.",
      ],
      accept: "J'autorise l'équipe médicale à réaliser la dilatation œsophagienne endoscopique ainsi que tout geste complémentaire nécessaire à ma sécurité.",
    },
  },

  dsm_colique: {
    geste: "Note d'information patient",
    title: "Dissection sous-muqueuse colique (ESD colique)",
    illus: { imgs: ["img/esd1.jpeg", "img/esd2.jpeg", "img/esd3.jpeg"], cap: "Étapes de l'ESD : repérage de la lésion, injection qui la soulève, puis dissection pour l'enlever en un seul bloc." },
    lead: null,
    sections: [
      { h: "Pourquoi cette intervention vous est-elle proposée ?", body: [
        "p:Votre gastroentérologue vous propose une dissection sous-muqueuse colique (ESD) afin d'enlever une lésion du côlon présentant un risque de transformation en cancer, ou comportant déjà des foyers de dégénérescence, tout en restant limitée aux couches superficielles de la paroi.",
        "p:L'objectif est d'ôter la lésion <strong>en un seul morceau</strong> (résection en bloc) avec des marges saines, afin :",
        "-:d'éviter une évolution vers un cancer invasif ;",
        "-:de diminuer le risque de récidive locale ;",
        "-:d'éviter une chirurgie colique lorsque c'est possible.",
        "p:Cette technique est réalisée dans des centres experts par des opérateurs entraînés.",
      ]},
      { h: "En quoi consiste l'intervention ?", tone: "steps", body: [
        "n:Analyse de la lésion et confirmation de la faisabilité de l'ESD.",
        "n:Délimitation de la lésion par de petits points de coagulation.",
        "n:Injection sous-muqueuse d'un liquide stérile pour soulever la lésion.",
        "n:Incision périphérique puis dissection progressive à l'aide d'un bistouri endoscopique très fin.",
        "n:Contrôle hémostatique et fermeture par clips si nécessaire.",
        "p:Réalisée sous <strong>anesthésie générale</strong>, par coloscopie. La pièce est envoyée en anatomopathologie. Durée : de 30 minutes à plusieurs heures selon la lésion.",
      ]},
      { h: "Comment vous préparer ?", tone: "info", body: [
        "p:Une <strong>préparation colique parfaite</strong> est indispensable ; la prescription remise doit être suivie scrupuleusement, sans quoi la procédure pourrait être prolongée, moins sûre, voire annulée.",
        "-:Consultation d'anesthésie obligatoire, au minimum 48 h avant.",
        "-:À jeun : pas de solides 6 h avant, pas de liquides 2–3 h avant (sauf instructions).",
        "-:Signaler tous vos antécédents et traitements : antiagrégants, anticoagulants, antidiabétiques, traitements modifiés par la préparation (ex. pilule).",
        "p:Selon la taille ou la localisation, une hospitalisation d'une nuit peut être recommandée.",
      ]},
      { h: "Quels sont les risques ?", body: [
        "p:Le risque global de complication est d'environ <strong>10 %</strong>, variable selon la lésion.",
        "-:<strong>Hémorragie</strong> — sang rouge ou noir dans les selles, pouvant nécessiter une nouvelle coloscopie ; risque persistant plusieurs jours.",
        "-:<strong>Brèche pariétale / perforation</strong> — fermeture endoscopique par clips souvent possible ; parfois hospitalisation prolongée, antibiotiques, exceptionnellement chirurgie.",
        "-:Douleurs abdominales, fièvre, modification du transit — à signaler immédiatement.",
        "-:Sténose colique (rare) après résection étendue — dilatation endoscopique possible.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>fièvre, douleurs abdominales, sang dans les selles ou difficulté d'exonération</strong>, contactez rapidement l'équipe médicale.",
      ]},
      { h: "Suites et surveillance", body: [
        "p:La cicatrisation complète nécessite 2 à 4 mois. Selon l'analyse : si la résection est complète, un contrôle endoscopique est réalisé à distance ; si elle est incomplète, un traitement complémentaire endoscopique ou chirurgical pourra être proposé.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la dissection sous-muqueuse colique, ses bénéfices, ses limites et ses risques",
    },
  },

  dsm_oeso_gastrique: {
    geste: "Note d'information patient",
    title: "Dissection sous-muqueuse œsophagienne ou gastrique (ESD)",
    illus: { imgs: ["img/esd1.jpeg", "img/esd2.jpeg", "img/esd3.jpeg"], cap: "Étapes de l'ESD : repérage de la lésion, injection qui la soulève, puis dissection pour l'enlever en un seul bloc." },
    lead: null,
    sections: [
      { h: "Pourquoi cette intervention vous est-elle proposée ?", body: [
        "p:Votre gastro-entérologue vous propose une dissection sous-muqueuse œsophagienne ou gastrique (ESD) afin d'enlever une lésion présentant un risque de transformation en cancer, ou comportant déjà des foyers de dégénérescence, tout en restant limitée aux couches superficielles.",
        "p:L'objectif est d'ôter la lésion <strong>en un seul morceau</strong> (résection en bloc) avec des marges saines, afin :",
        "-:d'éviter une évolution vers un cancer invasif ;",
        "-:de diminuer le risque de récidive locale ;",
        "-:d'éviter une chirurgie lourde lorsque c'est possible.",
        "p:Cette technique est réalisée dans des centres experts par des opérateurs entraînés.",
      ]},
      { h: "En quoi consiste l'intervention ?", tone: "steps", body: [
        "n:Analyse de la lésion et confirmation de la faisabilité de l'ESD.",
        "n:Délimitation de la lésion par de petits points de coagulation.",
        "n:Injection sous-muqueuse d'un liquide stérile pour soulever la lésion.",
        "n:Incision périphérique puis dissection progressive à l'aide d'un bistouri endoscopique très fin.",
        "n:Contrôle hémostatique et fermeture par clips si nécessaire.",
        "p:Réalisée sous <strong>anesthésie générale</strong>, par endoscopie digestive haute. La pièce est envoyée en anatomopathologie. Durée : de 30 minutes à plusieurs heures.",
      ]},
      { h: "Comment vous préparer ?", tone: "info", body: [
        "p:Il est indispensable d'être <strong>strictement à jeun</strong>.",
        "-:Consultation d'anesthésie obligatoire, au minimum 48 h avant.",
        "-:À jeun : pas de solides 6 h avant, pas de liquides 2–3 h avant (sauf instructions).",
        "-:Signaler antécédents et traitements : antiagrégants, anticoagulants, antidiabétiques, traitements modifiant la cicatrisation ou le risque hémorragique.",
        "p:Selon la lésion, une hospitalisation de 24 à 48 h peut être recommandée.",
      ]},
      { h: "Quels sont les risques ?", body: [
        "p:Le risque global de complication est d'environ <strong>10 %</strong>, selon la taille, la profondeur et la complexité.",
        "-:<strong>Hémorragie</strong> — pendant ou après, parfois retardée ; nouvelle endoscopie pour coagulation possible.",
        "-:<strong>Brèche pariétale / perforation</strong> — fermeture par clips le plus souvent ; parfois hospitalisation prolongée, antibiotiques, exceptionnellement chirurgie.",
        "-:Douleurs, fièvre, gêne à la déglutition ou douleurs épigastriques — à signaler immédiatement.",
        "-:<strong>Sténose œsophagienne</strong> (spécifique à l'ESD œsophagienne) après résection étendue — dilatations endoscopiques, plus rarement traitements complémentaires.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>douleurs thoraciques ou abdominales, fièvre, saignement digestif, vomissements ou difficultés à avaler</strong>, contactez rapidement l'équipe médicale.",
      ]},
      { h: "Suites et surveillance", body: [
        "p:La cicatrisation complète nécessite plusieurs semaines à quelques mois. Selon l'analyse : si la résection est complète, un contrôle endoscopique sera programmé à distance ; si elle est incomplète ou en cas de critères de gravité, un traitement complémentaire pourra être proposé. Une prise en charge de la douleur et une adaptation de l'alimentation pourront être nécessaires.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la dissection sous-muqueuse œsophagienne ou gastrique, ses bénéfices, ses limites et ses risques",
    },
  },

  gpoem: {
    geste: "Note d'information & consentement",
    title: "Myotomie endoscopique du pylore (G-POEM)",
    illus: { imgs: ["img/gpoem1.jpeg", "img/gpoem2.jpeg", "img/gpoem3.jpeg", "img/gpoem4.jpeg"], cap: "G-POEM : estomac et pylore, création d'un tunnel sous-muqueux, section du muscle pylorique (myotomie), puis fermeture par clips." },
    subtitle: "Dans le cadre d'une gastroparésie",
    lead: "Votre médecin vous propose une myotomie endoscopique du pylore (G-POEM). Ce document vous informe de manière claire et loyale sur votre maladie, le principe du traitement, ses bénéfices, ses risques, les alternatives et les modalités de suivi, afin de vous permettre de donner un consentement libre et éclairé.",
    sections: [
      { h: "Qu'est-ce que la gastroparésie ?", body: [
        "p:La gastroparésie est un <strong>retard de la vidange gastrique</strong> en l'absence d'obstacle mécanique. Elle peut provoquer nausées, vomissements, ballonnement post-prandial, satiété précoce, douleurs épigastriques, perte de poids et dénutrition. Les causes les plus fréquentes : diabète, certaines chirurgies, certaines maladies neurologiques, ou une cause idiopathique.",
      ]},
      { h: "Principe du traitement", body: [
        "p:Le pylore est un muscle circulaire situé à la sortie de l'estomac ; il peut être trop contracté et gêner l'évacuation. Le G-POEM consiste à réaliser une <strong>myotomie</strong> (section partielle) du pylore, par voie endoscopique et sans incision externe, afin d'améliorer la vidange gastrique et les symptômes.",
      ]},
      { h: "Comment se déroule l'intervention ?", tone: "steps", body: [
        "n:Geste réalisé sous anesthésie générale.",
        "n:Endoscope souple introduit par la bouche.",
        "n:Petite incision dans la paroi gastrique pour accéder à la couche musculaire.",
        "n:Section partielle du muscle pylorique.",
        "n:Fermeture de l'entrée par des clips endoscopiques.",
        "p:Durée moyenne : 45 à 90 minutes.",
      ]},
      { h: "Bénéfices attendus", body: [
        "-:Amélioration des symptômes digestifs et diminution des vomissements.",
        "-:Amélioration de la qualité de vie et de la vidange gastrique.",
        "p:Il n'existe pas de garantie de succès individuel : la réponse varie selon les patients et l'étiologie.",
      ]},
      { h: "Risques et complications possibles", body: [
        "p:Comme tout acte endoscopique interventionnel, le G-POEM comporte des risques, généralement peu fréquents :",
        "-:saignement ; perforation de la paroi digestive ;",
        "-:infection (médiastinite, péritonite) ;",
        "-:pneumopéritoine ou pneumomédiastin ;",
        "-:douleurs thoraco-abdominales ; reflux gastro-œsophagien secondaire ;",
        "-:échec technique ou clinique du traitement.",
        "p:Ces complications peuvent nécessiter un traitement médical, un geste endoscopique complémentaire, plus rarement une chirurgie.",
      ]},
      { h: "Alternatives thérapeutiques", body: [
        "-:Mesures diététiques spécifiques.",
        "-:Traitements médicamenteux prokinétiques.",
        "-:Injection de toxine botulique dans le pylore (effet souvent transitoire).",
        "-:Chirurgie (pyloroplastie).",
        "-:Nutrition entérale ou parentérale dans les formes sévères.",
      ]},
      { h: "Après l'intervention", body: [
        "-:Hospitalisation de courte durée (1 à 3 jours en moyenne).",
        "-:Reprise alimentaire progressive selon un protocole précis.",
        "-:Traitement anti-sécrétoire gastrique prescrit.",
        "-:Suivi clinique et éventuellement fonctionnel programmé.",
      ]},
      { h: "Vos droits", tone: "info", body: [
        "p:Vous pouvez poser toutes vos questions, demander des informations complémentaires, refuser ou interrompre la prise en charge, et <strong>retirer votre consentement à tout moment</strong> avant le geste.",
      ]},
    ],
    consent: {
      intro: "Je déclare avoir reçu une information orale et écrite claire concernant :",
      lines: [
        "ma maladie (gastroparésie) ;",
        "la myotomie endoscopique du pylore (G-POEM) ;",
        "ses bénéfices, risques, complications possibles et alternatives.",
      ],
      accept: "J'ai pu poser toutes les questions souhaitées et j'accepte librement la réalisation du geste de G-POEM tel qu'expliqué.",
      choix: true,
    },
  },

  poem: {
    geste: "Note d'information & consentement",
    title: "Myotomie endoscopique per-orale (POEM)",
    illus: { imgs: ["img/poem1.jpeg", "img/poem2.jpeg", "img/poem_myo.jpeg", "img/poem3.jpeg"], cap: "POEM : œsophage et sphincter inférieur, injection sous-muqueuse, création d'un tunnel puis section des fibres musculaires (myotomie)." },
    subtitle: "Dans le cadre d'une achalasie · protocole IPPOEM",
    lead: "Vous présentez une achalasie œsophagienne (trouble moteur associant une absence de relaxation du sphincter inférieur et des contractions désorganisées), responsable d'une gêne à la déglutition, parfois de régurgitations ou de douleurs thoraciques. La POEM consiste à sectionner par voie endoscopique les fibres musculaires responsables de cette hypertonie, pour rétablir un passage normal des aliments.",
    sections: [
      { h: "Principe de la procédure", tone: "steps", body: [
        "n:Une petite incision de la muqueuse est pratiquée.",
        "n:Un tunnel est créé dans la paroi de l'œsophage sous la muqueuse.",
        "n:Les fibres musculaires de l'œsophage et du sphincter inférieur sont sectionnées sur plusieurs centimètres.",
        "n:L'incision muqueuse est refermée par des clips métalliques (chute spontanée en quelques semaines).",
        "p:Par voie naturelle (sans incision cutanée), sous <strong>anesthésie générale</strong>, au cours d'une courte hospitalisation. Selon la décision anesthésique, au plateau technique d'endoscopie ou au bloc. Durée moyenne : environ une heure.",
      ]},
      { h: "Suites opératoires et hospitalisation", body: [
        "p:Récupération en général rapide, douleur post-opératoire limitée. Surveillance hospitalière de 24 à 48 h. Traitement antibiotique et antiacide prescrit. Reprise alimentaire par liquides le lendemain, puis alimentation molle 7 à 14 jours. Reprise d'activité possible rapidement, sauf contre-indication.",
      ]},
      { h: "Participation au protocole de recherche IPPOEM", tone: "info", body: [
        "p:Au CHU de Montpellier, cette intervention s'inscrit dans le protocole <strong>IPPOEM</strong> (« Investigation du reflux après POEM »), qui étudie la survenue éventuelle d'un reflux — parfois silencieux — après myotomie. Le suivi prévoit :",
        "-:une évaluation clinique et endoscopique à 6 mois et à 1 an ;",
        "-:des examens complémentaires (pH-métrie, endoscopie, questionnaires) ;",
        "-:un accompagnement personnalisé lors de l'hospitalisation.",
        "p:Votre consentement écrit sera recueilli avant inclusion ; vous pourrez retirer votre participation à tout moment, sans conséquence sur votre prise en charge. Le Dr Antoine Debourdeau viendra vous rencontrer le soir du geste.",
      ]},
      { h: "Risques et complications possibles", body: [
        "-:<strong>Infection du médiastin</strong> liée à une fuite digestive (< 1 %) — antibiotiques, endoscopie, voire chirurgie.",
        "-:<strong>Complications respiratoires</strong> (infection pulmonaire, pleurésie, pneumothorax : 1 à 2 %) — parfois drainage ou prolongation d'hospitalisation.",
        "-:<strong>Hémorragie</strong> du site opératoire — nouvelle endoscopie, voire transfusion.",
        "-:<strong>Reflux gastro-œsophagien</strong> — fréquent après POEM ; traitement antiacide prolongé et suivi IPPOEM.",
        "-:Plus rarement : douleurs thoraciques, fièvre, vomissements de sang ou selles noires.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>fièvre, douleur importante, vomissements sanglants ou malaise</strong> après le retour à domicile, contactez immédiatement l'équipe médicale ou présentez-vous au service d'urgences le plus proche.",
      ]},
      { h: "Bénéfices attendus", body: [
        "p:La POEM permet une amélioration durable des symptômes de dysphagie dans la grande majorité des cas (<strong>taux de succès > 90 %</strong>). Le protocole IPPOEM aide à prévenir les complications liées au reflux et à adapter votre suivi.",
      ]},
    ],
    consent: {
      lines: [
        "la nature et le but de la myotomie endoscopique ;",
        "les bénéfices attendus et les risques possibles ;",
        "les modalités de participation au protocole IPPOEM.",
      ],
      accept: "Le Dr Antoine Debourdeau m'a informé(e) qu'il réalisera lui-même la procédure. J'ai eu la possibilité de poser toutes les questions souhaitées.",
      mention: true,
    },
  },

  radiofrequence: {
    geste: "Note d'information & consentement",
    title: "Ablation par radiofréquence œsophagienne",
    illus: { imgs: ["img/radiofrequence.png"], cap: "Étapes de la radiofréquence : le cathéter applique une énergie thermique contrôlée sur la muqueuse anormale, qui cicatrise ensuite en muqueuse saine." },
    subtitle: "Œsophage de Barrett (endobrachyœsophage) avec dysplasie",
    lead: "L'œsophage de Barrett (endobrachyœsophage, EBO) est un état précancéreux résultant de la transformation de la muqueuse du bas œsophage sous l'effet du reflux gastro-œsophagien. Lorsque les biopsies montrent des anomalies cellulaires (dysplasie), un traitement peut être indiqué. Parmi les options (chirurgie, résection endoscopique, destruction), la radiofréquence présente l'un des rapports bénéfice/risque les plus favorables.",
    sections: [
      { h: "Efficacité attendue", tone: "info", body: [
        "p:Les données publiées de plus de 3 500 patients montrent que la radiofréquence permet une <strong>disparition complète de l'œsophage de Barrett dans ≈ 80 % des cas</strong> et une <strong>disparition complète de la dysplasie dans ≈ 90 % des cas</strong>.",
      ]},
      { h: "Principe de la radiofréquence", body: [
        "p:La radiofréquence applique, au cours d'une endoscopie, une <strong>énergie thermique contrôlée</strong> sur la muqueuse œsophagienne anormale. Cette énergie détruit la muqueuse dysplasique, qui est ensuite remplacée par une muqueuse saine. Le traitement nécessite le plus souvent <strong>plusieurs séances</strong> espacées de quelques semaines.",
      ]},
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun : pas de solides <strong>6 h</strong> avant, pas de liquides <strong>2 h</strong> avant (délai parfois allongé selon l'avis du gastro-entérologue).",
        "-:<strong>Poursuivez impérativement votre traitement antiacide</strong> (IPP : oméprazole, ésoméprazole, pantoprazole…) tel que prescrit : le reflux gêne l'examen et peut empêcher la radiofréquence.",
        "-:Consultation d'anesthésie obligatoire, au moins 48 h avant.",
      ]},
      { h: "Comment se déroule l'intervention ?", tone: "steps", body: [
        "n:Endoscopie digestive haute (gastroscope) par la bouche, sous <strong>anesthésie générale</strong>.",
        "n:Application de l'énergie de radiofréquence sur la muqueuse de Barrett.",
        "n:Durée moyenne ≈ 30 minutes ; le plus souvent en ambulatoire (entrée et sortie le jour même).",
        "p:Reprise d'une alimentation liquide en général dans les heures qui suivent ; réalimentation progressive selon les conseils de l'équipe. Une hospitalisation peut être indiquée pour surveillance ou en cas de complication.",
      ]},
      { h: "Complications possibles", body: [
        "p:Examen courant en centre expert ; complications rares (≈ 9 % des patients) :",
        "-:Douleurs thoraciques dans la semaine suivant le geste (surtout après la 1ʳᵉ séance).",
        "-:Gêne transitoire à la déglutition (régime mixé/mou possible quelques jours).",
        "-:<strong>Sténose œsophagienne</strong> lors de la cicatrisation — dilatations endoscopiques.",
        "-:<strong>Saignement digestif</strong> (≈ 1 %).",
        "-:<strong>Perforation œsophagienne</strong> (≈ 0,6 %) — intervention endoscopique ou chirurgicale urgente.",
      ]},
      { h: "Suivi après traitement", tone: "warn", body: [
        "p:Même après un traitement complet et efficace, un <strong>suivi endoscopique régulier à vie est indispensable</strong>, assuré par le gastro-entérologue référent, afin de dépister toute récidive ou nouvelle dysplasie. Le traitement IPP est poursuivi.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>douleurs thoraciques ou abdominales persistantes, vomissements de sang rouge ou selles noires, fièvre ou frissons</strong>, prévenez en urgence l'équipe. À défaut, votre médecin traitant, le service d'urgences le plus proche, ou le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "l'ablation par radiofréquence œsophagienne, ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  mucoduo: {
    geste: "Fiche d'information patient — conforme aux recommandations SFED",
    title: "Mucosectomie duodénale (EMR)",
    illus: { imgs: ["img/muco2.jpeg", "img/muco1.jpeg"], cap: "Mucosectomie : la lésion est d'abord soulevée par une injection sous-muqueuse, puis réséquée à l'anse." },
    lead: "Votre médecin vous propose une mucosectomie duodénale (résection muqueuse endoscopique, EMR) : le retrait par voie endoscopique, sans incision, d'une ou plusieurs lésions (polype, adénome, tumeur superficielle) situées à la surface du duodénum. Objectif double : retirer complètement la lésion pour éviter son évolution vers un cancer (ou traiter un stade très précoce) et l'analyser au microscope pour adapter la surveillance.",
    sections: [
      { h: "Comment se déroule l'examen ?", tone: "steps", body: [
        "n:Endoscope souple introduit par la bouche jusqu'au duodénum, repérage précis de la lésion.",
        "n:Injection de sérum sous la lésion pour la soulever.",
        "n:Résection à l'anse diathermique, en un ou plusieurs fragments.",
        "n:Sécurisation de la zone (clips, suture ou coagulation) pour prévenir saignement ou perforation.",
        "n:Prélèvements envoyés en anatomopathologie.",
        "p:Sous <strong>anesthésie générale</strong> ou sédation profonde, en hospitalisation de courte durée (1 à 3 nuits). Durée variable (30 min à plus de 2 h).",
      ]},
      { h: "Quels sont les risques ?", body: [
        "p:Geste techniquement plus à risque que la mucosectomie colique ou gastrique (finesse de la paroi duodénale, proximité des voies biliaires, du pancréas et des vaisseaux).",
        "-:<strong>Hémorragie</strong> (≈ 10 à 15 %) — souvent contrôlée par endoscopie ; exceptionnellement transfusion, radiologie interventionnelle ou chirurgie.",
        "-:<strong>Perforation</strong> (≈ 1 à 3 %) — clips, suture endoscopique, plus rarement chirurgie en urgence.",
        "-:Pancréatite aiguë : rare, liée à la proximité de la papille.",
        "-:Sténose duodénale tardive après résection étendue — dilatations possibles.",
        "-:Résection incomplète ou récidive — 2ᵉ endoscopie de contrôle quasi systématique (3–6 mois).",
        "-:Échec de résection endoscopique — recours secondaire à la chirurgie possible.",
        "p:Le décès est une complication exceptionnelle mais ne peut être totalement exclu, notamment en cas de perforation grave ou de comorbidités sévères.",
      ]},
      { h: "Quelles alternatives ?", body: [
        "-:Abstention et surveillance : inadaptée en cas de lésion à potentiel évolutif.",
        "-:Chirurgie (duodénectomie, duodéno-pancréatectomie céphalique) : lourde, réservée aux lésions inaccessibles ou en cas d'échec.",
        "-:Dissection sous-muqueuse endoscopique (ESD) : discutée au cas par cas en RCP.",
      ]},
      { h: "Préparation avant l'examen", tone: "info", body: [
        "-:Jeûne strict d'au moins 6 h (solides) et 2 h (liquides clairs).",
        "-:Anticoagulants / antiagrégants : gestion précisée par votre médecin (arrêt parfois nécessaire plusieurs jours avant).",
        "-:Consultation d'anesthésie obligatoire.",
        "-:Apportez dossier médical, examens antérieurs et liste de traitements.",
      ]},
      { h: "Après l'examen", body: [
        "-:Surveillance hospitalière de 24 à 72 h selon le geste.",
        "-:Reprise alimentaire progressive (liquide puis mixée).",
        "-:Traitement antisécrétoire (IPP) plusieurs semaines.",
        "-:Repos relatif 7 à 15 jours ; éviction des efforts intenses, des vols longs et des anticoagulants selon avis.",
        "-:Résultats anatomopathologiques en consultation de suivi (2 à 4 semaines) ; endoscopie de contrôle à 3–6 mois.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Consultez en urgence en cas de <strong>douleurs abdominales intenses ou persistantes, vomissements (surtout de sang), méléna (selles noires) ou rectorragies, fièvre, ou malaise</strong>.",
      ]},
    ],
    consent: {
      accept: "Cette information m'est délivrée pour prendre ma décision de manière éclairée. J'ai lu et compris cette information, j'ai pu poser toutes mes questions et j'accepte la réalisation de l'examen.",
    },
  },

  zenker: {
    geste: "Note d'information & consentement",
    title: "Traitement endoscopique du diverticule de Zenker",
    illus: { imgs: ["img/zenker.png"], cap: "Par voie orale, l'endoscope sectionne le muscle cricopharyngé (le septum) qui sépare le diverticule de l'œsophage." },
    lead: "Un diverticule de Zenker est une petite poche située à la jonction entre le pharynx et l'œsophage, responsable de troubles de déglutition, régurgitations ou fausses routes. Le traitement proposé est une myotomie endoscopique du muscle cricopharyngé, réalisée par voie naturelle, sans cicatrice externe.",
    sections: [
      { h: "Principe de l'intervention", body: [
        "p:L'intervention vise à <strong>sectionner le muscle cricopharyngé</strong> qui crée un obstacle au passage des aliments. Le geste est réalisé par endoscopie souple, par la bouche, sans incision cutanée ; l'endoscope est introduit avec des instruments permettant la myotomie.",
      ]},
      { h: "Modalités pratiques", tone: "info", body: [
        "-:<strong>Lieu :</strong> Unité d'endoscopie digestive — Hôpital Saint-Éloi.",
        "-:<strong>Anesthésie :</strong> anesthésie générale avec intubation trachéale.",
        "-:<strong>Consultation d'anesthésie préalable :</strong> obligatoire.",
        "-:<strong>Hospitalisation :</strong> 2 à 3 jours (surveillance, contrôle de la douleur, reprise progressive de l'alimentation).",
      ]},
      { h: "Suites habituelles", body: [
        "-:Une gêne ou douleur de gorge de type angine est fréquente, calmée par des antalgiques simples.",
        "-:L'alimentation est réintroduite progressivement, selon les consignes de l'équipe.",
      ]},
      { h: "Risques possibles (rares)", body: [
        "-:Infections médiastinales (médiastinite) — parfois antibiothérapie ou drainage.",
        "-:Saignements de la zone traitée — le plus souvent contrôlés par voie endoscopique.",
        "-:Exceptionnellement, une prise en charge chirurgicale ou une deuxième intervention.",
        "p:L'équipe experte en endoscopie interventionnelle de l'hôpital Saint-Éloi dispose du matériel et de l'expérience nécessaires à ce geste spécialisé.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la nature de l'intervention proposée (myotomie endoscopique du muscle cricopharyngé pour diverticule de Zenker), ses bénéfices attendus, ses modalités pratiques et ses risques potentiels, bien que rares",
      retrait: true,
      choix2: true,
      mention: true,
    },
  },

  cpre: {
    geste: "Note d'information & consentement",
    title: "Cholangio-pancréatographie rétrograde endoscopique (CPRE)",
    illus: { imgs: ["img/cpre.png"], cap: "Le duodénoscope atteint la papille ; voie biliaire (en vert) et pancréas (en jaune). Une endoprothèse peut y être posée." },
    lead: "La CPRE est une intervention endoscopique qui explore les canaux biliaires et/ou pancréatiques et permet de rétablir un écoulement normal de la bile ou des sucs pancréatiques vers le tube digestif. Elle est indiquée selon les résultats d'autres examens (prise de sang, scanner, IRM, échoendoscopie) : extraction de calculs, prélèvements, dilatation ou pose d'endoprothèse (stent) sur un rétrécissement tumoral ou inflammatoire.",
    sections: [
      { h: "Comment se déroule la CPRE ?", tone: "steps", body: [
        "n:Un duodénoscope souple est glissé par la bouche jusqu'au duodénum, en salle de radiologie.",
        "n:Temps diagnostique : un cathéter est introduit dans la papille pour injecter un produit de contraste et réaliser des radiographies.",
        "n:Le plus souvent, section du sphincter d'Oddi (sphinctérotomie) au bistouri électrique.",
        "n:Les calculs sont extraits par panier ou ballon, après fragmentation si besoin.",
        "n:Un rétrécissement peut être dilaté par ballonnet et traité par endoprothèse (stent) temporaire ou définitive.",
        "p:Réalisée sous <strong>anesthésie générale</strong>. L'examen recourt à une imagerie par rayons X, dont le bénéfice est très largement favorable. Une nouvelle séance est parfois nécessaire pour compléter le traitement. Habituellement en hospitalisation avec surveillance de 24 h.",
      ]},
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun strict (ni boire, ni manger, ni fumer) durant les <strong>6 heures</strong> précédant l'examen.",
        "-:L'anesthésiste et le gastro-entérologue peuvent demander d'interrompre certains médicaments fluidifiant le sang.",
      ]},
      { h: "Quelles complications peuvent survenir ?", body: [
        "p:Tout acte présente un risque de complication.",
        "-:<strong>Pancréatite aiguë</strong> (≈ 3–5 %) — un suppositoire d'anti-inflammatoire peut être proposé en prévention, selon les recommandations internationales.",
        "-:<strong>Infection des voies biliaires</strong> (≈ 1,4 %).",
        "-:<strong>Saignement</strong>, notamment après sphinctérotomie (≈ 1,3 %) — transfusion parfois nécessaire.",
        "-:<strong>Perforation</strong> du duodénum (≈ 0,6 %).",
        "-:Exceptionnellement : troubles cardio-vasculaires ou respiratoires liés à l'anesthésie.",
        "p:Ces complications peuvent prolonger l'hospitalisation et rendre une intervention nécessaire.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Contactez immédiatement l'équipe (numéro d'urgence 24 h/24) en cas de <strong>douleurs abdominales, jaunisse, sang rouge ou noir dans les selles, fièvre ou frissons</strong>. À défaut, votre médecin traitant ou le service d'urgences le plus proche.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la cholangio-pancréatographie rétrograde endoscopique (CPRE), ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  drainage_biliaire: {
    geste: "Note d'information & consentement",
    title: "Drainage biliaire extra-anatomique sous échoendoscopie",
    illus: { imgs: ["img/drainage_biliaire.jpeg"], cap: "Des endoprothèses rétablissent l'écoulement de la bile (en vert) au-delà de l'obstacle, vers le tube digestif." },
    lead: "En cas de rétrécissement des voies biliaires (tumoral ou inflammatoire), la bile peut être bloquée. Lorsque le drainage habituel par voie rétrograde n'est pas possible, la bile est dérivée par une autre voie, en général vers l'estomac (drainage « hépatico-gastrique ») ou le duodénum (« cholédoco-bulbaire »), grâce à une prothèse posée sous échoendoscopie.",
    sections: [
      { h: "Comment se déroule le drainage ?", tone: "steps", body: [
        "n:Un échoendoscope (endoscope muni d'une sonde d'échographie miniaturisée) est glissé par la bouche jusqu'à l'estomac ou le duodénum.",
        "n:La sonde d'échographie repère les voies biliaires dilatées.",
        "n:Un ou plusieurs instruments sont introduits pour poser une prothèse permettant à la bile de s'écouler dans l'estomac ou le duodénum.",
        "p:Réalisée sous <strong>anesthésie générale</strong>, dans une salle équipée de radiologie (imagerie par rayons X, au bénéfice très favorable). Une nouvelle procédure est parfois nécessaire. Habituellement en hospitalisation pour surveillance.",
      ]},
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun strict (ni boire, ni manger, ni fumer) durant les <strong>6 heures</strong> précédant l'examen — délai parfois allongé selon l'avis du médecin référent.",
      ]},
      { h: "Quelles complications peuvent survenir ?", body: [
        "p:Procédure dont les complications ne sont pas rares et peuvent mettre en jeu le pronostic vital :",
        "-:<strong>Plaie / brèche</strong> de l'estomac ou du duodénum — traitement endoscopique le plus souvent, parfois chirurgie.",
        "-:<strong>Hémorragie</strong> — parfois retardée, favorisée par les fluidifiants ; transfusion ou embolisation possibles.",
        "-:<strong>Angiocholite</strong> (infection de la bile) — antibiotiques IV, parfois nouveau drainage.",
        "-:<strong>Fuite biliaire</strong> (biliome, péritonite) — nouvelle intervention presque toujours nécessaire.",
        "-:<strong>Migration</strong> ou <strong>obstruction</strong> de la prothèse — récidive de l'obstruction ; nouveau drainage souvent nécessaire.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>douleurs abdominales, malaises, sang rouge ou selles noires, fièvre ou frissons</strong>, contactez immédiatement l'équipe médicale. À défaut, votre médecin traitant, le service d'urgences le plus proche, ou le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "le drainage biliaire extra-anatomique sous échoendoscopie, ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  drainage_pancreas: {
    geste: "Note d'information & consentement",
    title: "Drainage endoscopique d'une collection pancréatique",
    lead: "Une pancréatite aiguë peut entraîner la formation d'une collection (poche liquidienne pouvant contenir des débris de nécrose) au contact ou au sein du pancréas. Si cette collection augmente de taille ou s'infecte, elle doit être drainée. Le pancréas étant au contact de l'estomac, le drainage se fait le plus souvent à travers l'estomac, sous échoendoscopie.",
    sections: [
      { h: "Comment se déroule le drainage ?", tone: "steps", body: [
        "n:Un échoendoscope est glissé par la bouche jusqu'à l'estomac ou le duodénum.",
        "n:La sonde d'échographie repère la collection pancréatique.",
        "n:Une prothèse (plastique ou métal) est mise en place entre l'estomac et la collection pour la vider.",
        "p:Réalisée sous <strong>anesthésie générale</strong>, en salle de radiologie. La prothèse peut rester plusieurs semaines sans être ressentie. Une <strong>nécrosectomie</strong> (retrait des débris lors d'une nouvelle endoscopie) est parfois nécessaire. Hospitalisation pour surveillance, parfois en réanimation ou soins intensifs.",
      ]},
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun strict (ni boire, ni manger, ni fumer) durant les <strong>6 heures</strong> précédant l'examen — délai parfois allongé selon l'avis du médecin référent.",
      ]},
      { h: "Quelles complications peuvent survenir ?", body: [
        "p:Procédure dont les complications ne sont pas rares et peuvent mettre en jeu le pronostic vital :",
        "-:<strong>Infection</strong> de la collection — antibiotiques souvent proposés en prévention.",
        "-:<strong>Perforation</strong> de l'estomac ou du duodénum — traitement endoscopique ou chirurgical.",
        "-:<strong>Hémorragie</strong> — parfois retardée, favorisée par les fluidifiants ; transfusion, embolisation, rarement chirurgie.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>douleurs abdominales, sang rouge ou selles noires, fièvre ou frissons</strong>, contactez immédiatement l'équipe médicale. À défaut, votre médecin traitant, le service d'urgences le plus proche, ou le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "le drainage endoscopique d'une collection pancréatique, ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  ponction_echo: {
    geste: "Note d'information & consentement",
    title: "Ponction de kyste ou de masse pancréatique sous échoendoscopie",
    illus: { imgs: ["img/echo.png"], cap: "L'échoendoscope repère la lésion du pancréas ; une fine aiguille la ponctionne à travers la paroi digestive." },
    lead: "L'échoendoscopie combine échographie et endoscopie : une sonde d'échographie miniaturisée, à l'extrémité d'un endoscope, est amenée par la bouche dans l'estomac et le duodénum pour étudier les organes voisins (pancréas, foie, ganglions). Elle permet de ponctionner une lésion du pancréas — solide (tumeur) ou liquide (kyste) — afin d'en déterminer la nature et de décider du traitement dans les meilleures conditions.",
    sections: [
      { h: "Dans quelles situations ?", body: [
        "p:Une ponction est proposée principalement lorsqu'une <strong>image pancréatique anormale</strong> est découverte au scanner, à l'IRM ou à l'échographie ; parfois dans le cadre d'un dépistage chez des personnes à risque élevé de cancer du pancréas. L'échoendoscopie est la méthode la plus sûre et la plus efficace pour prélever le pancréas.",
      ]},
      { h: "Comment se déroule l'examen ?", tone: "steps", body: [
        "n:Un échoendoscope est amené par la bouche dans l'estomac et le duodénum.",
        "n:La sonde d'échographie repère précisément la lésion.",
        "n:Une aiguille fine, introduite dans l'endoscope, traverse la paroi digestive pour prélever tissu ou liquide.",
        "p:Dans certains cas : pince à biopsie ou étude microscopique de la paroi d'un kyste (endomicroscopie confocale). Réalisée le plus souvent sous <strong>anesthésie générale</strong>. Une hospitalisation de surveillance peut être demandée.",
      ]},
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun : solides <strong>6 h</strong> avant, liquides <strong>2–3 h</strong> avant ; ne pas fumer 6 h avant.",
        "-:Modification ou arrêt des traitements fluidifiant le sang, du diabète ou de l'hypertension selon les consignes.",
        "-:Interdiction de conduire pour le retour à domicile après anesthésie générale.",
      ]},
      { h: "Quelles complications peuvent survenir ?", body: [
        "p:Les complications de la ponction sous échoendoscopie sont <strong>très rares</strong> :",
        "-:saignement ; infection ;",
        "-:pancréatite ;",
        "-:perforation de la paroi du tube digestif.",
        "p:Elles peuvent justifier une hospitalisation ; une chirurgie ou des transfusions sont parfois nécessaires.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>fièvre, frissons, douleurs abdominales, vomissements de sang, selles avec du sang rouge ou noir</strong>, contactez immédiatement l'équipe médicale. À défaut, votre médecin traitant, le service d'urgences le plus proche, ou le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la ponction de kyste ou de masse pancréatique sous échoendoscopie, ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  gastroscopie: {
    geste: "Note d'information & consentement",
    title: "Gastroscopie (endoscopie œso-gastro-duodénale)",
    illus: { imgs: ["img/fogd.png"], cap: "L'endoscope souple explore l'œsophage, l'estomac puis le duodénum." },
    lead: "La gastroscopie permet d'explorer l'œsophage, l'estomac et le duodénum et de réaliser des prélèvements pour analyse au microscope. Elle aide votre médecin à établir un diagnostic devant vos symptômes.",
    sections: [
      { h: "Comment se déroule l'examen ?", tone: "steps", body: [
        "n:Vous êtes allongé(e) sur le côté gauche en salle d'endoscopie.",
        "n:Un endoscope souple (caméra + lumière) est introduit par la bouche (gastroscope) ou le nez (naso-gastroscope).",
        "n:L'appareil descend dans l'œsophage, l'estomac et le duodénum pour les explorer.",
        "n:Des prélèvements (biopsies) et parfois une ablation de polype peuvent être réalisés.",
        "p:Réalisée sous <strong>anesthésie locale</strong> (passage à travers un cale-dent, en déglutissant ; respiration libre) ou sous <strong>anesthésie générale</strong> (consultation d'anesthésie préalable). Un compte-rendu avec photos vous est remis.",
      ]},
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun : ne pas manger ni boire au moins <strong>6 h</strong> avant ; l'eau est autorisée jusqu'à <strong>2 h</strong> avant.",
        "-:Traitements fluidifiant le sang (anticoagulants, antiagrégants) : votre gastro-entérologue ou l'anesthésiste vous donnera des recommandations.",
      ]},
      { h: "Quelles complications peuvent survenir ?", body: [
        "p:Les complications de la gastroscopie sont <strong>exceptionnelles</strong>. Elles peuvent être liées à l'endoscopie et/ou à l'anesthésie générale :",
        "-:brèche de la paroi de l'œsophage, de l'estomac ou du duodénum en cas de geste thérapeutique (≈ 0,3 %) ;",
        "-:hémorragie ; troubles cardio-vasculaires et respiratoires.",
        "p:Elles surviennent le plus souvent pendant l'examen, parfois dans les jours suivants.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Devant tout symptôme anormal (<strong>douleur abdominale ou thoracique, vomissements de sang, fièvre, frissons</strong>), contactez immédiatement l'équipe médicale. À défaut, votre médecin traitant ou un service d'urgence.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la gastroscopie (endoscopie œso-gastro-duodénale), ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  manometrie: {
    geste: "Note d'information",
    title: "Manométrie œsophagienne haute résolution",
    service: "explo",
    noConsent: true,
    lead: "La manométrie œsophagienne évalue les variations de pression le long de l'œsophage lors de la déglutition. Elle est utile devant des blocages alimentaires, des douleurs thoraciques inexpliquées ou des régurgitations, dans le bilan de certaines maladies chroniques (neuromusculaires, sclérodermie), ou avant une chirurgie du reflux ou de l'obésité. Elle complète l'endoscopie œso-gastro-duodénale, qui doit la précéder.",
    sections: [
      { h: "Comment se passe l'examen ?", tone: "steps", body: [
        "n:Examen en <strong>ambulatoire</strong>, à jeun (sans manger 6 h avant), après arrêt des médicaments modifiant les contractions œsophagiennes. Durée : environ 15 minutes.",
        "n:Une sonde souple (4,2 mm), recouverte d'une gaine à usage unique, est introduite par une narine après anesthésie locale par pulvérisation, puis poussée jusqu'à l'estomac (le plus souvent assis).",
        "n:Une fois en place, l'enregistrement se poursuit couché puis éventuellement assis ; vous avalez une quinzaine de gorgées de 5 mL d'eau à intervalles réguliers.",
        "n:La sonde est retirée. L'examen est interprété par un médecin gastro-entérologue.",
        "p:Le passage du nez et de la gorge est parfois désagréable, mais non douloureux ; la sonde n'empêche pas de respirer normalement.",
      ]},
      { h: "Quels sont les risques ?", body: [
        "p:Les risques sont <strong>minimes</strong> : une réaction locale à l'anesthésiant, une irritation nasale ou pharyngée de courte durée et un saignement de nez sont possibles.",
      ]},
    ],
  },

  phmetrie: {
    geste: "Note d'information",
    title: "pH-métrie et pH-impédancemétrie œsophagienne",
    service: "explo",
    noConsent: true,
    lead: "La pH-métrie œsophagienne étudie les remontées acides dans l'œsophage liées au reflux gastro-œsophagien ; la pH-impédancemétrie étudie en plus les remontées non acides, liquides ou gazeuses. Ces examens permettent de prouver un reflux avant une chirurgie, ou lorsque le diagnostic est incertain (signes ORL, pneumologiques ou dentaires).",
    sections: [
      { h: "Comment se passe l'examen ?", tone: "steps", body: [
        "n:Examen en <strong>ambulatoire</strong>, à jeun depuis au moins 4 heures. Le traitement antiacide est le plus souvent arrêté 7 jours avant (sauf indication contraire de votre médecin).",
        "n:L'examen peut être précédé d'une manométrie pour localiser le sphincter inférieur de l'œsophage. Une anesthésie locale par xylocaïne peut être réalisée.",
        "n:Une sonde souple à usage unique (1,5–1,8 mm), munie de capteurs, est introduite par une narine jusqu'à l'œsophage (5 cm au-dessus du sphincter), puis reliée à un petit boîtier porté en bandoulière.",
        "n:L'enregistrement dure environ 24 h : faites 3 à 4 repas sans éviter les aliments déclenchant le reflux, et notez vos symptômes, heures de repas, de coucher et de lever.",
        "n:Le lendemain, la sonde est retirée en quelques minutes par une infirmière ; le boîtier et le recueil des symptômes sont analysés par un gastro-entérologue.",
      ]},
      { h: "Quels sont les risques ?", body: [
        "p:Les risques sont <strong>minimes</strong> : une réaction locale à l'anesthésiant (s'il est utilisé), une irritation nasale ou pharyngée de courte durée et un saignement de nez sont possibles.",
      ]},
    ],
  },

  dilatation_bougies: {
    geste: "Note d'information & consentement",
    title: "Dilatation endoscopique hydrostatique ou aux bougies",
    illus: { imgs: ["img/dilat_bougie.jpg", "img/dilat_ballon.jpg"], cap: "À gauche, dilatation par bougies de diamètre croissant guidées par un fil ; à droite, dilatation par ballon hydrostatique gonflé au niveau de la sténose." },
    lead: "La dilatation hydrostatique (à l'eau) ou aux bougies est un acte thérapeutique réalisé au cours d'une endoscopie, destiné à dilater un rétrécissement (« sténose ») du tube digestif. Selon sa localisation, la sténose peut gêner l'alimentation, provoquer des douleurs ou des difficultés à aller à la selle. Les causes possibles : reflux, ingestion de caustiques, radiothérapie, chirurgie, maladies inflammatoires.",
    sections: [
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun strict (ni boire, ni manger, ni fumer) pendant au moins <strong>6 h</strong> avant l'anesthésie.",
        "-:Dans certains cas, une préparation colique spécifique peut être prescrite par votre gastro-entérologue.",
      ]},
      { h: "Comment se déroule l'intervention ?", tone: "steps", body: [
        "n:Un endoscope souple est introduit par la bouche ou l'anus, le plus souvent sous <strong>anesthésie générale</strong>.",
        "n:L'endoscope est positionné en regard du rétrécissement ; un fil guide est passé au-delà, souvent avec l'aide de la radiologie.",
        "n:Dilatation par ballon hydrostatique gonflé à l'eau/produit de contraste, OU par passage successif de bougies de tailles croissantes.",
        "n:Aucun matériel ne reste dans le corps après l'examen.",
        "p:Plusieurs séances, à des diamètres différents, peuvent être nécessaires pour un calibrage satisfaisant. Un risque d'échec existe, pouvant conduire à répéter les séances voire à une prise en charge chirurgicale.",
      ]},
      { h: "Complications possibles", body: [
        "p:Les complications sont <strong>rares (< 1 %)</strong> :",
        "-:<strong>Perforation</strong> de la paroi digestive (≈ 0,5 %).",
        "-:Hémorragie ; infection.",
        "p:Certaines sont traitées lors de l'endoscopie, d'autres nécessitent une prise en charge chirurgicale et une hospitalisation. Le recours à l'imagerie par rayons X a un rapport bénéfice/risque très favorable.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>douleurs abdominales ou thoraciques, malaises, vomissements/selles avec sang rouge ou noir, fièvre ou frissons</strong>, contactez immédiatement l'équipe médicale. À défaut, votre médecin traitant, le service d'urgences le plus proche, ou le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la dilatation endoscopique hydrostatique ou aux bougies, ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  dilatation_pneumatique: {
    geste: "Note d'information & consentement",
    title: "Dilatation pneumatique",
    illus: { imgs: ["img/dilat_pneu.png"], cap: "Dilatation pneumatique : le ballon, gonflé à l'air au niveau du sphincter inférieur de l'œsophage, élargit progressivement la zone resserrée." },
    lead: "La dilatation pneumatique (à l'air) est un acte thérapeutique réalisé au cours d'une endoscopie œso-gastro-duodénale, habituellement sous contrôle radiologique, destiné à dilater le sphincter inférieur de l'œsophage ou le pylore (sortie de l'estomac). Elle est proposée en cas de troubles moteurs — achalasie du sphincter inférieur de l'œsophage, ou gastroparésie avec spasme du pylore — et dans de rares autres indications (suites de chirurgie bariatrique ou anti-reflux).",
    sections: [
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:À jeun strict (ni boire, ni manger, ni fumer) depuis au moins <strong>6 h</strong>.",
        "-:Dans certains cas, un régime liquide exclusif la veille peut être recommandé.",
      ]},
      { h: "Comment se déroule l'intervention ?", tone: "steps", body: [
        "n:Endoscope souple introduit par la bouche, sous <strong>anesthésie générale</strong>.",
        "n:Positionnement en regard de la zone à dilater (bas de l'œsophage ou pylore) ; passage d'un fil guide au-delà.",
        "n:Le ballon de dilatation pneumatique est avancé sous contrôle radiologique puis gonflé à l'air à l'aide d'un manomètre, en contrôlant la pression.",
        "n:Aucun matériel ne reste dans le corps après l'examen.",
        "p:Plusieurs séances peuvent être proposées ; en cas d'échec, répétition ou ballons de tailles différentes (30, 35 ou 40 mm). L'imagerie par rayons X a un rapport bénéfice/risque très favorable.",
      ]},
      { h: "Complications possibles", body: [
        "p:Les complications sont <strong>rares (< 1 %)</strong> :",
        "-:Perforation de la paroi digestive ; hémorragie ; infection.",
        "p:Certaines sont traitées lors de l'endoscopie, d'autres nécessitent une prise en charge chirurgicale et une hospitalisation.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:En cas de <strong>douleurs abdominales ou thoraciques, vomissements/selles avec sang rouge ou noir, fièvre ou frissons</strong>, contactez immédiatement l'équipe médicale. À défaut, votre médecin traitant, le service d'urgences le plus proche, ou le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la dilatation pneumatique, ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  capsule_grele: {
    geste: "Note d'information & consentement",
    title: "Vidéocapsule endoscopique de l'intestin grêle",
    illus: { imgs: ["img/vce.png"], cap: "La vidéocapsule, de la taille d'une grosse gélule, est avalée avec un verre d'eau." },
    lead: "La vidéocapsule endoscopique explore visuellement l'intestin grêle : vous avalez une capsule à usage unique, de la taille d'une grosse gélule, qui photographie la paroi de l'intestin, sans anesthésie générale. C'est l'examen de référence pour les maladies du grêle, prescrit lorsque la gastroscopie et la coloscopie n'ont pas expliqué vos symptômes (saignement, anémie, inflammation).",
    sections: [
      { h: "Comment se préparer ?", tone: "info", body: [
        "-:Interruption de tout traitement par <strong>fer oral</strong> 7 à 10 jours avant.",
        "-:Jeûne complet à partir de la veille au soir jusqu'à l'ingestion de la capsule.",
        "-:Une purge par voie orale (± anti-mousse) fait l'objet d'une ordonnance spécifique.",
        "-:Signalez vos traitements : leurs effets peuvent être modifiés par la préparation (y compris la pilule contraceptive).",
      ]},
      { h: "Comment se déroule l'examen ?", tone: "steps", body: [
        "n:Vérification de quelques informations à l'accueil, puis ingestion de la capsule avec un verre d'eau.",
        "n:Selon le modèle : pose de capteurs externes et port d'un boîtier d'enregistrement en ceinture/bandoulière (à garder au moins 8 h), ou capsule à récupérer dans un tamis aux toilettes.",
        "n:Activité physique (marche) recommandée pour favoriser la progression de la capsule.",
        "n:Reprise des boissons 2 h après, de l'alimentation 4 h après (sauf consigne particulière).",
        "p:La capsule est éliminée dans les selles sous 24 à 48 h. La réalisation d'une IRM est contre-indiquée tant que l'évacuation de la capsule n'est pas certaine.",
      ]},
      { h: "Complications possibles", body: [
        "p:Examen courant ; complications rares :",
        "-:<strong>Fausse route</strong> vers les voies aériennes à l'ingestion (exceptionnelle) — signalez toute difficulté de déglutition avant l'examen.",
        "-:<strong>Rétention</strong> de la capsule dans l'estomac ou le grêle — signalez diabète ancien, maladie inflammatoire, chirurgie digestive, radiothérapie, anti-inflammatoires. Une capsule « de calibrage » ou une imagerie peut être proposée au préalable.",
        "-:<strong>Blocage (impaction)</strong> sur un segment étroit, pouvant entraîner une occlusion — une chirurgie peut être indiquée en urgence.",
        "p:Signalez à votre médecin si vous avez vu la capsule dans vos selles après l'examen.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Devant tout symptôme anormal (<strong>douleur abdominale ou thoracique, vomissements de sang, fièvre, frissons, arrêt du transit</strong>), contactez immédiatement l'équipe médicale. À défaut, votre médecin traitant ou un service d'urgence.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la vidéocapsule endoscopique de l'intestin grêle, ses avantages et ses risques",
      accept: "J'ai bien compris l'importance du suivi ultérieur qui, selon le résultat de cet examen, pourra m'être conseillé.",
    },
  },

  ligature_varices: {
    geste: "Note d'information & consentement",
    title: "Ligature élastique des varices œsophagiennes",
    lead: "Les varices œsophagiennes sont des veines dilatées de la paroi de l'œsophage, le plus souvent liées à une maladie du foie (hypertension portale). Elles présentent un risque de saignement parfois grave. La ligature élastique consiste à aspirer chaque varice dans un capuchon fixé au bout de l'endoscope, puis à poser un petit anneau élastique à sa base : la varice, privée de sang, se nécrose et disparaît en quelques jours.",
    sections: [
      { h: "Un traitement en plusieurs séances", tone: "info", body: [
        "p:Dans la <strong>grande majorité des cas, la ligature se déroule en plusieurs séances</strong>, espacées de 2 à 4 semaines, jusqu'à disparition complète des varices (éradication). Plusieurs anneaux sont posés à chaque séance.",
        "p:Une fois les varices éradiquées, une <strong>surveillance endoscopique régulière</strong> reste nécessaire car elles peuvent réapparaître avec le temps.",
      ]},
      { h: "Pourquoi vous la proposer ?", body: [
        "-:Pour <strong>traiter un saignement</strong> de varice en cours (urgence), ou",
        "-:pour <strong>prévenir un premier saignement</strong> ou une récidive chez les patients à risque.",
        "p:Elle est le plus souvent associée à un <strong>traitement médicamenteux</strong> (bêtabloquant) et à la prise en charge de la maladie du foie.",
      ]},
      { h: "Comment se déroule le geste ?", tone: "steps", body: [
        "n:Le geste est réalisé sous <strong>anesthésie générale</strong> ou sédation, avec un anesthésiste ; une consultation d'anesthésie est réalisée au préalable.",
        "n:Un endoscope, muni d'un capuchon et d'un barillet d'anneaux, est introduit par la bouche jusqu'à l'œsophage.",
        "n:Chaque varice est aspirée dans le capuchon, puis un anneau élastique est largué à sa base.",
        "n:Plusieurs anneaux (souvent 3 à 6) sont posés au cours de la même séance.",
        "p:Vous devez être à jeun avant le geste (consignes remises séparément). Une courte hospitalisation de surveillance est habituelle.",
      ]},
      { h: "Suites habituelles", body: [
        "-:Gêne ou douleur derrière le sternum, gêne à la déglutition pendant quelques jours — calmées par des antalgiques.",
        "-:Alimentation adaptée (liquide puis molle) durant 24 à 48 h, selon les consignes de l'équipe.",
        "-:Les anneaux et la muqueuse traitée tombent spontanément et sont éliminés naturellement.",
      ]},
      { h: "Risques et complications possibles", body: [
        "p:La ligature est le traitement de référence, mais comporte des risques :",
        "-:<strong>Saignement</strong>, notamment par ulcération au niveau d'un anneau (surtout entre le 5ᵉ et le 10ᵉ jour) — parfois abondant.",
        "-:Douleur thoracique, gêne à avaler, fièvre transitoire.",
        "-:<strong>Sténose</strong> (rétrécissement) de l'œsophage, rare — pouvant nécessiter une dilatation.",
        "-:Plus rarement : ulcère œsophagien étendu, perforation (exceptionnelle), complications liées à l'anesthésie.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Contactez immédiatement le service (numéro d'urgence 24 h/24), ou consultez aux urgences, en cas de : <strong>vomissements de sang rouge ou noir, selles noires, douleur thoracique intense, difficulté à avaler ou à respirer, fièvre ou malaise</strong>. À défaut, appelez le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la ligature élastique des varices œsophagiennes, sa réalisation en plusieurs séances, ses bénéfices et ses risques",
      accept: "J'ai compris que ce traitement nécessite le plus souvent plusieurs séances et une surveillance endoscopique ultérieure, et j'ai bien compris l'importance du suivi qui pourra m'être conseillé.",
    },
    illus: { imgs: ["img/ligature.jpg"], cap: "Varices de l'œsophage (à gauche) ; chaque varice est aspirée dans le capuchon de l'endoscope et un anneau élastique est posé à sa base." },
  },

  coloscopie: {
    geste: "Note d'information & consentement",
    title: "Coloscopie",
    lead: "La coloscopie permet d'examiner l'intérieur du côlon (gros intestin) et du rectum à l'aide d'un tube souple muni d'une caméra (le coloscope), introduit par l'anus. Elle recherche l'origine de symptômes digestifs, dépiste et prévient le cancer colorectal, et permet de retirer des polypes. C'est l'examen de référence pour explorer le côlon.",
    sections: [
      { h: "Pourquoi réaliser une coloscopie ?", body: [
        "p:Elle est proposée pour explorer des symptômes (saignements, troubles du transit, anémie, douleurs), dans le cadre d'un <strong>dépistage</strong> du cancer colorectal, ou pour surveiller des lésions déjà connues. Ne pas réaliser l'examen peut <strong>retarder un diagnostic important</strong>.",
      ]},
      { h: "Découverte de polypes : ablation le plus souvent possible", tone: "info", body: [
        "p:Les polypes sont de petites excroissances de la paroi du côlon. La plupart sont bénins, mais certains peuvent évoluer vers un cancer avec le temps ; les retirer réduit ce risque.",
        "p:<strong>Si des polypes sont découverts, la majorité d'entre eux peuvent être retirés directement au cours de la même coloscopie</strong> (le plus souvent à l'anse), puis analysés au microscope. Certains polypes (taille, localisation ou aspect particuliers) ne peuvent pas être enlevés en toute sécurité lors de cet examen et nécessitent une prise en charge spécifique ultérieure.",
      ]},
      { h: "Préparation nécessaire", tone: "info", body: [
        "p:Une <strong>préparation colique parfaite</strong> est indispensable à un examen de qualité et à un traitement en sécurité.",
        "-:Régime sans résidu pendant les 2 jours précédant l'examen.",
        "-:Prise fractionnée de la préparation laxative, la veille et le matin du geste, selon les consignes remises.",
        "p:Une préparation insuffisante peut contraindre à interrompre et à reprogrammer l'examen.",
      ]},
      { h: "Anesthésie et hospitalisation", body: [
        "p:L'examen est habituellement réalisé sous <strong>anesthésie générale</strong> ou sédation, en hôpital de jour, avec un anesthésiste ; une <strong>consultation d'anesthésie est obligatoire</strong>. Une hospitalisation conventionnelle est parfois nécessaire (comorbidités, geste étendu).",
      ]},
      { h: "Comment se déroule le geste ?", tone: "steps", body: [
        "n:Introduction du coloscope par l'anus, progression dans le rectum puis tout le côlon.",
        "n:Insufflation de gaz (CO₂) pour déplisser la paroi — ballonnements possibles après l'examen.",
        "n:Réalisation éventuelle de biopsies et/ou ablation de polypes.",
        "n:Mise en place de clips hémostatiques si nécessaire.",
        "p:Un compte-rendu, avec photos, vous est remis ; les résultats d'analyse des polypes sont communiqués en consultation.",
      ]},
      { h: "Risques et complications possibles", body: [
        "p:La coloscopie présente un risque faible mais réel, un peu plus élevé en cas d'ablation de polype :",
        "-:<strong>Perforation</strong> de la paroi (≈ 0,04 % en diagnostic, ≈ 0,08 % après ablation) — souvent réparable par endoscopie ; exceptionnellement chirurgie.",
        "-:<strong>Hémorragie</strong> (≈ 0,3 %, plus fréquente après ablation) — immédiate ou retardée (jusqu'à J10), parfois favorisée par les anticoagulants ; peut nécessiter clips, transfusion ou nouveau geste.",
        "-:Plus rarement : troubles liés à l'anesthésie, hématome ou lésion d'un organe de voisinage.",
      ]},
      { h: "Quand consulter en urgence ?", tone: "danger", body: [
        "p:Après l'examen, contactez immédiatement le service (numéro d'urgence 24 h/24), ou consultez aux urgences, en cas de : <strong>fièvre, douleur abdominale importante, ventre dur, sang rouge abondant ou selles noires, malaise</strong>. À défaut, appelez le <strong>15</strong>.",
      ]},
    ],
    consent: {
      soussigne: true,
      recuDe: "Dr Antoine Debourdeau",
      objet: "la coloscopie, l'ablation éventuelle de polypes au cours du même examen, ses bénéfices et ses risques",
      accept: "J'ai compris que, si des polypes sont découverts, ils pourront le plus souvent être retirés au cours de cette coloscopie, et j'accepte la réalisation de cet examen ainsi que des gestes complémentaires nécessaires à ma sécurité.",
    },
    illus: { imgs: ["img/coloscopie.jpg"], cap: "Le coloscope explore l'ensemble du côlon et du rectum ; en cas de polype, il peut être retiré à l'anse au cours du même examen." },
  },
};
