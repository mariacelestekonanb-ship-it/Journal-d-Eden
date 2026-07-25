import type { VeilleItem } from "@/types";

export const veilleItems: VeilleItem[] = [
  {
    slug: "eu-space-act-adoption",
    titre: "L'Union européenne adopte le règlement « EU Space Act »",
    resume:
      "Le nouveau règlement harmonise les régimes d'autorisation pour les opérateurs de satellites et introduit des exigences de durabilité orbitale communes aux 27 États membres.",
    pointsCles: [
      "Harmonisation des régimes d'autorisation nationaux",
      "Obligations renforcées de désorbitation en orbite basse",
      "Entrée en application progressive sur 24 mois",
    ],
    domaine: "droit-spatial",
    categorie: "new-space",
    type: "Règlement",
    date: "2026-07-18",
    dateMiseAJour: "2026-07-22",
    source: "Commission européenne",
    tempsLecture: 6,
    aLaUne: true,
    chronologie: [
      {
        date: "2024-11-05",
        titre: "Présentation de la proposition par la Commission européenne",
        description:
          "La Commission publie un projet de règlement destiné à unifier les régimes nationaux d'autorisation des activités spatiales.",
      },
      {
        date: "2026-03-14",
        titre: "Accord provisoire entre colégislateurs",
        description:
          "Le Parlement européen et le Conseil s'accordent sur un texte de compromis après plusieurs trilogues.",
      },
      {
        date: "2026-07-18",
        titre: "Adoption formelle du règlement",
        description:
          "Le règlement « EU Space Act » est définitivement adopté par les institutions européennes.",
      },
      {
        date: "2026-07-22",
        titre: "Publication au Journal officiel de l'Union européenne",
        description:
          "Le compte à rebours de la période de transition de 24 mois commence à courir.",
      },
    ],
    contexteJuridique: [
      {
        type: "Traité",
        titre: "Traité de l'espace extra-atmosphérique",
        citation: "Article VI, 1967",
        organisme: "Nations Unies",
        url: "https://www.unoosa.org/oosa/fr/ourwork/spacelaw/treaties/outerspacetreaty.html",
      },
      {
        type: "Règlement",
        titre: "EU Space Act",
        citation: "Règlement (UE) 2026/1402",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/homepage.html",
      },
      {
        type: "Site officiel",
        titre: "Stratégie spatiale de l'Union européenne",
        citation: "Direction générale DEFIS",
        organisme: "Commission européenne",
        url: "https://defence-industry-space.ec.europa.eu/",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Après plusieurs années de négociations, l'Union européenne a formellement adopté le règlement dit « EU Space Act », un texte destiné à unifier les régimes nationaux d'autorisation des activités spatiales aujourd'hui fragmentés entre États membres.",
      },
      {
        type: "heading",
        text: "Un socle commun plutôt qu'un droit spatial européen unique",
      },
      {
        type: "paragraph",
        text: "Le règlement instaure un socle commun d'exigences en matière de sécurité, de résilience cyber et de durabilité environnementale, applicable à tout opérateur souhaitant exercer une activité spatiale depuis le territoire de l'Union.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Le règlement ne remplace pas les législations nationales existantes : il fixe un plancher commun que chaque État membre reste libre de compléter.",
      },
      {
        type: "heading",
        text: "La désorbitation, mesure la plus commentée du texte",
      },
      {
        type: "paragraph",
        text: "Parmi les mesures phares figure une obligation de désorbitation en fin de vie pour les satellites en orbite basse, alignée sur les recommandations du Zero Debris Charter porté par l'Agence spatiale européenne.",
      },
      {
        type: "list",
        items: [
          "Obligation de désorbitation en fin de vie pour les satellites en orbite basse",
          "Alignement sur le Zero Debris Charter de l'Agence spatiale européenne",
          "Exigences de résilience cyber applicables à tout opérateur visé",
        ],
      },
      {
        type: "quote",
        text: "Nous ne pouvons plus nous permettre une orbite basse qui devient une décharge technologique.",
        source: "Commissaire européen à la Défense et à l'Espace",
      },
      {
        type: "paragraph",
        text: "Le texte prévoit une période de transition de 24 mois avant son entrée en application complète, le temps que les autorités nationales adaptent leurs procédures de licence existantes.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Les opérateurs déjà titulaires d'une licence nationale devront vérifier, avant la fin de la période de transition, si leur autorisation existante couvre déjà les nouvelles exigences ou nécessite une mise à jour.",
      },
    ],
    impact: {
      juridique: [
        "Les régimes nationaux d'autorisation devront être mis en conformité avec le socle commun dans un délai de 24 mois.",
        "Les opérateurs actuels devront réévaluer leurs licences existantes au regard des nouvelles exigences de désorbitation.",
      ],
      pratique: [
        "Les plans de fin de vie des satellites devront être documentés dès la demande de licence.",
        "Les petites structures du New Space devront anticiper un surcoût de mise en conformité cyber.",
      ],
      institutionnel: [
        "Les autorités nationales de régulation spatiale devront adapter leurs procédures de délivrance de licence.",
        "La Commission européenne se voit confier un rôle de coordination renforcé entre régulateurs nationaux.",
      ],
      economique: [
        "Un allongement ponctuel des délais d'instruction est anticipé pendant la phase de transition.",
        "Le marché européen du désorbitage et du retrait actif de débris devrait bénéficier de la nouvelle obligation.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Texte officiel",
        titre: "Règlement (UE) 2026/1402 établissant l'EU Space Act",
        organisme: "Journal officiel de l'Union européenne",
        url: "https://eur-lex.europa.eu/homepage.html",
      },
      {
        type: "Communiqué",
        titre: "La Commission salue l'adoption du règlement sur l'espace",
        organisme: "Commission européenne",
        url: "https://defence-industry-space.ec.europa.eu/",
      },
      {
        type: "Site officiel",
        titre: "Zero Debris Charter",
        organisme: "Agence spatiale européenne",
        url: "https://www.esa.int/Space_Safety/Zero_Debris",
      },
    ],
  },
  {
    slug: "onu-comite-copuos-ressources",
    titre: "COPUOS : vers un cadre multilatéral sur les ressources lunaires",
    resume:
      "Le Comité des Nations Unies sur les utilisations pacifiques de l'espace extra-atmosphérique avance sur un projet de principes encadrant l'exploitation des ressources lunaires.",
    pointsCles: [
      "Projet de principes non contraignants en discussion",
      "Enjeu du partage des bénéfices entre États",
      "Calendrier accéléré par les missions commerciales lunaires",
    ],
    domaine: "droit-spatial",
    categorie: "exploitation-ressources",
    type: "Institution",
    date: "2026-07-10",
    dateMiseAJour: "2026-07-10",
    source: "ONU - COPUOS",
    tempsLecture: 8,
    aLaUne: true,
    chronologie: [
      {
        date: "2025-06-02",
        titre:
          "Ouverture des travaux du sous-comité juridique sur les ressources spatiales",
      },
      {
        date: "2026-06-25",
        titre: "Présentation d'un projet de principes directeurs",
        description:
          "Le COPUOS examine un texte encore non contraignant sur l'exploitation des ressources lunaires.",
      },
      {
        date: "2026-07-10",
        titre: "Clôture de la session avec un accord de principe partiel",
        description:
          "Les délégations s'accordent pour poursuivre les discussions lors de la prochaine session.",
      },
    ],
    contexteJuridique: [
      {
        type: "Traité",
        titre: "Traité de l'espace extra-atmosphérique",
        citation: "Article II, 1967",
        organisme: "Nations Unies",
        url: "https://www.unoosa.org/oosa/fr/ourwork/spacelaw/treaties/outerspacetreaty.html",
      },
      {
        type: "Convention",
        titre: "Accord régissant les activités des États sur la Lune",
        citation: "Article 11, 1979",
        organisme: "Nations Unies",
        url: "https://www.unoosa.org/oosa/fr/ourwork/spacelaw/treaties/moon-agreement.html",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Réuni à Vienne, le Comité des Nations Unies sur les utilisations pacifiques de l'espace extra-atmosphérique (COPUOS) a examiné un projet de principes directeurs pour l'exploitation des ressources spatiales.",
      },
      {
        type: "heading",
        text: "Un principe de non-appropriation difficile à concilier avec l'exploitation commerciale",
      },
      {
        type: "paragraph",
        text: "Ce texte, encore non contraignant, cherche à concilier les approches unilatérales déjà adoptées par certains États avec la nécessité d'un cadre international minimal, notamment sur le partage des bénéfices et la prévention des conflits d'usage.",
      },
      {
        type: "list",
        items: [
          "Partage des bénéfices tirés de l'exploitation des ressources",
          "Prévention des conflits d'usage entre missions concurrentes",
          "Articulation avec les législations nationales déjà adoptées (États-Unis, Luxembourg, Japon)",
        ],
      },
      {
        type: "paragraph",
        text: "Plusieurs délégations ont souligné l'urgence d'aboutir avant l'intensification des missions commerciales visant l'extraction de glace et de régolithe lunaire prévues d'ici la fin de la décennie.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Un « principe directeur » adopté par le COPUOS n'a pas la force obligatoire d'un traité : il s'agit d'une déclaration politique destinée à orienter les pratiques étatiques.",
      },
      {
        type: "paragraph",
        text: "Les discussions se poursuivront lors de la prochaine session du sous-comité juridique, avec pour objectif une adoption de principes de haut niveau, préalable possible à un futur traité.",
      },
    ],
    impact: {
      juridique: [
        "Les principes en discussion pourraient servir de référence interprétative de l'article II du Traité de l'espace, sans le modifier formellement.",
        "Les États ayant déjà légiféré unilatéralement devront évaluer la compatibilité de leur droit interne avec les futurs principes.",
      ],
      institutionnel: [
        "Le sous-comité juridique du COPUOS voit son rôle de forum de négociation renforcé face à la multiplication des initiatives bilatérales.",
        "Une pression accrue s'exerce sur le COPUOS pour aboutir avant l'intensification des missions commerciales.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "Sous-comité juridique du COPUOS",
        organisme: "Bureau des affaires spatiales des Nations Unies (UNOOSA)",
        url: "https://www.unoosa.org/oosa/fr/ourwork/copuos/lsc/index.html",
      },
      {
        type: "Communiqué",
        titre: "Compte rendu de la session du COPUOS",
        organisme: "UNOOSA",
        url: "https://www.unoosa.org/oosa/fr/ourwork/copuos/index.html",
      },
    ],
  },
  {
    slug: "fcc-regles-debris-2026",
    titre: "La FCC renforce ses règles de désorbitation à cinq ans",
    resume:
      "La Federal Communications Commission précise les modalités d'application de sa règle de désorbitation accélérée pour les satellites en orbite basse.",
    pointsCles: [
      "Clarification du calcul du délai de cinq ans",
      "Plan de désorbitation exigé dès la licence",
      "Exemptions limitées aux missions scientifiques",
    ],
    domaine: "droit-spatial",
    categorie: "debris-spatiaux",
    type: "Règlement",
    date: "2026-06-29",
    dateMiseAJour: "2026-06-29",
    source: "FCC",
    tempsLecture: 5,
    chronologie: [
      {
        date: "2022-09-29",
        titre: "Adoption de la règle initiale des « cinq ans » par la FCC",
      },
      {
        date: "2026-04-11",
        titre:
          "Ouverture d'une consultation publique sur les modalités d'application",
      },
      {
        date: "2026-06-29",
        titre:
          "Publication des lignes directrices précisant le calcul du délai",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règle de désorbitation post-mission à cinq ans",
        citation: "47 C.F.R. § 25.283",
        organisme: "Federal Communications Commission",
        url: "https://www.fcc.gov/space",
      },
      {
        type: "Loi",
        titre: "Communications Act",
        citation: "47 U.S.C. § 301",
        organisme: "Congrès des États-Unis",
        url: "https://www.fcc.gov/general/communications-act-1934",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "La Federal Communications Commission (FCC) a publié des précisions attendues sur l'application de sa règle dite des « cinq ans », qui impose la désorbitation des satellites en fin de mission dans ce délai après la fin des opérations.",
      },
      {
        type: "paragraph",
        text: "Les nouvelles lignes directrices clarifient les modalités de calcul du délai pour les constellations multi-satellites et les cas d'exemption pour les missions scientifiques ou gouvernementales.",
      },
      {
        type: "list",
        items: [
          "Calcul du délai pour les constellations multi-satellites",
          "Exemptions limitées aux missions scientifiques ou gouvernementales",
          "Plan de désorbitation exigé dès la demande de licence",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "L'absence de plan de désorbitation détaillé dans le dossier de licence peut désormais justifier un refus d'autorisation par la FCC.",
      },
      {
        type: "paragraph",
        text: "Les opérateurs devront désormais fournir un plan de désorbitation détaillé dès la demande de licence, incluant une estimation de la probabilité de succès de la manœuvre finale.",
      },
    ],
    impact: {
      juridique: [
        "Les opérateurs devront intégrer un plan de désorbitation dès le dépôt de leur demande de licence.",
        "La FCC dispose désormais d'un cadre d'interprétation plus précis pour apprécier la conformité des dossiers.",
      ],
      pratique: [
        "Les constellations multi-satellites devront documenter un calendrier de désorbitation par lot plutôt que par satellite isolé.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Texte officiel",
        titre: "Lignes directrices sur la désorbitation post-mission",
        organisme: "Federal Communications Commission",
        url: "https://www.fcc.gov/space",
      },
      {
        type: "Site officiel",
        titre: "FCC Space Bureau",
        organisme: "Federal Communications Commission",
        url: "https://www.fcc.gov/space",
      },
    ],
  },
  {
    slug: "ai-act-codes-conduite",
    titre:
      "AI Act : publication des codes de conduite pour les modèles à usage général",
    resume:
      "La Commission européenne publie les lignes directrices attendues par les fournisseurs de modèles d'IA à usage général soumis aux obligations de transparence.",
    pointsCles: [
      "Codes de conduite pour les modèles à usage général",
      "Présomption de conformité pour les signataires",
      "Focus sur la transparence des données d'entraînement",
    ],
    domaine: "droit-numerique",
    categorie: "intelligence-artificielle",
    type: "Institution",
    date: "2026-07-20",
    dateMiseAJour: "2026-07-20",
    source: "Commission européenne",
    tempsLecture: 7,
    aLaUne: true,
    chronologie: [
      { date: "2024-08-01", titre: "Entrée en vigueur de l'AI Act" },
      {
        date: "2025-08-02",
        titre:
          "Entrée en application des obligations pour les modèles à usage général",
      },
      {
        date: "2026-07-20",
        titre: "Publication des codes de conduite sectoriels",
        description:
          "La Commission publie les lignes directrices attendues par les fournisseurs de modèles à usage général.",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement sur l'intelligence artificielle (AI Act)",
        citation: "Règlement (UE) 2024/1689, art. 53",
        organisme: "Union européenne",
        url: "https://digital-strategy.ec.europa.eu/fr/policies/regulatory-framework-ai",
      },
      {
        type: "Directive",
        titre:
          "Directive sur le droit d'auteur dans le marché unique numérique",
        citation: "Directive (UE) 2019/790, art. 4",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32019L0790",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "La Commission européenne a publié les codes de conduite destinés à guider les fournisseurs de modèles d'intelligence artificielle à usage général dans l'application de leurs obligations de transparence issues de l'AI Act.",
      },
      {
        type: "paragraph",
        text: "Ces codes précisent notamment le contenu attendu de la documentation technique, les modalités de résumé des données d'entraînement protégées par le droit d'auteur, et les engagements en matière de sécurité pour les modèles présentant un risque systémique.",
      },
      {
        type: "heading",
        text: "Une conformité volontaire mais fortement incitée",
      },
      {
        type: "paragraph",
        text: "Les fournisseurs qui adhèrent volontairement à ces codes bénéficieront d'une présomption de conformité facilitant leurs relations avec les autorités de surveillance du marché.",
      },
      {
        type: "quote",
        text: "Adhérer au code n'est pas une obligation légale, mais cela crée une présomption de conformité qui simplifie considérablement le dialogue avec les autorités.",
        source: "Représentant de la Commission européenne",
      },
      {
        type: "list",
        items: [
          "Documentation technique attendue par les fournisseurs de modèles",
          "Résumé des données d'entraînement protégées par le droit d'auteur",
          "Engagements de sécurité pour les modèles à risque systémique",
        ],
      },
      {
        type: "paragraph",
        text: "Les organisations de la société civile ont salué l'avancée tout en regrettant l'absence de mécanisme de sanction spécifique en cas de non-respect des engagements pris dans le cadre du code.",
      },
    ],
    impact: {
      juridique: [
        "Les signataires bénéficient d'une présomption de conformité facilitant leurs relations avec les autorités de surveillance du marché.",
        "L'absence de sanction spécifique laisse une incertitude sur la portée réelle des engagements pris.",
      ],
      pratique: [
        "Les fournisseurs devront produire une documentation technique standardisée dès la mise sur le marché d'un nouveau modèle.",
      ],
      economique: [
        "Les petits fournisseurs de modèles pourraient supporter un coût de mise en conformité disproportionné par rapport aux grands acteurs déjà dotés d'équipes juridiques dédiées.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Texte officiel",
        titre: "Code de conduite pour les modèles d'IA à usage général",
        organisme: "Commission européenne",
        url: "https://digital-strategy.ec.europa.eu/fr/policies/regulatory-framework-ai",
      },
      {
        type: "Site officiel",
        titre: "Bureau de l'IA",
        organisme: "Commission européenne",
        url: "https://digital-strategy.ec.europa.eu/fr/policies/ai-office",
      },
    ],
  },
  {
    slug: "cnil-sanction-cookies",
    titre: "La CNIL sanctionne deux éditeurs pour manquement au consentement",
    resume:
      "Deux sociétés françaises écopent d'amendes pour défaut de recueil valable du consentement aux traceurs publicitaires.",
    pointsCles: [
      "Deux sanctions financières prononcées",
      "Absence de symétrie entre accepter et refuser",
      "Rappel de la charge de la preuve du consentement",
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    type: "Décision",
    date: "2026-07-14",
    dateMiseAJour: "2026-07-14",
    source: "CNIL",
    tempsLecture: 4,
    chronologie: [
      {
        date: "2025-11-18",
        titre: "Contrôles menés par la CNIL auprès des deux éditeurs",
      },
      {
        date: "2026-05-06",
        titre: "Notification des griefs aux sociétés mises en cause",
      },
      {
        date: "2026-07-14",
        titre: "Prononcé des sanctions par la formation restreinte de la CNIL",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement général sur la protection des données (RGPD)",
        citation: "Règlement (UE) 2016/679, art. 6 et 7",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679",
      },
      {
        type: "Loi",
        titre: "Loi Informatique et Libertés",
        citation: "Article 82",
        organisme: "République française",
        url: "https://www.cnil.fr/fr/la-loi-informatique-et-libertes",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "La Commission nationale de l'informatique et des libertés (CNIL) a prononcé deux sanctions financières à l'encontre d'éditeurs de sites web pour manquement aux règles applicables aux cookies et traceurs.",
      },
      {
        type: "paragraph",
        text: "Les contrôles ont révélé l'absence d'un mécanisme de refus aussi simple que celui d'acceptation, ainsi que le dépôt de traceurs publicitaires avant tout recueil du consentement de l'utilisateur.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Un bouton « Tout refuser » doit être aussi visible et accessible en un clic qu'un bouton « Tout accepter » : une asymétrie de parcours suffit à caractériser un défaut de consentement valable.",
      },
      {
        type: "paragraph",
        text: "La CNIL rappelle que le consentement doit être libre, spécifique, éclairé et univoque, et que sa preuve incombe à l'éditeur du site en cas de contrôle.",
      },
      {
        type: "list",
        items: [
          "Le consentement doit être libre, spécifique, éclairé et univoque",
          "La preuve du consentement incombe à l'éditeur du site",
          "Le dépôt de traceurs avant recueil du consentement est prohibé",
        ],
      },
    ],
    impact: {
      juridique: [
        "La décision confirme l'exigence de symétrie entre acceptation et refus des cookies non essentiels.",
        "La charge de la preuve du consentement continue de peser sur l'éditeur, non sur l'internaute.",
      ],
      pratique: [
        "Les éditeurs de sites doivent auditer leurs bandeaux cookies existants pour vérifier l'équivalence visuelle entre accepter et refuser.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Communiqué",
        titre: "Délibération de la formation restreinte",
        organisme: "CNIL",
        url: "https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil",
      },
      {
        type: "Site officiel",
        titre: "Lignes directrices sur les cookies et traceurs",
        organisme: "CNIL",
        url: "https://www.cnil.fr/fr/cookies-et-autres-traceurs",
      },
    ],
  },
  {
    slug: "nis2-transposition-etats",
    titre: "NIS 2 : où en est la transposition dans les États membres ?",
    resume:
      "Panorama de l'avancement de la transposition de la directive NIS 2 et des divergences observées sur le périmètre des entités essentielles.",
    pointsCles: [
      "Transposition inégale selon les États membres",
      "Divergences sur le périmètre des entités essentielles",
      "Rapport de suivi de l'ENISA attendu",
    ],
    domaine: "droit-numerique",
    categorie: "cybersecurite",
    type: "Institution",
    date: "2026-07-05",
    dateMiseAJour: "2026-07-05",
    source: "ENISA",
    tempsLecture: 9,
    chronologie: [
      { date: "2022-12-27", titre: "Adoption de la directive NIS 2" },
      {
        date: "2024-10-17",
        titre: "Date limite de transposition dans les droits nationaux",
      },
      {
        date: "2026-07-05",
        titre: "Publication du panorama de transposition par l'ENISA",
      },
    ],
    contexteJuridique: [
      {
        type: "Directive",
        titre: "Directive sur la cybersécurité (NIS 2)",
        citation: "Directive (UE) 2022/2555",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32022L2555",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Plus de deux ans après son adoption, la directive NIS 2 continue de faire l'objet d'une transposition inégale selon les États membres de l'Union européenne.",
      },
      {
        type: "paragraph",
        text: "Certains pays ont opté pour une définition extensive des « entités essentielles », incluant des acteurs de taille intermédiaire, tandis que d'autres retiennent une lecture plus restrictive limitée aux grands opérateurs d'infrastructures critiques.",
      },
      {
        type: "list",
        items: [
          "Définition extensive des entités essentielles dans certains États",
          "Lecture restrictive limitée aux grands opérateurs dans d'autres",
          "Risque de distorsion de concurrence entre opérateurs selon leur État d'établissement",
        ],
      },
      {
        type: "paragraph",
        text: "L'ENISA appelle à une convergence accrue afin d'éviter une fragmentation du marché intérieur et des distorsions de concurrence entre opérateurs soumis à des obligations différentes selon leur État d'établissement.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Une entreprise opérant dans plusieurs États membres peut se retrouver soumise à des obligations différentes selon le pays où chacune de ses filiales est établie.",
      },
      {
        type: "paragraph",
        text: "Un rapport de suivi complet est attendu avant la fin de l'année, incluant des recommandations spécifiques pour les secteurs de l'énergie, de la santé et des infrastructures numériques.",
      },
    ],
    impact: {
      juridique: [
        "Les entreprises actives dans plusieurs États membres doivent vérifier leur qualification d'entité essentielle ou importante pays par pays.",
        "Une harmonisation ultérieure de la Commission pourrait redéfinir le périmètre actuel.",
      ],
      institutionnel: [
        "L'ENISA renforce son rôle de suivi et de recommandation auprès des États membres.",
        "Les autorités nationales de cybersécurité voient leurs pouvoirs de contrôle diverger selon la transposition retenue.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Texte officiel",
        titre: "Rapport de suivi de la transposition de NIS 2",
        organisme: "ENISA",
        url: "https://www.enisa.europa.eu/",
      },
      {
        type: "Site officiel",
        titre: "Portail NIS 2",
        organisme: "Agence de l'Union européenne pour la cybersécurité (ENISA)",
        url: "https://www.enisa.europa.eu/topics/nis-directive",
      },
    ],
  },
  {
    slug: "dma-amende-gatekeeper",
    titre: "DMA : nouvelle amende record contre un contrôleur d'accès",
    resume:
      "La Commission européenne inflige une amende pour non-respect des obligations d'interopérabilité imposées par le Digital Markets Act.",
    pointsCles: [
      "Amende record au titre du Digital Markets Act",
      "Violation des obligations d'interopérabilité",
      "Signal fort envoyé aux autres contrôleurs d'accès",
    ],
    domaine: "droit-numerique",
    categorie: "plateformes-numeriques",
    type: "Décision",
    date: "2026-06-22",
    dateMiseAJour: "2026-06-22",
    source: "Commission européenne",
    tempsLecture: 6,
    chronologie: [
      {
        date: "2025-03-10",
        titre: "Ouverture d'une enquête formelle par la Commission européenne",
      },
      {
        date: "2026-02-18",
        titre: "Notification des griefs à l'entreprise concernée",
      },
      { date: "2026-06-22", titre: "Prononcé de l'amende record" },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement sur les marchés numériques (DMA)",
        citation: "Règlement (UE) 2022/1925, art. 6",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32022R1925",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "La Commission européenne a infligé une amende record à un contrôleur d'accès désigné au titre du Digital Markets Act, pour non-respect de ses obligations d'interopérabilité avec des services tiers.",
      },
      {
        type: "paragraph",
        text: "L'enquête a établi que l'entreprise avait maintenu des restrictions techniques limitant l'accès des développeurs tiers à des fonctionnalités essentielles de sa plateforme, en violation de l'article 6 du règlement.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Le montant de l'amende peut atteindre jusqu'à 10 % du chiffre d'affaires mondial annuel de l'entreprise, et jusqu'à 20 % en cas de récidive.",
      },
      {
        type: "paragraph",
        text: "Cette décision, la plus lourde prononcée à ce jour au titre du DMA, est présentée par la Commission comme un signal fort adressé à l'ensemble des contrôleurs d'accès désignés.",
      },
      {
        type: "list",
        items: [
          "Restrictions techniques limitant l'accès des développeurs tiers",
          "Violation de l'obligation d'interopérabilité de l'article 6",
          "Sanction la plus lourde prononcée à ce jour au titre du DMA",
        ],
      },
    ],
    impact: {
      juridique: [
        "La décision précise la portée concrète de l'obligation d'interopérabilité de l'article 6 du DMA.",
        "Elle constitue un précédent pour l'appréciation du montant des sanctions futures.",
      ],
      institutionnel: [
        "La Commission européenne affirme sa capacité de mise en œuvre effective du DMA au-delà de la phase de désignation.",
      ],
      economique: [
        "Le marché s'attend à une réévaluation des provisions pour risque réglementaire chez les autres contrôleurs d'accès désignés.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Communiqué",
        titre: "La Commission inflige une amende au titre du DMA",
        organisme: "Commission européenne",
        url: "https://digital-markets-act.ec.europa.eu/index_fr",
      },
      {
        type: "Site officiel",
        titre: "Digital Markets Act — page officielle",
        organisme: "Commission européenne",
        url: "https://digital-markets-act.ec.europa.eu/index_fr",
      },
    ],
  },
  {
    slug: "artemis-accords-nouveaux-signataires",
    titre: "Les Accords Artemis accueillent trois nouveaux pays signataires",
    resume:
      "L'extension des Accords Artemis illustre la montée en puissance du cadre bilatéral américain face aux instances multilatérales onusiennes.",
    pointsCles: [
      "Trois nouveaux signataires des Accords Artemis",
      "Cadre bilatéral non contraignant mais structurant",
      "Tension potentielle avec un futur cadre multilatéral",
    ],
    domaine: "droit-spatial",
    categorie: "traites-spatiaux",
    type: "Convention",
    date: "2026-06-15",
    dateMiseAJour: "2026-06-15",
    source: "NASA",
    tempsLecture: 5,
    chronologie: [
      {
        date: "2020-10-13",
        titre:
          "Signature initiale des Accords Artemis par huit pays fondateurs",
      },
      {
        date: "2026-06-15",
        titre: "Adhésion de trois nouveaux pays signataires",
      },
    ],
    contexteJuridique: [
      {
        type: "Traité",
        titre: "Traité de l'espace extra-atmosphérique",
        citation: "Article IX, 1967",
        organisme: "Nations Unies",
        url: "https://www.unoosa.org/oosa/fr/ourwork/spacelaw/treaties/outerspacetreaty.html",
      },
      {
        type: "Convention",
        titre: "Accords Artemis",
        citation: "Principes de coopération lunaire, 2020",
        organisme: "NASA",
        url: "https://www.nasa.gov/artemis-accords/",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Trois nouveaux pays ont rejoint les Accords Artemis, portant à plusieurs dizaines le nombre total de signataires de ce cadre porté par les États-Unis pour la coopération lunaire.",
      },
      {
        type: "paragraph",
        text: "Ces accords, non contraignants au sens du droit international classique, formalisent des engagements communs sur la transparence des opérations, l'interopérabilité des systèmes et la prévention des interférences nuisibles entre missions.",
      },
      {
        type: "list",
        items: [
          "Transparence des opérations déclarées",
          "Interopérabilité des systèmes entre missions partenaires",
          "Prévention des interférences nuisibles",
        ],
      },
      {
        type: "paragraph",
        text: "Leur succès croissant illustre la montée en puissance d'un cadre bilatéral et volontaire, en parallèle des discussions plus lentes menées au sein du COPUOS pour élaborer un régime multilatéral.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Les Accords Artemis ne créent pas d'obligations de droit international au sens classique : ce sont des engagements politiques bilatéraux entre chaque signataire et les États-Unis.",
      },
      {
        type: "paragraph",
        text: "Certains observateurs s'interrogent toutefois sur la cohérence à terme entre ces engagements bilatéraux et un éventuel cadre onusien plus contraignant.",
      },
    ],
    impact: {
      juridique: [
        "Les nouveaux signataires s'engagent politiquement sans modifier leurs obligations issues du Traité de l'espace.",
        "La multiplication des signataires renforce la valeur de précédent des principes des Accords Artemis.",
      ],
      institutionnel: [
        "Le cadre bilatéral porté par la NASA gagne en légitimité face à la lenteur des négociations multilatérales au COPUOS.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "Texte des Accords Artemis",
        organisme: "NASA",
        url: "https://www.nasa.gov/artemis-accords/",
      },
      {
        type: "Communiqué",
        titre: "Trois nouveaux pays rejoignent les Accords Artemis",
        organisme: "NASA",
        url: "https://www.nasa.gov/artemis-accords/",
      },
    ],
  },
  {
    slug: "cjue-droit-a-loubli-referencement",
    titre:
      "La CJUE précise la portée du droit à l'oubli face aux moteurs de recherche",
    resume:
      "La Cour de justice de l'Union européenne clarifie les conditions dans lesquelles un moteur de recherche doit déréférencer un contenu à la demande d'une personne concernée.",
    pointsCles: [
      "Le déréférencement suppose une mise en balance des intérêts en présence",
      "La charge de la preuve pèse sur la personne demandant le déréférencement",
      "La décision confirme et précise la jurisprudence Google Spain de 2014",
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    type: "Jurisprudence",
    date: "2026-07-16",
    dateMiseAJour: "2026-07-16",
    source: "Cour de justice de l'Union européenne",
    tempsLecture: 6,
    chronologie: [
      {
        date: "2014-05-13",
        titre: "Arrêt Google Spain fondateur du droit au déréférencement",
      },
      {
        date: "2025-01-22",
        titre:
          "Question préjudicielle posée à la CJUE par une juridiction nationale",
      },
      {
        date: "2026-07-16",
        titre: "Prononcé de l'arrêt précisant la portée du droit à l'oubli",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement général sur la protection des données (RGPD)",
        citation: "Règlement (UE) 2016/679, art. 17",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679",
      },
      {
        type: "Jurisprudence",
        titre: "Google Spain SL et Google Inc. c. AEPD",
        citation: "CJUE, aff. C-131/12, 13 mai 2014",
        organisme: "Cour de justice de l'Union européenne",
        url: "https://curia.europa.eu/",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Dans un arrêt très attendu, la Cour de justice de l'Union européenne (CJUE) est venue préciser l'articulation entre le droit à l'oubli reconnu par le RGPD et la liberté d'information du public.",
      },
      {
        type: "paragraph",
        text: "La Cour rappelle que le déréférencement n'est pas automatique : il suppose une mise en balance entre l'intérêt de la personne concernée et l'intérêt légitime du public à accéder à l'information, notamment lorsque la personne exerce une fonction publique.",
      },
      {
        type: "quote",
        text: "Le droit à l'oubli n'est pas un droit à réécrire l'histoire : il suppose une mise en balance concrète avec l'intérêt légitime du public à l'information.",
        source: "Cour de justice de l'Union européenne",
      },
      {
        type: "paragraph",
        text: "L'arrêt précise également la charge de la preuve : c'est à la personne demandant le déréférencement d'établir que les données sont devenues inexactes, inadéquates ou excessives au regard des finalités du traitement.",
      },
      {
        type: "list",
        items: [
          "Mise en balance entre intérêt de la personne concernée et intérêt du public",
          "Charge de la preuve pesant sur le demandeur du déréférencement",
          "Traitement différencié pour les personnes exerçant une fonction publique",
        ],
      },
      {
        type: "paragraph",
        text: "Cette décision s'inscrit dans la lignée de la jurisprudence Google Spain (2014), qu'elle vient affiner sans la remettre en cause.",
      },
    ],
    impact: {
      juridique: [
        "L'arrêt précise la répartition de la charge de la preuve entre le demandeur et le moteur de recherche.",
        "Il confirme que les personnes publiques bénéficient d'une protection atténuée du droit à l'oubli.",
      ],
      pratique: [
        "Les moteurs de recherche devront documenter plus systématiquement leur analyse de mise en balance des intérêts pour chaque demande de déréférencement.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Document PDF",
        titre: "Texte intégral de l'arrêt",
        organisme: "Cour de justice de l'Union européenne",
        url: "https://curia.europa.eu/",
      },
      {
        type: "Site officiel",
        titre: "CURIA — Jurisprudence de la Cour",
        organisme: "Cour de justice de l'Union européenne",
        url: "https://curia.europa.eu/",
      },
    ],
  },
  {
    slug: "commercial-space-launch-act-mise-a-jour",
    titre: "Les États-Unis actualisent le Commercial Space Launch Act",
    resume:
      "Le Congrès américain adopte une révision du cadre légal encadrant les licences de lancement, pour l'adapter à la cadence des vols commerciaux.",
    pointsCles: [
      "Procédure de licence simplifiée pour les lancements en série",
      "Exigences d'assurance renforcées pour les missions à fort trafic",
      "Premier texte structurant depuis les amendements de 2015",
    ],
    domaine: "droit-spatial",
    categorie: "new-space",
    type: "Loi",
    date: "2026-06-10",
    dateMiseAJour: "2026-06-10",
    source: "Congrès des États-Unis",
    tempsLecture: 5,
    chronologie: [
      {
        date: "1984-01-01",
        titre: "Adoption du Commercial Space Launch Act d'origine",
      },
      {
        date: "2015-11-25",
        titre:
          "Amendements de 2015 sur la reconnaissance des droits sur les ressources extraites",
      },
      {
        date: "2026-06-10",
        titre: "Adoption de la révision actuelle par le Congrès",
      },
    ],
    contexteJuridique: [
      {
        type: "Loi",
        titre: "Commercial Space Launch Act",
        citation: "51 U.S.C. § 50901 et s.",
        organisme: "Congrès des États-Unis",
        url: "https://www.faa.gov/space",
      },
      {
        type: "Règlement",
        titre: "Règle de désorbitation post-mission à cinq ans",
        citation: "47 C.F.R. § 25.283",
        organisme: "Federal Communications Commission",
        url: "https://www.fcc.gov/space",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Le Congrès des États-Unis a adopté une révision du Commercial Space Launch Act, texte fondateur de l'encadrement des activités spatiales commerciales depuis 1984.",
      },
      {
        type: "paragraph",
        text: "La révision simplifie la procédure de licence pour les opérateurs réalisant un grand nombre de lancements similaires, en introduisant un régime d'autorisation par lot plutôt qu'un examen systématique vol par vol.",
      },
      {
        type: "list",
        items: [
          "Régime d'autorisation par lot pour les lancements en série",
          "Exigences de couverture assurantielle renforcées pour les missions à fort trafic",
          "Cohérence recherchée avec les recommandations de la FCC sur les débris",
        ],
      },
      {
        type: "paragraph",
        text: "Elle renforce en parallèle les exigences de couverture assurantielle pour les missions à forte densité de trafic orbital, en cohérence avec les recommandations de la FCC sur la limitation des débris.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Un allègement du contrôle vol par vol suppose, en contrepartie, une fiabilité accrue des dossiers déposés en amont : une erreur dans un dossier de lot peut désormais affecter plusieurs lancements à la fois.",
      },
      {
        type: "paragraph",
        text: "Les associations professionnelles saluent une simplification attendue, tandis que certains observateurs s'inquiètent d'un allègement du contrôle au cas par cas.",
      },
    ],
    impact: {
      juridique: [
        "La procédure de licence par lot modifie la manière dont la responsabilité de l'opérateur est appréciée en cas d'incident sur l'un des vols du lot.",
      ],
      pratique: [
        "Les opérateurs réalisant des lancements répétitifs similaires bénéficient d'un allègement procédural significatif.",
      ],
      economique: [
        "La simplification attendue devrait réduire les délais et coûts de mise sur le marché pour les opérateurs à cadence élevée.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Texte officiel",
        titre: "Commercial Space Launch Act (texte consolidé)",
        organisme: "Federal Aviation Administration",
        url: "https://www.faa.gov/space",
      },
      {
        type: "Site officiel",
        titre: "FAA Office of Commercial Space Transportation",
        organisme: "Federal Aviation Administration",
        url: "https://www.faa.gov/space",
      },
    ],
  },
  {
    slug: "uit-conference-mondiale-radiocommunications",
    titre: "L'UIT ouvre la Conférence mondiale des radiocommunications 2027",
    resume:
      "L'Union internationale des télécommunications réunit ses États membres pour réviser l'attribution des bandes de fréquences satellitaires.",
    pointsCles: [
      "Révision de l'attribution des fréquences aux constellations en orbite basse",
      "Enjeu d'accès équitable pour les pays sans programme spatial établi",
      "Conclusions attendues fin 2027",
    ],
    domaine: "droit-spatial",
    categorie: "telecommunications",
    type: "Institution",
    date: "2026-05-18",
    dateMiseAJour: "2026-05-18",
    source: "UIT",
    tempsLecture: 4,
    chronologie: [
      {
        date: "2023-11-15",
        titre:
          "Clôture de la précédente Conférence mondiale des radiocommunications (CMR-23)",
      },
      {
        date: "2026-05-18",
        titre: "Ouverture des travaux préparatoires de la CMR-27",
      },
    ],
    contexteJuridique: [
      {
        type: "Traité",
        titre:
          "Constitution et Convention de l'Union internationale des télécommunications",
        citation: "Actes de 1992, révisés",
        organisme: "UIT",
        url: "https://www.itu.int/fr/ITU-R/Pages/default.aspx",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "L'Union internationale des télécommunications (UIT) a ouvert les travaux préparatoires de sa Conférence mondiale des radiocommunications, qui se tiendra en 2027.",
      },
      {
        type: "paragraph",
        text: "Les discussions porteront notamment sur l'attribution de nouvelles bandes de fréquences aux constellations de satellites en orbite basse, dont le nombre a fortement crû depuis la dernière conférence.",
      },
      {
        type: "list",
        items: [
          "Attribution de nouvelles bandes de fréquences aux constellations en orbite basse",
          "Accès équitable au spectre et aux positions géostationnaires",
          "Concentration croissante des dépôts de fréquences par quelques acteurs",
        ],
      },
      {
        type: "paragraph",
        text: "Plusieurs délégations de pays en développement ont rappelé l'importance de préserver un accès équitable au spectre et aux positions orbitales géostationnaires, face à la concentration croissante des dépôts de fréquences.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Le principe du « premier arrivé, premier servi » appliqué aux dépôts de fréquences favorise structurellement les opérateurs déjà établis face aux nouveaux entrants.",
      },
      {
        type: "paragraph",
        text: "Les conclusions de la conférence, attendues fin 2027, façonneront le cadre technique international pour la décennie à venir.",
      },
    ],
    impact: {
      institutionnel: [
        "Les conclusions attendues fin 2027 fixeront le cadre technique international pour la décennie à venir.",
        "Les pays en développement demandent une réforme des règles de priorité dans l'attribution du spectre.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "Conférence mondiale des radiocommunications",
        organisme: "Union internationale des télécommunications",
        url: "https://www.itu.int/fr/ITU-R/Pages/default.aspx",
      },
      {
        type: "Communiqué",
        titre: "Ouverture des travaux préparatoires de la CMR-27",
        organisme: "UIT",
        url: "https://www.itu.int/fr/ITU-R/Pages/default.aspx",
      },
    ],
  },
  {
    slug: "edpb-lignes-directrices-transferts-internationaux",
    titre:
      "L'EDPB adopte des lignes directrices sur les transferts internationaux de données",
    resume:
      "Le Comité européen de la protection des données précise les garanties attendues pour les transferts de données personnelles hors de l'Union européenne.",
    pointsCles: [
      "Garanties supplémentaires attendues en l'absence de décision d'adéquation",
      "Méthodologie d'évaluation du risque lié au cadre légal du pays tiers",
      "Lignes directrices non contraignantes mais suivies par les autorités nationales",
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    type: "Institution",
    date: "2026-07-23",
    dateMiseAJour: "2026-07-23",
    source: "EDPB",
    tempsLecture: 5,
    chronologie: [
      {
        date: "2020-07-16",
        titre: "Arrêt Schrems II invalidant le Privacy Shield",
      },
      {
        date: "2026-04-09",
        titre: "Ouverture d'une consultation publique par l'EDPB",
      },
      {
        date: "2026-07-23",
        titre: "Adoption des lignes directrices définitives",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement général sur la protection des données (RGPD)",
        citation: "Règlement (UE) 2016/679, art. 46",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679",
      },
      {
        type: "Jurisprudence",
        titre: "Data Protection Commissioner c. Facebook Ireland et Schrems",
        citation: "CJUE, aff. C-311/18, 16 juillet 2020",
        organisme: "Cour de justice de l'Union européenne",
        url: "https://curia.europa.eu/",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Le Comité européen de la protection des données (EDPB), qui réunit les autorités de protection des données des États membres, a adopté de nouvelles lignes directrices sur les transferts internationaux de données.",
      },
      {
        type: "paragraph",
        text: "Ces lignes directrices précisent les garanties supplémentaires attendues des exportateurs de données lorsque le pays destinataire ne bénéficie pas d'une décision d'adéquation de la Commission européenne.",
      },
      {
        type: "list",
        items: [
          "Garanties supplémentaires en l'absence de décision d'adéquation",
          "Méthodologie d'évaluation du risque lié au cadre légal du pays tiers",
          "Accès aux données par les autorités publiques du pays destinataire",
        ],
      },
      {
        type: "paragraph",
        text: "L'EDPB détaille notamment une méthodologie d'évaluation du risque tenant compte du cadre légal local d'accès aux données par les autorités publiques du pays tiers.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Ces lignes directrices ne sont pas juridiquement contraignantes, mais les autorités nationales de protection des données s'y réfèrent systématiquement lors de leurs contrôles.",
      },
      {
        type: "paragraph",
        text: "Ce texte, non contraignant au sens strict, est cependant suivi de près par les autorités nationales de protection des données dans leurs contrôles.",
      },
    ],
    impact: {
      juridique: [
        "Les exportateurs de données devront documenter une évaluation du risque pays par pays plutôt qu'une clause contractuelle type générique.",
        "Le standard fixé par l'EDPB pourrait être repris par les juridictions nationales en cas de contentieux.",
      ],
      pratique: [
        "Les entreprises transférant des données hors de l'Union devront réviser leurs analyses d'impact existantes à la lumière de la nouvelle méthodologie.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Texte officiel",
        titre:
          "Lignes directrices sur les transferts internationaux de données",
        organisme: "Comité européen de la protection des données (EDPB)",
        url: "https://www.edpb.europa.eu/",
      },
      {
        type: "Site officiel",
        titre: "European Data Protection Board",
        organisme: "EDPB",
        url: "https://www.edpb.europa.eu/",
      },
    ],
  },
];
