import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const PrivateRoute = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    getProfile()
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Loading...</p>; // Показва "Loading..." докато се зареди

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
