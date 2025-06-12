import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../supabase/client";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil semua item + 2 harga terakhir (order by date DESC)
  const fetchItems = async () => {
    setLoading(true);

    const { data: itemsData, error: itemError } = await supabase
      .from("items")
      .select("id, name, image_url");

    if (itemError) {
      console.error("Item fetch error", itemError);
      setLoading(false);
      return;
    }

    const itemsWithPrices = await Promise.all(
      itemsData.map(async (item) => {
        const { data: priceData, error: priceError } = await supabase
          .from("prices")
          .select("buy_price, sell_price, date")
          .eq("item_id", item.id)
          .order("date", { ascending: false })
          .limit(2);

        if (priceError) {
          console.error("Price fetch error", priceError);
          return { ...item, prices: [] };
        }

        return {
          ...item,
          prices: priceData,
        };
      })
    );

    setItems(itemsWithPrices);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getPriceChange = (prices) => {
    if (prices.length < 2) return null;
    const curr = prices[0].sell_price;
    const prev = prices[1].sell_price;
    const change = ((curr - prev) / prev) * 100;
    return {
      value: change.toFixed(2),
      isUp: curr >= prev,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Harga Item Terpopuler</h2>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const change = getPriceChange(item.prices);
              const currPrice = item.prices[0]?.sell_price ?? "-";
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow flex items-center space-x-4"
                >
                  <img
                    src={item.image_url || "https://via.placeholder.com/50"}
                    alt={item.name}
                    className="w-12 h-12"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      Harga: {currPrice} WL
                    </p>
                  </div>
                  {change && (
                    <span
                      className={`text-sm font-bold ${
                        change.isUp ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {change.isUp ? "▲" : "▼"} {Math.abs(change.value)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
