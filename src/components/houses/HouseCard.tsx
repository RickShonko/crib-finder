import { Link } from 'react-router-dom';
import { MapPin, Bed, Phone, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { House, HOUSE_TYPE_LABELS } from '@/types/house';

interface HouseCardProps {
  house: House;
}

export function HouseCard({ house }: HouseCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const whatsappLink = house.whatsapp_link || `https://wa.me/${house.contact_phone.replace(/\D/g, '')}`;

  return (
    <Card className="overflow-hidden hover-lift group">
      <Link to={`/house/${house.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={house.photos[0] || '/placeholder.svg'}
            alt={house.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge
            className={`absolute top-3 right-3 ${
              house.availability === 'available' ? 'badge-available' : 'badge-taken'
            }`}
          >
            {house.availability === 'available' ? 'Available' : 'Taken'}
          </Badge>
          {house.is_furnished && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
              Furnished
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-2">
          <Link to={`/house/${house.id}`}>
            <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
              {house.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4" />
            <span>{house.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <Bed className="h-3 w-3 mr-1" />
            {HOUSE_TYPE_LABELS[house.house_type]}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-primary">{formatPrice(house.rent_price)}</p>
            <p className="text-xs text-muted-foreground">per month</p>
          </div>
          {house.deposit_amount > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Deposit</p>
              <p className="font-medium">{formatPrice(house.deposit_amount)}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 btn-call"
          >
            <a href={`tel:${house.contact_phone}`}>
              <Phone className="h-4 w-4 mr-1" />
              Call
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 btn-whatsapp"
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
