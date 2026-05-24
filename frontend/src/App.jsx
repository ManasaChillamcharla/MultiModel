import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Search from './pages/Search';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';

// Simple auth guard – redirects to /login if no token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white selection:bg-indigo-500/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          </Routes>
        </main>
        <Toaster position="bottom-right" toastOptions={{ className: 'bg-gray-800 text-white' }} />
      </div>
    </Router>
  );
}

export default App;
