import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

function Dashboard() {
  const admin = useUserStore((state) => state.admin);
  const setAdmin = useUserStore((state) => state.setAdmin);
  const logoutAdmin = useUserStore((state) => state.logoutAdmin);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/');

      try {
        const response = await fetch('http://localhost:4000/api/admin/is-admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.isAdmin) {
          localStorage.removeItem('adminToken');
          return navigate('/');
        }

        setAdmin({
          name: data.username,
          email: data.email,
          token,
        });
      } catch (err) {
        localStorage.removeItem('adminToken');
        return navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate, setAdmin]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  if (loading) {
    return <p className="p-6">Checking admin session...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Welcome, {admin?.name}</h2>
      <p className="text-gray-600 mb-4">This is your admin dashboard.</p>

      <div className="space-y-4">
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={() => alert('Search coming soon')}
        >
          🔍 Search Customers
        </button>
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={() => alert('Add/Delete coming soon')}
        >
          ➕➖ Add or Delete Customers
        </button>
        <button
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
          onClick={() => alert('Logs coming soon')}
        >
          📜 View Logs
        </button>
        <button
          onClick={handleLogout}
          className="text-red-600 underline hover:text-red-800 text-sm mt-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
