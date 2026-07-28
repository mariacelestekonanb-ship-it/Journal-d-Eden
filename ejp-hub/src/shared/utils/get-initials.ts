/** Retourne les 1 ou 2 initiales d'un nom complet (ex. "Jean Dupont" -> "JD"). */
export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
