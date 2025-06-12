import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin-login");
      } else {
        setChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (checking) return <p className="p-6">Checking auth...</p>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar tetap */}
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <AdminSidebar />
      </div>

      {/* Konten utama bisa discroll */}
      <div className="ml-64 flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
