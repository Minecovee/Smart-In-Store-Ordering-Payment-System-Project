'use client';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface OrderItem {
  menu_id: number;
  quantity: number;
  price_at_order: string;
  menu_name: string;
  menu_image: string;
}

interface Order {
  id: number;
  table_number: number;
  total_amount: string;
  status: string;
  payment_status: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<Order | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    logout();
    navigate("/login");
  };

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Failed to fetch orders:", err))
      .finally(() => setLoading(false));
  };

  const updateOrderStatus = (id: number, status: string) => {
    fetch(`http://localhost:5000/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => fetchOrders());
  };

  const handleActionClick = (order: Order, action: string) => {
    setOrderToConfirm(order);
    setActionToConfirm(action);
    setShowConfirmModal(true);
  };
  const handleConfirmAction = () => {
    if (orderToConfirm && actionToConfirm) updateOrderStatus(orderToConfirm.id, actionToConfirm);
    setShowConfirmModal(false); setOrderToConfirm(null); setActionToConfirm(''); handleCloseItemsModal();
  };
  const handleCancelAction = () => { setShowConfirmModal(false); setOrderToConfirm(null); setActionToConfirm(''); };
  const handleViewItems = (order: Order) => setSelectedOrder(order);
  const handleCloseItemsModal = () => setSelectedOrder(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">📦 Orders</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {loading ? <p className="text-center text-gray-500">Loading orders...</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Order #{order.id}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'}`}>
                  {order.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">โต๊ะ: <span className="font-semibold">{order.table_number}</span></p>
              <p className="text-sm text-gray-600 mb-1">ยอดรวม: <span className="font-semibold">{order.total_amount} ฿</span></p>
              <p className="text-sm text-gray-600 mb-4">การชำระเงิน: <span className={`ml-2 px-2 py-1 rounded text-xs ${order.payment_status === 'paid' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>{order.payment_status}</span></p>

              <div className="flex justify-between items-center">
                {order.status === 'pending' && <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors" onClick={() => handleViewItems(order)}>ดูรายละเอียด</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal ยืนยัน */}
      {showConfirmModal && orderToConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">ยืนยันการกระทำ</h2>
            <p className="mb-4">คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะออเดอร์ของโต๊ะ <span className="font-semibold">{orderToConfirm.table_number}</span> เป็น <span className="font-semibold">{actionToConfirm === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}</span>?</p>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800" onClick={handleCancelAction}>ยกเลิก</button>
              <button className={`px-4 py-2 rounded-lg text-white ${actionToConfirm === 'completed' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`} onClick={handleConfirmAction}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal รายการอาหาร */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">🍽 รายการอาหาร</h2>
            <p className="mb-2 text-gray-700">โต๊ะ: <span className="font-semibold">{selectedOrder.table_number}</span></p>
            <p className="mb-4 text-gray-700">ยอดรวม: <span className="font-semibold">{selectedOrder.total_amount} ฿</span></p>

            <div className="space-y-4">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-start border rounded-lg p-3 shadow-sm">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 mr-4">
                    {item.menu_image ? <img src={item.menu_image} alt={item.menu_name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center w-full h-full text-gray-500 text-xs">No Image</div>}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{item.menu_name}</p>
                    <p className="text-gray-600 text-sm">จำนวน: {item.quantity}</p>
                    <p className="text-gray-600 text-sm">ราคา: {item.price_at_order} ฿</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              {selectedOrder.status === 'pending' && (
                <>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={() => handleActionClick(selectedOrder, 'completed')}>✅ เสร็จสิ้น</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={() => handleActionClick(selectedOrder, 'cancelled')}>❌ ยกเลิก</button>
                </>
              )}
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500" onClick={handleCloseItemsModal}>ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
