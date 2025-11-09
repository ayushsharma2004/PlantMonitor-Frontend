import React, { useState } from "react";
import axios from "axios";

export default function CreatePlantModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    plantId: "",
    plantName: "",
    category: "Indoor",
    health: 100,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.plantId || !formData.plantName) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/plants/update-plant",
        {
          plantId: formData.plantId,
          plantName: formData.plantName,
          plantCategory: formData.category,
        }
      );

      if (response.data.success) {
        alert("Plant saved successfully!");
        onSave({
          id: formData.plantId,
          name: formData.plantName,
          category: formData.category,
          health: formData.health,
        });
        onClose();
      } else {
        alert(response.data.message || "Failed to save plant.");
      }
    } catch (error) {
      console.error("Error saving plant:", error);
      alert("Error connecting to the server.");
    } finally {
      setLoading(false);
      setFormData({
        plantId: "",
        plantName: "",
        category: "Indoor",
        health: 100,
      });
    }
  };

  if (!isOpen) return null;

  return (
    // ✨ Background overlay: light blur with transparent black tint
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Add Plant</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="plantId"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Plant ID
              </label>
              <input
                type="text"
                id="plantId"
                name="plantId"
                value={formData.plantId}
                onChange={handleInputChange}
                placeholder="e.g., plant-004"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="plantName"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Plant Name
              </label>
              <input
                type="text"
                id="plantName"
                name="plantName"
                value={formData.plantName}
                onChange={handleInputChange}
                placeholder="e.g., Mint"
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.25rem",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Herb">Herb</option>
                <option value="Succulent">Succulent</option>
                <option value="Flower">Flower</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                loading
                  ? "bg-neutral-700 cursor-not-allowed"
                  : "bg-neutral-900 hover:bg-neutral-800"
              } text-white`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Plant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
