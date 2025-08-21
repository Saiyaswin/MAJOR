import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Menu, X, User, LogOut, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">TeleMedCart</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/symptom-checker" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Symptom Checker
                  </Link>
                  <Link to="/book-appointment" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Book Appointment
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-700">{user.name}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{user.role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/symptom-checker"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Symptom Checker
                  </Link>
                  <Link
                    to="/book-appointment"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book Appointment
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="px-3 py-2 border-t border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Logged in as {user.name}</div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">TeleMedCart</span>
            </div>
            <p className="text-gray-400">
              Your trusted AI-powered healthcare companion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}