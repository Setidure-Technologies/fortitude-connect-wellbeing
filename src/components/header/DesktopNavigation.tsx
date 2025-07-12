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
    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6">
      <Link 
        to="/" 
        className={`text-gray-700 hover:text-brand-blue transition-colors px-2 py-1 rounded-md ${
          isActivePath('/') ? 'text-brand-blue font-medium bg-blue-50' : ''
        }`}
      >
        Home
      </Link>

      <Link 
        to="/about" 
        className={`text-gray-700 hover:text-brand-blue transition-colors px-2 py-1 rounded-md ${
          isActivePath('/about') ? 'text-brand-blue font-medium bg-blue-50' : ''
        }`}
      >
        About
      </Link>

      <Link 
        to="/resources" 
        className={`text-gray-700 hover:text-brand-blue transition-colors px-2 py-1 rounded-md ${
          isActivePath('/resources') ? 'text-brand-blue font-medium bg-blue-50' : ''
        }`}
      >
        Resources
      </Link>

      {/* Community Dropdown - Now includes Connect */}
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center space-x-1 text-gray-700 hover:text-brand-blue transition-colors px-2 py-1 rounded-md ${
          ['/forum', '/support-groups', '/events', '/stories', '/connect'].some(path => isActivePath(path)) 
            ? 'text-brand-blue font-medium bg-blue-50' : ''
        }`}>
          <span>Community</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border shadow-lg z-50 min-w-[180px]">
          <DropdownMenuItem asChild>
            <Link to="/connect" className="w-full flex items-center">
              Connect
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/forum" className="w-full flex items-center">
              Discussion Forum
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/support-groups" className="w-full flex items-center">
              Support Groups
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/events" className="w-full flex items-center">
              Events
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/stories" className="w-full flex items-center">
              Stories
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Documentation Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center space-x-1 text-gray-700 hover:text-brand-blue transition-colors px-2 py-1 rounded-md ${
          ['/docs/platform', '/docs/donate', '/docs/rules'].some(path => isActivePath(path)) 
            ? 'text-brand-blue font-medium bg-blue-50' : ''
        }`}>
          <FileText className="h-4 w-4" />
          <span className="hidden lg:inline">Documentation</span>
          <span className="lg:hidden">Docs</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border shadow-lg z-50 min-w-[180px]">
          <DropdownMenuItem asChild>
            <Link to="/docs/platform" className="w-full flex items-center">
              Platform Guide
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/docs/donate" className="w-full flex items-center">
              Donation Guide
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/docs/rules" className="w-full flex items-center">
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
                  className={`text-gray-700 hover:text-brand-blue transition-colors px-2 py-1 rounded-md ${
                    isActivePath('/chat') ? 'text-brand-blue font-medium bg-blue-50' : ''
                  }`}
                >
                  <span className="hidden lg:inline">Forti</span>
                  <span className="lg:hidden">Forti</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-sm">
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
              className={`text-gray-700 hover:text-brand-blue transition-colors flex items-center gap-1 px-2 py-1 rounded-md ${
                isActivePath('/admin') ? 'text-brand-blue font-medium bg-blue-50' : ''
              }`}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden xl:inline">Admin</span>
            </Link>
          )}

          {/* NGO Dashboard Link */}
          {(userRole === 'ngo' || userRole === 'admin') && (
            <Link 
              to="/ngo-dashboard" 
              className={`text-gray-700 hover:text-brand-blue transition-colors flex items-center gap-1 px-2 py-1 rounded-md ${
                isActivePath('/ngo-dashboard') ? 'text-brand-blue font-medium bg-blue-50' : ''
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden xl:inline">{userRole === 'admin' ? 'NGO' : 'Dashboard'}</span>
            </Link>
          )}
        </>
      )}

      <Link 
        to="/donate" 
        className={`text-gray-700 hover:text-brand-blue transition-colors px-2 py-1 rounded-md font-medium ${
          isActivePath('/donate') ? 'text-brand-blue bg-blue-50' : 'hover:bg-blue-50'
        }`}
      >
        Donate
      </Link>
    </nav>
  );
};

export default DesktopNavigation;