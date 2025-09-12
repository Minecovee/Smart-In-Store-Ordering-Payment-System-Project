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

  // กดปุ่มชำระเงิน
  const confirmPayment = () => {
    if (!order || !method) return;
    if (method === "cash") {
      handleCashPayment();
    } else if (method === "qrcode") {
      // สร้าง QR แล้วเปิด popup
      const promptPayId = "0909634366"; // TODO: env
      const totalAmountNumber = parseFloat(order.total_amount);
      const url = `https://promptpay.io/${promptPayId}/${totalAmountNumber.toFixed(
        2
      )}.png`;
      setGeneratedQrCodeUrl(url);
      setShowQrPopup(true);
    }
  };

  useEffect(() => {
    if (order_id) {
      fetchOrder();
    }
  }, [order_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        กำลังโหลด...
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error || "ไม่พบออเดอร์"}
      </div>
    );
  }

  const totalAmountNumber = parseFloat(order.total_amount);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-[820px]">
        <h2 className="text-2xl font-bold text-start mb-6">
          เลือกช่องทางการชำระเงิน
        </h2>

        <p className="text-lg font-semibold mb-6">
          ยอดชำระ: ฿{totalAmountNumber.toFixed(2)}
        </p>

        {/* ตัวเลือกช่องทาง */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* QR Code */}
          <div
            className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition 
              ${
                method === "qrcode"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-300"
              }`}
            onClick={() => setMethod("qrcode")}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4
                ${
                  method === "qrcode"
                    ? "border-green-500"
                    : "border-gray-400"
                }`}
            >
              {method === "qrcode" && (
                <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
              )}
            </div>
            <div className="text-center flex-1">
              <img
                src="https://via.placeholder.com/150x150.png?text=QR+Code"
                alt="QR"
                className="mx-auto mb-4"
              />
              <p className="font-semibold">QR Code (PromptPay)</p>
            </div>
          </div>

          {/* Cash */}
          <div
            className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition 
              ${
                method === "cash"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-300"
              }`}
            onClick={() => setMethod("cash")}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4
                ${
                  method === "cash"
                    ? "border-green-500"
                    : "border-gray-400"
                }`}
            >
              {method === "cash" && (
                <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
              )}
            </div>
            <div className="text-center flex-1">
              <img
                src="https://via.placeholder.com/150x150.png?text=Cash"
                alt="Cash"
                className="mx-auto mb-4"
              />
              <p className="font-semibold">เงินสด</p>
            </div>
          </div>
        </div>

        {/* ปุ่ม */}
        <div className="flex justify-center gap-6">
          <button
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-medium hover:bg-gray-400 transition"
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

      {/* Popup แสดง QR Code */}
      {showQrPopup && generatedQrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center">
            <h3 className="text-xl font-bold mb-4">สแกนเพื่อชำระเงิน</h3>
            <p className="text-gray-600 mb-2">
              Order ID: {order.id} | ยอดเงิน: ฿{totalAmountNumber.toFixed(2)}
            </p>
            <img
              src={generatedQrCodeUrl}
              alt="PromptPay QR"
              className="mx-auto mb-4 max-w-[250px]"
            />
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
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
