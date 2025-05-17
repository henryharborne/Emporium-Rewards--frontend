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

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    setError('');

    try {
      const response = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        setError('Invalid credentials');
        return;
      }

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
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={titleStyle}>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={errorStyle}>{error}</p>}

        <div style={buttonRowStyle}>
          <button onClick={onClose} style={cancelButtonStyle}>
            Cancel
          </button>
          <button onClick={handleLogin} className="button admin-button">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#111',
  color: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 0 20px rgba(0,0,0,0.4)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  marginBottom: '1rem',
  textAlign: 'center',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #444',
  backgroundColor: '#000',
  color: '#fff',
  borderRadius: '6px',
  marginBottom: '1rem',
};

const errorStyle: React.CSSProperties = {
  color: '#f87171',
  marginBottom: '1rem',
  textAlign: 'center',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
};

const cancelButtonStyle: React.CSSProperties = {
  background: 'none',
  color: '#aaa',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.95rem',
};

export default AdminLoginModal;
