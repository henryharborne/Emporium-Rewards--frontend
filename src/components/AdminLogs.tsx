import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

type AdminLog = {
  id: string;
  created_at: string;
  admin_email: string;
  action_type: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  details?: string;
};

function AdminLogs() {
  const admin = useUserStore((state) => state.admin);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_URL;

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API}/admin/logs`, {
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch logs.');
      }

      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [admin]);

  const handleUndo = async (logId: string) => {
    try {
      const response = await fetch(`${API}/admin/logs/${logId}/undo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${admin?.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Undo failed.');
      }

      alert(data.message || 'Undo completed');
      fetchLogs();
    } catch (err) {
      alert('Failed to undo');
    }
  };

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!logs.length) return <p>No logs found.</p>;

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>📜 Admin Action Logs</h3>
      <button
        onClick={() => {
          setLoading(true);
          fetchLogs();
        }}
        style={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          padding: '8px 14px',
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #374151',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#374151';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#1f2937';
        }}
      >
        🔄 Refresh Logs
      </button>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Timestamp</th>
              <th style={thStyle}>Admin</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={log.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#111' : '#1a1a1a',
                  borderBottom: '1px solid #333',
                }}
              >
                <td style={tdStyle}>{new Date(log.created_at).toLocaleString()}</td>
                <td style={tdStyle}>{log.admin_email}</td>
                <td style={{ ...tdStyle, color: '#60a5fa', fontWeight: 600 }}>
                  {log.action_type}
                </td>
                <td style={tdStyle}>{log.customer_name ?? 'Unknown'}</td>
                <td style={tdStyle}>{log.customer_phone ?? 'N/A'}</td>
                <td style={tdStyle}>
                  {log.details || '-'}
                  {log.action_type === 'modify_points' && (
                    <button
                      onClick={() => handleUndo(log.id)}
                      style={{
                        marginLeft: '10px',
                        backgroundColor: '#991b1b',
                        color: '#fff',
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Undo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#000',
};

const thStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  backgroundColor: '#222',
  color: '#fff',
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #333',
};

const tdStyle: React.CSSProperties = {
  padding: '12px',
  color: '#ccc',
  verticalAlign: 'top',
};

export default AdminLogs;
