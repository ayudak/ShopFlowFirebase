import { useState } from 'react';
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
import { Shield, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import type { LicenseType } from '@shared/schema';

export default function AdminPanel() {
  const { isAdmin } = useAuth();

  // Mock users data (will be replaced with Firestore in Task 2)
  const [users, setUsers] = useState([
    {
      id: '1',
      email: 'rajesh@example.com',
      license: 'Small Business' as LicenseType,
      expiryDate: '2025-12-31',
      isActive: true,
    },
    {
      id: '2',
      email: 'priya@example.com',
      license: 'Enterprise' as LicenseType,
      expiryDate: '2025-11-30',
      isActive: true,
    },
    {
      id: '3',
      email: 'amit@example.com',
      license: 'Trial' as LicenseType,
      expiryDate: '2025-02-15',
      isActive: true,
    },
    {
      id: '4',
      email: 'test@example.com',
      license: 'None' as LicenseType,
      expiryDate: undefined,
      isActive: false,
    },
  ]);

  const updateLicense = (userId: string, newLicense: LicenseType) => {
    // Will be implemented with Firestore in Task 2
    setUsers(users.map(u => u.id === userId ? { ...u, license: newLicense, isActive: newLicense !== 'None' } : u));
    console.log('Updating license for user:', userId, newLicense);
  };

  const updateExpiry = (userId: string, newDate: string) => {
    // Will be implemented with Firestore in Task 2
    setUsers(users.map(u => u.id === userId ? { ...u, expiryDate: newDate } : u));
    console.log('Updating expiry for user:', userId, newDate);
  };

  const revokeLicense = (userId: string) => {
    // Will be implemented with Firestore in Task 2
    setUsers(users.map(u => u.id === userId ? { ...u, license: 'None', isActive: false } : u));
    console.log('Revoking license for user:', userId);
  };

  const getLicenseBadgeVariant = (license: LicenseType) => {
    switch (license) {
      case 'Enterprise':
        return 'default';
      case 'Small Business':
        return 'secondary';
      case 'Trial':
        return 'outline';
      default:
        return 'destructive';
    }
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
            <Link href="/">
              <Button data-testid="button-go-home">Go to Home</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold" data-testid="text-admin-headline">Admin Panel</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage user licenses and subscriptions
          </p>
        </div>

        {/* Users Table */}
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
                {users.map((user, index) => (
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
                        onValueChange={(value) => updateLicense(user.id, value as LicenseType)}
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
                          onChange={(e) => updateExpiry(user.id, e.target.value)}
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
                        onClick={() => revokeLicense(user.id)}
                        disabled={user.license === 'None'}
                        data-testid={`button-revoke-${user.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Active Licenses</p>
            <p className="text-3xl font-bold">{users.filter(u => u.isActive).length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Enterprise Plans</p>
            <p className="text-3xl font-bold">{users.filter(u => u.license === 'Enterprise').length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Trial Users</p>
            <p className="text-3xl font-bold">{users.filter(u => u.license === 'Trial').length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
