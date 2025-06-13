import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const HeroSection = () => {
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-black leading-tight mb-6 h-[120px]">
          <Typewriter
            words={["Pantau Harga Item Growtopia seperti pasar saham."]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={50}
            deleteSpeed={0}
            delaySpeed={1000}
          />
        </h1>

        <p className="text-gray-700 text-base md:text-lg mb-8">
          GrowPrice membantu kamu melihat tren harga item secara real-time
          lengkap dengan grafik dan histori harga. Jadilah lebih cerdas dalam
          jual beli item!
        </p>

        <Link
          to="/riwayat"
          className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-900 transition"
        >
          Lihat Harga Sekarang
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
