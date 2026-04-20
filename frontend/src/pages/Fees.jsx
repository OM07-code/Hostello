import { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, CreditCard, Landmark, QrCode, Download, Clock, History, AlertCircle, PhoneCall, FileText, ChevronLeft, ChevronRight, Hourglass, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function Fees() {
  const queryClient = useQueryClient();

  const { data: fees = [], isLoading } = useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const res = await axios.get('/payments/fees');
      return res.data;
    },
    placeholderData: [
      { _id: '1', amount: 5000, status: 'Pending', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), title: 'Hostel Maintenance Fee', transactionId: '#HST-88122-CQ', date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { _id: '2', amount: 15000, status: 'Paid', paymentMethod: 'Card', transactionId: '#HST-98422-AX', date: new Date(Date.now() - 86400000 * 30).toISOString(), title: 'Semester 1 Hostel Fee' },
      { _id: '3', amount: 850, status: 'Paid', paymentMethod: 'UPI', transactionId: '#HST-92104-BY', date: new Date(Date.now() - 86400000 * 60).toISOString(), title: 'Mess Fee' },
      { _id: '4', amount: 850, status: 'Paid', paymentMethod: 'Bank', transactionId: '#HST-85421-DW', date: new Date(Date.now() - 86400000 * 90).toISOString(), title: 'Mess Fee' }
    ]
  });

  const payMutation = useMutation({
    mutationFn: async (payload) => {
      await new Promise(r => setTimeout(r, 1500));
      return await axios.post('/payments/pay', payload);
    },
    onSuccess: () => {
      toast.success('Payment completed successfully!');
      queryClient.invalidateQueries(['fees']);
    },
    onError: (error, variables) => {
      if (error.code === 'ERR_NETWORK' || !error.response) {
         queryClient.setQueryData(['fees'], (old) => old.map(f => f._id === variables.paymentId ? { ...f, status: 'Paid', transactionId: '#HST-' + Math.floor(Math.random()*100000) + '-XX', date: new Date().toISOString(), paymentMethod: variables.paymentMethod } : f));
         toast.success('Fallback: Local state updated successfully!');
      } else {
         toast.error(error.response?.data?.message || 'Payment simulation failed.');
      }
    }
  });

  const handlePrintReceipt = (fee) => {
    if(fee.status === 'Pending') {
       toast.error("Can't print receipt for pending transaction.");
       return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${fee.transactionId}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 20px; }
            .title { color: #22c55e; font-size: 24px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Hostello</div>
            <p>Official Payment Receipt</p>
          </div>
          <h2>Transaction Details</h2>
          <table>
            <tr><th>Transaction ID</th><td>${fee.transactionId}</td></tr>
            <tr><th>Date</th><td>${new Date(fee.date).toLocaleString()}</td></tr>
            <tr><th>Fee Title</th><td>${fee.title}</td></tr>
            <tr><th>Amount Paid</th><td>₹${fee.amount.toLocaleString()}</td></tr>
            <tr><th>Payment Method</th><td>${fee.paymentMethod || 'Online'}</td></tr>
            <tr><th>Status</th><td style="color: #22c55e; font-weight: bold;">SUCCESS</td></tr>
          </table>
          <div class="footer">Thank you for your payment.<br/>This is a computer-generated document and requires no signature.</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) return <div className="text-text-primary animate-pulse p-8">Loading Financials...</div>;

  const pendingFees = fees.filter(f => f.status === 'Pending');
  const paidFees = fees.filter(f => f.status === 'Paid');
  const totalDue = pendingFees.reduce((acc, curr) => acc + curr.amount, 0);
  const nextDueDate = pendingFees.length > 0 ? pendingFees[0].dueDate : null;
  const lastPayment = paidFees.length > 0 ? paidFees[0] : null;

  const handlePay = (method) => {
    if (pendingFees.length === 0) {
      toast.success('No pending dues to pay!');
      return;
    }
    payMutation.mutate({
      paymentId: pendingFees[0]._id, // Pay oldest pending fee
      paymentMethod: method
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Fees & Payments</h1>
        <p className="text-text-muted mt-1">Manage your residency financial status and payment history.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Balance */}
        <div className="bg-[#415bc2] rounded-3xl p-6 text-white flex flex-col justify-between h-48 shadow-lg shadow-blue-900/20">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Current Balance</p>
              <h3 className="text-4xl font-black mt-2 tracking-tight">₹{totalDue.toLocaleString()}</h3>
           </div>
           {totalDue > 0 ? (
             <p className="text-xs font-medium flex items-center bg-white/10 w-fit px-3 py-1.5 rounded-full mt-4 border border-white/20 hover:bg-white/20 transition-colors">
               <Clock className="w-3.5 h-3.5 mr-1.5" /> Due soon for next cycle
             </p>
           ) : (
             <p className="text-xs font-medium flex items-center bg-white/10 w-fit px-3 py-1.5 rounded-full mt-4 border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> All dues cleared
             </p>
           )}
        </div>

        {/* Last Payment */}
        <div className="bg-surface rounded-3xl p-6 border border-border-default shadow-sm flex flex-col justify-between h-48 hover:border-border-focus transition-colors group">
           <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[#415bc2] dark:text-blue-400 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
           </div>
           <div>
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1">Last Payment</p>
              <h3 className="text-2xl font-black text-text-primary tracking-tight">₹{lastPayment ? lastPayment.amount.toLocaleString() : '0'}</h3>
              <p className="text-xs text-text-secondary mt-1 font-medium tracking-wide">
                 {lastPayment ? `Paid on ${new Date(lastPayment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : 'No recent payments'}
              </p>
           </div>
        </div>

        {/* Next Due Date */}
        <div className="bg-surface rounded-3xl p-6 border border-border-default shadow-sm flex flex-col justify-between h-48 hover:border-border-focus transition-colors group">
           <div className="w-10 h-10 rounded-full bg-[#fce9e6] dark:bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
           </div>
           <div>
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1">Next Due Date</p>
              <h3 className="text-2xl font-black text-text-primary tracking-tight">
                 {nextDueDate ? new Date(nextDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'None'}
              </h3>
              <p className="text-xs text-text-secondary mt-1 font-medium tracking-wide">Automatic bill generation</p>
           </div>
        </div>
      </div>

      {/* Choose Payment Method */}
      <div className="space-y-4">
         <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-text-primary">Choose Payment Method</h3>
            <button className="text-sm font-bold text-[#415bc2] dark:text-blue-400 hover:underline">View All Options</button>
         </div>
         <div className="grid md:grid-cols-3 gap-6">
            <button 
               onClick={() => handlePay('UPI')} 
               disabled={payMutation.isPending || totalDue === 0}
               className="bg-surface rounded-3xl p-5 border border-border-default shadow-sm flex items-center gap-4 hover:border-[#415bc2]/50 hover:bg-[#415bc2]/5 transition-all text-left disabled:opacity-50 group"
            >
               <div className="w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center text-[#415bc2] group-hover:bg-[#415bc2]/10 transition-colors">
                  <QrCode className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-text-primary">Unified Payments (UPI)</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-medium leading-relaxed">Instant transfer via PhonePe,<br/>GPay</p>
               </div>
            </button>
            <button 
               onClick={() => handlePay('Card')} 
               disabled={payMutation.isPending || totalDue === 0}
               className="bg-surface rounded-3xl p-5 border border-border-default shadow-sm flex items-center gap-4 hover:border-[#415bc2]/50 hover:bg-[#415bc2]/5 transition-all text-left disabled:opacity-50 group"
            >
               <div className="w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center text-[#415bc2] group-hover:bg-[#415bc2]/10 transition-colors">
                  <CreditCard className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-text-primary">Credit / Debit Card</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-medium leading-relaxed">Visa, Mastercard, Amex</p>
               </div>
            </button>
            <button 
               onClick={() => handlePay('Netbanking')} 
               disabled={payMutation.isPending || totalDue === 0}
               className="bg-surface rounded-3xl p-5 border border-border-default shadow-sm flex items-center gap-4 hover:border-[#415bc2]/50 hover:bg-[#415bc2]/5 transition-all text-left disabled:opacity-50 group"
            >
               <div className="w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center text-[#415bc2] group-hover:bg-[#415bc2]/10 transition-colors">
                  <Landmark className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-text-primary">Net Banking</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5 font-medium leading-relaxed">Secure bank-to-bank transfer</p>
               </div>
            </button>
         </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface rounded-3xl border border-border-default shadow-sm overflow-hidden flex flex-col">
         <div className="p-6 border-b border-border-default flex justify-between items-center bg-surface">
            <h3 className="text-lg font-bold text-text-primary">Recent Transactions</h3>
            <div className="flex gap-2">
               <button className="bg-surface-elevated text-text-primary text-xs font-bold px-4 py-2 rounded-full border border-border-default hover:bg-surface-hover transition-colors">Export CSV</button>
               <button className="bg-surface-elevated text-text-primary text-xs font-bold px-4 py-2 rounded-full border border-border-default hover:bg-surface-hover transition-colors">Filter</button>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-surface">
                     <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-default">Date</th>
                     <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-default">Transaction ID</th>
                     <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-default">Amount</th>
                     <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-default">Status</th>
                     <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-default text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-default">
                  {fees.slice().sort((a,b) => new Date(b.date || b.dueDate) - new Date(a.date || a.dueDate)).map((fee) => (
                     <tr key={fee._id} className="hover:bg-surface-elevated transition-colors bg-surface">
                        <td className="p-5 text-xs font-bold text-text-secondary">
                           {new Date(fee.date || fee.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-5 text-xs font-mono text-text-muted tracking-widest uppercase">
                           {fee.transactionId || `#HST-PENDING-${fee._id.toString().slice(-4)}`}
                        </td>
                        <td className="p-5 text-sm font-black text-text-primary">
                           ₹{fee.amount.toLocaleString()}
                        </td>
                        <td className="p-5">
                           {fee.status === 'Paid' ? (
                              <span className="bg-[#b3bffe]/40 dark:bg-blue-500/20 text-[#415bc2] dark:text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Success</span>
                           ) : (
                              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Pending</span>
                           )}
                        </td>
                        <td className="p-5 text-right">
                           <button onClick={() => handlePrintReceipt(fee)} className="text-[#415bc2] dark:text-blue-400 hover:scale-110 transition-transform inline-block p-2 rounded-full hover:bg-[#415bc2]/10" disabled={fee.status !== 'Paid'}>
                              {fee.status === 'Paid' ? <Download className="w-5 h-5" /> : <Hourglass className="w-5 h-5 text-text-muted" />}
                           </button>
                        </td>
                     </tr>
                  ))}
                  {fees.length === 0 && (
                     <tr>
                        <td colSpan="5" className="p-8 text-center text-text-muted text-sm font-medium">No transactions found.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         <div className="p-5 border-t border-border-default bg-surface flex justify-between items-center text-xs text-text-secondary font-medium">
            <span>Showing {fees.length} transactions</span>
            <div className="flex gap-4 font-bold text-text-primary">
               <button className="hover:text-[#415bc2] transition-colors flex items-center"><ChevronLeft className="w-4 h-4 mr-0.5"/> Previous</button>
               <button className="hover:text-[#415bc2] transition-colors flex items-center text-[#415bc2]">Next <ChevronRight className="w-4 h-4 ml-0.5"/></button>
            </div>
         </div>
      </div>

      {/* Footer Support Cards */}
      <div className="grid md:grid-cols-2 gap-6">
         <div className="bg-surface-elevated rounded-3xl p-6 border border-border-default flex items-start gap-4 shadow-sm">
            <div className="min-w-[40px] h-10 rounded-full bg-[#f2f4fc] dark:bg-blue-900/30 flex items-center justify-center text-[#415bc2]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-sm font-bold text-text-primary">Need help with payments?</h4>
               <p className="text-xs text-text-secondary mt-1.5 leading-relaxed font-medium">Our accounting team is available Mon-Fri, 9am - 6pm. Raise a ticket or call +1 (800) HOST-ME.</p>
            </div>
         </div>
         <div className="bg-surface-elevated rounded-3xl p-6 border border-border-default flex items-start gap-4 shadow-sm">
            <div className="min-w-[40px] h-10 rounded-full bg-[#f2f4fc] dark:bg-blue-900/30 flex items-center justify-center text-[#415bc2]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
               <h4 className="text-sm font-bold text-text-primary">Late Fee Policy</h4>
               <p className="text-xs text-text-secondary mt-1.5 leading-relaxed font-medium">A penalty of 2% applies to payments delayed beyond the 7th of every month. Read full terms.</p>
            </div>
         </div>
      </div>

    </div>
  );
}
