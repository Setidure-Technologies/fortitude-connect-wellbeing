import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import NotificationSystem from '@/components/NotificationSystem';

const AuthButtons = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
      {isAuthenticated ? (
        <div className="flex items-center space-x-2 lg:space-x-3">
          <NotificationSystem />
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="px-3 py-2">
              <span className="hidden lg:inline">Profile</span>
              <span className="lg:hidden">👤</span>
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={logout} className="px-3 py-2">
            <span className="hidden lg:inline">Sign Out</span>
            <span className="lg:hidden">↗</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Link to="/auth">
            <Button variant="outline" size="sm" className="px-3 py-2">
              <span className="hidden lg:inline">Login</span>
              <span className="lg:hidden">↗</span>
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="px-3 py-2">
              <span className="hidden lg:inline">Sign Up</span>
              <span className="lg:hidden">+</span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;