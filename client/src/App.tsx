import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import ManageArticles from "./pages/admin/ManageArticles";
import ManageCommittee from "./pages/admin/ManageCommittee";
import AdminLogin from "./pages/admin/Login";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoutes />}>
            <Route path="articles" element={<ManageArticles />} />
            <Route path="committee" element={<ManageCommittee />} />
            <Route index element={<ManageArticles />} />{" "}
            {/* Optional: default admin route */}
          </Route>

          {/* Admin Login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
