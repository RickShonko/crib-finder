export type HouseType = 'bedsitter' | 'single_room' | 'one_bedroom' | 'two_bedroom' | 'shared';
export type AvailabilityStatus = 'available' | 'taken';

export type PaymentStatus = 'unpaid' | 'paid';

export interface House {
  id: string;
  landlord_id: string;
  title: string;
  description: string | null;
  rent_price: number;
  deposit_amount: number;
  location: string;
  house_type: HouseType;
  is_furnished: boolean;
  availability: AvailabilityStatus;
  photos: string[];
  contact_phone: string;
  whatsapp_link: string | null;
  vacant_positions: number;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  payment_amount: number | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  whatsapp_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface HouseFilters {
  search: string;
  priceMin: number | null;
  priceMax: number | null;
  location: string;
  houseType: HouseType | '';
  availability: AvailabilityStatus | '';
  isFurnished: boolean | null;
}

export const HOUSE_TYPE_LABELS: Record<HouseType, string> = {
  bedsitter: 'Bedsitter',
  single_room: 'Single Room',
  one_bedroom: '1 Bedroom',
  two_bedroom: '2 Bedroom',
  shared: 'Shared',
};

export const LOCATIONS = [
  'Near Campus',
  'Off Campus Road',
  'Kwa Kamanga',
  'Ndacha',
  'Mawatha',
  'Near Shell',
];
