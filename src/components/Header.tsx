
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, Building2, ChevronDown, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const userRole = user?.user_metadata?.role;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-brand-blue font-bold text-xl">
            <img 
              src="/Fortitude_logo.png" 
              alt="Fortitude Network Logo" 
              className="h-8 w-8 object-contain"
            />
            <span>Fortitude Network</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/about" 
              className={`text-gray-700 hover:text-brand-blue transition-colors ${
                isActivePath('/about') ? 'text-brand-blue font-medium' : ''
              }`}
            >
              About
            </Link>

            {/* Documentation Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-brand-blue transition-colors">
                <FileText className="h-4 w-4" />
                <span>Documentation</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/docs/platform" className="w-full">
                    Platform Guide
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/docs/donate" className="w-full">
                    Donation Guide
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/docs/rules" className="w-full">
                    Community Rules
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Community Features - Now visible to all users */}
            <Link 
              to="/community" 
              className={`text-gray-700 hover:text-brand-blue transition-colors ${
                isActivePath('/community') ? 'text-brand-blue font-medium' : ''
              }`}
            >
              Community
            </Link>
            <Link 
              to="/events" 
              className={`text-gray-700 hover:text-brand-blue transition-colors ${
                isActivePath('/events') ? 'text-brand-blue font-medium' : ''
              }`}
            >
              Events
            </Link>
            <Link 
              to="/stories" 
              className={`text-gray-700 hover:text-brand-blue transition-colors ${
                isActivePath('/stories') ? 'text-brand-blue font-medium' : ''
              }`}
            >
              Stories
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/chat" 
                  className={`text-gray-700 hover:text-brand-blue transition-colors ${
                    isActivePath('/chat') ? 'text-brand-blue font-medium' : ''
                  }`}
                >
                  Chat
                </Link>

                {/* Admin Dashboard Link */}
                {userRole === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`text-gray-700 hover:text-brand-blue transition-colors flex items-center gap-1 ${
                      isActivePath('/admin') ? 'text-brand-blue font-medium' : ''
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                {/* NGO Dashboard Link */}
                {(userRole === 'ngo' || userRole === 'admin') && (
                  <Link 
                    to="/ngo-dashboard" 
                    className={`text-gray-700 hover:text-brand-blue transition-colors flex items-center gap-1 ${
                      isActivePath('/ngo-dashboard') ? 'text-brand-blue font-medium' : ''
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    {userRole === 'admin' ? 'NGO' : 'Dashboard'}
                  </Link>
                )}
              </>
            )}

            <Link 
              to="/donate" 
              className={`text-gray-700 hover:text-brand-blue transition-colors ${
                isActivePath('/donate') ? 'text-brand-blue font-medium' : ''
              }`}
            >
              Donate
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/about" 
                className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Documentation Links */}
              <div className="px-4 py-2">
                <p className="text-gray-500 text-sm font-medium mb-2">Documentation</p>
                <div className="ml-4 space-y-1">
                  <Link 
                    to="/docs/platform" 
                    className="block px-2 py-1 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Platform Guide
                  </Link>
                  <Link 
                    to="/docs/donate" 
                    className="block px-2 py-1 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Donation Guide
                  </Link>
                  <Link 
                    to="/docs/rules" 
                    className="block px-2 py-1 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Community Rules
                  </Link>
                </div>
              </div>

              {/* Mobile Community Features */}
              <Link 
                to="/community" 
                className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/events" 
                className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/stories" 
                className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Stories
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/chat" 
                    className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chat
                  </Link>

                  {/* Admin Dashboard Link */}
                  {userRole === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}

                  {/* NGO Dashboard Link */}
                  {(userRole === 'ngo' || userRole === 'admin') && (
                    <Link 
                      to="/ngo-dashboard" 
                      className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Building2 className="h-4 w-4" />
                      NGO Dashboard
                    </Link>
                  )}

                  <Link 
                    to="/profile" 
                    className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}

              <Link 
                to="/donate" 
                className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate
              </Link>

              {/* Auth Buttons Mobile */}
              <div className="px-4 pt-2 border-t mt-2">
                {isAuthenticated ? (
                  <Button variant="outline" onClick={logout} className="w-full">
                    Sign Out
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/auth" className="block">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link to="/auth" className="block">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
