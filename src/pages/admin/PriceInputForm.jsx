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
  const [errorMsg, setErrorMsg] = useState(false);

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
    setErrorMsg(false);

    const { error } = await supabase
      .from("prices")
      .insert([{ item_id: itemId, ...formData }]);

    if (error) {
      setErrorMsg(true);
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
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Input Harga: {item.name}
        </h1>

        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-24 h-24 object-contain border mb-4 rounded bg-gray-100"
          />
        )}

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded text-sm font-medium ${
              errorMsg
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Harga Beli
            </label>
            <input
              type="number"
              name="buy_price"
              required
              min={0}
              value={formData.buy_price}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Harga Jual
            </label>
            <input
              type="number"
              name="sell_price"
              required
              min={0}
              value={formData.sell_price}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              name="recorded_at"
              value={formData.recorded_at}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Harga"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceInputForm;
