import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

type AdminLog = {
  id: string;
  created_at: string;
  admin_email: string;
  action_type: string;
  customer_id: string;
  customer_phone?: string;
  customer_email?: string;
  details?: string;
};

function AdminLogs() {
  const admin = useUserStore((state) => state.admin);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/admin/logs', {
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

    fetchLogs();
  }, [admin]);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!logs.length) return <p>No logs found.</p>;

  return (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>📜 Admin Action Logs</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Timestamp</th>
              <th style={thStyle}>Admin</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Customer ID</th>
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
                <td style={tdStyle}>{log.customer_id}</td>
                <td style={tdStyle}>{log.details || '-'}</td>
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
