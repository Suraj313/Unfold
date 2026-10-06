import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { UploadCloud, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { uploadDocument } from '../../services/document.service';

export const EmptyDocumentState = ({ onUploadSuccess }: { onUploadSuccess?: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    setError('');
    setSuccess('');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setSuccess('');
      
      await uploadDocument(file);
      
      setSuccess('Document uploaded successfully!');
      onUploadSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-primary">
        <UploadCloud className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-text-main">
        Start with your study material
      </h3>
      <p className="mb-6 max-w-md text-sm text-text-secondary">
        Upload a PDF or study document to begin learning with Unfold. Our AI will help you understand, verify, and practice the material.
      </p>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-[8px] bg-red-50 px-4 py-3 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-[8px] bg-green-50 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <input
        id="document-upload"
        name="document-upload"
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <Button 
        variant="primary" 
        className="gap-2" 
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
        {isUploading ? 'Uploading...' : 'Upload document'}
      </Button>
    </Card>
  );
};
