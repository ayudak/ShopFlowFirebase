import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordChangeSchema, type PasswordChange } from '@shared/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user, userProfile, userLicense, updatePassword } = useAuth();
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<PasswordChange>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChange) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      form.reset();
      setIsChangingPassword(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <Card className="p-8 md:p-12 text-center space-y-6">
            <User className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold">Dashboard Access</h1>
            <p className="text-lg text-muted-foreground">
              Please sign in to view your dashboard.
            </p>
            <Link href="/signin">
              <Button data-testid="button-signin">Sign In</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const getLicenseStatusColor = () => {
    if (!userLicense || !userLicense.isActive || userLicense.type === 'None') {
      return 'destructive';
    }
    if (userLicense.type === 'Trial') {
      return 'outline';
    }
    return 'default';
  };

  const getLicenseStatusText = () => {
    if (!userLicense || !userLicense.isActive || userLicense.type === 'None') {
      return 'No Active License';
    }
    return userLicense.type;
  };

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold" data-testid="text-dashboard-headline">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account and subscription
          </p>
        </div>

        {/* Profile Section */}
        <Card className="p-6 md:p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Profile Information</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="font-medium" data-testid="text-user-email">{userProfile?.email || user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <Badge variant="secondary">{userProfile?.role || 'user'}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* License Status */}
        <Card className="p-6 md:p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-4 flex-1">
              <h2 className="text-2xl font-semibold">Subscription Status</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Current Plan:</span>
                  <Badge variant={getLicenseStatusColor()} data-testid="badge-license-status">
                    {getLicenseStatusText()}
                  </Badge>
                </div>
                {userLicense?.expiryDate && userLicense.isActive && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Expires: {new Date(userLicense.expiryDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
              {(!userLicense || !userLicense.isActive || userLicense.type === 'None') && (
                <Link href="/pricing">
                  <Button data-testid="button-upgrade">Upgrade to Premium</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>

        {/* Password Change */}
        <Card className="p-6 md:p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-4 flex-1">
              <h2 className="text-2xl font-semibold">Security</h2>
              
              {!isChangingPassword ? (
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(true)}
                  data-testid="button-change-password"
                >
                  Change Password
                </Button>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter current password"
                              {...field}
                              data-testid="input-current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              {...field}
                              data-testid="input-new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                              data-testid="input-confirm-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3">
                      <Button type="submit" data-testid="button-save-password">
                        Save Password
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsChangingPassword(false);
                          form.reset();
                        }}
                        data-testid="button-cancel-password"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
