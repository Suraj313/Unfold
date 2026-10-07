import { useEffect, useState } from 'react';
import { Sidebar } from '../components/workspace/Sidebar';
import { Header } from '../components/workspace/Header';
import { getDocuments } from '../services/document.service';
import type { Document } from '../services/document.service';
import { Loader2, AlertCircle, Search, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { askQuestion } from '../services/chat.service';
import ReactMarkdown from 'react-markdown';

const AskAIPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [errorDocs, setErrorDocs] = useState('');
  
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [errorAsk, setErrorAsk] = useState('');
  const [answerData, setAnswerData] = useState<{ answer: string; sources: any[] } | null>(null);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setIsLoadingDocs(true);
        const data = await getDocuments();
        setDocuments(data);
        if (data.length > 0) {
          setSelectedDocId(data[0].id);
        }
      } catch (err: any) {
        setErrorDocs(err.message || 'Failed to load documents');
      } finally {
        setIsLoadingDocs(false);
      }
    };
    loadDocs();
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !selectedDocId) return;

    setIsAsking(true);
    setAnswerData(null);
    setErrorAsk('');

    try {
      const response = await askQuestion({
        query: question.trim(),
        documentId: selectedDocId,
        topK: 5,
      });
      setAnswerData(response);
    } catch (err: any) {
      setErrorAsk(err.message || 'Failed to get an answer.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F7F4] font-sans">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:px-12">
          <div className="mx-auto max-w-4xl space-y-8">
            
            {/* Header Section */}
            <section>
              <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">
                Ask AI
              </h1>
              <p className="text-text-secondary text-[15px]">
                Select a document and ask a specific question to get a grounded answer based entirely on your study material.
              </p>
            </section>

            {/* Content Area */}
            {isLoadingDocs ? (
              <div className="flex h-40 flex-col items-center justify-center text-text-secondary">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Loading your workspace...</p>
              </div>
            ) : errorDocs ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50 p-8 text-center">
                <AlertCircle className="mb-4 h-8 w-8 text-error" />
                <p className="mb-4 text-error">{errorDocs}</p>
              </div>
            ) : documents.length === 0 ? (
               <div className="flex flex-col items-center justify-center rounded-lg border border-border-main bg-white p-12 text-center shadow-sm">
                 <FileText className="h-12 w-12 text-text-secondary mb-4" />
                 <h3 className="text-lg font-bold text-text-main mb-2">No documents available</h3>
                 <p className="text-text-secondary mb-6 max-w-sm">
                   You need to upload a document before you can ask questions about it.
                 </p>
                 <Link to="/app">
                   <Button variant="primary">Go to Documents</Button>
                 </Link>
               </div>
            ) : (
              <div className="space-y-6">
                
                {/* Query Card */}
                <Card className="p-6">
                  <form onSubmit={handleAsk} className="space-y-6">
                    <div>
                      <label htmlFor="docSelect" className="block text-sm font-semibold text-text-main mb-2">
                        Select Document
                      </label>
                      <select
                        id="docSelect"
                        className="w-full rounded-md border border-border-main bg-white px-3 py-2 text-sm text-text-main shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={selectedDocId}
                        onChange={(e) => setSelectedDocId(e.target.value)}
                        disabled={isAsking}
                      >
                        {documents.map(doc => (
                          <option key={doc.id} value={doc.id}>
                            {doc.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="question" className="block text-sm font-semibold text-text-main mb-2">
                        Your Question
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input
                            id="question"
                            placeholder="e.g., What is the function of the ALU?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={isAsking}
                            className="w-full"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={!question.trim() || isAsking}
                          className="w-32"
                        >
                          {isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                          {isAsking ? 'Thinking...' : 'Ask'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Card>

                {errorAsk && (
                  <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-error">
                    {errorAsk}
                  </div>
                )}

                {/* Answer Card */}
                {answerData && (
                  <Card className="p-6 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <CheckCircle2 className="h-5 w-5" />
                      <h3 className="font-bold">AI Answer</h3>
                    </div>
                    <div className="text-text-main text-[15px] leading-relaxed mb-6">
                      <ReactMarkdown
                        components={{
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                          a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />
                        }}
                      >
                        {answerData.answer}
                      </ReactMarkdown>
                    </div>
                    
                    {answerData.sources.length > 0 && (
                      <div className="border-t border-border-main pt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                          Sources Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {answerData.sources.map((src, i) => (
                            <Badge key={i} variant="neutral" className="flex items-center gap-1.5 px-2.5 py-1 text-xs">
                              <FileText className="h-3 w-3" />
                              <span className="font-medium truncate max-w-[200px]">{src.documentTitle}</span>
                              <span className="text-text-secondary">· Page {src.pageNumber}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AskAIPage;
