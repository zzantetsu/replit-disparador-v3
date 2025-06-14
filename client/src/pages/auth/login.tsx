import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PasswordInput } from '@/components/auth/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth';
import { loginSchema, type LoginData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, navigate] = useLocation();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const watchedPassword = watch('password');

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      const result = await signIn(data.email, data.password);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.needsActivation) {
        navigate('/activation');
      } else {
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

  return (
    <AuthLayout>
      <div className="glass-card rounded-3xl p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-primary font-bold mb-3 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-base font-secondary">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
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
            
            <div>
              <Label htmlFor="password" className="block text-sm font-medium mb-3 font-secondary text-gray-200">
                Password
              </Label>
              <PasswordInput
                value={watchedPassword}
                onChange={(value) => setValue('password', value)}
                placeholder="Enter your password"
                id="password"
                className="h-12 rounded-xl text-base"
              />
              {errors.password && (
                <div className="text-red-400 text-sm mt-2 font-secondary">{errors.password.message}</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="rememberMe"
                {...register('rememberMe')}
                className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5"
              />
              <Label htmlFor="rememberMe" className="text-sm text-gray-300 font-secondary cursor-pointer">
                Remember me
              </Label>
            </div>
            <Link href="/forgot-password">
              <Button type="button" variant="link" className="text-sm text-accent hover:text-primary transition-colors p-0 font-secondary">
                Forgot password?
              </Button>
            </Link>
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-base font-secondary">
            Don't have an account?{' '}
            <Link href="/register">
              <Button variant="link" className="text-accent hover:text-primary transition-colors font-semibold p-0 font-secondary">
                Sign up
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
