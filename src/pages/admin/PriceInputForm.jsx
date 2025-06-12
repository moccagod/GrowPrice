import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/client";

const PriceInputForm = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [formData, setFormData] = useState({
    buy_price: "",
    sell_price: "",
    recorded_at: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("id, name, image_url")
        .eq("id", itemId)
        .single();

      if (error) {
        console.error("Gagal mengambil item:", error.message);
      } else {
        setItem(data);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("prices")
      .insert([{ item_id: itemId, ...formData }]);

    if (error) {
      setMessage("❌ Gagal input harga: " + error.message);
    } else {
      setMessage("✅ Harga berhasil dicatat!");
      setFormData({
        buy_price: "",
        sell_price: "",
        recorded_at: new Date().toISOString().split("T")[0],
      });
    }

    setLoading(false);
  };

  if (!item)
    return <p className="text-sm text-gray-500">Memuat data item...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Input Harga: {item.name}</h1>

      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-20 h-20 object-contain mb-4 border rounded"
        />
      )}

      {message && <p className="mb-4 text-sm font-medium">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Harga Beli</label>
          <input
            type="number"
            name="buy_price"
            required
            min={0}
            value={formData.buy_price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Harga Jual</label>
          <input
            type="number"
            name="sell_price"
            required
            min={0}
            value={formData.sell_price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tanggal</label>
          <input
            type="date"
            name="recorded_at"
            value={formData.recorded_at}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Menyimpan..." : "Simpan Harga"}
        </button>
      </form>
    </div>
  );
};

export default PriceInputForm;
