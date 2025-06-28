import React from 'react';
import AdminSetup from '@/components/AdminSetup';

const AdminSetupPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Setup</h1>
        <p className="text-slate-600">
          Promote users to admin role to manage the platform
        </p>
      </div>
      <AdminSetup />
    </div>
  );
};

export default AdminSetupPage;