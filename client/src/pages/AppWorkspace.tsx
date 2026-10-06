import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/workspace/Sidebar';
import { Header } from '../components/workspace/Header';
import { EmptyDocumentState } from '../components/workspace/EmptyDocumentState';
import { LearningLoop } from '../components/workspace/LearningLoop';
import { DocumentCard } from '../components/workspace/DocumentCard';
import { getDocuments } from '../services/document.service';
import type { Document } from '../services/document.service';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const AppWorkspace = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getDocuments();
      setDocuments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentDeleted = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="flex h-screen bg-[#F8F7F4] font-sans">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:px-12">
          <div className="mx-auto max-w-5xl space-y-10">
            
            {/* Welcome Section */}
            <section>
              <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">
                Good morning, {user?.name?.split(' ')[0] || user?.name}
              </h1>
              <p className="text-text-secondary text-[15px]">
                Continue learning from your study material.
              </p>
            </section>

            {isLoading ? (
              <div className="flex h-40 flex-col items-center justify-center text-text-secondary">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Loading your documents...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50 p-8 text-center">
                <AlertCircle className="mb-4 h-8 w-8 text-error" />
                <p className="mb-4 text-error">{error}</p>
                <Button variant="primary" onClick={loadDocuments}>
                  Try again
                </Button>
              </div>
            ) : (
              <>
                {documents.length === 0 ? (
                  <section>
                    <EmptyDocumentState onUploadSuccess={loadDocuments} />
                  </section>
                ) : (
                  <>
                    <section>
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-text-main">
                          Your documents
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {documents.map((doc) => (
                          <DocumentCard
                            key={doc.id}
                            id={doc.id}
                            title={doc.title}
                            fileSize={doc.fileSize}
                            createdAt={doc.createdAt}
                            onDeleted={handleDocumentDeleted}
                          />
                        ))}
                      </div>
                    </section>
                    
                    <section>
                      <h2 className="mb-4 text-lg font-bold text-text-main">
                        Upload another document
                      </h2>
                      <EmptyDocumentState onUploadSuccess={loadDocuments} />
                    </section>
                  </>
                )}
              </>
            )}

            {/* Learning Loop Overview */}
            {documents.length === 0 && !isLoading && !error && (
              <section>
                <h2 className="mb-4 text-lg font-bold text-text-main">
                  How Unfold works
                </h2>
                <LearningLoop />
              </section>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppWorkspace;
