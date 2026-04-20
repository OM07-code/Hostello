import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // In a real app, verify OTP via API. 
    // Redirecting to login upon success
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass">
         <div className="px-6 pt-6">
          <Link to="/forgot-password" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-success transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </div>
        <CardHeader className="space-y-2 text-center pb-8 pt-4">
          <div className="mx-auto w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-2 border border-green-500/30">
            <span className="text-success font-bold text-2xl">H</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Enter OTP Code</CardTitle>
          <p className="text-text-muted text-sm px-4">We've sent a 4-digit code to your email. Enter it below to verify.</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{1}"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-border-default bg-surface text-text-primary focus-visible:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus transition-all"
                />
              ))}
            </div>

            <Button type="submit" className="w-full" size="lg">Verify & Proceed</Button>
          </form>

          <div className="text-center text-sm text-text-muted mt-6">
            Didn't receive the code?{' '}
            <button className="font-semibold text-success hover:text-green-400 hover:underline">
              Resend Code
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
