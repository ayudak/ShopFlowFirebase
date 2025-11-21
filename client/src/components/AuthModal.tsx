import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Mail, Lock, Chrome } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, signInSchema, type SignUp, type SignIn } from '@shared/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LegalModal } from '@/components/LegalModal';

interface AuthModalProps {
  mode: 'signin' | 'signup';
}

export function AuthModal({ mode }: AuthModalProps) {
  const [, navigate] = useLocation();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const signInForm = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      agreedToTerms: false,
    },
  });

  const onSignIn = async (data: SignIn) => {
    try {
      await signIn(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onSignUp = async (data: SignUp) => {
    try {
      await signUp(data.email, data.password);
      toast({
        title: 'Account Created!',
        description: 'Welcome to ShopFlow. Your account has been created successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Google sign-in failed. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen py-16 md:py-24 flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid={`text-${mode}-headline`}>
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'signin'
                ? 'Sign in to access your dashboard'
                : 'Get started with ShopFlow today'}
            </p>
          </div>

          {mode === 'signin' ? (
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-6">
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10"
                            {...field}
                            data-testid="input-signin-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
                            {...field}
                            data-testid="input-signin-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" data-testid="button-signin-submit">
                  Sign In
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-6">
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10"
                            {...field}
                            data-testid="input-signup-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Create a password (min 6 characters)"
                            className="pl-10"
                            {...field}
                            data-testid="input-signup-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signUpForm.control}
                  name="agreedToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-agree-terms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the{' '}
                          <button
                            type="button"
                            onClick={() => setShowPrivacy(true)}
                            className="text-primary hover:underline"
                            data-testid="button-show-privacy"
                          >
                            Privacy Policy
                          </button>{' '}
                          and{' '}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-primary hover:underline"
                            data-testid="button-show-terms"
                          >
                            Terms of Service
                          </button>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" data-testid="button-signup-submit">
                  Create Account
                </Button>
              </form>
            </Form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            data-testid="button-google-signin"
          >
            <Chrome className="w-4 h-4 mr-2" />
            Google
          </Button>

          <div className="mt-6 text-center text-sm">
            {mode === 'signin' ? (
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-primary hover:underline font-medium"
                  data-testid="link-to-signup"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/signin')}
                  className="text-primary hover:underline font-medium"
                  data-testid="link-to-signin"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>

      <LegalModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        type="privacy"
      />
      <LegalModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        type="terms"
      />
    </div>
  );
}
