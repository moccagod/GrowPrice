// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("id, name, type, image_url")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">
          📈 Harga Item Growtopia Terbaru
        </h2>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <Link
                to={`/riwayat/${item.id}`}
                key={item.id}
                className="bg-white border rounded shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center"
              >
                <img
                  src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
