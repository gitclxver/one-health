import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
//import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageArticles from "./pages/admin/ManageArticles";
import ManageCommittee from "./pages/admin/ManageCommittee";
import AdminLayout from "./components/admin/AdminLayout";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes with standard layout */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route
                      path="/articles/:id"
                      element={<ArticleDetailsPage />}
                    />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <ProtectedRoute>
                <ManageArticles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/committee"
            element={
              <ProtectedRoute>
                <ManageCommittee />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
