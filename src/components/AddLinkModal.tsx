"use client";

import { useState, useEffect, useRef } from "react";
import { X, Link as LinkIcon, Plus, Loader2 } from "lucide-react";
import { Category, Collection, LinkItem } from "@/lib/types";
import { isValidUrl, detectPlatform, getFaviconUrl, getThumbnailUrl } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface AddLinkModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (link: LinkItem) => void;
  categories: Category[];
  collections: Collection[];
  editLink?: LinkItem | null;
  onUpdate?: (link: LinkItem) => void;
}

export default function AddLinkModal({
  open,
  onClose,
  onAdd,
  categories,
  collections,
  editLink,
  onUpdate,
}: AddLinkModalProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (open && editLink) {
      setUrl(editLink.url);
      setTitle(editLink.title);
      setDescription(editLink.description);
      setCategory(editLink.category);
      setCollectionId(editLink.collectionId || "");
      setTags(editLink.tags.join(", "));
    }
    if (open && !editLink) {
      setUrl("");
      setTitle("");
      setDescription("");
      setCategory("");
      setCollectionId("");
      setTags("");
      setUrlError("");
    }
  }, [open, editLink]);

  const handleUrlChange = (val: string) => {
    setUrl(val);
    setUrlError("");
    if (val && isValidUrl(val)) {
      const platform = detectPlatform(val);
      if (!title) {
        setTitle(`Lien ${platform.name}`);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && isValidUrl(text)) {
        handleUrlChange(text);
      }
    } catch {
      // clipboard not available
    }
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      setUrlError("Collez un lien ici");
      return;
    }
    if (!isValidUrl(url.trim())) {
      setUrlError("Ce lien n'est pas valide");
      return;
    }

    const platform = detectPlatform(url);
    const linkData: LinkItem = {
      id: editLink?.id || uuidv4(),
      url: url.trim(),
      title: title.trim() || `Lien ${platform.name}`,
      description: description.trim(),
      category: category || "autres",
      collectionId: collectionId,
      tags: tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      platform: platform.name,
      favicon: getFaviconUrl(url),
      thumbnail: getThumbnailUrl(url),
      createdAt: editLink?.createdAt || new Date().toISOString(),
      isFavorite: editLink?.isFavorite || false,
    };

    if (editLink && onUpdate) {
      onUpdate(linkData);
    } else {
      onAdd(linkData);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editLink ? "Modifier le lien" : "Sauvegarder un lien"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lien *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                    urlError
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-200 dark:border-gray-700 focus:ring-indigo-500"
                  } bg-white dark:bg-gray-800 focus:ring-2 focus:border-transparent outline-none transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400`}
                />
              </div>
              <button
                onClick={handlePaste}
                className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors whitespace-nowrap"
              >
                Coller
              </button>
            </div>
            {urlError && (
              <p className="text-red-500 text-xs mt-1.5">{urlError}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Recette de cookies, Tuto React..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note rapide
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Pourquoi ce lien est intéressant..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catégorie
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                    category === cat.id
                      ? "text-white shadow-md scale-105"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  style={
                    category === cat.id
                      ? { backgroundColor: cat.color }
                      : undefined
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collection */}
          {collections.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Collection
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCollectionId("")}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                    collectionId === ""
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-md"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Aucune
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setCollectionId(col.id)}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                      collectionId === col.id
                        ? "bg-indigo-600 text-white shadow-md scale-105"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {col.emoji} {col.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="drôle, cuisine, dev..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editLink ? "Modifier" : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}
