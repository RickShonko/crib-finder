import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Calendar, Phone, MessageCircle, ArrowLeft, Loader2, Sofa, Banknote } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ImageGallery } from '@/components/houses/ImageGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useHouse } from '@/hooks/useHouses';
import { HOUSE_TYPE_LABELS } from '@/types/house';
import { format } from 'date-fns';

const HouseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: house, isLoading, error } = useHouse(id || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !house) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This listing may have been removed or is no longer available.
          </p>
          <Button asChild>
            <Link to="/listings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const whatsappLink = house.whatsapp_link || `https://wa.me/${house.contact_phone.replace(/\D/g, '')}`;

  return (
    <Layout>
      <div className="container py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/listings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={house.photos} title={house.title} />

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{house.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{house.location}</span>
                  </div>
                </div>
                <Badge
                  className={`shrink-0 ${
                    house.availability === 'available' ? 'badge-available' : 'badge-taken'
                  }`}
                >
                  {house.availability === 'available' ? 'Available' : 'Taken'}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline">
                  <Bed className="h-3 w-3 mr-1" />
                  {HOUSE_TYPE_LABELS[house.house_type]}
                </Badge>
                {house.is_furnished && (
                  <Badge variant="outline">
                    <Sofa className="h-3 w-3 mr-1" />
                    Furnished
                  </Badge>
                )}
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Posted {format(new Date(house.created_at), 'MMM d, yyyy')}
                </Badge>
              </div>

              {house.description && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{house.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary">{formatPrice(house.rent_price)}</p>
                  <p className="text-muted-foreground">per month</p>
                </div>

                {house.deposit_amount > 0 && (
                  <div className="flex items-center gap-2 mb-6 p-3 bg-muted rounded-lg">
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deposit Required</p>
                      <p className="font-semibold">{formatPrice(house.deposit_amount)}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button asChild className="w-full btn-call" size="lg">
                    <a href={`tel:${house.contact_phone}`}>
                      <Phone className="mr-2 h-5 w-5" />
                      Call Landlord
                    </a>
                  </Button>
                  <Button asChild className="w-full btn-whatsapp" size="lg">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Message on WhatsApp
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Contact the landlord directly to schedule a viewing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HouseDetails;
