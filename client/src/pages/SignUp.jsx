import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      setIsSubmitted(true);
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
    }
    setResending(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center my-20">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-card">
          <CardHeader className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
            <CardDescription className="text-center text-base">
              We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>. 
              Please verify your email address to continue.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-3 pt-6">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => navigate('/sign-in')}
            >
              I've verified my email
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent border border-white/20 hover:bg-white/5"
              onClick={handleResendVerification}
              disabled={resending}
            >
              {resending ? 'Sending...' : 'Resend Verification Link'}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => setIsSubmitted(false)}
            >
              Back to Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full items-center justify-center my-20">
      <Card className="w-full max-w-md shadow-2xl border-white/10 bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to sign up for Syncora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                <Input
                  id="firstName"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20 transition-all mt-4"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link to="/sign-in" className="text-primary hover:underline font-semibold">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
