import { Link } from 'react-router-dom';
import { Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileNavigation = ({ isMenuOpen, setIsMenuOpen }: MobileNavigationProps) => {
  const { isAuthenticated, user, userRole: contextRole, logout } = useAuth();
  // Enhanced role checking with fallback
  const userRole = contextRole || user?.user_metadata?.role;

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden py-4 border-t bg-white">
      <nav className="flex flex-col space-y-1">
        <Link 
          to="/" 
          className="px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 font-medium text-base touch-manipulation"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>

        <Link 
          to="/about" 
          className="px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 font-medium text-base touch-manipulation"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>

        <Link 
          to="/resources" 
          className="px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 font-medium text-base touch-manipulation"
          onClick={() => setIsMenuOpen(false)}
        >
          Resources
        </Link>

        {/* Mobile Community Links */}
        <div className="px-2 py-2">
          <p className="text-gray-500 text-sm font-semibold mb-3 px-4">Community</p>
          <div className="space-y-1">
            <Link 
              to="/connect" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Connect
            </Link>
            <Link 
              to="/forum" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Discussion Forum
            </Link>
            <Link 
              to="/support-groups" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Support Groups
            </Link>
            <Link 
              to="/events" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/stories" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Stories
            </Link>
          </div>
        </div>

        {/* Mobile Documentation Links */}
        <div className="px-2 py-2">
          <p className="text-gray-500 text-sm font-semibold mb-3 px-4">Documentation</p>
          <div className="space-y-1">
            <Link 
              to="/docs/platform" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Platform Guide
            </Link>
            <Link 
              to="/docs/donate" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Donation Guide
            </Link>
            <Link 
              to="/docs/rules" 
              className="block px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Community Rules
            </Link>
          </div>
        </div>
        
        {isAuthenticated && (
          <>
            <Link 
              to="/chat" 
              className="px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 font-medium text-base touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat with Forti
            </Link>

            {/* Admin Dashboard Link */}
            {userRole === 'admin' && (
              <Link 
                to="/admin" 
                className="px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 flex items-center gap-3 font-medium text-base touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-5 w-5" />
                Admin Dashboard
              </Link>
            )}

            {/* NGO Dashboard Link */}
            {(userRole === 'ngo' || userRole === 'admin') && (
              <Link 
                to="/ngo-dashboard" 
                className="px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 flex items-center gap-3 font-medium text-base touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="h-5 w-5" />
                NGO Dashboard
              </Link>
            )}

            <Link 
              to="/profile" 
              className="px-4 py-3 text-gray-700 hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 font-medium text-base touch-manipulation"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </>
        )}

        <Link 
          to="/donate" 
          className="px-4 py-3 text-brand-blue hover:text-brand-blue hover:bg-blue-50 rounded-lg mx-2 font-semibold text-base touch-manipulation bg-blue-50 border-2 border-blue-200"
          onClick={() => setIsMenuOpen(false)}
        >
          Donate
        </Link>

        {/* Auth Buttons Mobile - Enhanced touch targets */}
        <div className="px-4 pt-4 border-t mt-4 mx-2">
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={logout} 
              className="w-full h-12 text-base font-medium touch-manipulation"
            >
              Sign Out
            </Button>
          ) : (
            <div className="space-y-3">
              <Link to="/auth" className="block">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-medium touch-manipulation"
                >
                  Login
                </Button>
              </Link>
              <Link to="/auth" className="block">
                <Button 
                  className="w-full h-12 text-base font-medium touch-manipulation"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;