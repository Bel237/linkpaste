import { PLATFORM_PATTERNS, LinkItem, SortOption } from "./types";

export function detectPlatform(url: string): { name: string; color: string } {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    for (const [pattern, info] of Object.entries(PLATFORM_PATTERNS)) {
      if (hostname.includes(pattern)) {
        return info;
      }
    }
  } catch {
    // invalid URL
  }
  return { name: "Web", color: "#6B7280" };
}

export function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "";
  }
}

export function getThumbnailUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace("www.", "");

    // YouTube
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      let videoId = "";
      if (hostname.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1);
      } else {
        videoId = parsed.searchParams.get("v") || "";
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }

    // Vimeo — use oEmbed at runtime isn't feasible client-side, skip
    // For other platforms, no reliable thumbnail extraction without server
  } catch {
    // invalid URL
  }
  return "";
}

export function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function sortLinks(links: LinkItem[], sort: SortOption): LinkItem[] {
  const sorted = [...links];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "alpha":
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
      );
    case "platform":
      return sorted.sort((a, b) => a.platform.localeCompare(b.platform));
    default:
      return sorted;
  }
}
