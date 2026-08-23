import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-section">
        <Header />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;