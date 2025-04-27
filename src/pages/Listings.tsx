import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PropertyCard } from "../components/PropertyCard";
import { SearchBar } from "../components/SearchBar";
import { FilterSidebar, FilterValues } from "../components/FilterSidebar";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

export function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState<FilterValues>({
    minPrice: 0,
    maxPrice: 10000000,
    minBedrooms: 0,
    minBathrooms: 0,
    minSquareFeet: 0,
    maxSquareFeet: 10000,
  });

  const searchResults = useQuery(api.properties.search, { searchTerm }) || [];
  
  // Map frontend filter names to match the backend schema names
  const mappedFilters = {
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minBeds: filters.minBedrooms,
    minBaths: filters.minBathrooms,
    minSqFt: filters.minSquareFeet,
    maxSqFt: filters.maxSquareFeet,
  };
  
  const filteredProperties = useQuery(api.properties.list, mappedFilters) || [];

  const displayProperties = searchTerm ? searchResults : filteredProperties;

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setSearchParams({ search: query });
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold mb-6 aurora-glow"
        >
          Available Properties
        </motion.h1>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>
      </div>

      <div className="flex gap-8">
        <div className="w-80 flex-shrink-0">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-grow">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
          >
            {displayProperties.map((property) => (
              <motion.div key={property._id} variants={item}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>

          {displayProperties.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className="text-xl text-gray-400">No properties found</h3>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
