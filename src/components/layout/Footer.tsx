import { Home, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>CampusRentals</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Find your perfect rental home near campus. Simple, trusted, and easy to use.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/listings" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Browse Listings
              </Link>
              <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                List Your Property
              </Link>
              <Link to="/login" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Landlord Login
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@campusrentals.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+254 700 000 000</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CampusRentals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
