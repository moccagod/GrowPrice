import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ITEMS_PER_PAGE = 10;

const PriceHistory = () => {
  const { itemId } = useParams();
  const [itemName, setItemName] = useState("");
  const [history, setHistory] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dayRange, setDayRange] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchItemName = async () => {
      const { data } = await supabase
        .from("items")
        .select("name")
        .eq("id", itemId)
        .single();
      if (data) setItemName(data.name);
    };

    const fetchHistory = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("prices")
        .select("buy_price, sell_price, recorded_at")
        .eq("item_id", itemId)
        .order("recorded_at", { ascending: true });

      if (data) {
        setHistory(data);
        setFilteredChartData(data);
      }
      setLoading(false);
    };

    fetchItemName();
    fetchHistory();
  }, [itemId]);

  useEffect(() => {
    if (history.length > 0 && dayRange > 0) {
      const recent = history.slice(-dayRange);
      setFilteredChartData(recent);
    }
  }, [dayRange, history]);

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const paginatedData = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allPrices = filteredChartData.flatMap((row) => [
    row.buy_price,
    row.sell_price,
  ]);
  const yMin = Math.min(...allPrices) - 10;
  const yMax = Math.max(...allPrices) + 10;

  const chartData = {
    labels: filteredChartData.map((row) => row.recorded_at),
    datasets: [
      {
        label: "Harga Beli",
        data: filteredChartData.map((row) => row.buy_price),
        borderColor: "#0ea5e9",
        backgroundColor: "#0ea5e933",
        tension: 0.2,
      },
      {
        label: "Harga Jual",
        data: filteredChartData.map((row) => row.sell_price),
        borderColor: "#f43f5e",
        backgroundColor: "#f43f5e33",
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
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
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">
        Riwayat Harga: {itemName || "..."}
      </h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <label className="text-sm font-medium">Rentang Hari Grafik:</label>
        <select
          value={dayRange}
          onChange={(e) => setDayRange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={7}>7 Hari Terakhir</option>
          <option value={14}>14 Hari Terakhir</option>
          <option value={30}>30 Hari Terakhir</option>
          <option value={history.length}>Semua</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Grafik Harga</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto p-4">
        <h2 className="text-lg font-semibold mb-4">Tabel Riwayat Harga</h2>
        {paginatedData.length > 0 ? (
          <>
            <table className="w-full table-auto border-collapse text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Tanggal</th>
                  <th className="border px-4 py-2 text-left">Harga Beli</th>
                  <th className="border px-4 py-2 text-left">Harga Jual</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{row.recorded_at}</td>
                    <td className="border px-4 py-2">{row.buy_price}</td>
                    <td className="border px-4 py-2">{row.sell_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
    </div>
  );
};

export default PriceHistory;
