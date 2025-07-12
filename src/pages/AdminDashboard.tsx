
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Calendar, BarChart3, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserRoleManager from '@/components/UserRoleManager';
import AdminSetup from '@/components/AdminSetup';
import RoleDebugPanel from '@/components/RoleDebugPanel';
import ResourceManager from '@/components/admin/ResourceManager';
import StatsManager from '@/components/admin/StatsManager';

const AdminDashboard = () => {
  const { user, userRole, loading, refreshUserData } = useAuth();

  // Show loading state while checking permissions
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Check role from multiple sources with fallback
  const isAdmin = userRole === 'admin' || user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-slate-600">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Manage users, events, and platform settings</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserRoleManager />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceManager />
        </TabsContent>

        <TabsContent value="stats">
          <StatsManager />
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>
                Manage platform events and registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Event management interface coming in next phase...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                View platform usage statistics and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Analytics dashboard coming in next phase...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Admin Setup</CardTitle>
              <CardDescription>
                Add new admin users and configure platform settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSetup />
              <RoleDebugPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
