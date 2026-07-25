import type { QuestionItem } from "@/types";

export const questions: QuestionItem[] = [
  {
    slug: "qui-possede-l-espace",
    question: "Qui possède l'espace extra-atmosphérique ?",
    reponseCourte:
      "Personne : le Traité de l'espace de 1967 interdit toute appropriation nationale de l'espace, de la Lune et des autres corps célestes.",
    reponseDetaillee: [
      "L'article II du Traité sur les principes régissant les activités des États en matière d'exploration et d'utilisation de l'espace extra-atmosphérique, signé en 1967, pose un principe fondateur : l'espace, la Lune et les autres corps célestes ne peuvent faire l'objet d'appropriation nationale, que ce soit par proclamation de souveraineté, utilisation, occupation ou tout autre moyen.",
      "Ce principe de non-appropriation distingue le régime juridique de l'espace de celui, par exemple, des eaux internationales : aucun État ne peut revendiquer une portion de l'espace comme faisant partie de son territoire.",
      "En revanche, les objets spatiaux lancés par un État restent sous sa juridiction et son contrôle, conformément à l'article VIII du même traité. La non-appropriation du milieu n'empêche donc pas l'exercice d'une compétence sur les engins qui s'y trouvent.",
      "Le débat contemporain porte surtout sur l'exploitation des ressources spatiales : extraire et utiliser des ressources ne constitue pas nécessairement une appropriation du corps céleste lui-même, ce qui alimente les discussions sur un régime international dédié.",
    ],
    domaine: "droit-spatial",
    categorie: "traites-spatiaux",
    niveau: "Débutant",
  },
  {
    slug: "responsabilite-collision-satellites",
    question: "Qui est responsable en cas de collision entre deux satellites ?",
    reponseCourte:
      "La Convention sur la responsabilité de 1972 impose une responsabilité de l'État de lancement, objective au sol et pour faute en orbite.",
    reponseDetaillee: [
      "La Convention sur la responsabilité internationale pour les dommages causés par des objets spatiaux (1972) distingue deux régimes selon le lieu du dommage.",
      "Pour les dommages causés à la surface de la Terre ou aux aéronefs en vol, l'État de lancement est responsable de plein droit, sans qu'il soit nécessaire de démontrer une faute : c'est une responsabilité objective.",
      "Pour les dommages causés en orbite à un autre objet spatial, comme lors d'une collision entre deux satellites, la responsabilité repose sur la preuve d'une faute imputable à l'État de lancement ou aux personnes dont il doit répondre.",
      "En pratique, établir cette faute reste complexe : elle suppose de démontrer un manquement aux règles de prudence, par exemple une négligence dans les manœuvres d'évitement ou le suivi de trajectoire, ce qui explique le faible nombre de réclamations formelles à ce jour.",
    ],
    domaine: "droit-spatial",
    categorie: "debris-spatiaux",
    niveau: "Intermédiaire",
  },
  {
    slug: "peut-on-exploiter-lune",
    question:
      "Une entreprise privée peut-elle exploiter des ressources sur la Lune ?",
    reponseCourte:
      "Le droit international ne l'interdit pas explicitement, mais le régime juridique applicable à l'appropriation des ressources reste débattu entre États.",
    reponseDetaillee: [
      "Le Traité de l'espace de 1967 interdit l'appropriation nationale des corps célestes, mais reste silencieux sur le statut juridique des ressources qui en sont extraites.",
      "Plusieurs États, dont les États-Unis, le Luxembourg, le Japon et les Émirats arabes unis, ont adopté des législations nationales autorisant leurs opérateurs privés à s'approprier les ressources extraites, sans revendiquer de souveraineté sur le corps céleste lui-même.",
      "Les Accords Artemis, portés par la NASA, formalisent une approche similaire au niveau bilatéral en reconnaissant que l'extraction de ressources spatiales peut se faire en conformité avec le droit international.",
      "À l'inverse, l'Accord sur la Lune de 1979, très peu ratifié, prévoit un régime international de gestion des ressources qui n'a jamais été mis en œuvre, laissant le sujet largement ouvert au niveau multilatéral, notamment au sein du COPUOS.",
    ],
    domaine: "droit-spatial",
    categorie: "exploitation-ressources",
    niveau: "Avancé",
  },
  {
    slug: "licence-lancement-fusee",
    question: "Faut-il une licence pour lancer une fusée privée ?",
    reponseCourte:
      "Oui : chaque État de lancement délivre une autorisation nationale conditionnant l'accès à l'espace pour les opérateurs privés.",
    reponseDetaillee: [
      "En vertu du Traité de l'espace, les États sont internationalement responsables des activités spatiales menées par des entités non gouvernementales relevant de leur juridiction, y compris les opérateurs privés.",
      "Cette responsabilité se traduit par une obligation d'autorisation et de surveillance continue prévue à l'article VI du traité, mise en œuvre par des législations nationales spécifiques.",
      "Aux États-Unis, la Federal Aviation Administration délivre les licences de lancement et de rentrée atmosphérique. En France, le Centre national d'études spatiales encadre les opérations sous la loi relative aux opérations spatiales de 2008.",
      "Ces licences couvrent notamment la sécurité du lancement, la couverture assurantielle exigée et, de plus en plus, les obligations de fin de vie des satellites et de limitation des débris.",
    ],
    domaine: "droit-spatial",
    categorie: "new-space",
    niveau: "Débutant",
  },
  {
    slug: "quest-ce-que-rgpd",
    question: "Qu'est-ce que le RGPD et à qui s'applique-t-il ?",
    reponseCourte:
      "Le Règlement général sur la protection des données encadre le traitement des données personnelles de toute entité ciblant des résidents européens.",
    reponseDetaillee: [
      "Le Règlement (UE) 2016/679, dit RGPD, est entré en application en mai 2018. Il harmonise les règles de protection des données personnelles au sein de l'Union européenne.",
      "Son champ d'application est territorial et extraterritorial : il s'applique à tout responsable de traitement établi dans l'Union, mais aussi à toute entité hors UE qui cible des personnes situées sur le territoire européen, que ce soit pour leur offrir des biens et services ou pour suivre leur comportement.",
      "Le texte repose sur des principes clés : licéité, minimisation des données, limitation de la finalité, ainsi que des droits renforcés pour les personnes concernées (accès, rectification, effacement, portabilité).",
      "Le non-respect du RGPD expose à des sanctions pouvant atteindre 20 millions d'euros ou 4 % du chiffre d'affaires mondial annuel, ce qui en fait l'un des textes de protection des données les plus dissuasifs au monde.",
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    niveau: "Débutant",
  },
  {
    slug: "ia-act-systemes-haut-risque",
    question: "Qu'est-ce qu'un système d'IA « à haut risque » selon l'AI Act ?",
    reponseCourte:
      "Un système utilisé dans des domaines sensibles (santé, recrutement, justice...) soumis à des obligations renforcées de conformité et de surveillance.",
    reponseDetaillee: [
      "L'AI Act européen adopte une approche fondée sur le risque : plus l'usage d'un système d'intelligence artificielle est susceptible d'affecter les droits fondamentaux, plus les obligations sont strictes.",
      "Les systèmes à haut risque sont listés en annexe du règlement : ils couvrent notamment le recrutement, l'évaluation de la solvabilité, l'éducation, la santé, la justice et certaines infrastructures critiques.",
      "Ces systèmes doivent faire l'objet d'une évaluation de conformité avant leur mise sur le marché, d'une documentation technique détaillée, d'une supervision humaine effective et d'une gestion continue des risques tout au long de leur cycle de vie.",
      "Les fournisseurs doivent également enregistrer leur système dans une base de données européenne dédiée, afin de garantir un niveau minimal de transparence pour les autorités et le public.",
    ],
    domaine: "droit-numerique",
    categorie: "intelligence-artificielle",
    niveau: "Intermédiaire",
  },
  {
    slug: "obligation-notification-incident",
    question: "Quand faut-il notifier un incident de cybersécurité ?",
    reponseCourte:
      "La directive NIS 2 impose une notification initiale sous 24 heures, puis un rapport complet sous un mois pour les entités concernées.",
    reponseDetaillee: [
      "La directive (UE) 2022/2555, dite NIS 2, élargit le périmètre des entités soumises à des obligations de cybersécurité, en distinguant entités essentielles et entités importantes.",
      "En cas d'incident significatif, l'entité concernée doit transmettre une alerte précoce à son autorité nationale compétente dans un délai de 24 heures après en avoir eu connaissance.",
      "Une notification d'incident plus détaillée doit suivre dans les 72 heures, précisant une première évaluation de l'incident, sa gravité et son impact.",
      "Un rapport final est ensuite attendu dans un délai d'un mois, décrivant l'incident, sa cause probable, les mesures d'atténuation prises et, le cas échéant, son impact transfrontière.",
    ],
    domaine: "droit-numerique",
    categorie: "cybersecurite",
    niveau: "Intermédiaire",
  },
  {
    slug: "dsa-obligations-plateformes",
    question:
      "Quelles obligations le DSA impose-t-il aux grandes plateformes ?",
    reponseCourte:
      "Le Digital Services Act impose transparence algorithmique, modération renforcée et audits indépendants aux très grandes plateformes en ligne.",
    reponseDetaillee: [
      "Le Règlement (UE) 2022/2065, dit Digital Services Act (DSA), instaure des obligations graduées selon la taille et le rôle de l'intermédiaire en ligne.",
      "Les très grandes plateformes en ligne et très grands moteurs de recherche, comptant plus de 45 millions d'utilisateurs actifs mensuels dans l'Union, sont soumis aux obligations les plus strictes.",
      "Elles doivent notamment réaliser une évaluation annuelle des risques systémiques liés à leurs services, offrir une option de recommandation de contenu non fondée sur le profilage, et se soumettre à des audits indépendants.",
      "Le texte impose également une transparence renforcée sur la publicité ciblée et sur le fonctionnement des systèmes de recommandation, ainsi que des mécanismes accessibles de signalement des contenus illicites.",
    ],
    domaine: "droit-numerique",
    categorie: "plateformes-numeriques",
    niveau: "Avancé",
  },
];
