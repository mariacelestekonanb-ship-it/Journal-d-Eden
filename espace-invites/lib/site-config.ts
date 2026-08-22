/**
 * Configuration centrale de l'espace invités. Toutes les valeurs
 * marquées TODO sont des placeholders à remplacer par les vraies
 * informations du mariage — le reste du code ne doit jamais coder ces
 * informations en dur ailleurs.
 */
export const siteConfig = {
  couple: {
    names: "Jérémie & Jess",
    monogram: "J&J",
  },
  // TODO: remplacer par la vraie date et heure de la cérémonie.
  weddingDate: "2027-06-19T15:00:00",
  // TODO: remplacer par le lieu réel (ville ou nom du domaine).
  location: "[Lieu à préciser]",
  // TODO: remplacer par l'adresse complète du lieu de réception.
  venueAddress: "[Adresse du lieu de réception]",
  // TODO: remplacer par le lien réel vers la cagnotte en ligne.
  donationLink: "#",
  honeymoonDestination: "[destination]",
  giftListLink: "#",
} as const;

export const programme = [
  {
    time: "15h00",
    title: "Cérémonie",
    detail: "[Lieu de la cérémonie]",
  },
  {
    time: "16h30",
    title: "Vin d'honneur",
    detail: "[Lieu du vin d'honneur]",
  },
  {
    time: "19h00",
    title: "Dîner",
    detail: "[Lieu de réception]",
  },
  {
    time: "21h30",
    title: "Ouverture du bal",
    detail: "La première danse des mariés",
  },
  {
    time: "23h00",
    title: "Soirée dansante",
    detail: "Jusqu'au bout de la nuit",
  },
] as const;

export const hotels = [
  { name: "[Nom de l'hôtel 1]", distance: "[X] km du lieu de réception" },
  { name: "[Nom de l'hôtel 2]", distance: "[X] km du lieu de réception" },
  { name: "[Nom de l'hôtel 3]", distance: "[X] km du lieu de réception" },
] as const;
