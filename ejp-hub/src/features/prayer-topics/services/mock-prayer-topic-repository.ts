import { INITIAL_MOCK_TOPICS, MOCK_AUTHORS } from "../data/prayer-topic.mocks";
import type { PrayerTopic, PrayerTopicAuthorOption } from "../types/prayer-topic.types";
import type { PrayerTopicFormValues } from "../validation/prayer-topic.schema";
import type { PrayerTopicRepository } from "./prayer-topic-repository";

/**
 * Implémentation en mémoire de `PrayerTopicRepository`, utilisée tant que
 * Supabase n'est pas configuré. L'état est mutable au niveau du module pour
 * que les actions (créer, modifier, dupliquer, archiver…) restent
 * réellement interactives en mode démo — pas de simples données figées.
 */
let topics: PrayerTopic[] = INITIAL_MOCK_TOPICS.map((topic) => ({ ...topic }));

function buildTopic(
  id: string,
  values: PrayerTopicFormValues,
  author: PrayerTopicAuthorOption,
  existing?: PrayerTopic,
): PrayerTopic {
  const now = new Date().toISOString();
  return {
    id,
    title: values.title,
    description: values.description || null,
    category: values.category,
    priority: values.priority,
    status: values.status,
    startDate: values.startDate,
    endDate: values.endDate || null,
    authorId: existing?.authorId ?? author.id,
    authorName: existing?.authorName ?? author.fullName,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    archivedAt: existing?.archivedAt ?? null,
  };
}

function requireTopic(id: string): PrayerTopic {
  const found = topics.find((topic) => topic.id === id);
  if (!found) throw new Error("Sujet de prière introuvable.");
  return found;
}

export const MockPrayerTopicRepository: PrayerTopicRepository = {
  async list() {
    return topics.map((topic) => ({ ...topic }));
  },

  async getById(id) {
    return topics.find((topic) => topic.id === id) ?? null;
  },

  async create(values, author) {
    const created = buildTopic(crypto.randomUUID(), values, author);
    topics = [...topics, created];
    return created;
  },

  async update(id, values) {
    const existing = requireTopic(id);
    const updated = buildTopic(id, values, { id: existing.authorId, fullName: existing.authorName }, existing);
    topics = topics.map((topic) => (topic.id === id ? updated : topic));
    return updated;
  },

  async remove(id) {
    topics = topics.filter((topic) => topic.id !== id);
  },

  async duplicate(id) {
    const existing = requireTopic(id);
    const now = new Date().toISOString();
    const duplicated: PrayerTopic = {
      ...existing,
      id: crypto.randomUUID(),
      title: `${existing.title} (copie)`,
      status: "DRAFT",
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    topics = [...topics, duplicated];
    return duplicated;
  },

  async archive(id) {
    const existing = requireTopic(id);
    const updated: PrayerTopic = { ...existing, status: "ARCHIVED", archivedAt: new Date().toISOString() };
    topics = topics.map((topic) => (topic.id === id ? updated : topic));
    return updated;
  },

  async restore(id) {
    const existing = requireTopic(id);
    const updated: PrayerTopic = {
      ...existing,
      status: "ACTIVE",
      archivedAt: null,
      updatedAt: new Date().toISOString(),
    };
    topics = topics.map((topic) => (topic.id === id ? updated : topic));
    return updated;
  },

  async listAuthorOptions() {
    return MOCK_AUTHORS.map((author) => ({ ...author }));
  },
};
