import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Utensils, QrCode, CalendarClock, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MessCard() {
  const { user } = useAuth();
  
  if (!user) return <div className="p-8 text-center text-text-muted">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
         <h2 className="text-2xl font-bold text-text-primary">Digital Mess Card</h2>
         <p className="text-text-muted mt-1">Scan to register your meals and track your dining history.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        
        {/* Qr Code & Student Status */}
        <Card className="border border-border-default shadow-sm bg-surface overflow-hidden h-fit">
           <div className="h-2 bg-primary w-full"></div>
           <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-48 h-48 bg-white p-4 rounded-2xl border-4 border-primary/20 shadow-lg relative group">
                {/* Mock QR Code Pattern */}
                <div className="w-full h-full relative">
                   <QrCode className="w-full h-full text-zinc-900" style={{strokeWidth: '1.2'}} />
                </div>
                <div className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                   <span className="bg-primary text-text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm">Click to Enlarge</span>
                </div>
              </div>
              <div>
                 <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">{user.name}</h3>
                 <p className="text-sm font-mono text-text-secondary mt-1 tracking-widest">{String(user?._id || user?.id || 'UNKNOWN').slice(-8)}</p>
                 <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full border border-success/20 text-xs font-bold uppercase">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Active Plan
                 </div>
              </div>
           </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Today's Stats */}
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-surface border border-border-default rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                 <p className="text-xs font-bold uppercase text-text-muted tracking-wider">Breakfast</p>
                 <p className="text-xl font-black text-success mt-1">Consumed</p>
                 <p className="text-[10px] text-text-secondary mt-1 font-mono">08:15 AM</p>
             </div>
             <div className="bg-surface border border-border-default rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                 <p className="text-xs font-bold uppercase text-text-muted tracking-wider">Lunch</p>
                 <p className="text-xl font-black text-error mt-1">Missed</p>
                 <p className="text-[10px] text-text-secondary mt-1 font-mono">1:30 PM</p>
             </div>
             <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
                 <p className="text-xs font-bold uppercase text-primary tracking-wider z-10">Dinner</p>
                 <p className="text-xl font-black text-text-primary mt-1 z-10">Pending</p>
                 <p className="text-[10px] text-text-secondary mt-1 font-mono z-10">08:00 PM</p>
             </div>
          </div>

          <Card className="border border-border-default shadow-sm bg-surface">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                 <TrendingUp className="w-5 h-5 mr-2 text-primary" /> Monthly Consumption
              </CardTitle>
              <CardDescription>Meals logged for the current billing cycle.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2 w-full">
                       <span className="text-text-primary">Breakfast</span>
                       <span className="text-text-muted">65 / 90</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden">
                       <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{width: '72%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2 w-full">
                       <span className="text-text-primary">Lunch</span>
                       <span className="text-text-muted">45 / 90</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2 w-full">
                       <span className="text-text-primary">Dinner</span>
                       <span className="text-text-muted">80 / 90</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-hover rounded-full overflow-hidden">
                       <div className="h-full bg-success rounded-full transition-all duration-1000" style={{width: '88%'}}></div>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
