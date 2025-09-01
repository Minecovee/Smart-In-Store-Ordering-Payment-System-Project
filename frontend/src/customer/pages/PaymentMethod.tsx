import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Interface for the fetched order details
interface Order {
  id: number;
  // Change total_amount to string to match the Python backend's response
  total_amount: string;
  payment_status: string;
}

export default function PaymentMethod() {
  const { order_id } = useParams<{ order_id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qr" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [generatedQrCodeUrl, setGeneratedQrCodeUrl] = useState<string | null>(null);

  // Fetches order details from the backend using the order_id from the URL
  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${order_id}`);
      setOrder(response.data);
    } catch (err: any) {
      setError("Failed to fetch order details. Please check the backend connection and order ID.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handles the cash payment process
  const handleCashPayment = async () => {
    if (!order) return;
    try {
      // Sends a request to the backend to update the order's payment status
      await axios.put(`http://localhost:5000/api/orders/${order.id}`, {
        payment_status: "paid"
      });
      setMessage("รับชำระด้วยเงินสดเรียบร้อยแล้ว! พนักงานกำลังดำเนินการ");
      setTimeout(() => navigate("/"), 3000); // Redirect to home after 3 seconds
    } catch (err) {
      setMessage("Failed to confirm cash payment. Please try again.");
    }
  };

  useEffect(() => {
    if (order_id) {
      fetchOrder();
    }
  }, [order_id]);

  // Generate QR Code URL from PromptPay.io when order data is available
  useEffect(() => {
    if (order) {
        // NOTE: In a real application, you should get your PromptPay ID from a secure source.
        const promptPayId = "0909634366"; // Replace with your PromptPay ID (Phone number or National ID)
        const totalAmountNumber = parseFloat(order.total_amount);
        const url = `https://promptpay.io/${promptPayId}/${totalAmountNumber.toFixed(2)}.png`;
        setGeneratedQrCodeUrl(url);
    }
  }, [order]);

  // Loading and error states
  if (loading) {
    return <div className="p-4 text-center text-gray-700">กำลังโหลดรายละเอียดออเดอร์...</div>;
  }
  if (error || !order) {
    return <div className="p-4 text-center text-red-500 font-bold">{error || "ไม่พบออเดอร์"}</div>;
  }
  
  // Parse the total amount string to a number for calculations and formatting
  const totalAmountNumber = parseFloat(order.total_amount);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">Payment</h1>
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">ยอดชำระ: ฿{totalAmountNumber.toFixed(2)}</h2>

        {message && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">ชำระเงินเรียบร้อยแล้ว</h3>
              <p className="text-gray-600 mb-4">{message}</p>
              <button 
                className="btn btn-primary"
                onClick={() => setMessage(null)} // Close the popup
              >
                ปิด
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6">
          <button 
            className={`btn ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPaymentMethod('cash')}
          >
            เงินสด
          </button>
          <button 
            className={`btn ${paymentMethod === 'qr' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPaymentMethod('qr')}
          >
            QR-Code (PromptPay)
          </button>
        </div>

        {paymentMethod === 'cash' && (
          <div className="text-center p-6 bg-gray-50 rounded-md transition-opacity duration-300">
            <h3 className="text-xl font-medium mb-4 text-gray-700">การชำระด้วยเงินสด</h3>
            <p className="text-gray-600 mb-4">โปรดรอพนักงานเพื่อชำระเงิน</p>
            <button 
              className="btn btn-success text-white"
              onClick={handleCashPayment}
            >
              ยืนยันการชำระด้วยเงินสด
            </button>
          </div>
        )}

        {paymentMethod === 'qr' && (
          <div className="text-center p-6 bg-gray-50 rounded-md transition-opacity duration-300">
            <h3 className="text-xl font-medium mb-4 text-gray-700">สแกนเพื่อชำระเงิน</h3>
            <div className="bg-white p-4 rounded-md shadow-inner inline-block">
              {generatedQrCodeUrl && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">QR Code PromptPay สำหรับ Order ID: {order.id}</h3>
                  <p className="text-sm text-gray-600 mb-2">ยอดเงิน: {totalAmountNumber.toFixed(2)} บาท</p>
                  <div className="inline-block p-2 border border-gray-300 rounded-lg bg-white shadow">
                    <img src={generatedQrCodeUrl} alt="PromptPay QR Code" style={{ maxWidth: '250px', height: 'auto' }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    (QR Code นี้ถูกสร้างโดยใช้เบอร์โทรศัพท์จำลอง: 0812345678)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!paymentMethod && (
          <div className="text-center p-6 bg-gray-50 rounded-md">
            <p className="text-gray-600">กรุณาเลือกวิธีการชำระเงิน</p>
          </div>
        )}
      </div>
    </div>
  );
}
