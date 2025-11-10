import React, { useState, useEffect } from 'react';
import { Camera, Edit, Save, Shield, Star, MapPin, IndianRupee, Calendar, Plus, Home, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CreateRoomListing } from './CreateRoomListing';
import { useAuth } from '../context/AuthProvider';

interface RoomListing {
  id: string;
  title: string;
  rent: number;
  deposit: number;
  roomType: string;
  availableFrom: string;
  amenities: string[];
  preferences: string[];
  images: string[];
  isActive: boolean;
  views: number;
  inquiries: number;
  createdAt: string;
}

interface ProfileProps {
  onBack?: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user, getProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomListings, setRoomListings] = useState<RoomListing[]>([
    {
      id: '1',
      title: 'Spacious Room in Modern 2BHK',
      rent: 18000,
      deposit: 36000,
      roomType: 'Private Room',
      availableFrom: '2024-03-15',
      amenities: ['WiFi', 'AC', 'Parking', 'Study Table', 'Attached Bathroom'],
      preferences: ['Student', 'Non-smoker', 'Quiet'],
      images: ['https://images.unsplash.com/photo-1639751907353-3629fc00d2b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwcm9vbXxlbnwxfHx8fDE3NTk2MzMwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
      isActive: true,
      views: 127,
      inquiries: 23,
      createdAt: '2024-01-15'
    }
  ]);

  // Get user's display name from metadata or email
  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.user_metadata?.preferred_username ||
                     user?.email?.split('@')[0] || 
                     'User';

  // Get user's avatar from OAuth providers
  const avatarUrl = user?.user_metadata?.avatar_url || 
                   user?.user_metadata?.picture || 
                   null;

  // Get user's provider (google, github, email)
  const provider = user?.app_metadata?.provider || 'email';

  // Format provider name for display
  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google';
      case 'github': return 'GitHub';
      case 'email': return 'Email';
      default: return 'Email';
    }
  };

  // Format join date
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const [profile, setProfile] = useState({
    name: displayName,
    age: '',
    email: user?.email || '',
    phone: '',
    location: '',
    occupation: '',
    company: '',
    bio: '',
    budget: '',
    moveInDate: '',
    roomType: 'Single room',
    lifestyle: [] as string[],
    interests: [] as string[],
    profilePhoto: avatarUrl || ''
  });

  // Load profile data from database
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await getProfile();
        if (result.error) {
          setError(result.error.message);
        } else if (result.data) {
          // Merge database data with current profile state
          setProfile(prev => ({
            ...prev,
            name: result.data.name || displayName,
            age: result.data.age || '',
            phone: result.data.phone || '',
            location: result.data.location || '',
            occupation: result.data.occupation || '',
            company: result.data.company || '',
            bio: result.data.bio || '',
            budget: result.data.budget || '',
            moveInDate: result.data.move_in_date || '',
            roomType: result.data.room_type || 'Single room',
            lifestyle: result.data.lifestyle || [],
            interests: result.data.interests || [],
            profilePhoto: result.data.profile_photo || avatarUrl || ''
          }));
        }
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, displayName, avatarUrl, getProfile]);

  const lifestyleOptions = ['Clean', 'Quiet', 'Social', 'Non-smoker', 'Pet-friendly', 'Gym-goer', 'Organized', 'Early riser', 'Night owl', 'Vegetarian', 'Vegan'];
  const interestOptions = ['Cooking', 'Reading', 'Netflix', 'Gaming', 'Sports', 'Yoga', 'Travel', 'Music', 'Art', 'Photography', 'Dancing', 'Hiking'];

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const profileData = {
        name: profile.name,
        age: profile.age,
        phone: profile.phone,
        location: profile.location,
        occupation: profile.occupation,
        company: profile.company,
        bio: profile.bio,
        budget: profile.budget,
        move_in_date: profile.moveInDate,
        room_type: profile.roomType,
        lifestyle: profile.lifestyle,
        interests: profile.interests,
        profile_photo: profile.profilePhoto
      };
      
      const result = await updateProfile(profileData);
      if (result && 'error' in result) {
        setError(result.error.message);
        return;
      }
      
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile data');
    } finally {
      setSaving(false);
    }
  };

  const handleLifestyleToggle = (lifestyle: string) => {
    setProfile(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(lifestyle)
        ? prev.lifestyle.filter(l => l !== lifestyle)
        : [...prev.lifestyle, lifestyle]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleCreateListing = (newListing: RoomListing) => {
    setRoomListings(prev => [...prev, newListing]);
  };

  const handleDeleteListing = (listingId: string) => {
    setRoomListings(prev => prev.filter(listing => listing.id !== listingId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      {onBack && (
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 pl-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading profile...</span>
        </div>
      )}

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="relative">
                {profile.profilePhoto ? (
                  <ImageWithFallback
                    src={profile.profilePhoto}
                    alt={profile.name || 'Profile'}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {isEditing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 rounded-full p-2"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{profile.name || 'Complete Your Profile'}</h1>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    {getProviderName(provider)} Account
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
                {joinDate && (
                  <p className="text-sm text-muted-foreground">Member since {joinDate}</p>
                )}
                {profile.location && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </p>
                )}
                {profile.occupation && (
                  <p className="text-muted-foreground">{profile.occupation}{profile.company && ` at ${profile.company}`}</p>
                )}
                {(profile.budget || profile.moveInDate) && (
                  <div className="flex items-center gap-4 text-sm">
                    {profile.budget && (
                      <span className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {profile.budget}/month
                      </span>
                    )}
                    {profile.moveInDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Available {profile.moveInDate}
                      </span>
                    )}
                  </div>
                )}
                {!profile.location && !profile.occupation && (
                  <p className="text-muted-foreground">
                    Start by adding your basic information to create your flatmate profile.
                  </p>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="room-listings">My Listings</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled={true}
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed. It's linked to your {getProviderName(provider)} account.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={profile.occupation}
                    onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell potential flatmates about yourself..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Housing Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Budget (£)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={profile.budget}
                    onChange={(e) => setProfile(prev => ({ ...prev, budget: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                  <Input
                    id="moveInDate"
                    value={profile.moveInDate}
                    onChange={(e) => setProfile(prev => ({ ...prev, moveInDate: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type Preference</Label>
                <Select 
                  value={profile.roomType} 
                  onValueChange={(value) => setProfile(prev => ({ ...prev, roomType: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single room">Single room</SelectItem>
                    <SelectItem value="Double room">Double room</SelectItem>
                    <SelectItem value="Master bedroom">Master bedroom with ensuite</SelectItem>
                    <SelectItem value="Studio">Studio apartment</SelectItem>
                    <SelectItem value="House share">House share</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Lifestyle Traits</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select traits that describe your lifestyle and living preferences.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {lifestyleOptions.map((lifestyle) => (
                    <div key={lifestyle} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lifestyle-${lifestyle}`}
                        checked={profile.lifestyle.includes(lifestyle)}
                        onCheckedChange={() => handleLifestyleToggle(lifestyle)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={`lifestyle-${lifestyle}`} className="text-sm">
                        {lifestyle}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Interests & Hobbies</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Share your interests to help find compatible flatmates.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={profile.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={`interest-${interest}`} className="text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="room-listings" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium">My Room Listings</h2>
              <p className="text-muted-foreground">
                List your available room to find compatible flatmates
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateListing(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              List My Room
            </Button>
          </div>

          {roomListings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No room listings yet</h3>
                <p className="text-muted-foreground mb-4">
                  List your available room to start finding compatible flatmates
                </p>
                <Button onClick={() => setShowCreateListing(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {roomListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          {listing.images[0] ? (
                            <ImageWithFallback
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Home className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{listing.title}</h3>
                            <Badge variant={listing.isActive ? "default" : "secondary"}>
                              {listing.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">₹{listing.rent.toLocaleString()}</span>
                              <span className="text-muted-foreground">/month</span>
                            </div>
                            <div>
                              <span className="font-medium">{listing.views}</span>
                              <span className="text-muted-foreground"> views</span>
                            </div>
                            <div>
                              <span className="font-medium">{listing.inquiries}</span>
                              <span className="text-muted-foreground"> inquiries</span>
                            </div>
                            <div className="text-muted-foreground">
                              Available from {listing.availableFrom}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {listing.amenities.slice(0, 3).map((amenity) => (
                              <Badge key={amenity} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {listing.amenities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{listing.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-medium">{roomListings.length}</div>
                <div className="text-sm text-muted-foreground">Active Listings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-medium">
                  {roomListings.reduce((sum, listing) => sum + listing.views, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-medium">
                  {roomListings.reduce((sum, listing) => sum + listing.inquiries, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Inquiries</div>
              </CardContent>
            </Card>
          </div>

          {/* Tips for Better Listings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Better Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Increase Visibility:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Add high-quality photos</li>
                    <li>• Write detailed descriptions</li>
                    <li>• Update availability regularly</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Attract Good Flatmates:</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Be clear about house rules</li>
                    <li>• Specify your lifestyle preferences</li>
                    <li>• Respond quickly to inquiries</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Identity Verification</h4>
                      <p className="text-sm text-muted-foreground">Verify with government ID</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Start Verification
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.email_confirmed_at ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      <Shield className={`h-5 w-5 ${user?.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Verification</h4>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <Badge variant={user?.email_confirmed_at ? "default" : "secondary"} className={user?.email_confirmed_at ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {user?.email_confirmed_at ? 'Verified' : 'Pending'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Employment Verification</h4>
                      <p className="text-sm text-muted-foreground">Verify your employment status</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Verify
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Credit Check</h4>
                      <p className="text-sm text-muted-foreground">Optional credit verification</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Start Check
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Why verify your account?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Build trust with potential flatmates</li>
                  <li>• Stand out in a new platform</li>
                  <li>• Access advanced safety features</li>
                  <li>• Get priority support</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Example Student Profiles Section */}
      <Card>
        <CardHeader>
          <CardTitle>Connect with Fellow Students</CardTitle>
          <p className="text-muted-foreground">
            See how other students in your city are using LOOK.IN to find compatible flatmates
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example Profile 1 */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1631131432044-eb897a9eb666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBzbWlsaW5nfGVufDF8fHx8MTc1OTYzMzAwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Priya Sharma"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">Priya Sharma</h4>
                  <p className="text-sm text-muted-foreground">MBA Student, 23</p>
                </div>
              </div>
              <p className="text-sm">Looking for a female flatmate near Whitefield. Love cooking and yoga!</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">Clean</Badge>
                <Badge variant="outline" className="text-xs">Vegetarian</Badge>
                <Badge variant="outline" className="text-xs">Yoga</Badge>
              </div>
            </div>

            {/* Example Profile 2 */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1708578200684-3aa944b73237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGNhc3VhbHxlbnwxfHx8fDE3NTk2MzMwMDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Rahul Patel"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">Rahul Patel</h4>
                  <p className="text-sm text-muted-foreground">Engineering Student, 21</p>
                </div>
              </div>
              <p className="text-sm">Tech enthusiast seeking roommate in Koramangala. Love gaming and hackathons.</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">Gaming</Badge>
                <Badge variant="outline" className="text-xs">Tech</Badge>
                <Badge variant="outline" className="text-xs">Social</Badge>
              </div>
            </div>

            {/* Example Profile 3 */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1594686900103-3c9698dbb31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMGhhcHB5fGVufDF8fHx8MTc1OTYxNjY3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Design Student, 22</p>
                </div>
              </div>
              <p className="text-sm">Art and design lover looking for creative flatmate in Indiranagar area.</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">Art</Badge>
                <Badge variant="outline" className="text-xs">Creative</Badge>
                <Badge variant="outline" className="text-xs">Music</Badge>
              </div>
            </div>

            {/* Example Profile 4 */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1568880893176-fb2bdab44e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwcHJvZmlsZSUyMHBob3RvfGVufDF8fHx8MTc1OTU4MDQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Amit Kumar"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">Amit Kumar</h4>
                  <p className="text-sm text-muted-foreground">Medical Student, 24</p>
                </div>
              </div>
              <p className="text-sm">Medical student seeking quiet study partner near HSR Layout.</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">Quiet</Badge>
                <Badge variant="outline" className="text-xs">Studious</Badge>
                <Badge variant="outline" className="text-xs">Non-smoker</Badge>
              </div>
            </div>

            {/* Example Profile 5 */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1709811240710-cff5f04deb44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwZ2lybCUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk2MzMxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Zara Ali"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">Zara Ali</h4>
                  <p className="text-sm text-muted-foreground">Literature Student, 20</p>
                </div>
              </div>
              <p className="text-sm">Book lover and writer seeking intellectual conversation partner.</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-xs">Reading</Badge>
                <Badge variant="outline" className="text-xs">Writing</Badge>
                <Badge variant="outline" className="text-xs">Coffee</Badge>
              </div>
            </div>

            {/* Call to action placeholder */}
            <div className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">Join the Community</h4>
                <p className="text-sm text-muted-foreground">Complete your profile to connect with students like these</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Room Listing Dialog */}
      <CreateRoomListing
        open={showCreateListing}
        onOpenChange={setShowCreateListing}
        onSubmit={handleCreateListing}
      />
    </div>
  );
}