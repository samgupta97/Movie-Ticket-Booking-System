import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import HeaderUser from "./HeaderUser";
import NormalHeader from "./NormalHeader";
import TheatreHeader from "./TheatreHeader";

const RoleNav = () => {
  const [role, setRole] = useState(() => getCurrentRole());

  function getCurrentRole() {
    if (sessionStorage.getItem("active-customer")) return "customer";
    if (sessionStorage.getItem("active-admin")) return "admin";
    if (sessionStorage.getItem("active-theatre")) return "theatre";
    return "normal";
  }

  useEffect(() => {
    const updateRole = () => setRole(getCurrentRole());
    window.addEventListener("storage", updateRole);
    return () => window.removeEventListener("storage", updateRole);
  }, []);

  if (role === "customer") return <HeaderUser />;
  if (role === "admin") return <AdminHeader />;
  if (role === "theatre") return <TheatreHeader />;
  return <NormalHeader />;
};

export default RoleNav;
