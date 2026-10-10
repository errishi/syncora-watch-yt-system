import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNeedsVerification(false);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setNeedsVerification(true);
        toast.error('Please verify your email address to sign in.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Signed in successfully');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleResendVerification = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('A new verification link has been sent to your email!');
      setNeedsVerification(false);
    }
    setResending(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center my-20">
      <Card className="w-full max-w-md shadow-2xl border-white/10 bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to Syncora</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {needsVerification && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm text-center">
                <p className="text-muted-foreground mb-2">Didn't receive the email or link expired?</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-primary/30 hover:bg-primary/20"
                  onClick={handleResendVerification}
                  disabled={resending}
                >
                  {resending ? 'Sending...' : 'Resend Verification Link'}
                </Button>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 transition-all mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link to="/sign-up" className="text-primary hover:underline font-semibold">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
