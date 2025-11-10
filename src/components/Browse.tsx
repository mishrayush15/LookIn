import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Heart, MessageSquare, Shield, Star, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Flatmate {
  id: string;
  name: string;
  age: number;
  photo: string;
  location: string;
  budget: number;
  occupation: string;
  lifestyle: string[];
  compatibility: number;
  verified: boolean;
  bio: string;
  moveInDate: string;
  roomType: string;
}

export function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlatmate, setSelectedFlatmate] = useState<Flatmate | null>(null);
  const [filters, setFilters] = useState({
    minBudget: 400,
    maxBudget: 2000,
    location: '',
    lifestyle: [] as string[],
    occupation: '',
    verifiedOnly: true
  });

  const mockFlatmates: Flatmate[] = [];

  const lifestyleOptions = ['Clean', 'Quiet', 'Social', 'Non-smoker', 'Pet-friendly', 'Gym-goer', 'Organized', 'Early riser', 'Night owl'];

  const handleLifestyleToggle = (lifestyle: string) => {
    setFilters(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(lifestyle)
        ? prev.lifestyle.filter(l => l !== lifestyle)
        : [...prev.lifestyle, lifestyle]
    }));
  };

  const filteredFlatmates = mockFlatmates.filter(flatmate => {
    if (searchTerm && !flatmate.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !flatmate.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (flatmate.budget < filters.minBudget || flatmate.budget > filters.maxBudget) {
      return false;
    }
    if (filters.location && !flatmate.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.verifiedOnly && !flatmate.verified) {
      return false;
    }
    if (filters.lifestyle.length > 0 && !filters.lifestyle.some(l => flatmate.lifestyle.includes(l))) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              {/* Budget Range */}
              <div className="space-y-3">
                <Label>Budget Range (£/month)</Label>
                <div className="px-2">
                  <Slider
                    value={[filters.minBudget, filters.maxBudget]}
                    onValueChange={([min, max]) => setFilters(prev => ({ ...prev, minBudget: min, maxBudget: max }))}
                    min={200}
                    max={3000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>£{filters.minBudget}</span>
                    <span>£{filters.maxBudget}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any location</SelectItem>
                    <SelectItem value="central">Central London</SelectItem>
                    <SelectItem value="east">East London</SelectItem>
                    <SelectItem value="west">West London</SelectItem>
                    <SelectItem value="south">South London</SelectItem>
                    <SelectItem value="north">North London</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lifestyle Preferences */}
              <div className="space-y-3">
                <Label>Lifestyle Preferences</Label>
                <div className="grid grid-cols-2 gap-2">
                  {lifestyleOptions.map((lifestyle) => (
                    <div key={lifestyle} className="flex items-center space-x-2">
                      <Checkbox
                        id={lifestyle}
                        checked={filters.lifestyle.includes(lifestyle)}
                        onCheckedChange={() => handleLifestyleToggle(lifestyle)}
                      />
                      <Label htmlFor={lifestyle} className="text-sm">
                        {lifestyle}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verifiedOnly: !!checked }))}
                />
                <Label htmlFor="verified">Verified users only</Label>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredFlatmates.length} flatmate{filteredFlatmates.length !== 1 ? 's' : ''} found
        </p>
        <Select defaultValue="compatibility">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compatibility">Best Match</SelectItem>
            <SelectItem value="budget-low">Lowest Budget</SelectItem>
            <SelectItem value="budget-high">Highest Budget</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Flatmate Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFlatmates.map((flatmate) => (
          <Card key={flatmate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <ImageWithFallback
                src={flatmate.photo}
                alt={flatmate.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                {flatmate.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {flatmate.compatibility}% match
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{flatmate.name}, {flatmate.age}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {flatmate.location}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    £{flatmate.budget}/mo
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {flatmate.moveInDate}
                  </span>
                </div>

                <p className="text-sm">{flatmate.occupation}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{flatmate.bio}</p>

                <div className="flex flex-wrap gap-1">
                  {flatmate.lifestyle.slice(0, 3).map((trait) => (
                    <Badge key={trait} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                  {flatmate.lifestyle.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{flatmate.lifestyle.length - 3} more
                    </Badge>
                  )}
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => setSelectedFlatmate(flatmate)}
                  >
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="px-3">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFlatmates.length === 0 && (
        <div className="text-center py-16">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-medium mb-3">
            Welcome to LOOK<span className="text-primary">.</span>IN!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're a brand new platform launching soon. Be the first to create your profile and connect with compatible flatmates.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✨ Complete your profile to get started</p>
            <p>🔐 Get verified for maximum safety</p>
            <p>🏠 Start finding your perfect flatmate match</p>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {selectedFlatmate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-4"
                onClick={() => setSelectedFlatmate(null)}
              >
                ✕
              </Button>
              <div className="flex items-start gap-4">
                <ImageWithFallback
                  src={selectedFlatmate.photo}
                  alt={selectedFlatmate.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle>{selectedFlatmate.name}, {selectedFlatmate.age}</CardTitle>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedFlatmate.location}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {selectedFlatmate.compatibility}% compatibility
                    </Badge>
                    {selectedFlatmate.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-muted-foreground">{selectedFlatmate.bio}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Occupation:</span>
                      <span>{selectedFlatmate.occupation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span>£{selectedFlatmate.budget}/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Move-in date:</span>
                      <span>{selectedFlatmate.moveInDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room type:</span>
                      <span>{selectedFlatmate.roomType}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Lifestyle</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedFlatmate.lifestyle.map((trait) => (
                      <Badge key={trait} variant="outline">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}