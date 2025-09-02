import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function PaymentMethod() {
  const [method, setMethod] = useState<"qrcode" | "cash" | null>(null);
  const navigate = useNavigate();

  const confirmPayment = () => {
    if (method === null) {
      alert("กรุณาเลือกช่องทางการชำระเงินก่อน");
      return;
    }
    alert(`คุณเลือกช่องทางการชำระเงินเป็น ${method}`);
    navigate("/payment-success");
  };

  return (
    <div className="min-h-screen flex flex-col">
          {/* Header */}
          <Header />
    
          <div className="flex flex-1 ">
            {/* Sidebar */}
            <Sidebar />
    
            {/* Main Content */}
  <main className="flex-1 p-4 bg-black">
        
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-[820px]">
        
        {/* หัวข้อ */}
        <div>เลือกช่องทางการชำระเงิน</div>

        {/* ตัวเลือกช่องทาง */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          
          {/* QR Code */}
          <div
            className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition 
              ${method === "qrcode" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-blue-300"}`}
            onClick={() => setMethod("qrcode")}
          >
            {/* วงกลมเลือก */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4
                ${method === "qrcode" ? "border-blue-500" : "border-gray-400"}`}
            >
              {method === "qrcode" && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
              )}
            </div>

            {/* เนื้อหา */}
            <div className="text-center flex-1">
              <img
                src="https://via.placeholder.com/150x150.png?text=QR+Code"
                alt="QR Code"
                className="mx-auto mb-4"
              />
            </div>
          </div>

          {/* เงินสด */}
          <div
            className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition 
              ${method === "cash" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-blue-300"}`}
            onClick={() => setMethod("cash")}
          >
            {/* วงกลมเลือก */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4
                ${method === "cash" ? "border-blue-500" : "border-gray-400"}`}
            >
              {method === "cash" && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
              )}
            </div>

            {/* เนื้อหา */}
            <div className="text-center flex-1">
              <img
                src="https://via.placeholder.com/150x150.png?text=Cash"
                alt="Cash"
                className="mx-auto mb-4"
              />
            </div>
          </div>
        </div>

        {/* ปุ่มยืนยัน */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={confirmPayment}
            className=" btn btn-success shadow-md transition w-full"
          >
            ยืนยันการชำระเงิน
          </button>
        </div>
  
    </div>
  </div>
  </main>
  </div>
  </div>
  );
  }
