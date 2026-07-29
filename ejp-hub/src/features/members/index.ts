/**
 * Point d'entrée public du module Membres. Les autres modules (et les
 * routes de `src/app/`) ne doivent importer que depuis ce fichier — jamais
 * un chemin profond vers `services/`, `repositories/`, `queries/`, `data/`,
 * etc.
 */
export { MemberJoinView } from "./pages/member-join-view";
export { MembersView } from "./pages/members-view";
export { MemberRequestsView } from "./pages/member-requests-view";
export { MemberDetailView } from "./pages/member-detail-view";
export { MemberSelfProfileView } from "./pages/member-self-profile-view";
export type { Member, MemberFilters, MemberRole, MemberStatus } from "./types/member.types";
export { MemberService } from "./services/member.service";
export { getMemberPermissions, type MemberPermissions } from "./utils/member-permissions";
