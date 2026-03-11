import { Routes, Route, Navigate } from "react-router";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import BookingsPage from "@/features/bookings/pages/BookingsPage";
import FieldsPage from "@/features/fields/pages/FieldsPage";
import PricingPage from "@/features/pricing/pages/PricingPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reservas" element={<BookingsPage />} />
        <Route path="/canchas" element={<FieldsPage />} />
        <Route path="/tarifas" element={<PricingPage />} />
        <Route path="/configuracion" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
