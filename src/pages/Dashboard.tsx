import { Link, useNavigate } from 'react-router-dom';
import { Plus, Home, Edit, Trash2, Eye, Loader2, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useLandlordHouses, useUpdateHouse, useDeleteHouse } from '@/hooks/useHouses';
import { useToast } from '@/hooks/use-toast';
import { HOUSE_TYPE_LABELS } from '@/types/house';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useEffect } from 'react';

const Dashboard = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: houses, isLoading } = useLandlordHouses(profile?.id);
  const updateHouse = useUpdateHouse();
  const deleteHouse = useDeleteHouse();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleAvailability = async (houseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'taken' : 'available';
    try {
      await updateHouse.mutateAsync({ id: houseId, availability: newStatus as 'available' | 'taken' });
      toast({
        title: 'Status updated',
        description: `Listing marked as ${newStatus}`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status',
      });
    }
  };

  const handleDelete = async (houseId: string) => {
    try {
      await deleteHouse.mutateAsync(houseId);
      toast({
        title: 'Listing deleted',
        description: 'Your property listing has been removed.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete listing',
      });
    }
  };

  if (authLoading) {
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
      <div className="container py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your rental properties
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Listing
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : houses && houses.length > 0 ? (
          <div className="space-y-4">
            {houses.map((house) => (
              <Card key={house.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-40 sm:h-auto">
                      <img
                        src={house.photos[0] || '/placeholder.svg'}
                        alt={house.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{house.title}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{house.location}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{HOUSE_TYPE_LABELS[house.house_type]}</Badge>
                            <Badge
                              className={
                                house.availability === 'available' ? 'badge-available' : 'badge-taken'
                              }
                            >
                              {house.availability === 'available' ? 'Available' : 'Taken'}
                            </Badge>
                          </div>
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(house.rent_price)}
                            <span className="text-sm font-normal text-muted-foreground">/month</span>
                          </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Available</span>
                            <Switch
                              checked={house.availability === 'available'}
                              onCheckedChange={() => toggleAvailability(house.id, house.availability)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/house/${house.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/dashboard/edit/${house.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this listing? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(house.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-lg border border-border">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Listings Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first property listing
            </p>
            <Button asChild>
              <Link to="/dashboard/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Listing
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
