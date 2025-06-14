import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { forgotPasswordSchema, type ForgotPasswordData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(data.email);
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="glass-card rounded-3xl p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-primary font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-accent bg-clip-text text-transparent">
            Reset password
          </h1>
          <p className="text-muted-foreground text-base font-secondary">Enter your email to receive a reset link</p>
        </div>

        {/* Recovery Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium mb-3 font-secondary text-gray-200">
              Email address
            </Label>
            <Input
              {...register('email')}
              type="email"
              id="email"
              className="glass-input text-white placeholder-gray-500 transition-all duration-300 focus:outline-none text-base h-12 rounded-xl font-secondary"
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="text-red-400 text-sm mt-2 font-secondary">{errors.email.message}</div>
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
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-base font-secondary">
            Remember your password?{' '}
            <Link href="/login">
              <Button variant="link" className="text-accent hover:text-primary transition-colors font-semibold p-0 font-secondary">
                Back to sign in
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
