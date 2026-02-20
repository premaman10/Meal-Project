import { ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-slate-900 to-transparent backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <ChefHat className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart Meal Finder
          </span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition font-medium">
            Login
          </button>
          <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
