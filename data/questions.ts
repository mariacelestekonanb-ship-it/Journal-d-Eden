import type { QuestionItem } from "@/types";

export const questions: QuestionItem[] = [
  {
    slug: "qui-possede-l-espace",
    question: "Qui possède l'espace extra-atmosphérique ?",
    reponseCourte:
      "Personne : le Traité de l'espace de 1967 interdit toute appropriation nationale de l'espace, de la Lune et des autres corps célestes.",
    contexte: [
      "Depuis les débuts de la conquête spatiale, la question de la souveraineté sur l'espace a opposé deux logiques : celle, classique, de l'appropriation territoriale qui a présidé au partage des continents, et celle, nouvelle, d'un bien commun de l'humanité.",
      "Cette tension a resurgi avec l'essor du New Space : si aucun État ne peut posséder l'espace, qu'en est-il des ressources qu'on y trouve ou des positions orbitales qu'on y occupe ?",
    ],
    explication: [
      { type: "heading", text: "Le principe de non-appropriation" },
      {
        type: "paragraph",
        text: "L'article II du Traité de l'espace de 1967 est sans ambiguïté : l'espace extra-atmosphérique, la Lune et les autres corps célestes ne peuvent faire l'objet d'appropriation nationale, par proclamation de souveraineté, utilisation, occupation ou tout autre moyen.",
      },
      {
        type: "paragraph",
        text: "Ce principe s'inspire directement du régime de la haute mer et de l'Antarctique : certains espaces échappent par nature à toute logique de possession étatique exclusive.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Non-appropriation ne veut pas dire absence de droit : les objets spatiaux restent soumis à la juridiction de l'État qui les a lancés, où qu'ils se trouvent.",
      },
      { type: "heading", text: "Un principe qui n'empêche pas la juridiction" },
      {
        type: "paragraph",
        text: "L'article VIII du même traité précise que l'État d'immatriculation conserve juridiction et contrôle sur son objet spatial et son personnel, même en orbite ou sur un corps céleste.",
      },
      {
        type: "list",
        items: [
          "Aucun drapeau planté ne vaut titre de propriété",
          "Un satellite reste soumis au droit de l'État qui l'a lancé",
          "La Lune et les astéroïdes ne peuvent être revendiqués par un État",
        ],
      },
      { type: "heading", text: "Le débat sur les ressources" },
      {
        type: "paragraph",
        text: "Le sujet le plus disputé aujourd'hui ne porte plus sur le territoire, mais sur les ressources : extraire de la glace ou des minerais constitue-t-il une forme d'appropriation déguisée ? Les États-Unis, le Luxembourg ou le Japon ont tranché par la négative dans leur droit national.",
      },
    ],
    pointsCles: [
      "L'espace, la Lune et les corps célestes ne peuvent être revendiqués par aucun État.",
      "Un objet spatial reste sous la juridiction de son État de lancement, même en orbite.",
      "Le débat actuel porte sur l'exploitation des ressources, pas sur le territoire lui-même.",
      "Plusieurs États autorisent déjà leurs opérateurs privés à s'approprier les ressources extraites.",
    ],
    references: [
      {
        type: "Traité",
        titre:
          "Traité sur les principes régissant les activités des États en matière d'exploration et d'utilisation de l'espace extra-atmosphérique",
        citation: "Articles II et VIII, 1967",
        organisme: "ONU / UNOOSA",
        url: "https://www.unoosa.org/oosa/fr/ourwork/spacelaw/treaties/outerspacetreaty.html",
      },
      {
        type: "Traité",
        titre:
          "Accord régissant les activités des États sur la Lune et les autres corps célestes",
        citation: "1979",
        organisme: "ONU / UNOOSA",
      },
      {
        type: "Loi",
        titre: "Space Resource Exploration and Utilization Act",
        citation: "51 U.S.C. § 51303, 2015",
        organisme: "Congrès des États-Unis",
      },
    ],
    domaine: "droit-spatial",
    categorie: "traites-spatiaux",
    niveau: "Débutant",
    tempsLecture: 4,
    dateMiseAJour: "2026-05-12",
  },
  {
    slug: "responsabilite-collision-satellites",
    question: "Qui est responsable en cas de collision entre deux satellites ?",
    reponseCourte:
      "La Convention sur la responsabilité de 1972 impose une responsabilité de l'État de lancement, objective au sol et pour faute en orbite.",
    contexte: [
      "Avec plus de 10 000 satellites actifs en orbite basse, le risque de collision n'est plus théorique. Quand deux objets appartenant à des États différents entrent en contact, la question de la réparation devient rapidement diplomatique autant que juridique.",
      "Le droit spatial a anticipé ce scénario dès les années 1970, avec un régime de responsabilité pensé pour un espace alors bien moins encombré qu'aujourd'hui.",
    ],
    explication: [
      { type: "heading", text: "Deux régimes selon le lieu du dommage" },
      {
        type: "paragraph",
        text: "La Convention sur la responsabilité de 1972 distingue les dommages causés au sol ou à un aéronef en vol de ceux causés en orbite à un autre objet spatial.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Au sol, la responsabilité est objective : point besoin de prouver une faute, l'État de lancement répond automatiquement du dommage causé par son objet.",
      },
      { type: "heading", text: "En orbite, la faute doit être prouvée" },
      {
        type: "paragraph",
        text: "Pour un dommage causé en orbite, comme une collision entre deux satellites, la victime doit démontrer une faute de l'État de lancement responsable ou des personnes dont il doit répondre.",
      },
      {
        type: "paragraph",
        text: "Cette exigence de preuve, protectrice pour les opérateurs de bonne foi, complique en pratique l'indemnisation : établir une négligence dans une manœuvre d'évitement reste difficile à documenter.",
      },
      {
        type: "list",
        items: [
          "Dommage au sol : responsabilité automatique de l'État de lancement",
          "Dommage en orbite : la faute doit être prouvée",
          "Une seule réclamation formelle a abouti à ce jour (Cosmos 954, 1978)",
        ],
      },
      { type: "heading", text: "Un cadre sous tension" },
      {
        type: "paragraph",
        text: "La multiplication des constellations privées ravive le débat : faut-il durcir ce régime pour l'adapter à un trafic orbital devenu massif ?",
      },
    ],
    pointsCles: [
      "Le régime de responsabilité change selon que le dommage survient au sol ou en orbite.",
      "Au sol, l'État de lancement répond automatiquement, sans preuve de faute.",
      "En orbite, la victime doit démontrer une faute imputable à l'État responsable.",
      "Une seule réclamation a formellement abouti depuis l'entrée en vigueur du traité.",
    ],
    references: [
      {
        type: "Convention",
        titre:
          "Convention sur la responsabilité internationale pour les dommages causés par des objets spatiaux",
        citation: "Articles II et III, 1972",
        organisme: "ONU / UNOOSA",
      },
      {
        type: "Traité",
        titre: "Traité de l'espace",
        citation: "Article VII, 1967",
        organisme: "ONU / UNOOSA",
      },
      {
        type: "Décision",
        titre: "Règlement du différend Cosmos 954 (Canada c. URSS)",
        citation: "Protocole d'accord, 1981",
        organisme: "Canada / URSS",
      },
    ],
    domaine: "droit-spatial",
    categorie: "debris-spatiaux",
    niveau: "Intermédiaire",
    tempsLecture: 6,
    dateMiseAJour: "2026-06-02",
  },
  {
    slug: "peut-on-exploiter-lune",
    question:
      "Une entreprise privée peut-elle exploiter des ressources sur la Lune ?",
    reponseCourte:
      "Le droit international ne l'interdit pas explicitement, mais le régime juridique applicable à l'appropriation des ressources reste débattu entre États.",
    contexte: [
      "L'annonce de missions commerciales visant à extraire de la glace ou du régolithe lunaire a remis sur la table une question restée en suspens depuis 1967 : le droit international autorise-t-il vraiment l'appropriation de ressources spatiales par des acteurs privés ?",
      "En l'absence de règle explicite, plusieurs États ont choisi de légiférer unilatéralement, ouvrant la voie à un cadre juridique fragmenté.",
    ],
    explication: [
      { type: "heading", text: "Un silence du Traité de l'espace" },
      {
        type: "paragraph",
        text: "Le Traité de l'espace interdit l'appropriation nationale des corps célestes, mais ne dit rien du statut des ressources qui en sont extraites — une omission qui alimente le débat depuis un demi-siècle.",
      },
      { type: "heading", text: "Les législations nationales comblent le vide" },
      {
        type: "paragraph",
        text: "Les États-Unis (2015), le Luxembourg (2017), le Japon (2021) et les Émirats arabes unis ont adopté des lois autorisant leurs opérateurs à s'approprier les ressources extraites, sans revendiquer de souveraineté sur le corps céleste.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Ces lois n'engagent que leurs auteurs : elles ne créent pas, à elles seules, une règle de droit international opposable aux autres États.",
      },
      { type: "heading", text: "Les Accords Artemis, une voie bilatérale" },
      {
        type: "paragraph",
        text: "Portés par la NASA, les Accords Artemis reconnaissent que l'extraction et l'utilisation de ressources spatiales peuvent se faire en conformité avec le droit international existant, sans attendre un nouveau traité.",
      },
      {
        type: "list",
        items: [
          "L'Accord sur la Lune (1979) prévoit un régime international, mais reste très peu ratifié",
          "Les Accords Artemis privilégient une approche bilatérale et volontaire",
          "Le COPUOS discute d'un cadre multilatéral depuis plusieurs années",
        ],
      },
      {
        type: "paragraph",
        text: "Tant qu'aucun consensus multilatéral n'émerge, la pratique des États précède le droit établi — une situation classique en droit international naissant.",
      },
    ],
    pointsCles: [
      "Le Traité de l'espace interdit l'appropriation des corps célestes, pas celle des ressources extraites.",
      "Plusieurs États autorisent déjà leurs opérateurs privés à s'approprier des ressources spatiales.",
      "Les Accords Artemis proposent une lecture bilatérale, hors cadre onusien classique.",
      "Un régime multilatéral reste en discussion au sein du COPUOS.",
    ],
    references: [
      {
        type: "Traité",
        titre: "Traité de l'espace",
        citation: "Article II, 1967",
        organisme: "ONU / UNOOSA",
      },
      {
        type: "Loi",
        titre: "Space Resource Exploration and Utilization Act",
        citation: "51 U.S.C. § 51303, 2015",
        organisme: "Congrès des États-Unis",
      },
      {
        type: "Traité",
        titre: "Accords Artemis",
        citation: "Section 10, 2020",
        organisme: "NASA",
        url: "https://www.nasa.gov/artemis-accords/",
      },
      {
        type: "Traité",
        titre: "Accord sur la Lune",
        citation: "1979",
        organisme: "ONU / UNOOSA",
      },
    ],
    domaine: "droit-spatial",
    categorie: "exploitation-ressources",
    niveau: "Avancé",
    tempsLecture: 7,
    dateMiseAJour: "2026-07-08",
  },
  {
    slug: "licence-lancement-fusee",
    question: "Faut-il une licence pour lancer une fusée privée ?",
    reponseCourte:
      "Oui : chaque État de lancement délivre une autorisation nationale conditionnant l'accès à l'espace pour les opérateurs privés.",
    contexte: [
      "Un opérateur privé ne peut pas simplement construire une fusée et la lancer : le droit international impose aux États une responsabilité de principe pour toute activité spatiale menée depuis leur territoire ou sous leur juridiction.",
      "Cette responsabilité descend mécaniquement vers l'opérateur, via un régime national de licence propre à chaque pays.",
    ],
    explication: [
      {
        type: "heading",
        text: "Une obligation qui vient du droit international",
      },
      {
        type: "paragraph",
        text: "L'article VI du Traité de l'espace rend les États internationalement responsables des activités spatiales de leurs ressortissants, y compris les entités privées, et leur impose de les autoriser et surveiller en continu.",
      },
      { type: "heading", text: "Des régimes nationaux variés" },
      {
        type: "paragraph",
        text: "Aux États-Unis, la Federal Aviation Administration délivre les licences de lancement et de rentrée atmosphérique. En France, le CNES encadre les opérations sous la loi relative aux opérations spatiales de 2008.",
      },
      {
        type: "list",
        items: [
          "Étude de sécurité du lancement et des trajectoires",
          "Couverture assurantielle obligatoire",
          "Plan de fin de vie du satellite et de limitation des débris",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Sans autorisation nationale, un lancement resterait juridiquement rattaché à un État qui n'en aurait jamais validé les conditions de sécurité — une situation qu'aucun pays n'autorise en pratique.",
      },
      { type: "heading", text: "Un contrôle qui ne s'arrête pas au décollage" },
      {
        type: "paragraph",
        text: "La surveillance continue exigée par le traité se traduit par des obligations de suivi tout au long de la mission, jusqu'à la désorbitation ou la mise en orbite-cimetière du satellite.",
      },
    ],
    pointsCles: [
      "Le Traité de l'espace impose aux États d'autoriser et de surveiller les activités spatiales privées.",
      "Chaque État de lancement a son propre régime de licence (FAA aux États-Unis, CNES en France…).",
      "La licence couvre la sécurité du lancement, l'assurance et la fin de vie du satellite.",
      "La surveillance étatique se poursuit après le lancement, jusqu'à la fin de la mission.",
    ],
    references: [
      {
        type: "Traité",
        titre: "Traité de l'espace",
        citation: "Article VI, 1967",
        organisme: "ONU / UNOOSA",
      },
      {
        type: "Loi",
        titre: "Loi relative aux opérations spatiales",
        citation: "Loi n° 2008-518, 2008",
        organisme: "République française",
      },
      {
        type: "Règlement",
        titre: "Commercial Space Launch Act",
        citation: "51 U.S.C. § 509, 1984 (modifié)",
        organisme: "Federal Aviation Administration",
      },
    ],
    domaine: "droit-spatial",
    categorie: "new-space",
    niveau: "Débutant",
    tempsLecture: 5,
    dateMiseAJour: "2026-04-20",
  },
  {
    slug: "quest-ce-que-rgpd",
    question: "Qu'est-ce que le RGPD et à qui s'applique-t-il ?",
    reponseCourte:
      "Le Règlement général sur la protection des données encadre le traitement des données personnelles de toute entité ciblant des résidents européens.",
    contexte: [
      "Avant 2018, chaque État membre de l'Union européenne appliquait ses propres règles de protection des données, issues d'une directive de 1995 pensée pour un monde sans smartphones ni réseaux sociaux.",
      "Le RGPD répond à ce décalage en unifiant les règles à l'échelle européenne et en leur donnant une portée qui dépasse les frontières de l'Union.",
    ],
    explication: [
      { type: "heading", text: "Un règlement directement applicable" },
      {
        type: "paragraph",
        text: "Contrairement à une directive, un règlement européen s'applique directement dans chaque État membre, sans loi de transposition — ce qui explique l'harmonisation quasi immédiate obtenue en 2018.",
      },
      { type: "heading", text: "Un champ d'application extraterritorial" },
      {
        type: "paragraph",
        text: "Le RGPD s'applique à tout responsable de traitement établi dans l'Union, mais aussi à toute entité hors UE qui cible des résidents européens pour leur offrir des biens et services ou suivre leur comportement.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Une entreprise américaine sans aucun établissement en Europe peut donc être pleinement soumise au RGPD dès lors qu'elle vise des utilisateurs européens.",
      },
      { type: "heading", text: "Les principes clés" },
      {
        type: "list",
        items: [
          "Licéité, loyauté et transparence du traitement",
          "Minimisation des données collectées",
          "Limitation de la finalité du traitement",
          "Droits renforcés : accès, rectification, effacement, portabilité",
        ],
      },
      {
        type: "paragraph",
        text: "Le non-respect de ces principes expose à des sanctions pouvant atteindre 20 millions d'euros ou 4 % du chiffre d'affaires mondial annuel, ce qui en fait l'un des cadres les plus dissuasifs au monde.",
      },
    ],
    pointsCles: [
      "Le RGPD est un règlement européen directement applicable depuis mai 2018.",
      "Son champ d'application est extraterritorial : il vise aussi les entreprises non européennes ciblant des résidents de l'UE.",
      "Il repose sur des principes de licéité, minimisation et limitation de la finalité.",
      "Les sanctions peuvent atteindre 4 % du chiffre d'affaires mondial annuel.",
    ],
    references: [
      {
        type: "Règlement",
        titre: "Règlement général sur la protection des données",
        citation: "Règlement (UE) 2016/679",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679",
      },
      {
        type: "Site officiel",
        titre: "Le RGPD, en pratique",
        citation: "Guides et fiches pratiques",
        organisme: "CNIL",
        url: "https://www.cnil.fr/fr/reglement-europeen-protection-donnees",
      },
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    niveau: "Débutant",
    tempsLecture: 4,
    dateMiseAJour: "2026-06-15",
  },
  {
    slug: "ia-act-systemes-haut-risque",
    question: "Qu'est-ce qu'un système d'IA « à haut risque » selon l'AI Act ?",
    reponseCourte:
      "Un système utilisé dans des domaines sensibles (santé, recrutement, justice...) soumis à des obligations renforcées de conformité et de surveillance.",
    contexte: [
      "Face à la diversité des usages de l'intelligence artificielle — d'un simple filtre anti-spam à un algorithme de recrutement — l'Union européenne a fait le choix de ne pas tout réglementer de la même façon.",
      "L'AI Act introduit une classification par niveau de risque, où les obligations croissent avec la sensibilité de l'usage.",
    ],
    explication: [
      { type: "heading", text: "Une approche fondée sur le risque" },
      {
        type: "paragraph",
        text: "Plus l'usage d'un système d'IA est susceptible d'affecter les droits fondamentaux d'une personne, plus les obligations imposées à son fournisseur sont strictes.",
      },
      { type: "heading", text: "Ce que couvre le « haut risque »" },
      {
        type: "paragraph",
        text: "Les systèmes à haut risque sont listés en annexe du règlement : recrutement, évaluation de la solvabilité, éducation, santé, justice et certaines infrastructures critiques en font partie.",
      },
      {
        type: "list",
        items: [
          "Évaluation de conformité avant mise sur le marché",
          "Documentation technique détaillée",
          "Supervision humaine effective",
          "Gestion continue des risques tout au long du cycle de vie",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Un système à haut risque n'est pas interdit — il est encadré. L'interdiction pure ne concerne qu'une poignée d'usages jugés inacceptables (notation sociale, manipulation subliminale…).",
      },
      { type: "heading", text: "Une transparence renforcée" },
      {
        type: "paragraph",
        text: "Les fournisseurs doivent également enregistrer leur système dans une base de données européenne dédiée, afin de garantir un niveau minimal de transparence pour les autorités et le public.",
      },
    ],
    pointsCles: [
      "L'AI Act classe les systèmes d'IA par niveau de risque, pas par technologie.",
      "Les systèmes à haut risque couvrent le recrutement, la santé, la justice et d'autres secteurs sensibles.",
      "Ils restent autorisés, mais sous conditions strictes de conformité et de supervision humaine.",
      "Un enregistrement dans une base de données européenne est obligatoire avant mise sur le marché.",
    ],
    references: [
      {
        type: "Règlement",
        titre: "Règlement sur l'intelligence artificielle",
        citation: "Règlement (UE) 2024/1689, Annexe III",
        organisme: "Union européenne",
      },
      {
        type: "Site officiel",
        titre: "AI Act — cadre réglementaire",
        citation: "Ressources officielles",
        organisme: "Commission européenne",
        url: "https://digital-strategy.ec.europa.eu/fr/policies/regulatory-framework-ai",
      },
    ],
    domaine: "droit-numerique",
    categorie: "intelligence-artificielle",
    niveau: "Intermédiaire",
    tempsLecture: 6,
    dateMiseAJour: "2026-07-20",
  },
  {
    slug: "obligation-notification-incident",
    question: "Quand faut-il notifier un incident de cybersécurité ?",
    reponseCourte:
      "La directive NIS 2 impose une notification initiale sous 24 heures, puis un rapport complet sous un mois pour les entités concernées.",
    contexte: [
      "Un incident de cybersécurité non signalé à temps peut se propager bien au-delà de sa victime initiale, notamment lorsque l'entité touchée fournit des services essentiels à d'autres organisations.",
      "La directive NIS 2 impose un calendrier de notification strict, pensé pour permettre une réaction rapide des autorités compétentes.",
    ],
    explication: [
      { type: "heading", text: "Un périmètre élargi" },
      {
        type: "paragraph",
        text: "La directive (UE) 2022/2555, dite NIS 2, élargit le champ des entités soumises à des obligations de cybersécurité, en distinguant entités essentielles et entités importantes.",
      },
      { type: "heading", text: "Trois étapes, trois délais" },
      {
        type: "list",
        items: [
          "Alerte précoce sous 24 heures après connaissance de l'incident",
          "Notification détaillée sous 72 heures, avec une première évaluation de gravité",
          "Rapport final sous un mois, incluant causes et mesures correctives",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Le délai court dès que l'entité a connaissance de l'incident — pas depuis sa survenance réelle, parfois découverte bien plus tard.",
      },
      { type: "heading", text: "Pourquoi un calendrier aussi serré ?" },
      {
        type: "paragraph",
        text: "Ce séquençage permet aux autorités nationales de réagir vite sans attendre une analyse complète, tout en laissant le temps d'un diagnostic approfondi pour le rapport final.",
      },
    ],
    pointsCles: [
      "NIS 2 distingue entités essentielles et entités importantes, avec un périmètre élargi.",
      "La notification se fait en trois temps : 24 heures, 72 heures, puis un mois.",
      "Le délai part de la connaissance de l'incident, pas de sa survenance.",
      "L'objectif est une réaction rapide des autorités, sans attendre une analyse complète.",
    ],
    references: [
      {
        type: "Directive",
        titre: "Directive sur la cybersécurité",
        citation: "Directive (UE) 2022/2555, Article 23",
        organisme: "Union européenne",
      },
      {
        type: "Site officiel",
        titre: "NIS 2 — mise en œuvre",
        citation: "Ressources officielles",
        organisme: "ENISA",
        url: "https://www.enisa.europa.eu/",
      },
    ],
    domaine: "droit-numerique",
    categorie: "cybersecurite",
    niveau: "Intermédiaire",
    tempsLecture: 5,
    dateMiseAJour: "2026-05-30",
  },
  {
    slug: "dsa-obligations-plateformes",
    question:
      "Quelles obligations le DSA impose-t-il aux grandes plateformes ?",
    reponseCourte:
      "Le Digital Services Act impose transparence algorithmique, modération renforcée et audits indépendants aux très grandes plateformes en ligne.",
    contexte: [
      "Les grandes plateformes en ligne occupent une place si centrale dans l'accès à l'information que l'Union européenne a choisi de leur imposer des obligations spécifiques, proportionnées à leur influence.",
      "Le Digital Services Act gradue ces obligations selon la taille et le rôle de chaque intermédiaire, des plus petits hébergeurs aux très grandes plateformes.",
    ],
    explication: [
      { type: "heading", text: "Des obligations graduées" },
      {
        type: "paragraph",
        text: "Le Règlement (UE) 2022/2065, dit DSA, instaure des obligations proportionnées à la taille et au rôle de l'intermédiaire en ligne, des simples hébergeurs aux très grandes plateformes.",
      },
      {
        type: "heading",
        text: "Le régime le plus strict pour les très grandes plateformes",
      },
      {
        type: "paragraph",
        text: "Les plateformes et moteurs de recherche dépassant 45 millions d'utilisateurs actifs mensuels dans l'Union sont soumis aux obligations les plus exigeantes.",
      },
      {
        type: "list",
        items: [
          "Évaluation annuelle des risques systémiques",
          "Option de recommandation de contenu non fondée sur le profilage",
          "Audits indépendants réguliers",
          "Transparence renforcée sur la publicité ciblée",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Le DSA ne vise pas à censurer, mais à rendre visibles et contestables les décisions de modération — un principe de redevabilité plutôt que d'interdiction.",
      },
      { type: "heading", text: "Un mécanisme de signalement accessible" },
      {
        type: "paragraph",
        text: "Le texte impose des mécanismes accessibles de signalement des contenus illicites, ainsi qu'un droit de recours pour les utilisateurs dont le contenu a été retiré.",
      },
    ],
    pointsCles: [
      "Le DSA gradue ses obligations selon la taille et le rôle de l'intermédiaire en ligne.",
      "Les très grandes plateformes (45M+ d'utilisateurs dans l'UE) ont le régime le plus strict.",
      "Elles doivent évaluer leurs risques systémiques et se soumettre à des audits indépendants.",
      "Les utilisateurs disposent d'un droit de recours contre le retrait de leur contenu.",
    ],
    references: [
      {
        type: "Règlement",
        titre: "Règlement sur les services numériques",
        citation: "Règlement (UE) 2022/2065, Articles 34-35",
        organisme: "Union européenne",
      },
      {
        type: "Site officiel",
        titre: "Digital Services Act — texte et ressources",
        citation: "Ressources officielles",
        organisme: "Commission européenne",
      },
    ],
    domaine: "droit-numerique",
    categorie: "plateformes-numeriques",
    niveau: "Avancé",
    tempsLecture: 6,
    dateMiseAJour: "2026-07-01",
  },
  {
    slug: "attribution-frequences-satellites",
    question:
      "Comment les fréquences satellites sont-elles attribuées au niveau international ?",
    reponseCourte:
      "L'Union internationale des télécommunications coordonne l'attribution des fréquences et des positions orbitales entre États pour prévenir les interférences.",
    contexte: [
      "Deux satellites de communication utilisant la même fréquence depuis des positions orbitales proches produiraient des interférences rendant leurs signaux inutilisables — un risque que le droit international anticipe depuis les débuts des télécommunications spatiales.",
      "L'attribution des fréquences relève ainsi d'une coordination technique internationale, distincte des autorisations nationales de lancement.",
    ],
    explication: [
      { type: "heading", text: "Un rôle central pour l'UIT" },
      {
        type: "paragraph",
        text: "Le Règlement des radiocommunications de l'Union internationale des télécommunications répartit le spectre en bandes allouées à différents services, dont les services spatiaux.",
      },
      { type: "heading", text: "Une procédure d'enregistrement précise" },
      {
        type: "paragraph",
        text: "Tout opérateur souhaitant exploiter un satellite doit faire enregistrer sa fréquence et sa position orbitale auprès du Bureau des radiocommunications de l'UIT, via son administration nationale.",
      },
      {
        type: "list",
        items: [
          "Dépôt de la demande par l'administration nationale, pas directement par l'opérateur",
          "Coordination avec les systèmes satellitaires voisins",
          "Priorité tempérée par un objectif d'accès équitable entre États",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Le principe du « premier arrivé, premier servi » ne s'applique pas de façon absolue : l'UIT veille aussi à ce que les pays n'ayant pas encore de programme spatial conservent un accès équitable au spectre et aux positions orbitales.",
      },
      { type: "heading", text: "Un double niveau d'autorisation" },
      {
        type: "paragraph",
        text: "Ce cadre technique international se double d'autorisations nationales de station spatiale et de station terrienne, qui relèvent du droit interne de chaque État concerné.",
      },
    ],
    pointsCles: [
      "L'UIT coordonne l'attribution des fréquences et positions orbitales entre États.",
      "L'enregistrement passe par l'administration nationale, pas directement par l'opérateur privé.",
      "La coordination vise à prévenir les interférences entre systèmes satellitaires voisins.",
      "Un accès équitable est garanti aux États sans programme spatial établi.",
    ],
    references: [
      {
        type: "Traité",
        titre:
          "Constitution et Convention de l'Union internationale des télécommunications",
        citation: "Règlement des radiocommunications",
        organisme: "UIT",
      },
      {
        type: "Site officiel",
        titre: "Bureau des radiocommunications",
        citation: "Procédures d'enregistrement des fréquences",
        organisme: "UIT",
        url: "https://www.itu.int/fr/ITU-R/Pages/default.aspx",
      },
    ],
    domaine: "droit-spatial",
    categorie: "telecommunications",
    niveau: "Intermédiaire",
    tempsLecture: 5,
    dateMiseAJour: "2026-07-22",
  },
];
