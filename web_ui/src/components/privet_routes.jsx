import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PrivetRoutes = ({ children, link }) => {
  let token = localStorage.getItem("token")
  if (token === "null" || token === null) {
    localStorage.setItem("logged", false);
    window.location.href = '/login';
  }
  else{
    return children;
  }

  
};
export default PrivetRoutes;