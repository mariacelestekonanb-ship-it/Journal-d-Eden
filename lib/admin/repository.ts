import {
  seedAnalyses,
  seedCategories,
  seedFiches,
  seedGlossaire,
  seedRessources,
  seedSiteSettings,
} from "@/lib/admin/seed";
import type {
  AdminMeta,
  AnalyseAdmin,
  CategorieAdmin,
  FicheAdmin,
  GlossaireTermeAdmin,
  RessourceAdmin,
  SiteSettings,
} from "@/lib/admin/types";

export interface Repository<T extends AdminMeta> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(item: T): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T | undefined>;
  remove(id: string): Promise<boolean>;
  duplicate(id: string): Promise<T | undefined>;
  /** Échange la position de `id` avec son voisin — utilisé par la réorganisation des catégories. */
  reorder(id: string, direction: -1 | 1): Promise<void>;
}

/**
 * Next.js compile les Server Actions et les Server Components qui les
 * appellent dans des chunks distincts ; chacun peut réévaluer ce module
 * indépendamment, ce qui donnerait une variable de module `let items`
 * différente par chunk (les écritures d'une action deviendraient
 * invisibles des pages qui lisent ensuite le dépôt). En ancrant l'état sur
 * `globalThis` — un seul objet par processus Node, quel que soit le nombre
 * de fois où ce module est réévalué — tous les chunks convergent vers le
 * même tableau.
 */
function globalStore<T>(key: string, seed: T[]): { items: T[] } {
  const globalKey = `__lexwatch_admin_repository__${key}`;
  const store = globalThis as unknown as Record<
    string,
    { items: T[] } | undefined
  >;
  if (!store[globalKey]) {
    store[globalKey] = { items: [...seed] };
  }
  return store[globalKey]!;
}

/**
 * Fabrique de dépôt en mémoire : la seule pièce de l'architecture qui
 * dépend d'un « moteur » de stockage. Chaque opération est asynchrone et
 * retourne des copies (jamais les objets internes), exactement la forme
 * qu'aurait un client Prisma, un SDK Supabase ou un client Payload/Sanity —
 * remplacer `createRepository` par un adaptateur réel ne change la
 * signature d'aucun appelant (Server Actions, pages).
 *
 * L'état vit dans `globalThis` côté serveur : il persiste tant que le
 * processus Next.js tourne, mais repart de la donnée de départ à chaque
 * redémarrage. Ce n'est pas une base de données — voir le livrable de fin
 * de phase pour les pistes de connexion réelle.
 */
export function createRepository<T extends AdminMeta>(
  key: string,
  seed: T[],
): Repository<T> {
  const store = globalStore<T>(key, seed);

  return {
    async list() {
      return [...store.items];
    },
    async get(id) {
      return store.items.find((item) => item.id === id);
    },
    async create(item) {
      store.items = [item, ...store.items];
      return item;
    },
    async update(id, patch) {
      let updated: T | undefined;
      store.items = store.items.map((item) => {
        if (item.id !== id) return item;
        updated = { ...item, ...patch };
        return updated;
      });
      return updated;
    },
    async remove(id) {
      const before = store.items.length;
      store.items = store.items.filter((item) => item.id !== id);
      return store.items.length < before;
    },
    async duplicate(id) {
      const original = store.items.find((item) => item.id === id);
      if (!original) return undefined;

      const copy: T = {
        ...original,
        id: `${original.id}-copie-${Date.now().toString(36)}`,
        status: "brouillon",
        updatedAt: new Date().toISOString().slice(0, 10),
        versions: [],
      };
      store.items = [copy, ...store.items];
      return copy;
    },
    async reorder(id, direction) {
      const index = store.items.findIndex((item) => item.id === id);
      const targetIndex = index + direction;
      if (
        index === -1 ||
        targetIndex < 0 ||
        targetIndex >= store.items.length
      ) {
        return;
      }
      const next = [...store.items];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      store.items = next;
    },
  };
}

export const fichesRepository = createRepository<FicheAdmin>(
  "fiches",
  seedFiches(),
);
export const analysesRepository = createRepository<AnalyseAdmin>(
  "analyses",
  seedAnalyses(),
);
export const glossaireRepository = createRepository<GlossaireTermeAdmin>(
  "glossaire",
  seedGlossaire(),
);
export const ressourcesRepository = createRepository<RessourceAdmin>(
  "ressources",
  seedRessources(),
);
export const categoriesRepository = createRepository<CategorieAdmin>(
  "categories",
  seedCategories(),
);

export interface SingletonStore<T> {
  get(): Promise<T>;
  update(patch: Partial<T>): Promise<T>;
}

/**
 * Variante de `createRepository` pour un objet unique plutôt qu'une liste
 * (les réglages du site n'ont ni identifiant, ni statut éditorial, ni
 * réorganisation) — même ancrage `globalThis` pour la même raison (voir
 * `globalStore`), mais une API réduite à `get`/`update`.
 */
function globalSingleton<T>(key: string, seed: T): { value: T } {
  const globalKey = `__lexwatch_admin_singleton__${key}`;
  const store = globalThis as unknown as Record<
    string,
    { value: T } | undefined
  >;
  if (!store[globalKey]) {
    store[globalKey] = { value: seed };
  }
  return store[globalKey]!;
}

export function createSingletonStore<T>(
  key: string,
  seed: T,
): SingletonStore<T> {
  const store = globalSingleton<T>(key, seed);

  return {
    async get() {
      return { ...store.value };
    },
    async update(patch) {
      store.value = { ...store.value, ...patch };
      return { ...store.value };
    },
  };
}

export const siteSettingsStore = createSingletonStore<SiteSettings>(
  "site-settings",
  seedSiteSettings(),
);
