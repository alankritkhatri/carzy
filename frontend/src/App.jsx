import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import AuthPage from "./pages/Authentication/AuthPage";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/landingPage/landingpage";
import CreateCar from "./components/cars/CreateCar";
import { useAuth } from "./context/AuthContext";
import EditCar from "./components/cars/EditCar";
import PublicCarView from "./components/cars/PublicCarView";
import PublicCarDetail from "./components/cars/PublicCarDetail";
import ShowcasePage from "./pages/ShowcasePage/ShowcasePage";
import { AuthProvider } from "./context/AuthContext";
import Interview from "./pages/Interview";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            user.isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/login"
          element={
            user.isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cars/create" element={<CreateCar />} />
        <Route path="/cars/edit/:id" element={<EditCar />} />
        <Route path="/public/cars" element={<PublicCarView />} />
        <Route path="/public/cars/:publicUrl" element={<PublicCarDetail />} />
        <Route path="/cars/:publicUrl" element={<PublicCarView />} />
        <Route path="/showcase/:name" element={<ShowcasePage />} />
        <Route path="/inteview" element={<Interview />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
