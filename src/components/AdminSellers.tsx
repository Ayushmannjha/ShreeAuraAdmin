import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSellers } from "../services/api";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Loader2, Store } from "lucide-react";
import { motion } from "motion/react";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  pincode: number;
}

export default function AdminSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filtered, setFiltered] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSellers() {
      try {
        const data = await getAllSellers();
        setSellers(data);
        setFiltered(data);
      } catch (error) {
        console.error("Failed to fetch sellers", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSellers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(sellers);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        sellers.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.phone.toLowerCase().includes(q)
        )
      );
    }
  }, [search, sellers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Store className="h-6 w-6" /> All Sellers
      </h1>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search sellers by name, email, or phone..."
          className="w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">
        {filtered.map((seller) => (
          <motion.div
            key={seller.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/admin/payments/${seller.id}`)}
            className="cursor-pointer"
          >
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="font-semibold text-base">{seller.name}</div>
                <div>Email: {seller.email}</div>
                <div>Phone: {seller.phone}</div>
                <div>Address: {seller.address}, {seller.city}, {seller.state}</div>
                <div>Pincode: {seller.pincode}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground text-center mt-6">No sellers found.</p>
      )}
    </div>
  );
}
