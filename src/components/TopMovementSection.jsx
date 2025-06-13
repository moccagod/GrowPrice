import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const TopMovementSection = () => {
  const [topUp, setTopUp] = useState([]);
  const [topDown, setTopDown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovement = async () => {
      const { data: items, error } = await supabase
        .from("items")
        .select("id, name, image_url");

      if (error || !items) {
        console.error("Gagal memuat items:", error?.message);
        setLoading(false);
        return;
      }

      const itemsWithChange = await Promise.all(
        items.map(async (item) => {
          const { data: prices } = await supabase
            .from("prices")
            .select("sell_price")
            .eq("item_id", item.id)
            .order("recorded_at", { ascending: false })
            .limit(2);

          if (prices.length < 2) return null;

          const latest = prices[0].sell_price;
          const previous = prices[1].sell_price;
          const change = latest - previous;
          const percentChange = ((change / previous) * 100).toFixed(2);

          return {
            ...item,
            latest,
            previous,
            change,
            percentChange: parseFloat(percentChange),
          };
        })
      );

      const validItems = itemsWithChange.filter(Boolean);

      const topUpItems = [...validItems]
        .filter((item) => item.percentChange > 0)
        .sort((a, b) => b.percentChange - a.percentChange)
        .slice(0, 5);

      const topDownItems = [...validItems]
        .filter((item) => item.percentChange < 0)
        .sort((a, b) => a.percentChange - b.percentChange)
        .slice(0, 5);

      setTopUp(topUpItems);
      setTopDown(topDownItems);
      setLoading(false);
    };

    fetchMovement();
  }, []);

  const renderItemCard = (item, isUp) => (
    <Link
      to={`/riwayat/${item.id}`}
      key={item.id}
      className={`border border-black rounded-md p-3 flex items-center justify-between hover:shadow-md transition ${
        isUp ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <img src={item.image_url} alt={item.name} className="w-8 h-8" loading="lazy" />
        <span className="font-medium">{item.name}</span>
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-semibold ${
          isUp ? "text-green-600" : "text-red-600"
        }`}
      >
        {isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        {item.percentChange}%
      </div>
    </Link>
  );

  return (
    <section className="mt-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-center text-4xl font-bold mb-4">Pergerakan Harga Signifikan</h2>
      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="mt-5 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">📈 Item Naik Drastis</h3>
            <div className="space-y-2">
              {topUp.length > 0 ? (
                topUp.map((item) => renderItemCard(item, true))
              ) : (
                <p className="text-sm text-gray-500">Tidak ada data.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">
              📉 Item Turun Drastis
            </h3>
            <div className="space-y-2">
              {topDown.length > 0 ? (
                topDown.map((item) => renderItemCard(item, false))
              ) : (
                <p className="text-sm text-gray-500">Tidak ada data.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TopMovementSection;
