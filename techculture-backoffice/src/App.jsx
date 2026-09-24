import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Shell from "./components/Shell";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Blogs from "./pages/Blogs";
import BlogEditor from "./pages/BlogEditor";
import Careers from "./pages/Careers";
import Team from "./pages/Team";
import DemoBookings from "./pages/DemoBookings";
import ContactMessages from "./pages/ContactMessages";
import Faqs from "./pages/Faqs";
import NotFound from "./pages/NotFound";

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Shell />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/:id/edit" element={<BlogEditor />} />
          <Route path="careers" element={<Careers />} />
          <Route path="team" element={<Team />} />
          <Route path="demos" element={<DemoBookings />} />
          <Route path="contacts" element={<ContactMessages />} />
          <Route path="faqs" element={<Faqs />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
