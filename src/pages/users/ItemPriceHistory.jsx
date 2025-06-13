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
      <div className="container mx-auto px-4 py-8 pt-20 mt-10">
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              {item?.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-contain border rounded bg-white"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{item.name}</h1>
                <p className="text-gray-500">{item.type}</p>
              </div>
            </div>

            {/* Grafik Harga */}
            <div className="bg-white p-4 rounded shadow mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Grafik Riwayat Harga</h2>
                <select
                  value={rangeDays}
                  onChange={(e) => setRangeDays(Number(e.target.value))}
                  className="text-sm px-2 py-1 border rounded"
                >
                  <option value={7}>7 data terakhir</option>
                  <option value={14}>14 data terakhir</option>
                  <option value={30}>30 data terakhir</option>
                  <option value={prices.length}>Semua</option>
                </select>
              </div>

              {filteredPrices.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <p className="text-sm text-gray-400">Belum ada data harga.</p>
              )}
            </div>

            {/* Tabel Riwayat Harga */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Riwayat Harga</h2>
              {paginatedData.length > 0 ? (
                <>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Tanggal</th>
                        <th>Harga Beli</th>
                        <th>Harga Jual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((p, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">
                            {new Date(p.recorded_at).toLocaleDateString(
                              "id-ID"
                            )}
                          </td>
                          <td>{p.buy_price}</td>
                          <td>{p.sell_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
                    >
                      ← Sebelumnya
                    </button>
                    <span className="text-sm text-gray-700">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
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
