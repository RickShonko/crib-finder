import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { HouseForm } from '@/components/houses/HouseForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useCreateHouse } from '@/hooks/useHouses';
import { useUpdateHouse } from '@/hooks/useHouses';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const AdminNewListing = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createHouse = useCreateHouse();
  const updateHouse = useUpdateHouse();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await createHouse.mutateAsync(data);
      // Mark as paid immediately for admin
      await updateHouse.mutateAsync({
        id: result.id,
        payment_status: 'paid',
        payment_amount: 0,
        paid_at: new Date().toISOString(),
        payment_reference: 'admin_bypass',
      });
      toast({
        title: 'Listing created!',
        description: 'The listing is now live (no payment required).',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create listing',
      });
    }
  };

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container py-20 flex flex-col items-center justify-center gap-4">
          <ShieldAlert className="h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You do not have admin privileges.</p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Admin: Add Listing (No Payment)
            </CardTitle>
            <CardDescription>
              This listing will go live immediately without requiring payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HouseForm
              landlordId={profile.id}
              onSubmit={handleSubmit}
              isLoading={createHouse.isPending || updateHouse.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminNewListing;
