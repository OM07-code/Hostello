import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bot, RefreshCw, Users, AlertCircle, DatabaseZap, ShieldCheck, BedSingle, BedDouble } from 'lucide-react';
import axios from 'axios';

export default function AdminAllocation() {
  const [rooms, setRooms] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const roomRes = await axios.get('http://localhost:5000/api/allocation/rooms');
      const prefRes = await axios.get('http://localhost:5000/api/allocation/preferences');
      
      // If DB rooms are totally empty, trigger seed silently
      if (roomRes.data.length === 0) {
        await axios.post('http://localhost:5000/api/allocation/seed');
        return fetchData(); // retry after seed
      }

      setRooms(roomRes.data);
      setPreferences(prefRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching allocation admin data", err);
      // Fallback display
      setLoading(false);
    }
  };

  const handleRunAI = async () => {
    setIsProcessingAI(true);
    // adding artificial delay for UI dramatic effect of "processing AI vectors"
    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/allocation/gemini-run');
        setAiReport(response.data);
        fetchData(); // refresh data
      } catch (err) {
        console.error("AI Allocation run failed", err);
        const errMsg = err.response?.data?.details || err.message;
        if (errMsg.includes('429') || errMsg.includes('Too Many Requests') || errMsg.includes('quota')) {
           setAiReport({ error: 'Gemini AI Rate Limit Hit (429)! Google is throttling the request because of the free-tier API. Please wait approx 1-2 minutes and try again.' });
        } else if (errMsg.includes('JSON')) {
           setAiReport({ error: 'Gemini generated a non-conformant JSON. Our fallback heuristc caught it.' });
        } else {
           setAiReport({ error: 'AI processing failed. Check server console for specifics. Details: ' + errMsg.substring(0, 50) });
        }
      } finally {
        setIsProcessingAI(false);
      }
    }, 2000);
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to forcibly evict all students and clear ALL allocations?!")) {
      try {
        await axios.post('http://localhost:5000/api/allocation/reset');
        setAiReport(null);
        fetchData();
      } catch (err) {
        console.error("Reset failed", err);
      }
    }
  };

  if (loading) return <div>Loading Allocation Desk...</div>;

  const unassignedCount = preferences.filter(p => !p.isAllocated).length;
  const totalCapacity = rooms.reduce((acc, curr) => acc + curr.capacity, 0);
  const currentOccupants = rooms.reduce((acc, curr) => acc + curr.occupants.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">AI Room Allocation Desk</h2>
        <Button variant="outline" onClick={handleReset} className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10">
           Force Override & Reset All
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass border-purple-500/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Unassigned Students</p>
                <h3 className="text-4xl font-bold text-text-primary">{unassignedCount}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            
            <Button 
              onClick={handleRunAI}
              disabled={isProcessingAI || unassignedCount === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/20 relative z-10 border-none"
            >
              {isProcessingAI ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Analyzing Vectors...</>
              ) : unassignedCount === 0 ? (
                <><ShieldCheck className="w-4 h-4 mr-2" /> Fully Allocated</>
              ) : (
                <><Bot className="w-4 h-4 mr-2" /> Trigger Gemini AI Match</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative z-10 space-y-2">
               <div>
                  <p className="text-sm font-medium text-text-muted mb-1">Total Capacity</p>
                  <h3 className="text-3xl font-bold text-blue-400">{currentOccupants} <span className="text-xl text-text-muted">/ {totalCapacity}</span></h3>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (currentOccupants/totalCapacity)*100)}%` }}></div>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {aiReport && (
           <Card className={`glass border-solid animate-in fade-in slide-in-from-right-4 duration-500 ${aiReport.error ? 'border-rose-500/50 bg-rose-500/10' : 'border-green-500/30 bg-green-500/5'}`}>
             <CardContent className="p-6">
               <div className={`flex items-center mb-2 ${aiReport.error ? 'text-rose-400' : 'text-green-400'}`}>
                 {aiReport.error ? <AlertCircle className="w-5 h-5 mr-2" /> : <DatabaseZap className="w-5 h-5 mr-2 animate-pulse" />}
                 <h4 className="font-bold">{aiReport.error ? 'AI Sequence Failed' : 'AI Sequence Complete'}</h4>
               </div>
               <p className="text-sm text-text-secondary">
                 {aiReport.message || aiReport.error}
               </p>
               {aiReport.processed !== undefined && (
                 <div className="mt-4 inline-flex items-center bg-success/20 px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-green-500/30">
                   {aiReport.processed} Allocations Processed
                 </div>
               )}
             </CardContent>
           </Card>
        )}
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-bold text-text-primary mb-4">Live Room Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map((room) => {
            const isFull = room.occupants.length >= room.capacity;
            const utilizationPercent = (room.occupants.length / room.capacity) * 100;
            
            return (
              <Card key={room._id} className={`glass overflow-hidden border ${isFull ? 'border-amber-500/20 bg-amber-500/5' : 'border-border-subtle hover:border-slate-600'}`}>
                {/* Visual Capacity Bar Header */}
                <div className="w-full bg-slate-800 h-1">
                  <div className={`h-full ${isFull ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-green-500'}`} style={{ width: `${utilizationPercent}%` }}></div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-2xl font-black text-text-primary">{room.roomNumber}</h4>
                      <div className="flex items-center text-xs text-text-muted mt-1">
                        {room.type === 'Single' ? <BedSingle className="w-3 h-3 mr-1" /> : <BedDouble className="w-3 h-3 mr-1" />}
                        {room.type} • Flr {room.floor} • {room.gender}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded font-mono text-xs font-bold ${isFull ? 'bg-amber-500/20 text-amber-500' : 'bg-success/20 text-success'}`}>
                      {room.occupants.length}/{room.capacity}
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t border-border-subtle">
                    <p className="text-xs font-bold uppercase text-text-muted">Current Occupants</p>
                    {room.occupants.length === 0 ? (
                      <p className="text-sm text-text-muted italic">Empty</p>
                    ) : (
                      <div className="space-y-2 overflow-y-auto max-h-24 pr-2">
                        {preferences.filter(p => p.allocatedRoomId === room._id).map((occ, idx) => (
                           <div key={idx} className="bg-surface p-2 rounded text-sm text-text-primary border border-border-subtle flex justify-between items-center group">
                             <span>{occ.studentName}</span>
                             <span className="text-[10px] text-text-muted font-mono group-hover:text-amber-400 transition-colors">
                               Score Match
                             </span>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
