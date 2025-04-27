import { Link } from "react-router-dom";
import { SignOutButton } from "../SignOutButton";

export function Header() {
  return (
    <header className="aurora-card border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold aurora-glow">
            Aurora Estates
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/listings" className="text-gray-300 hover:text-white transition-colors">
              Listings
            </Link>
            <Link to="/add" className="aurora-button px-4 py-2 rounded-lg text-white">
              Add Property
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
