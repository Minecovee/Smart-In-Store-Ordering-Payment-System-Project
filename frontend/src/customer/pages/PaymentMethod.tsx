import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Order {
  id: number;
  total_amount: string;
  payment_status: string;
}

export default function PaymentPage() {
  const { order_id } = useParams<{ order_id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"qrcode" | "cash" | null>(null);
  const [generatedQrCodeUrl, setGeneratedQrCodeUrl] = useState<string | null>(
    null
  );
  const [showQrPopup, setShowQrPopup] = useState(false);

  // ดึงข้อมูล order
  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/${order_id}`
      );
      setOrder(response.data);
    } catch (err: any) {
      setError("ไม่สามารถดึงข้อมูลออเดอร์ได้");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // อัปเดตเป็น "paid" ถ้าชำระด้วยเงินสด
  const handleCashPayment = async () => {
    if (!order) return;
    try {
      await axios.put(`http://localhost:5000/api/orders/${order.id}`, {
        payment_status: "paid",
      });
      navigate("/payment-success");
    } catch (err) {
      console.error(err);
      alert("ชำระเงินสดไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const confirmPayment = () => {
    if (!order || !method) return;
    if (method === "cash") {
      handleCashPayment();
    } else if (method === "qrcode") {
      const promptPayId = "0909634366"; // TODO: แก้เป็น env
      const totalAmountNumber = parseFloat(order.total_amount);
      const url = `https://promptpay.io/${promptPayId}/${totalAmountNumber.toFixed(
        2
      )}.png`;
      setGeneratedQrCodeUrl(url);
      setShowQrPopup(true);
    }
  };

  useEffect(() => {
    if (order_id) fetchOrder();
  }, [order_id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        กำลังโหลด...
      </div>
    );

  if (error || !order)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg font-semibold">
        {error || "ไม่พบออเดอร์"}
      </div>
    );

  const totalAmountNumber = parseFloat(order.total_amount);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        
      </button>

      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">ชำระเงิน</h2>

        <div className="mb-8 text-center">
          <p className="text-lg font-medium">ยอดชำระทั้งหมด</p>
          <p className="text-3xl font-extrabold text-green-600 mt-2">
            ฿{totalAmountNumber.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* QR Code */}
          <div
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition
              ${method === "qrcode"
                ? "border-green-500 bg-green-50 shadow-md"
                : "border-gray-300 hover:border-green-400 hover:shadow-sm"
              }`}
            onClick={() => setMethod("qrcode")}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4
              ${method === "qrcode" ? "border-green-500" : "border-gray-400"}`}>
              {method === "qrcode" && (
                <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 text-center">
              <img
                src="https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png"
                alt="QR Code"
                className="mx-auto mb-2 w-32 h-32 object-cover"
              />
              <p className="font-semibold">QR Code (PromptPay)</p>
            </div>
          </div>

          {/* Cash */}
          <div
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition
              ${method === "cash"
                ? "border-green-500 bg-green-50 shadow-md"
                : "border-gray-300 hover:border-green-400 hover:shadow-sm"
              }`}
            onClick={() => setMethod("cash")}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4
              ${method === "cash" ? "border-green-500" : "border-gray-400"}`}>
              {method === "cash" && (
                <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 text-center">
              <img
                src="https://static.vecteezy.com/system/resources/previews/040/137/950/non_2x/minimalist-money-logo-design-template-cash-money-for-business-finance-money-investing-logo-vector.jpg"
                alt="Cash"
                className="mx-auto mb-2 w-32 h-32 object-cover"
              />
              <p className="font-semibold">เงินสด</p>
            </div>
          </div>
        </div>

        {/* ปุ่มยืนยัน */}
        <div className="mt-8 flex justify-center gap-6">
          <button
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
            onClick={() => navigate(-1)}
          >
            ยกเลิก
          </button>
          <button
            disabled={!method}
            onClick={confirmPayment}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              method
                ? "bg-green-500 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            ชำระเงิน
          </button>
        </div>
      </div>

      {/* QR Code Popup */}
      {showQrPopup && generatedQrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-xl p-6 w-80 text-center">
            <h3 className="text-xl font-bold mb-4">สแกนเพื่อชำระเงิน</h3>
            <p className="text-gray-600 mb-2">
              Order ID: {order.id} | ยอดเงิน: ฿{totalAmountNumber.toFixed(2)}
            </p>
            <img
              src={generatedQrCodeUrl}
              alt="PromptPay QR"
              className="mx-auto mb-4 w-48 h-48 object-cover"
            />
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-700 transition"
              onClick={() => setShowQrPopup(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
