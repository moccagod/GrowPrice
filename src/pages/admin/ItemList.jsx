import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image_url: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / pageSize);

  const fetchItems = async (page = currentPage) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const [{ data, error }, { count }] = await Promise.all([
      supabase
        .from("items")
        .select("*")
        .range(from, to)
        .order("created_at", { ascending: false }),
      supabase.from("items").select("id", { count: "exact", head: true }),
    ]);

    if (!error) {
      setItems(data);
      setTotalItems(count);
    }
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData(
      item || {
        name: "",
        type: "",
        image_url: "",
        description: "",
      }
    );
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingItem(null);
    setFormData({ name: "", type: "", image_url: "", description: "" });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase
        .from("items")
        .update(formData)
        .eq("id", editingItem.id);
      if (!error) {
        setMessage("✅ Item berhasil diperbarui.");
        fetchItems(currentPage);
        closeForm();
      } else {
        setMessage(`❌ Gagal update: ${error.message}`);
      }
    } else {
      const { error } = await supabase.from("items").insert([formData]);
      if (!error) {
        setMessage("✅ Item berhasil ditambahkan.");
        fetchItems(currentPage);
        closeForm();
      } else {
        setMessage(`❌ Gagal tambah: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus item ini?")) return;
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (!error) {
      fetchItems(currentPage);
    } else {
      alert("Gagal menghapus item.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Item Growtopia</h1>
        <button
          onClick={() => openForm()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Item
        </button>
      </div>

      {formVisible && (
        <div className="bg-white p-6 rounded shadow max-w-xl mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingItem ? "Edit Item" : "Tambah Item"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nama Item</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Jenis</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Pilih Jenis</option>
                <option value="block">Block</option>
                <option value="seed">Seed</option>
                <option value="clothing">Clothing</option>
                <option value="consumable">Consumable</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Gambar URL</label>
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Deskripsi</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingItem ? "Update" : "Tambah"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-gray-600 hover:underline"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{item.type}</p>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-32 object-contain bg-gray-100 mb-2"
              />
            )}
            <p className="text-sm mb-3">{item.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => openForm(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kontrol Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-gray-200 text-sm disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-200 text-sm disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemList;
