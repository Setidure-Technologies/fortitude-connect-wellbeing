import { Link } from 'react-router-dom';
import { Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface MobileNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileNavigation = ({ isMenuOpen, setIsMenuOpen }: MobileNavigationProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const userRole = user?.user_metadata?.role;

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden py-4 border-t">
      <nav className="flex flex-col space-y-2">
        <Link 
          to="/" 
          className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>

        <Link 
          to="/about" 
          className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>

        {/* Mobile Community Links */}
        <div className="px-4 py-2">
          <p className="text-gray-500 text-sm font-medium mb-2">Community</p>
          <div className="ml-4 space-y-1">
            <Link 
              to="/forum" 
              className="block px-2 py-1 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Discussion Forum
            </Link>
            <Link 
              to="/support-groups" 
              className="block px-2 py-1 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Support Groups
            </Link>
            <Link 
              to="/events" 
              className="block px-2 py-1 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/stories" 
              className="block px-2 py-1 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Stories
            </Link>
          </div>
        </div>

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
        
        {isAuthenticated && (
          <>
            <Link 
              to="/chat" 
              className="px-4 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat with Forti
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
  );
};

export default MobileNavigation;