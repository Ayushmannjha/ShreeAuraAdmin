import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSellerPaymentData,
  sendPaymentOtp,
  verifyPaymentOtp,
  payToSeller,
  receiveFromSeller,
} from "../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface PaymentResponse {
  id: number;
  seller: Seller;
  amountPayableToSeller: number;
  amountReceivableFromSeller: number;
}

export default function SellerPaymentPage() {
  const { sellerId } = useParams();
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpError, setOtpError] = useState<string>("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [payAmount, setPayAmount] = useState<number>(0);
  const [receiveAmount, setReceiveAmount] = useState<number>(0);

  if (!sellerId) return;
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSellerPaymentData(sellerId);
      setPaymentData(data);
      setPayAmount(data.amountPayableToSeller);
      setReceiveAmount(data.amountReceivableFromSeller);
    } catch (err: any) {
      toast.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sellerId]);

  const handleSendOtp = async () => {
    if (!sellerId) return;
    try {
      setProcessing(true);
      await sendPaymentOtp(sellerId, payAmount);
      setOtpSent(true);
      toast.success("OTP sent to seller’s email");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setProcessing(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!paymentData) return;
    try {
      setVerifying(true);
      setOtpError("");
      await verifyPaymentOtp(paymentData.seller.email, otp);
      setVerified(true);
      fetchData();
    } catch {
      setOtpError("Invalid or expired OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handlePayToSeller = async () => {
    if (!sellerId || payAmount <= 0) return toast.error("Enter valid amount");
    try {
      setProcessing(true);
      await payToSeller(sellerId, payAmount);
      toast.success(`Paid ₹${payAmount.toFixed(2)} to seller`);
      resetOtpState();
      fetchData();
    } catch {
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleReceiveFromSeller = async () => {
    if (!sellerId || receiveAmount <= 0)
      return toast.error("Enter valid amount");
    try {
      setProcessing(true);
      await receiveFromSeller(sellerId, receiveAmount);
      toast.success(`Received ₹${receiveAmount.toFixed(2)} from seller`);
      fetchData();
    } catch {
      toast.error("Failed to receive payment");
    } finally {
      setProcessing(false);
    }
  };

  const resetOtpState = () => {
    setOtp("");
    setOtpSent(false);
    setVerified(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No payment data available.
      </div>
    );
  }

  const { seller, amountPayableToSeller, amountReceivableFromSeller } =
    paymentData;

  return (
    <div className="relative max-w-md mx-auto p-6 space-y-4">
      {/* 🔄 Full-page overlay loader */}
      {(processing || verifying) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        </div>
      )}

      {/* Seller Info Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Seller Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-gray-500">Seller Name: </span>
            {seller.name}
          </p>
          <p>
            <span className="text-gray-500">Seller Email: </span>
            {seller.email}
          </p>
          <p>
            <span className="text-gray-500">Total Payable: </span>₹
            {amountPayableToSeller.toFixed(2)}
          </p>
          <p>
            <span className="text-gray-500">Total Receivable: </span>₹
            {amountReceivableFromSeller.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Payment Actions */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Payment Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Pay to Seller */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Pay to Seller</label>
            <Input
              type="number"
              min={1}
              max={amountPayableToSeller}
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />

            {!otpSent && (
              <Button
                onClick={handleSendOtp}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700"
              >
                Send OTP
              </Button>
            )}

            {otpSent && !verified && (
              <div className="flex flex-col mt-2 gap-2">
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  onClick={handleVerifyOtp}
                  disabled={verifying}
                  variant="secondary"
                >
                  {verifying ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            )}

            {verified && (
              <Button
                onClick={handlePayToSeller}
                disabled={processing}
                className="w-full mt-2 bg-green-600 hover:bg-green-700"
              >
                {processing ? (
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                ) : null}
                Pay ₹{payAmount.toFixed(2)}
              </Button>
            )}

            {otpSent && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                {verified ? (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                ) : (
                  <Mail className="h-3 w-3 text-indigo-500" />
                )}
                {verified ? "OTP Verified" : "OTP sent to seller’s email"}
              </p>
            )}

            {otpError && (
              <p className="text-red-500 text-xs mt-1">{otpError}</p>
            )}
          </div>

          {/* Receive from Seller */}
          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-1">
              Receive from Seller
            </label>
            <Input
              type="number"
              min={1}
              max={amountReceivableFromSeller}
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
            <Button
              onClick={handleReceiveFromSeller}
              disabled={processing}
              className="w-full mt-2 bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              ) : null}
              Receive ₹{receiveAmount.toFixed(2)}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
