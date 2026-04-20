import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const complaintSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(60, "Title is too long"),
  category: z.enum(['Maintenance', 'Cleaning', 'Discipline', 'Other']),
  description: z.string().min(10, "Please provide more details (minimum 10 characters)").max(500, "Description is too long"),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium')
});

export default function Complaints() {
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await axios.get('/complaints');
      return res.data;
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: '',
      category: 'Maintenance',
      description: '',
      priority: 'Medium'
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post('/complaints', data);
    },
    onSuccess: () => {
      toast.success('Complaint submitted successfully!');
      reset();
      queryClient.invalidateQueries(['complaints']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }
  });

  const onSubmit = (data) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Complaint Management</h2>
        <p className="text-text-muted">Lodge an issue or track your pending tickets.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Ticket Filing Form */}
        <Card className="lg:col-span-1 border border-border-default shadow-sm bg-surface">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary">Lodge New Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...register("title")} placeholder="e.g. Broken AC" />
                {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <select 
                  className="w-full bg-surface border border-border-default rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                  {...register("category")}
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Discipline">Discipline</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-xs text-error">{errors.category.message}</p>}
              </div>

               <div className="space-y-2">
                <Label>Description</Label>
                <textarea 
                  className="w-full h-24 bg-surface border border-border-default rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus resize-none"
                  {...register("description")}
                  placeholder="Describe your issue..."
                />
                {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
              </div>

              <Button type="submit" disabled={submitMutation.isPending} className="w-full" variant="default">
                {submitMutation.isPending ? 'Submitting...' : 'Submit Issue'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Tickets Table */}
        <Card className="lg:col-span-2 border border-border-default shadow-sm bg-surface">
          <CardHeader>
            <CardTitle className="text-lg text-text-primary">My Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? (
               <div className="space-y-4 animate-pulse">
                 <div className="h-20 bg-surface-hover rounded-xl border border-border-default"></div>
                 <div className="h-20 bg-surface-hover rounded-xl border border-border-default"></div>
               </div>
             ) : (
               <div className="space-y-4">
                 {complaints.length === 0 ? (
                   <div className="text-sm text-text-muted text-center py-8">You have no active complaints.</div>
                 ) : (
                   complaints.map(c => (
                     <div key={c._id} className="p-4 rounded-xl border border-border-default bg-surface-hover flex justify-between items-start shadow-sm">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-semibold text-text-primary">{c.title}</h4>
                           <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface text-text-muted border border-border-subtle shadow-sm">{c.category}</span>
                         </div>
                         <p className="text-sm text-text-secondary mt-2">{c.description}</p>
                         <p className="text-xs text-text-muted mt-2">Placed: {new Date(c.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                         {c.status === 'Resolved' ? (
                           <span className="flex items-center text-xs text-success bg-surface px-2 py-1 rounded-md border border-border-subtle shadow-sm"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</span>
                         ) : c.status === 'In Progress' ? (
                           <span className="flex items-center text-xs text-primary bg-surface px-2 py-1 rounded-md border border-border-subtle shadow-sm"><Clock className="w-3 h-3 mr-1" /> Working</span>
                         ) : (
                           <span className="flex items-center text-xs text-error bg-surface px-2 py-1 rounded-md border border-border-subtle shadow-sm"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>
                         )}
                       </div>
                     </div>
                   ))
                 )}
               </div>
             )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
