import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import NotificationSystem from '@/components/NotificationSystem';

const AuthButtons = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-4">
      {isAuthenticated ? (
        <div className="flex items-center space-x-4">
          <NotificationSystem />
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
  );
};

export default AuthButtons;