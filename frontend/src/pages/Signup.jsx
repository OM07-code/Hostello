import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post('/auth/register', { 
        name, email, password, role: 'Student' 
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background transition-colors">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass my-8">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <div className="mx-auto w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-2 border border-green-500/30">
            <span className="text-success font-bold text-2xl">H</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <p className="text-text-muted text-sm">Join Hostello and manage your stay easily.</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form className="space-y-4" onSubmit={handleSignup}>
            {error && <div className="p-3 rounded bg-rose-500/20 text-rose-400 text-sm border border-rose-500/30">{error}</div>}
            
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                <Input id="name" placeholder="John Doe" className="pl-10 text-base" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                <Input id="email" type="email" placeholder="student@example.com" className="pl-10 text-base" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10 text-base" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                <Input id="confirm-password" type="password" placeholder="••••••••" className="pl-10 text-base" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-success hover:text-green-400 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
