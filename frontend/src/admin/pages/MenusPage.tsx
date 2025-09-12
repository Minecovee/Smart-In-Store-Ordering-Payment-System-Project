'use client';
import { useEffect, useState } from 'react';

// Interface for menu data, assuming image_url is available
interface Menu {
  id: number;
  name: string;
  category: string;
  base_price: string;
  is_available: boolean;
  image_url: string;
  // Added restaurant_id to the interface
  restaurant_id: number; 
}

export default function MenusPage() {
  // Set the default restaurant_id to 1
  const [menus, setMenus] = useState<Menu[]>([]);
  const [newMenu, setNewMenu] = useState<Partial<Menu>>({ restaurant_id: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedMenu, setEditedMenu] = useState<Partial<Menu>>({});

  const fetchMenus = () => {
    fetch('http://localhost:5000/api/menus')
      .then(res => res.json())
      .then(data => setMenus(data))
      .catch(error => console.error("Failed to fetch menus:", error));
  };

  useEffect(() => { fetchMenus(); }, []);

  const createMenu = () => {
    // 1. **Data Validation:** Check if all required fields are filled before sending
    // restaurant_id is now automatically set to 1
    if (!newMenu.name || !newMenu.category || !newMenu.base_price) {
      alert("Please fill out all required fields: Name, Category, and Base Price.");
      return;
    }

    // 2. **Type Casting:** Ensure base_price is sent as a number if needed by backend
    const menuToCreate = {
      ...newMenu,
      base_price: parseFloat(newMenu.base_price as string),
    };

    fetch('http://localhost:5000/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuToCreate)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(() => {
      fetchMenus();
      setNewMenu({ restaurant_id: 1 }); // Reset with default value
    })
    .catch(error => {
      console.error("Failed to create menu:", error);
      alert("Failed to create menu. Please check the console for details.");
    });
  };

  const handleEditClick = (menu: Menu) => {
    setEditingId(menu.id);
    setEditedMenu(menu);
  };

  const saveEditedMenu = () => {
    fetch(`http://localhost:5000/api/menus/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedMenu)
    }).then(() => {
      setEditingId(null);
      setEditedMenu({});
      fetchMenus();
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedMenu({});
  };

  const deleteMenu = (id: number) => {
    fetch(`http://localhost:5000/api/menus/${id}`, { method: 'DELETE' })
      .then(() => fetchMenus());
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Menus</h1>

      <div className="mb-4 space-x-2">
        {/* Changed to a disabled input field with a default value of 1 */}
        <input
          placeholder="Restaurant ID"
          type="number"
          className="border p-2 rounded w-32 bg-gray-100 cursor-not-allowed"
          value={newMenu.restaurant_id}
          disabled
        />
        <input
          placeholder="Name" className="border p-2 rounded"
          value={newMenu.name || ''} onChange={e => setNewMenu({ ...newMenu, name: e.target.value })}
        />
        <input
          placeholder="Category" className="border p-2 rounded"
          value={newMenu.category || ''} onChange={e => setNewMenu({ ...newMenu, category: e.target.value })}
        />
        <input
          placeholder="Base Price" type="number" className="border p-2 rounded w-24"
          value={newMenu.base_price || ''} onChange={e => setNewMenu({ ...newMenu, base_price: e.target.value })}
        />
        <label className="inline-flex items-center">
          <input
            type="checkbox" className="form-checkbox"
            checked={!!newMenu.is_available} onChange={e => setNewMenu({ ...newMenu, is_available: e.target.checked })}
          />
          <span className="ml-2">Available</span>
        </label>
        <input
          placeholder="Image URL" className="border p-2 rounded w-48"
          value={newMenu.image_url || ''} onChange={e => setNewMenu({ ...newMenu, image_url: e.target.value })}
        />
        <button onClick={createMenu} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Create</button>
      </div>

      <table className="w-full table-auto border-collapse border rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-200">
          <tr className="text-center text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Image</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Price</th>
            <th className="py-3 px-6 text-left">Available</th>
            <th className="py-3 px-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {menus.map(menu => (
            <tr key={menu.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{menu.id}</td>
              <td className="py-3 px-6">
                <img
                  src={menu.image_url}
                  alt={menu.name}
                  className="w-16 h-16 object-cover rounded-md shadow"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.onerror = null;
                    img.src = "https://placehold.co/64x64/E2E8F0/A0AEC0?text=No+Image";
                  }}
                />
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === menu.id ? (
                  <input
                    value={editedMenu.name || ''}
                    onChange={e => setEditedMenu({ ...editedMenu, name: e.target.value })}
                    className="border p-1 w-full rounded"
                  />
                ) : (
                  menu.name
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === menu.id ? (
                  <input
                    value={editedMenu.category || ''}
                    onChange={e => setEditedMenu({ ...editedMenu, category: e.target.value })}
                    className="border p-1 w-full rounded"
                  />
                ) : (
                  menu.category
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === menu.id ? (
                  <input
                    value={editedMenu.base_price || ''}
                    onChange={e => setEditedMenu({ ...editedMenu, base_price: e.target.value })}
                    type="number"
                    className="border p-1 w-full rounded"
                  />
                ) : (
                  menu.base_price
                )}
              </td>
              <td className="py-3 px-6 text-left">
                {editingId === menu.id ? (
                  <input
                    type="checkbox"
                    checked={!!editedMenu.is_available}
                    onChange={e => setEditedMenu({ ...editedMenu, is_available: e.target.checked })}
                  />
                ) : (
                  menu.is_available ? 'Yes' : 'No'
                )}
              </td>
              <td className="py-3 px-6 text-center">
                {editingId === menu.id ? (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
                      onClick={saveEditedMenu}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded-lg text-sm hover:bg-yellow-500 transition-colors"
                      onClick={() => handleEditClick(menu)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                      onClick={() => deleteMenu(menu.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
