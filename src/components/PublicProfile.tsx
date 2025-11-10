import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, MapPin, Calendar, IndianRupee, Shield, MessageSquare, User, Phone, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '../context/AuthProvider';

interface PublicProfileProps {
  userId: string;
  onBack: () => void;
  onMessage?: (userId: string) => void;
}

export function PublicProfile({ userId, onBack, onMessage }: PublicProfileProps) {
  const { getProfileByUserId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      const result = await getProfileByUserId(userId);
      if (!mounted) return;
      if (result.error) setError(result.error.message);
      else setProfile(result.data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [userId, getProfileByUserId]);

  const getInitials = (name?: string) => (name || 'U')
    .split(' ')
    .map(s => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <h3 className="text-lg font-medium mb-2">Unable to load profile</h3>
            <p className="text-muted-foreground mb-4">{error || 'Profile not found'}</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profile_photo || undefined} alt={profile.name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{profile.name || 'User'}</h1>
                {profile.age && (
                  <span className="text-lg text-muted-foreground">, {profile.age} years</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.location}</span>
                )}
                {profile.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> 
                    {profile.occupation}
                    {profile.company && ` at ${profile.company}`}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="text-sm text-muted-foreground max-w-2xl mt-2">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {profile.age && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium">{profile.age} years</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Room Preferences Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Room Preferences</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {profile.budget && (
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{profile.budget}/month</span>
                </div>
              )}
              {profile.move_in_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-muted-foreground">Available from:</span>
                  <span className="font-medium">
                    {new Date(profile.move_in_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {profile.room_type && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Room type:</span>
                  <span className="font-medium">{profile.room_type}</span>
                </div>
              )}
            </div>
          </div>

          {profile.lifestyle && profile.lifestyle.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Lifestyle</h3>
              <div className="flex flex-wrap gap-1">
                {profile.lifestyle.map((t: string) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Interests</h3>
              <div className="flex flex-wrap gap-1">
                {profile.interests.map((t: string) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button onClick={() => onMessage?.(profile.user_id)} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


