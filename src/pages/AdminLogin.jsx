import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("❌ " + error.message);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      {isMobile ? (
        <div className="text-center max-w-sm p-6 border border-red-400 bg-red-50 text-red-700 rounded shadow">
          <h2 className="text-xl font-bold mb-2">⚠️ Akses Terbatas</h2>
          <p className="text-sm">
            Halaman login admin hanya bisa diakses melalui{" "}
            <strong>perangkat desktop</strong>. Silakan gunakan komputer atau
            laptop untuk melanjutkan.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm underline text-black hover:text-gray-700"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-md border border-black rounded-xl px-8 py-10 shadow-sm">
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            Admin Login
          </h2>

          {errorMsg && (
            <div className="bg-red-50 border border-red-400 text-red-700 text-sm px-4 py-2 rounded mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-sm text-black">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black bg-white"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-black bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-medium py-2 rounded hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-black underline hover:text-gray-700"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
