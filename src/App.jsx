import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

// Admin Pages
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ItemList = lazy(() => import("./pages/admin/ItemList"));
const ItemInputList = lazy(() => import("./pages/admin/ItemInputList"));
const PriceInputForm = lazy(() => import("./pages/admin/PriceInputForm"));
const ItemHistoryList = lazy(() => import("./pages/admin/ItemHistoryList"));
const PriceHistory = lazy(() => import("./pages/admin/PriceHistory"));

// User Pages
const Home = lazy(() => import("./pages/Home"));
const ItemPriceHistory = lazy(() => import("./pages/users/ItemPriceHistory"));
const Tentang = lazy(() => import("./pages/users/Tentang"));
const Riwayat = lazy(() => import("./pages/users/Riwayat"));

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <Routes>
          {/* Public User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/riwayat/:itemId" element={<ItemPriceHistory />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/riwayat" element={<Riwayat />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="items" element={<ItemList />} />
            <Route path="input-harga" element={<ItemInputList />} />
            <Route path="input-harga/:itemId" element={<PriceInputForm />} />
            <Route path="riwayat-harga" element={<ItemHistoryList />} />
            <Route path="riwayat-harga/:itemId" element={<PriceHistory />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
