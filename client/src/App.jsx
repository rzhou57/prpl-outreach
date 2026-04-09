import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Landing from './components/Landing';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function KinderBlockly() {
  const { token } = useAuth();
  useEffect(() => {
    if (token) window.location.href = '/blockly';
  }, [token]);
  if (!token) return <Navigate to="/auth?tab=signup" replace />;
  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="grid-bg" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kinder-blockly" element={<KinderBlockly />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
