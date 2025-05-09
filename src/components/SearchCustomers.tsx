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

  const handleSearch = async () => {
    setError('');
    setMessage('');
    setResults([]);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/customers/search?q=${encodeURIComponent(query)}`, {
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
    setEditData({ name: customer.name, notes: customer.notes, points: customer.points });
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
      const { name, notes, points } = editData;

      // PUT - update name/notes
      const putRes = await fetch(`http://localhost:4000/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify({ name, notes }),
      });

      if (!putRes.ok) throw new Error('Failed to update customer info.');

      // PATCH - update points if changed
      const original = results.find((c) => c.id === customerId);
      const pointDiff = (points ?? 0) - (original?.points ?? 0);

      if (pointDiff !== 0) {
        const patchRes = await fetch(`http://localhost:4000/api/customers/${customerId}/points`, {
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
      handleSearch(); // Refresh results
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
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">🔍 Search Customers</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['name', 'email', 'phone'].map((field) => (
          <button
            key={field}
            onClick={() => setSearchBy(field as any)}
            className={`px-3 py-1 border rounded ${
              searchBy === field ? 'bg-blue-600 text-white' : 'bg-white text-black'
            }`}
          >
            {field}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      {results.length > 0 && (
        <div className="mt-4 space-y-4">
          {results.map((cust) => (
            <div key={cust.id} className="border rounded p-4 shadow">
              {editingId === cust.id ? (
                <>
                  <input
                    className="block mb-2 w-full border px-2 py-1 rounded"
                    value={editData.name ?? ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Name"
                  />
                  <input
                    className="block mb-2 w-full border px-2 py-1 rounded"
                    value={editData.notes ?? ''}
                    onChange={(e) => setEditData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notes"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Points: {editData.points}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-20 border px-2 py-1 rounded appearance-none"
                      value={adjustAmount === 0 ? '' : adjustAmount}
                      onChange={(e) =>
                        setAdjustAmount(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)
                      }
                      placeholder="0"
                    />
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                      onClick={() => applyPointAdjustment('add')}
                    >
                      Add
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => applyPointAdjustment('subtract')}
                    >
                      Subtract
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() => saveChanges(cust.id)}
                    >
                      Save
                    </button>
                    <button
                      className="text-sm text-gray-500 hover:underline"
                      onClick={cancelEdit}
                    >
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
                  <button
                    className="mt-2 text-blue-600 underline hover:text-blue-800"
                    onClick={() => startEdit(cust)}
                  >
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
