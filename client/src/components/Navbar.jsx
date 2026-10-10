import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Compass, Flame, LogOut, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, user, signOut } = useAuth();

  const navItems = [
    { name: 'Discover', path: '/', icon: <Compass className="w-4 h-4 mr-2" /> },
    ...(isSignedIn ? [{ name: 'Dashboard', path: '/dashboard', icon: <Flame className="w-4 h-4 mr-2" /> }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center p-4 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-5xl bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60 border border-white/25 shadow-sm rounded-full px-4 h-16 flex items-center justify-between transition-all duration-300">
        
        {/* Left: Logo */}
        <Link to="/" className="flex shrink-0 items-center pl-2">
          <img src="/logo.svg" alt="Syncora" className="h-12 w-auto object-contain" />
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-muted text-foreground' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Auth */}
        <div className="flex items-center space-x-2 pr-1">
          {isSignedIn ? (
            <>
              <Link to="/create">
                <Button variant="ghost" className="rounded-full flex h-9">
                  <Plus className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              </Link>
              <Link to="/join">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20 h-9 px-5 border-none">
                  Join
                </Button>
              </Link>
              <div className="ml-2 pl-2 border-l border-white/10 flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-primary/20 p-0 overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Flame className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost" className="rounded-full h-9 px-3 sm:px-4 text-muted-foreground hover:text-foreground hover:bg-white/5">
                  Log In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20 h-9 px-4 sm:px-5 border-none">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
