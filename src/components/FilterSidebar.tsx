import { useState } from "react";
import { motion } from "framer-motion";

interface FilterSidebarProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  minBathrooms: number;
  minSquareFeet: number;
  maxSquareFeet: number;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    minBathrooms: 0,
    minSquareFeet: 0,
    maxSquareFeet: 10000,
  });

  const handleFilterChange = (key: keyof FilterValues, value: number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatPrice = (price: number) => `$${(price / 1000000).toFixed(1)}M`;
  const formatArea = (area: number) => `${(area / 1000).toFixed(1)}k sqft`;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="aurora-card p-6 rounded-xl sticky top-24"
    >
      <h2 className="text-xl font-semibold mb-6 aurora-glow">Filters</h2>

      <div className="filter-section">
        <h3 className="text-lg mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Min Price: {formatPrice(filters.minPrice)}</label>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", Number(e.target.value))}
              className="aurora-range-slider"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Max Price: {formatPrice(filters.maxPrice)}</label>
            <input
              type="range"
              min="0"
              max="10000000"
              step="100000"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
              className="aurora-range-slider"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3 className="text-lg mb-4">Bedrooms & Bathrooms</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Min Bedrooms: {filters.minBedrooms}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={filters.minBedrooms}
              onChange={(e) => handleFilterChange("minBedrooms", Number(e.target.value))}
              className="aurora-range-slider"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Min Bathrooms: {filters.minBathrooms}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={filters.minBathrooms}
              onChange={(e) => handleFilterChange("minBathrooms", Number(e.target.value))}
              className="aurora-range-slider"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h3 className="text-lg mb-4">Square Footage</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Min Area: {formatArea(filters.minSquareFeet)}</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.minSquareFeet}
              onChange={(e) => handleFilterChange("minSquareFeet", Number(e.target.value))}
              className="aurora-range-slider"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Max Area: {formatArea(filters.maxSquareFeet)}</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.maxSquareFeet}
              onChange={(e) => handleFilterChange("maxSquareFeet", Number(e.target.value))}
              className="aurora-range-slider"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
