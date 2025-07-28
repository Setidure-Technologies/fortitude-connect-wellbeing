
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import AuthButtons from './header/AuthButtons';
import MobileNavigation from './header/MobileNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-18 gap-2 sm:gap-4">
          <div className="flex-shrink-0 min-w-0">
            <Logo />
          </div>
          
          {!isMobile && (
            <div className="flex-1 flex justify-center max-w-2xl">
              <DesktopNavigation />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {!isMobile && <AuthButtons />}
            
            {/* Mobile Menu Button - Better positioning */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <MobileNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </header>
  );
};

export default Header;
