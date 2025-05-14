import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import SearchCustomers from '../components/SearchCustomers';
import ManageCustomers from '../components/ManageCustomers';
import AdminLogs from '../components/AdminLogs';

function Dashboard() {
  const admin = useUserStore((state) => state.admin);
  const setAdmin = useUserStore((state) => state.setAdmin);
  const logoutAdmin = useUserStore((state) => state.logoutAdmin);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

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
    return <p className="container">Checking admin session...</p>;
  }

  return (
    <div className="container">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Welcome, {admin?.name}
      </h2>
      <p className="description">This is your admin dashboard.</p>

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          className="button"
          style={{ backgroundColor: '#0050ff' }}
          onClick={() => setShowSearch(!showSearch)}
        >
          🔍 {showSearch ? 'Hide' : 'Search'} Customers
        </button>

        <button
          className="button"
          style={{ backgroundColor: '#22c55e' }}
          onClick={() => setShowManage(!showManage)}
        >
          ➕➖ {showManage ? 'Hide' : 'Add/Delete'} Customers
        </button>

        <button
          className="button"
          style={{ backgroundColor: '#4b5563' }}
          onClick={() => setShowLogs(!showLogs)}
        >
          📜 {showLogs ? 'Hide' : 'View'} Logs
        </button>

        <button
          onClick={handleLogout}
          style={{ color: '#f87171', marginTop: '1rem', fontSize: '0.9rem' }}
        >
          Logout
        </button>
      </div>

      {showSearch && (
        <div id="search-section" style={{ marginTop: '2rem' }}>
          <SearchCustomers />
        </div>
      )}

      {showManage && (
        <div id="manage-section" style={{ marginTop: '2rem' }}>
          <ManageCustomers />
        </div>
      )}

      {showLogs && (
        <div id="logs-section" style={{ marginTop: '2rem' }}>
          <AdminLogs />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
