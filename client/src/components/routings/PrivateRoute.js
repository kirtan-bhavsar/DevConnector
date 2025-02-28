import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Route, useNavigate } from "react-router-dom";
import Spinner from "../../spinner/Spinner";
import Login from "../auth/Login.js";
// import { Route } from "react-router-dom  ";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  if (loading) return <Spinner />;
  if (!isAuthenticated) return navigate("/login");

  return <Outlet />;
};

export default PrivateRoute;
