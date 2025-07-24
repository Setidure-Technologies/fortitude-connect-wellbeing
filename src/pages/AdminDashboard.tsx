
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
import ArticleManager from '@/components/admin/ArticleManager';
import SupportGroupManager from '@/components/admin/SupportGroupManager';
import NGOManager from '@/components/admin/NGOManager';
import EventPublisher from '@/components/EventPublisher';
import { SecurityEventsMonitor } from '@/components/admin/SecurityEventsMonitor';
import { AuthSecuritySettings } from '@/components/admin/AuthSecuritySettings';
import SecurityAuditLog from '@/components/admin/SecurityAuditLog';

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
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="users" className="flex items-center gap-1 text-xs lg:text-sm">
            <Users className="h-3 w-3 lg:h-4 lg:w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-1 text-xs lg:text-sm">
            <BookOpen className="h-3 w-3 lg:h-4 lg:w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-1 text-xs lg:text-sm">
            <Users className="h-3 w-3 lg:h-4 lg:w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="ngos" className="flex items-center gap-1 text-xs lg:text-sm">
            <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
            NGOs
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1 text-xs lg:text-sm">
            <BookOpen className="h-3 w-3 lg:h-4 lg:w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1 text-xs lg:text-sm">
            <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1 text-xs lg:text-sm">
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 text-xs lg:text-sm">
            <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-1 text-xs lg:text-sm">
            <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
            Setup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserRoleManager />
        </TabsContent>

        <TabsContent value="articles">
          <ArticleManager />
        </TabsContent>

        <TabsContent value="groups">
          <SupportGroupManager />
        </TabsContent>

        <TabsContent value="ngos">
          <NGOManager />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceManager />
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>
                Create and manage platform events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventPublisher />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <StatsManager />
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <AuthSecuritySettings />
            <div className="grid gap-6 md:grid-cols-2">
              <SecurityEventsMonitor />
              <SecurityAuditLog />
            </div>
          </div>
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
