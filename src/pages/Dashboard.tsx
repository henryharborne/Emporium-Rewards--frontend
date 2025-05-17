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

  const API = import.meta.env.VITE_API_URL;

  // Auth check
  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/');

      try {
        const response = await fetch(`${API}/admin/is-admin`, {
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
  }, [navigate, setAdmin, API]);

  // Cold-start prevention ping
  useEffect(() => {
    fetch(`${API}/admin/ping`)
      .then(() => console.log('Pinged backend to keep warm'))
      .catch(() => console.log('Ping failed (possibly sleeping backend)'));
  }, [API]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(`${API}/customers/export-customers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading CSV:', err);
    }
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
          className="button"
          style={{ backgroundColor: '#facc15', color: '#000' }}
          onClick={handleDownloadCSV}
        >
          📥 Download Customer CSV
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
