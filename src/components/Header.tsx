
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/offerings", label: "Offerings" },
  { to: "/community", label: "Community" },
  { to: "/forum", label: "Forum" },
  { to: "/events", label: "Events" },
  { to: "/stories", label: "Stories" },
  { to: "/chat", label: "Forti AI" },
];

const NavItems = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-brand-blue ${
              isActive ? "text-brand-blue" : "text-slate-700"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
       {isAuthenticated ? (
         <Button onClick={logout} variant="outline" size="sm" className="rounded-full">Log Out</Button>
      ) : (
        <div className="flex items-center gap-2">
           <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      )}
    </>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Heart className="h-6 w-6 text-brand-blue" />
            <span className="font-bold text-lg">Fortitude Network</span>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-end space-x-6">
          <NavItems />
        </div>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-6 pt-6">
                <NavItems />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
