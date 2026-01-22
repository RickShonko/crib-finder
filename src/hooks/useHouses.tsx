import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { House, HouseFilters, HouseType, AvailabilityStatus } from '@/types/house';

export function useHouses(filters?: HouseFilters) {
  return useQuery({
    queryKey: ['houses', filters],
    queryFn: async () => {
      let query = supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.priceMin) {
        query = query.gte('rent_price', filters.priceMin);
      }
      if (filters?.priceMax) {
        query = query.lte('rent_price', filters.priceMax);
      }
      if (filters?.location) {
        query = query.eq('location', filters.location);
      }
      if (filters?.houseType) {
        query = query.eq('house_type', filters.houseType);
      }
      if (filters?.availability) {
        query = query.eq('availability', filters.availability);
      }
      if (filters?.isFurnished !== null && filters?.isFurnished !== undefined) {
        query = query.eq('is_furnished', filters.isFurnished);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as House[];
    },
  });
}

export function useHouse(id: string) {
  return useQuery({
    queryKey: ['house', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as House | null;
    },
    enabled: !!id,
  });
}

export function useLandlordHouses(profileId: string | undefined) {
  return useQuery({
    queryKey: ['landlord-houses', profileId],
    queryFn: async () => {
      if (!profileId) return [];
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('landlord_id', profileId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as House[];
    },
    enabled: !!profileId,
  });
}

export function useCreateHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (house: Omit<House, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('houses').insert(house).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      queryClient.invalidateQueries({ queryKey: ['landlord-houses'] });
    },
  });
}

export function useUpdateHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<House> & { id: string }) => {
      const { data, error } = await supabase
        .from('houses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      queryClient.invalidateQueries({ queryKey: ['landlord-houses'] });
      queryClient.invalidateQueries({ queryKey: ['house'] });
    },
  });
}

export function useDeleteHouse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('houses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['houses'] });
      queryClient.invalidateQueries({ queryKey: ['landlord-houses'] });
    },
  });
}
