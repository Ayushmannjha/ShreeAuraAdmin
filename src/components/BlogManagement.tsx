import { useState, useEffect } from "react";
import {
  getAllBlogs,
  saveBlog,
  updateBlog,
  deleteBlog,
} from "../services/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Loader2, PlusCircle, Pencil, Trash2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // 🧩 added for saving/updating/deleting
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.description) {
        alert("Title and description are required!");
        return;
      }
      if (!editBlog && !file) {
        alert("Please upload an image for the blog");
        return;
      }

      setActionLoading(true); // 🧩 start loader

      if (editBlog) {
        await updateBlog(editBlog.id, form.title, form.description, file || undefined);
      } else {
        await saveBlog(file!, form.title, form.description);
      }

      setIsDialogOpen(false);
      setFile(null);
      setForm({ title: "", description: "" });
      setEditBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to save blog:", err);
    } finally {
      setActionLoading(false); // 🧩 stop loader
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      setActionLoading(true); // 🧩 start loader
      await deleteBlog(id);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    } finally {
      setActionLoading(false); // 🧩 stop loader
    }
  };

  const openEditDialog = (blog: any) => {
    setEditBlog(blog);
    setForm({ title: blog.title, description: blog.description });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditBlog(null);
    setForm({ title: "", description: "" });
    setFile(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen relative">
      {/* 🧩 Global overlay loader when performing any action */}
      {actionLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader2 className="animate-spin w-10 h-10 text-purple-600" />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          📰 Blog Management
        </h1>
        <Button
          onClick={openAddDialog}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Add Blog
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No blogs found. Add your first one!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-pink-100 bg-white/70 backdrop-blur-sm">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h2 className="text-lg font-bold text-gray-800">
                      {blog.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {blog.description}
                    </p>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-pink-400 text-pink-600 hover:bg-pink-50"
                        onClick={() => openEditDialog(blog)}
                        disabled={actionLoading}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDelete(blog.id)}
                        disabled={actionLoading}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white/80 backdrop-blur-md shadow-xl border border-pink-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              {editBlog ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="mt-1"
              />
            </div>

          <div className="relative">
  <label className="text-sm font-medium text-gray-700">Description</label>
  <div className="mt-1 max-h-48 overflow-y-auto border rounded-md">
    <Textarea
      name="description"
      rows={6}
      value={form.description}
      onChange={(e) => {
        const words = e.target.value.trim().split(/\s+/).filter(Boolean);
        if (words.length <= 5000) {
          handleChange(e); // your existing handler
        }
      }}
      placeholder="Enter blog content"
      className="border-0 w-full resize-none focus:ring-0"
    />
  </div>

  {/* Word counter */}
  <div className="text-xs text-gray-500 mt-1 text-right">
    {form.description.trim().split(/\s+/).filter(Boolean).length} / 5000 words
  </div>

  {/* Optional: warning message when limit is reached */}
  {form.description.trim().split(/\s+/).filter(Boolean).length >= 5000 && (
    <p className="text-xs text-red-500 mt-1">
      Word limit reached (5000 max)
    </p>
  )}
</div>



            <div>
              <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <Upload className="w-4 h-4 text-pink-600" /> Upload Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
              {file && (
                <p className="text-xs text-gray-500 mt-1 italic">{file.name}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 flex items-center gap-2"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : editBlog ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
