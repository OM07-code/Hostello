import { Bell, Search, Sun, Moon, Laptop, Menu } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export default function Header({ onMenuClick }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border-default bg-surface/80 px-4 backdrop-blur-md sm:px-6 transition-colors">
      <div className="flex flex-1 items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md hover:bg-surface-hover text-text-secondary transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full border border-border-strong bg-surface-hover pl-9 pr-4 py-2 text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus transition-all placeholder:text-text-muted"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Theme Toggle */}
        <div className="flex items-center bg-surface-hover rounded-full p-1 border border-border-subtle">
           <button onClick={() => setTheme('light')} className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-surface shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}>
             <Sun className="w-4 h-4" />
           </button>
           <button onClick={() => setTheme('system')} className={`p-1.5 rounded-full transition-colors ${theme === 'system' ? 'bg-surface shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}>
             <Laptop className="w-4 h-4" />
           </button>
           <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-surface shadow-sm text-primary' : 'text-text-muted hover:text-text-primary'}`}>
             <Moon className="w-4 h-4" />
           </button>
        </div>

        <button className="relative rounded-full p-2 hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
        </button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-surface-hover transition-colors cursor-pointer border border-transparent hover:border-border-default">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-text-primary font-medium shadow-sm">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
