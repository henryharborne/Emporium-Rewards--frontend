import { useState } from 'react';

function PhoneLookupForm() {
  const [phone, setPhone] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleLookup = async () => {
    setLoading(true);
    setError('');
    setPoints(null);

    try {
      const response = await fetch(`${API}/customers/lookup`, {
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
    <div className="container" style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
        Check Your Points
      </h2>

      <input
        type="tel"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input"
      />

      <button
        onClick={handleLookup}
        disabled={loading || phone.length < 10}
        className="button"
        style={{ marginTop: '1rem', backgroundColor: '#0050ff' }}
      >
        {loading ? 'Checking...' : 'Check Points'}
      </button>

      {points !== null && (
        <div className="success" style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            You have {points} point{points === 1 ? '' : 's'}!
          </p>
          {points >= 100 ? (
            <p style={{ marginTop: '0.5rem' }}>
              🎉 You are eligible for <strong>${Math.floor(points / 100) * 10} off</strong> on your next order!
            </p>
          ) : (
            <p style={{ marginTop: '0.5rem' }}>
              You are <strong>{100 - points} point{100 - points === 1 ? '' : 's'}</strong> away from points redemption.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="error" style={{ textAlign: 'center', marginTop: '1rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default PhoneLookupForm;
