import { useEffect, useState } from 'react';
import { Sidebar } from '../components/workspace/Sidebar';
import { Header } from '../components/workspace/Header';
import { getDocuments } from '../services/document.service';
import type { Document } from '../services/document.service';
import { Loader2, AlertCircle, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { generateQuiz, type QuizQuestion } from '../services/practice.service';

const PracticePage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [errorDocs, setErrorDocs] = useState('');
  
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerate, setErrorGenerate] = useState('');
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  
  // Quiz state
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId) return;

    setIsGenerating(true);
    setErrorGenerate('');
    setQuizData(null);
    setAnswers({});
    setIsSubmitted(false);

    try {
      const response = await generateQuiz(selectedDocId);
      
      if (!response || !response.questions || !Array.isArray(response.questions) || response.questions.length !== 5) {
        throw new Error('Received an invalid or incomplete quiz from the server.');
      }
      
      setQuizData(response.questions);
    } catch (err: any) {
      setErrorGenerate(err.message || 'An unexpected error occurred while generating the quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const handleTryAgain = () => {
    setQuizData(null);
    setAnswers({});
    setIsSubmitted(false);
  };

  // Derived state
  const isQuizReadyToSubmit = quizData ? Object.keys(answers).length === quizData.length : false;
  
  let score = 0;
  if (isSubmitted && quizData) {
    quizData.forEach((q, i) => {
      if (answers[i] === q.correctOptionIndex) {
        score++;
      }
    });
  }

  return (
    <div className="flex h-screen bg-[#F8F7F4] font-sans">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:px-12">
          <div className="mx-auto max-w-3xl space-y-8">
            
            {/* Header Section */}
            <section>
              <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">
                Practice
              </h1>
              <p className="text-text-secondary text-[15px]">
                Test your understanding with questions generated from your study material.
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
                   You need to upload a document before you can generate quizzes.
                 </p>
                 <Link to="/app">
                   <Button variant="primary">Go to Documents</Button>
                 </Link>
               </div>
            ) : !quizData ? (
              <Card className="p-6 max-w-lg">
                <form onSubmit={handleGenerateQuiz} className="space-y-6">
                  <div>
                    <label htmlFor="docSelect" className="block text-sm font-semibold text-text-main mb-2">
                      Select a document
                    </label>
                    <select
                      id="docSelect"
                      className="w-full rounded-md border border-border-main bg-white px-3 py-2 text-sm text-text-main shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      disabled={isGenerating}
                    >
                      {documents.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating Quiz...
                      </>
                    ) : (
                      'Generate Quiz'
                    )}
                  </Button>
                </form>
                {errorGenerate && (
                  <div className="mt-6 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-error">
                    {errorGenerate}
                  </div>
                )}
              </Card>
            ) : (
              <div className="space-y-8">
                {isSubmitted && (
                  <Card className="p-6 text-center border-primary/20 bg-primary/5">
                    <h2 className="text-2xl font-bold text-text-main mb-2">
                      {score} / {quizData.length}
                    </h2>
                    <p className="text-text-secondary mb-6">
                      Great work — review the explanations below.
                    </p>
                    <Button variant="outline" onClick={handleTryAgain}>
                      Practice Again
                    </Button>
                  </Card>
                )}

                <div className="space-y-6">
                  {quizData.map((q, qIndex) => (
                    <Card key={qIndex} className="p-6">
                      <h3 className="font-semibold text-text-main mb-4 text-lg">
                        {qIndex + 1}. {q.question}
                      </h3>
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = answers[qIndex] === oIndex;
                          const isCorrect = q.correctOptionIndex === oIndex;
                          
                          let optClasses = "flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ";
                          
                          if (!isSubmitted) {
                            optClasses += isSelected 
                              ? "border-primary bg-primary/5 text-primary" 
                              : "border-border-main hover:bg-neutral-50 text-text-main";
                          } else {
                            optClasses += "cursor-default ";
                            if (isCorrect) {
                              optClasses += "border-green-500 bg-green-50 text-green-900 font-medium ";
                            } else if (isSelected && !isCorrect) {
                              optClasses += "border-red-300 bg-red-50 text-red-900 ";
                            } else {
                              optClasses += "border-border-main opacity-60 text-text-main ";
                            }
                          }

                          return (
                            <div 
                              key={oIndex} 
                              className={optClasses}
                              onClick={() => handleOptionSelect(qIndex, oIndex)}
                            >
                              <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSubmitted 
                                  ? isCorrect 
                                    ? "border-green-500 bg-green-500"
                                    : (isSelected && !isCorrect) 
                                      ? "border-red-500 bg-red-500" 
                                      : "border-border-main"
                                  : isSelected 
                                    ? "border-primary bg-primary" 
                                    : "border-border-main"
                              }`}>
                                {(isSelected || (isSubmitted && isCorrect)) && (
                                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-[15px]">{opt}</span>
                              {isSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto shrink-0" />}
                              {isSubmitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500 ml-auto shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div className="mt-6 border-t border-border-main pt-4">
                          <div className="bg-neutral-50 p-4 rounded-md text-sm text-text-main mb-4">
                            <span className="font-semibold mb-1 block">Explanation:</span>
                            {q.explanation}
                          </div>
                          <Badge variant="neutral" className="flex w-fit items-center gap-1.5 px-2.5 py-1 text-xs">
                            <FileText className="h-3 w-3" />
                            <span className="text-text-secondary">Source: Page {q.sourcePageNumber}</span>
                          </Badge>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {!isSubmitted && (
                  <div className="flex justify-end pb-8">
                    <Button 
                      variant="primary" 
                      onClick={handleSubmitQuiz}
                      disabled={!isQuizReadyToSubmit}
                    >
                      Submit Quiz
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PracticePage;
