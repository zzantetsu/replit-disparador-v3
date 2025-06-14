import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PasswordInput } from '@/components/auth/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth';
import { registerSchema, type RegisterData } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [, navigate] = useLocation();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const watchedPassword = watch('password');
  const watchedConfirmPassword = watch('confirmPassword');

  const onSubmit = async (data: RegisterData) => {
    console.log('Form data:', data);
    console.log('Form errors:', errors);
    setIsLoading(true);
    
    try {
      const { error } = await signUp(data.email, data.password, data.firstName, data.lastName);
      
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
          <h1 className="text-3xl font-primary font-bold mb-3 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
            Create account
          </h1>
          <p className="text-muted-foreground text-base font-secondary">Join thousands of users building the future</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium mb-3 font-secondary text-gray-200">
                  First name
                </Label>
                <Input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  className="glass-input text-white placeholder-gray-500 transition-all duration-300 focus:outline-none text-base h-12 rounded-xl font-secondary"
                  placeholder="John"
                />
                {errors.firstName && (
                  <div className="text-red-400 text-sm mt-2 font-secondary">{errors.firstName.message}</div>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium mb-3 font-secondary text-gray-200">
                  Last name
                </Label>
                <Input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  className="glass-input text-white placeholder-gray-500 transition-all duration-300 focus:outline-none text-base h-12 rounded-xl font-secondary"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <div className="text-red-400 text-sm mt-2 font-secondary">{errors.lastName.message}</div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-3 font-secondary text-gray-200">
                Email address
              </Label>
              <Input
                {...register('email')}
                type="email"
                id="email"
                className="glass-input text-white placeholder-gray-500 transition-all duration-300 focus:outline-none text-base h-12 rounded-xl font-secondary"
                placeholder="john@example.com"
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
                placeholder="Create a strong password"
                id="password"
                className="h-12 rounded-xl text-base"
              />
              <div className="text-sm text-muted-foreground mt-2 font-secondary">
                Must be at least 8 characters with numbers and symbols
              </div>
              {errors.password && (
                <div className="text-red-400 text-sm mt-2 font-secondary">{errors.password.message}</div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-3 font-secondary text-gray-200">
                Confirm password
              </Label>
              <PasswordInput
                value={watchedConfirmPassword}
                onChange={(value) => setValue('confirmPassword', value)}
                placeholder="Confirm your password"
                id="confirmPassword"
                className="h-12 rounded-xl text-base"
              />
              {errors.confirmPassword && (
                <div className="text-red-400 text-sm mt-2 font-secondary">{errors.confirmPassword.message}</div>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 py-2">
            <Checkbox
              id="agreeToTerms"
              checked={watch('agreeToTerms')}
              onCheckedChange={(checked) => setValue('agreeToTerms', checked === true)}
              className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5 mt-0.5"
            />
            <Label htmlFor="agreeToTerms" className="text-sm text-gray-300 font-secondary cursor-pointer leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-accent hover:text-primary transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-accent hover:text-primary transition-colors">Privacy Policy</a>
            </Label>
          </div>
          {errors.agreeToTerms && (
            <div className="text-red-400 text-sm font-secondary">{errors.agreeToTerms.message}</div>
          )}

          <div className="gradient-border rounded-2xl">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-300 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed gradient-border-content font-secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-base font-secondary">
            Already have an account?{' '}
            <Link href="/login">
              <Button variant="link" className="text-accent hover:text-primary transition-colors font-semibold p-0 font-secondary">
                Sign in
              </Button>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
