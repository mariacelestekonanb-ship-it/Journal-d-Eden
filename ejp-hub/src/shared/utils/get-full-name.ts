export function getFullName(profile: { firstname: string; lastname: string }): string {
  return `${profile.firstname} ${profile.lastname}`.trim();
}
