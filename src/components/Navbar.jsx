// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
    <h1 className="text-xl font-bold">GrowStock</h1>
    <Link
      to="/admin-login"
      className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
    >
      Login Admin
    </Link>
  </nav>
);

export default Navbar;
