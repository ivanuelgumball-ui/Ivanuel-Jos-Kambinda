import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    settings,
  } = useStore();

  const [selectedSizeFilter, setSelectedSizeFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active
      if (!p.isActive) return false;

      // Category check
      if (activeCategory !== 'Todos' && p.category !== activeCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCat && !matchesDesc) {
          return false;
        }
      }

      // Size filter
      if (selectedSizeFilter !== null) {
        if (!p.sizes.includes(selectedSizeFilter)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, activeCategory, searchQuery, selectedSizeFilter, sortBy]);

  const allSizes = [38, 39, 40, 41, 42, 43, 44, 45];

  return (
    <div className="min-h-screen bg-[#0B0B0C] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
              BCB Shoes · Coleção Oficial
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Catálogo de Ténis por Encomenda
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Selecione o seu modelo, escolha o tamanho e garanta a sua encomenda com segurança.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            A mostrar <strong className="text-white font-mono">{filteredProducts.length}</strong> modelos disponíveis
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {settings.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#141417] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search, Size, and Sort controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-[#121216] border border-white/5 items-center">
            {/* Search Input (5 cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por modelo, marca (Adidas, etc.)..."
                className="w-full bg-[#18181C] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Size Filter (4 cols) */}
            <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                Tamanho:
              </span>
              <button
                onClick={() => setSelectedSizeFilter(null)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                  selectedSizeFilter === null
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#18181C] text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setSelectedSizeFilter(selectedSizeFilter === size ? null : size)
                  }
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                    selectedSizeFilter === size
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-[#18181C] text-slate-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Sort Selector (3 cols) */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 shrink-0">
                Ordenar:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#18181C] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Populares / Destaques</option>
                <option value="price-asc">Preço: Menor para Maior</option>
                <option value="price-desc">Preço: Maior para Menor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[#121215] border border-white/5 space-y-3">
            <p className="text-base font-semibold text-white">Nenhum ténis encontrado</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tente pesquisar por outro termo ou limpe os filtros de tamanho e categoria.
            </p>
            <button
              onClick={() => {
                setActiveCategory('Todos');
                setSearchQuery('');
                setSelectedSizeFilter(null);
              }}
              className="mt-2 px-5 py-2 rounded-xl bg-[#18181C] hover:bg-[#202025] text-xs text-[#D4AF37] border border-[#D4AF37]/30 cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
