import { useUserStore } from '../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PhoneLookupForm from '../components/PhoneLookupForm';
import AdminLoginModal from '../components/AdminLoginModal';

function Home() {
  const admin = useUserStore((state) => state.admin);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (admin?.token) {
      navigate('/dashboard');
    } else {
      setLoading(false); // done checking
    }
  }, [admin, navigate]);

  if (loading) return null; // block rendering during redirect decision

  return (
    <div>
      <PhoneLookupForm />

      <div className="text-center mt-8">
        <button
          onClick={() => setShowLogin(true)}
          className="text-blue-600 font-semibold underline hover:text-blue-800"
        >
          Admin Login
        </button>
      </div>

      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Home;
