"use client";

import {
  Star,
  ExternalLink,
  Trash2,
  Edit3,
  Copy,
  Check,
  Play,
} from "lucide-react";
import { LinkItem, Category, ViewMode } from "@/lib/types";
import { formatDate, getDomainFromUrl } from "@/lib/utils";
import { useState } from "react";

interface LinkCardProps {
  link: LinkItem;
  categories: Category[];
  viewMode: ViewMode;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (link: LinkItem) => void;
  onCopy: () => void;
}

export default function LinkCard({
  link,
  categories,
  viewMode,
  onToggleFavorite,
  onDelete,
  onEdit,
  onCopy,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const category = categories.find((c) => c.id === link.category);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link.url);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 1500);
  };

  const showThumbnail = link.thumbnail && !thumbError;

  if (viewMode === "list") {
    return (
      <div className="group flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200 px-4 py-3">
        {/* Favicon */}
        <div className="shrink-0">
          {link.favicon ? (
            <img src={link.favicon} alt="" className="w-6 h-6 rounded-md" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex items-center gap-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate min-w-0 flex-1">
            {link.title}
          </h3>
          <span className="text-xs text-gray-400 truncate shrink-0 hidden sm:block">
            {getDomainFromUrl(link.url)}
          </span>
          {category && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium text-white shrink-0" style={{ backgroundColor: category.color }}>
              {category.name}
            </span>
          )}
          <span className="text-[11px] text-gray-300 dark:text-gray-600 shrink-0">{formatDate(link.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={handleCopy} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Copier">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
          </button>
          <button onClick={() => onToggleFavorite(link.id)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Star className={`w-3.5 h-3.5 ${link.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
          <button onClick={() => onEdit(link)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" title="Modifier">
            <Edit3 className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button onClick={() => onDelete(link.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg" title="Supprimer">
            <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Thumbnail */}
      {showThumbnail && (
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block relative">
          <img
            src={link.thumbnail}
            alt=""
            className="w-full h-36 object-cover"
            onError={() => setThumbError(true)}
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
            <Play className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" />
          </div>
        </a>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Favicon */}
          {!showThumbnail && (
            <div className="shrink-0 mt-0.5">
              {link.favicon ? (
                <img src={link.favicon} alt="" className="w-8 h-8 rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                  {link.title}
                </h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {getDomainFromUrl(link.url)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={handleCopy} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Copier le lien">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                </button>
                <button onClick={() => onEdit(link)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Modifier">
                  <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button onClick={() => onDelete(link.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors" title="Supprimer">
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            {link.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
                {link.description}
              </p>
            )}

            <div className="flex items-center flex-wrap gap-2 mt-3">
              {category && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium text-white" style={{ backgroundColor: category.color }}>
                  {category.name}
                </span>
              )}

              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {link.platform}
              </span>

              {link.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                  #{tag}
                </span>
              ))}

              <span className="text-[11px] text-gray-300 dark:text-gray-600 ml-auto">
                {formatDate(link.createdAt)}
              </span>

              <button onClick={() => onToggleFavorite(link.id)} className="ml-1">
                <Star className={`w-4 h-4 transition-colors ${link.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Clickable link area */}
        {!showThumbnail && (
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl transition-colors group/link">
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover/link:text-indigo-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 truncate">
              {link.url}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
