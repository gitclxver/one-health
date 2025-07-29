import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div className="p-4">
    <h1 className="text-xl font-bold mb-4">Committee Dashboard</h1>
    <Outlet />
  </div>
);

export default DashboardLayout;
