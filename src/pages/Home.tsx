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

  if (loading) return null;

  return (
    <div className="container">
      <h1>Smoke Emporium Rewards</h1>
      <p className="description">
        Enter your phone number below to check your point balance and see if you're eligible for a reward.
      </p>

      <PhoneLookupForm />

      <button onClick={() => setShowLogin(true)} className="button admin-button">
        Admin Login
      </button>

      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Home;
