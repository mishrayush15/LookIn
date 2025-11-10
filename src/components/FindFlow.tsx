import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Home, MapPin, Star, Verified, Heart, MessageSquare, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { UserCard } from './UserCard';
import { useAuth } from '../context/AuthProvider';

interface Flatmate {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  budget: number;
  preferences: string[];
  interests: string[];
  avatar: string;
  isVerified: boolean;
  rating: number;
  lookingFor: string;
  description: string;
  availableFrom: string;
}

interface RoomListing {
  id: string;
  title: string;
  location: string;
  rent: number;
  deposit: number;
  type: string;
  area: number;
  availableFrom: string;
  images: string[];
  amenities: string[];
  postedBy: string;
  isVerified: boolean;
  flatmateProfile: {
    name: string;
    age: number;
    profession: string;
    preferences: string[];
  };
}

// Mock data for flatmates
const mockFlatmates: Flatmate[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 26,
    profession: 'Software Engineer',
    location: 'Koramangala, Bangalore',
    budget: 18000,
    preferences: ['Non-smoker', 'Vegetarian', 'Working Professional'],
    interests: ['Reading', 'Yoga', 'Cooking'],
    avatar: 'https://images.unsplash.com/photo-1661436170168-7ce82d649532?w=80&h=80&fit=crop&crop=face&auto=format&q=60',
    isVerified: true,
    rating: 4.8,
    lookingFor: 'Female flatmate for 2BHK',
    description: 'Looking for a like-minded flatmate to share a cozy 2BHK apartment.',
    availableFrom: '2024-02-01'
  },
  {
    id: '2',
    name: 'Raj Patel',
    age: 24,
    profession: 'Product Manager',
    location: 'HSR Layout, Bangalore',
    budget: 22000,
    preferences: ['Pet-friendly', 'Social', 'Gym enthusiast'],
    interests: ['Gaming', 'Fitness', 'Movies'],
    avatar: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=80&h=80&fit=crop&crop=face&auto=format&q=60',
    isVerified: true,
    rating: 4.6,
    lookingFor: 'Male flatmate for shared apartment',
    description: 'Tech professional looking for a friendly flatmate.',
    availableFrom: '2024-01-15'
  },
  {
    id: '3',
    name: 'Aisha Khan',
    age: 23,
    profession: 'UX Designer',
    location: 'Indiranagar, Bangalore',
    budget: 16000,
    preferences: ['Creative', 'Social', 'Non-smoker'],
    interests: ['Art', 'Music', 'Travel'],
    avatar: 'https://images.unsplash.com/photo-1758685848208-e108b6af94cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBjb2xsZWdlJTIwc3R1ZGVudCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTk2MzMzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    isVerified: true,
    rating: 4.9,
    lookingFor: 'Creative female flatmate',
    description: 'Designer looking for someone who appreciates art and good conversation.',
    availableFrom: '2024-01-25'
  },
  {
    id: '4',
    name: 'Arjun Singh',
    age: 27,
    profession: 'Data Scientist',
    location: 'Whitefield, Bangalore',
    budget: 19000,
    preferences: ['Tech-savvy', 'Quiet', 'Working Professional'],
    interests: ['Tech', 'Books', 'Chess'],
    avatar: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=80&h=80&fit=crop&crop=face&auto=format&q=60',
    isVerified: true,
    rating: 4.7,
    lookingFor: 'Like-minded professional flatmate',
    description: 'Data scientist seeking a quiet, professional flatmate for shared living.',
    availableFrom: '2024-02-10'
  }
];

// Mock data for room listings
const mockRoomListings: RoomListing[] = [
  {
    id: '1',
    title: 'Spacious Room in 3BHK with Techie Flatmate',
    location: 'Electronic City, Bangalore',
    rent: 15000,
    deposit: 30000,
    type: 'Private Room',
    area: 1200,
    availableFrom: '2024-02-01',
    images: ['https://images.unsplash.com/photo-1662454419622-a41092ecd245?w=400&h=240&fit=crop&crop=entropy&auto=format&q=60'],
    amenities: ['WiFi', 'AC', 'Parking', 'Kitchen'],
    postedBy: 'Ankit Kumar',
    isVerified: true,
    flatmateProfile: {
      name: 'Ankit Kumar',
      age: 28,
      profession: 'Software Engineer',
      preferences: ['Working Professional', 'Vegetarian', 'No Parties']
    }
  },
  {
    id: '2',
    title: 'Furnished Room in Modern 2BHK',
    location: 'Koramangala, Bangalore',
    rent: 20000,
    deposit: 40000,
    type: 'Private Room',
    area: 800,
    availableFrom: '2024-01-20',
    images: ['https://images.unsplash.com/photo-1680503146476-abb8c752e1f4?w=400&h=240&fit=crop&crop=entropy&auto=format&q=60'],
    amenities: ['WiFi', 'Gym', 'Security', 'Balcony'],
    postedBy: 'Sneha Reddy',
    isVerified: true,
    flatmateProfile: {
      name: 'Sneha Reddy',
      age: 25,
      profession: 'Marketing Manager',
      preferences: ['Female Flatmate', 'Pet Friendly', 'Social']
    }
  }
];

