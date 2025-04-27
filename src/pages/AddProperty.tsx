import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function AddProperty() {
  const navigate = useNavigate();
  const user = useQuery(api.auth.getUser);
  const addProperty = useMutation(api.properties.add);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    description: "",
    imageUrl: "",
    features: [""] as string[],
  });

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl text-gray-400">Please sign in to add properties</h2>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProperty({
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        squareFeet: parseInt(formData.squareFeet),
        features: formData.features.filter(f => f.trim() !== ""),
      });
      navigate("/listings");
    } catch (error) {
      console.error("Failed to add property:", error);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    if (index === formData.features.length - 1 && value !== "") {
      newFeatures.push("");
    }
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-8 aurora-glow"
      >
        Add New Property
      </motion.h1>

      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="aurora-card p-6 rounded-xl space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="aurora-input w-full px-4 py-2 rounded-lg"
              placeholder="Modern Downtown Condo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="aurora-input w-full px-4 py-2 rounded-lg"
              placeholder="123 Main St, City, State"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="aurora-input w-full px-4 py-2 rounded-lg"
                placeholder="500000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Square Feet
              </label>
              <input
                type="number"
                required
                value={formData.squareFeet}
                onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                className="aurora-input w-full px-4 py-2 rounded-lg"
                placeholder="2000"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                required
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="aurora-input w-full px-4 py-2 rounded-lg"
                placeholder="3"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                required
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="aurora-input w-full px-4 py-2 rounded-lg"
                placeholder="2"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="aurora-input w-full px-4 py-2 rounded-lg"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="aurora-input w-full px-4 py-2 rounded-lg h-32"
              placeholder="Describe the property..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Features
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <input
                  key={index}
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="aurora-input w-full px-4 py-2 rounded-lg"
                  placeholder="Add a feature (e.g., 'Hardwood floors')"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="aurora-button px-6 py-2 rounded-lg text-white font-medium"
          >
            Add Property
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
