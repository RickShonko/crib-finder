import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { HouseForm } from '@/components/houses/HouseForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCreateHouse } from '@/hooks/useHouses';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const NewListing = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createHouse = useCreateHouse();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (data: any) => {
    try {
      const result = await createHouse.mutateAsync(data);
      toast({
        title: 'Listing created!',
        description: 'Please complete payment to make it live.',
      });
      navigate(`/payment/checkout/${result.id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create listing',
      });
    }
  };

  if (authLoading || !profile) {
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
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add New Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <HouseForm
              landlordId={profile.id}
              onSubmit={handleSubmit}
              isLoading={createHouse.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NewListing;
