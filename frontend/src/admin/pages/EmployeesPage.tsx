'use client';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface Employee {
  id: number;
  full_name: string;
  position: string;
  phone_number: string;
  salary: string;
  hire_date: string;
  restaurant_id: number;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ restaurant_id: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<Partial<Employee>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const navigate = useNavigate(); 
  const logout = useAuthStore((state) => state.logout);

  // --- Fetch employees ---
  const fetchEmployees = () => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));
  };

  useEffect(() => { fetchEmployees(); }, []);

  // --- CRUD ---
  const createEmployee = () => {
    if (!newEmployee.full_name || !newEmployee.position || !newEmployee.salary) {
      setValidationMessage("กรุณากรอกข้อมูลให้ครบถ้วน: ชื่อเต็ม, ตำแหน่ง และเงินเดือน");
      return;
    }
    setValidationMessage(null);
    const currentISODate = new Date().toISOString().split('T')[0];

    fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newEmployee, hire_date: currentISODate })
    }).then(() => { 
      fetchEmployees(); 
      setNewEmployee({ restaurant_id: 1 });
    });
  };

  const handleEditClick = (employee: Employee) => {
    setEditingId(employee.id);
    setEditedEmployee(employee);
  };

  const saveEditedEmployee = () => {
    fetch(`http://localhost:5000/api/employees/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedEmployee)
    }).then(() => {
      setEditingId(null);
      setEditedEmployee({});
      fetchEmployees();
    });
  };

  const deleteEmployee = (id: number) => {
    fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' })
      .then(() => fetchEmployees());
  };
  
  const handleDeleteClick = (employee: Employee) => {
    setConfirmDeleteId(employee.id);
    setEmployeeToDelete(employee);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteEmployee(confirmDeleteId);
      setConfirmDeleteId(null);
      setEmployeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setEmployeeToDelete(null);
  };

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    logout(); 
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👨‍🍳 จัดการข้อมูลพนักงาน</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <input placeholder="ชื่อเต็ม" className="border p-2 rounded flex-1"
            value={newEmployee.full_name || ''} 
            onChange={e => setNewEmployee({ ...newEmployee, full_name: e.target.value })} />
          <input placeholder="ตำแหน่ง" className="border p-2 rounded flex-1"
            value={newEmployee.position || ''} 
            onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })} />
          <input placeholder="เบอร์โทร" className="border p-2 rounded flex-1"
            value={newEmployee.phone_number || ''} 
            onChange={e => setNewEmployee({ ...newEmployee, phone_number: e.target.value })} />
          <input placeholder="เงินเดือน" className="border p-2 rounded flex-1"
            value={newEmployee.salary || ''} 
            onChange={e => setNewEmployee({ ...newEmployee, salary: e.target.value })} />
          <input placeholder="รหัสร้านอาหาร" className="border p-2 rounded flex-1 bg-gray-100" 
            value={newEmployee.restaurant_id || ''} readOnly />
          <button onClick={createEmployee} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            ➕ สร้าง
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-3 px-4">รหัส</th>
              <th className="py-3 px-4">ชื่อเต็ม</th>
              <th className="py-3 px-4">ตำแหน่ง</th>
              <th className="py-3 px-4">เงินเดือน</th>
              <th className="py-3 px-4">เบอร์โทร</th>
              <th className="py-3 px-4">วันที่เริ่มงาน</th>
              <th className="py-3 px-4">รหัสร้าน</th>
              <th className="py-3 px-4">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-t odd:bg-white even:bg-gray-50">
                <td className="py-3 px-4">{emp.id}</td>
                <td className="py-3 px-4">
                  {editingId === emp.id ? (
                    <input value={editedEmployee.full_name || ''} 
                      onChange={e => setEditedEmployee({ ...editedEmployee, full_name: e.target.value })} 
                      className="border p-1 w-full rounded" />
                  ) : emp.full_name}
                </td>
                <td className="py-3 px-4">
                  {editingId === emp.id ? (
                    <input value={editedEmployee.position || ''} 
                      onChange={e => setEditedEmployee({ ...editedEmployee, position: e.target.value })} 
                      className="border p-1 w-full rounded" />
                  ) : emp.position}
                </td>
                <td className="py-3 px-4">
                  {editingId === emp.id ? (
                    <input value={editedEmployee.salary || ''} 
                      onChange={e => setEditedEmployee({ ...editedEmployee, salary: e.target.value })} 
                      className="border p-1 w-full rounded" />
                  ) : emp.salary}
                </td>
                <td className="py-3 px-4">
                  {editingId === emp.id ? (
                    <input value={editedEmployee.phone_number || ''} 
                      onChange={e => setEditedEmployee({ ...editedEmployee, phone_number: e.target.value })} 
                      className="border p-1 w-full rounded" />
                  ) : emp.phone_number}
                </td>
                <td className="py-3 px-4">
                  {editingId === emp.id ? (
                    <input type="date" value={editedEmployee.hire_date || ''} 
                      onChange={e => setEditedEmployee({ ...editedEmployee, hire_date: e.target.value })} 
                      className="border p-1 w-full rounded" />
                  ) : emp.hire_date}
                </td>
                <td className="py-3 px-4">{emp.restaurant_id}</td>
                <td className="py-3 px-4">
                  {editingId === emp.id ? (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                      onClick={saveEditedEmployee}
                    >
                      💾 บันทึก
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                        onClick={() => handleEditClick(emp)}
                      >
                        ✏️ แก้ไข
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                        onClick={() => handleDeleteClick(emp)}
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDeleteId && employeeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">ยืนยันการลบ</h3>
            <p className="mb-4">คุณแน่ใจหรือไม่ที่จะลบพนักงาน <b>{employeeToDelete.full_name}</b>?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {validationMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">ข้อผิดพลาด</h3>
            <p className="mb-4">{validationMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setValidationMessage(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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
