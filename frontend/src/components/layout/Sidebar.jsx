import { NavLink } from 'react-router-dom';
import { User, Settings, HelpCircle, Utensils, MessageSquareHeart, LogOut, CreditCard, Shield, CalendarClock, DoorOpen, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const userNavItems = [
  { name: 'Dashboard', path: '/', icon: User },
  { name: 'Room Matchmaking', path: '/room-booking', icon: DoorOpen },
  { name: 'My Fees', path: '/fees', icon: CreditCard },
  { name: 'Leaves', path: '/leaves', icon: CalendarClock },
  { name: 'Complaints', path: '/complaints', icon: MessageSquareHeart },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Mess Card', path: '/mess-card', icon: Utensils },
  { name: 'Feedback', path: '/feedback', icon: MessageSquareHeart },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Help', path: '/help', icon: HelpCircle },
];

const adminNavItems = [
  { name: 'Admin Dashboard', path: '/admin-dashboard', icon: Shield },
  { name: 'Hostel Management', path: '/admin-management', icon: Settings },
  { name: 'AI Room Allocator', path: '/admin-allocation', icon: DoorOpen },
  { name: 'Fee Ledger', path: '/admin-fees', icon: CreditCard },
  { name: 'Leave Requests', path: '/admin-leaves', icon: CalendarClock },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const isAdmin = user && user.role === 'Admin';

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border-default bg-surface transition-transform duration-300 shadow-xl md:static md:translate-x-0 md:shadow-sm",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-border-default">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <span className="text-text-primary font-bold text-xl leading-none tracking-tighter">H</span>
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">Hostello</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-text-muted hover:text-text-primary">
             <X className="w-5 h-5" />
          </button>
        </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-surface-hover text-primary border-l-4 border-primary shadow-sm" 
                  : "text-text-secondary border-l-4 border-transparent hover:bg-surface-hover hover:text-text-primary"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-border-default bg-surface">
        {user && (
          <div className="mb-4 px-3 py-2 text-sm flex flex-col">
            <span className="font-bold text-text-primary tracking-tight">{user.name}</span>
            <span className="text-xs text-text-muted mt-0.5 font-medium">{user.role}</span>
          </div>
        )}
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-error hover:bg-error/10 transition-colors">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
    </>
  );
}
