import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, Plus, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">CampusRentals</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
            Browse Listings
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Button asChild variant="default" size="sm">
                <Link to="/dashboard/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Listing
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{profile?.full_name}</span>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="default">
                <Link to="/register">List Your Property</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              to="/listings"
              className="text-foreground py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Listings
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-foreground py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button asChild variant="default" className="w-full">
                  <Link to="/dashboard/new" onClick={() => setMobileMenuOpen(false)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Listing
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild variant="default" className="w-full">
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>List Your Property</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
