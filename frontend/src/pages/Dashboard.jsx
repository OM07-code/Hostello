import { Users, Bed, CreditCard, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  const stats = [
    { title: 'Total Students', value: '1,248', icon: Users, change: '+12%', color: 'from-blue-500 to-cyan-400' },
    { title: 'Rooms Available', value: '45', icon: Bed, change: '-2', color: 'from-purple-500 to-pink-500' },
    { title: 'Pending Fees', value: '$12,450', icon: CreditCard, change: '-5%', color: 'from-amber-400 to-orange-500' },
    { title: 'Active Complaints', value: '12', icon: Activity, change: '+3', color: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
        <p className="text-text-muted">Welcome back! Here's an overview of your hostel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-text-muted">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <stat.icon className="h-4 w-4 text-text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary mb-1">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-text-primary">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-text-muted border-2 border-dashed border-border-default rounded-lg">
              Chart / Feed Placeholder
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-text-primary">Room Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-text-muted border-2 border-dashed border-border-default rounded-lg">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
