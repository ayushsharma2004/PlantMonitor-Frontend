import { Routes, Route } from "react-router-dom";
import { PlaneLanding } from "lucide-react";
import PlantLanding from "./pages/PlantLanding.jsx";
import PlantStatistics from "./pages/PlantStatistics.jsx";

export default function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<StudentLanding />} /> */}
        <Route path="/" element={<PlantLanding />} />
        <Route path="/stats/:id" element={<PlantStatistics />} />
      </Routes>
    </>
  );
}
