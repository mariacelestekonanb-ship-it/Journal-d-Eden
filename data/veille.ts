import type { VeilleItem } from "@/types";

export const veilleItems: VeilleItem[] = [
  {
    slug: "eu-space-act-adoption",
    titre: "L'Union européenne adopte le règlement « EU Space Act »",
    resume:
      "Le nouveau règlement harmonise les régimes d'autorisation pour les opérateurs de satellites et introduit des exigences de durabilité orbitale communes aux 27 États membres.",
    contenu: [
      "Après plusieurs années de négociations, l'Union européenne a formellement adopté le règlement dit « EU Space Act », un texte destiné à unifier les régimes nationaux d'autorisation des activités spatiales aujourd'hui fragmentés entre États membres.",
      "Le règlement instaure un socle commun d'exigences en matière de sécurité, de résilience cyber et de durabilité environnementale, applicable à tout opérateur souhaitant exercer une activité spatiale depuis le territoire de l'Union.",
      "Parmi les mesures phares figure une obligation de désorbitation en fin de vie pour les satellites en orbite basse, alignée sur les recommandations du Zero Debris Charter porté par l'Agence spatiale européenne.",
      "Le texte prévoit une période de transition de 24 mois avant son entrée en application complète, le temps que les autorités nationales adaptent leurs procédures de licence existantes.",
    ],
    pointsCles: [
      "Harmonisation des régimes d'autorisation nationaux",
      "Obligations renforcées de désorbitation en orbite basse",
      "Entrée en application progressive sur 24 mois",
    ],
    domaine: "droit-spatial",
    categorie: "new-space",
    date: "2026-07-18",
    source: "Commission européenne",
    tempsLecture: 6,
    aLaUne: true,
  },
  {
    slug: "onu-comite-copuos-ressources",
    titre: "COPUOS : vers un cadre multilatéral sur les ressources lunaires",
    resume:
      "Le Comité des Nations Unies sur les utilisations pacifiques de l'espace extra-atmosphérique avance sur un projet de principes encadrant l'exploitation des ressources lunaires.",
    contenu: [
      "Réuni à Vienne, le Comité des Nations Unies sur les utilisations pacifiques de l'espace extra-atmosphérique (COPUOS) a examiné un projet de principes directeurs pour l'exploitation des ressources spatiales.",
      "Ce texte, encore non contraignant, cherche à concilier les approches unilatérales déjà adoptées par certains États avec la nécessité d'un cadre international minimal, notamment sur le partage des bénéfices et la prévention des conflits d'usage.",
      "Plusieurs délégations ont souligné l'urgence d'aboutir avant l'intensification des missions commerciales visant l'extraction de glace et de régolithe lunaire prévues d'ici la fin de la décennie.",
      "Les discussions se poursuivront lors de la prochaine session du sous-comité juridique, avec pour objectif une adoption de principes de haut niveau, préalable possible à un futur traité.",
    ],
    pointsCles: [
      "Projet de principes non contraignants en discussion",
      "Enjeu du partage des bénéfices entre États",
      "Calendrier accéléré par les missions commerciales lunaires",
    ],
    domaine: "droit-spatial",
    categorie: "exploitation-ressources",
    date: "2026-07-10",
    source: "ONU - COPUOS",
    tempsLecture: 8,
    aLaUne: true,
  },
  {
    slug: "fcc-regles-debris-2026",
    titre: "La FCC renforce ses règles de désorbitation à cinq ans",
    resume:
      "La Federal Communications Commission précise les modalités d'application de sa règle de désorbitation accélérée pour les satellites en orbite basse.",
    contenu: [
      "La Federal Communications Commission (FCC) a publié des précisions attendues sur l'application de sa règle dite des « cinq ans », qui impose la désorbitation des satellites en fin de mission dans ce délai après la fin des opérations.",
      "Les nouvelles lignes directrices clarifient les modalités de calcul du délai pour les constellations multi-satellites et les cas d'exemption pour les missions scientifiques ou gouvernementales.",
      "Les opérateurs devront désormais fournir un plan de désorbitation détaillé dès la demande de licence, incluant une estimation de la probabilité de succès de la manœuvre finale.",
    ],
    pointsCles: [
      "Clarification du calcul du délai de cinq ans",
      "Plan de désorbitation exigé dès la licence",
      "Exemptions limitées aux missions scientifiques",
    ],
    domaine: "droit-spatial",
    categorie: "debris-spatiaux",
    date: "2026-06-29",
    source: "FCC",
    tempsLecture: 5,
  },
  {
    slug: "ai-act-codes-conduite",
    titre: "AI Act : publication des codes de conduite pour les modèles à usage général",
    resume:
      "La Commission européenne publie les lignes directrices attendues par les fournisseurs de modèles d'IA à usage général soumis aux obligations de transparence.",
    contenu: [
      "La Commission européenne a publié les codes de conduite destinés à guider les fournisseurs de modèles d'intelligence artificielle à usage général dans l'application de leurs obligations de transparence issues de l'AI Act.",
      "Ces codes précisent notamment le contenu attendu de la documentation technique, les modalités de résumé des données d'entraînement protégées par le droit d'auteur, et les engagements en matière de sécurité pour les modèles présentant un risque systémique.",
      "Les fournisseurs qui adhèrent volontairement à ces codes bénéficieront d'une présomption de conformité facilitant leurs relations avec les autorités de surveillance du marché.",
      "Les organisations de la société civile ont salué l'avancée tout en regrettant l'absence de mécanisme de sanction spécifique en cas de non-respect des engagements pris dans le cadre du code.",
    ],
    pointsCles: [
      "Codes de conduite pour les modèles à usage général",
      "Présomption de conformité pour les signataires",
      "Focus sur la transparence des données d'entraînement",
    ],
    domaine: "droit-numerique",
    categorie: "intelligence-artificielle",
    date: "2026-07-20",
    source: "Commission européenne",
    tempsLecture: 7,
    aLaUne: true,
  },
  {
    slug: "cnil-sanction-cookies",
    titre: "La CNIL sanctionne deux éditeurs pour manquement au consentement",
    resume:
      "Deux sociétés françaises écopent d'amendes pour défaut de recueil valable du consentement aux traceurs publicitaires.",
    contenu: [
      "La Commission nationale de l'informatique et des libertés (CNIL) a prononcé deux sanctions financières à l'encontre d'éditeurs de sites web pour manquement aux règles applicables aux cookies et traceurs.",
      "Les contrôles ont révélé l'absence d'un mécanisme de refus aussi simple que celui d'acceptation, ainsi que le dépôt de traceurs publicitaires avant tout recueil du consentement de l'utilisateur.",
      "La CNIL rappelle que le consentement doit être libre, spécifique, éclairé et univoque, et que sa preuve incombe à l'éditeur du site en cas de contrôle.",
    ],
    pointsCles: [
      "Deux sanctions financières prononcées",
      "Absence de symétrie entre accepter et refuser",
      "Rappel de la charge de la preuve du consentement",
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    date: "2026-07-14",
    source: "CNIL",
    tempsLecture: 4,
  },
  {
    slug: "nis2-transposition-etats",
    titre: "NIS 2 : où en est la transposition dans les États membres ?",
    resume:
      "Panorama de l'avancement de la transposition de la directive NIS 2 et des divergences observées sur le périmètre des entités essentielles.",
    contenu: [
      "Plus de deux ans après son adoption, la directive NIS 2 continue de faire l'objet d'une transposition inégale selon les États membres de l'Union européenne.",
      "Certains pays ont opté pour une définition extensive des « entités essentielles », incluant des acteurs de taille intermédiaire, tandis que d'autres retiennent une lecture plus restrictive limitée aux grands opérateurs d'infrastructures critiques.",
      "L'ENISA appelle à une convergence accrue afin d'éviter une fragmentation du marché intérieur et des distorsions de concurrence entre opérateurs soumis à des obligations différentes selon leur État d'établissement.",
      "Un rapport de suivi complet est attendu avant la fin de l'année, incluant des recommandations spécifiques pour les secteurs de l'énergie, de la santé et des infrastructures numériques.",
    ],
    pointsCles: [
      "Transposition inégale selon les États membres",
      "Divergences sur le périmètre des entités essentielles",
      "Rapport de suivi de l'ENISA attendu",
    ],
    domaine: "droit-numerique",
    categorie: "cybersecurite",
    date: "2026-07-05",
    source: "ENISA",
    tempsLecture: 9,
  },
  {
    slug: "dma-amende-gatekeeper",
    titre: "DMA : nouvelle amende record contre un contrôleur d'accès",
    resume:
      "La Commission européenne inflige une amende pour non-respect des obligations d'interopérabilité imposées par le Digital Markets Act.",
    contenu: [
      "La Commission européenne a infligé une amende record à un contrôleur d'accès désigné au titre du Digital Markets Act, pour non-respect de ses obligations d'interopérabilité avec des services tiers.",
      "L'enquête a établi que l'entreprise avait maintenu des restrictions techniques limitant l'accès des développeurs tiers à des fonctionnalités essentielles de sa plateforme, en violation de l'article 6 du règlement.",
      "Cette décision, la plus lourde prononcée à ce jour au titre du DMA, est présentée par la Commission comme un signal fort adressé à l'ensemble des contrôleurs d'accès désignés.",
    ],
    pointsCles: [
      "Amende record au titre du Digital Markets Act",
      "Violation des obligations d'interopérabilité",
      "Signal fort envoyé aux autres contrôleurs d'accès",
    ],
    domaine: "droit-numerique",
    categorie: "plateformes-numeriques",
    date: "2026-06-22",
    source: "Commission européenne",
    tempsLecture: 6,
  },
  {
    slug: "artemis-accords-nouveaux-signataires",
    titre: "Les Accords Artemis accueillent trois nouveaux pays signataires",
    resume:
      "L'extension des Accords Artemis illustre la montée en puissance du cadre bilatéral américain face aux instances multilatérales onusiennes.",
    contenu: [
      "Trois nouveaux pays ont rejoint les Accords Artemis, portant à plusieurs dizaines le nombre total de signataires de ce cadre porté par les États-Unis pour la coopération lunaire.",
      "Ces accords, non contraignants au sens du droit international classique, formalisent des engagements communs sur la transparence des opérations, l'interopérabilité des systèmes et la prévention des interférences nuisibles entre missions.",
      "Leur succès croissant illustre la montée en puissance d'un cadre bilatéral et volontaire, en parallèle des discussions plus lentes menées au sein du COPUOS pour élaborer un régime multilatéral.",
      "Certains observateurs s'interrogent toutefois sur la cohérence à terme entre ces engagements bilatéraux et un éventuel cadre onusien plus contraignant.",
    ],
    pointsCles: [
      "Trois nouveaux signataires des Accords Artemis",
      "Cadre bilatéral non contraignant mais structurant",
      "Tension potentielle avec un futur cadre multilatéral",
    ],
    domaine: "droit-spatial",
    categorie: "traites-spatiaux",
    date: "2026-06-15",
    source: "NASA",
    tempsLecture: 5,
  },
];
