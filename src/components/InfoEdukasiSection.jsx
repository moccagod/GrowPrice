import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const edukasiList = [
  {
    title: "Apa itu WL & DL?",
    content:
      "WL (World Lock) dan DL (Diamond Lock) adalah mata uang utama dalam Growtopia. 1 DL = 100 WL. Biasanya digunakan untuk transaksi item antar pemain.",
  },
  {
    title: "Tips Trading",
    content:
      "Beli saat harga murah, jual saat harga tinggi. Pantau grafik dan tren mingguan. Hindari panic buying atau menjual saat harga jatuh.",
  },
  {
    title: "Kenapa Harga Item Bisa Naik/Turun?",
    content:
      "Harga item bisa berubah karena event, update, permintaan tinggi, scam massal, atau perubahan pasokan di komunitas.",
  },
];

const InfoEdukasiSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-16 px-4 max-w-2xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Frequency Asked Questions (FAQ)
      </h2>
      <div className="space-y-4">
        {edukasiList.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-md shadow-sm"
          >
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
              onClick={() => toggle(idx)}
            >
              {item.title}
              {openIndex === idx ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-4 py-3 text-sm text-gray-700 bg-white border-t">
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoEdukasiSection;
