import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import SignIn1 from "./views/auth/signin/SignIn1";
import SignUp1 from "./views/auth/signup/SignUp1";
import Dashboard from "./views/dashboard";
import BasicButton from "./views/ui-elements/basic/BasicButton";
import BasicBadges from "./views/ui-elements/basic/BasicBadges";
import BasicBreadcrumb from "./views/ui-elements/basic/BasicBreadcrumb";
import BasicCollapse from "./views/ui-elements/basic/BasicCollapse";
import BasicTabsPills from "./views/ui-elements/basic/BasicTabsPills";
import BasicTypography from "./views/ui-elements/basic/BasicTypography";
import FormsElements from "./views/forms/FormsElements";
import BootstrapTable from "./views/tables/BootstrapTable";
import Nvd3Chart from "./views/charts/nvd3-chart";
import GoogleMaps from "./views/maps/GoogleMaps";
import SamplePage from "./views/extra/SamplePage";
import Students from "views/students/Students";
import Cards from "views/cards/Cards";
import Expenses from "views/expenses/Expenses";
import Staff from "views/staff/Staff";
import Salary from "views/staff/Salary";
function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Function to check if token is expired
function isTokenExpired(token) {
  const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode JWT
  const currentTime = Math.floor(Date.now() / 1000);  // Get current time in seconds
  return decodedToken.exp < currentTime;  // Check if token is expired
}

// Function to remove token from localStorage
function removeTokenIfExpired() {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token'); // Remove token from localStorage
  }
}


  useEffect(() => {
    const validateAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found. Redirecting to login...");
        navigate("/login"); // Redirect to login page
      } else {
        setIsAuthenticated(true);
      }
    };
    removeTokenIfExpired();
    validateAdmin();
  }, [navigate]);

  // Display children only if authenticated, otherwise navigate logic handles redirect
  return isAuthenticated ? children : null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<SignIn1 />} />
        <Route path="/auth/signup-1" element={<SignUp1 />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <AuthWrapper>
              <AdminLayout />
            </AuthWrapper>
          }
        >
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/student" element={<Students />} />
          <Route path="/app/expenses" element={<Expenses />} />
          <Route path="/app/staff" element={<Staff />} />
          <Route path="/app/salary" element={<Salary />} />
          <Route path="/app/card" element={<Cards />} />
          <Route path="/basic/button" element={<BasicButton />} />
          <Route path="/basic/badges" element={<BasicBadges />} />
          <Route path="/basic/breadcrumb-paging" element={<BasicBreadcrumb />} />
          <Route path="/basic/collapse" element={<BasicCollapse />} />
          <Route path="/basic/tabs-pills" element={<BasicTabsPills />} />
          <Route path="/basic/typography" element={<BasicTypography />} />
          <Route path="/forms/form-basic" element={<FormsElements />} />
          <Route path="/tables/bootstrap" element={<BootstrapTable />} />
          <Route path="/charts/nvd3" element={<Nvd3Chart />} />
          <Route path="/maps/google-map" element={<GoogleMaps />} />
          <Route path="/sample-page" element={<SamplePage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
