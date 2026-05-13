import { LinkItem, Category, Collection, DEFAULT_CATEGORIES } from "./types";

const LINKS_KEY = "linkstash_links";
const CATEGORIES_KEY = "linkstash_categories";
const COLLECTIONS_KEY = "linkstash_collections";
const THEME_KEY = "linkstash_theme";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// --- Links ---

export function getLinks(): LinkItem[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(LINKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LinkItem[];
  } catch {
    return [];
  }
}

export function saveLinks(links: LinkItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function addLink(link: LinkItem): LinkItem[] {
  const links = getLinks();
  links.unshift(link);
  saveLinks(links);
  return links;
}

export function updateLink(updated: LinkItem): LinkItem[] {
  const links = getLinks().map((l) => (l.id === updated.id ? updated : l));
  saveLinks(links);
  return links;
}

export function deleteLink(id: string): LinkItem[] {
  const links = getLinks().filter((l) => l.id !== id);
  saveLinks(links);
  return links;
}

// --- Categories ---

export function getCategories(): Category[] {
  if (!isBrowser()) return DEFAULT_CATEGORIES;
  const raw = localStorage.getItem(CATEGORIES_KEY);
  if (!raw) {
    saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
  try {
    return JSON.parse(raw) as Category[];
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function addCategory(category: Category): Category[] {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
  return categories;
}

export function deleteCategory(id: string): Category[] {
  const categories = getCategories().filter((c) => c.id !== id);
  saveCategories(categories);
  return categories;
}

// --- Collections ---

export function getCollections(): Collection[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(COLLECTIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Collection[];
  } catch {
    return [];
  }
}

export function saveCollections(collections: Collection[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

export function addCollection(collection: Collection): Collection[] {
  const collections = getCollections();
  collections.push(collection);
  saveCollections(collections);
  return collections;
}

export function updateCollection(updated: Collection): Collection[] {
  const collections = getCollections().map((c) =>
    c.id === updated.id ? updated : c
  );
  saveCollections(collections);
  return collections;
}

export function deleteCollection(id: string): {
  collections: Collection[];
  links: LinkItem[];
} {
  const collections = getCollections().filter((c) => c.id !== id);
  saveCollections(collections);
  const links = getLinks().map((l) =>
    l.collectionId === id ? { ...l, collectionId: "" } : l
  );
  saveLinks(links);
  return { collections, links };
}

// --- Theme ---

export function getTheme(): "light" | "dark" {
  if (!isBrowser()) return "light";
  return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
}

export function setTheme(theme: "light" | "dark"): void {
  if (!isBrowser()) return;
  localStorage.setItem(THEME_KEY, theme);
}

// --- Export/Import ---

export function exportData(): string {
  const data = {
    links: getLinks(),
    categories: getCategories(),
    collections: getCollections(),
    exportedAt: new Date().toISOString(),
    version: 1,
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonStr: string): {
  links: LinkItem[];
  categories: Category[];
  collections: Collection[];
} {
  const data = JSON.parse(jsonStr);
  if (!data.links || !Array.isArray(data.links)) {
    throw new Error("Format invalide");
  }
  saveLinks(data.links);
  if (data.categories) saveCategories(data.categories);
  if (data.collections) saveCollections(data.collections);
  return {
    links: data.links,
    categories: data.categories || getCategories(),
    collections: data.collections || getCollections(),
  };
}
