/**
 * Point d'entrée public du module Témoignages. Les autres modules (et les
 * routes de `src/app/`) ne doivent importer que depuis ce fichier — jamais
 * un chemin profond vers `components/`, `services/`, etc.
 */
export { TestimoniesView } from "./pages/testimonies-view";
export type { Testimony, TestimonyAuthor } from "./types/testimony.types";
