import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  notes: string;
};

function SearchCustomers() {
  const admin = useUserStore((state) => state.admin);
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'email' | 'phone'>('name');
  const [results, setResults] = useState<Customer[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Customer>>({});
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const API = import.meta.env.VITE_API_URL;

  const handleSearch = async () => {
    setError('');
    setMessage('');
    setResults([]);
    setLoading(true);

    try {
      const response = await fetch(`${API}/customers/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Search failed.');

      const filtered = data.filter((customer: Customer) =>
        customer[searchBy]?.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filtered);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditData({
      name: customer.name,
      notes: customer.notes,
      points: customer.points,
      email: customer.email,
      phone: customer.phone,
    });
    setAdjustAmount(0);
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setAdjustAmount(0);
  };

  const saveChanges = async (customerId: string) => {
    try {
      const { name, notes, points, email, phone } = editData;
      const updateBody: Record<string, any> = {};

      if (typeof name === 'string') {
        const trimmedName = name.trim();
        if (trimmedName === '') {
          setError('Name cannot be empty.');
          return;
        }
        updateBody.name = trimmedName;
      }

      if (typeof notes === 'string') {
        const trimmedNotes = notes.trim();
        if (trimmedNotes !== '') {
          updateBody.notes = trimmedNotes;
        }
      }

      if ('email' in editData) {
        updateBody.email = (email ?? '').trim();
      }

      if ('phone' in editData) {
        updateBody.phone = (phone ?? '').trim();
      }

      const original = results.find((c) => c.id === customerId);
      const pointDiff = (points ?? 0) - (original?.points ?? 0);

      if (Object.keys(updateBody).length === 0 && pointDiff === 0) {
        setError('No changes made to save.');
        return;
      }

      if (Object.keys(updateBody).length > 0) {
        const putRes = await fetch(`${API}/customers/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${admin?.token}`,
          },
          body: JSON.stringify(updateBody),
        });

        if (!putRes.ok) throw new Error('Failed to update customer info.');
      }

      if (pointDiff !== 0) {
        const patchRes = await fetch(`${API}/customers/${customerId}/points`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${admin?.token}`,
          },
          body: JSON.stringify({ amount: pointDiff }),
        });

        if (!patchRes.ok) throw new Error('Failed to update points.');
      }

      setMessage('Customer updated successfully.');
      cancelEdit();
      handleSearch();
    } catch (err: any) {
      setError(err.message || 'Update failed.');
    }
  };

  const applyPointAdjustment = (direction: 'add' | 'subtract') => {
    const adjustment = direction === 'add' ? adjustAmount : -adjustAmount;
    setEditData((prev) => ({
      ...prev,
      points: (prev.points || 0) + adjustment,
    }));
    setAdjustAmount(0);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🔍 Search Customers</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />
        <button onClick={handleSearch} className="button" style={{ backgroundColor: '#0050ff' }}>
          Search
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['name', 'email', 'phone'].map((field) => (
          <button
            key={field}
            onClick={() => setSearchBy(field as any)}
            className="button"
            style={{
              backgroundColor: searchBy === field ? '#e8491d' : '#333',
              color: '#fff',
              padding: '6px 12px',
            }}
          >
            {field}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {results.length > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.map((cust) => (
            <div key={cust.id} className="container">
              {editingId === cust.id ? (
                <>
                  <input
                    className="input"
                    value={editData.name ?? ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Name"
                  />
                  <input
                    className="input"
                    value={editData.email ?? ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                  />
                  <input
                    className="input"
                    value={editData.phone ?? ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone"
                  />
                  <input
                    className="input"
                    value={editData.notes ?? ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold' }}>Points: {editData.points}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="input"
                      style={{ width: '60px' }}
                      value={adjustAmount === 0 ? '' : adjustAmount}
                      onChange={(e) =>
                        setAdjustAmount(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)
                      }
                      placeholder="0"
                    />
                    <button
                      onClick={() => applyPointAdjustment('add')}
                      className="button"
                      style={{ backgroundColor: '#22c55e' }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => applyPointAdjustment('subtract')}
                      className="button"
                      style={{ backgroundColor: '#ef4444' }}
                    >
                      Subtract
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => saveChanges(cust.id)}
                      className="button"
                      style={{ backgroundColor: '#10b981' }}
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit} style={{ color: '#aaa', fontSize: '0.9rem' }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {cust.name}</p>
                  <p><strong>Email:</strong> {cust.email}</p>
                  <p><strong>Phone:</strong> {cust.phone}</p>
                  <p><strong>Points:</strong> {cust.points}</p>
                  <p><strong>Notes:</strong> {cust.notes}</p>
                  <button onClick={() => startEdit(cust)} style={{ color: '#60a5fa', marginTop: '0.5rem' }}>
                    ✏️ Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchCustomers;
