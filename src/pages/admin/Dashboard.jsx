import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalItems: 0,
    totalPrices: 0,
    lastInputDate: "-",
  });
  const [itemTrends, setItemTrends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      const { data: items } = await supabase.from("items").select("id");
      const { data: prices } = await supabase
        .from("prices")
        .select("id, recorded_at")
        .order("recorded_at", { ascending: false });

      setSummary({
        totalItems: items.length,
        totalPrices: prices.length,
        lastInputDate: prices[0]?.recorded_at || "-",
      });
    };

    const fetchTrendingItems = async () => {
      const { data: items, error: itemError } = await supabase
        .from("items")
        .select("id, name")
        .limit(5);

      if (itemError || !items) return;

      const trends = await Promise.all(
        items.map(async (item) => {
          const { data: priceHistory, error } = await supabase
            .from("prices")
            .select("buy_price, recorded_at")
            .eq("item_id", item.id)
            .order("recorded_at", { ascending: false })
            .limit(10);

          if (error || !priceHistory) return null;

          const sortedPrices = [...priceHistory].reverse(); // from oldest to newest
          const prices = sortedPrices.map((p) => p.buy_price);

          const latest = prices[prices.length - 1];
          const previous =
            prices.length > 1 ? prices[prices.length - 2] : latest;

          const trend =
            latest > previous ? "up" : latest < previous ? "down" : "flat";

          return {
            id: item.id,
            name: item.name,
            prices,
            trend,
            latest,
            previous,
          };
        })
      );

      setItemTrends(trends.filter(Boolean)); // remove nulls
    };

    fetchSummary();
    fetchTrendingItems();
  }, []);

  const handleItemClick = (itemId) => {
    navigate(`/admin/riwayat-harga/${itemId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Item</h2>
          <p className="text-2xl font-bold">{summary.totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Harga Diinput</h2>
          <p className="text-2xl font-bold">{summary.totalPrices}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Tanggal Input Terakhir</h2>
          <p className="text-2xl font-bold">{summary.lastInputDate}</p>
        </div>
      </div>

      {/* Tren Harga */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Tren Harga Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemTrends.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="border rounded p-4 flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{item.name}</span>
                <span
                  className={`text-sm font-bold ${
                    item.trend === "up"
                      ? "text-green-600"
                      : item.trend === "down"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.trend === "up"
                    ? "↑"
                    : item.trend === "down"
                    ? "↓"
                    : "→"}{" "}
                  {item.latest}
                </span>
              </div>
              <Sparklines data={item.prices} width={100} height={30}>
                <SparklinesLine
                  color={
                    item.trend === "up"
                      ? "green"
                      : item.trend === "down"
                      ? "red"
                      : "gray"
                  }
                />
              </Sparklines>
              <div className="text-xs text-gray-400 mt-1">
                Prev: {item.previous}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analisis Tambahan */}
      {itemTrends.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {/* Volatilitas */}
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="text-sm font-semibold mb-2 text-gray-600">
              📊 Item Paling Volatil
            </h3>
            {(() => {
              const mostVolatile = [...itemTrends]
                .map((item) => ({
                  ...item,
                  volatility:
                    Math.max(...item.prices) - Math.min(...item.prices),
                }))
                .sort((a, b) => b.volatility - a.volatility)[0];
              return mostVolatile ? (
                <div>
                  <p className="font-medium">{mostVolatile.name}</p>
                  <p className="text-xs text-gray-500">
                    Volatilitas: {mostVolatile.volatility}
                  </p>
                  <Sparklines data={mostVolatile.prices} height={30}>
                    <SparklinesLine color="orange" />
                  </Sparklines>
                </div>
              ) : (
                <p className="text-xs text-gray-400">Data tidak cukup</p>
              );
            })()}
          </div>

          {/* Top Naik */}
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="text-sm font-semibold mb-2 text-gray-600">
              📈 Item Paling Naik
            </h3>
            {(() => {
              const topUp = [...itemTrends]
                .filter((item) => item.latest > item.previous)
                .sort(
                  (a, b) => b.latest - b.previous - (a.latest - a.previous)
                )[0];

              return topUp ? (
                <div>
                  <p className="font-medium">{topUp.name}</p>
                  <p className="text-xs text-gray-500">
                    Kenaikan: +{topUp.latest - topUp.previous}
                  </p>
                  <Sparklines data={topUp.prices} height={30}>
                    <SparklinesLine color="green" />
                  </Sparklines>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  Tidak ada kenaikan saat ini
                </p>
              );
            })()}
          </div>

          {/* Top Turun */}
          <div className="bg-white p-4 rounded shadow border">
            <h3 className="text-sm font-semibold mb-2 text-gray-600">
              📉 Item Paling Turun
            </h3>
            {(() => {
              const topDown = [...itemTrends]
                .filter((item) => item.latest < item.previous)
                .sort(
                  (a, b) => a.latest - a.previous - (b.latest - b.previous)
                )[0];

              return topDown ? (
                <div>
                  <p className="font-medium">{topDown.name}</p>
                  <p className="text-xs text-gray-500">
                    Penurunan: -{topDown.previous - topDown.latest}
                  </p>
                  <Sparklines data={topDown.prices} height={30}>
                    <SparklinesLine color="red" />
                  </Sparklines>
                </div>
              ) : (
                <p className="text-xs text-gray-400">
                  Tidak ada penurunan saat ini
                </p>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
