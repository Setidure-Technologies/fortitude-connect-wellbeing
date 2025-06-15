
import React from 'react';
import ProfileForm from '@/components/ProfileForm';

const Profile = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and profile information</p>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
};

export default Profile;
