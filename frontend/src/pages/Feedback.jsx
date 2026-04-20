import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { MessageSquareHeart, Send, ShieldAlert, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Feedback() {
  const [topic, setTopic] = useState('General');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Feedback submitted! Thank you for helping us improve.');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
         <h2 className="text-2xl font-bold text-text-primary">Help & Feedback</h2>
         <p className="text-text-muted mt-1">Found a bug? Have a suggestion? We'd love to hear from you.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
         {/* Info Sidebar */}
         <div className="space-y-4">
             <Card className="border border-border-default shadow-sm bg-surface">
                 <CardContent className="p-6 text-center space-y-3">
                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                        <MessageSquareHeart className="w-6 h-6" />
                     </div>
                     <h3 className="font-bold text-text-primary">We Listen</h3>
                     <p className="text-sm text-text-muted">Our admin team actively monitors feedback to improve the student experience.</p>
                 </CardContent>
             </Card>

             <Card className="border border-border-default border-dashed bg-surface-hover">
                 <CardContent className="p-4 text-center">
                     <ShieldAlert className="w-5 h-5 text-text-muted mx-auto mb-2" />
                     <p className="text-xs text-text-muted font-medium">Do not use this for emergency reporting. Use the emergency siren on the mobile application.</p>
                 </CardContent>
             </Card>
         </div>

         {/* Form */}
         <Card className="border border-border-default shadow-sm bg-surface">
             <CardHeader>
                 <CardTitle className="text-lg">Submit Feedback</CardTitle>
                 <CardDescription>Your submission can be completely anonymous if desired.</CardDescription>
             </CardHeader>
             <CardContent>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                        <Label>Feedback Category</Label>
                        <select 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full flex h-10 rounded-xl border border-border-default bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-all"
                        >
                            <option>General UI/UX Suggestion</option>
                            <option>Bug Report (System Issue)</option>
                            <option>Feature Request</option>
                            <option>Food Quality Review</option>
                            <option>Warden Behavior</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <Label className="flex justify-between">
                            <span>Detailed Description</span>
                            <span className="text-xs text-text-muted font-normal">{message.length}/500</span>
                        </Label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            required
                            placeholder="Please explain in detail what you experienced..."
                            className="w-full rounded-xl border border-border-default bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-all resize-none"
                        />
                     </div>

                     <Button type="submit" disabled={isSubmitting || message.length < 5} className="w-full relative group overflow-hidden">
                        {isSubmitting ? 'Sending Transmission...' : (
                          <>
                             <span className="relative z-10 flex items-center"><Send className="w-4 h-4 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> Submit to Matrix</span>
                             <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                          </>
                        )}
                     </Button>
                 </form>
             </CardContent>
         </Card>
      </div>

    </div>
  );
}
