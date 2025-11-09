import React, { useState, useEffect } from "react";
import axios from "axios";

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
        const response = await axios.get(
          `https://rmwcvlcc-8080.inc1.devtunnels.ms/api/v1/plants/plant/${plantId}`
        );

        if (response.data && response.data.success) {
          const plant = response.data.plant;
          console.log("Fetched plant data:", plant);

          // ✅ plant.moisture is raw analog value (0–4095)
          const wet = 2500;
          const dry = 4800;
          let calculatedMoisture = 0;

          if (plant.moisture !== undefined && plant.moisture !== null) {
            calculatedMoisture =
              ((dry - Number(plant.moisture)) / (dry - wet)) * 100;

            // Clamp between 0–100%
            calculatedMoisture = Math.min(100, Math.max(0, calculatedMoisture));
          }

          calculatedMoisture = Number(calculatedMoisture.toFixed(1));

          const wateringStatus = calculatedMoisture < 30 ? "ON" : "OFF";

          setPlantData({
            name: plant.plantName || "Unknown",
            category: plant.plantCategory || "N/A",
            moisture: calculatedMoisture,
            temperature: plant.temperature || 0,
            humidity: plant.humidity || 0,
            wateringStatus,
          });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-neutral-600 text-lg">
        Loading plant data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-neutral-600">
        <p className="text-lg font-medium mb-2">⚠️ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-white bg-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12 pb-8 border-b border-neutral-200">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => window.history.back()}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
              {plantData.name}
            </h1>
          </div>
          <div className="flex items-center gap-3 ml-8">
            <span className="inline-block text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md">
              {plantData.category}
            </span>
            <span className="text-sm text-neutral-500">ID: {plantId}</span>
          </div>
        </div>

        {/* Sensor Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Moisture */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Moisture
            </h3>
            <div
              className={`text-3xl font-semibold mb-3 ${getMoistureColor(
                plantData.moisture
              )}`}
            >
              {plantData.moisture}%
            </div>
            <div className="text-xs text-neutral-600 mb-3">
              Watering{" "}
              <span
                className={`font-semibold ${
                  plantData.wateringStatus === "ON"
                    ? "text-blue-600"
                    : "text-neutral-500"
                }`}
              >
                {plantData.wateringStatus}
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getMoistureBgColor(
                  plantData.moisture
                )}`}
                style={{ width: `${plantData.moisture}%` }}
              />
            </div>
          </div>

          {/* Temperature */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Temperature
            </h3>
            <div className="text-3xl font-semibold text-orange-600 mb-3">
              {plantData.temperature}°C
            </div>
            <p className="text-xs text-neutral-600">Room temperature</p>
          </div>

          {/* Humidity */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">
              Humidity
            </h3>
            <div className="text-3xl font-semibold text-cyan-600 mb-3">
              {plantData.humidity}%
            </div>
            <p className="text-xs text-neutral-600">Air humidity level</p>
          </div>
        </div>
      </div>
    </div>
  );
}
