import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import AnimatedSection from "../../components/AnimatedSection";

const Tentang = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 pt-20 space-y-10">
        <AnimatedSection>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-5">
            Tentang Kami
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Apa itu GrowPrice?</h2>
            <p>
              GrowPrice adalah platform komunitas untuk memantau harga item
              dalam game Growtopia, layaknya pasar saham. Kami mencatat harga
              jual dan beli dari berbagai item, lengkap dengan grafik pergerakan
              harian.
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Fitur Utama</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Cek harga jual dan beli item terbaru</li>
              <li>Lihat riwayat harga dalam grafik interaktif</li>
              <li>Filter berdasarkan tanggal atau jenis item</li>
              <li>Admin Login untuk pengelolaan harga</li>
            </ul>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Kenapa Kami Buat Ini?
            </h2>
            <p>
              Sebagai pemain Growtopia, kami merasa sulit melacak pergerakan
              harga item secara akurat. Maka dari itu, GT Market hadir untuk
              menyediakan data harga yang transparan, agar keputusan jual beli
              bisa lebih bijak.
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Tentang Developer</h2>
            <p>
              GrowPrice dikembangkan oleh pemain Growtopia yang peduli pada
              stabilitas ekonomi in-game. Jika kamu punya masukan, hubungi kami
              di{" "}
              <a
                href="mailto:gtmarket@example.com"
                className="text-blue-600 hover:underline"
              >
                growprice@example.com
              </a>
              .
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.5}>
          <section>
            <h2 className="text-xl font-semibold mb-2">Disclaimer</h2>
            <p>
              Website ini tidak terafiliasi dengan Growtopia atau Ubisoft. Semua
              data harga hanya untuk tujuan informasi dan bisa berubah
              sewaktu-waktu.
            </p>
          </section>
        </AnimatedSection>
      </div>
      <Footer />
    </>
  );
};

export default Tentang;
