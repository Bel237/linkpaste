"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Plus,
  Search,
  X,
  Menu,
  Layers,
  Moon,
  Sun,
  Download,
  Upload,
  TrendingUp,
  ArrowUpDown,
  LayoutGrid,
  List,
} from "lucide-react";
import { LinkItem, Category, Collection, SortOption, ViewMode } from "@/lib/types";
import {
  getLinks,
  addLink,
  updateLink,
  deleteLink,
  getCategories,
  getCollections,
  addCollection as storeAddCollection,
  updateCollection as storeUpdateCollection,
  deleteCollection as storeDeleteCollection,
  getTheme,
  setTheme as storeSetTheme,
  exportData,
  importData,
} from "@/lib/store";
import { sortLinks } from "@/lib/utils";
import AddLinkModal from "@/components/AddLinkModal";
import LinkCard from "@/components/LinkCard";
import Sidebar from "@/components/Sidebar";
import EmptyState from "@/components/EmptyState";
import ToastContainer, { ToastData } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import CollectionModal from "@/components/CollectionModal";
import StatsPanel from "@/components/StatsPanel";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editLink, setEditLink] = useState<LinkItem | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showSidebar, setShowSidebar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteCollection, setConfirmDeleteCollection] = useState<string | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editCollection, setEditCollection] = useState<Collection | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = useCallback((message: string, type: ToastData["type"] = "success") => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    setLinks(getLinks());
    setCategories(getCategories());
    setCollections(getCollections());
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K: focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // Escape: close search / modals
      if (e.key === "Escape") {
        if (search) setSearch("");
      }
      // Ctrl+Shift+V: open add modal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "V") {
        e.preventDefault();
        setEditLink(null);
        setShowAddModal(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [search]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    storeSetTheme(next);
    document.documentElement.classList.toggle("dark");
  };

  const handleAddLink = (link: LinkItem) => {
    const updated = addLink(link);
    setLinks(updated);
    addToast("Lien sauvegardé !");
  };

  const handleUpdateLink = (link: LinkItem) => {
    const updated = updateLink(link);
    setLinks(updated);
    setEditLink(null);
    addToast("Lien modifié");
  };

  const handleDeleteLink = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteLink = () => {
    if (confirmDelete) {
      const updated = deleteLink(confirmDelete);
      setLinks(updated);
      setConfirmDelete(null);
      addToast("Lien supprimé", "info");
    }
  };

  const handleToggleFavorite = (id: string) => {
    const link = links.find((l) => l.id === id);
    if (link) {
      const updated = updateLink({ ...link, isFavorite: !link.isFavorite });
      setLinks(updated);
    }
  };

  const handleEdit = (link: LinkItem) => {
    setEditLink(link);
    setShowAddModal(true);
  };

  // Collections
  const handleSaveCollection = (col: Collection) => {
    if (editCollection) {
      const updated = storeUpdateCollection(col);
      setCollections(updated);
      addToast("Collection modifiée");
    } else {
      const updated = storeAddCollection(col);
      setCollections(updated);
      addToast("Collection créée !");
    }
    setEditCollection(null);
  };

  const handleDeleteCollection = (id: string) => {
    setConfirmDeleteCollection(id);
  };

  const confirmDeleteCol = () => {
    if (confirmDeleteCollection) {
      const { collections: cols, links: lnks } = storeDeleteCollection(confirmDeleteCollection);
      setCollections(cols);
      setLinks(lnks);
      setConfirmDeleteCollection(null);
      if (activeFilter === `col:${confirmDeleteCollection}`) setActiveFilter("all");
      addToast("Collection supprimée", "info");
    }
  };

  // Export
  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkstash-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Export téléchargé !");
  };

  // Import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = importData(ev.target?.result as string);
        setLinks(result.links);
        setCategories(result.categories);
        setCollections(result.collections);
        addToast(`${result.links.length} liens importés !`);
      } catch {
        addToast("Erreur lors de l'import", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const linkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    links.forEach((l) => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return counts;
  }, [links]);

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    links.forEach((l) => {
      if (l.collectionId) {
        counts[l.collectionId] = (counts[l.collectionId] || 0) + 1;
      }
    });
    return counts;
  }, [links]);

  const favoriteCount = useMemo(
    () => links.filter((l) => l.isFavorite).length,
    [links]
  );

  const filteredLinks = useMemo(() => {
    let result = [...links];

    if (activeFilter === "favorites") {
      result = result.filter((l) => l.isFavorite);
    } else if (activeFilter.startsWith("cat:")) {
      const catId = activeFilter.replace("cat:", "");
      result = result.filter((l) => l.category === catId);
    } else if (activeFilter.startsWith("col:")) {
      const colId = activeFilter.replace("col:", "");
      result = result.filter((l) => l.collectionId === colId);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          l.platform.toLowerCase().includes(q) ||
          l.tags.some((t) => t.includes(q)) ||
          l.category.toLowerCase().includes(q)
      );
    }

    return sortLinks(result, sortBy);
  }, [links, activeFilter, search, sortBy]);

  const isFiltered = search.trim() !== "" || activeFilter !== "all";

  const SORT_LABELS: Record<SortOption, string> = {
    newest: "Plus récents",
    oldest: "Plus anciens",
    alpha: "A → Z",
    platform: "Plateforme",
  };

  const sidebarProps = {
    categories,
    collections,
    activeFilter,
    onFilterChange: setActiveFilter,
    linkCounts,
    collectionCounts,
    totalCount: links.length,
    favoriteCount,
    onAddCollection: () => {
      setEditCollection(null);
      setShowCollectionModal(true);
    },
    onEditCollection: (col: Collection) => {
      setEditCollection(col);
      setShowCollectionModal(true);
    },
    onDeleteCollection: handleDeleteCollection,
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Layers className="w-10 h-10 text-indigo-400" />
          <span className="text-sm text-gray-400">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">LinkBel</h1>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                title={theme === "light" ? "Mode sombre" : "Mode clair"}
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-gray-500" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-400" />
                )}
              </button>

              <button
                onClick={() => setShowStats(true)}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors hidden sm:block"
                title="Statistiques"
              >
                <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              <button
                onClick={handleExport}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors hidden sm:block"
                title="Exporter"
              >
                <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors hidden sm:block"
                title="Importer"
              >
                <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />

              <button
                onClick={() => {
                  setEditLink(null);
                  setShowAddModal(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un lien, tag, plateforme... (Ctrl+K)"
            className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-gray-900 rounded-2xl text-sm border border-gray-200 dark:border-gray-800 focus:border-indigo-300 dark:focus:border-indigo-700 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-24">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Sidebar {...sidebarProps} />
            </div>
          </div>

          {/* Mobile sidebar overlay */}
          {showSidebar && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setShowSidebar(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-4 pb-2 shrink-0">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100">Filtres</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <Sidebar
                    {...sidebarProps}
                    onFilterChange={(f) => {
                      setActiveFilter(f);
                      setShowSidebar(false);
                    }}
                  />
                </div>
                {/* Mobile-only actions — fixed at bottom */}
                <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 p-3 flex items-center gap-2">
                  <button onClick={() => { setShowStats(true); setShowSidebar(false); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800" title="Stats">
                    <TrendingUp className="w-3.5 h-3.5" /> Stats
                  </button>
                  <button onClick={() => { handleExport(); setShowSidebar(false); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800" title="Exporter">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button onClick={() => { fileInputRef.current?.click(); setShowSidebar(false); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800" title="Importer">
                    <Upload className="w-3.5 h-3.5" /> Import
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Links area */}
          <main className="flex-1 min-w-0">
            {/* Toolbar: sort + view mode */}
            {links.length > 0 && (
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isFiltered && filteredLinks.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredLinks.length} résultat{filteredLinks.length > 1 ? "s" : ""}
                    </span>
                  )}
                  {activeFilter !== "all" && (
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
                    >
                      Tout afficher
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      {SORT_LABELS[sortBy]}
                    </button>
                    {showSortMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[140px]">
                          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setSortBy(opt);
                                setShowSortMenu(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                                sortBy === opt
                                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 font-medium"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              {SORT_LABELS[opt]}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* View toggle */}
                  <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${
                        viewMode === "grid"
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${
                        viewMode === "list"
                          ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {links.length === 0 && !isFiltered ? (
              <EmptyState
                onAdd={() => {
                  setEditLink(null);
                  setShowAddModal(true);
                }}
                isFiltered={false}
              />
            ) : filteredLinks.length === 0 ? (
              <EmptyState
                onAdd={() => {
                  setEditLink(null);
                  setShowAddModal(true);
                }}
                isFiltered={true}
              />
            ) : viewMode === "list" ? (
              <div className="flex flex-col gap-2">
                {filteredLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    categories={categories}
                    viewMode={viewMode}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteLink}
                    onEdit={handleEdit}
                    onCopy={() => addToast("Lien copié !")}
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    categories={categories}
                    viewMode={viewMode}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteLink}
                    onEdit={handleEdit}
                    onCopy={() => addToast("Lien copié !")}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AddLinkModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditLink(null);
        }}
        onAdd={handleAddLink}
        categories={categories}
        collections={collections}
        editLink={editLink}
        onUpdate={handleUpdateLink}
      />

      <CollectionModal
        open={showCollectionModal}
        onClose={() => {
          setShowCollectionModal(false);
          setEditCollection(null);
        }}
        onSave={handleSaveCollection}
        editCollection={editCollection}
      />

      <StatsPanel
        open={showStats}
        onClose={() => setShowStats(false)}
        links={links}
        categories={categories}
        collections={collections}
      />

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Supprimer ce lien ?"
        message="Cette action est irréversible. Le lien sera définitivement supprimé."
        onConfirm={confirmDeleteLink}
        onCancel={() => setConfirmDelete(null)}
      />

      <ConfirmDialog
        open={confirmDeleteCollection !== null}
        title="Supprimer cette collection ?"
        message="Les liens de cette collection ne seront pas supprimés, mais ils n'auront plus de collection."
        confirmLabel="Supprimer"
        onConfirm={confirmDeleteCol}
        onCancel={() => setConfirmDeleteCollection(null)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
