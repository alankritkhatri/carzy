import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import AuthPage from "./pages/Authentication/AuthPage";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import store from "./store";
import LandingPage from "./pages/landingPage/landingpage";
import CreateCar from "./components/cars/CreateCar";
import { useSelector } from "react-redux";
import EditCar from "./components/cars/EditCar";
import PublicCarView from "./components/cars/PublicCarView";
import PublicCarDetail from "./components/cars/PublicCarDetail";
import ShowcasePage from "./pages/ShowcasePage/ShowcasePage";

// Create a separate component for the routes
const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <Navbar />
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cars/create" element={<CreateCar />} />
        <Route path="/cars/edit/:id" element={<EditCar />} />
        <Route path="/public/cars" element={<PublicCarView />} />
        <Route path="/public/cars/:publicUrl" element={<PublicCarDetail />} />
        <Route path="/cars/:publicUrl" element={<PublicCarView />} />
        <Route path="/showcase/:name" element={<ShowcasePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// Main App component
const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
