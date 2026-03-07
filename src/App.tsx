import { Routes, Route, Navigate } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import ReservasPage from "@/pages/ReservasPage";
import CanchasPage from "@/pages/CanchasPage";
import TarifasPage from "@/pages/TarifasPage";
import ConfiguracionPage from "@/pages/ConfiguracionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reservas" element={<ReservasPage />} />
        <Route path="/canchas" element={<CanchasPage />} />
        <Route path="/tarifas" element={<TarifasPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
      </Route>
    </Routes>
  );
}

export default App;
