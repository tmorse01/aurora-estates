import { Link } from "react-router-dom";
import { Doc } from "../../convex/_generated/dataModel";

interface PropertyCardProps {
  property: Doc<"properties">;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/property/${property._id}`}>
      <div className="aurora-card rounded-xl overflow-hidden">
        <div className="relative h-48">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="text-2xl font-bold text-white">
              ${property.price.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 aurora-glow">{property.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{property.address}</p>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>{property.bedrooms} beds</span>
            <span>{property.bathrooms} baths</span>
            <span>{property.squareFeet.toLocaleString()} sq ft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
