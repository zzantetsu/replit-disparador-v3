import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Key, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const activationSchema = z.object({
  activationKey: z.string().min(1, 'Activation key is required'),
});

type ActivationData = z.infer<typeof activationSchema>;

export default function Activation() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { signOut, checkUserStatus } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ActivationData>({
    resolver: zodResolver(activationSchema),
  });

  const onSubmit = async (data: ActivationData) => {
    setIsLoading(true);

    try {
      // Get the current user's session to obtain JWT token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        setError('activationKey', {
          type: 'manual',
          message: 'Sessão expirada. Faça login novamente.',
        });
        return;
      }

      // Make the activation request to the webhook
      const response = await fetch('https://mywebhook.roxiafy.cloud/webhook/auth/activate-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          activationKey: data.activationKey,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        toast({
          title: "Conta ativada com sucesso!",
          description: result.message,
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      } else if (response.status === 403) {
        setError('activationKey', {
          type: 'manual',
          message: 'Token inválido ou expirado. Faça login novamente.',
        });
        // Optionally sign out the user
        await signOut();
        setLocation('/login');
      } else if (response.status === 400) {
        // Display the exact message from the webhook response
        setError('activationKey', {
          type: 'manual',
          message: result.message || 'Erro na ativação. Tente novamente.',
        });
      } else {
        setError('activationKey', {
          type: 'manual',
          message: 'Erro inesperado. Tente novamente.',
        });
      }
      
    } catch (err: any) {
      console.error('Activation error:', err);
      setError('activationKey', {
        type: 'manual',
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation('/login');
  };

  return (
    <AuthLayout>
      <div className="glass-card rounded-3xl p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-primary font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-accent bg-clip-text text-transparent">
            Activate your account
          </h1>
          <p className="text-muted-foreground text-base font-secondary">
            Enter your activation key to access the platform
          </p>
        </div>

        {/* Activation Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <Label htmlFor="activationKey" className="text-sm font-medium text-muted-foreground mb-3 block font-secondary">
              Activation Key
            </Label>
            <Input
              id="activationKey"
              type="text"
              placeholder="Enter your activation key"
              className="glass-input h-14 px-6 text-base font-secondary focus:ring-2 focus:ring-primary/50 border-muted/20"
              {...register('activationKey')}
            />
            {errors.activationKey && (
              <div className="text-red-400 text-sm mt-2 font-secondary">{errors.activationKey.message}</div>
            )}
          </div>

          <div className="gradient-border rounded-2xl">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-300 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed gradient-border-content font-secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                'Activate Account'
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-muted-foreground font-secondary">
            Don't have an activation key? Contact support for assistance.
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="text-accent hover:text-orange-400 hover:bg-transparent font-secondary flex items-center gap-2 mx-auto bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Sign out and try different account
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}