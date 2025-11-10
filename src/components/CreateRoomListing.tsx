import React, { useState } from 'react';
import { Upload, MapPin, IndianRupee, Home, Users, Plus, X, Camera, Wifi, Car, PawPrint, Utensils, Shield, Dumbbell, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useAuth } from '../context/AuthProvider';

interface RoomListingForm {
  title: string;
  description: string;
  roomType: string;
  rent: string;
  deposit: string;
  availableFrom: string;
  amenities: string[];
  flatmatePreferences: string[];
  houseRules: string[];
  images: File[];
}

const initialForm: RoomListingForm = {
  title: '',
  description: '',
  roomType: '',
  rent: '',
  deposit: '',
  availableFrom: '',
  amenities: [],
  flatmatePreferences: [],
  houseRules: [],
  images: []
};

interface CreateRoomListingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (listing: any) => void;
  cityId?: string;
  cityName?: string;
}

export function CreateRoomListing({ open, onOpenChange, onSubmit, cityId, cityName }: CreateRoomListingProps) {
  const { createRoomListing } = useAuth();
  const [form, setForm] = useState<RoomListingForm>(initialForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amenityOptions = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'security', label: '24/7 Security', icon: Shield },
    { id: 'kitchen', label: 'Kitchen Access', icon: Utensils },
    { id: 'balcony', label: 'Balcony', icon: null },
    { id: 'ac', label: 'Air Conditioning', icon: null },
    { id: 'washing-machine', label: 'Washing Machine', icon: null },
    { id: 'fridge', label: 'Refrigerator', icon: null },
    { id: 'furnished', label: 'Furnished', icon: null }
  ];

  const preferenceOptions = [
    'Working Professionals Only',
    'Students Welcome',
    'IT Professionals',
    'Female Flatmate Preferred',
    'Male Flatmate Preferred',
    'Vegetarian Only',
    'Non-smoker',
    'No Drinking',
    'Pet Friendly',
    'Social Person',
    'Quiet Person',
    'No Overnight Guests'
  ];

  const handleInputChange = (field: keyof RoomListingForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'amenities' | 'flatmatePreferences' | 'houseRules', value: string) => {
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

  // Convert File objects to base64 data URLs
  const convertImagesToUrls = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(promises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Convert images to base64 URLs
      const imageUrls = await convertImagesToUrls(form.images);

      // Prepare listing data
      const listingData = {
        cityId: cityId || '',
        cityName: cityName || '',
        title: form.title,
        description: form.description,
        roomType: form.roomType,
        rent: form.rent,
        deposit: form.deposit,
        availableFrom: form.availableFrom,
        amenities: form.amenities,
        flatmatePreferences: form.flatmatePreferences,
        houseRules: form.houseRules,
        imageUrls: imageUrls,
        isActive: true,
      };

      // Save to database
      const result = await createRoomListing(listingData);
      
      if (result && 'error' in result) {
        setError(result.error.message);
        setSaving(false);
        return;
      }

      // Call onSubmit callback with the created listing
      if (result.data) {
        onSubmit({
          ...result.data,
          id: result.data.id,
          rent: parseInt(form.rent),
          deposit: parseInt(form.deposit),
          roomType: form.roomType,
          availableFrom: form.availableFrom,
          amenities: form.amenities,
          preferences: form.flatmatePreferences,
          images: imageUrls,
          isActive: true,
          views: 0,
          inquiries: 0,
        });
      }

      // Reset form
      setForm(initialForm);
      setCurrentStep(1);
      onOpenChange(false);
    } catch (err) {
      setError('Failed to create listing. Please try again.');
      console.error('Error creating listing:', err);
    } finally {
      setSaving(false);
    }
  };

  const totalSteps = 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            List Your Room for Flatmate
          </DialogTitle>
          <DialogDescription>
            Create a detailed listing to find the perfect flatmate for your available room.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
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

        <form onSubmit={handleSubmit}>
          {/* Step 1: Room Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Room Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Listing Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Spacious Room in Modern 2BHK near IT Hub"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Room Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your room, the apartment, and what you're looking for in a flatmate..."
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <Select value={form.roomType} onValueChange={(value) => handleInputChange('roomType', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private-room">Private Room</SelectItem>
                        <SelectItem value="master-bedroom">Master Bedroom</SelectItem>
                        <SelectItem value="shared-room">Shared Room</SelectItem>
                        <SelectItem value="studio-share">Studio Share</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input
                      id="availableFrom"
                      type="date"
                      value={form.availableFrom}
                      onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rent">Monthly Rent (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="rent"
                        type="number"
                        placeholder="15000"
                        className="pl-10"
                        value={form.rent}
                        onChange={(e) => handleInputChange('rent', e.target.value)}
                        required
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
                        placeholder="30000"
                        className="pl-10"
                        value={form.deposit}
                        onChange={(e) => handleInputChange('deposit', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Amenities & Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Amenities & Flatmate Preferences</h3>
                
                <div>
                  <Label className="text-base font-medium">Available Amenities</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select amenities available in your apartment
                  </p>
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

                <div>
                  <Label className="text-base font-medium">Flatmate Preferences</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select your preferences for an ideal flatmate
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {preferenceOptions.map((preference) => (
                      <div key={preference} className="flex items-center space-x-2">
                        <Checkbox
                          id={preference}
                          checked={form.flatmatePreferences.includes(preference)}
                          onCheckedChange={() => handleArrayToggle('flatmatePreferences', preference)}
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
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Room Photos</h3>
                <p className="text-muted-foreground">
                  Add photos of your room and common areas to attract potential flatmates
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
                  <h4 className="font-medium mb-2">Upload Room Photos</h4>
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
                            alt={`Room photo ${index + 1}`}
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

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Photo Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take photos during daylight for better quality</li>
                    <li>• Include photos of the room, common areas, and any amenities</li>
                    <li>• Show the view from windows if it's appealing</li>
                    <li>• The first photo will be used as the main listing image</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || saving}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={saving}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="flex items-center gap-2" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Listing
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}