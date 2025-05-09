import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';

type Props = {
  onClose: () => void;
};

function AdminLoginModal({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAdmin = useUserStore((state) => state.setAdmin);

  const handleLogin = async () => {
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        setError('Invalid credentials');
        return;
      }

      // Save admin info + token to Zustand
      setAdmin({
        name: data.username,
        email: data.email,
        token: data.token,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 mb-3 rounded"
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginModal;
