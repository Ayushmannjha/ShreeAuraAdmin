import { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle, Loader2, X } from "lucide-react";
import {
  getAllProductCategories,
  saveProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "../services/api";

interface Category {
  id: number;
  name: string;
}

export default function AddCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ✅ Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Load all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getAllProductCategories();
      if (Array.isArray(data)) {
        setCategories(data);
        console.log(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Category name cannot be empty");

    try {
      setActionLoading(-1);
      await saveProductCategory(newCategory.trim());
      setNewCategory("");
      await fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Begin editing
  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  // ✅ Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // ✅ Save edited category
  const handleSaveEdit = async () => {
    if (!editName.trim() || editingId === null)
      return alert("Enter a valid category name");

    try {
      setActionLoading(editingId);
      await updateProductCategory(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
      await fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Delete category
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      setActionLoading(id);
      await deleteProductCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
        Manage Product Categories
      </h2>

      {/* ✅ Add Category Form */}
      <form
        onSubmit={handleAddCategory}
        className="flex items-center gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={actionLoading !== null}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {actionLoading === -1 ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          Add
        </button>
      </form>

      {/* ✅ Category List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between border p-3 rounded-lg"
            >
              {editingId === cat.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border px-3 py-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSaveEdit}
                    disabled={actionLoading === cat.id}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {actionLoading === cat.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat.id, cat.name)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={actionLoading === cat.id}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md disabled:opacity-50"
                    >
                      {actionLoading === cat.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No categories added yet.
        </p>
      )}
    </div>
  );
}
