import React, { useState } from 'react';
import { Search, MapPin, Filter, Heart, Share2, Bed, Bath, Wifi, Car, PawPrint, Utensils } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Property {
  id: string;
  title: string;
  location: string;
  rent: number;
  deposit: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  availableFrom: string;
  images: string[];
  amenities: string[];
  description: string;
  ownerName: string;
  isVerified: boolean;
  preferences: string[];
}

// Mock data - replace with real data later
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Spacious 2BHK in Koramangala',
    location: 'Koramangala, Bangalore',
    rent: 35000,
    deposit: 70000,
    type: '2BHK',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    availableFrom: '2024-02-01',
    images: ['/placeholder-apartment.jpg'],
    amenities: ['WiFi', 'Parking', 'Gym', 'Security'],
    description: 'Beautiful apartment in the heart of Koramangala with all modern amenities.',
    ownerName: 'Priya Sharma',
    isVerified: true,
    preferences: ['Working Professionals', 'No Smoking']
  },
  {
    id: '2',
    title: 'Modern Studio near IT Hub',
    location: 'Electronic City, Bangalore',
    rent: 18000,
    deposit: 36000,
    type: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    availableFrom: '2024-01-15',
    images: ['/placeholder-studio.jpg'],
    amenities: ['WiFi', 'AC', 'Kitchen', 'Security'],
    description: 'Fully furnished studio apartment perfect for young professionals.',
    ownerName: 'Raj Patel',
    isVerified: true,
    preferences: ['IT Professionals', 'Vegetarian']
  }
];

export function FindPlaces() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([10000, 100000]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>(mockProperties);

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'pets', label: 'Pet Friendly', icon: PawPrint },
    { id: 'kitchen', label: 'Kitchen', icon: Utensils },
    { id: 'gym', label: 'Gym', icon: null },
    { id: 'security', label: '24/7 Security', icon: null }
  ];

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = property.rent >= priceRange[0] && property.rent <= priceRange[1];
    const matchesType = !selectedType || property.type === selectedType;
    const matchesAmenities = selectedAmenities.length === 0 || 
                           selectedAmenities.every(amenity => 
                             property.amenities.some(propAmenity => 
                               propAmenity.toLowerCase().includes(amenity.toLowerCase())
                             )
                           );
    
    return matchesSearch && matchesPrice && matchesType && matchesAmenities;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-medium">Find Your Perfect Place</h1>
        <p className="text-muted-foreground">
          Discover verified properties that match your lifestyle and budget
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, landmark, or property name..."
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

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Budget Range</label>
                  <div className="space-y-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100000}
                      min={5000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Property Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="1BHK">1BHK</SelectItem>
                      <SelectItem value="2BHK">2BHK</SelectItem>
                      <SelectItem value="3BHK">3BHK</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={() => handleAmenityToggle(amenity.id)}
                        />
                        <label
                          htmlFor={amenity.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {amenity.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">
            {filteredProperties.length} Properties Available
          </h2>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <ImageWithFallback
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {property.isVerified && (
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium line-clamp-1">{property.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-3 w-3" />
                        {property.bathrooms}
                      </div>
                      <span>{property.area} sq ft</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <div className="font-medium">₹{property.rent.toLocaleString()}/month</div>
                        <div className="text-xs text-muted-foreground">
                          ₹{property.deposit.toLocaleString()} deposit
                        </div>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}