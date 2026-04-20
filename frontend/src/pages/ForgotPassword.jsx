import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleSendOTP = (e) => {
    e.preventDefault();
    // In a real app, you would make an API call here.
    // For now, redirect to OTP verification.
    navigate('/otp-verify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass">
        <div className="px-6 pt-6">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-success transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
        <CardHeader className="space-y-2 text-center pb-8 pt-4">
          <div className="mx-auto w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-2 border border-green-500/30">
            <span className="text-success font-bold text-2xl">H</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password?</CardTitle>
          <p className="text-text-muted text-sm px-4">No worries, we'll send you reset instructions to your email.</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form className="space-y-6" onSubmit={handleSendOTP}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-text-muted" />
                <Input id="email" type="email" required placeholder="student@example.com" className="pl-10" />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">Send OTP</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
