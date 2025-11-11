import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSellerPaymentData,
  sendPaymentOtp,
  verifyPaymentOtp,
  payToSeller,
} from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Wallet, Mail, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface PaymentData {
  sellerName: string;
  sellerEmail: string;
  totalEarnings: number;
  pendingAmount: number;
  lastPaymentDate?: string;
  transactionHistory?: {
    date: string;
    amount: number;
    type: string;
    status: string;
  }[];
}

export default function SellerPaymentPage() {
  const { sellerId } = useParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!sellerId) return;
      try {
        const data = await getSellerPaymentData(sellerId);
        setPaymentData(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load payment data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sellerId]);

  const handleSendOtp = async () => {
    if (!paymentData || !sellerId) return;
    try {
      setOtpSent(true);
      await sendPaymentOtp(sellerId, paymentData.pendingAmount);
      toast.success("OTP sent to seller’s email");
    } catch (err: any) {
      setOtpSent(false);
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!paymentData) return;
    try {
      setVerifying(true);
      await verifyPaymentOtp(paymentData.sellerEmail, otp);
      setVerified(true);
      toast.success("OTP verified successfully!");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handlePayToSeller = async () => {
    if (!paymentData || !sellerId) return;
    try {
      await payToSeller(sellerId, paymentData.pendingAmount);
      toast.success("Payment sent successfully!");
      setVerified(false);
      setOtpSent(false);
      setOtp("");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        No payment data found for this seller.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-4 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" /> Seller Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div><strong>Seller Name:</strong> {paymentData.sellerName}</div>
          <div><strong>Email:</strong> {paymentData.sellerEmail}</div>
          <div><strong>Total Earnings:</strong> ₹{paymentData.totalEarnings}</div>
          <div><strong>Pending Amount:</strong> ₹{paymentData.pendingAmount}</div>
          <div>
            <strong>Last Payment:</strong>{" "}
            {paymentData.lastPaymentDate
              ? new Date(paymentData.lastPaymentDate).toLocaleDateString()
              : "N/A"}
          </div>

          <div className="pt-4 flex gap-2 flex-wrap">
            {!otpSent && (
              <Button onClick={handleSendOtp}>Send OTP to Seller</Button>
            )}

            {otpSent && !verified && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-32"
                />
                <Button
                  onClick={handleVerifyOtp}
                  disabled={verifying}
                  variant="secondary"
                >
                  {verifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
            )}

            {verified && (
              <Button onClick={handlePayToSeller} variant="default">
                Pay ₹{paymentData.pendingAmount} to Seller
              </Button>
            )}
          </div>

          {otpSent && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {verified ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {verified ? "OTP Verified" : "OTP sent to seller's email"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 💳 Transaction History */}
      {paymentData.transactionHistory?.length ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentData.transactionHistory.map((tx, i) => (
                    <tr key={i} className="border-b hover:bg-muted/30 transition">
                      <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="p-2">₹{tx.amount}</td>
                      <td className="p-2">{tx.type}</td>
                      <td className="p-2 flex items-center gap-1">
                        {tx.status === "SUCCESS" ? (
                          <CheckCircle2 className="text-green-500 h-4 w-4" />
                        ) : (
                          <XCircle className="text-red-500 h-4 w-4" />
                        )}
                        {tx.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          No transactions yet.
        </p>
      )}
    </div>
  );
}
