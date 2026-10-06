import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles, Check, X } from 'lucide-react';

export const FeatureShowcase = () => {
  return (
    <section id="features" className="py-20 bg-bg-main overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Feature 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-[32px] md:text-[40px] font-bold text-text-main tracking-tight">Grounded AI</h2>
            <p className="text-[18px] text-text-secondary">Answers based on your own study material, not generic responses.</p>
          </div>
          <div className="w-full lg:w-1/2">
            <Card className="p-6 bg-surface shadow-md border-border-main flex flex-col gap-4 relative">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tr-sm self-end max-w-[80%] text-[14px] font-medium text-text-main">
                Explain the difference between TCP and UDP.
              </div>
              <div className="flex items-center gap-2 self-center text-text-secondary text-[12px] font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-border-main">
                <Sparkles className="w-3 h-3 text-primary" /> Retrieved 3 relevant sources
              </div>
              <div className="bg-surface border border-border-main p-4 rounded-2xl rounded-tl-sm self-start max-w-[90%] shadow-sm">
                <p className="text-[14px] text-text-main leading-relaxed">
                  Based on your networking notes, TCP is connection-oriented and ensures reliable delivery, whereas UDP is connectionless and prioritizes speed over reliability.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-[32px] md:text-[40px] font-bold text-text-main tracking-tight">Source-aware answers</h2>
            <p className="text-[18px] text-text-secondary">Every answer can point you back to the material that supports it.</p>
          </div>
          <div className="w-full lg:w-1/2">
            <Card className="p-6 bg-surface shadow-md border-border-main">
              <p className="text-[12px] font-bold text-text-secondary tracking-widest mb-4">SOURCE</p>
              <div className="bg-gray-50 border border-border-main rounded-[8px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-text-main text-[16px]">DBMS Unit 3</p>
                  <p className="text-text-secondary text-[14px]">Page 14</p>
                </div>
                <Button variant="outline" size="sm" className="text-primary hover:text-primary-hover w-full sm:w-auto">
                  View source <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-[32px] md:text-[40px] font-bold text-text-main tracking-tight">AI-powered practice</h2>
            <p className="text-[18px] text-text-secondary">Turn your material into structured quizzes and identify weak areas.</p>
          </div>
          <div className="w-full lg:w-1/2">
            <Card className="p-6 bg-surface shadow-md border-border-main flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border-main pb-4">
                <Badge variant="neutral">10 questions</Badge>
                <div className="text-[24px] font-bold text-text-main">
                  <span className="text-success">8</span> <span className="text-text-secondary text-[18px]">/ 10</span>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[14px] font-semibold text-text-secondary uppercase">Weak topic:</p>
                <div className="flex items-center gap-2 text-[16px] font-medium text-text-main bg-red-50 border border-red-200 p-3 rounded-[8px]">
                  <X className="w-5 h-5 text-error" /> Normalization
                </div>
                <div className="flex items-center gap-2 text-[16px] font-medium text-text-main bg-green-50 border border-green-200 p-3 rounded-[8px]">
                  <Check className="w-5 h-5 text-success" /> Indexing
                </div>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
};
