import React, { useState } from 'react';
import { Menu, X, LogOut, Settings, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface TopNavProps {
  onSidebarToggle?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-primary border-b border-primary shadow-sm">
      <div className="flex items-center justify-between px-xl py-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-md">
          <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-inverse" />
          </div>
          <span className="font-bold text-xl text-primary hidden sm:inline">ContentFlow</span>
        </Link>

        {/* Center - Navigation (desktop) */}
        <nav className="hidden md:flex items-center gap-xl">
          <Link to="/" className="body-base text-secondary hover:text-brand transition-colors">
            Dashboard
          </Link>
          <Link to="/ideas" className="body-base text-secondary hover:text-brand transition-colors">
            Ideas
          </Link>
          <Link to="/editor" className="body-base text-secondary hover:text-brand transition-colors">
            Write
          </Link>
          <Link to="/library" className="body-base text-secondary hover:text-brand transition-colors">
            Library
          </Link>
        </nav>

        {/* Right - User Menu */}
        <div className="flex items-center gap-lg">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-sm p-sm rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-inverse font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-primary">{user.name}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-md bg-primary border border-primary rounded-lg shadow-lg p-md min-w-[200px] animate-slide-in">
                  <div className="body-small text-secondary mb-lg">{user.email}</div>
                  <div className="divider" />
                  <Link
                    to="/settings"
                    className="flex items-center gap-md p-md hover:bg-secondary rounded transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="body-small">Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-md p-md hover:bg-secondary rounded transition-colors text-danger"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="body-small">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={onSidebarToggle}
            className="md:hidden p-sm hover:bg-secondary rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
};
