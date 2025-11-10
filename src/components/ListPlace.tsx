import React, { useState } from 'react';
import { Upload, MapPin, IndianRupee, Home, Users, Plus, X, Camera, Wifi, Car, PawPrint, Utensils, Shield, Dumbbell } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface ListingForm {
  title: string;
  description: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  rent: string;
  deposit: string;
  address: string;
  city: string;
  locality: string;
  availableFrom: string;
  leasePeriod: string;
  furnishingStatus: string;
  amenities: string[];
  preferences: string[];
  rules: string[];
  images: File[];
}

const initialForm: ListingForm = {
  title: '',
  description: '',
  propertyType: '',
  bedrooms: '',
  bathrooms: '',
  area: '',
  rent: '',
  deposit: '',
  address: '',
  city: '',
  locality: '',
  availableFrom: '',
  leasePeriod: '',
  furnishingStatus: '',
  amenities: [],
  preferences: [],
  rules: [],
  images: []
};

export function ListPlace() {
  const [form, setForm] = useState<ListingForm>(initialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'kitchen', label: 'Modular Kitchen', icon: Utensils },
    { id: 'pets', label: 'Pet Friendly', icon: PawPrint },
    { id: 'balcony', label: 'Balcony', icon: null },
    { id: 'ac', label: 'Air Conditioning', icon: null },
    { id: 'elevator', label: 'Elevator', icon: null },
    { id: 'power-backup', label: 'Power Backup', icon: null }
  ];

  const preferenceOptions = [
    'Working Professionals',
    'Students',
    'IT Professionals',
    'Vegetarian Only',
    'No Smoking',
    'No Drinking',
    'Family Preferred',
    'Bachelors Welcome'
  ];

  const handleInputChange = (field: keyof ListingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'amenities' | 'preferences' | 'rules', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files).slice(0, 10 - form.images.length);
      setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    // Here you would send the data to your backend
  };

  const totalSteps = 4;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-medium">List Your Property</h1>
        <p className="text-muted-foreground">
          Find the perfect flatmate for your space
        </p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      i + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Spacious 2BHK in Koramangala"
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, neighborhood, and what makes it special..."
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={form.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1bhk">1BHK</SelectItem>
                      <SelectItem value="2bhk">2BHK</SelectItem>
                      <SelectItem value="3bhk">3BHK</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="pg">PG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Furnishing Status</Label>
                  <Select value={form.furnishingStatus} onValueChange={(value) => handleInputChange('furnishingStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select value={form.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select value={form.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft)</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="1200"
                    value={form.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location & Pricing */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={form.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locality">Locality</Label>
                  <Input
                    id="locality"
                    placeholder="e.g., Koramangala, HSR Layout"
                    value={form.locality}
                    onChange={(e) => handleInputChange('locality', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address..."
                  value={form.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rent"
                      type="number"
                      placeholder="25000"
                      className="pl-10"
                      value={form.rent}
                      onChange={(e) => handleInputChange('rent', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="50000"
                      className="pl-10"
                      value={form.deposit}
                      onChange={(e) => handleInputChange('deposit', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={form.availableFrom}
                    onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lease Period</Label>
                  <Select value={form.leasePeriod} onValueChange={(value) => handleInputChange('leasePeriod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="11months">11 Months</SelectItem>
                      <SelectItem value="12months">12 Months</SelectItem>
                      <SelectItem value="24months">24 Months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Amenities & Preferences */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Amenities & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Available Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenityOptions.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={form.amenities.includes(amenity.id)}
                        onCheckedChange={() => handleArrayToggle('amenities', amenity.id)}
                      />
                      <label
                        htmlFor={amenity.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        {amenity.icon && <amenity.icon className="h-4 w-4" />}
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Preferred Tenant Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {preferenceOptions.map((preference) => (
                    <div key={preference} className="flex items-center space-x-2">
                      <Checkbox
                        id={preference}
                        checked={form.preferences.includes(preference)}
                        onCheckedChange={() => handleArrayToggle('preferences', preference)}
                      />
                      <label
                        htmlFor={preference}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {preference}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">House Rules (Optional)</h3>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add any specific house rules or guidelines..."
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Example: No parties after 10 PM, Keep common areas clean, etc.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Photos */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Property Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Add high-quality photos to attract more potential flatmates. You can upload up to 10 images.
                </p>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Upload Photos</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop photos here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>

                {/* Image Preview */}
                {form.images.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Uploaded Photos ({form.images.length}/10)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {form.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2" variant="secondary">
                              Cover Photo
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Photo Tips:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Take photos during daylight for better quality</li>
                  <li>• Include photos of all rooms, kitchen, and bathroom</li>
                  <li>• Show common areas and any unique features</li>
                  <li>• The first photo will be used as the cover photo</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              List Property
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}