import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

const links = [
  { name: "Dashboard", path: "/admin" },
  { name: "Data Item", path: "/admin/items" },
  { name: "Input Harga", path: "/admin/input-harga" },
  { name: "Riwayat Harga", path: "/admin/riwayat-harga" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
