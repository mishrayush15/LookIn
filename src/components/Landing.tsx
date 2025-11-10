import React, { useState } from 'react';
import { Home, Shield, Users, CheckCircle, Star, MessageSquare, Chrome, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../context/AuthProvider';
import { EmailConfirmation } from './EmailConfirmation';

export interface LandingProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export function Landing({ onLogin, onGetStarted }: LandingProps) {
  // Landing component with OAuth and email authentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signInWithPassword, signUpWithPassword, signInWithGoogle, signInWithGitHub } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🏠 Safe • Verified • Compatible
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Find Your Perfect
                  <span className="text-primary block">Flatmate</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Look in to a new way of finding flatmates. Connect with verified, compatible people through our intelligent matching system. 
                  Say goodbye to random groups and unsafe choices.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
                  Get Started Free
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>ID Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Safe & Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>New Platform</span>
                </div>
              </div>
            </div>

            {/* Login/Signup Card */}
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why LOOK<span className="text-primary">.</span>IN?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We solve the real problems that make flatmate hunting stressful and unsafe.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Verified Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All users undergo ID verification and background checks for your safety and peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our algorithm matches you based on lifestyle, budget, location, and personality compatibility.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <CardTitle>Secure Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chat safely within our platform without sharing personal contact details until you're ready.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Getting started is simple and secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-medium mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Sign up and complete your profile with verification for maximum safety and trust.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-medium mb-2">Browse & Match</h3>
                <p className="text-muted-foreground text-sm">
                  Use our smart filters to find compatible flatmates who match your lifestyle and budget.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-medium mb-2">Connect Safely</h3>
                <p className="text-muted-foreground text-sm">
                  Chat securely within our platform and arrange meetings following our safety guidelines.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Flatmate?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Be among the first to experience safer, smarter flatmate matching.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={onGetStarted}
            className="text-lg px-8 py-6"
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}