import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fireevac_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // This is mocked for now as per instructions
    const mockToken = btoa(JSON.stringify({
      userId: '1',
      email: email,
      role: email.includes('admin') ? 'admin' : 'viewer',
      name: email.split('@')[0],
      exp: Math.floor(Date.now() / 1000) + 86400
    }));
    
    const mockUser = {
      id: '1',
      email,
      role: email.includes('admin') ? 'admin' : 'viewer',
      name: email.split('@')[0]
    };

    localStorage.setItem('fireevac_token', mockToken);
    localStorage.setItem('fireevac_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('fireevac_token');
    localStorage.removeItem('fireevac_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role,
      isAuthenticated: !!user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
