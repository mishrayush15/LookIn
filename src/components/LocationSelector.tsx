import React, { useState } from 'react';
import { MapPin, Search, ArrowRight, Building2, Users, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bangaloreImage from 'figma:asset/a66dd3acc225eed71162d46309de818a4f2ff89b.png';

interface City {
  id: string;
  name: string;
  state: string;
  activeRoommates: number;
  avgRent: number;
  popularAreas: string[];
  image: string;
}

const popularCities: City[] = [
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    activeRoommates: 15420,
    avgRent: 18000,
    popularAreas: ['Koramangala', 'HSR Layout', 'Electronic City', 'Whitefield'],
    image: bangaloreImage
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    activeRoommates: 22150,
    avgRent: 25000,
    popularAreas: ['Andheri', 'Bandra', 'Powai', 'Thane'],
    image: 'https://images.unsplash.com/photo-1638796323753-e2dcac2e4eb9?w=400&h=240&fit=crop&crop=entropy&auto=format&q=60'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    activeRoommates: 18750,
    avgRent: 20000,
    popularAreas: ['Gurgaon', 'Noida', 'CP', 'Dwarka'],
    image: 'https://images.unsplash.com/photo-1705861145502-dc882ea96cbe?w=400&h=240&fit=crop&crop=entropy&auto=format&q=60'
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    activeRoommates: 12300,
    avgRent: 15000,
    popularAreas: ['Hinjewadi', 'Kothrud', 'Viman Nagar', 'Wakad'],
    image: 'https://images.unsplash.com/photo-1709483480913-76f18a9ef6f5?w=400&h=240&fit=crop&crop=entropy&auto=format&q=60'
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    activeRoommates: 9850,
    avgRent: 14000,
    popularAreas: ['Gachibowli', 'Hitech City', 'Kondapur', 'Manikonda'],
    image: 'https://images.unsplash.com/photo-1663745352553-b74529d4a7f9?w=400&h=240&fit=crop&crop=entropy&auto=format&q=60'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    activeRoommates: 8920,
    avgRent: 16000,
    popularAreas: ['OMR', 'T. Nagar', 'Velachery', 'Anna Nagar'],
    image: 'https://images.unsplash.com/photo-1717310686662-d1d0ca8427ff?w=400&h=240&fit=crop&crop=entropy&auto=format&q=60'
  }
];

interface LocationSelectorProps {
  onLocationSelect: (cityId: string, cityName: string) => void;
  onBack?: () => void;
}

export function LocationSelector({ onLocationSelect, onBack }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState(popularCities);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCities(popularCities);
    } else {
      const filtered = popularCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.state.toLowerCase().includes(query.toLowerCase()) ||
        city.popularAreas.some(area => area.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredCities(filtered);
    }
  };

  return (
    <div className="space-y-8">
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

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <MapPin className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-medium">Choose Your City</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select your city to find compatible roommates and available rooms in your area. 
          LOOK.IN connects you with verified flatmates in your preferred location.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for your city or area..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Popular Cities */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Popular Cities</h2>
          <p className="text-muted-foreground">
            Cities with the most active roommate seekers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <Card 
              key={city.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onLocationSelect(city.id, city.name)}
            >
              <div className="relative h-40 bg-muted">
                <ImageWithFallback
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-900">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">{city.state}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">{city.activeRoommates.toLocaleString()}</div>
                        <div className="text-muted-foreground text-xs">Active users</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">₹{city.avgRent.toLocaleString()}</div>
                        <div className="text-muted-foreground text-xs">Avg. rent</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Popular Areas:</div>
                    <div className="flex flex-wrap gap-1">
                      {city.popularAreas.slice(0, 3).map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {city.popularAreas.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{city.popularAreas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Select {city.name}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No cities found</h3>
              <p className="text-muted-foreground">
                Try searching for a different city or check back later as we expand to more locations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coming Soon */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <h3 className="font-medium mb-2">Don't see your city?</h3>
          <p className="text-muted-foreground mb-4">
            We're constantly expanding to new cities. Let us know where you'd like to see LOOK.IN next!
          </p>
          <Button variant="outline">Request New City</Button>
        </CardContent>
      </Card>
    </div>
  );
}