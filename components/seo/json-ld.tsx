export interface JsonLdProps {
  /** Un objet schema.org, ou plusieurs (rendus en un seul bloc `@graph` implicite via un tableau JSON). */
  data: object | object[];
}

/**
 * Rendu générique d'un ou plusieurs blocs de données structurées
 * schema.org. Composant unique et réutilisé par toutes les pages : aucune
 * page ne doit construire son propre `<script type="application/ld+json">`
 * à la main (voir les fonctions `build*JsonLd` de `lib/json-ld.ts`).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Les données proviennent exclusivement de constantes internes et du
      // contenu éditorial de LexWatch (jamais d'une entrée utilisateur non
      // filtrée), donc de JSON.stringify sur un objet interne — pas d'une
      // chaîne HTML externe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
