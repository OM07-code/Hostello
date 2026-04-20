import { Calendar, CreditCard, MessageSquare, Clock, Plane, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const userInfoStr = localStorage.getItem('user_info');
  const user = userInfoStr ? JSON.parse(userInfoStr) : { name: 'Student', room: '302B' };

  // Helper date format
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Welcome back, {user.name}</h1>
          <p className="text-text-muted mt-1 tracking-wide">Here's what's happening at Hostello today.</p>
        </div>
        <div className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full flex items-center text-sm shadow-sm border border-primary/20">
          <Calendar className="w-4 h-4 mr-2" />
          {today}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface rounded-3xl p-5 border border-border-default shadow-sm flex flex-col justify-between h-36 hover:border-border-focus transition-colors">
               <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Room Status</p>
               <div className="mt-auto">
                 <h3 className="text-2xl font-black text-text-primary">{user.room || 'Pending'}</h3>
                 <span className="inline-block mt-2 text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">Occupied</span>
               </div>
            </div>
            <div className="bg-surface rounded-3xl p-5 border border-border-default shadow-sm flex flex-col justify-between h-36 hover:border-border-focus transition-colors">
               <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Pending Fees</p>
               <div className="mt-auto">
                 <h3 className="text-2xl font-black text-rose-500">₹15,000</h3>
                 <span className="inline-block mt-2 text-[10px] bg-rose-500/20 text-rose-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Due in 3d</span>
               </div>
            </div>
            <div className="bg-surface rounded-3xl p-5 border border-border-default shadow-sm flex flex-col justify-between h-36 hover:border-border-focus transition-colors">
               <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Leave Status</p>
               <div className="mt-auto flex justify-between items-center">
                 <h3 className="text-xl font-bold text-text-primary">Approved</h3>
                 <CheckCircle2 className="w-7 h-7 text-primary fill-primary/20" />
               </div>
            </div>
            <div className="bg-surface rounded-3xl p-5 border border-border-default shadow-sm flex flex-col justify-between h-36 hover:border-border-focus transition-colors">
               <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Complaint</p>
               <div className="mt-auto flex justify-between items-center">
                 <h3 className="text-xl font-bold text-text-primary">Resolved</h3>
                 <CheckCircle2 className="w-7 h-7 text-success fill-success/20" />
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-5">
              <Link to="/leaves" className="bg-primary hover:bg-blue-600 transition-colors text-white rounded-[2rem] p-6 shadow-md flex flex-col h-44 group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 blur-2xl"></div>
                 <Plane className="w-8 h-8 mb-auto text-white/90 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                 <h4 className="text-lg font-bold">Apply for Leave</h4>
                 <p className="text-xs text-white/80 mt-1 font-medium">Submit travel requests</p>
              </Link>
              <Link to="/complaints" className="bg-surface-elevated hover:bg-surface-hover border border-border-default transition-colors rounded-[2rem] p-6 shadow-sm flex flex-col h-44 group">
                 <AlertTriangle className="w-8 h-8 mb-auto text-primary group-hover:scale-110 transition-transform" />
                 <h4 className="text-lg font-bold text-text-primary">Raise Complaint</h4>
                 <p className="text-xs text-text-secondary mt-1 font-medium">Report maintenance issues</p>
              </Link>
              <Link to="/fees" className="bg-surface-elevated hover:bg-surface-hover border border-border-default transition-colors rounded-[2rem] p-6 shadow-sm flex flex-col h-44 group">
                 <CreditCard className="w-8 h-8 mb-auto text-rose-500 group-hover:scale-110 transition-transform" />
                 <h4 className="text-lg font-bold text-text-primary">Pay Fees</h4>
                 <p className="text-xs text-text-secondary mt-1 font-medium">Manage billing & invoices</p>
              </Link>
            </div>
          </div>

          {/* Important Notices */}
          <div className="bg-surface rounded-3xl p-8 border border-border-default shadow-sm space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold text-text-primary">Important Notices</h3>
               <Link to="#" className="text-xs font-bold text-primary uppercase tracking-wider hover:underline">View Archive</Link>
            </div>
            <div className="space-y-8">
               <div className="flex gap-5 group cursor-pointer">
                  <div className="min-w-[64px] h-[64px] bg-rose-500/10 text-rose-500 rounded-2xl flex flex-col items-center justify-center font-bold">
                     <span className="text-xl leading-none">24</span>
                     <span className="text-[10px] uppercase tracking-wider mt-1">Oct</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">Annual Maintenance: Power Outage Schedule</h4>
                    <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">Please note that there will be a scheduled power outage this Sunday from 10:00 AM to 4:00 PM for central grid maintenance.</p>
                  </div>
               </div>
               <div className="flex gap-5 group cursor-pointer">
                  <div className="min-w-[64px] h-[64px] bg-primary/10 text-primary rounded-2xl flex flex-col items-center justify-center font-bold">
                     <span className="text-xl leading-none">22</span>
                     <span className="text-[10px] uppercase tracking-wider mt-1">Oct</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">New Mess Menu Implementation</h4>
                    <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">The new autumn mess menu has been finalized. Check the mess hall bulletin board for the updated weekly rotation starting Monday.</p>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Column (Recent Activity) */}
        <div className="bg-surface rounded-3xl p-8 border border-border-default shadow-sm h-fit">
           <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-8">Recent Activity</h3>
           
           <div className="relative pl-6 space-y-10 border-l-2 border-border-default ml-4">
              
              <div className="relative">
                 <div className="absolute -left-[45px] bg-surface border-[6px] border-surface rounded-full w-10 h-10 flex items-center justify-center">
                    <div className="bg-primary/20 w-full h-full rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                 </div>
                 <h4 className="text-sm font-bold text-text-primary">Fee Payment Successful</h4>
                 <p className="text-xs text-text-secondary mt-1 font-medium">Transaction ID: #HST-89210</p>
                 <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-2 block">2 Hours Ago</span>
              </div>

              <div className="relative">
                 <div className="absolute -left-[45px] bg-surface border-[6px] border-surface rounded-full w-10 h-10 flex items-center justify-center">
                    <div className="bg-amber-500/20 w-full h-full rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                 </div>
                 <h4 className="text-sm font-bold text-text-primary">Leave Request Submitted</h4>
                 <p className="text-xs text-text-secondary mt-1 font-medium">Pending Warden Approval for 28th Oct</p>
                 <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-2 block">Yesterday</span>
              </div>

              <div className="relative">
                 <div className="absolute -left-[45px] bg-surface border-[6px] border-surface rounded-full w-10 h-10 flex items-center justify-center">
                    <div className="bg-slate-500/20 w-full h-full rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                    </div>
                 </div>
                 <h4 className="text-sm font-bold text-text-primary">New Comment on Complaint</h4>
                 <p className="text-xs text-text-secondary mt-1 font-medium">"Plumber has been dispatched to Room 302B"</p>
                 <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-2 block">Oct 21</span>
              </div>

           </div>

           <button className="w-full mt-10 py-3.5 rounded-2xl border border-border-default text-text-primary font-bold text-xs uppercase tracking-widest hover:bg-surface-hover transition-colors shadow-sm">
              View Full History
           </button>
        </div>

      </div>
    </div>
  );
}
