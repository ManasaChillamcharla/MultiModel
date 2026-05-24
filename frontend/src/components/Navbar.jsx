import { Link, useNavigate } from 'react-router-dom';
import { FileText, Upload as UploadIcon, Search as SearchIcon, LayoutDashboard, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (user) {
      try {
        setUserName(JSON.parse(user).name || '');
      } catch {
        setUserName('');
      }
    }
  }, []);

  // Re-check on every render (simple approach for SPA)
  const token = localStorage.getItem('token');
  if (!!token !== isLoggedIn) {
    setIsLoggedIn(!!token);
    const user = localStorage.getItem('user');
    if (user) {
      try { setUserName(JSON.parse(user).name || ''); } catch { setUserName(''); }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          <FileText className="text-indigo-400" />
          Multimodal Analyzer
        </Link>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link to="/upload" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <UploadIcon size={18} /> Upload
              </Link>
              <Link to="/search" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <SearchIcon size={18} /> Search
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              {userName && (
                <span className="text-sm text-gray-500 hidden md:inline">
                  Hi, {userName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                <UserPlus size={16} /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
