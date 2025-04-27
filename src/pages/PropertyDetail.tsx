import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Id } from "../../convex/_generated/dataModel";

export function PropertyDetail() {
  const { id } = useParams();
  const property = useQuery(api.properties.get, { id: id as Id<"properties"> });

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl text-gray-400">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="aurora-card rounded-xl overflow-hidden"
      >
        <div className="relative h-96">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {property.title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-white"
            >
              ${property.price.toLocaleString()}
            </motion.p>
          </div>
        </div>

        <div className="p-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-6 mb-8"
          >
            <div className="text-center">
              <p className="text-gray-400">Bedrooms</p>
              <p className="text-2xl font-semibold aurora-glow">{property.bedrooms}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Bathrooms</p>
              <p className="text-2xl font-semibold aurora-glow">{property.bathrooms}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Square Feet</p>
              <p className="text-2xl font-semibold aurora-glow">{property.squareFeet.toLocaleString()}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 aurora-glow">About this property</h2>
            <p className="text-gray-300 mb-6">{property.description}</p>

            <h2 className="text-xl font-semibold mb-4 aurora-glow">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="aurora-card p-3 rounded-lg text-center"
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
