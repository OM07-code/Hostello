const Room = require('../models/Room');
const Preference = require('../models/Preference');
const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config(); // Load backend/.env
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: path.join(__dirname, '../../../../.env') }); // Fallback 1: src -> backend -> Hostello -> .env
  if (!process.env.GEMINI_API_KEY) {
     dotenv.config({ path: path.join(__dirname, '../../../.env') }); // Fallback 2: src -> controllers -> backend -> .env
  }
}

// Initialize Mock Data if empty
exports.seedData = async (req, res) => {
  try {
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      await Room.insertMany([
        { roomNumber: '101', capacity: 2, type: 'Shared', floor: 1, gender: 'Male', price: 5000 },
        { roomNumber: '102', capacity: 1, type: 'Single', floor: 1, gender: 'Male', price: 9000 },
        { roomNumber: '201', capacity: 2, type: 'Shared', floor: 2, gender: 'Female', price: 5000 },
        { roomNumber: '202', capacity: 2, type: 'Shared', floor: 2, gender: 'Female', price: 5500 }
      ]);
      await Preference.insertMany([
        { studentName: 'Rahul', budget: 6000, roomType: 'Shared', floorPreference: 'Any', gender: 'Male', personalityAnswers: { sleepSchedule: 'Night Owl', cleanliness: 'Neat', social: 'Introvert' } },
        { studentName: 'Amit', budget: 6000, roomType: 'Shared', floorPreference: 'Lower', gender: 'Male', personalityAnswers: { sleepSchedule: 'Night Owl', cleanliness: 'Relaxed', social: 'Extrovert' } },
        { studentName: 'Priya', budget: 8000, roomType: 'Shared', floorPreference: 'Any', gender: 'Female', personalityAnswers: { sleepSchedule: 'Early Bird', cleanliness: 'Neat', social: 'Ambivert' } },
        { studentName: 'Neha', budget: 6000, roomType: 'Shared', floorPreference: 'Higher', gender: 'Female', personalityAnswers: { sleepSchedule: 'Early Bird', cleanliness: 'Neat', social: 'Extrovert' } }
      ]);
    }
    res.json({ message: 'Seed complete' });
  } catch (err) {
    res.status(500).json({ error: 'Seed failed' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const prefs = await Preference.find();
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
};

exports.addPreference = async (req, res) => {
  try {
    const newPref = new Preference(req.body);
    await newPref.save();
    res.json({ message: 'Preference saved', preference: newPref });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save preference' });
  }
};

exports.runGeminiAllocation = async (req, res) => {
  try {
    const preferences = await Preference.find({ isAllocated: false });
    const roomsArray = await Room.find({ isAvailable: true });
    
    // Filter rooms to only have actual capacity
    const rooms = roomsArray.filter(r => r.capacity - r.occupants.length > 0);

    if (preferences.length === 0 || rooms.length === 0) {
      return res.status(400).json({ error: 'No unallocated students or available rooms found.' });
    }

    const payload = {
      unassignedStudents: preferences.map(p => ({
        id: p._id,
        name: p.studentName,
        budget: p.budget,
        roomType: p.roomType,
        gender: p.gender,
        floorPreference: p.floorPreference,
        personality: p.personalityAnswers
      })),
      availableRooms: rooms.map(r => ({
        id: r._id,
        roomNumber: r.roomNumber,
        availableCapacity: r.capacity - r.occupants.length,
        type: r.type,
        floor: r.floor,
        gender: r.gender,
        price: r.price
      }))
    };

    let allocations = [];

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'undefined') {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a Hostel Allocation AI. I will provide a JSON object with unassignedStudents and availableRooms.
      Your task is to assign students to rooms based on constraints:
      1. Hard constraint: GENDER MUST MATCH between student and room.
      2. Hard constraint: DO NOT exceed a room's availableCapacity.
      3. Optimize budget (room price <= student budget), roomType (Single/Shared), and floorPreference.
      4. Crucial: Use 'personality' to match roommates in 'Shared' rooms. Pair similar sleep schedules and cleanliness types when possible.
      
      Respond STRICTLY with a valid JSON array of objects mapping student ids to room ids. 
      Format: [ { "studentId": "id", "roomId": "id", "reasoning": "short explanation" } ]
      No markdown, no markdown blocks, just raw JSON.

      Payload: ${JSON.stringify(payload)}
      `;

      console.log('Sending to Gemini...');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let responseText = response.text;
      // Strip markdown code block if gemini ignores instruction
      if (responseText.startsWith('```json')) {
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
      }

      allocations = JSON.parse(responseText.trim());
    } else {
      console.log('No GEMINI_API_KEY found, running local mock heuristic mapper...');
      // Fallback simple mapper
      let tempRooms = JSON.parse(JSON.stringify(payload.availableRooms));
      payload.unassignedStudents.forEach(student => {
        let bestRoom = tempRooms.find(r => r.gender === student.gender && r.availableCapacity > 0);
        if (bestRoom) {
          allocations.push({
            studentId: student.id,
            roomId: bestRoom.id,
            reasoning: `Mock AI Assigned based on primary Gender match.`
          });
          bestRoom.availableCapacity -= 1;
        }
      });
    }

    // Apply allocations
    let successes = 0;
    for (const alloc of allocations) {
      if (!alloc.roomId || !alloc.studentId) continue;
      
      const pref = await Preference.findById(alloc.studentId);
      const room = await Room.findById(alloc.roomId);

      if (pref && room && room.capacity > room.occupants.length) {
        pref.isAllocated = true;
        pref.allocatedRoomId = room._id;
        await pref.save();

        room.occupants.push(pref._id); // Use the preference ID as mock user ID for tracking
        if (room.occupants.length >= room.capacity) {
          room.isAvailable = false;
        }
        await room.save();
        successes++;
      }
    }

    res.json({ message: 'AI Allocation successful!', results: allocations, processed: successes });

  } catch (err) {
    console.error("Gemini Allocation Error", err);
    res.status(500).json({ error: 'Failed to execute AI allocation.', details: err.message, stack: err.stack });
  }
};

exports.resetAllocations = async (req, res) => {
  try {
    await Preference.updateMany({}, { isAllocated: false, allocatedRoomId: null });
    await Room.updateMany({}, { occupants: [], isAvailable: true });
    res.json({ message: 'System Reset' });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed' });
  }
};
