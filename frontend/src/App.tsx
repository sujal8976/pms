import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import Signup from "./pages/auth/signup";
import Provider from "./provider";
import Dashboard from "./pages/admin/dashboard";
import PageNotFound from "./pages/not-found";
import ProtectedRoute from "./components/utils/protected-route";
import Home from "./pages/public/home";
import Login from "./pages/auth/login";
import { LoadingSpinner } from "./components/loading/loading-spinner";
import { Spinner } from "./components/loading/animated-Loading";

function App() {
  const isAuthenticated = false;

  return (
    <>
      <Provider>
        <Navbar />
        <Routes>
          {/* public Routes */}
          <Route path="/" element={<Spinner className="h-40 w-40" />} />

          <Route
            path="/"
            element={<ProtectedRoute isAuthenticated={!isAuthenticated} />}
          >
            <Route path="auth/login" element={<Login />} />
            <Route path="auth/signup" element={<Signup />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                redirect="/auth/signup"
              />
            }
          >
            <Route path="" element={<Dashboard />} />
          </Route>

          {/* Not Found Page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;
