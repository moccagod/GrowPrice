// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/riwayat", label: "Riwayat Harga" },
    { path: "/tentang", label: "Tentang" },
  ];

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          <Link to="/">GT Market</Link>
        </h1>

        <ul className="flex gap-6 text-sm items-center">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li>
            <Link
              to="/admin-login"
              className="ml-4 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Admin Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
