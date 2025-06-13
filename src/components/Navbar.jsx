import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Pastikan sudah install lucide-react

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/riwayat", label: "Riwayat Harga" },
    { path: "/tentang", label: "Tentang" },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md border z-50
    w-[90%] max-w-5xl
    ${isOpen ? "rounded-md px-4 py-4" : "rounded-full px-6 py-3"}
    md:rounded-full md:px-6 md:py-3`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-7 h-7 object-contain"
          />
          <span className="font-semibold text-sm hidden sm:block">
            GrowPrice
          </span>
        </Link>

        {/* Mobile Burger */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm text-black items-center">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-black font-semibold"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/admin-login"
              className="ml-2 bg-black text-white px-4 py-1.5 rounded-full text-sm hover:bg-gray-900"
            >
              Admin Login
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 md:hidden">
          <ul className="flex flex-col gap-4 text-base text-black">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full py-2 px-2 rounded hover:bg-gray-100 ${
                    location.pathname === item.path ? "font-semibold" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/admin-login"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-black text-white py-2 px-4 rounded-full text-center text-base hover:bg-gray-900"
              >
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
