import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/riwayat", label: "Riwayat Harga" },
    { path: "/tentang", label: "Tentang" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-md border rounded-full px-8 py-3 z-50 w-[90%] max-w-5xl">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/">
          <img
            src="/images/logo.png" // Ganti ini dengan path gambarmu
            alt="Logo"
            className="w-7 h-7 object-contain"
          />
        </Link>

        {/* Navigation Menu */}
        <ul className="flex gap-6 text-sm text-black items-center">
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
    </nav>
  );
};

export default Navbar;
