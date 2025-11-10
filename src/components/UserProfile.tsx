import React from 'react';
import { ArrowLeft, Mail, User, Calendar, Shield, MapPin, Edit, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '../context/AuthProvider';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No user data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get user's display name from metadata or email
  const displayName = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.user_metadata?.preferred_username ||
                     user.email?.split('@')[0] || 
                     'User';

  // Get user's avatar from OAuth providers
  const avatarUrl = user.user_metadata?.avatar_url || 
                   user.user_metadata?.picture || 
                   null;

  // Get user's provider (google, github, email)
  const provider = user.app_metadata?.provider || 'email';

  // Format provider name for display
  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google';
      case 'github': return 'GitHub';
      case 'email': return 'Email';
      default: return 'Email';
    }
  };

  // Get provider color
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google': return 'bg-red-100 text-red-800 border-red-200';
      case 'github': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'email': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Format join date
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get initials for fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account settings</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Name and Email */}
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold">{displayName}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  {/* Provider Badge */}
                  <Badge 
                    variant="outline" 
                    className={`${getProviderColor(provider)} border`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {getProviderName(provider)}
                  </Badge>

                  {/* Edit Profile Button */}
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-sm">{displayName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                    <Badge variant="outline" className={getProviderColor(provider)}>
                      {getProviderName(provider)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <p className="text-sm">{joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-sm text-muted-foreground">Your email address is confirmed</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Verified
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Preferred Location</label>
                    <p className="text-sm">Not set</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Notification Settings</label>
                    <p className="text-sm">Email notifications enabled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <User className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
