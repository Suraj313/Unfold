import { useState } from 'react';
import { FileText, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { deleteDocument } from '../../services/document.service';

interface DocumentCardProps {
  id: string;
  title: string;
  type?: string;
  fileSize: number;
  createdAt: string;
  onDeleted: (id: string) => void;
}

export const DocumentCard = ({ id, title, type = 'PDF', fileSize, createdAt, onDeleted }: DocumentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isDeleting) return;

    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError('');
      await deleteDocument(id);
      onDeleted(id);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete');
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all">
      <div className="flex flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete document"
            aria-label="Delete document"
            className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-error focus:opacity-100 p-1.5 rounded hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-error" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>
        <h3 className="mb-1 truncate text-[15px] font-semibold text-text-main" title={title}>
          {title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
          <Badge variant="neutral" className="text-[11px] px-2 py-0">{type}</Badge>
          <span className="text-[12px]">{formatSize(fileSize)}</span>
          <span className="text-[12px] text-border-main">•</span>
          <span className="text-[12px]">{formatDate(createdAt)}</span>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-1.5 rounded bg-red-50 px-2 py-1.5 text-xs text-error">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
