import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

const ITEMS_PER_PAGE = 9;

const RiwayatHarga = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemsWithPrices = async () => {
      setLoading(true);

      const { data: itemData, error } = await supabase
        .from("items")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Gagal memuat item:", error.message);
        setLoading(false);
        return;
      }

      const itemsWithPrices = await Promise.all(
        itemData.map(async (item) => {
          const { data: priceData } = await supabase
            .from("prices")
            .select("sell_price")
            .eq("item_id", item.id)
            .order("recorded_at", { ascending: false })
            .limit(10);

          const prices = priceData?.map((p) => p.sell_price).reverse() || [];
          const latest = prices[prices.length - 1];
          const prev = prices[prices.length - 2];
          const change =
            latest && prev ? (((latest - prev) / prev) * 100).toFixed(2) : null;
          const isUp = latest > prev;

          return {
            ...item,
            prices,
            latestPrice: latest,
            changePercentage: change,
            isUp,
          };
        })
      );

      setItems(itemsWithPrices);
      setFilteredItems(itemsWithPrices);
      setLoading(false);
    };

    fetchItemsWithPrices();
  }, []);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [search, items]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <div className="px-4 mt-24 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          📘 Daftar Item (Riwayat Harga)
        </h1>

        <input
          type="text"
          placeholder="Cari item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full sm:w-1/2 px-4 py-2 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        {loading ? (
          <p className="text-gray-500 text-sm">Memuat data item...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginatedItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/riwayat/${item.id}`}
                  className="border border-black rounded-lg hover:border-gray-600 shadow-sm hover:shadow-md transition p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-8 h-8 object-contain"
                    />
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                  </div>

                  <div
                    className={`text-sm font-medium mb-2 ${
                      item.isUp ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.changePercentage !== null
                      ? `${item.isUp ? "+" : ""}${item.changePercentage}%`
                      : "–"}{" "}
                    |{" "}
                    <span className="text-black">
                      {item.latestPrice !== undefined ? item.latestPrice : "–"}
                    </span>
                  </div>

                  {item.prices.length > 0 ? (
                    <Sparklines data={item.prices} height={40}>
                      <SparklinesLine
                        style={{
                          stroke: item.isUp ? "#16a34a" : "#dc2626",
                          fill: item.isUp ? "#dcfce7" : "#fee2e2",
                          fillOpacity: 0.3,
                          strokeWidth: 2,
                        }}
                      />
                    </Sparklines>
                  ) : (
                    <div className="text-xs text-gray-400 h-10 flex items-center justify-center">
                      Tidak ada grafik
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-100 text-sm disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded text-sm ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-100 text-sm disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RiwayatHarga;
