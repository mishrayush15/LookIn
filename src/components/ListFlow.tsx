import React, { useState, useEffect } from 'react';
import { Plus, Home, ArrowLeft, Eye, Edit, Trash2, Users, TrendingUp, MessageSquare, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CreateRoomListing } from './CreateRoomListing';
import { useAuth } from '../context/AuthProvider';

interface RoomListing {
  id: string;
  title: string;
  rent: number;
  deposit: number;
  room_type: string;
  available_from: string;
  amenities: string[];
  flatmate_preferences: string[];
  image_urls: string[];
  is_active: boolean;
  views: number;
  inquiries: number;
  created_at: string;
}

interface ListFlowProps {
  selectedCity: string;
  cityName: string;
  onBack: () => void;
}

export function ListFlow({ selectedCity, cityName, onBack }: ListFlowProps) {
  const { user, getRoomListings, deleteRoomListing, updateRoomListing } = useAuth();
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [roomListings, setRoomListings] = useState<RoomListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's room listings
  useEffect(() => {
    const loadListings = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await getRoomListings(user.id);
        if (result.error) {
          setError(result.error.message);
        } else {
          setRoomListings(result.data || []);
        }
      } catch (err) {
        setError('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [user, getRoomListings]);

  const handleCreateListing = async (newListing: any) => {
    // Reload listings after creating
    const result = await getRoomListings(user?.id);
    if (result.data) {
      setRoomListings(result.data || []);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    const result = await deleteRoomListing(listingId);
    if (result && 'error' in result) {
      setError(result.error.message);
      return;
    }
    
    // Remove from local state
    setRoomListings(prev => prev.filter(listing => listing.id !== listingId));
  };

  const toggleListingStatus = async (listingId: string) => {
    const listing = roomListings.find(l => l.id === listingId);
    if (!listing) return;
    
    const result = await updateRoomListing(listingId, { isActive: !listing.is_active });
    if (result && 'error' in result) {
      setError(result.error.message);
      return;
    }
    
    // Update local state
    setRoomListings(prev =>
      prev.map(listing =>
        listing.id === listingId
          ? { ...listing, is_active: !listing.is_active }
          : listing
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium">List Your Room</h1>
          <p className="text-muted-foreground">
            Find the perfect flatmate for your room in {cityName}
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateListing(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Listing
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-medium text-blue-600">{roomListings.length}</div>
            <div className="text-sm text-muted-foreground">Total Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-medium text-green-600">
              {roomListings.filter(l => l.is_active).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-medium text-purple-600">
              {roomListings.reduce((sum, listing) => sum + listing.views, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-medium text-orange-600">
              {roomListings.reduce((sum, listing) => sum + listing.inquiries, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Inquiries</div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Management */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your listings...</p>
          </CardContent>
        </Card>
      ) : roomListings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Home className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-medium mb-4">No room listings yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first room listing to start finding the perfect flatmate for your space in {cityName}
            </p>
            <Button onClick={() => setShowCreateListing(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Your Room Listings</h2>
            <div className="text-sm text-muted-foreground">
              {roomListings.filter(l => l.is_active).length} active • {roomListings.filter(l => !l.is_active).length} inactive
            </div>
          </div>

          <div className="space-y-4">
            {roomListings.map((listing) => (
              <Card key={listing.id} className={`transition-all ${listing.is_active ? '' : 'opacity-60'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        {listing.image_urls && listing.image_urls.length > 0 ? (
                          <ImageWithFallback
                            src={listing.image_urls[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Home className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{listing.title}</h3>
                              <Badge variant={listing.is_active ? "default" : "secondary"}>
                                {listing.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {listing.room_type} • Available from {new Date(listing.available_from).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{listing.views}</div>
                              <div className="text-xs text-muted-foreground">Views</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                              <MessageSquare className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">{listing.inquiries}</div>
                              <div className="text-xs text-muted-foreground">Inquiries</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">₹{listing.rent.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">per month</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium">₹{listing.deposit.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">deposit</div>
                            </div>
                          </div>
                        </div>
                        
                        {listing.amenities && listing.amenities.length > 0 && (
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
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleListingStatus(listing.id)}
                      >
                        {listing.is_active ? 'Deactivate' : 'Activate'}
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
        </div>
      )}

      {/* Tips Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Boost Your Listing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Add Quality Photos</div>
                  <div className="text-muted-foreground">Listings with photos get 3x more views</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Detailed Description</div>
                  <div className="text-muted-foreground">Include room features and house rules</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Quick Responses</div>
                  <div className="text-muted-foreground">Reply to inquiries within 24 hours</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Meet in Public First</div>
                  <div className="text-muted-foreground">Initial meetings should be in public spaces</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Verify Identity</div>
                  <div className="text-muted-foreground">Check IDs and employment verification</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Trust Your Instincts</div>
                  <div className="text-muted-foreground">Report any suspicious behavior immediately</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Room Listing Dialog */}
      <CreateRoomListing
        open={showCreateListing}
        onOpenChange={setShowCreateListing}
        onSubmit={handleCreateListing}
        cityId={selectedCity}
        cityName={cityName}
      />
    </div>
  );
}