interface FindFlowProps {
  selectedCity?: string;
  cityName?: string;
  onBack: () => void;
}

export function FindFlow({ selectedCity, cityName, onBack }: FindFlowProps) {
  const { getUsersByLocation, getProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('flatmates');
  const [showFilters, setShowFilters] = useState(false);
  const [flatmates] = useState<Flatmate[]>(mockFlatmates);
  const [roomListings] = useState<RoomListing[]>(mockRoomListings);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');

  // Load user's location and fetch matching users
  useEffect(() => {
    const loadUserLocationAndUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let targetLocation = '';
        let locationName = '';
        
        // If city is selected via city selector, use that
        if (selectedCity && cityName) {
          targetLocation = cityName;
          locationName = cityName;
        } else {
          // Otherwise, get current user's profile location
          const profileResult = await getProfile();
          if (profileResult.data && profileResult.data.location) {
            targetLocation = profileResult.data.location;
            locationName = profileResult.data.location;
          } else {
            setError('Please complete your profile with location information to find flatmates');
            setLoading(false);
            return;
          }
        }
        
        setUserLocation(locationName);
        
        // Fetch users with the same location
        const usersResult = await getUsersByLocation(targetLocation);
        if (usersResult.error) {
          setError(usersResult.error.message);
        } else {
          setUsers(usersResult.data || []);
        }
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUserLocationAndUsers();
  }, [getProfile, getUsersByLocation, selectedCity, cityName]);

  const handleRefresh = async () => {
    if (userLocation) {
      setLoading(true);
      setError(null);
      
      try {
        const usersResult = await getUsersByLocation(userLocation);
        if (usersResult.error) {
          setError(usersResult.error.message);
        } else {
          setUsers(usersResult.data || []);
        }
      } catch (err) {
        setError('Failed to refresh users');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMessage = (userId: string) => {
    const event = new CustomEvent('start-conversation', { detail: { userId } });
    window.dispatchEvent(event);
  };

  const handleLike = (userId: string) => {
    console.log('Like user:', userId);
  };

  const handleViewProfile = (userId: string) => {
    // Bubble the event up via a custom event; App will listen by reading a setter from window, or we pass via context
    // Simpler: dispatch a CustomEvent and handle it in App? For now, we can use a global callback if present.
    const event = new CustomEvent('open-public-profile', { detail: { userId } });
    window.dispatchEvent(event);
  };

  const filteredFlatmates = flatmates.filter(flatmate =>
    flatmate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flatmate.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flatmate.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoomListings = roomListings.filter(room =>
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.postedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-medium">Find in {cityName}</h1>
            <p className="text-muted-foreground">
              Discover compatible flatmates and available rooms in {cityName}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, profession..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browse Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flatmates" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Find Flatmates ({users.length})
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Find Rooms ({filteredRoomListings.length})
          </TabsTrigger>
        </TabsList>

        {/* Flatmates Tab */}
        <TabsContent value="flatmates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium">Available Flatmates</h2>
              {userLocation && (
                <p className="text-sm text-muted-foreground">
                  Showing users in {userLocation}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                  <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-red-600 mb-2">⚠️</div>
                  <h3 className="text-lg font-medium mb-2">Error Loading Users</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={handleRefresh} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && !error && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <h3 className="text-lg font-medium mb-2">Loading Flatmates...</h3>
                <p className="text-muted-foreground">
                  Finding users in your location
                </p>
              </CardContent>
            </Card>
          )}

          {/* No Users Found */}
          {!loading && !error && users.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No flatmates found</h3>
                <p className="text-muted-foreground mb-4">
                  {userLocation 
                    ? `No users found in ${userLocation}. Try checking back later or expanding your search.`
                    : 'Please complete your profile with location information to find flatmates.'
                  }
                </p>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Users Grid */}
          {!loading && !error && users.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.id}>
                  <UserCard
                    user={user}
                    onMessage={handleMessage}
                    onLike={handleLike}
                    onProfileClick={handleViewProfile}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Rooms Tab */}
        <TabsContent value="rooms" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Available Rooms</h2>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="rent-low">Rent: Low to High</SelectItem>
                <SelectItem value="rent-high">Rent: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredRoomListings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoomListings.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <ImageWithFallback
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    {room.isVerified && (
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium line-clamp-2">{room.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {room.location}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 4).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>

                      <div className="bg-muted rounded-lg p-3 space-y-2">
                        <div className="text-sm font-medium">Your Flatmate:</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{room.flatmateProfile.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {room.flatmateProfile.age} years • {room.flatmateProfile.profession}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.flatmateProfile.preferences.slice(0, 2).map((pref) => (
                            <Badge key={pref} variant="secondary" className="text-xs">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <div>
                          <div className="font-medium">₹{room.rent.toLocaleString()}/month</div>
                          <div className="text-xs text-muted-foreground">
                            ₹{room.deposit.toLocaleString()} deposit
                          </div>
                        </div>
                        <Button size="sm">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}