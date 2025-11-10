import React from 'react';
import { MapPin, Calendar, IndianRupee, MessageSquare, Heart, Star, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface UserCardProps {
  user: {
    id: string;
    user_id?: string;
    name: string;
    age: string;
    location: string;
    occupation: string;
    company: string;
    bio: string;
    budget: string;
    move_in_date: string;
    room_type: string;
    lifestyle: string[];
    interests: string[];
    profile_photo: string;
    created_at: string;
  };
  onMessage?: (userId: string) => void;
  onLike?: (userId: string) => void;
  onProfileClick?: (userId: string) => void;
}

export function UserCard({ user, onMessage, onLike, onProfileClick }: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={user.profile_photo || undefined} 
                alt={user.name} 
              />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 
                  className={`font-semibold text-lg ${onProfileClick ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
                  onClick={(e) => {
                    if (onProfileClick) {
                      e.stopPropagation();
                      const userId = user.user_id || user.id;
                      onProfileClick(userId);
                    }
                  }}
                >
                  {user.name}
                </h3>
                {user.age && (
                  <span className="text-sm text-muted-foreground">, {user.age}</span>
                )}
              </div>
              
              {user.occupation && (
                <p className="text-sm text-muted-foreground">
                  {user.occupation}
                  {user.company && ` at ${user.company}`}
                </p>
              )}
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{user.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLike?.(user.id)}
              className="p-2"
            >
              <Heart className="h-4 w-4" />
            </Button>
            {onProfileClick && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  const userId = user.user_id || user.id;
                  onProfileClick(userId);
                }}
                className="p-2"
                title="View Profile"
              >
                <User className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => onMessage?.(user.id)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {user.bio}
          </p>
        )}
        
        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {user.budget && (
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-green-600" />
              <span>{user.budget}/month</span>
            </div>
          )}
          
          {user.move_in_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Available {formatDate(user.move_in_date)}</span>
            </div>
          )}
          
          {user.room_type && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-600" />
              <span>{user.room_type}</span>
            </div>
          )}
        </div>
        
        {/* Lifestyle Tags */}
        {user.lifestyle && user.lifestyle.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Lifestyle</h4>
            <div className="flex flex-wrap gap-1">
              {user.lifestyle.slice(0, 5).map((trait) => (
                <Badge key={trait} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
              {user.lifestyle.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{user.lifestyle.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Interests</h4>
            <div className="flex flex-wrap gap-1">
              {user.interests.slice(0, 4).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {user.interests.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{user.interests.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Member Since */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Member since {formatDate(user.created_at)}
        </div>
        
        {/* View Profile Button */}
        {onProfileClick && (
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                const userId = user.user_id || user.id;
                onProfileClick(userId);
              }}
            >
              <User className="h-4 w-4" />
              View Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
