import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export const ProtectedRoute = ({ children, adminOnly }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Show spinner while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-[#00ff88]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace/>;
  }

  return children;
};
