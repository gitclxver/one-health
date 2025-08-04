// src/layouts/PublicLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Assuming you have a Navbar
import Footer from "../components/Footer"; // Assuming you have a Footer

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Added consistent horizontal padding and max-width for content */}
        {/* The gradient is now applied to the body, so this container will sit on top of it */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
