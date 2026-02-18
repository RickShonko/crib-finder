import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference found');
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { reference },
        });

        if (error) throw error;

        if (data.verified) {
          setStatus('success');
          setMessage('Your listing is now live and visible to tenants!');
        } else {
          setStatus('failed');
          setMessage(data.message || 'Payment could not be verified');
        }
      } catch (err: any) {
        setStatus('failed');
        setMessage(err.message || 'Failed to verify payment');
      }
    };

    verify();
  }, [reference]);

  return (
    <Layout>
      <div className="container py-20 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            {status === 'verifying' && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Verifying Payment</h2>
                <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Go to Dashboard
                </Button>
              </>
            )}
            {status === 'failed' && (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
                  Back to Dashboard
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentVerify;
