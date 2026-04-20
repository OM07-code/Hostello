import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { useEffect } from 'react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDestructive = false }) {
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div 
        className="relative bg-surface-elevated border border-border-default rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 ${isDestructive ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="mt-1">
            <h3 className="text-lg font-bold text-text-primary mb-2">
              {title}
            </h3>
            <p className="text-sm text-text-secondary">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="border-border-subtle bg-surface">
            Cancel
          </Button>
          <Button 
            variant={isDestructive ? "danger" : "default"} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
