const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300 mt-24 text-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Deskripsi Singkat */}
        <div>
          <h3 className="font-bold text-black mb-2">GrowPrice</h3>
          <p>
            Website pelacak harga jual & beli item Growtopia dari komunitas.
            Pantau tren dan perubahan harga terbaru dengan grafik dan histori.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h4 className="font-semibold text-black mb-2">Halaman</h4>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:underline">
                Beranda
              </a>
            </li>
            <li>
              <a href="/riwayat" className="hover:underline">
                Riwayat Harga
              </a>
            </li>
            <li>
              <a href="/tentang" className="hover:underline">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="/admin" className="hover:underline">
                Admin
              </a>
            </li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h4 className="font-semibold text-black mb-2">Sosial Media</h4>
          <ul className="space-y-1">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} GrowPrice. Dibuat oleh MoccaGod
      </div>
    </footer>
  );
};

export default Footer;
