'use client';
import { useEffect, useState } from 'react';

/**
 * Interface for an order item, representing a single menu item in an order.
 * Note: The API response should include a 'menu_image' field for each item.
 */
interface OrderItem {
  menu_id: number;
  quantity: number;
  price_at_order: string;
  menu_name: string;
  menu_image: string; // Added a new field for the menu image URL
}

/**
 * Interface for a complete order.
 */
interface Order {
  id: number;
  table_number: number;
  total_amount: string;
  status: string;
  payment_status: string;
  items: OrderItem[];
}

/**
 * The main component for displaying and managing restaurant orders.
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [orderToConfirm, setOrderToConfirm] = useState<Order | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Fetches all orders from the backend API.
   * This function is called on initial component load.
   */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
      })
      .catch(error => {
        console.error("Failed to fetch orders:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Sends a PATCH request to the backend to update the status of an order.
   * This function is called after user confirms their action in the modal.
   * @param id The ID of the order to update.
   * @param status The new status ('completed' or 'cancelled').
   */
  const updateOrderStatus = (id: number, status: string) => {
    fetch(`http://localhost:5000/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(() => {
      // Refresh the entire order list to get the latest data
      fetchOrders();
    }).catch(error => {
      console.error("Failed to update order status:", error);
    });
  };

  /**
   * Handles the click on 'Complete' or 'Cancel' button.
   * It stores the order and action, then shows the confirmation modal.
   */
  const handleActionClick = (order: Order, action: string) => {
    setOrderToConfirm(order);
    setActionToConfirm(action);
    setShowConfirmModal(true);
  };

  /**
   * Handles the confirmation from the modal.
   * It calls the updateOrderStatus function and closes the modal.
   */
  const handleConfirmAction = () => {
    if (orderToConfirm && actionToConfirm) {
      updateOrderStatus(orderToConfirm.id, actionToConfirm);
    }
    setShowConfirmModal(false);
    setOrderToConfirm(null);
    setActionToConfirm('');
    handleCloseItemsModal(); // Added this line to close the items modal as well
  };

  /**
   * Handles the cancellation from the modal.
   * It simply closes the modal without changing the order status.
   */
  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setOrderToConfirm(null);
    setActionToConfirm('');
  };

  /**
   * Handles the click on 'View Items' button.
   * It sets the selected order and opens the details modal.
   * @param order The order whose items are to be viewed.
   */
  const handleViewItems = (order: Order) => {
    setSelectedOrder(order);
  };

  /**
   * Closes the items modal.
   */
  const handleCloseItemsModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Table</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Payment</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading orders...</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-gray-200">
                  <td className="py-3 px-6">{order.id}</td>
                  <td className="py-3 px-6">{order.table_number}</td>
                  <td className="py-3 px-6">{order.total_amount}</td>
                  <td className="py-3 px-6">
                    {/* Status badge with conditional styling */}
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold
                      ${order.status === 'completed' ? 'bg-green-200 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                        'bg-yellow-200 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">{order.payment_status}</td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    {order.status === 'pending' && (
                      <>
                        {/* Button to view order items */}
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={() => handleViewItems(order)}
                        >
                          ดูรายการ
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && orderToConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold mb-4">ยืนยันการกระทำ</h2>
            <p className="mb-4">
              คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะออเดอร์ของโต๊ะที่ <span className="font-semibold">{orderToConfirm.table_number}</span> เป็น <span className="font-semibold">{actionToConfirm === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={handleCancelAction}
              >
                ยกเลิก
              </button>
              <button
                className={`text-white px-4 py-2 rounded
                  ${actionToConfirm === 'completed' ? 'bg-green-500' : 'bg-red-500'}`}
                onClick={handleConfirmAction}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Items Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4">รายการอาหาร ออเดอร์ #{selectedOrder.id}</h2>
            <p className="mb-2">โต๊ะ: <span className="font-semibold">{selectedOrder.table_number}</span></p>
            <p className="mb-4">ยอดรวม: <span className="font-semibold">{selectedOrder.total_amount}</span></p>
            
            <div className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="flex items-start border-b pb-4 last:border-b-0">
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden mr-4">
                    {/* Display the menu image */}
                    {item.menu_image ? (
                      <img src={item.menu_image} alt={item.menu_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Image</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-lg">{item.menu_name || `Menu ID: ${item.menu_id}`}</p>
                    <p className="text-gray-600">จำนวน: {item.quantity}</p>
                    <p className="text-gray-600">ราคา: {item.price_at_order}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              {/* Conditional rendering of action buttons inside the modal */}
              {selectedOrder.status === 'pending' && (
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition-colors"
                    onClick={() => handleActionClick(selectedOrder, 'completed')}
                  >
                    Complete
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 transition-colors"
                    onClick={() => handleActionClick(selectedOrder, 'cancelled')}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                onClick={handleCloseItemsModal}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}