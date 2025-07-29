import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
//import About from "../pages/About";
import Articles from "../pages/Articles";
import Profile from "../pages/Profile";
//import DashboardHome from "../pages/dashboard/DashboardHome";
import PublicLayout from "../layouts/PublicLayout";
//import DashboardLayout from "../layouts/DashboardLayout";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/articles" element={<Articles />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      {/* <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
      </Route> */}
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
