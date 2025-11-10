import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Users, Lock, Eye, Phone, MessageSquare, Flag, HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

interface SafetyProps {
  onBack?: () => void;
}

export function Safety({ onBack }: SafetyProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const safetyScore = 87;

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'ID Verification',
      description: 'All users must verify their identity with government-issued ID',
      status: 'active',
      color: 'green'
    },
    {
      icon: Lock,
      title: 'Secure Messaging',
      description: 'All messages are encrypted and monitored for safety',
      status: 'active',
      color: 'green'
    },
    {
      icon: Eye,
      title: 'Profile Review',
      description: 'Every profile is manually reviewed before approval',
      status: 'active',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Community Guidelines',
      description: 'Strict community standards enforced by our moderation team',
      status: 'active',
      color: 'green'
    }
  ];

  const safetyTips = [
    {
      category: 'Meeting Up',
      tips: [
        'Always meet in a public place for the first time',
        'Tell a friend or family member where you\'re going',
        'Consider bringing a friend to the first meeting',
        'Trust your instincts - if something feels off, leave',
        'Arrange your own transportation to and from the meeting'
      ]
    },
    {
      category: 'Online Safety',
      tips: [
        'Keep personal information private until you feel comfortable',
        'Don\'t share your home address in initial messages',
        'Use the platform\'s messaging system rather than personal contact',
        'Never send money or financial information',
        'Be wary of users who push to move conversations off-platform quickly'
      ]
    },
    {
      category: 'Red Flags',
      tips: [
        'Refuses to verify their identity or provide additional information',
        'Pressures you to make quick decisions about living arrangements',
        'Stories about their background don\'t add up or change',
        'Avoids talking on the phone or meeting in person',
        'Requests money upfront or unusual payment methods'
      ]
    }
  ];

  const reportReasons = [
    'Inappropriate content or behavior',
    'Fake or misleading profile',
    'Harassment or threatening behavior',
    'Spam or promotional content',
    'Suspicious activity',
    'Other'
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      {/* Safety Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Your Safety Score</CardTitle>
                <p className="text-muted-foreground">Based on verification status and account activity</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{safetyScore}%</div>
              <p className="text-sm text-muted-foreground">Excellent</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={safetyScore} className="h-2" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">ID Verified</p>
                  <p className="text-sm text-muted-foreground">Government ID confirmed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Email Verified</p>
                  <p className="text-sm text-muted-foreground">Email address confirmed</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Safety Features</TabsTrigger>
          <TabsTrigger value="tips">Safety Tips</TabsTrigger>
          <TabsTrigger value="report">Report & Block</TabsTrigger>
          <TabsTrigger value="help">Get Help</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {safetyFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${feature.color}-100 rounded-full flex items-center justify-center`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{feature.title}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>How We Keep You Safe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">Prevention</h4>
                  <p className="text-sm text-muted-foreground">Multiple verification steps and profile screening</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-medium mb-2">Monitoring</h4>
                  <p className="text-sm text-muted-foreground">24/7 automated and human moderation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="font-medium mb-2">Community</h4>
                  <p className="text-sm text-muted-foreground">User reporting and community self-policing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          {safetyTips.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.category === 'Red Flags' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Remember:</strong> If something doesn't feel right, trust your instincts. Your safety is more important than finding a flatmate quickly.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report a User or Content</CardTitle>
              <p className="text-muted-foreground">Help us maintain a safe community by reporting inappropriate behavior</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {reportReasons.map((reason, index) => (
                  <Button key={index} variant="outline" className="justify-start h-auto p-4">
                    <Flag className="h-4 w-4 mr-3" />
                    <span>{reason}</span>
                  </Button>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">What Happens After You Report?</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">1</div>
                    <span>Your report is immediately reviewed by our safety team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">2</div>
                    <span>We investigate and take appropriate action within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">3</div>
                    <span>You'll receive an update on the action taken</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Block & Privacy Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Profile Visibility</h4>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Blocked Users</h4>
                  <p className="text-sm text-muted-foreground">Manage your blocked users list</p>
                </div>
                <Button variant="outline" size="sm">View List</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Message Filters</h4>
                  <p className="text-sm text-muted-foreground">Filter messages from unverified users</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <p className="text-muted-foreground">We're here to support you 24/7</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="h-auto p-6 flex-col gap-3" variant="outline">
                  <Phone className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Emergency Hotline</div>
                    <div className="text-sm text-muted-foreground">Available 24/7</div>
                  </div>
                </Button>
                
                <Button className="h-auto p-6 flex-col gap-3" variant="outline">
                  <MessageSquare className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-muted-foreground">Instant support</div>
                  </div>
                </Button>
                
                <Button className="h-auto p-6 flex-col gap-3" variant="outline">
                  <HelpCircle className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Help Center</div>
                    <div className="text-sm text-muted-foreground">FAQs & guides</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">What if I feel unsafe during a meeting?</h4>
                  <p className="text-sm text-muted-foreground">
                    Trust your instincts and leave immediately. Contact our emergency support line and local authorities if necessary.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">How do I know if someone is verified?</h4>
                  <p className="text-sm text-muted-foreground">
                    Verified users have a green shield badge on their profile. This means they've completed ID verification and background checks.
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">Can I remove my personal information later?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can edit or delete your profile information at any time. We also offer account deletion with complete data removal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Emergency:</strong> If you're in immediate danger, contact local emergency services first, then reach out to our support team.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}