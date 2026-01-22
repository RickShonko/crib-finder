import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { HouseForm } from '@/components/houses/HouseForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useHouse, useUpdateHouse } from '@/hooks/useHouses';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: house, isLoading: houseLoading } = useHouse(id || '');
  const updateHouse = useUpdateHouse();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (house && profile && house.landlord_id !== profile.id) {
      navigate('/dashboard');
      toast({
        variant: 'destructive',
        title: 'Access denied',
        description: 'You can only edit your own listings.',
      });
    }
  }, [house, profile, navigate, toast]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
      await updateHouse.mutateAsync({ id, ...data });
      toast({
        title: 'Listing updated!',
        description: 'Your changes have been saved.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update listing',
      });
    }
  };

  if (authLoading || houseLoading || !profile) {
    return (
      <Layout>
        <div className="container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!house) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Listing Not Found</h2>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <HouseForm
              house={house}
              landlordId={profile.id}
              onSubmit={handleSubmit}
              isLoading={updateHouse.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditListing;
