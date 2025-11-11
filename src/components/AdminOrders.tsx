import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getAllOrders } from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Package, X } from "lucide-react";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  orderId: string;
  address: string;
  status: number;
  price: number;
  paymentMethod?: string;
  user: {
    name: string;
    email: string;
  };
  createdAt?: string;
}

interface SellerOrder {
  id: number;
  seller: Seller;
  order: Order;
  productIds: string[];
  quantity: number[];
}

const STATUS_MAP: Record<
  number,
  { label: string; variant: "secondary" | "outline" | "default" | "destructive" }
> = {
  0: { label: "Pending", variant: "secondary" },
  1: { label: "Processing", variant: "outline" },
  2: { label: "Shipping", variant: "default" },
  3: { label: "Delivered", variant: "default" },
  4: { label: "Canceled", variant: "destructive" },
};


export default function AdminOrders() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getAllOrders();
        setOrders(data);
        setFilteredOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders.filter(
      (o) =>
        o.order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (dateFilter) {
      filtered = filtered.filter((o) =>
        o.order.createdAt?.startsWith(dateFilter)
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, dateFilter, orders]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-medium mt-10">{error}</div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-7 w-7 text-primary" /> All Seller Orders
        </h1>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search by user or seller name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          No matching orders found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredOrders.map((o) => {
              const statusInfo = STATUS_MAP[o.order.status] || {
                label: "Unknown",
                variant: "secondary",
              };
              return (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow duration-200 border rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">
                        Order #{o.order.orderId}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {o.order.createdAt
                          ? new Date(o.order.createdAt).toLocaleString()
                          : "—"}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Customer:</span>{" "}
                        {o.order.user.name}
                      </div>
                      <div>
                        <span className="font-medium">Seller:</span>{" "}
                        {o.seller.name}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span>{" "}
                        {o.order.address}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> ₹
                        {o.order.price}
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <Badge variant={statusInfo.variant as "secondary" | "outline" | "default" | "destructive"}>
  {statusInfo.label}
</Badge>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setSelectedOrder(o)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg rounded-xl bg-white">
          {selectedOrder && (
            <>
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold">
                  Order #{selectedOrder.order.orderId}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </DialogHeader>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="font-medium">Customer:</span>{" "}
                  {selectedOrder.order.user.name} (
                  {selectedOrder.order.user.email})
                </div>
                <div>
                  <span className="font-medium">Seller:</span>{" "}
                  Name:- {selectedOrder.seller.name} (
                  ,Email:- {selectedOrder.seller.email}
                  ,phone:- {selectedOrder.seller.phone})
                </div>
                <div>
                  <span className="font-medium">Address:</span>{" "}
                  {selectedOrder.order.address}
                </div>
                <div>
                  <span className="font-medium">Total Price:</span> ₹
                  {selectedOrder.order.price}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <Badge variant={STATUS_MAP[selectedOrder.order.status]?.variant}>
                    {STATUS_MAP[selectedOrder.order.status]?.label}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Products:</span>{" "}
                  {selectedOrder.productIds.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Quantities:</span>{" "}
                  {selectedOrder.quantity.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Placed On:</span>{" "}
                  {selectedOrder.order.createdAt
                    ? new Date(selectedOrder.order.createdAt).toLocaleString()
                    : "—"}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
