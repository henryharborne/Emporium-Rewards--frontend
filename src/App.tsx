import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { useUserStore } from './store/useUserStore';

function App() {
  const admin = useUserStore((state) => state.admin);

  return (
    <BrowserRouter>
      <nav className="bg-white px-6 py-4 shadow-md mb-4">
        <ul className="flex justify-center">
          {!admin?.token && (
            <li>
              <Link to="/" className="text-blue-600 font-semibold hover:underline">
                Home
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
