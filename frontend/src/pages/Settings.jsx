import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Settings as SettingsIcon, BellRing, Lock, Eye, Palette } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">App Settings</h2>
        <p className="text-text-muted mt-1">Configure your dashboard preferences and security.</p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        
        {/* Navigation Sidebar */}
        <div className="hidden md:block space-y-1">
           <button className="w-full flex items-center gap-3 px-3 py-2 bg-surface-hover text-primary font-medium rounded-lg border border-border-subtle shadow-sm">
             <Palette className="w-4 h-4" /> Appearance
           </button>
           <button className="w-full flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover font-medium rounded-lg transition-colors">
             <BellRing className="w-4 h-4" /> Notifications
           </button>
           <button className="w-full flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover font-medium rounded-lg transition-colors">
             <Lock className="w-4 h-4" /> Security
           </button>
           <button className="w-full flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover font-medium rounded-lg transition-colors">
             <Eye className="w-4 h-4" /> Privacy
           </button>
        </div>

        {/* Dynamic View */}
        <div className="space-y-6">
          <Card className="border border-border-default bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Palette className="w-5 h-5 mr-2 text-primary" /> Display & Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="font-semibold text-text-primary">Theme Mode</h4>
                  <p className="text-sm text-text-muted">Select how the app looks for you.</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border-default text-text-muted hover:bg-surface-hover'}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border-default text-text-muted hover:bg-surface-hover'}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700"></div>
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button onClick={() => setTheme('system')} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-border-default text-text-muted hover:bg-surface-hover'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 to-slate-900 border border-border-subtle"></div>
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card className="border border-border-default bg-surface shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BellRing className="w-5 h-5 mr-2 text-primary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border-default">
                <div>
                  <h4 className="font-medium text-text-primary">Push Notifications</h4>
                  <p className="text-xs text-text-muted">Receive alerts on admin announcements.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-primary" />
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-default">
                <div>
                  <h4 className="font-medium text-text-primary">Email Receipts</h4>
                  <p className="text-xs text-text-muted">Receive a copy of fee payments.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-primary" />
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="font-medium text-text-primary">Leave Activity</h4>
                  <p className="text-xs text-text-muted">Get emails when your leave is approved.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer accent-primary" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
             <Button onClick={() => toast.success('Settings saved successfully!')}>Save All Changes</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
