"use client";

import { Inbox, Plus } from "lucide-react";

interface EmptyStateProps {
  onAdd: () => void;
  isFiltered: boolean;
}

export default function EmptyState({ onAdd, isFiltered }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-400">
          Aucun lien trouvé
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          Essayez un autre filtre ou une autre recherche
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950 rounded-3xl flex items-center justify-center mb-5">
        <Inbox className="w-10 h-10 text-indigo-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Votre collection est vide
      </h3>
      <p className="text-sm text-gray-400 mt-2 max-w-xs">
        Commencez par sauvegarder un lien depuis vos réseaux sociaux. Collez-le
        ici et retrouvez-le facilement.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
      >
        <Plus className="w-4 h-4" />
        Sauvegarder mon premier lien
      </button>
    </div>
  );
}
