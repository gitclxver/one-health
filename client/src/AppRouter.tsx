// src/AppRouter.tsx (Rename your App.tsx to AppRouter.tsx or adapt this into your existing App.tsx)

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/Home"; // Assuming Home.tsx is your HomePage
import AboutPage from "./pages/About"; // Assuming About.tsx is your AboutPage
import ArticlesPage from "./pages/Articles"; // Updated import for the new Articles page
import SignUpPage from "./pages/SignUp";
//import LoginPage from "./pages/Login"; // Assuming you have a Login page
// import ProfilePage from './pages/Profile'; // For later use
const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/:id" element={<ArticlesPage />} />
            <Route path="signup" element={<SignUpPage />} />
            {/* <Route path="login" element={<LoginPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
export default AppRouter;

// // Layouts (if you're implementing them now)
// import PublicLayout from "./layouts/PublicLayout";
// // import DashboardLayout from './layouts/DashboardLayout'; // For later use

// const AppRouter: React.FC = () => {
//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-grow">
//           <Routes>
//             {/* Public Layout Routes */}
//             <Route path="/" element={<PublicLayout />}>
//               <Route index element={<HomePage />} />
//               <Route path="about" element={<AboutPage />} />
//               <Route path="articles" element={<ArticlesPage />} />
//               <Route path="articles/:id" element={<ArticlesPage />} />{" "}
//               {/* Route for individual articles */}
//               <Route path="signup" element={<SignUpPage />} />
//               <Route path="login" element={<LoginPage />} />
//               {/* <Route path="profile" element={<ProfilePage />} /> */}
//             </Route>

//             {/* Dashboard Layout Routes (for later) */}
//             {/*
//             <Route path="/dashboard" element={<DashboardLayout />}>
//               <Route index element={<DashboardHome />} />
//               <Route path="articles" element={<ManageArticles />} />
//               <Route path="members" element={<ManageCommitteeMembers />} />
//             </Route>
//             */}

//             {/* Catch-all for 404 - Optional */}
//             <Route
//               path="*"
//               element={
//                 <div className="container mx-auto p-8 text-center min-h-screen flex items-center justify-center">
//                   <h1 className="text-4xl font-bold text-gray-800">
//                     404 - Page Not Found
//                   </h1>
//                 </div>
//               }
//             />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default AppRouter;
