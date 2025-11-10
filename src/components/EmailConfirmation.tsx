import React, { useState } from 'react';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../context/AuthProvider';

interface EmailConfirmationProps {
  email: string;
  onBack: () => void;
}

export function EmailConfirmation({ email, onBack }: EmailConfirmationProps) {
  const { resendConfirmation } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResend = async () => {
    setResending(true);
    setResendError(null);
    setResendSuccess(false);
    
    const result = await resendConfirmation(email);
    
    if (result && 'error' in result) {
      setResendError(result.error.message);
    } else {
      setResendSuccess(true);
    }
    
    setResending(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              We've sent a confirmation link to:
            </p>
            <p className="font-medium text-sm bg-muted p-2 rounded">
              {email}
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in your email to verify your account and continue.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleResend} 
              variant="outline" 
              className="w-full"
              disabled={resending}
            >
              {resending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Resend Confirmation Email
                </>
              )}
            </Button>

            {resendSuccess && (
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Confirmation email sent!</span>
              </div>
            )}

            {resendError && (
              <p className="text-sm text-red-600 text-center">
                {resendError}
              </p>
            )}

            <Button 
              onClick={onBack} 
              variant="ghost" 
              className="w-full"
            >
              Back to Login
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Didn't receive the email?</p>
            <p>Check your spam folder or try resending.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
