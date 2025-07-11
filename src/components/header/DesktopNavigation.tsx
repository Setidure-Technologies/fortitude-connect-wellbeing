import { Link, useLocation } from 'react-router-dom';
import { Shield, Building2, ChevronDown, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const DesktopNavigation = () => {
  const { isAuthenticated, user, userRole: contextRole } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // Enhanced role checking with fallback
  const userRole = contextRole || user?.user_metadata?.role;

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link 
        to="/" 
        className={`text-gray-700 hover:text-brand-blue transition-colors ${
          isActivePath('/') ? 'text-brand-blue font-medium' : ''
        }`}
      >
        Home
      </Link>

      <Link 
        to="/about" 
        className={`text-gray-700 hover:text-brand-blue transition-colors ${
          isActivePath('/about') ? 'text-brand-blue font-medium' : ''
        }`}
      >
        About
      </Link>

      {/* Community Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-1 text-gray-700 hover:text-brand-blue transition-colors">
          <span>Community</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border shadow-lg">
          <DropdownMenuItem asChild>
            <Link to="/forum" className="w-full">
              Discussion Forum
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/support-groups" className="w-full">
              Support Groups
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/events" className="w-full">
              Events
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/stories" className="w-full">
              Stories
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
      
      {isAuthenticated && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to="/chat" 
                  className={`text-gray-700 hover:text-brand-blue transition-colors ${
                    isActivePath('/chat') ? 'text-brand-blue font-medium' : ''
                  }`}
                >
                  Chat with Forti
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Your 24/7 AI companion trained specifically for cancer support. 
                  Get personalized guidance, emotional support, and answers to your 
                  questions in complete confidentiality.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
  );
};

export default DesktopNavigation;