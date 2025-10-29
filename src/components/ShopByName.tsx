import { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle, Loader2, X } from "lucide-react";
import {
  getAllShopByNames,
  saveShopByName,
  updateShopByName,
  deleteShopByName,
} from "../services/api";

interface ShopByName {
  id: number;
  name: string;
  image: string;
}

export default function ShopByNamePage() {
  const [items, setItems] = useState<ShopByName[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // ✅ Fetch all shop-by-name items
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getAllShopByNames();
      if (Array.isArray(data)) setItems(data);
      else throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Failed to fetch ShopByName list");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle file select (for new)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // ✅ Add new item
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) {
      alert("Please select an image and enter a name");
      return;
    }

    try {
      setActionLoading(-1);
      await saveShopByName(file, name);
      setName("");
      setFile(null);
      await fetchItems();
    } catch (error) {
      console.error("Error saving ShopByName:", error);
      alert("Failed to add new item");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Handle edit start
  const handleEdit = (item: ShopByName) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditFile(null);
  };

  // ✅ Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditFile(null);
  };

  // ✅ Save edit (supports optional image update)
  const handleSaveEdit = async () => {
    if (!editName.trim()) return alert("Enter a name before saving");
    if (editingId == null) return;

    try {
      setActionLoading(editingId);
      await updateShopByName(editingId, editFile, editName);
      setEditingId(null);
      setEditName("");
      setEditFile(null);
      await fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Delete item
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      setActionLoading(id);
      await deleteShopByName(id);
      await fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
        Manage Shop By Name
      </h2>

      {/* ✅ Add Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={actionLoading !== null}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {actionLoading === -1 ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <PlusCircle className="w-5 h-5" /> Add
            </>
          )}
        </button>
      </form>

      {/* ✅ List Display */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between border p-3 rounded-lg gap-3"
            >
              {editingId === item.id ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border px-3 py-1 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="flex-1 border px-3 py-1 rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={actionLoading === item.id}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      {actionLoading === item.id ? (
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
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={actionLoading === item.id}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                    >
                      {actionLoading === item.id ? (
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
        <p className="text-gray-500 text-center mt-4">No items added yet.</p>
      )}
    </div>
  );
}
