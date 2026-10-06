import { FileText, MoreVertical } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DocumentCardProps {
  title: string;
  type: string;
  pages: number;
}

export const DocumentCard = ({ title, type, pages }: DocumentCardProps) => {
  return (
    <Card className="group relative cursor-pointer hover:border-primary/50 hover:shadow-md transition-all">
      <div className="flex flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <button className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-text-main">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        <h3 className="mb-1 truncate text-[15px] font-semibold text-text-main">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
          <Badge variant="neutral" className="text-[11px] px-2 py-0">{type}</Badge>
          <span className="text-[12px]">{pages} pages</span>
        </div>
      </div>
    </Card>
  );
};
