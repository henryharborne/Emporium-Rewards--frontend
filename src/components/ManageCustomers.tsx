import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';

function ManageCustomers() {
  const admin = useUserStore((state) => state.admin);
  const API = import.meta.env.VITE_API_URL;

  const [addForm, setAddForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    points: 0,
  });

  const [addMessage, setAddMessage] = useState('');
  const [addError, setAddError] = useState('');
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
      const response = await fetch(`${API}/customers`, {
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
      if (!response.ok) throw new Error(data.error || 'Add customer failed.');

      setAddMessage('✅ Customer added successfully.');
      setAddForm({ name: '', phone: '', email: '', notes: '', points: 0 });
    } catch (err: any) {
      setAddError(err.message || 'Error adding customer.');
    }
  };

  const handleDeleteCustomer = async () => {
    setDeleteMessage('');
    setDeleteError('');

    try {
      const response = await fetch(`${API}/customers/search?q=${deleteValue}`, {
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      const customers = await response.json();
      if (!response.ok || customers.length === 0) throw new Error('Customer not found.');

      const customerId = customers[0].id;
      const deleteRes = await fetch(`${API}/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      if (!deleteRes.ok) throw new Error('Delete failed.');

      setDeleteMessage('🗑️ Customer deleted successfully.');
      setDeleteValue('');
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting customer.');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>➕➖ Manage Customers</h3>

      {/* Add Customer */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Add Customer</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            placeholder="Name (optional)"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            className="input"
          />
          <input
            placeholder="Phone *"
            value={addForm.phone}
            onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
            className="input"
          />
          <input
            placeholder="Email (optional)"
            value={addForm.email}
            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
            className="input"
          />
          <input
            placeholder="Notes (optional)"
            value={addForm.notes}
            onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Initial Points (optional)"
            value={addForm.points}
            onChange={(e) => setAddForm({ ...addForm, points: parseInt(e.target.value) || 0 })}
            className="input"
          />
          <button onClick={handleAddCustomer} className="button" style={{ backgroundColor: '#22c55e' }}>
            Add Customer
          </button>
        </div>
        {addMessage && <p className="success">{addMessage}</p>}
        {addError && <p className="error">{addError}</p>}
      </div>

      {/* Delete Customer */}
      <div className="container">
        <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Delete Customer</h4>
        <input
          placeholder="Phone or Email"
          value={deleteValue}
          onChange={(e) => setDeleteValue(e.target.value)}
          className="input"
        />
        <button
          onClick={handleDeleteCustomer}
          className="button"
          style={{ backgroundColor: '#ef4444', marginTop: '1rem' }}
        >
          Delete Customer
        </button>
        {deleteMessage && <p className="success">{deleteMessage}</p>}
        {deleteError && <p className="error">{deleteError}</p>}
      </div>
    </div>
  );
}

export default ManageCustomers;
