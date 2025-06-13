import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { Line } from "react-chartjs-2";
import Navbar from "../../components/Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Footer from "../../components/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ITEMS_PER_PAGE = 10;

const ItemPriceHistory = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [rangeDays, setRangeDays] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: itemData } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single();

      const { data: priceData } = await supabase
        .from("prices")
        .select("buy_price, sell_price, recorded_at")
        .eq("item_id", itemId)
        .order("recorded_at", { ascending: true });

      setItem(itemData);
      setPrices(priceData || []);
      setLoading(false);
    };

    fetchData();
  }, [itemId]);

  useEffect(() => {
    if (prices.length > 0 && rangeDays > 0) {
      const recent = prices.slice(-rangeDays);
      setFilteredPrices(recent);
    } else {
      setFilteredPrices(prices);
    }
    setCurrentPage(1); // reset halaman saat filter berubah
  }, [rangeDays, prices]);

  const totalPages = Math.ceil(prices.length / ITEMS_PER_PAGE);
  const paginatedData = prices
    .slice()
    .reverse()
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const allValues = filteredPrices.flatMap((row) => [
    row.buy_price,
    row.sell_price,
  ]);
  const yMin = Math.min(...allValues) - 10;
  const yMax = Math.max(...allValues) + 10;

  const chartData = {
    labels: filteredPrices.map((p) =>
      new Date(p.recorded_at).toLocaleDateString("id-ID")
    ),
    datasets: [
      {
        label: "Harga Beli",
        data: filteredPrices.map((p) => p.buy_price),
        borderColor: "#0ea5e9",
        backgroundColor: "#0ea5e933",
        tension: 0.3,
      },
      {
        label: "Harga Jual",
        data: filteredPrices.map((p) => p.sell_price),
        borderColor: "#f43f5e",
        backgroundColor: "#f43f5e33",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        min: yMin > 0 ? yMin : 0,
        max: yMax,
        ticks: {
          stepSize: Math.ceil((yMax - yMin) / 5),
        },
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10 pt-24">
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : (
          <>
            {/* Header ala e-commerce */}
            {/* Header ala e-commerce - versi akhir */}
            <div className="bg-white border border-black  rounded-2xl shadow-md p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Gambar Besar */}
              <div className="w-full flex justify-center items-center">
                {item?.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full max-w-md h-auto object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-full max-w-md h-60 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              {/* Informasi Item */}
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  {item.name}
                </h1>

                {/* Badge tipe */}
                <span className="inline-block w-fit bg-black text-white text-xs font-medium px-3 py-1 rounded-full uppercase">
                  {item.type || "Tidak diketahui"}
                </span>

                {/* Deskripsi */}
                <div>
                  <h2 className="text-base font-semibold text-gray-700 mb-1">
                    Deskripsi Item
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description || "Belum ada deskripsi untuk item ini."}
                  </p>
                </div>

                {/* Statistik Harga */}
                {prices.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 p-4 border rounded-xl">
                      <p className="text-gray-500 text-xs">
                        Harga Beli Terakhir
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {prices.at(-1)?.buy_price}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 border rounded-xl">
                      <p className="text-gray-500 text-xs">
                        Harga Jual Terakhir
                      </p>
                      <p className="text-xl font-bold text-rose-600">
                        {prices.at(-1)?.sell_price}
                      </p>
                    </div>
                    {prices.length > 1 && (
                      <div className="bg-gray-50 p-4 border rounded-xl col-span-2">
                        <p className="text-gray-500 text-xs">
                          Perubahan Harga Jual
                        </p>
                        <p
                          className={`text-xl font-bold ${
                            prices.at(-1).sell_price > prices.at(-2).sell_price
                              ? "text-green-600"
                              : prices.at(-1).sell_price <
                                prices.at(-2).sell_price
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {prices.at(-1).sell_price - prices.at(-2).sell_price}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Grafik Harga */}
            {/* Grafik Harga */}
            <div className="bg-white border border-black rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-4xl font-bold text-black">
                  Grafik Riwayat Harga
                </h2>
                <select
                  value={rangeDays}
                  onChange={(e) => setRangeDays(Number(e.target.value))}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black bg-white"
                >
                  <option value={7}>7 data terakhir</option>
                  <option value={14}>14 data terakhir</option>
                  <option value={30}>30 data terakhir</option>
                  <option value={prices.length}>Semua</option>
                </select>
              </div>

              {filteredPrices.length > 0 ? (
                <div className="w-full max-w-full md:max-w-4xl md:mx-auto">
                  <Line data={chartData} options={chartOptions} />
                </div>
              ) : (
                <p className="text-sm text-gray-400">Belum ada data harga.</p>
              )}
            </div>

            {/* Tabel Riwayat Harga */}
            <div className="bg-white border border-black rounded-xl shadow-sm p-6">
              <h2 className="text-xl md:text-4xl font-bold text-black mb-4">
                Riwayat Harga
              </h2>
              {paginatedData.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-t border-gray-200">
                      <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                        <tr>
                          <th className="py-3 text-left px-2 font-medium">
                            Tanggal
                          </th>
                          <th className="py-3 text-left px-2 font-medium">
                            Harga Beli
                          </th>
                          <th className="py-3 text-left px-2 font-medium">
                            Harga Jual
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((p, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-2 px-2">
                              {new Date(p.recorded_at).toLocaleDateString(
                                "id-ID"
                              )}
                            </td>
                            <td className="px-2">{p.buy_price}</td>
                            <td className="px-2">{p.sell_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                      ← Sebelumnya
                    </button>
                    <span className="text-sm text-gray-600">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">Belum ada data harga.</p>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ItemPriceHistory;
