/* eslint-disable react/prop-types */

import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if user is authenticated (replace with real logic)
  const isAuthenticated = localStorage.getItem("token") !== null;

  // If authenticated, render the children (protected component)
  // Otherwise, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
