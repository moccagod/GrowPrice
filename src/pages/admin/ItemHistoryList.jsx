import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const ItemHistoryList = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from("items")
        .select("id, name, image_url");
      if (data) setItems(data);
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset ke halaman 1 saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Riwayat Harga Item</h1>
      <p className="mb-4 text-sm text-gray-600">
        Klik salah satu item untuk melihat grafik dan riwayat harganya.
      </p>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <Link
            key={item.id}
            to={`/admin/riwayat-harga/${item.id}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-40 object-contain bg-gray-50 p-2"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-sm text-blue-600 hover:underline mt-2">
                Lihat Riwayat Harga →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">Item tidak ditemukan.</p>
      )}

      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex + 1} -{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} dari{" "}
            {filteredItems.length} item
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${
                currentPage === 1
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemHistoryList;
