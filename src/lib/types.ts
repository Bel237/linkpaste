export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  collectionId: string;
  tags: string[];
  platform: string;
  favicon: string;
  thumbnail: string;
  createdAt: string;
  isFavorite: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
}

export type SortOption = "newest" | "oldest" | "alpha" | "platform";
export type ViewMode = "grid" | "list";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "videos", name: "Vidéos", color: "#EF4444", icon: "play" },
  { id: "articles", name: "Articles", color: "#3B82F6", icon: "file-text" },
  { id: "musique", name: "Musique", color: "#8B5CF6", icon: "music" },
  { id: "tutos", name: "Tutos", color: "#10B981", icon: "graduation-cap" },
  { id: "shopping", name: "Shopping", color: "#F59E0B", icon: "shopping-bag" },
  { id: "recettes", name: "Recettes", color: "#EC4899", icon: "chef-hat" },
  { id: "inspiration", name: "Inspiration", color: "#6366F1", icon: "sparkles" },
  { id: "autres", name: "Autres", color: "#6B7280", icon: "link" },
];

export const PLATFORM_PATTERNS: Record<string, { name: string; color: string }> = {
  "youtube.com": { name: "YouTube", color: "#FF0000" },
  "youtu.be": { name: "YouTube", color: "#FF0000" },
  "tiktok.com": { name: "TikTok", color: "#000000" },
  "instagram.com": { name: "Instagram", color: "#E4405F" },
  "twitter.com": { name: "Twitter/X", color: "#1DA1F2" },
  "x.com": { name: "Twitter/X", color: "#1DA1F2" },
  "facebook.com": { name: "Facebook", color: "#1877F2" },
  "fb.watch": { name: "Facebook", color: "#1877F2" },
  "reddit.com": { name: "Reddit", color: "#FF4500" },
  "pinterest.com": { name: "Pinterest", color: "#E60023" },
  "linkedin.com": { name: "LinkedIn", color: "#0A66C2" },
  "snapchat.com": { name: "Snapchat", color: "#FFFC00" },
  "twitch.tv": { name: "Twitch", color: "#9146FF" },
  "spotify.com": { name: "Spotify", color: "#1DB954" },
  "vimeo.com": { name: "Vimeo", color: "#1AB7EA" },
  "dailymotion.com": { name: "Dailymotion", color: "#0066DC" },
  "medium.com": { name: "Medium", color: "#000000" },
  "github.com": { name: "GitHub", color: "#333333" },
};
