const Payment = require('../models/Payment');
const crypto = require('crypto');

// User: Get fees (both pending and paid for history)
exports.getFees = async (req, res) => {
  try {
    // We will bypass actual userId checking since auth isn't fully hooked up
    // Just fetch all or a placeholder list for the frontend to digest.
    let payments = await Payment.find().sort({ date: -1 });
    
    // Seed some mock data if DB is empty for demonstration purposes
    if (payments.length === 0) {
      const mockPayments = [
        { amount: 5000, status: 'Pending', dueDate: new Date(Date.now() + 86400000 * 5), title: 'Hostel Maintenance Fee' },
        { amount: 15000, status: 'Paid', paymentMethod: 'Card', transactionId: 'TXN-123456789', date: new Date(Date.now() - 86400000 * 30), title: 'Semester 1 Hostel Fee' }
      ];
      payments = await Payment.insertMany(mockPayments);
    }

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// User: Pay a fee
exports.payFee = async (req, res) => {
  const { paymentId, paymentMethod } = req.body;
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: 'Payment record not found' });
    if (payment.status === 'Paid') return res.status(400).json({ error: 'Already paid' });

    payment.status = 'Paid';
    payment.paymentMethod = paymentMethod;
    // Generate a random transaction ID mock
    payment.transactionId = 'TXN-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    payment.date = new Date(); // update payment date

    await payment.save();
    res.json({ message: 'Payment successful', payment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Assign a new fee
exports.assignFee = async (req, res) => {
  const { amount, dueDate, title } = req.body;
  try {
    const newPayment = new Payment({
      amount,
      dueDate,
      title,
      status: 'Pending'
    });
    await newPayment.save();
    res.json({ message: 'Fee assigned successfully', payment: newPayment });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
