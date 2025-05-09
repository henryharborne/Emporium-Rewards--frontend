import { useState } from 'react';

function PhoneLookupForm() {
  const [phone, setPhone] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    setLoading(true);
    setError('');
    setPoints(null);

    try {
      const response = await fetch('http://localhost:4000/api/customers/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error('Customer not found or server error');
      }

      const data = await response.json();
      setPoints(data.points);
    } catch (err) {
      setError('Could not find customer with that phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Check Your Points</h2>
      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <button
        onClick={handleLookup}
        disabled={loading || phone.length < 10}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Check Points'}
      </button>

      {points !== null && (
        <div className="mt-4 text-center text-green-700">
            <p className="font-semibold text-lg">
                You have {points} point{points === 1 ? '' : 's'}!
            </p>
            {points >= 100 ? (
                <p className="mt-1">🎉 You are eligible for <strong>$10 off</strong> on your next order!</p>
            ) : (
                <p className="mt-1">You are <strong>{100 - points} point{100 - points === 1 ? '' : 's'}</strong> away from points redemption.</p>
            )}
        </div>  
      )}

      {error && (
        <p className="mt-4 text-center text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default PhoneLookupForm;
