import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Shield } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Validate
    if (!email?.trim()) {
      setError("Email is required");
      return;
    }
    if (!password?.trim()) {
      setError("Password is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      if (import.meta.env.VITE_MOCK_AUTH === "true" || true) { // Defaulting to true for demo
        // Mock auth — accept anything
        const mockToken = btoa(JSON.stringify({
          userId: "1",
          email: email,
          role: email.includes("admin")
            ? "admin" : "viewer",
          name: email.split("@")[0],
          exp: Math.floor(Date.now()/1000) + 86400
        }));
        localStorage.setItem(
          "fireevac_token", mockToken
        );
        localStorage.setItem(
          "fireevac_user",
          JSON.stringify({
            id: "1",
            email,
            role: email.includes("admin")
              ? "admin" : "viewer",
            name: email.split("@")[0]
          })
        );
        navigate("/"); // Use "/" for dashboard
        return;
      }
      
      // Real auth
      await login(email, password);
      navigate("/");
      
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-center">
            <Shield className="h-6 w-6 text-[#00ff88]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#f0f0f0]">
          Sign in to FireEvac
        </h2>
        <p className="mt-2 text-center text-sm text-[#888888]">
          Demo: use any email/password. Use 'admin@' for admin role.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141414] py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-[#222222]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#f0f0f0]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-[#333333] bg-[#0f0f0f] px-3 py-2 text-[#f0f0f0] placeholder-[#555555] focus:border-[#00ff88] focus:outline-none focus:ring-[#00ff88] sm:text-sm transition-colors duration-200"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#f0f0f0]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-[#333333] bg-[#0f0f0f] px-3 py-2 text-[#f0f0f0] placeholder-[#555555] focus:border-[#00ff88] focus:outline-none focus:ring-[#00ff88] sm:text-sm transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-[#ff4444] text-sm bg-[#ff4444]/10 border border-[#ff4444]/20 rounded-md p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-lg bg-[#00ff88] py-2 px-4 text-sm font-semibold text-black shadow-sm hover:bg-[#00cc6a] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:ring-offset-2 focus:ring-offset-[#090909] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
