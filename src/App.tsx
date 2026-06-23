import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./app/layout";
import Home from "./app/page";
import DealerPartner from "./app/dealer-partner/page";
import BuildPartner from "./app/build-partner/page";
import SolarPartner from "./app/solar-partner/page";
import Manifesto from "./app/manifesto/page";
import Architecture from "./app/architecture/page";
import AdminLeadsPage from "./app/admin/leads/page";
import LoginPage from "./app/login/page";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="dealer-partner" element={<DealerPartner />} />
        <Route path="build-partner" element={<BuildPartner />} />
        <Route path="solar-partner" element={<SolarPartner />} />
        <Route path="manifesto" element={<Manifesto />} />
        <Route path="architecture" element={<Architecture />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="admin/leads" element={<AdminLeadsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
