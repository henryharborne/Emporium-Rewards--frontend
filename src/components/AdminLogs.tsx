import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

type LogEntry = {
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
  const [logs, setLogs] = useState<LogEntry[]>([]);
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

        setLogs(data.reverse()); // Show newest first
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [admin]);

  return (
    <div className="mt-8 border-t pt-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">📜 Admin Action Logs</h3>

      {loading && <p>Loading logs...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && logs.length === 0 && <p>No logs found.</p>}

      {logs.length > 0 && (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 font-medium">Timestamp</th>
              <th className="px-4 py-2 font-medium">Admin</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Customer ID</th>
              <th className="px-4 py-2 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-700">{log.admin_email}</td>
                <td className="px-4 py-2 text-blue-700 font-semibold">{log.action_type}</td>
                <td className="px-4 py-2 text-gray-800">{log.customer_id}</td>
                <td className="px-4 py-2 text-gray-600">{log.details || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminLogs;
