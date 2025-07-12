
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import AuthButtons from './header/AuthButtons';
import MobileNavigation from './header/MobileNavigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-18 gap-4">
          <div className="flex-shrink-0">
            <Logo />
          </div>
          <div className="flex-1 flex justify-center">
            <DesktopNavigation />
          </div>
          <div className="flex-shrink-0">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button - Optimized touch target */}
          <button
            className="md:hidden p-3 -mr-3 touch-manipulation"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <MobileNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </header>
  );
};

export default Header;
