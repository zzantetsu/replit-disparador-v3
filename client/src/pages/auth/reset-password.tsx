import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PasswordInput } from '@/components/auth/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  useEffect(() => {
    // Get the session from the URL fragments
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });
  }, [navigate]);

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Password updated successfully!",
        });
        navigate('/dashboard');
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

  if (!session) {
    return (
      <AuthLayout>
        <div className="glass-card rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
          <p className="text-gray-400 text-sm">Verifying reset link</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="glass-card rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Set new password</h1>
          <p className="text-gray-400 text-sm">Enter your new password below</p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="password" className="block text-sm font-medium mb-2">
              New password
            </Label>
            <PasswordInput
              value={watchedPassword}
              onChange={(value) => setValue('password', value)}
              placeholder="Enter your new password"
              id="password"
            />
            <div className="text-xs text-gray-400 mt-1">
              Must be at least 8 characters
            </div>
            {errors.password && (
              <div className="text-red-400 text-xs mt-1">{errors.password.message}</div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm new password
            </Label>
            <PasswordInput
              value={watchedConfirmPassword}
              onChange={(value) => setValue('confirmPassword', value)}
              placeholder="Confirm your new password"
              id="confirmPassword"
            />
            {errors.confirmPassword && (
              <div className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</div>
            )}
          </div>

          <div className="gradient-border rounded-xl">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed gradient-border-content"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Updating password...
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Remember your password?{' '}
            <Link href="/login">
              <Button variant="link" className="text-primary hover:text-purple-400 transition-colors font-medium p-0">
                Back to sign in
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}