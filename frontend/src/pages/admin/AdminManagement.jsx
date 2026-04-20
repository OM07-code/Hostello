import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, Home, AlertCircle, Bell, Trash2, Edit } from 'lucide-react';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import toast from 'react-hot-toast';

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState('students');
  const [data, setData] = useState({
    students: [], rooms: [], complaints: [], notices: []
  });
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tab: '', id: null });

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/${tab}`);
      setData(prev => ({ ...prev, [tab]: res.data }));
    } catch (err) {
      console.error(`Failed to fetch ${tab}`, err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    const { tab, id } = deleteModal;
    try {
      await axios.delete(`http://localhost:5000/api/admin/${tab}/${id}`);
      toast.success(`${tab.slice(0, -1)} deleted successfully.`);
      fetchData(tab);
    } catch (err) {
      console.error(`Failed to delete ${tab}`, err);
      toast.error(`Failed to delete ${tab.slice(0, -1)}.`);
    }
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/complaints/${id}`, { status: newStatus });
      toast.success('Status updated');
      fetchData('complaints'); // Refresh
    } catch (err) {
      console.error('Failed to update complaint status', err);
      toast.error('Failed to update status');
    }
  };

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: Home },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'notices', label: 'Notices', icon: Bell }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, tab: '', id: null })}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to permanently delete this record? This action cannot be undone."
        confirmText="Delete Record"
        isDestructive={true}
      />

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Hostel Management</h2>
        <p className="text-text-muted">Manage students, physical rooms, and administrative workflows.</p>
      </div>

      <div className="flex space-x-2 bg-surface p-1 rounded-lg w-fit border border-border-default shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md transition-all text-sm font-medium ${
              activeTab === tab.id 
                ? 'bg-surface-hover text-primary shadow-sm border border-border-subtle' 
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/50 border border-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border-default pb-4">
          <CardTitle className="capitalize text-lg text-text-primary">{activeTab} Database</CardTitle>
          <button className="bg-primary hover:bg-primary-hover text-text-primary px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm">
            + Add New
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-strong bg-surface-hover text-text-muted text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name / Title</th>
                  <th className="p-4 font-semibold">Status / Info</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-surface">
                {loading ? (
                  // Skeleton Loader
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4"><div className="h-4 bg-surface-hover rounded w-16"></div></td>
                      <td className="p-4"><div className="h-4 bg-surface-hover rounded w-32"></div></td>
                      <td className="p-4"><div className="h-4 bg-surface-hover rounded w-24"></div></td>
                      <td className="p-4"><div className="h-4 bg-surface-hover rounded w-12 ml-auto"></div></td>
                    </tr>
                  ))
                ) : data[activeTab].length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan="4" className="text-center p-12">
                      <div className="flex flex-col items-center justify-center text-text-muted">
                        <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm font-medium">No records found</p>
                        <p className="text-xs mt-1">There are currently no {activeTab} in the database.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  data[activeTab].map((item, i) => (
                    <tr key={item._id} className="hover:bg-surface-hover/50 transition-colors group">
                      <td className="p-4 text-sm text-text-muted font-mono">...{item._id.substring(item._id.length - 6)}</td>
                      <td className="p-4 font-medium text-text-primary">
                        {item.name || item.title || item.roomNumber}
                      </td>
                      <td className="p-4 text-sm text-text-secondary">
                        {activeTab === 'complaints' ? (
                          <select 
                            className="bg-surface text-text-primary border border-border-strong rounded-md p-1.5 text-xs focus:ring-1 focus:ring-border-focus focus:outline-none"
                            value={item.status}
                            onChange={(e) => updateComplaintStatus(item._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-surface border border-border-subtle text-xs">
                             {item.role || item.status || item.type || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A')}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-surface rounded-md text-primary border border-transparent hover:border-border-default transition-all shadow-sm">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, tab: activeTab, id: item._id })}
                            className="p-1.5 hover:bg-surface rounded-md text-error border border-transparent hover:border-border-default transition-all shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
