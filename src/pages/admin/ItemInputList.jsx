import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { Link } from "react-router-dom";

const ItemInputList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("id, name, image_url");

      if (error) {
        console.error("Gagal ambil data:", error.message);
      } else {
        setItems(data);
      }
    };
    fetchItems();
  }, []);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Pilih Item untuk Input Harga</h1>

      <input
        type="text"
        placeholder="Cari item..."
        className="w-full border px-3 py-2 mb-4 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Link
            key={item.id}
            to={`/admin/input-harga/${item.id}`}
            className="border rounded hover:shadow transition bg-white p-4 flex flex-col items-center"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-contain mb-2"
              />
            )}
            <span className="text-center font-medium text-blue-600">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemInputList;
