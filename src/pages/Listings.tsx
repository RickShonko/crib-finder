import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Home, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { HouseCard } from '@/components/houses/HouseCard';
import { HouseFilters } from '@/components/houses/HouseFilters';
import { useHouses } from '@/hooks/useHouses';
import { HouseFilters as IHouseFilters } from '@/types/house';

const Listings = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<IHouseFilters>({
    search: initialSearch,
    priceMin: null,
    priceMax: null,
    location: '',
    houseType: '',
    availability: '',
    isFurnished: null,
  });

  const { data: houses, isLoading } = useHouses(filters);

  useEffect(() => {
    if (initialSearch) {
      setFilters((prev) => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Rentals</h1>
          <p className="text-muted-foreground">
            {houses?.length || 0} properties available
          </p>
        </div>

        <div className="mb-8">
          <HouseFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : houses && houses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-lg border border-border">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Listings;
