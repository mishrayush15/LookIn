import React from 'react';
import { Search, Plus, Users, Home, ArrowRight, MapPin, TrendingUp, Shield, Clock, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface PurposeSelectorProps {
  cityName: string;
  onPurposeSelect: (purpose: 'find' | 'list') => void;
  onBack?: () => void;
}

export function PurposeSelector({ cityName, onPurposeSelect, onBack }: PurposeSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      {onBack && (
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 pl-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to City Selection
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-medium">{cityName}</h1>
        </div>
        <h2 className="text-xl text-muted-foreground">What would you like to do?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your goal and we'll show you the most relevant options in {cityName}
        </p>
      </div>

      {/* Purpose Selection Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Find a Place */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20" onClick={() => onPurposeSelect('find')}>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Find a Place</CardTitle>
            <p className="text-muted-foreground">
              Looking for a room or flatmate in {cityName}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Find Compatible Flatmates</div>
                  <div className="text-sm text-muted-foreground">Browse verified profiles and find your perfect roommate match</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Home className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Discover Available Rooms</div>
                  <div className="text-sm text-muted-foreground">Explore rooms listed by current tenants looking for flatmates</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Safe & Verified</div>
                  <div className="text-sm text-muted-foreground">All users are verified for a secure experience</div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="text-sm font-medium mb-2">What you can do:</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Browse flatmate profiles by compatibility</div>
                <div>• Search available rooms with current tenants</div>
                <div>• Filter by budget, location, and preferences</div>
                <div>• Message potential flatmates securely</div>
              </div>
            </div>

            <Button className="w-full">
              Start Finding
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* List a Place */}
        <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 hover:border-primary/20" onClick={() => onPurposeSelect('list')}>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-accent text-accent-foreground border-accent">
              <Clock className="h-3 w-3 mr-1" />
              Quick Setup
            </Badge>
          </div>
          
          <CardHeader className="pb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/80 transition-colors">
              <Plus className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-xl">List a Place</CardTitle>
            <p className="text-muted-foreground">
              You have a room and need a flatmate
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-accent-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Find Your Ideal Flatmate</div>
                  <div className="text-sm text-muted-foreground">Set preferences and attract compatible roommates</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Home className="h-5 w-5 text-accent-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Easy Room Listing</div>
                  <div className="text-sm text-muted-foreground">Simple 3-step process to list your available room</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-accent-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Verified Inquiries</div>
                  <div className="text-sm text-muted-foreground">Only receive messages from verified users</div>
                </div>
              </div>
            </div>

            <div className="bg-accent/30 rounded-lg p-4 border border-accent">
              <div className="text-sm font-medium mb-2">What you can do:</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• List your room with photos and details</div>
                <div>• Set flatmate preferences and house rules</div>
                <div>• Review potential flatmate applications</div>
                <div>• Chat with interested and verified users</div>
              </div>
            </div>

            <Button className="w-full">
              List Your Room
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="font-medium mb-2">LOOK.IN in {cityName}</h3>
          <p className="text-sm text-muted-foreground">Join thousands of verified users finding their perfect flatmate</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-medium">15k+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-medium">2.5k+</div>
            <div className="text-sm text-muted-foreground">Successful Matches</div>
          </div>
          <div>
            <div className="text-2xl font-medium">4.8★</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-medium">95%</div>
            <div className="text-sm text-muted-foreground">Verification Rate</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="font-medium mb-2">Not sure which option to choose?</h3>
          <p className="text-muted-foreground mb-4">
            If you're looking for a place to live or someone to share with, choose "Find a Place". 
            If you already have a room and need a flatmate, choose "List a Place".
          </p>
          <Button variant="outline">Learn More</Button>
        </CardContent>
      </Card>
    </div>
  );
}