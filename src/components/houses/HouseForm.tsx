import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { House, HOUSE_TYPE_LABELS, LOCATIONS, HouseType, AvailabilityStatus } from '@/types/house';
import { supabase } from '@/integrations/supabase/client';

const houseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  rent_price: z.number().min(1000, 'Rent must be at least KES 1,000').max(500000, 'Rent must be less than KES 500,000'),
  deposit_amount: z.number().min(0).max(500000),
  location: z.string().min(1, 'Please select a location'),
  house_type: z.enum(['bedsitter', 'single_room', 'one_bedroom', 'two_bedroom', 'shared'] as const),
  is_furnished: z.boolean(),
  availability: z.enum(['available', 'taken'] as const),
  contact_phone: z.string().min(10, 'Please enter a valid phone number').max(15),
  whatsapp_link: z.string().optional(),
  vacant_positions: z.number().min(0, 'Cannot be negative').max(100, 'Maximum 100'),
});

type HouseFormData = z.infer<typeof houseSchema>;

interface HouseFormProps {
  house?: House;
  landlordId: string;
  onSubmit: (data: Omit<House, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
}

export function HouseForm({ house, landlordId, onSubmit, isLoading }: HouseFormProps) {
  const [photos, setPhotos] = useState<string[]>(house?.photos || []);
  const [uploading, setUploading] = useState(false);

  const form = useForm<HouseFormData>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      title: house?.title || '',
      description: house?.description || '',
      rent_price: house?.rent_price || 5000,
      deposit_amount: house?.deposit_amount || 0,
      location: house?.location || '',
      house_type: house?.house_type || 'bedsitter',
      is_furnished: house?.is_furnished || false,
      availability: house?.availability || 'available',
      contact_phone: house?.contact_phone || '',
      whatsapp_link: house?.whatsapp_link || '',
      vacant_positions: house?.vacant_positions ?? 1,
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || photos.length >= 5) return;

    setUploading(true);
    const newPhotos: string[] = [];

    for (let i = 0; i < Math.min(files.length, 5 - photos.length); i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('house-photos')
        .upload(fileName, file);

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('house-photos')
          .getPublicUrl(data.path);
        newPhotos.push(urlData.publicUrl);
      }
    }

    setPhotos([...photos, ...newPhotos]);
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: HouseFormData) => {
    await onSubmit({
      title: data.title,
      description: data.description || null,
      rent_price: data.rent_price,
      deposit_amount: data.deposit_amount,
      location: data.location,
      house_type: data.house_type,
      is_furnished: data.is_furnished,
      availability: data.availability,
      contact_phone: data.contact_phone,
      whatsapp_link: data.whatsapp_link || null,
      vacant_positions: data.vacant_positions,
      landlord_id: landlordId,
      photos,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Spacious bedsitter near campus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your property, amenities, and nearby facilities..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="house_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>House Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.entries(HOUSE_TYPE_LABELS) as [HouseType, string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rent_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Rent (KES)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deposit_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit Amount (KES)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    onFocus={(e) => { if (field.value === 0) e.target.value = ''; }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vacant_positions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Vacant Positions</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>How many units are available for rent?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+254 7XX XXX XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Link (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://wa.me/254..." {...field} />
                </FormControl>
                <FormDescription>Leave empty to auto-generate from phone</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <FormField
            control={form.control}
            name="is_furnished"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0">Furnished</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="taken">Taken</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-3">
          <FormLabel>Photos (Max 5)</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img src={photo} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {photos.length < 5 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Plus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : house ? (
            'Update Listing'
          ) : (
            'Create Listing'
          )}
        </Button>
      </form>
    </Form>
  );
}
