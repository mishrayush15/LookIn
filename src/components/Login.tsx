import React, { useState } from 'react';
import { Chrome, Github, Home, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../context/AuthProvider';
import { EmailConfirmation } from './EmailConfirmation';
import { CitySearchModal } from './CitySearchModal';

export interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signInWithPassword, signUpWithPassword, signInWithGoogle, signInWithGitHub } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await signInWithPassword({ email, password });
    setSubmitting(false);
    if (res && 'error' in res && res.error) {
      setError(res.error.message);
      return;
    }
    onLogin();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await signUpWithPassword({ email, password, data: { full_name: name } });
    setSubmitting(false);
    if (res && 'error' in res && res.error) {
      setError(res.error.message);
      return;
    }
    // Show email confirmation page after successful signup
    setShowEmailConfirmation(true);
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading('google');
    setError(null);
    const result = await signInWithGoogle();
    if (result && 'error' in result) {
      setError(result.error.message);
      setOauthLoading(null);
    }
  };

  const handleGitHubSignIn = async () => {
    setOauthLoading('github');
    setError(null);
    const result = await signInWithGitHub();
    if (result && 'error' in result) {
      setError(result.error.message);
      setOauthLoading(null);
    }
  };

  if (showEmailConfirmation) {
    return (
      <EmailConfirmation 
        email={email} 
        onBack={() => setShowEmailConfirmation(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back </span>
            </Button>
            <Button variant="ghost" onClick={() => setShowCityModal(true)} className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Browse</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Login Section */}
        <section className="min-h-[calc(100vh-73px)] flex items-start justify-center pt-24 md:pt-32 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center">
                Join LOOK<span className="text-primary">.</span>IN
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                {/* OAuth Buttons - shown on both tabs */}
                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline" 
                    className="w-full"
                    disabled={oauthLoading === 'google'}
                  >
                    {oauthLoading === 'google' ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <Chrome className="h-4 w-4 mr-2" />
                        Continue with Google
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleGitHubSignIn}
                    variant="outline" 
                    className="w-full"
                    disabled={oauthLoading === 'github'}
                  >
                    {oauthLoading === 'github' ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <Github className="h-4 w-4 mr-2" />
                        Continue with GitHub
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>
                
                <TabsContent value="login" className="mt-6">
                  {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="mt-6">
                  {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
      <CitySearchModal open={showCityModal} onClose={() => setShowCityModal(false)} />
    </div>
  );
}

// CitySearchModal will dispatch a global `city-selected` event; Login toggles visibility
