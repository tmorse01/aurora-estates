import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    navigate(`/listings?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search properties..."
        className="aurora-input w-full px-6 py-4 rounded-lg text-white placeholder-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="aurora-button absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg text-white font-medium"
      >
        Search
      </button>
    </form>
  );
}
