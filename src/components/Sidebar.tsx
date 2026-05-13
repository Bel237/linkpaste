"use client";

import {
  Bookmark,
  Star,
  FolderOpen,
  Play,
  FileText,
  Music,
  GraduationCap,
  ShoppingBag,
  Sparkles,
  Link,
  ChefHat,
  FolderPlus,
  Trash2,
  Edit3,
} from "lucide-react";
import { Category, Collection } from "@/lib/types";

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  play: Play,
  "file-text": FileText,
  music: Music,
  "graduation-cap": GraduationCap,
  "shopping-bag": ShoppingBag,
  sparkles: Sparkles,
  link: Link,
  "chef-hat": ChefHat,
};

interface SidebarProps {
  categories: Category[];
  collections: Collection[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  linkCounts: Record<string, number>;
  collectionCounts: Record<string, number>;
  totalCount: number;
  favoriteCount: number;
  onAddCollection: () => void;
  onEditCollection: (col: Collection) => void;
  onDeleteCollection: (id: string) => void;
}

export default function Sidebar({
  categories,
  collections,
  activeFilter,
  onFilterChange,
  linkCounts,
  collectionCounts,
  totalCount,
  favoriteCount,
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <nav className="space-y-1">
        {/* All links */}
        <button
          onClick={() => onFilterChange("all")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeFilter === "all"
              ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="flex-1 text-left">Tous les liens</span>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {totalCount}
          </span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onFilterChange("favorites")}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeFilter === "favorites"
              ? "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <Star className="w-4 h-4" />
          <span className="flex-1 text-left">Favoris</span>
          {favoriteCount > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {favoriteCount}
            </span>
          )}
        </button>

        {/* Collections */}
        <div className="pt-4 pb-2 px-4 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Collections
          </p>
          <button
            onClick={onAddCollection}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Nouvelle collection"
          >
            <FolderPlus className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        {collections.length === 0 && (
          <p className="text-xs text-gray-400 px-4 py-1">Aucune collection</p>
        )}

        {collections.map((col) => {
          const count = collectionCounts[col.id] || 0;
          return (
            <div key={col.id} className="group/col relative">
              <button
                onClick={() => onFilterChange(`col:${col.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === `col:${col.id}`
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-base">{col.emoji}</span>
                <span className="flex-1 text-left truncate">{col.name}</span>
                {count > 0 && (
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover/col:flex items-center gap-0.5">
                <button onClick={() => onEditCollection(col)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  <Edit3 className="w-3 h-3 text-gray-400" />
                </button>
                <button onClick={() => onDeleteCollection(col.id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-950 rounded">
                  <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Categories */}
        <div className="pt-4 pb-2 px-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Catégories
          </p>
        </div>

        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || FolderOpen;
          const count = linkCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange(`cat:${cat.id}`)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeFilter === `cat:${cat.id}`
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ backgroundColor: cat.color + "20" }}
              >
                <IconComponent
                  className="w-3 h-3"
                  style={{ color: cat.color } as React.CSSProperties}
                />
              </div>
              <span className="flex-1 text-left">{cat.name}</span>
              {count > 0 && (
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
