import React, { useState } from 'react';
import { Search, Filter, Users, Home, MapPin, Star, Verified, Heart, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
    avatar: '/placeholder-avatar-1.jpg',
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
    avatar: '/placeholder-avatar-2.jpg',
    isVerified: true,
    rating: 4.6,
    lookingFor: 'Male flatmate for shared apartment',
    description: 'Tech professional looking for a friendly flatmate.',
    availableFrom: '2024-01-15'
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
    images: ['/placeholder-room-1.jpg'],
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
    images: ['/placeholder-room-2.jpg'],
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

interface UnifiedBrowseProps {
  selectedCity: string;
  cityName: string;
}

export function UnifiedBrowse({ selectedCity, cityName }: UnifiedBrowseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('flatmates');
  const [showFilters, setShowFilters] = useState(false);
  const [flatmates] = useState<Flatmate[]>(mockFlatmates);
  const [roomListings] = useState<RoomListing[]>(mockRoomListings);

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
        <div>
          <h1 className="text-3xl font-medium">Find in {cityName}</h1>
          <p className="text-muted-foreground">
            Discover compatible flatmates and available rooms in {cityName}
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Change City
        </Button>
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
            Find Flatmates ({filteredFlatmates.length})
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Find Rooms ({filteredRoomListings.length})
          </TabsTrigger>
        </TabsList>

        {/* Flatmates Tab */}
        <TabsContent value="flatmates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Available Flatmates</h2>
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

          {filteredFlatmates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No flatmates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlatmates.map((flatmate) => (
                <Card key={flatmate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <ImageWithFallback
                            src={flatmate.avatar}
                            alt={flatmate.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {flatmate.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                              <Verified className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{flatmate.name}</h3>
                          <p className="text-sm text-muted-foreground">{flatmate.age} years • {flatmate.profession}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{flatmate.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {flatmate.location}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Budget: </span>
                          ₹{flatmate.budget.toLocaleString()}/month
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Looking for: </span>
                          {flatmate.lookingFor}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Preferences:</div>
                        <div className="flex flex-wrap gap-1">
                          {flatmate.preferences.slice(0, 2).map((pref) => (
                            <Badge key={pref} variant="secondary" className="text-xs">
                              {pref}
                            </Badge>
                          ))}
                          {flatmate.preferences.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{flatmate.preferences.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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