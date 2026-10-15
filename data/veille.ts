import type { VeilleItem } from "@/types";

/**
 * Chaque analyse ci-dessous est construite à partir d'une recherche
 * documentaire réelle (octobre 2026) et sourcée en conséquence — contexte
 * détaillé dans l'audit de contenu du même mois. Quand un détail précis
 * (numéro d'affaire, date exacte) n'a pas pu être confirmé auprès d'une
 * source primaire, l'analyse le dit explicitement plutôt que de l'inventer.
 */
export const veilleItems: VeilleItem[] = [
  {
    slug: "dma-amende-google-890-millions",
    titre: "DMA : la Commission inflige 890 millions d'euros à Google",
    resume:
      "La Commission européenne sanctionne Google pour deux manquements au Digital Markets Act : l'auto-préférence de ses services dans la recherche et les restrictions imposées aux développeurs sur Google Play.",
    pointsCles: [
      "460 millions d'euros pour l'auto-préférence dans Google Search",
      "430 millions d'euros pour les restrictions de « steering » sur Google Play",
      "60 jours pour se mettre en conformité, sous peine d'astreintes",
    ],
    domaine: "droit-numerique",
    categorie: "plateformes-numeriques",
    type: "Décision",
    date: "2026-07-23",
    dateMiseAJour: "2026-07-23",
    source: "Commission européenne",
    tempsLecture: 6,
    aLaUne: true,
    chronologie: [
      {
        date: "2024-05-07",
        titre: "Désignation de Google comme contrôleur d'accès",
        description:
          "Google Search et Google Play sont désignés parmi les services de plateforme essentiels soumis au DMA.",
      },
      {
        date: "2026-07-23",
        titre: "Adoption de deux décisions de sanction",
        description:
          "La Commission constate deux manquements distincts et prononce une amende totale de 890 millions d'euros.",
      },
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
        text: "La Commission européenne a adopté deux décisions distinctes constatant que Google ne respecte pas ses obligations au titre du Digital Markets Act (DMA).",
      },
      {
        type: "heading",
        text: "Deux manquements, deux montants",
      },
      {
        type: "paragraph",
        text: "La première décision, assortie d'une amende de 460 millions d'euros, sanctionne l'auto-préférence de certains services Google (comme Google Shopping ou Google Flights) dans les résultats de Google Search. La seconde, de 430 millions d'euros, porte sur les restrictions imposées aux développeurs d'applications souhaitant orienter leurs utilisateurs vers des canaux d'achat alternatifs sur Google Play (pratique dite de « steering »).",
      },
      {
        type: "list",
        items: [
          "460 M€ pour l'auto-préférence dans Google Search",
          "430 M€ pour les restrictions de steering sur Google Play",
          "60 jours pour se conformer, sous peine d'astreintes",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "Google dispose de 60 jours pour se conformer à la décision. En cas de manquement persistant au DMA, l'article 30 du règlement permet à la Commission d'infliger une amende allant jusqu'à 10 % du chiffre d'affaires mondial annuel — porté à 20 % en cas de récidive sur la même obligation dans les huit années suivant une précédente décision de non-conformité.",
      },
      {
        type: "paragraph",
        text: "Il s'agit de la sanction la plus lourde infligée à Google au titre du DMA depuis l'entrée en application du règlement.",
      },
    ],
    impact: {
      juridique: [
        "La décision précise la portée concrète de l'interdiction d'auto-préférence (article 6, paragraphe 5, du DMA).",
        "Elle fixe également un précédent sur l'interprétation des restrictions de steering sur les places de marché d'applications.",
      ],
      institutionnel: [
        "La Commission démontre sa capacité à sanctionner au-delà de la phase de désignation des contrôleurs d'accès.",
      ],
      economique: [
        "Le marché s'attend à une réévaluation des provisions pour risque réglementaire chez les autres contrôleurs d'accès désignés.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Communiqué",
        titre:
          "Commission fines Google €890 million for breaches of the Digital Markets Act",
        organisme: "Commission européenne",
        url: "https://digital-markets-act.ec.europa.eu/commission-fines-google-eur890-million-breaches-digital-markets-act-2026-07-23_en",
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
    slug: "ai-act-report-obligations-haut-risque",
    titre:
      "AI Act : nouvelle phase d'application et report des obligations « haut risque »",
    resume:
      "La majorité des dispositions de l'AI Act s'appliquent depuis le 2 août 2026, tandis qu'un nouveau règlement reporte de seize mois les obligations pour les systèmes à haut risque de l'annexe III.",
    pointsCles: [
      "Depuis le 2 août 2026 : obligations de transparence et sanctions pleinement applicables",
      "Annexe III (recrutement, scoring, éducation, biométrie) reportée au 2 décembre 2027",
      "Nouvelles interdictions et obligations de marquage au 2 décembre 2026",
    ],
    domaine: "droit-numerique",
    categorie: "intelligence-artificielle",
    type: "Règlement",
    date: "2026-08-02",
    dateMiseAJour: "2026-08-02",
    source: "Commission européenne",
    tempsLecture: 6,
    aLaUne: true,
    chronologie: [
      { date: "2024-08-01", titre: "Entrée en vigueur de l'AI Act" },
      {
        date: "2026-07-08",
        titre: "Adoption du règlement modifiant le calendrier",
        description:
          "Le règlement (UE) 2026/1744 est adopté, reportant notamment les obligations liées aux systèmes à haut risque.",
      },
      {
        date: "2026-07-27",
        titre: "Entrée en vigueur du règlement modificatif",
        description: "Publié au Journal officiel le 24 juillet 2026.",
      },
      {
        date: "2026-08-02",
        titre: "Application de la majorité des dispositions de l'AI Act",
        description:
          "Les obligations de transparence (article 50) et le régime de sanctions deviennent pleinement applicables.",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement sur l'intelligence artificielle (AI Act)",
        citation: "Règlement (UE) 2024/1689",
        organisme: "Union européenne",
        url: "https://digital-strategy.ec.europa.eu/fr/policies/regulatory-framework-ai",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Le calendrier de mise en application de l'AI Act a connu une double actualité cet été : l'entrée en application de la majorité de ses dispositions, et un nouveau report partiel du calendrier initial.",
      },
      {
        type: "heading",
        text: "Ce qui s'applique depuis le 2 août 2026",
      },
      {
        type: "paragraph",
        text: "La majorité des dispositions du règlement est désormais applicable, dont les obligations de transparence de l'article 50 et le régime de sanctions : le Bureau européen de l'IA peut désormais ouvrir des enquêtes et demander l'accès à la documentation technique des fournisseurs.",
      },
      {
        type: "heading",
        text: "Un report de seize mois pour le « haut risque »",
      },
      {
        type: "paragraph",
        text: "Adopté le 8 juillet 2026 et entré en vigueur le 27 juillet 2026, le règlement (UE) 2026/1744 reporte au 2 décembre 2027 les obligations applicables aux systèmes à haut risque listés en annexe III (recrutement, scoring de crédit, éducation, biométrie) — un report de seize mois par rapport au calendrier initial.",
      },
      {
        type: "list",
        items: [
          "2 août 2026 : transparence (art. 50) et sanctions pleinement applicables",
          "2 décembre 2026 : nouvelles interdictions et obligation de marquage des contenus déjà sur le marché",
          "2 décembre 2027 : obligations « haut risque » de l'annexe III (reportées)",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Deux nouvelles interdictions entrent en application le 2 décembre 2026 : la production de contenus pédopornographiques générés par IA et la génération de représentations intimes non consenties.",
      },
    ],
    impact: {
      juridique: [
        "Le calendrier de l'AI Act devient mouvant : un deuxième report en cours d'année impose une veille active sur les prochaines échéances.",
        "Les fournisseurs de systèmes à haut risque de l'annexe III gagnent seize mois de délai supplémentaire.",
      ],
      pratique: [
        "Les fournisseurs de modèles déjà sur le marché doivent préparer le marquage de leurs contenus générés avant le 2 décembre 2026.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "AI Act — cadre réglementaire",
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
    slug: "nis2-saisine-cjue-quatre-etats",
    titre: "NIS 2 : la Commission saisit la CJUE contre quatre États membres",
    resume:
      "La Commission européenne porte devant la Cour de justice de l'UE l'Irlande, l'Espagne, la France et les Pays-Bas pour transposition incomplète de la directive NIS 2.",
    pointsCles: [
      "Quatre États membres renvoyés devant la CJUE le 8 juillet 2026",
      "Sanctions financières journalières demandées jusqu'à régularisation",
      "Les obligations NIS 2 restent contraignantes depuis octobre 2024, malgré le retard",
    ],
    domaine: "droit-numerique",
    categorie: "cybersecurite",
    type: "Institution",
    date: "2026-07-08",
    dateMiseAJour: "2026-07-08",
    source: "Commission européenne",
    tempsLecture: 5,
    chronologie: [
      { date: "2022-12-27", titre: "Adoption de la directive NIS 2" },
      {
        date: "2024-10-17",
        titre: "Date limite de transposition dans les droits nationaux",
      },
      {
        date: "2026-07-08",
        titre: "Saisine de la CJUE contre quatre États membres",
        description:
          "La Commission demande des sanctions financières, forfaitaires et journalières, jusqu'à notification complète de la transposition.",
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
        text: "Près de deux ans après l'échéance de transposition de la directive NIS 2, la Commission européenne a saisi la Cour de justice de l'Union européenne contre quatre États membres — l'Irlande, l'Espagne, la France et les Pays-Bas — faute d'avoir notifié une transposition complète.",
      },
      {
        type: "paragraph",
        text: "La Commission demande à la Cour de prononcer des sanctions financières, à la fois forfaitaires et journalières, qui continueraient à courir jusqu'à la notification complète de la transposition par chaque État concerné.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Le retard de transposition ne suspend pas les obligations de fond : les exigences de NIS 2 sont contraignantes pour les entités concernées depuis octobre 2024, indépendamment de l'état d'avancement de la loi nationale.",
      },
      {
        type: "list",
        items: [
          "Irlande, Espagne, France, Pays-Bas renvoyés devant la CJUE",
          "Demande de sanctions forfaitaires et journalières",
          "Obligations de fond déjà contraignantes depuis octobre 2024",
        ],
      },
      {
        type: "paragraph",
        text: "En France, l'ANSSI a publié dès mars 2026 son référentiel de mesures recommandées (ReCyF) et un portail d'auto-évaluation est déjà disponible pour les entités concernées, en amont même du vote de la loi de transposition.",
      },
    ],
    impact: {
      juridique: [
        "Les entités françaises, irlandaises, espagnoles et néerlandaises restent soumises aux obligations NIS 2 malgré l'absence de loi de transposition complète.",
        "Une sanction financière contre l'État ne protège pas les entités d'un contrôle fondé directement sur la directive.",
      ],
      institutionnel: [
        "La Commission démontre sa volonté de faire respecter les délais de transposition par la voie contentieuse.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Communiqué",
        titre:
          "Commission refers Ireland, Spain, France and the Netherlands to the Court of Justice for failing to transpose the rules on cybersecurity",
        organisme: "Commission européenne",
        url: "https://digital-strategy.ec.europa.eu/en/news/commission-refers-ireland-spain-france-and-netherlands-court-justice-failing-transpose-rules",
      },
      {
        type: "Texte officiel",
        titre: "Directive (UE) 2022/2555 (NIS 2) — texte consolidé",
        organisme: "EUR-Lex",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32022L2555",
      },
      {
        type: "Site officiel",
        titre: "La directive NIS 2",
        organisme: "ANSSI",
        url: "https://cyber.gouv.fr/la-directive-nis-2",
      },
    ],
  },
  {
    slug: "cjue-droit-acces-abusif-rgpd",
    titre: "RGPD : la CJUE encadre les demandes d'accès abusives",
    resume:
      "La Cour de justice de l'Union européenne juge qu'une demande d'accès RGPD peut être refusée lorsqu'elle poursuit le seul but de préparer une demande d'indemnisation.",
    pointsCles: [
      "Une demande d'accès peut être jugée abusive dans certaines circonstances",
      "Le demandeur n'a pas à motiver sa demande d'accès",
      "L'abus doit néanmoins être caractérisé par le responsable de traitement",
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    type: "Jurisprudence",
    date: "2026-03-19",
    dateMiseAJour: "2026-03-19",
    source: "Cour de justice de l'Union européenne",
    tempsLecture: 5,
    chronologie: [
      {
        date: "2026-03-19",
        titre: "Arrêt de la Cour de justice de l'Union européenne",
        description:
          "La Cour précise les conditions dans lesquelles une demande d'accès RGPD peut être refusée pour abus de droit.",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement général sur la protection des données (RGPD)",
        citation: "Règlement (UE) 2016/679, art. 12 § 5, al. 2",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679",
      },
      {
        type: "Jurisprudence",
        titre: "Brillen Rottler GmbH & Co. KG contre TC",
        citation: "CJUE, 4ᵉ chambre, aff. C-526/24, 19 mars 2026",
        organisme: "Cour de justice de l'Union européenne",
        url: "https://juricaf.org/arret/CJUE-COURDEJUSTICEDELUNIONEUROPEENNE-20260319-C52624",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Dans l'affaire C-526/24 (Brillen Rottler GmbH & Co. KG c. TC), jugée le 19 mars 2026, la Cour de justice de l'Union européenne (CJUE) est venue préciser les limites du droit d'accès garanti par l'article 15 du RGPD.",
      },
      {
        type: "paragraph",
        text: "La juridiction autrichienne à l'origine du renvoi préjudiciel demandait si une demande d'accès unique — non répétée auprès du même responsable de traitement — pouvait être qualifiée d'« excessive » ou d'abusive au sens de l'article 12, paragraphe 5, du RGPD. Dans les faits, une personne s'était abonnée à plusieurs lettres d'information avant d'introduire rapidement des demandes d'accès suivies de réclamations indemnitaires.",
      },
      {
        type: "paragraph",
        text: "La Cour répond que le simple fait qu'il s'agisse d'une première demande n'exclut pas la possibilité d'un abus : une demande peut être jugée excessive si elle est formulée non pour vérifier la licéité d'un traitement, mais dans une intention abusive.",
      },
      {
        type: "paragraph",
        text: "La charge de la preuve de ce caractère excessif incombe toutefois au responsable du traitement, conformément à l'article 12, paragraphe 5, second alinéa, du RGPD.",
      },
      {
        type: "list",
        items: [
          "Même une première demande d'accès peut être jugée abusive, selon les circonstances",
          "L'abus suppose une intention autre que la vérification de la licéité du traitement",
          "La charge de la preuve de l'abus pèse sur le responsable de traitement (art. 12 § 5 RGPD)",
        ],
      },
    ],
    impact: {
      juridique: [
        "L'arrêt ouvre une voie de défense pour les responsables de traitement confrontés à des demandes d'accès répétitives ou stratégiques.",
        "Il ne remet pas en cause le caractère non motivé du droit d'accès dans le cas général.",
      ],
      pratique: [
        "Les organismes recevant des demandes d'accès doivent documenter précisément les éléments permettant, le cas échéant, de caractériser un abus avant tout refus.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Document PDF",
        titre: "CJUE, aff. C-526/24, 19 mars 2026 — texte de l'arrêt",
        organisme: "Reproduction Juricaf (texte original : Curia)",
        url: "https://juricaf.org/arret/CJUE-COURDEJUSTICEDELUNIONEUROPEENNE-20260319-C52624",
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
    slug: "eu-space-act-toujours-en-negociation",
    titre: "EU Space Act : toujours en négociation, loin d'être adopté",
    resume:
      "Contrairement à une idée reçue, l'EU Space Act n'est pas encore adopté : Conseil et Parlement européens restent divisés sur plusieurs points clés, sans date d'adoption fixée à ce stade.",
    pointsCles: [
      "Le Parlement européen n'a pas encore arrêté sa position en première lecture",
      "Désaccords persistants sur la cybersécurité et l'accès au marché",
      "Aucune date d'adoption fixée à ce stade",
    ],
    domaine: "droit-spatial",
    categorie: "new-space",
    type: "Institution",
    date: "2026-10-07",
    dateMiseAJour: "2026-10-07",
    source: "Commission européenne",
    tempsLecture: 6,
    aLaUne: true,
    chronologie: [
      {
        date: "2025-06-25",
        titre: "Présentation de la proposition par la Commission européenne",
      },
      {
        date: "2026-03-03",
        titre: "Amendements du Parlement européen en commission",
      },
      {
        date: "2026-05-01",
        titre: "Rapport d'étape du Conseil de l'Union européenne",
        description:
          "Les délégations jugent le texte de compromis de la Présidence en bonne voie, tout en soulignant plusieurs points encore ouverts.",
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
    ],
    analyse: [
      {
        type: "paragraph",
        text: "L'EU Space Act, projet de règlement destiné à harmoniser les régimes nationaux d'autorisation des activités spatiales au sein de l'Union, est toujours au milieu du processus législatif : il n'a pas été adopté.",
      },
      {
        type: "heading",
        text: "Conseil et Parlement encore loin d'un accord",
      },
      {
        type: "paragraph",
        text: "Le Parlement européen n'a pas encore arrêté sa position en première lecture. Au Conseil, un rapport d'étape publié en mai 2026 indique que le texte de compromis de la Présidence progresse dans la bonne direction, mais que plusieurs points restent ouverts — notamment les exigences de cybersécurité, l'accès au marché et le traitement des opérateurs de pays tiers.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Malgré son nom, l'EU Space Act n'est donc pas une actualité immédiate : tant que le Parlement et le Conseil n'ont pas chacun arrêté leur position, aucune date d'adoption ni d'entrée en application ne peut être annoncée avec certitude.",
      },
      {
        type: "list",
        items: [
          "Parlement : pas de position de première lecture arrêtée",
          "Conseil : compromis en progrès, points ouverts sur cybersécurité et accès marché",
          "Aucune date d'adoption fixée à ce stade",
        ],
      },
      {
        type: "paragraph",
        text: "Sur le fond, le Conseil propose notamment de retirer les organisations internationales du champ d'application du texte — une divergence supplémentaire avec la position initiale de la Commission.",
      },
      {
        type: "heading",
        text: "Une date d'entrée en application déjà inscrite dans le texte, pas une date d'adoption",
      },
      {
        type: "paragraph",
        text: "Le texte de la proposition initiale de la Commission prévoit lui-même une entrée en application au 1ᵉʳ janvier 2030, avec des périodes transitoires distinctes selon les catégories d'opérateurs — une analyse relayée par plusieurs cabinets d'avocats spécialisés en droit spatial. Cette date figure dans le projet tel que rédigé : elle ne présume en rien de la date, encore inconnue, à laquelle Parlement et Conseil parviendront effectivement à un accord et adopteront le texte.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Les estimations sur la date d'adoption elle-même divergent selon les cabinets : certaines analyses évoquent une adoption possible dès 2026, d'autres restent plus prudentes. Aucune de ces projections n'engage la Commission, le Conseil ou le Parlement.",
      },
    ],
    impact: {
      juridique: [
        "Aucune obligation nouvelle ne s'impose encore aux opérateurs spatiaux européens à ce titre.",
        "Le calendrier d'adoption reste incertain et dépend de la capacité des colégislateurs à converger sur la cybersécurité et l'accès au marché.",
      ],
      institutionnel: [
        "La Commission affirme vouloir maintenir les grands équilibres du texte initial tout en accompagnant les travaux du Parlement et des États membres.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "EU Space Act",
        organisme: "Commission européenne — Défense, Industrie et Espace",
        url: "https://defence-industry-space.ec.europa.eu/eu-space-act_en",
      },
    ],
  },
  {
    slug: "copuos-69e-session-vienne",
    titre: "COPUOS : 69ᵉ session à Vienne, l'Italie prend la présidence",
    resume:
      "Le Comité des Nations unies sur les utilisations pacifiques de l'espace extra-atmosphérique s'est réuni à Vienne du 10 au 18 juin 2026, sous la présidence italienne.",
    pointsCles: [
      "Session tenue du 10 au 18 juin 2026 à Vienne",
      "L'Italie assure la présidence pour le mandat 2026-2027",
      "Travaux sur la durabilité spatiale et les sources d'énergie nucléaire dans l'espace",
    ],
    domaine: "droit-spatial",
    categorie: "traites-spatiaux",
    type: "Institution",
    date: "2026-06-18",
    dateMiseAJour: "2026-06-18",
    source: "ONU - UNOOSA",
    tempsLecture: 5,
    chronologie: [
      {
        date: "2026-02-02",
        titre: "63ᵉ session du Sous-comité scientifique et technique du COPUOS",
      },
      {
        date: "2026-06-10",
        titre: "Ouverture de la 69ᵉ session du COPUOS à Vienne",
      },
      {
        date: "2026-06-18",
        titre: "Clôture de la session",
      },
    ],
    contexteJuridique: [
      {
        type: "Traité",
        titre: "Traité de l'espace extra-atmosphérique",
        citation: "Article III, 1967",
        organisme: "Nations Unies",
        url: "https://www.unoosa.org/oosa/fr/ourwork/spacelaw/treaties/outerspacetreaty.html",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Le Comité des Nations unies sur les utilisations pacifiques de l'espace extra-atmosphérique (COPUOS) a tenu sa 69ᵉ session à Vienne, du 10 au 18 juin 2026.",
      },
      {
        type: "paragraph",
        text: "Le Comité a élu Teodoro Valente, président de l'Agence spatiale italienne (ASI), à sa présidence pour le mandat 2026-2027 — il succède au Marocain Rafiq Akram. Le COPUOS réunit 110 États membres et se réunit chaque année pour traiter de la préservation de l'espace à des fins pacifiques, des débris spatiaux et des questions de droit spatial en général.",
      },
      {
        type: "list",
        items: [
          "Travaux de groupes de travail sur la durabilité à long terme des activités spatiales",
          "Discussions sur l'usage de sources d'énergie nucléaire dans l'espace",
          "Poursuite des travaux du sous-comité juridique sur les ressources spatiales",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Le COPUOS fonctionne par consensus et adopte des principes non contraignants : ses travaux orientent les pratiques étatiques sans créer d'obligations de droit international au sens classique.",
      },
    ],
    impact: {
      institutionnel: [
        "La présidence italienne pour 2026-2027 oriente l'agenda des deux prochaines sessions annuelles du Comité.",
        "Les travaux sur la durabilité spatiale alimentent les discussions parallèles sur un futur cadre applicable aux ressources spatiales.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "Committee on the Peaceful Uses of Outer Space: 2026",
        organisme: "UNOOSA",
        url: "https://www.unoosa.org/oosa/en/ourwork/copuos/2026/index.html",
      },
    ],
  },
  {
    slug: "artemis-accords-76-signataires",
    titre: "Les Accords Artemis dépassent les 75 signataires",
    resume:
      "Porté par plusieurs vagues d'adhésions en 2026, le nombre de pays signataires des Accords Artemis a franchi le seuil des 75, confirmant la montée en puissance de ce cadre bilatéral non contraignant.",
    pointsCles: [
      "Plus de 75 pays signataires courant 2026",
      "17 nouveaux signataires au cours de la seule année 2026",
      "Cadre bilatéral et non contraignant, distinct d'un traité international",
    ],
    domaine: "droit-spatial",
    categorie: "traites-spatiaux",
    type: "Convention",
    date: "2026-09-25",
    dateMiseAJour: "2026-09-25",
    source: "NASA",
    tempsLecture: 4,
    chronologie: [
      {
        date: "2020-10-13",
        titre:
          "Signature initiale des Accords Artemis par huit pays fondateurs",
      },
      {
        date: "2026-05-04",
        titre: "Malte et l'Irlande rejoignent les Accords Artemis",
        description: "Respectivement 65ᵉ et 66ᵉ signataires, le même jour.",
      },
      {
        date: "2026-09-21",
        titre: "L'Albanie devient le 73ᵉ pays signataire",
      },
      {
        date: "2026-09-23",
        titre: "La Croatie devient le 74ᵉ pays signataire",
      },
      {
        date: "2026-09-24",
        titre: "La Côte d'Ivoire devient le 75ᵉ pays signataire",
      },
      {
        date: "2026-09-25",
        titre: "Saint-Marin devient le 76ᵉ pays signataire",
        description:
          "Cérémonie de signature à Rimini. La NASA annonce conjointement les quatre adhésions de la semaine, portant le total à 76 pays.",
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
        text: "Le nombre de pays signataires des Accords Artemis a continué de croître tout au long de l'année 2026. En une semaine à peine, quatre nouveaux pays — l'Albanie, la Croatie, la Côte d'Ivoire puis Saint-Marin — ont rejoint le cadre entre le 21 et le 25 septembre 2026, portant le total à 76 signataires.",
      },
      {
        type: "paragraph",
        text: "Ces accords, non contraignants au sens du droit international classique, formalisent des engagements communs sur la transparence des opérations, l'interopérabilité des systèmes et la prévention des interférences nuisibles entre missions lunaires.",
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
        text: "Cette croissance illustre la montée en puissance d'un cadre bilatéral et volontaire porté par les États-Unis, en parallèle des discussions multilatérales plus lentes menées au sein du COPUOS pour élaborer un régime applicable aux ressources spatiales.",
      },
    ],
    impact: {
      institutionnel: [
        "Le cadre bilatéral porté par la NASA gagne en légitimité face à la lenteur relative des négociations multilatérales au COPUOS.",
      ],
      juridique: [
        "Les nouveaux signataires s'engagent politiquement sans modifier leurs obligations issues du Traité de l'espace de 1967.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "Texte des Accords Artemis et liste des signataires",
        organisme: "NASA",
        url: "https://www.nasa.gov/artemis-accords/",
      },
      {
        type: "Communiqué",
        titre: "NASA Celebrates as Artemis Accords Surpasses 75 Signatories",
        organisme: "NASA",
        url: "https://www.nasa.gov/news-release/nasa-celebrates-as-artemis-accords-surpasses-75-signatories/",
      },
      {
        type: "Communiqué",
        titre: "NASA Welcomes San Marino Signing the Artemis Accords",
        organisme: "NASA",
        url: "https://www.nasa.gov/organizations/oiir/nasa-welcomes-san-marino-signing-the-artemis-accords/",
      },
    ],
  },
  {
    slug: "cnil-rapport-annuel-2026-cybersecurite",
    titre:
      "La CNIL consacre la moitié de ses contrôles 2026 à la cybersécurité",
    resume:
      "Dans son rapport annuel, la CNIL annonce que la moitié de ses contrôles et actions répressives de l'année sera consacrée aux manquements en matière de cybersécurité.",
    pointsCles: [
      "50 % des contrôles et sanctions 2026 ciblant la cybersécurité",
      "Rôle renforcé de la CNIL dans la régulation de l'intelligence artificielle",
      "Priorité annoncée dans le rapport annuel du 18 mai 2026",
    ],
    domaine: "droit-numerique",
    categorie: "protection-donnees",
    type: "Institution",
    date: "2026-05-18",
    dateMiseAJour: "2026-05-18",
    source: "CNIL",
    tempsLecture: 4,
    chronologie: [
      {
        date: "2026-05-18",
        titre: "Publication du rapport annuel de la CNIL",
      },
    ],
    contexteJuridique: [
      {
        type: "Loi",
        titre: "Loi Informatique et Libertés",
        citation: "Loi n° 78-17 du 6 janvier 1978, modifiée",
        organisme: "République française",
        url: "https://www.cnil.fr/fr/la-loi-informatique-et-libertes",
      },
    ],
    analyse: [
      {
        type: "paragraph",
        text: "Dans son rapport annuel publié le 18 mai 2026, la Commission nationale de l'informatique et des libertés (CNIL) annonce consacrer la moitié de ses contrôles et actions répressives de l'année aux manquements en matière de cybersécurité.",
      },
      {
        type: "paragraph",
        text: "La CNIL met également en avant la montée en puissance de son rôle dans la régulation de l'intelligence artificielle, aux côtés de ses missions historiques de protection des données personnelles.",
      },
      {
        type: "list",
        items: [
          "50 % des contrôles 2026 ciblant la cybersécurité",
          "Rôle renforcé sur l'intelligence artificielle",
          "Poursuite de la procédure simplifiée pour les manquements les plus courants (cookies, etc.)",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "La CNIL distingue deux voies de sanction : la procédure ordinaire devant sa formation restreinte (amendes potentiellement élevées) et la procédure simplifiée, décidée par un seul membre, plafonnée à 20 000 euros.",
      },
    ],
    impact: {
      pratique: [
        "Les organismes traitant des données personnelles doivent anticiper une probabilité accrue de contrôle portant spécifiquement sur leurs mesures de sécurité technique et organisationnelle.",
      ],
      institutionnel: [
        "La CNIL affiche une priorité claire qui pourrait orienter la jurisprudence administrative des deux prochaines années.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "CNIL — Sanctions et mesures correctrices",
        organisme: "CNIL",
        url: "https://www.cnil.fr/fr/thematique/cnil/sanctions",
      },
    ],
  },
  {
    slug: "recap-juillet-octobre-2026-droit-spatial",
    titre: "Récap trimestriel : droit spatial, juillet–octobre 2026",
    resume:
      "Trois mois de droit spatial en un coup d'œil : la 69ᵉ session du COPUOS à Vienne, un projet de réforme à la FAA, l'EU Space Act toujours sans date d'adoption, et les Accords Artemis qui franchissent les 76 signataires.",
    pointsCles: [
      "COPUOS : 69ᵉ session tenue à Vienne du 10 au 18 juin 2026, présidence italienne pour 2026-2027",
      "EU Space Act : toujours en négociation, aucune date d'adoption fixée à ce stade",
      "Accords Artemis : 76 signataires au 25 septembre 2026, après quatre adhésions en une semaine",
      "FAA : projet de réforme pour simplifier les autorisations de lancement (octobre 2026)",
    ],
    domaine: "droit-spatial",
    categorie: "new-space",
    type: "Institution",
    date: "2026-10-15",
    dateMiseAJour: "2026-10-15",
    source: "Synthèse LexWatch",
    tempsLecture: 8,
    chronologie: [
      {
        date: "2026-03-03",
        titre:
          "Le Parlement européen amende le projet d'EU Space Act en commission",
      },
      {
        date: "2026-05-01",
        titre: "Rapport d'étape du Conseil de l'UE sur l'EU Space Act",
      },
      {
        date: "2026-06-10",
        titre: "Ouverture de la 69ᵉ session du COPUOS à Vienne",
      },
      {
        date: "2026-06-18",
        titre: "Clôture de la 69ᵉ session du COPUOS",
        description: "L'Italie prend la présidence pour le mandat 2026-2027.",
      },
      {
        date: "2026-08-05",
        titre: "L'étage supérieur d'une fusée Falcon-9 s'écrase sur la Lune",
        description:
          "Relance le débat sur le « dommage spatial environnemental », non couvert explicitement par le traité de 1967.",
      },
      {
        date: "2026-09-25",
        titre: "Les Accords Artemis franchissent les 76 signataires",
        description:
          "Quatre nouveaux pays rejoignent le cadre en une semaine (Albanie, Croatie, Côte d'Ivoire, Saint-Marin).",
      },
    ],
    contexteJuridique: [
      {
        type: "Traité",
        titre:
          "Traité sur les principes régissant les activités des États en matière d'exploration et d'utilisation de l'espace extra-atmosphérique",
        citation: "1967",
        organisme: "ONU / UNOOSA",
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
      { type: "heading", text: "Traités spatiaux internationaux" },
      {
        type: "paragraph",
        text: "Le Comité des Nations unies sur les utilisations pacifiques de l'espace extra-atmosphérique (COPUOS) a tenu sa 69ᵉ session à Vienne du 10 au 18 juin 2026. Teodoro Valente, président de l'Agence spatiale italienne, prend la présidence pour le mandat 2026-2027, succédant au Marocain Rafiq Akram. Les travaux ont porté sur la durabilité à long terme des activités spatiales et l'usage de sources d'énergie nucléaire dans l'espace.",
      },
      {
        type: "paragraph",
        text: "Le 5 août 2026, l'étage supérieur d'une fusée Falcon-9 (SpaceX) s'est écrasé sur la Lune, relançant le débat sur le « dommage spatial environnemental » : le traité de 1967 ne couvre pas explicitement ce cas de figure.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Aucune avancée formelle de codification n'a été enregistrée en 2026 sur ce terrain : le traité de 1967 reste le seul socle contraignant.",
      },
      { type: "heading", text: "Débris et durabilité spatiale" },
      {
        type: "paragraph",
        text: "Un expert de l'Académie de l'air et de l'espace alertait début octobre 2026 : les règles internationales existantes « ne sont pas appliquées » face à la croissance des mégaconstellations, citant la France comme l'un des seuls pays à peu près exemplaires sur la désorbitation.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Le risque de collisions en chaîne (« syndrome de Kessler ») revient dans plusieurs analyses 2026 à mesure que les mégaconstellations se densifient.",
      },
      { type: "heading", text: "New Space et acteurs privés" },
      {
        type: "paragraph",
        text: "En octobre 2026, la FAA (États-Unis) a engagé un projet de réforme pour simplifier les autorisations de lancement et de rentrée atmosphérique (dépôt électronique, fusion de plusieurs analyses de sécurité en une seule procédure).",
      },
      {
        type: "paragraph",
        text: "L'EU Space Act reste à l'état de proposition : le Parlement européen n'a pas arrêté sa position en première lecture, et un rapport d'étape du Conseil (1ᵉʳ mai 2026) relève des points encore ouverts (cybersécurité, accès au marché, opérateurs de pays tiers). Aucune date d'adoption n'est fixée à ce stade. Le texte de la proposition prévoit toutefois lui-même une entrée en application au 1ᵉʳ janvier 2030 si elle est adoptée — une information relayée par plusieurs cabinets d'avocats spécialisés (Heuking, King & Spalding), qui ne s'accordent pas en revanche sur la date d'adoption elle-même (Baker McKenzie évoque une adoption possible dès 2026).",
      },
      {
        type: "list",
        items: [
          "La GSMA publie en juin 2026 un guide mondial à destination des régulateurs satellites",
          "États-Unis : SAT Streamlining Act au Sénat (février 2026), pour accélérer les licences FCC",
          "Japon : réforme de la loi sur les activités spatiales (mars 2026), élargie aux services de réutilisation de lanceurs",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Le rythme des lancements dépasse la capacité des régulateurs — un constat partagé par plusieurs analyses sectorielles 2026.",
      },
      { type: "heading", text: "Exploitation des ressources spatiales" },
      {
        type: "paragraph",
        text: "Le débat juridique sur l'appropriation des ressources spatiales se poursuit : plusieurs lectures estiment qu'aucune interdiction explicite ne s'y oppose tant que l'accès à l'espace reste libre au sens de l'article II du traité de 1967, une lecture que plusieurs États contestent. Le groupe de travail de l'ONU sur ce sujet a publié des versions révisées de ses principes recommandés entre février et avril 2026.",
      },
      {
        type: "paragraph",
        text: "Les Accords Artemis ont franchi les 76 signataires le 25 septembre 2026, avec Saint-Marin comme dernier État en date, après l'Albanie (21/09), la Croatie (23/09) et la Côte d'Ivoire (24/09) — quatre adhésions en une semaine.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Ce terrain juridique reste « non stabilisé », entre droit national, travaux onusiens non contraignants et absence de régime international dédié aux ressources spatiales.",
      },
    ],
    impact: {
      juridique: [
        "Aucune norme internationale nouvelle n'a été adoptée sur la gestion des débris ou l'exploitation des ressources spatiales au cours du trimestre.",
        "Le droit national continue de combler le vide laissé par l'absence de consensus multilatéral (Accords Artemis, lois américaine et japonaise).",
      ],
      institutionnel: [
        "La présidence italienne du COPUOS oriente l'agenda des deux prochaines sessions annuelles.",
        "Le blocage persistant entre Parlement et Conseil retarde l'harmonisation des régimes nationaux d'autorisation par l'EU Space Act.",
      ],
      pratique: [
        "Les opérateurs spatiaux européens restent soumis à leurs régimes nationaux existants tant que l'EU Space Act n'est pas adopté.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Site officiel",
        titre: "Committee on the Peaceful Uses of Outer Space: 2026",
        organisme: "UNOOSA",
        url: "https://www.unoosa.org/oosa/en/ourwork/copuos/2026/index.html",
      },
      {
        type: "Site officiel",
        titre: "EU Space Act",
        organisme: "Commission européenne — Défense, Industrie et Espace",
        url: "https://defence-industry-space.ec.europa.eu/eu-space-act_en",
      },
      {
        type: "Communiqué",
        titre: "NASA Celebrates as Artemis Accords Surpasses 75 Signatories",
        organisme: "NASA",
        url: "https://www.nasa.gov/news-release/nasa-celebrates-as-artemis-accords-surpasses-75-signatories/",
      },
      {
        type: "Communiqué",
        titre: "NASA Welcomes San Marino Signing the Artemis Accords",
        organisme: "NASA",
        url: "https://www.nasa.gov/organizations/oiir/nasa-welcomes-san-marino-signing-the-artemis-accords/",
      },
    ],
  },
  {
    slug: "recap-juillet-octobre-2026-droit-numerique",
    titre: "Récap trimestriel : droit du numérique, juillet–octobre 2026",
    resume:
      "Trois mois de droit du numérique en un coup d'œil : 890 millions d'euros d'amende DMA contre Google, un nouveau report du calendrier de l'AI Act, la saisine de la CJUE sur NIS 2, et le Digital Omnibus toujours en négociation.",
    pointsCles: [
      "DMA : 890 millions d'euros d'amende infligés à Google le 23 juillet 2026",
      "AI Act : nouveau report de 16 mois pour les obligations « haut risque », repoussées au 2 décembre 2027",
      "NIS 2 : la Commission saisit la CJUE contre l'Irlande, l'Espagne, la France et les Pays-Bas",
      "Digital Omnibus : deux propositions distinctes (RGPD/ePrivacy et IA) toujours en négociation",
    ],
    domaine: "droit-numerique",
    categorie: "intelligence-artificielle",
    type: "Institution",
    date: "2026-10-15",
    dateMiseAJour: "2026-10-15",
    source: "Synthèse LexWatch",
    tempsLecture: 8,
    chronologie: [
      {
        date: "2025-11-19",
        titre: "La Commission publie les deux propositions du Digital Omnibus",
        description:
          "COM(2025) 837 (RGPD, ePrivacy, NIS 2, Data Act) et COM(2025) 836 (AI Act).",
      },
      {
        date: "2026-02-12",
        titre: "Avis conjoint du CEPD et du CEPD/EDPS sur le Digital Omnibus",
      },
      {
        date: "2026-03-19",
        titre:
          "La CJUE encadre les demandes d'accès RGPD abusives (affaire C-526/24)",
      },
      {
        date: "2026-05-18",
        titre: "La CNIL publie son rapport annuel",
      },
      {
        date: "2026-07-08",
        titre:
          "Le Tribunal de l'UE rejette les recours d'Apple contre sa désignation DMA, et la Commission saisit la CJUE sur NIS 2",
      },
      {
        date: "2026-07-23",
        titre:
          "La Commission inflige 890 millions d'euros à Google au titre du DMA",
      },
      {
        date: "2026-08-02",
        titre:
          "Entrée en application de la majorité des dispositions de l'AI Act",
      },
    ],
    contexteJuridique: [
      {
        type: "Règlement",
        titre: "Règlement général sur la protection des données (RGPD)",
        citation: "Règlement (UE) 2016/679",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016R0679",
      },
      {
        type: "Règlement",
        titre: "Règlement sur les marchés numériques (DMA)",
        citation: "Règlement (UE) 2022/1925",
        organisme: "Union européenne",
        url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32022R1925",
      },
      {
        type: "Règlement",
        titre: "Règlement sur l'intelligence artificielle (AI Act)",
        citation: "Règlement (UE) 2024/1689",
        organisme: "Union européenne",
        url: "https://digital-strategy.ec.europa.eu/fr/policies/regulatory-framework-ai",
      },
    ],
    analyse: [
      { type: "heading", text: "Intelligence artificielle (AI Act)" },
      {
        type: "paragraph",
        text: "La majorité des dispositions de l'AI Act est applicable depuis le 2 août 2026, dont les obligations de transparence (article 50) et le régime de sanctions. Le règlement (UE) 2026/1744, adopté le 8 juillet et entré en vigueur le 27 juillet 2026, reporte de seize mois les obligations « haut risque » de l'annexe III (recrutement, scoring de crédit, éducation, biométrie) au 2 décembre 2027, et celles de l'annexe II au 2 août 2028.",
      },
      {
        type: "paragraph",
        text: "En France, la loi désignant les autorités de surveillance du marché n'était toujours pas définitivement adoptée à l'automne 2026, et seuls 8 des 27 États membres avaient désigné leur point de contact unique en mars 2026. La France avait par ailleurs demandé, avec l'Allemagne, un report d'un an de la mise en conformité pour les systèmes à haut risque (novembre 2025).",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Le calendrier de l'AI Act devient mouvant : un deuxième report en cours d'année impose une veille active sur les prochaines échéances.",
      },
      { type: "heading", text: "Protection des données personnelles (RGPD)" },
      {
        type: "paragraph",
        text: "Le 19 mars 2026, la CJUE (affaire C-526/24) a jugé qu'une demande d'accès RGPD peut être refusée si elle poursuit le seul but de préparer une demande d'indemnisation ; la demande n'a pas à être motivée par son auteur, mais la charge de la preuve de l'abus pèse sur le responsable de traitement (article 12, paragraphe 5, du RGPD).",
      },
      {
        type: "paragraph",
        text: "Dans son rapport annuel du 18 mai 2026, la CNIL annonce consacrer la moitié de ses contrôles et actions répressives de l'année aux manquements de cybersécurité, et renforcer son rôle dans la régulation de l'intelligence artificielle.",
      },
      {
        type: "paragraph",
        text: "La Commission a publié le 19 novembre 2025 deux propositions distinctes dites « Digital Omnibus » : l'une modifiant le RGPD, la directive ePrivacy, NIS 2 et le Data Act, l'autre ajustant l'AI Act. Le volet RGPD/ePrivacy reste en négociation — les sources disponibles ne s'accordent pas sur son état exact d'avancement en trilogue. Le CEPD et le CEPD/EDPS ont publié un avis conjoint (12 février 2026) saluant l'objectif de simplification tout en pointant des risques, notamment autour de la redéfinition de la notion de donnée personnelle.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Le Digital Omnibus, s'il est adopté en l'état, pourrait redéfinir la notion même de donnée personnelle — un point à surveiller de près.",
      },
      { type: "heading", text: "Cybersécurité (NIS 2)" },
      {
        type: "paragraph",
        text: "Le 8 juillet 2026, la Commission a saisi la CJUE contre l'Irlande, l'Espagne, la France et les Pays-Bas pour transposition incomplète de NIS 2, avec demande de sanctions financières journalières jusqu'à régularisation. En France, l'ANSSI a publié dès mars 2026 son référentiel de mesures recommandées (ReCyF) et propose déjà un dispositif d'auto-évaluation en ligne, en amont même du vote de la loi de transposition elle-même, toujours en attente.",
      },
      {
        type: "list",
        items: [
          "Sanctions prévues par la directive : jusqu'à 10 M€ ou 2 % du chiffre d'affaires mondial pour les entités essentielles",
          "7 M€ ou 1,4 % du chiffre d'affaires mondial pour les entités importantes",
          "Les obligations de fond sont contraignantes depuis octobre 2024, indépendamment du retard de transposition",
        ],
      },
      {
        type: "heading",
        text: "Régulation des plateformes numériques (DSA / DMA)",
      },
      {
        type: "paragraph",
        text: "Le 23 juillet 2026, la Commission inflige à Google 890 millions d'euros au titre du DMA (460 M€ pour l'auto-préférence dans Google Search, 430 M€ pour les restrictions imposées aux développeurs sur Google Play). Google dispose de 60 jours pour se mettre en conformité.",
      },
      {
        type: "callout",
        tone: "info",
        text: "En cas de manquement persistant, deux mécanismes distincts du DMA peuvent s'appliquer : l'article 30 permet une amende allant jusqu'à 10 % du chiffre d'affaires mondial annuel (20 % en cas de récidive), tandis que l'article 31 permet, séparément, des astreintes journalières allant jusqu'à 5 % du chiffre d'affaires mondial moyen journalier.",
      },
      {
        type: "paragraph",
        text: "Le 8 juillet 2026, le Tribunal de l'Union européenne a rejeté l'ensemble des recours d'Apple contre sa désignation comme contrôleur d'accès pour l'App Store et iOS (affaires jointes T-1079/23, T-1080/23, T-214/24) ; les recours relatifs à iMessage ont été jugés irrecevables, ce service n'ayant pas été désigné comme point d'accès important.",
      },
      {
        type: "list",
        items: [
          "La Commission a adressé des constats préliminaires d'infraction DSA à Meta et TikTok ; enquêtes en cours",
          "Une décision sur la désignation d'AWS et de Microsoft Azure comme contrôleurs d'accès au titre du DMA est attendue d'ici fin 2026",
          "La consultation publique sur le réexamen légal du DMA s'est close le 24 septembre 2026",
        ],
      },
    ],
    impact: {
      juridique: [
        "L'amende Google précise la portée concrète de l'interdiction d'auto-préférence et des restrictions de steering au titre du DMA.",
        "L'arrêt de la CJUE sur les demandes d'accès RGPD ouvre une voie de défense pour les responsables de traitement confrontés à des demandes stratégiques.",
      ],
      institutionnel: [
        "La Commission démontre sa capacité à sanctionner et à faire respecter les délais de transposition par la voie contentieuse.",
        "Le calendrier législatif numérique reste chargé et mouvant (AI Act, Digital Omnibus, réexamen du DMA).",
      ],
      pratique: [
        "Les fournisseurs de systèmes d'IA à haut risque de l'annexe III gagnent seize mois de délai supplémentaire.",
        "Les entités françaises, irlandaises, espagnoles et néerlandaises restent soumises aux obligations NIS 2 malgré l'absence de loi de transposition complète.",
      ],
    },
    referencesOfficielles: [
      {
        type: "Communiqué",
        titre:
          "Commission fines Google €890 million for breaches of the Digital Markets Act",
        organisme: "Commission européenne",
        url: "https://digital-markets-act.ec.europa.eu/commission-fines-google-eur890-million-breaches-digital-markets-act-2026-07-23_en",
      },
      {
        type: "Communiqué",
        titre:
          "Commission refers Ireland, Spain, France and the Netherlands to the Court of Justice for failing to transpose the rules on cybersecurity",
        organisme: "Commission européenne",
        url: "https://digital-strategy.ec.europa.eu/en/news/commission-refers-ireland-spain-france-and-netherlands-court-justice-failing-transpose-rules",
      },
      {
        type: "Document PDF",
        titre:
          "Communiqué de presse, affaires jointes T-1079/23, T-1080/23, T-214/24",
        organisme: "Tribunal de l'Union européenne (CURIA)",
        url: "https://curia.europa.eu/site/upload/docs/application/pdf/2026-07/cp260096fr.pdf",
      },
      {
        type: "Site officiel",
        titre: "CNIL — Sanctions et mesures correctrices",
        organisme: "CNIL",
        url: "https://www.cnil.fr/fr/thematique/cnil/sanctions",
      },
    ],
  },
];
