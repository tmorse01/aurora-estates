import { SearchBar } from "../components/SearchBar";
import { PropertyCard } from "../components/PropertyCard";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

export function Home() {
  const properties = useQuery(api.properties.getFeatured) || [];
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/listings?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 aurora-glow">
          Discover Your Dream Space
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Explore extraordinary properties in prime locations
        </p>
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-8 aurora-glow">Featured Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}
