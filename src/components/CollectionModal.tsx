"use client";

import { useState, useEffect } from "react";
import { X, FolderPlus } from "lucide-react";
import { Collection } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const EMOJI_LIST = [
  "📁", "📂", "🎬", "🎵", "🎮", "📚", "🍳", "💻", "🎨", "✈️",
  "🏋️", "💡", "🛒", "📸", "🎯", "🔥", "💎", "🌟", "🎉", "❤️",
  "🧠", "📱", "🎭", "🏠", "🌍", "🎸", "⚽", "🍕", "🐱", "🌈",
];

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (collection: Collection) => void;
  editCollection?: Collection | null;
}

export default function CollectionModal({
  open,
  onClose,
  onSave,
  editCollection,
}: CollectionModalProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📁");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && editCollection) {
      setName(editCollection.name);
      setEmoji(editCollection.emoji);
    }
    if (open && !editCollection) {
      setName("");
      setEmoji("📁");
      setError("");
    }
  }, [open, editCollection]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Donnez un nom à votre collection");
      return;
    }
    onSave({
      id: editCollection?.id || uuidv4(),
      name: name.trim(),
      emoji,
      createdAt: editCollection?.createdAt || new Date().toISOString(),
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div className="border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editCollection ? "Modifier la collection" : "Nouvelle collection"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_LIST.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                    emoji === e
                      ? "bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500 scale-110"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de la collection
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Ex: Recettes à tester, Projets dev..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <FolderPlus className="w-4 h-4" />
            {editCollection ? "Modifier" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}
