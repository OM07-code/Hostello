import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, BedSingle, Receipt, AlertTriangle, CalendarClock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axios from 'axios';
import { useTheme } from '../../components/ThemeProvider';

export default function AdminDashboard() {
  const { theme } = useTheme();
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    occupiedRooms: 0,
    totalRooms: 0,
    pendingPayments: 0,
    activeComplaints: 0,
    pendingLeaves: 0
  });

  const [charts, setCharts] = useState({
    occupancyRate: [],
    revenueTrends: [],
    leaveTrends: []
  });

  const [loading, setLoading] = useState(true);

  // Mock Hostel Data for Demo
  const activeHostel = {
    name: "Tata Hostel",
    address: "Sector 5, Advanced Tech Park",
    totalRooms: 80,
    totalFloors: 4
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats');
      const chartsRes = await axios.get('http://localhost:5000/api/dashboard/charts');
      
      setStats(statsRes.data);
      setCharts(chartsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error", err);
      setLoading(false);
    }
  };

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const chartColors = {
    grid: isDark ? '#334155' : '#E2E8F0',
    text: isDark ? '#94A3B8' : '#64748B',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? '#334155' : '#E2E8F0',
    tooltipText: isDark ? '#F8FAFC' : '#0F172A',
    occupied: isDark ? '#10B981' : '#2563EB',
    vacant: isDark ? '#334155' : '#E2E8F0',
  };

  const COLORS = [chartColors.occupied, chartColors.vacant];
  const LEAVE_COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#64748B'];

  if (loading) return (
     <div className="space-y-6 animate-pulse">
       <div className="h-24 bg-surface rounded-2xl w-full"></div>
       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
         {Array(5).fill(0).map((_, i) => <div key={i} className="h-28 bg-surface rounded-xl"></div>)}
       </div>
       <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-[350px] bg-surface rounded-xl lg:col-span-2"></div>
          <div className="h-[350px] bg-surface rounded-xl"></div>
       </div>
     </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-surface p-6 rounded-2xl border border-border-default shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">
            {activeHostel.name} Admin
          </h2>
          <p className="text-text-muted mt-1 flex items-center gap-2 text-sm font-medium">
             <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
             {activeHostel.address} • {activeHostel.totalRooms} Rooms • {activeHostel.totalFloors} Floors
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Live Analytics System</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Students", value: stats.totalStudents, icon: Users, color: "text-primary" },
          { title: "Available Rooms", value: stats.totalRooms - stats.occupiedRooms, icon: BedSingle, color: "text-success" },
          { title: "Pending Dues", value: stats.pendingPayments, icon: Receipt, color: "text-tertiary" },
          { title: "Pending Complaints", value: stats.activeComplaints, icon: AlertTriangle, color: "text-error" },
          { title: "Pending Leaves", value: stats.pendingLeaves, icon: CalendarClock, color: "text-secondary" },
        ].map((kpi, idx) => (
          <Card key={idx}>
            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
              <div className={`p-3 rounded-full bg-surface-hover border border-border-subtle ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-text-muted mb-1">{kpi.title}</p>
                <h3 className="text-3xl font-black text-text-primary">{kpi.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Revenue Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-text-primary uppercase tracking-wider">Revenue Collections Tracking</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueTrends}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.occupied} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={chartColors.occupied} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke={chartColors.occupied} fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold text-text-primary uppercase tracking-wider">Room Occupancy Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.occupancyRate.length ? charts.occupancyRate : [{name:'Empty', value:1}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(charts.occupancyRate.length ? charts.occupancyRate : [{name:'Empty', value:1}]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText, borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
               <div className="flex items-center text-xs font-medium text-text-secondary"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: chartColors.occupied}}></span> Occupied</div>
               <div className="flex items-center text-xs font-medium text-text-secondary"><span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: chartColors.vacant}}></span> Vacant</div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Trends */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-text-primary uppercase tracking-wider">Leave Categorizations</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.leaveTrends} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
                <XAxis type="number" stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke={chartColors.text} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{fill: chartColors.grid, opacity: 0.4}} contentStyle={{ backgroundColor: chartColors.tooltipBg, borderColor: chartColors.tooltipBorder, color: chartColors.tooltipText, borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {charts.leaveTrends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={LEAVE_COLORS[index % LEAVE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
