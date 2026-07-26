import type { GlossaireTerme } from "@/types";

export const glossaireTermes: GlossaireTerme[] = [
  {
    terme: "Accords Artemis",
    definition:
      "Ensemble de principes bilatéraux non contraignants portés par les États-Unis pour encadrer la coopération civile dans l'exploration lunaire et spatiale.",
    theme: "droit-spatial",
    lettre: "A",
    voirAussi: ["Traité de l'espace"],
    contenusAssocies: { analyses: ["artemis-accords-nouveaux-signataires"] },
  },
  {
    terme: "Agence spatiale européenne (ESA)",
    definition:
      "Organisation intergouvernementale réunissant 22 États membres pour coordonner les programmes spatiaux civils européens, de l'observation de la Terre à l'exploration lunaire.",
    theme: "institutions",
    lettre: "A",
    contenusAssocies: { analyses: ["eu-space-act-adoption"] },
  },
  {
    terme: "AI Act",
    definition:
      "Règlement européen établissant des règles harmonisées pour le développement, la mise sur le marché et l'utilisation des systèmes d'intelligence artificielle.",
    theme: "intelligence-artificielle",
    lettre: "A",
    voirAussi: ["Système à haut risque"],
    contenusAssocies: {
      fiches: ["ia-act-systemes-haut-risque"],
      analyses: ["ai-act-codes-conduite"],
    },
  },
  {
    terme: "Autorisation de lancement",
    definition:
      "Acte administratif préalable par lequel un État autorise, sous conditions, le lancement d'un objet spatial depuis son territoire ou par un opérateur relevant de sa juridiction.",
    theme: "droit-spatial",
    lettre: "A",
    contenusAssocies: { fiches: ["licence-lancement-fusee"] },
  },
  {
    terme: "Bande de fréquences",
    definition:
      "Portion du spectre électromagnétique attribuée par l'UIT à un usage déterminé, dont dépend l'exploitation des liaisons satellitaires et des réseaux terrestres.",
    theme: "telecommunications",
    lettre: "B",
    contenusAssocies: {
      fiches: ["attribution-frequences-satellites"],
      analyses: ["uit-conference-mondiale-radiocommunications"],
    },
  },
  {
    terme: "Charge utile",
    definition:
      "Ensemble des équipements embarqués à bord d'un objet spatial pour accomplir sa mission (instruments scientifiques, répéteurs de télécommunications, capteurs d'observation…), par opposition à la plateforme qui les transporte.",
    theme: "droit-spatial",
    lettre: "C",
  },
  {
    terme: "CNIL (Commission nationale de l'informatique et des libertés)",
    definition:
      "Autorité administrative indépendante française chargée de veiller au respect de la protection des données personnelles et de sanctionner les manquements constatés.",
    theme: "institutions",
    lettre: "C",
    contenusAssocies: {
      fiches: ["quest-ce-que-rgpd"],
      analyses: ["cnil-sanction-cookies"],
    },
  },
  {
    terme: "COPUOS",
    definition:
      "Comité des Nations Unies sur les utilisations pacifiques de l'espace extra-atmosphérique, principal forum de négociation du droit spatial international depuis 1959.",
    theme: "institutions",
    lettre: "C",
    contenusAssocies: { analyses: ["onu-comite-copuos-ressources"] },
  },
  {
    terme: "Convention sur la responsabilité",
    definition:
      "Traité de 1972 précisant les règles de responsabilité internationale des États pour les dommages causés par leurs objets spatiaux.",
    theme: "droit-spatial",
    lettre: "C",
    contenusAssocies: { fiches: ["responsabilite-collision-satellites"] },
  },
  {
    terme: "Débris orbital",
    definition:
      "Objet artificiel, ou fragment de celui-ci, en orbite terrestre qui n'est plus fonctionnel et ne remplit plus de mission.",
    theme: "droit-spatial",
    lettre: "D",
    contenusAssocies: {
      analyses: ["fcc-regles-debris-2026", "eu-space-act-adoption"],
    },
  },
  {
    terme: "Désorbitation",
    definition:
      "Manœuvre ou processus naturel ramenant un objet spatial en fin de vie hors de son orbite opérationnelle, par rentrée atmosphérique ou mise en orbite cimetière.",
    theme: "droit-spatial",
    lettre: "D",
    voirAussi: ["Débris orbital"],
    contenusAssocies: { analyses: ["fcc-regles-debris-2026"] },
  },
  {
    terme: "DMA (Digital Markets Act)",
    definition:
      "Règlement européen visant à garantir des marchés numériques contestables et équitables en encadrant les « contrôleurs d'accès ».",
    theme: "droit-numerique",
    lettre: "D",
    contenusAssocies: { analyses: ["dma-amende-gatekeeper"] },
  },
  {
    terme: "Données à caractère personnel",
    definition:
      "Toute information se rapportant à une personne physique identifiée ou identifiable, dont le traitement est encadré par le RGPD.",
    theme: "droit-numerique",
    lettre: "D",
    voirAussi: ["RGPD"],
    contenusAssocies: { fiches: ["quest-ce-que-rgpd"] },
  },
  {
    terme: "Droit à l'oubli",
    definition:
      "Faculté reconnue à toute personne de demander l'effacement de données la concernant ou leur déréférencement par un moteur de recherche, sous certaines conditions.",
    theme: "droit-numerique",
    lettre: "D",
    contenusAssocies: { analyses: ["cjue-droit-a-loubli-referencement"] },
  },
  {
    terme: "DSA (Digital Services Act)",
    definition:
      "Règlement européen fixant les obligations de diligence des intermédiaires en ligne en matière de contenus illicites et de transparence.",
    theme: "droit-numerique",
    lettre: "D",
    contenusAssocies: { fiches: ["dsa-obligations-plateformes"] },
  },
  {
    terme: "EDPB (Comité européen de la protection des données)",
    definition:
      "Organe réunissant les autorités de protection des données des États membres de l'Union européenne, chargé d'assurer une application cohérente du RGPD.",
    theme: "institutions",
    lettre: "E",
    contenusAssocies: {
      analyses: ["edpb-lignes-directrices-transferts-internationaux"],
    },
  },
  {
    terme: "ENISA (Agence de l'Union européenne pour la cybersécurité)",
    definition:
      "Agence chargée d'accompagner les États membres et les institutions européennes dans le renforcement de la cybersécurité, notamment dans le cadre de la directive NIS 2.",
    theme: "institutions",
    lettre: "E",
    contenusAssocies: {
      fiches: ["obligation-notification-incident"],
      analyses: ["nis2-transposition-etats"],
    },
  },
  {
    terme: "État de lancement",
    definition:
      "État qui procède ou fait procéder au lancement d'un objet spatial, ou depuis le territoire ou les installations duquel un objet est lancé.",
    theme: "droit-spatial",
    lettre: "E",
    contenusAssocies: { fiches: ["licence-lancement-fusee"] },
  },
  {
    terme: "FCC (Federal Communications Commission)",
    definition:
      "Agence fédérale américaine de régulation des communications, compétente notamment pour l'octroi des licences satellitaires et l'encadrement des débris orbitaux.",
    theme: "institutions",
    lettre: "F",
    contenusAssocies: { analyses: ["fcc-regles-debris-2026"] },
  },
  {
    terme: "Immatriculation spatiale",
    definition:
      "Inscription d'un objet spatial sur le registre national puis sur le registre tenu par l'ONU, condition de la juridiction de l'État sur cet objet.",
    theme: "droit-spatial",
    lettre: "I",
    contenusAssocies: { fiches: ["qui-possede-l-espace"] },
  },
  {
    terme: "Interopérabilité",
    definition:
      "Capacité de systèmes ou de services numériques distincts à fonctionner ensemble et à échanger des données, exigée par le DMA pour les principaux services des contrôleurs d'accès.",
    theme: "droit-numerique",
    lettre: "I",
    contenusAssocies: {
      fiches: ["dsa-obligations-plateformes"],
      analyses: ["dma-amende-gatekeeper"],
    },
  },
  {
    terme: "NIS 2",
    definition:
      "Directive européenne renforçant les exigences de cybersécurité et de notification d'incidents pour les entités essentielles et importantes.",
    theme: "droit-numerique",
    lettre: "N",
    contenusAssocies: {
      fiches: ["obligation-notification-incident"],
      analyses: ["nis2-transposition-etats"],
    },
  },
  {
    terme: "New Space",
    definition:
      "Mouvement caractérisé par l'essor d'acteurs privés dans le secteur spatial, en rupture avec le modèle historique porté par les États.",
    theme: "droit-spatial",
    lettre: "N",
    contenusAssocies: {
      analyses: ["commercial-space-launch-act-mise-a-jour"],
    },
  },
  {
    terme: "Orbite basse (LEO)",
    definition:
      "Région orbitale située entre environ 160 et 2 000 km d'altitude, privilégiée par les constellations de satellites et particulièrement exposée au risque de collision et de débris.",
    theme: "droit-spatial",
    lettre: "O",
    contenusAssocies: {
      analyses: ["fcc-regles-debris-2026", "eu-space-act-adoption"],
    },
  },
  {
    terme: "RGPD",
    definition:
      "Règlement général sur la protection des données, cadre européen de référence pour le traitement des données à caractère personnel.",
    theme: "droit-numerique",
    lettre: "R",
    voirAussi: ["Données à caractère personnel"],
    contenusAssocies: { fiches: ["quest-ce-que-rgpd"] },
  },
  {
    terme: "Responsabilité objective",
    definition:
      "Régime de responsabilité n'exigeant pas la preuve d'une faute, applicable notamment aux dommages causés au sol par des objets spatiaux.",
    theme: "droit-spatial",
    lettre: "R",
    contenusAssocies: { fiches: ["responsabilite-collision-satellites"] },
  },
  {
    terme: "Système à haut risque",
    definition:
      "Catégorie de systèmes d'intelligence artificielle soumise par l'AI Act à des obligations renforcées (documentation, supervision humaine, gestion des risques) en raison de leur impact potentiel sur les droits fondamentaux.",
    theme: "intelligence-artificielle",
    lettre: "S",
    voirAussi: ["AI Act"],
    contenusAssocies: { fiches: ["ia-act-systemes-haut-risque"] },
  },
  {
    terme: "Traité de l'espace",
    definition:
      "Traité de 1967 posant les principes fondamentaux du droit spatial : non-appropriation, usage pacifique et responsabilité des États.",
    theme: "droit-spatial",
    lettre: "T",
    contenusAssocies: { fiches: ["qui-possede-l-espace"] },
  },
  {
    terme: "UIT (Union internationale des télécommunications)",
    definition:
      "Institution spécialisée des Nations Unies chargée de la coordination internationale des télécommunications, notamment l'attribution des fréquences et des positions orbitales géostationnaires.",
    theme: "institutions",
    lettre: "U",
    contenusAssocies: {
      fiches: ["attribution-frequences-satellites"],
      analyses: ["uit-conference-mondiale-radiocommunications"],
    },
  },
  {
    terme: "Zero Debris Charter",
    definition:
      "Initiative de l'Agence spatiale européenne visant l'absence nette de nouveaux débris orbitaux d'ici 2030.",
    theme: "droit-spatial",
    lettre: "Z",
    contenusAssocies: { analyses: ["eu-space-act-adoption"] },
  },
];
