// src/components/TerbaruSection.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { ArrowDown, ArrowUp } from "lucide-react";

const TerbaruSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestUpdatedItems = async () => {
    setLoading(true);

    // Ambil semua item
    const { data: items, error: itemError } = await supabase
      .from("items")
      .select("id, name, image_url");

    if (itemError || !items) {
      setLoading(false);
      return;
    }

    // Ambil harga terbaru tiap item
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const { data: pricesData } = await supabase
          .from("prices")
          .select("sell_price, recorded_at")
          .eq("item_id", item.id)
          .order("recorded_at", { ascending: false })
          .limit(10); // ambil 10 harga terbaru per item

        const sell_prices =
          pricesData?.map((p) => p.sell_price).reverse() || [];
        const last_updated = pricesData?.[0]?.recorded_at || null;

        return {
          ...item,
          sell_prices,
          last_updated,
        };
      })
    );

    // Filter hanya item yang punya data, lalu ambil 3 yang terbaru
    const latestItems = enrichedItems
      .filter((item) => item.last_updated)
      .sort(
        (a, b) =>
          new Date(b.last_updated).getTime() -
          new Date(a.last_updated).getTime()
      )
      .slice(0, 3);

    setItems(latestItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchLatestUpdatedItems();
  }, []);

  return (
    <section className="mt-24 px-4">
      <h2 className="text-center text-4xl font-bold mb-6 text-black">
        Harga Terbaru
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => {
            const prices = item.sell_prices;
            const latest = prices[prices.length - 1];
            const prev = prices[prices.length - 2];
            const isUp =
              latest !== undefined && prev !== undefined && latest > prev;

            return (
              <Link
                to={`/riwayat/${item.id}`}
                key={item.id}
                className="border border-black rounded-lg bg-white p-4 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-black text-left">
                    {item.name}
                  </h3>
                  <div
                    className={`flex items-center gap-1 font-bold ${
                      isUp ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {latest ?? "-"}
                  </div>
                </div>

                {prices.length > 0 ? (
                  <Sparklines data={prices} width={100} height={40} margin={4}>
                    <SparklinesLine
                      style={{
                        stroke: isUp ? "#16a34a" : "#dc2626",
                        fill: isUp ? "#dcfce7" : "#fee2e2",
                        fillOpacity: 0.5,
                        strokeWidth: 2,
                      }}
                    />
                    <SparklinesSpots size={2} />
                  </Sparklines>
                ) : (
                  <div className="text-gray-400 text-xs h-10 flex items-center justify-center">
                    Belum ada grafik
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2">
                  Prev: {prev ?? "-"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TerbaruSection;
