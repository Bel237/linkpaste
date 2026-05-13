"use client";

import { X, Link, Star, FolderOpen, TrendingUp } from "lucide-react";
import { LinkItem, Category, Collection } from "@/lib/types";

interface StatsPanelProps {
  open: boolean;
  onClose: () => void;
  links: LinkItem[];
  categories: Category[];
  collections: Collection[];
}

export default function StatsPanel({
  open,
  onClose,
  links,
  categories,
  collections,
}: StatsPanelProps) {
  if (!open) return null;

  const totalLinks = links.length;
  const totalFavorites = links.filter((l) => l.isFavorite).length;
  const totalCollections = collections.length;

  const platformCounts: Record<string, number> = {};
  links.forEach((l) => {
    platformCounts[l.platform] = (platformCounts[l.platform] || 0) + 1;
  });
  const topPlatforms = Object.entries(platformCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const categoryCounts: Record<string, number> = {};
  links.forEach((l) => {
    categoryCounts[l.category] = (categoryCounts[l.category] || 0) + 1;
  });

  const thisWeek = links.filter((l) => {
    const diff = Date.now() - new Date(l.createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Statistiques
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 dark:bg-indigo-950 rounded-xl p-4">
              <Link className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{totalLinks}</p>
              <p className="text-xs text-indigo-500">Liens sauvegardés</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950 rounded-xl p-4">
              <Star className="w-5 h-5 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{totalFavorites}</p>
              <p className="text-xs text-yellow-500">Favoris</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 rounded-xl p-4">
              <FolderOpen className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{totalCollections}</p>
              <p className="text-xs text-green-500">Collections</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950 rounded-xl p-4">
              <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{thisWeek}</p>
              <p className="text-xs text-purple-500">Cette semaine</p>
            </div>
          </div>

          {/* Top platforms */}
          {topPlatforms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Top plateformes
              </h3>
              <div className="space-y-2">
                {topPlatforms.map(([platform, count]) => (
                  <div key={platform} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24 truncate">
                      {platform}
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full transition-all"
                        style={{
                          width: `${(count / totalLinks) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 w-8 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Par catégorie
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                return (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.name}
                    <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                      {count}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
