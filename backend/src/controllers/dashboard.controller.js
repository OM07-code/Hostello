const User = require('../models/User');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Leave = require('../models/Leave');
const Hostel = require('../models/Hostel');

exports.getDashboardStats = async (req, res) => {
  try {
    // For a multi-tenant app, you'd extract hostelId from req.user (JWT),
    // but for now, we'll allow passing it via query or just compute globally if not passed.
    const { hostelId } = req.query;
    const filter = hostelId ? { hostelId } : {};

    const totalStudents = await User.countDocuments({ ...filter, role: 'Student' });
    
    // Occupied rooms: rooms with at least 1 occupant
    // Note: If room's occupants isn't tracking properly based on hostelId, we just filter Rooms by hostelId
    const occupiedRooms = await Room.countDocuments({ ...filter, 'occupants.0': { $exists: true } });
    const totalRooms = await Room.countDocuments(filter);

    const pendingPayments = await Payment.countDocuments({ ...filter, status: 'Pending' });
    const activeComplaints = await Complaint.countDocuments({ ...filter, status: 'Pending' });
    const pendingLeaves = await Leave.countDocuments({ ...filter, status: 'Pending' });

    res.json({
      totalStudents,
      occupiedRooms,
      totalRooms,
      pendingPayments,
      activeComplaints,
      pendingLeaves
    });

  } catch (err) {
    console.error("Error fetching dashboard stats", err);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

exports.getDashboardCharts = async (req, res) => {
  try {
    const { hostelId } = req.query;
    const filter = hostelId ? { hostelId } : {};

    // 1. Occupancy Data
    const occupiedRooms = await Room.countDocuments({ ...filter, 'occupants.0': { $exists: true } });
    const totalRooms = await Room.countDocuments(filter);
    const vacantRooms = Math.max(0, totalRooms - occupiedRooms);

    const occupancyRate = [
      { name: 'Occupied', value: occupiedRooms },
      { name: 'Vacant', value: vacantRooms }
    ];

    // 2. Revenue Trends (Mocking last 6 months for Demo using static calculation or aggregation)
    // In a real app we aggregate by month using $group.
    // For simplicity, we'll just mock 6 months or parse the DB if seeded.
    const recentPayments = await Payment.find({ ...filter, status: 'Paid' }).sort({ date: -1 }).limit(100);
    // Grouping manually for simple mapping
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let revenueDataMap = {};
    recentPayments.forEach(p => {
        if(p.date) {
            const m = months[p.date.getMonth()];
            revenueDataMap[m] = (revenueDataMap[m] || 0) + p.amount;
        }
    });
    // Fill empty months for visual
    let revenueTrends = [];
    const currentMonth = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
        let mIndex = (currentMonth - i + 12) % 12;
        let pMonth = months[mIndex];
        revenueTrends.push({ month: pMonth, revenue: revenueDataMap[pMonth] || 0 });
    }

    // 3. Leave Trends (Home Visit vs Medical vs Event)
    const leaves = await Leave.find(filter);
    let leaveDataMap = { 'Home Visit': 0, 'Medical': 0, 'Event': 0, 'Other': 0 };
    leaves.forEach(l => {
        leaveDataMap[l.leaveType] = (leaveDataMap[l.leaveType] || 0) + 1;
    });
    const leaveTrends = Object.keys(leaveDataMap).map(key => ({
        name: key,
        value: leaveDataMap[key]
    }));

    res.json({
      occupancyRate,
      revenueTrends,
      leaveTrends
    });

  } catch (err) {
    console.error("Error fetching dashboard charts", err);
    res.status(500).json({ error: 'Failed to fetch dashboard charts' });
  }
};
