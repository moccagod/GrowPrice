const TentangKamiSection = () => {
  return (
    <section className="mt-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center">
        Tentang Kami & Kontak
      </h2>

      <div className="bg-white border border-black rounded-lg p-6 shadow-sm mb-10">
        <p className="text-gray-700 text-sm leading-relaxed">
          Aplikasi ini dibuat untuk membantu pemain Growtopia memantau
          pergerakan harga item secara real-time dan historis. Dibangun dengan
          teknologi modern seperti React dan Supabase, aplikasi ini bertujuan
          menjadi referensi utama bagi para trader item di Growtopia.
          <br />
          <br />
          <strong>Pembuat:</strong> Seorang developer indie yang juga pemain
          aktif Growtopia.
          <br />
          <strong>Tujuan:</strong> Menyediakan transparansi harga dan edukasi
          pasar item.
        </p>
      </div>

      <form
        action="https://formsubmit.co/youremail@example.com"
        method="POST"
        className="bg-white border border-black rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4">
          💬 Kirim Saran / Feedback
        </h3>

        {/* Anti-spam */}
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_subject" value="Feedback dari Pengunjung" />
        <input type="hidden" name="_template" value="table" />
        <input
          type="hidden"
          name="_next"
          value="https://yourwebsite.com/terkirim"
        />

        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium">Nama</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium">
            Pesan / Saran
          </label>
          <textarea
            name="message"
            required
            rows="4"
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Kirim
        </button>
      </form>
    </section>
  );
};

export default TentangKamiSection;
