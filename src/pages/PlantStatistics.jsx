import { useState, useEffect } from "react";
import {
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Leaf,
  ArrowLeft,
} from "lucide-react";

export default function PlantStatistics() {
  const plantId = "plant-006";
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlantData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://plantmonitor-backend.onrender.com/api/v1/plants/plant/${plantId}`
        );
        const data = await response.json();

        if (data?.success) {
          const plant = data.plant;
          const wet = 1800;
          const dry = 4800;

          let calculatedMoisture = 0;
          if (plant.moisture !== undefined && plant.moisture !== null) {
            calculatedMoisture =
              ((dry - Number(plant.moisture)) / (dry - wet)) * 100;
            calculatedMoisture = Math.min(100, Math.max(0, calculatedMoisture));
          }

          calculatedMoisture = Number(calculatedMoisture.toFixed(1));
          const wateringStatus = calculatedMoisture < 30 ? "ON" : "OFF";

          const newPlantData = {
            name: plant.plantName || "Unknown",
            category: plant.plantCategory || "N/A",
            wateringStatus,
          };

          if (calculatedMoisture > 0 || isNaN(calculatedMoisture))
            newPlantData.moisture = calculatedMoisture;

          if (plant.temperature > 0 || isNaN(plant.temperature))
            newPlantData.temperature = parseFloat(plant.temperature).toFixed(1);

          if (plant.soil_temperature > 0 || isNaN(plant.soil_temperature))
            newPlantData.soil_temperature = parseFloat(
              plant.soil_temperature
            ).toFixed(1);

          if (
            plant.evaporative_demand > 0 ||
            typeof plant.evaporative_demand !== "number" ||
            isNaN(plant.evaporative_demand)
          )
            newPlantData.evaporative_demand = plant.evaporative_demand;

          if (plant.watering_recommendation?.trim() !== "")
            newPlantData.watering_recommendation =
              plant.watering_recommendation;

          setPlantData(newPlantData);
        } else {
          setError("No data found for this plant.");
        }
      } catch (err) {
        console.error("Error fetching plant data:", err);
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [plantId]);

  const getMoistureColor = (moisture) => {
    if (moisture < 30) return "text-rose-600";
    if (moisture < 60) return "text-amber-600";
    return "text-emerald-600";
  };

  const getMoistureBgColor = (moisture) => {
    if (moisture < 30) return "bg-rose-500";
    if (moisture < 60) return "bg-amber-500";
    return "bg-emerald-500";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading plant data</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-50">
        <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-7 h-7 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-base font-medium text-neutral-900 mb-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-white bg-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-neutral-200">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight mb-2">
                {plantData.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="inline-block text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md">
                  {plantData.category}
                </span>
                <span className="text-sm text-neutral-500">ID: {plantId}</span>
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                plantData.wateringStatus === "ON"
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
              }`}
            >
              Watering {plantData.wateringStatus}
            </div>
          </div>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Moisture */}
          {plantData.moisture > 0 && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 group hover:border-neutral-300 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                  <Droplets className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="text-sm font-medium text-neutral-700">
                  Soil Moisture
                </h3>
              </div>
              <div
                className={`text-3xl font-semibold mb-3 ${getMoistureColor(
                  plantData.moisture
                )}`}
              >
                {plantData.moisture}%
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getMoistureBgColor(
                    plantData.moisture
                  )}`}
                  style={{ width: `${plantData.moisture}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500">Optimal range: 40–70%</p>
            </div>
          )}

          {/* Temperature */}
          {plantData.temperature && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 group hover:border-neutral-300 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-sm font-medium text-neutral-700">
                  Air Temperature
                </h3>
              </div>
              <div className="text-3xl font-semibold text-orange-600 mb-3">
                {plantData.temperature}°C
              </div>
              <p className="text-xs text-neutral-500">Ideal range: 18–30°C</p>
            </div>
          )}

          {/* Soil Temperature */}
          {plantData.soil_temperature && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 group hover:border-neutral-300 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <Sun className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-sm font-medium text-neutral-700">
                  Soil Temperature
                </h3>
              </div>
              <div className="text-3xl font-semibold text-amber-600 mb-3">
                {plantData.soil_temperature}°C
              </div>
              <p className="text-xs text-neutral-500">Affects root growth</p>
            </div>
          )}

          {/* Evaporative Demand */}
          {plantData.evaporative_demand && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 group hover:border-neutral-300 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                  <Wind className="w-5 h-5 text-sky-700" />
                </div>
                <h3 className="text-sm font-medium text-neutral-700">
                  Evaporative Demand
                </h3>
              </div>
              <div className="text-2xl font-semibold text-sky-700 mb-3 capitalize">
                {plantData.evaporative_demand}
              </div>
              <p className="text-xs text-neutral-500">Water evaporation rate</p>
            </div>
          )}
        </div>

        {/* Watering Recommendation */}
        {plantData.watering_recommendation && (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Droplets className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-1">
                  Watering Recommendation
                </h3>
                <p className="text-lg font-semibold text-emerald-700 capitalize">
                  {plantData.watering_recommendation.replaceAll("_", " ")}
                </p>
                <p className="text-xs text-neutral-600 mt-2">
                  Based on current soil and moisture conditions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
