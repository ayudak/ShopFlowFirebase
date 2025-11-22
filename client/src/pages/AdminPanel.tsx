import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { LicenseType } from '@shared/schema';
import { FirebaseService } from '@/lib/firebaseService';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UserWithLicense {
  id: string;
  email: string;
  license: LicenseType;
  licenseId?: string;
  expiryDate?: string;
  isActive: boolean;
}

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const { data: usersData = [], isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      try {
        const [users, userLicenses] = await Promise.all([
          FirebaseService.getAllUsers(),
          FirebaseService.getAllUserLicenses(),
        ]);

        const usersWithLicenses: UserWithLicense[] = users.map((user) => {
          const userLicenseData = userLicenses.find((ul) => ul.userId === user.id);
          const activeLicense = userLicenseData?.licenses.find((l) => l.isActive);
          const license = activeLicense || userLicenseData?.licenses[0];

          return {
            id: user.id,
            email: user.email,
            license: license?.type || 'None',
            licenseId: license?.id,
            expiryDate: license?.expiryDate,
            isActive: license?.isActive || false,
          };
        });

        return usersWithLicenses;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
      }
    },
  });

  const updateLicenseMutation = useMutation({
    mutationFn: async ({ userId, licenseId, newLicense }: { userId: string; licenseId?: string; newLicense: LicenseType }) => {
      if (licenseId) {
        await FirebaseService.updateLicense(userId, licenseId, {
          type: newLicense,
          isActive: newLicense !== 'None',
        });
      } else {
        await FirebaseService.createLicense(userId, {
          type: newLicense,
          isActive: newLicense !== 'None',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'License Updated',
        description: 'User license has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update license',
        variant: 'destructive',
      });
    },
  });

  const updateExpiryMutation = useMutation({
    mutationFn: async ({ userId, licenseId, newDate }: { userId: string; licenseId: string; newDate: string }) => {
      await FirebaseService.updateLicense(userId, licenseId, {
        expiryDate: newDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Expiry Updated',
        description: 'License expiry date has been updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update expiry date',
        variant: 'destructive',
      });
    },
  });

  const revokeLicenseMutation = useMutation({
    mutationFn: async ({ userId, licenseId }: { userId: string; licenseId: string }) => {
      await FirebaseService.updateLicense(userId, licenseId, {
        type: 'None',
        isActive: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'License Revoked',
        description: 'User license has been revoked',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Revoke Failed',
        description: error.message || 'Failed to revoke license',
        variant: 'destructive',
      });
    },
  });

  const updateLicense = (userId: string, licenseId: string | undefined, newLicense: LicenseType) => {
    updateLicenseMutation.mutate({ userId, licenseId, newLicense });
  };

  const updateExpiry = (userId: string, licenseId: string | undefined, newDate: string) => {
    if (!licenseId) return;
    updateExpiryMutation.mutate({ userId, licenseId, newDate });
  };

  const revokeLicense = (userId: string, licenseId: string | undefined) => {
    if (!licenseId) return;
    revokeLicenseMutation.mutate({ userId, licenseId });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <Card className="p-8 md:p-12 text-center space-y-6">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold">Admin Access Required</h1>
            <p className="text-lg text-muted-foreground">
              This section is only accessible to administrators.
            </p>
            <Button onClick={() => window.location.href = '/'} data-testid="button-go-home">
              Go to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold" data-testid="text-admin-headline">Admin Panel</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage user licenses and subscriptions
          </p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="table-users">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">User Email</th>
                  <th className="text-left p-4 font-semibold">License Status</th>
                  <th className="text-left p-4 font-semibold">License Type</th>
                  <th className="text-left p-4 font-semibold">Expiry Date</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  usersData.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b last:border-0 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                      data-testid={`row-user-${user.id}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Select
                          value={user.license}
                          onValueChange={(value) => updateLicense(user.id, user.licenseId, value as LicenseType)}
                        >
                          <SelectTrigger className="w-[180px]" data-testid={`select-license-${user.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent data-testid={`select-content-license-${user.id}`}>
                            <SelectItem value="None" data-testid={`select-item-none-${user.id}`}>None</SelectItem>
                            <SelectItem value="Trial" data-testid={`select-item-trial-${user.id}`}>Trial</SelectItem>
                            <SelectItem value="Small Business" data-testid={`select-item-small-business-${user.id}`}>Small Business</SelectItem>
                            <SelectItem value="Enterprise" data-testid={`select-item-enterprise-${user.id}`}>Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <Input
                            type="date"
                            value={user.expiryDate || ''}
                            onChange={(e) => updateExpiry(user.id, user.licenseId, e.target.value)}
                            className="w-[160px]"
                            disabled={user.license === 'None'}
                            data-testid={`input-expiry-${user.id}`}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => revokeLicense(user.id, user.licenseId)}
                          disabled={user.license === 'None'}
                          data-testid={`button-revoke-${user.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">{usersData.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Licenses</p>
            <p className="text-3xl font-bold">{usersData.filter(u => u.isActive).length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Enterprise Plans</p>
            <p className="text-3xl font-bold">{usersData.filter(u => u.license === 'Enterprise').length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Trial Users</p>
            <p className="text-3xl font-bold">{usersData.filter(u => u.license === 'Trial').length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
