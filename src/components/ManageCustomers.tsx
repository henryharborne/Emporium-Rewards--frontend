import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';

function ManageCustomers() {
  const admin = useUserStore((state) => state.admin);

  // Add form state
  const [addForm, setAddForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    points: 0,
  });

  const [addMessage, setAddMessage] = useState('');
  const [addError, setAddError] = useState('');

  // Delete form state
  const [deleteValue, setDeleteValue] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleAddCustomer = async () => {
    setAddMessage('');
    setAddError('');

    if (!addForm.phone.trim()) {
      setAddError('Phone number is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify({
          phone: addForm.phone,
          ...(addForm.name && { name: addForm.name }),
          ...(addForm.email && { email: addForm.email }),
          ...(addForm.notes && { notes: addForm.notes }),
          ...(addForm.points !== 0 && { points: addForm.points }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Add customer failed.');
      }

      setAddMessage('Customer added successfully.');
      setAddForm({
        name: '',
        phone: '',
        email: '',
        notes: '',
        points: 0,
      });
    } catch (err: any) {
      setAddError(err.message || 'Error adding customer.');
    }
  };

  const handleDeleteCustomer = async () => {
    setDeleteMessage('');
    setDeleteError('');

    try {
      const response = await fetch(`http://localhost:4000/api/customers/search?q=${deleteValue}`, {
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      const customers = await response.json();

      if (!response.ok || customers.length === 0) {
        throw new Error('Customer not found.');
      }

      const customerId = customers[0].id;

      const deleteRes = await fetch(`http://localhost:4000/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (!deleteRes.ok) {
        throw new Error('Delete failed.');
      }

      setDeleteMessage('Customer deleted successfully.');
      setDeleteValue('');
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting customer.');
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">➕➖ Manage Customers</h3>

      {/* Add Customer */}
      <div className="mb-8 border p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Add Customer</h4>
        <div className="space-y-2">
          <input
            className="w-full border px-3 py-1 rounded"
            placeholder="Name (optional)"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
          />
          <input
            className="w-full border px-3 py-1 rounded"
            placeholder="Phone *"
            value={addForm.phone}
            onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
          />
          <input
            className="w-full border px-3 py-1 rounded"
            placeholder="Email (optional)"
            value={addForm.email}
            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
          />
          <input
            className="w-full border px-3 py-1 rounded"
            placeholder="Notes (optional)"
            value={addForm.notes}
            onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
          />
          <input
            type="number"
            className="w-full border px-3 py-1 rounded"
            placeholder="Initial Points (optional)"
            value={addForm.points}
            onChange={(e) => setAddForm({ ...addForm, points: parseInt(e.target.value) || 0 })}
          />
          <button
            onClick={handleAddCustomer}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Customer
          </button>
        </div>
        {addMessage && <p className="text-green-600 mt-2">{addMessage}</p>}
        {addError && <p className="text-red-600 mt-2">{addError}</p>}
      </div>

      {/* Delete Customer */}
      <div className="border p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Delete Customer</h4>
        <input
          className="w-full border px-3 py-1 rounded mb-2"
          placeholder="Phone or Email"
          value={deleteValue}
          onChange={(e) => setDeleteValue(e.target.value)}
        />
        <button
          onClick={handleDeleteCustomer}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Customer
        </button>
        {deleteMessage && <p className="text-green-600 mt-2">{deleteMessage}</p>}
        {deleteError && <p className="text-red-600 mt-2">{deleteError}</p>}
      </div>
    </div>
  );
}

export default ManageCustomers;
