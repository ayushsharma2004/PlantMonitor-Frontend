import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreatePlantModal from "@/components/CreatePlantModal";

export default function PlantLanding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8080/api/v1/plants/all-plants"
      );

      if (res.data.success && res.data.plants) {
        const filteredPlants = res.data.plants.filter(
          (plant) => plant.plantName && plant.plantName.trim() !== ""
        );

        const formatted = filteredPlants.map((p) => ({
          id: p.plantId || "N/A",
          name: p.plantName,
          category: p.plantCategory || "Uncategorized",
          health: 100,
        }));

        setPlants(formatted);
      } else {
        setPlants([]);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const getHealthColor = (health) => {
    if (health > 75) return "text-emerald-600";
    if (health > 50) return "text-amber-600";
    return "text-rose-600";
  };

  const getHealthBgColor = (health) => {
    if (health > 75) return "bg-emerald-500";
    if (health > 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const handleAddPlant = (newPlant) => {
    setPlants((prev) => [...prev, newPlant]);
  };

  const handlePlantClick = (plantId) => {
    navigate(`/stats/${plantId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 pb-8 border-b border-neutral-200">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight mb-1">
              Plants
            </h1>
            <p className="text-sm text-neutral-500">
              {plants.length} {plants.length === 1 ? "plant" : "plants"} in
              collection
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Plant
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : plants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="text-neutral-900 font-medium mb-1">No plants yet</p>
            <p className="text-sm text-neutral-500">
              Add your first plant to get started
            </p>
          </div>
        ) : (
          /* Plant Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map((plant) => (
              <div
                key={plant.id}
                onClick={() => handlePlantClick(plant.id)}
                className="bg-white border border-neutral-200 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-neutral-300 hover:shadow-sm group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-neutral-900 mb-2 truncate">
                      {plant.name}
                    </h3>
                    <span className="inline-block text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md">
                      {plant.category}
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
                      <svg
                        className="w-5 h-5 text-neutral-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                      Health
                    </span>
                    <span
                      className={`text-sm font-semibold ${getHealthColor(
                        plant.health
                      )}`}
                    >
                      {plant.health}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getHealthBgColor(
                        plant.health
                      )}`}
                      style={{ width: `${plant.health}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Integration */}
      {isModalOpen && (
        <CreatePlantModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddPlant}
        />
      )}
    </div>
  );
}
