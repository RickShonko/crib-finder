import { Link } from 'react-router-dom';
import { Search, Home, Shield, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layout } from '@/components/layout/Layout';
import { HouseCard } from '@/components/houses/HouseCard';
import { useHouses } from '@/hooks/useHouses';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: houses, isLoading } = useHouses({ 
    search: '', 
    priceMin: null, 
    priceMax: null, 
    location: '', 
    houseType: '', 
    availability: 'available', 
    isFurnished: null 
  });

  const featuredHouses = houses?.slice(0, 6) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Find Your Perfect
              <br />
              <span className="text-secondary">Campus Home</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-slide-up">
              Browse verified rental listings near campus. Connect directly with landlords via WhatsApp or call.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto animate-slide-up">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by location or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-card border-0 shadow-lg"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg">
                Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L48 90C96 80 192 60 288 53.3C384 47 480 53 576 58.3C672 63 768 67 864 65C960 63 1056 55 1152 51.7C1248 48 1344 48 1392 48L1440 48V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z" className="fill-background"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-card border border-border hover-lift">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Home className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Listings</h3>
              <p className="text-muted-foreground text-sm">
                All properties are verified and located near campus for easy commute.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-card border border-border hover-lift">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Phone className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Direct Contact</h3>
              <p className="text-muted-foreground text-sm">
                Connect with landlords directly via WhatsApp or phone call.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-card border border-border hover-lift">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe & Trusted</h3>
              <p className="text-muted-foreground text-sm">
                Landlords are required to provide valid contact information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Available Listings</h2>
              <p className="text-muted-foreground mt-1">Find your next home today</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/listings">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg h-[400px] animate-pulse" />
              ))}
            </div>
          ) : featuredHouses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHouses.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Listings Yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to post a rental listing!</p>
              <Button asChild>
                <Link to="/register">List Your Property</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Are You a Landlord?</h2>
            <p className="text-muted-foreground mb-6">
              List your property for free and reach thousands of students and tenants looking for housing near campus.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/register">
                Start Listing Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
