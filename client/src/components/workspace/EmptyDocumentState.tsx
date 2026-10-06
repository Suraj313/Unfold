import { UploadCloud } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const EmptyDocumentState = () => {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
        <UploadCloud className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-text-main">
        Start with your study material
      </h3>
      <p className="mb-8 max-w-md text-sm text-text-secondary">
        Upload a PDF or study document to begin learning with Unfold. Our AI will help you understand, verify, and practice the material.
      </p>
      <Button variant="primary" disabled className="gap-2">
        <UploadCloud className="h-4 w-4" />
        Upload document
      </Button>
    </Card>
  );
};
