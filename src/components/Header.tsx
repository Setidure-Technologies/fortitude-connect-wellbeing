
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/offerings", label: "Offerings" },
  { to: "/community", label: "Community" },
  { to: "/forum", label: "Forum" },
  { to: "/events", label: "Events" },
  { to: "/stories", label: "Stories" },
];

const NavItems = () => {
  const { isAuthenticated, logout, user } = useAuth();
  
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
      
      {/* Show Chat link only to authenticated users */}
      {isAuthenticated && (
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-brand-blue ${
              isActive ? "text-brand-blue" : "text-slate-700"
            }`
          }
        >
          Forti AI
        </NavLink>
      )}
      
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.user_metadata?.full_name || user?.email || ""} />
                <AvatarFallback>
                  {user?.user_metadata?.full_name ? 
                    user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 
                    <User className="h-4 w-4" />
                  }
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <Settings className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/auth">Get Started</Link>
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
