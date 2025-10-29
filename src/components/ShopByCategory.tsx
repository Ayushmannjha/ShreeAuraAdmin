import { useEffect, useState } from "react";
import { getAllShopByCategory, saveShopByCategory, updateShopByCategory, deleteShopByCategory } from "../services/api";
import { X, Plus, Pencil, Trash } from "lucide-react";

export default function ShopByCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all categories on load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllShopByCategory();
      setCategories(res);
    } catch (err) {
      console.error("Failed to fetch ShopByCategory:", err);
    }
  };

  // ✅ Save new or update existing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a name");

    setLoading(true);
    try {
      if (editId) {
        await updateShopByCategory(editId, name, file || undefined);
      } else {
        if (!file) return alert("Please select an image");
        await saveShopByCategory(file, name);
      }
      setName("");
      setFile(null);
      setEditId(null);
      setIsFormOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete category
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteShopByCategory(id);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  // ✅ Edit category
  const handleEdit = (category: any) => {
    setEditId(category.id);
    setName(category.name);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Shop By Category</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* ✅ Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              {editId ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter category name"
                className="w-full border p-2 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border p-2 rounded"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : editId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white shadow rounded-lg overflow-hidden border hover:shadow-md transition"
          >
            <img
              src={cat.imageUrl || cat.image}
              alt={cat.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 flex justify-between items-center">
              <span className="font-medium text-gray-800">{cat.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No categories found.</p>
      )}
    </div>
  );
}
