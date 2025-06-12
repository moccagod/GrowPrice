import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ItemList from "./pages/admin/ItemList";
import ItemInputList from "./pages/admin/ItemInputList";
import PriceInputForm from "./pages/admin/PriceInputForm";
import ItemHistoryList from "./pages/admin/ItemHistoryList";
import PriceHistory from "./pages/admin/PriceHistory";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="items" element={<ItemList />} />
          <Route path="input-harga" element={<ItemInputList />} />
          <Route path="input-harga/:itemId" element={<PriceInputForm />} />
          <Route path="riwayat-harga" element={<ItemHistoryList />} />
          <Route path="riwayat-harga/:itemId" element={<PriceHistory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
