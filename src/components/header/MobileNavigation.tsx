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
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Mobile menu */}
      <div className="fixed top-[64px] left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-2 h-full">
          <Link 
            to="/" 
            className="px-6 py-4 text-gray-700 hover:text-primary hover:bg-muted rounded-xl font-medium text-lg min-h-[56px] flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link 
            to="/about" 
            className="px-6 py-4 text-gray-700 hover:text-primary hover:bg-muted rounded-xl font-medium text-lg min-h-[56px] flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          <Link 
            to="/resources" 
            className="px-6 py-4 text-gray-700 hover:text-primary hover:bg-muted rounded-xl font-medium text-lg min-h-[56px] flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Resources
          </Link>

          {/* Mobile Community Links */}
          <div className="py-2">
            <p className="text-muted-foreground text-sm font-semibold mb-3 px-2">Community</p>
            <div className="space-y-1">
              <Link 
                to="/connect" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Connect
              </Link>
              <Link 
                to="/forum" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Discussion Forum
              </Link>
              <Link 
                to="/support-groups" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Support Groups
              </Link>
              <Link 
                to="/events" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/stories" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Stories
              </Link>
            </div>
          </div>

          {/* Mobile Documentation Links */}
          <div className="py-2">
            <p className="text-muted-foreground text-sm font-semibold mb-3 px-2">Documentation</p>
            <div className="space-y-1">
              <Link 
                to="/docs/platform" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Platform Guide
              </Link>
              <Link 
                to="/docs/donate" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Donation Guide
              </Link>
              <Link 
                to="/docs/rules" 
                className="block px-6 py-3 text-gray-700 hover:text-primary hover:bg-muted rounded-xl min-h-[48px] flex items-center"
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
                className="px-6 py-4 text-gray-700 hover:text-primary hover:bg-muted rounded-xl font-medium text-lg min-h-[56px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Forti
              </Link>

              {/* Admin Dashboard Link */}
              {userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  className="px-6 py-4 text-gray-700 hover:text-primary hover:bg-muted rounded-xl flex items-center gap-3 font-medium text-lg min-h-[56px]"
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
                  className="px-6 py-4 text-gray-700 hover:text-primary hover:bg-muted rounded-xl flex items-center gap-3 font-medium text-lg min-h-[56px]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building2 className="h-5 w-5" />
                  NGO Dashboard
                </Link>
              )}

              <Link 
                to="/profile" 
                className="px-6 py-4 text-gray-700 hover:text-primary hover:bg-muted rounded-xl font-medium text-lg min-h-[56px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}

          <Link 
            to="/support" 
            className="px-6 py-4 text-primary hover:text-primary hover:bg-primary/10 rounded-xl font-semibold text-lg min-h-[56px] flex items-center bg-primary/10 border-2 border-primary/20"
            onClick={() => setIsMenuOpen(false)}
          >
            Support Us
          </Link>

          {/* Auth Buttons Mobile - Enhanced touch targets */}
          <div className="pt-6 border-t mt-auto">
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                onClick={logout} 
                className="w-full h-14 text-lg font-medium"
              >
                Sign Out
              </Button>
            ) : (
              <div className="space-y-3">
                <Link to="/auth" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full h-14 text-lg font-medium"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth" className="block">
                  <Button 
                    className="w-full h-14 text-lg font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileNavigation;