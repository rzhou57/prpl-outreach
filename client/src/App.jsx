import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Landing from './components/Landing';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
