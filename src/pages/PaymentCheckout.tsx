import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useHouse } from '@/hooks/useHouses';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentCheckout = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: house, isLoading: houseLoading } = useHouse(id || '');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (house && house.payment_status === 'paid') {
      navigate('/dashboard');
    }
  }, [house, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePay = async () => {
    if (!id) return;
    setPaying(true);
    try {
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: { house_id: id },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: err.message || 'Failed to initialize payment',
      });
      setPaying(false);
    }
  };

  if (authLoading || houseLoading) {
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
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  const paymentAmount = Math.ceil(house.rent_price * 0.05 * house.vacant_positions);

  return (
    <Layout>
      <div className="container py-8 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{house.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span>{formatPrice(house.rent_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vacant Positions</span>
                  <span>{house.vacant_positions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listing Fee (5%)</span>
                  <span>{formatPrice(house.rent_price * 0.05)} × {house.vacant_positions}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(paymentAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted rounded-lg text-sm">
              <ShieldCheck className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p className="text-muted-foreground">
                Your listing will go live immediately after payment is confirmed. Payment is processed securely via Paystack.
              </p>
            </div>

            <Button onClick={handlePay} disabled={paying} className="w-full" size="lg">
              {paying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                <>Pay {formatPrice(paymentAmount)} to List</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentCheckout;
