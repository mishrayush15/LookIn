import React, { useEffect, useState } from 'react';
import { Home, Users, MessageSquare, User, Shield, Search, MapPin } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Landing, type LandingProps } from './components/Landing';
import { Profile } from './components/Profile';
import { Messages } from './components/Messages';
import { Safety } from './components/Safety';
import { LocationSelector } from './components/LocationSelector';
import { PurposeSelector } from './components/PurposeSelector';
import { FindFlow } from './components/FindFlow';
import { ListFlow } from './components/ListFlow';
import { PublicProfile } from './components/PublicProfile';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { useAuth } from './context/AuthProvider';

type Page = 'landing' | 'location-selector' | 'purpose-selector' | 'find-flow' | 'list-flow' | 'profile' | 'messages' | 'safety' | 'public-profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { user, signOut, loading, emailConfirmed } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<'find' | 'list' | ''>('');
  const [viewUserId, setViewUserId] = useState<string>('');
  const [startConversationWith, setStartConversationWith] = useState<string | undefined>(undefined);

  // Determine if user is authenticated
  const isAuthenticated = !loading && !!user && emailConfirmed;

  const handleLogin = () => {
    // This is called after successful authentication
    setCurrentPage('location-selector');
  };

  const handleGetStarted = () => {
    // This is for the "Get Started Free" button - should go to location selector
    setCurrentPage('location-selector');
  };

  const handleLogout = async () => {
    await signOut();
    setSelectedCity('');
    setSelectedCityName('');
    setSelectedPurpose('');
    setCurrentPage('landing');
  };

  // If a session already exists on load with confirmed email, send users to location selection.
  useEffect(() => {
    if (isAuthenticated && currentPage === 'landing') {
      setCurrentPage('location-selector');
    }
  }, [isAuthenticated, currentPage]);

  // Prevent unauthenticated access to protected pages by redirecting to landing.
  useEffect(() => {
    if (!loading && !isAuthenticated && (currentPage === 'location-selector' || currentPage === 'purpose-selector' || currentPage === 'find-flow' || currentPage === 'list-flow' || currentPage === 'profile' || currentPage === 'messages' || currentPage === 'safety')) {
      setCurrentPage('landing');
    }
  }, [loading, isAuthenticated, currentPage]);

  const handleLocationSelect = (cityId: string, cityName: string) => {
    setSelectedCity(cityId);
    setSelectedCityName(cityName);
    setCurrentPage('purpose-selector');
  };

  const handlePurposeSelect = (purpose: 'find' | 'list') => {
    setSelectedPurpose(purpose);
    setCurrentPage(purpose === 'find' ? 'find-flow' : 'list-flow');
  };

  const handleBackToPurposeSelector = () => {
    setCurrentPage('purpose-selector');
  };

  const handleBackToLocationSelector = () => {
    setSelectedCity('');
    setSelectedCityName('');
    setCurrentPage('location-selector');
  };

  const handleBackToMainFlow = () => {
    setCurrentPage(selectedPurpose === 'find' ? 'find-flow' : 'list-flow');
  };

  const handleBackToProfile = () => {
    setCurrentPage('profile');
  };

  // Listen for public profile open events from child components
  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.userId) {
        setViewUserId(e.detail.userId);
        setCurrentPage('public-profile');
      }
    };
    window.addEventListener('open-public-profile', handler as EventListener);
    return () => window.removeEventListener('open-public-profile', handler as EventListener);
  }, []);

  // Listen for start conversation events
  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.userId) {
        setStartConversationWith(e.detail.userId);
        setCurrentPage('messages');
      }
    };
    window.addEventListener('start-conversation', handler as EventListener);
    return () => window.removeEventListener('start-conversation', handler as EventListener);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onLogin={handleLogin} onGetStarted={handleGetStarted} />;
      case 'location-selector':
        return <LocationSelector onLocationSelect={handleLocationSelect} onBack={isAuthenticated ? handleBackToLocationSelector : handleLogout} />;
      case 'purpose-selector':
        return <PurposeSelector cityName={selectedCityName} onPurposeSelect={handlePurposeSelect} onBack={handleBackToLocationSelector} />;
      case 'find-flow':
        return <FindFlow 
          selectedCity={selectedCity || undefined} 
          cityName={selectedCityName || undefined} 
          onBack={selectedCity ? handleBackToPurposeSelector : handleBackToProfile} 
        />;
      case 'list-flow':
        return <ListFlow selectedCity={selectedCity} cityName={selectedCityName} onBack={handleBackToPurposeSelector} />;
      case 'profile':
        return <Profile onBack={handleBackToMainFlow} />;
      case 'messages':
        return <Messages onBack={handleBackToMainFlow} startConversationWith={startConversationWith} />;
      case 'safety':
        return <Safety onBack={handleBackToMainFlow} />;
      case 'public-profile':
        return (
          <PublicProfile 
            userId={viewUserId}
            onBack={handleBackToMainFlow}
            onMessage={(uid: string) => {
              setStartConversationWith(uid);
              setCurrentPage('messages');
            }}
          />
        );
      default:
        return <Landing onLogin={handleLogin} onGetStarted={handleGetStarted} />;
    }
  };

  // Show landing page without navbar if not authenticated
  if (!isAuthenticated && currentPage === 'landing') {
    return renderPage();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => selectedPurpose ? setCurrentPage(selectedPurpose === 'find' ? 'find-flow' : 'list-flow') : setCurrentPage('purpose-selector')}>
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-medium">
              LOOK<span className="text-primary">.</span>IN
            </h1>
            {selectedCityName && (
              <div className="flex items-center text-sm text-muted-foreground ml-2">
                <MapPin className="h-3 w-3 mr-1" />
                {selectedCityName}
              </div>
            )}
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant={currentPage === 'find-flow' || currentPage === 'list-flow' ? 'default' : 'ghost'}
              onClick={() => {
                if (selectedPurpose) {
                  setCurrentPage(selectedPurpose === 'find' ? 'find-flow' : 'list-flow');
                } else {
                  // Direct access to find-flow using user's profile location
                  setCurrentPage('find-flow');
                }
              }}
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>{selectedPurpose === 'find' ? 'Find' : selectedPurpose === 'list' ? 'List' : 'Browse'}</span>
            </Button>
            <Button
              variant={currentPage === 'messages' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('messages')}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </Button>
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('profile')}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Button>
            <Button
              variant={currentPage === 'safety' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('safety')}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Safety</span>
            </Button>
          </nav>

          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              {/* User Profile Avatar - Display Only */}
              <div className="flex items-center space-x-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || undefined} 
                    alt={user?.user_metadata?.full_name || user?.email || 'User'} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                     user?.email?.charAt(0)?.toUpperCase() || 
                     'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-2">
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant={currentPage === 'find-flow' || currentPage === 'list-flow' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                if (selectedPurpose) {
                  setCurrentPage(selectedPurpose === 'find' ? 'find-flow' : 'list-flow');
                } else {
                  // Direct access to find-flow using user's profile location
                  setCurrentPage('find-flow');
                }
              }}
              className="flex flex-col items-center py-2 h-auto"
            >
              <Search className="h-4 w-4" />
              <span className="text-xs mt-1">{selectedPurpose === 'find' ? 'Find' : selectedPurpose === 'list' ? 'List' : 'Browse'}</span>
            </Button>
            <Button
              variant={currentPage === 'messages' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage('messages')}
              className="flex flex-col items-center py-2 h-auto"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs mt-1">Messages</span>
            </Button>
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage('profile')}
              className="flex flex-col items-center py-2 h-auto"
            >
              <User className="h-4 w-4" />
              <span className="text-xs mt-1">Profile</span>
            </Button>
            <Button
              variant={currentPage === 'safety' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentPage('safety')}
              className="flex flex-col items-center py-2 h-auto"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs mt-1">Safety</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderPage()}
      </main>
    </div>
  );
}