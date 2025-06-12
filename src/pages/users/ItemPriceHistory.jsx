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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ItemPriceHistory = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemData = async () => {
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
      setPrices(priceData);
      setLoading(false);
    };

    fetchItemData();
  }, [itemId]);

  const chartData = {
    labels: prices.map((p) => new Date(p.recorded_at).toLocaleDateString()),
    datasets: [
      {
        label: "Harga Beli",
        data: prices.map((p) => p.buy_price),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        label: "Harga Jual",
        data: prices.map((p) => p.sell_price),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              {item.image_url && (
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
              <h2 className="text-lg font-semibold mb-2">
                Grafik Riwayat Harga
              </h2>
              {prices.length > 0 ? (
                <Line data={chartData} />
              ) : (
                <p className="text-sm text-gray-400">Belum ada data harga.</p>
              )}
            </div>

            {/* Tabel Riwayat */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Riwayat Harga</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Tanggal</th>
                    <th>Harga Beli</th>
                    <th>Harga Jual</th>
                  </tr>
                </thead>
                <tbody>
                  {prices
                    .slice()
                    .reverse()
                    .map((p, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">
                          {new Date(p.recorded_at).toLocaleDateString()}
                        </td>
                        <td>{p.buy_price}</td>
                        <td>{p.sell_price}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ItemPriceHistory;
