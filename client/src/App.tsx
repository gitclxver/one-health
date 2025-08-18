import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AdminPublicRoute from "./routes/AdminPublicRoutes";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import ManageArticles from "./pages/admin/ManageArticles";
import ManageCommittee from "./pages/admin/ManageCommittee";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UnsubscribePage from "./pages/UnsubscribePage";
import VerifyPage from "./pages/VerifyPage";
import EventsPage from "./pages/EventsPage";
import ManageEvents from "./pages/admin/ManageEvents";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventsPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailsPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/verify" element={<VerifyPage />} />
          </Route>

          {/* Admin Login Route: only accessible if NOT authenticated */}
          <Route path="/admin/login" element={<AdminPublicRoute />}>
            <Route index element={<AdminLogin />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="articles" element={<ManageArticles />} />
            <Route path="committee" element={<ManageCommittee />} />
            <Route path="events" element={<ManageEvents />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
