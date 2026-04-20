const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const Hostel = require('./src/models/Hostel');
const Room = require('./src/models/Room');
const Complaint = require('./src/models/Complaint');
const Payment = require('./src/models/Payment');
const Leave = require('./src/models/Leave');
const Notice = require('./src/models/Notice');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostello')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Hostel.deleteMany({}),
      Room.deleteMany({}),
      Complaint.deleteMany({}),
      Payment.deleteMany({}),
      Leave.deleteMany({}),
      Notice.deleteMany({})
    ]);

    console.log('Creating Hostel...');
    const hostel = new Hostel({
      name: 'Tata Tech Hostel',
      address: 'Sector 5, Advanced Tech Park, Mumbai',
      totalRooms: 120,
      totalFloors: 4,
      amenities: ['WiFi', 'Mess', 'Gym']
    });
    await hostel.save();

    console.log('Creating Admin...');
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@tata.com',
      password: 'password123', // Will be hashed via pre('save') hook
      role: 'Admin',
      hostelId: hostel._id,
    });
    await admin.save();

    console.log('Creating Students...');
    const curDate = new Date();
    const students = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@student.com',
        // Pre-save doesn't run on insertMany, so we must manually hash.
        password: await bcrypt.hash('password123', 10),
        role: 'Student',
        hostelId: hostel._id,
        mobileNumber: '9876543210'
      },
      {
        name: 'Jane Smith',
        email: 'jane@student.com',
        password: await bcrypt.hash('password123', 10),
        role: 'Student',
        hostelId: hostel._id,
        mobileNumber: '8876543211'
      }
    ]);

    console.log('Creating Rooms...');
    await Room.insertMany([
      { roomNumber: '101', floor: 1, type: 'Shared', gender: 'Male', price: 15000, isAvailable: false, hostelId: hostel._id, occupants: [students[0]._id] },
      { roomNumber: '102', floor: 1, type: 'Single', gender: 'Male', price: 20000, isAvailable: false, hostelId: hostel._id, occupants: [students[1]._id] },
      { roomNumber: '103', floor: 1, type: 'Shared', gender: 'Male', price: 15000, isAvailable: true, hostelId: hostel._id, occupants: [] },
      { roomNumber: '201', floor: 2, type: 'Shared', gender: 'Female', price: 15000, isAvailable: true, hostelId: hostel._id, occupants: [] }
    ]);

    console.log('Creating Complaints...');
    await Complaint.insertMany([
      {
        studentId: students[0]._id,
        hostelId: hostel._id,
        title: 'Leaky Faucet in Bathroom',
        description: 'The tap in room 101 sink has been leaking since yesterday.',
        category: 'Maintenance',
        status: 'Pending',
        createdAt: new Date(curDate.getTime() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        studentId: students[1]._id,
        hostelId: hostel._id,
        title: 'WiFi Router Dead',
        description: 'Floor 1 router is completely unresponsive.',
        category: 'Other',
        status: 'Resolved',
        resolvedAt: new Date(curDate.getTime() - 1 * 60 * 60 * 1000),
        createdAt: new Date(curDate.getTime() - 5 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Creating Payments...');
    await Payment.insertMany([
      {
        userId: students[0]._id,
        hostelId: hostel._id,
        amount: 15000,
        purpose: 'Semester Fee',
        status: 'Paid',
        date: new Date(curDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        userId: students[1]._id,
        hostelId: hostel._id,
        amount: 8000,
        purpose: 'Mess Fee',
        status: 'Paid',
        date: new Date(curDate.getTime() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        userId: students[0]._id,
        hostelId: hostel._id,
        amount: 3000,
        purpose: 'Late Fine',
        status: 'Pending'
      }
    ]);

    console.log('Creating Leaves...');
    await Leave.insertMany([
      {
        userId: students[0]._id,
        hostelId: hostel._id,
        leaveType: 'Home Visit',
        fromDate: new Date(curDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        toDate: new Date(curDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        reason: 'Family event',
        status: 'Pending'
      }
    ]);

    console.log('Creating Notices...');
    await Notice.insertMany([
      {
        title: 'Welcome to Fall Semester',
        content: 'Please assure your fees are fully cleared before 1st Sept.',
        hostelId: hostel._id,
        authorId: admin._id,
        createdAt: curDate
      }
    ]);

    console.log('--- SEEDING COMPLETE ---');
    console.log('\nAdmin Login: admin@tata.com / password123');
    console.log('Student Login: john@student.com / password123\n');
    process.exit();

  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
};

seedDatabase();
