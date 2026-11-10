"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useCategories } from "@/hooks/useCategories";
import { ROSHE_ALL_CATEGORIES } from "@/hooks/useNavigationMenu";
import { Search, X, SlidersHorizontal, Sparkles, RotateCcw } from "lucide-react";

// ─── Debounce helper ──────────────────────────────────────────────────────────
function useDebounce(fn: (value: string) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (value: string) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(value), delay);
    },
    [fn, delay],
  );
}

// ─── Main Top Filter Bar ──────────────────────────────────────────────────────
export default function CollectionFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(params.get("search") ?? "");
  const [minValue, setMinValue] = useState(params.get("min") ?? "");
  const [maxValue, setMaxValue] = useState(params.get("max") ?? "");
  const [showPriceFilter, setShowPriceFilter] = useState(
    Boolean(params.get("min") || params.get("max")),
  );

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const activeCategory = params.get("category") ?? "";

  const categoryList = useMemo(() => {
    if (categories && categories.length > 0) {
      const dbList = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        group:
          cat.slug?.includes("jewel") ||
          cat.slug?.includes("ring") ||
          cat.slug?.includes("necklace") ||
          cat.slug?.includes("box") ||
          cat.slug?.includes("earring") ||
          cat.slug?.includes("bracelet") ||
          cat.slug?.includes("anklet") ||
          cat.slug?.includes("hair") ||
          cat.slug?.includes("chain") ||
          cat.slug?.includes("silver") ||
          cat.slug?.includes("gold") ||
          cat.slug?.includes("set")
            ? "jewelry"
            : cat.slug?.includes("skin") ||
              cat.slug?.includes("cream") ||
              cat.slug?.includes("serum") ||
              cat.slug?.includes("fragrance") ||
              cat.slug?.includes("perfume")
            ? "beauty"
            : "makeup",
      }));

      // Merge with hardcoded to guarantee full coverage
      const merged = [...dbList];
      ROSHE_ALL_CATEGORIES.forEach((def) => {
        if (!merged.some((m) => m.slug === def.slug)) {
          merged.push({
            id: def.slug,
            name: def.title,
            slug: def.slug,
            group: def.group,
          });
        }
      });
      return merged;
    }

    // Default hardcoded list
    return ROSHE_ALL_CATEGORIES.map((def) => ({
      id: def.slug,
      name: def.title,
      slug: def.slug,
      group: def.group,
    }));
  }, [categories]);

  const activeCategoryName = useMemo(() => {
    if (!activeCategory) return null;
    if (activeCategory === "makeup") return "Makeup & Lipsticks";
    if (activeCategory === "jewelry") return "Jewelry & Keepsakes";
    if (activeCategory === "beauty" || activeCategory === "skincare")
      return "Beauty & Skincare";
    const found = categoryList.find(
      (c) => c.id === activeCategory || c.slug === activeCategory,
    );
    return found ? found.name : "Selected Category";
  }, [activeCategory, categoryList]);

  const updateFilter = useCallback(
    (updates: Record<string, string>) => {
      const query = new URLSearchParams(params.toString());
      query.delete("page");
      Object.entries(updates).forEach(([key, value]) => {
        if (value) query.set(key, value);
        else query.delete(key);
      });
      startTransition(() => {
        router.push(`/collection?${query.toString()}`);
      });
    },
    [params, router],
  );

  const pushSearch = useCallback(
    (value: string) => updateFilter({ search: value }),
    [updateFilter],
  );
  const pushMin = useCallback(
    (value: string) => updateFilter({ min: value }),
    [updateFilter],
  );
  const pushMax = useCallback(
    (value: string) => updateFilter({ max: value }),
    [updateFilter],
  );

  const debouncedSearch = useDebounce(pushSearch, 400);
  const debouncedMin = useDebounce(pushMin, 500);
  const debouncedMax = useDebounce(pushMax, 500);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      debouncedSearch(e.target.value);
    },
    [debouncedSearch],
  );

  const handleMin = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMinValue(e.target.value);
      debouncedMin(e.target.value);
    },
    [debouncedMin],
  );

  const handleMax = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMaxValue(e.target.value);
      debouncedMax(e.target.value);
    },
    [debouncedMax],
  );

  const clearAll = useCallback(() => {
    setSearchValue("");
    setMinValue("");
    setMaxValue("");
    startTransition(() => router.push("/collection"));
  }, [router]);

  const clearSearch = useCallback(() => {
    setSearchValue("");
    updateFilter({ search: "" });
  }, [updateFilter]);

  const clearPrice = useCallback(() => {
    setMinValue("");
    setMaxValue("");
    updateFilter({ min: "", max: "" });
  }, [updateFilter]);

  const selectCategory = useCallback(
    (id: string) => {
      updateFilter({ category: activeCategory === id ? "" : id });
    },
    [activeCategory, updateFilter],
  );

  const activeFilters = useMemo(() => {
    let count = 0;
    if (params.get("search")) count++;
    if (params.get("min")) count++;
    if (params.get("max")) count++;
    if (params.get("category")) count++;
    return count;
  }, [params]);

  return (
    <div className="w-full space-y-4">
      {/* ── 1. Top Category Pills Bar (Horizontal Scrollable) ── */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* "All" Category Pill */}
          <button
            type="button"
            onClick={() => updateFilter({ category: "" })}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-sm ${
              !activeCategory
                ? "bg-[#704638] text-white border border-[#D4A45E] shadow-md shadow-[#704638]/20"
                : "bg-white text-[#704638] border border-[#D4A45E]/30 hover:border-[#D4A45E] hover:bg-[#F4DCD8]/40"
            }`}
          >
            <Sparkles className={`w-3 h-3 ${!activeCategory ? "text-[#D4A45E]" : "text-[#8C5E50]"}`} />
            <span>All Products</span>
          </button>

          {/* Quick Main Category: Makeup */}
          <button
            type="button"
            onClick={() => selectCategory("makeup")}
            className={`shrink-0 inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-sm ${
              activeCategory === "makeup"
                ? "bg-[#704638] text-white border border-[#D4A45E] shadow-md shadow-[#704638]/20"
                : "bg-white text-[#704638] border border-[#D4A45E]/30 hover:border-[#D4A45E] hover:bg-[#F4DCD8]/40"
            }`}
          >
            <span>💄 All Makeup</span>
          </button>

          {/* Quick Main Category: Jewelry */}
          <button
            type="button"
            onClick={() => selectCategory("jewelry")}
            className={`shrink-0 inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-sm ${
              activeCategory === "jewelry"
                ? "bg-[#704638] text-white border border-[#D4A45E] shadow-md shadow-[#704638]/20"
                : "bg-white text-[#704638] border border-[#D4A45E]/30 hover:border-[#D4A45E] hover:bg-[#F4DCD8]/40"
            }`}
          >
            <span>👑 All Jewelry</span>
          </button>

          {/* Quick Main Category: Beauty & Skincare */}
          <button
            type="button"
            onClick={() => selectCategory("beauty")}
            className={`shrink-0 inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-sm ${
              activeCategory === "beauty" || activeCategory === "skincare"
                ? "bg-[#704638] text-white border border-[#D4A45E] shadow-md shadow-[#704638]/20"
                : "bg-white text-[#704638] border border-[#D4A45E]/30 hover:border-[#D4A45E] hover:bg-[#F4DCD8]/40"
            }`}
          >
            <span>✨ Beauty & Skincare</span>
          </button>

          {/* Specific Subcategory Pills */}
          {categoryList.map((cat) => {
            const isActive = activeCategory === cat.id || activeCategory === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => selectCategory(cat.slug || cat.id)}
                className={`shrink-0 inline-flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 shadow-sm ${
                  isActive
                    ? "bg-[#704638] text-white border border-[#D4A45E] shadow-md shadow-[#704638]/20"
                    : "bg-white text-[#704638] border border-[#D4A45E]/30 hover:border-[#D4A45E] hover:bg-[#F4DCD8]/40"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Filter Controls Toolbar (Search, Price Toggle, Clear) ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[#D4A45E]/30 shadow-sm">
        {/* Search Input Bar */}
        <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8C5E50]" />
          <input
            id="filter-search"
            type="search"
            value={searchValue}
            placeholder="Search lipsticks, eyeliners, waterproof jewelry, boxes…"
            onChange={handleSearch}
            className="w-full rounded-full border border-[#D4A45E]/30 bg-[#F9F4EF]/60 py-2 pl-9 pr-8 text-xs sm:text-sm text-[#704638] placeholder-[#8C5E50]/60 outline-none transition-all focus:border-[#D4A45E] focus:bg-white focus:ring-2 focus:ring-[#D4A45E]/20"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C5E50] hover:text-[#704638]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Tools: Price Toggle + Reset Button */}
        <div className="flex items-center gap-2">
          {/* Price Filter Trigger */}
          <button
            type="button"
            onClick={() => setShowPriceFilter((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
              showPriceFilter || minValue || maxValue
                ? "bg-[#704638] text-white border-[#D4A45E]"
                : "bg-white text-[#704638] border-[#D4A45E]/30 hover:border-[#D4A45E] hover:bg-[#F9F4EF]"
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 text-[#D4A45E]" />
            <span>Price Range</span>
            {(minValue || maxValue) && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4A45E]" />
            )}
          </button>

          {/* Loading indicator */}
          {isPending && (
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#D4A45E] border-t-[#704638]" />
          )}

          {/* Reset All Filters Button */}
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset ({activeFilters})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Expandable Price Slider / Inputs ── */}
      {showPriceFilter && (
        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-[#F9F4EF] border border-[#D4A45E]/30 animate-in fade-in duration-200">
          <span className="text-xs font-bold text-[#704638] uppercase tracking-wider">
            Price Range (Rs):
          </span>
          <div className="flex items-center gap-2">
            <div className="relative w-28">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8C5E50] font-mono">
                Rs
              </span>
              <input
                id="filter-min-price"
                type="number"
                inputMode="decimal"
                value={minValue}
                placeholder="Min"
                min={0}
                onChange={handleMin}
                className="w-full rounded-full border border-[#D4A45E]/30 bg-white py-1.5 pl-8 pr-2 text-xs font-mono text-[#704638] placeholder-[#8C5E50]/60 outline-none focus:border-[#D4A45E]"
              />
            </div>
            <span className="text-xs text-[#8C5E50]">—</span>
            <div className="relative w-28">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8C5E50] font-mono">
                Rs
              </span>
              <input
                id="filter-max-price"
                type="number"
                inputMode="decimal"
                value={maxValue}
                placeholder="Max"
                min={0}
                onChange={handleMax}
                className="w-full rounded-full border border-[#D4A45E]/30 bg-white py-1.5 pl-8 pr-2 text-xs font-mono text-[#704638] placeholder-[#8C5E50]/60 outline-none focus:border-[#D4A45E]"
              />
            </div>
            {(minValue || maxValue) && (
              <button
                type="button"
                onClick={clearPrice}
                className="text-xs text-rose-700 hover:underline px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── 4. Active Filter Chips ── */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C5E50]">
            Applied:
          </span>

          {activeCategoryName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#704638] text-white shadow-xs">
              <span>{activeCategoryName}</span>
              <button
                type="button"
                onClick={() => updateFilter({ category: "" })}
                className="hover:text-[#D4A45E]"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchValue && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#704638] border border-[#D4A45E]/40 shadow-xs">
              <span>&ldquo;{searchValue}&rdquo;</span>
              <button
                type="button"
                onClick={clearSearch}
                className="hover:text-rose-600"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(minValue || maxValue) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#704638] border border-[#D4A45E]/40 shadow-xs">
              <span>
                Rs {minValue || "0"} – {maxValue || "Any"}
              </span>
              <button
                type="button"
                onClick={clearPrice}
                className="hover:text-rose-600"
                aria-label="Remove price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
