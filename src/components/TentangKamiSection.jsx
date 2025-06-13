const TentangKamiSection = () => {
  return (
    <section className="mt-24 px-4 max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-black">
        Saran & Feedback
      </h2>

      <form
        action="https://formsubmit.co/youremail@example.com"
        method="POST"
        className="bg-white border border-black rounded-xl p-8 shadow-md"
      >
        {/* Anti-spam */}
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_subject" value="Feedback dari Pengunjung" />
        <input type="hidden" name="_template" value="table" />
        <input
          type="hidden"
          name="_next"
          value="https://yourwebsite.com/terkirim"
        />

        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1 ring-black">
            Nama
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border border-black rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold mb-1 ring-black">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-black rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1 ring-black">
            Pesan / Saran
          </label>
          <textarea
            name="message"
            rows="5"
            required
            className="w-full px-4 py-2 border border-black rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none transition resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-black hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-md transition"
        >
          Kirim
        </button>
      </form>
    </section>
  );
};

export default TentangKamiSection;
