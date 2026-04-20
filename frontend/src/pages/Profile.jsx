import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Building, Phone, Camera } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '+91 9876543210',
    emergencyContact: user?.emergencyContact || '+91 9876543211'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      // Intentionally wrapped in delay to show loading state if local fallback is too quick
      await new Promise(r => setTimeout(r, 600)); 
      
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAvatarUrl(res.data.url);
      toast.success('Avatar updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return <div className="animate-pulse p-8 bg-surface rounded-xl border border-border-default h-64">Loading Profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-text-primary">User Profile</h2>
          <p className="text-text-muted mt-1">Manage your account settings and personal information.</p>
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} variant={isEditing ? 'default' : 'outline'}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        
        {/* Profile Card */}
        <Card className="h-fit">
          <CardContent className="p-6 text-center space-y-4">
            <div className={`relative mx-auto w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-lg transition-transform ${isUploading ? 'animate-pulse scale-95' : ''}`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-primary">{user.name.charAt(0)}</span>
              )}
              {isEditing && (
                <>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-surface rounded-full border border-border-subtle shadow-sm text-text-muted hover:text-primary transition-colors cursor-pointer z-10">
                    <Camera className="w-4 h-4" />
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary capitalize">{user.name}</h3>
              <p className="text-text-secondary text-sm flex items-center justify-center mt-1">
                <Shield className="w-3.5 h-3.5 mr-1" /> {user.role}
              </p>
            </div>
            <div className="pt-4 border-t border-border-subtle grid grid-cols-2 gap-2 text-left">
              <div className="bg-surface-hover p-2 rounded-lg border border-border-default">
                <p className="text-[10px] uppercase font-bold text-text-muted">Room No.</p>
                <p className="font-semibold text-text-primary">{user.room || 'N/A'}</p>
              </div>
              <div className="bg-surface-hover p-2 rounded-lg border border-border-default">
                <p className="text-[10px] uppercase font-bold text-text-muted">Hostel</p>
                <p className="font-semibold text-text-primary">Tata Block</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input value={user.name} disabled className="pl-9 bg-surface-hover opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input value={user.email} disabled className="pl-9 bg-surface-hover opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input 
                    value={formData.phone} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`pl-9 ${!isEditing ? 'bg-surface-hover opacity-70' : 'bg-surface'}`} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Emergency Contact</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-error/70" />
                  <Input 
                    value={formData.emergencyContact} 
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    className={`pl-9 ${!isEditing ? 'bg-surface-hover opacity-70' : 'bg-surface border-error/50 focus:border-error focus:ring-error/20'}`} 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
               <Label>Permanent Address</Label>
               <textarea 
                  disabled={!isEditing}
                  rows={2}
                  className={`w-full rounded-xl border px-3 py-2 text-sm transition-all resize-none ${!isEditing ? 'bg-surface-hover border-border-default opacity-70 text-text-primary' : 'bg-surface border-border-default text-text-primary focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none'}`}
                  defaultValue="124, Link Road, Mumbai, Maharashtra 400053"
               />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
