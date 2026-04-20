import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { BedDouble, Sparkles, UserCheck, Bot, Clock, Loader2, BedSingle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RoomBooking() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    studentName: user?.name || 'Guest User',
    studentId: user?._id || 'guest_id',
    budget: 5000,
    roomType: 'Shared',
    floorPreference: 'Any',
    gender: 'Male',
    personalityAnswers: {
      sleepSchedule: 'Night Owl',
      cleanliness: 'Neat',
      social: 'Ambivert'
    }
  });

  const [hasApplied, setHasApplied] = useState(false);
  const [allocatedRoom, setAllocatedRoom] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(f => ({ ...f, studentName: user.name, studentId: user._id }));
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const prefRes = await axios.get('/allocation/preferences');
      const roomRes = await axios.get('/allocation/rooms');
      setPreferences(prefRes.data);
      setRooms(roomRes.data);

      const userId = user?._id || 'guest_id';
      const myPref = prefRes.data.find(p => p.studentId === userId || p.studentName === user?.name);
      
      if (myPref) {
        setHasApplied(true);
        if (myPref.isAllocated) {
          const matchedRoom = roomRes.data.find(r => r._id === myPref.allocatedRoomId);
          setAllocatedRoom(matchedRoom);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching allocation data", err);
      // Ensure we don't break UI completely
      setPreferences([]);
      setRooms([]);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/allocation/preferences', formData);
      setHasApplied(true);
      toast.success("Preferences locked successfully! Waiting for AI match.");
      fetchData(); // refresh list
    } catch (err) {
      console.error("Submit error", err);
      toast.error("Failed to submit room preferences.");
      setHasApplied(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonalityChange = (key, value) => {
    setFormData({
      ...formData,
      personalityAnswers: { ...formData.personalityAnswers, [key]: value }
    });
  };

  if (loading) return <div className="animate-pulse p-8 bg-surface rounded-xl border border-border-default h-64">Loading AI Context...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">Room Matchmaking</h2>
      </div>

      {hasApplied && allocatedRoom && (
        <Card className="border border-success/30 bg-success/5 shadow-lg shadow-green-500/5 animate-in fade-in zoom-in duration-500">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary">AI Match Found!</h3>
            <p className="text-text-secondary">Our Gemini LLM has found the perfect room and roommate combo for you.</p>
            <div className="inline-flex flex-col items-center justify-center p-6 bg-surface-elevated rounded-2xl border border-border-default mt-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-success mb-2">Your Room Details</span>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-text-muted text-sm">Room Number</p>
                  <p className="text-3xl font-black text-text-primary">{allocatedRoom.roomNumber}</p>
                </div>
                <div className="w-px h-12 bg-border-strong"></div>
                <div className="text-center">
                  <p className="text-text-muted text-sm">Floor</p>
                  <p className="text-2xl font-bold text-text-primary">{allocatedRoom.floor}</p>
                </div>
                <div className="w-px h-12 bg-border-strong"></div>
                <div className="text-center">
                  <p className="text-text-muted text-sm">Type</p>
                  <p className="text-lg font-medium text-text-primary flex items-center justify-center">
                    {allocatedRoom.type === 'Single' ? <BedSingle className="w-5 h-5 mr-1 text-primary" /> : <BedDouble className="w-5 h-5 mr-1 text-primary" />}
                    {allocatedRoom.type}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {hasApplied && !allocatedRoom && (
        <div className="text-center py-16 px-4 bg-surface rounded-2xl border border-border-default border-dashed animate-pulse">
          <Bot className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Preferences Locked</h3>
          <p className="text-text-muted max-w-md mx-auto">
            Your constraints and personality mappings are safely stored. The Hostello Admin will trigger the AI Batch Matchmaking sequence soon!
          </p>
          <div className="mt-6 inline-flex items-center text-sm text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
            <Clock className="w-4 h-4 mr-2" /> Pending AI Processing
          </div>
        </div>
      )}

      {!hasApplied && (
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
          {/* Constraints View */}
          <Card className="h-fit border border-border-default shadow-sm bg-surface">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-text-primary">
                <BedDouble className="w-5 h-5 mr-2 text-primary" /> Hard Constraints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name / Preferred Identifier</Label>
                  <Input value={formData.studentName} onChange={(e) => setFormData({...formData, studentName: e.target.value})} placeholder="John Doe" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full flex h-10 rounded-xl border border-border-default bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus transition-all"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Max Monthly Budget (₹)</Label>
                  <Input type="number" min="0" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <select 
                      value={formData.roomType}
                      onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                      className="w-full h-10 rounded-xl border border-border-default bg-surface px-3 text-sm text-text-primary"
                    >
                      <option>Shared</option>
                      <option>Single</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Floor Preference</Label>
                    <select 
                      value={formData.floorPreference}
                      onChange={(e) => setFormData({...formData, floorPreference: e.target.value})}
                      className="w-full h-10 rounded-xl border border-border-default bg-surface px-3 text-sm text-text-primary"
                    >
                      <option>Any</option>
                      <option>Lower</option>
                      <option>Higher</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personality Questionnaire */}
          <Card className="relative overflow-hidden border border-border-default shadow-sm bg-surface">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-primary">
                <Sparkles className="w-5 h-5 mr-2" /> Matchmaking AI Questionnaire
              </CardTitle>
              <p className="text-xs text-text-muted">Answer honestly. Our Gemini LLM will read these traits to assign highly compatible roommates!</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-3 bg-surface-hover p-4 rounded-xl border border-border-subtle shadow-sm">
                  <Label className="text-text-primary block text-base">Your Sleep Schedule</Label>
                  <p className="text-xs text-text-muted mb-3 block">Do you study late or wake up early?</p>
                  <div className="flex gap-2">
                    {['Night Owl', 'Flexible', 'Early Bird'].map(opt => (
                      <button type="button" key={opt} onClick={() => handlePersonalityChange('sleepSchedule', opt)}
                        className={`flex-1 py-1.5 px-3 text-sm rounded-lg border transition-all ${formData.personalityAnswers.sleepSchedule === opt ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-border-default text-text-secondary hover:bg-surface-elevated'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 bg-surface-hover p-4 rounded-xl border border-border-subtle shadow-sm">
                  <Label className="text-text-primary block text-base">Cleanliness Standards</Label>
                  <p className="text-xs text-text-muted mb-3 block">How tidy do you prefer your personal space?</p>
                  <div className="flex gap-2">
                    {['Extremely Neat', 'Neat', 'Relaxed'].map(opt => (
                      <button type="button" key={opt} onClick={() => handlePersonalityChange('cleanliness', opt)}
                        className={`flex-1 py-1.5 px-3 text-sm rounded-lg border transition-all ${formData.personalityAnswers.cleanliness === opt ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-border-default text-text-secondary hover:bg-surface-elevated'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 bg-surface-hover p-4 rounded-xl border border-border-subtle shadow-sm">
                  <Label className="text-text-primary block text-base">Social Energy</Label>
                  <p className="text-xs text-text-muted mb-3 block">Are you looking to party and chat, or keep to yourself?</p>
                  <div className="flex gap-2">
                    {['Extrovert', 'Ambivert', 'Introvert'].map(opt => (
                      <button type="button" key={opt} onClick={() => handlePersonalityChange('social', opt)}
                        className={`flex-1 py-1.5 px-3 text-sm rounded-lg border transition-all ${formData.personalityAnswers.social === opt ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-border-default text-text-secondary hover:bg-surface-elevated'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full relative z-10 shadow-md">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <><UserCheck className="w-5 h-5 mr-2" /> Lock Preferences & Apply</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
