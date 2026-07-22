import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/AppShell/AppShell";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AppShell user={{ name: "Sumit" }} />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Route>

    </Routes>
  );
}
