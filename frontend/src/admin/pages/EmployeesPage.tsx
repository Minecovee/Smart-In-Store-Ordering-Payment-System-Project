'use client';
import { useEffect, useState } from 'react';

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

  const fetchEmployees = () => {
    fetch('http://localhost:5000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const createEmployee = () => {
    // Check if the required fields are not empty
    if (!newEmployee.full_name || !newEmployee.position || !newEmployee.salary) {
      setValidationMessage("กรุณากรอกข้อมูลให้ครบถ้วน: ชื่อเต็ม, ตำแหน่ง และเงินเดือน");
      return;
    }

    // Clear any previous validation message
    setValidationMessage(null);

    const currentISODate = new Date().toISOString().split('T')[0];

    // Add hire_date and restaurant_id to the newEmployee object and send it to the API
    fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newEmployee, hire_date: currentISODate })
    }).then(() => { 
      fetchEmployees(); 
      setNewEmployee({ restaurant_id: 1 }); // Reset all fields and keep default ID
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">จัดการข้อมูลพนักงาน</h1>

      <div className="mb-4">
        <input
          placeholder="ชื่อเต็ม" className="border p-2 mr-2"
          value={newEmployee.full_name || ''} onChange={e => setNewEmployee({ ...newEmployee, full_name: e.target.value })}
        />
        <input
          placeholder="ตำแหน่ง" className="border p-2 mr-2"
          value={newEmployee.position || ''} onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
        />
        <input
          placeholder="เบอร์โทร" className="border p-2 mr-2"
          value={newEmployee.phone_number || ''} onChange={e => setNewEmployee({ ...newEmployee, phone_number: e.target.value })}
        />
        <input
          placeholder="เงินเดือน" className="border p-2 mr-2"
          value={newEmployee.salary || ''} onChange={e => setNewEmployee({ ...newEmployee, salary: e.target.value })}
        />
        <input
          placeholder="รหัสร้านอาหาร" className="border p-2 mr-2"
          value={newEmployee.restaurant_id || ''} readOnly
        />
        <button onClick={createEmployee} className="bg-blue-500 text-white px-3 py-2 rounded">สร้าง</button>
      </div>
      
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-6 text-left">รหัสพนักงาน</th>
            <th className="py-3 px-6 text-left">ชื่อเต็ม</th>
            <th className="py-3 px-6 text-left">ตำแหน่ง</th>
            <th className="py-3 px-6 text-left">เงินเดือน</th>
            <th className="py-3 px-6 text-left">เบอร์โทร</th>
            <th className="py-3 px-6 text-left">วันที่เริ่มงาน</th>
            <th className="py-3 px-6 text-left">รหัสร้านอาหาร</th>
            <th className="py-3 px-6 text-left">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-b">
              <td className="py-3 px-6 text-left whitespace-nowrap">{emp.id}</td>
              <td className="py-3 px-6 text-left">
                {editingId === emp.id ? (
                  <input value={editedEmployee.full_name || ''} onChange={e => setEditedEmployee({ ...editedEmployee, full_name: e.target.value })} className="border p-1 w-full" />
                ) : (
                  emp.full_name
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === emp.id ? (
                  <input value={editedEmployee.position || ''} onChange={e => setEditedEmployee({ ...editedEmployee, position: e.target.value })} className="border p-1 w-full" />
                ) : (
                  emp.position
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === emp.id ? (
                  <input value={editedEmployee.salary || ''} onChange={e => setEditedEmployee({ ...editedEmployee, salary: e.target.value })} className="border p-1 w-full" />
                ) : (
                  emp.salary
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === emp.id ? (
                  <input value={editedEmployee.phone_number || ''} onChange={e => setEditedEmployee({ ...editedEmployee, phone_number: e.target.value })} className="border p-1 w-full" />
                ) : (
                  emp.phone_number
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === emp.id ? (
                  <input type="date" value={editedEmployee.hire_date || ''} onChange={e => setEditedEmployee({ ...editedEmployee, hire_date: e.target.value })} className="border p-1 w-full" />
                ) : (
                  emp.hire_date
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === emp.id ? (
                  <input value={editedEmployee.restaurant_id || ''} className="border p-1 w-full bg-gray-200" readOnly />
                ) : (
                  emp.restaurant_id
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === emp.id ? (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={saveEditedEmployee}
                  >
                    บันทึก
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEditClick(emp)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteClick(emp)}
                    >
                      ลบ
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {confirmDeleteId && employeeToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-sm mx-auto">
            <h3 className="text-lg font-bold">ยืนยันการลบ</h3>
            <p className="my-4">คุณแน่ใจหรือไม่ที่จะลบพนักงาน "{employeeToDelete.full_name}"?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Message Modal */}
      {validationMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-sm mx-auto">
            <h3 className="text-lg font-bold">ข้อผิดพลาด</h3>
            <p className="my-4">{validationMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setValidationMessage(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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
