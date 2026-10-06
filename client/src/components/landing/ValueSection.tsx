import { Search, CheckCircle, Target } from 'lucide-react';

export const ValueSection = () => {
  return (
    <section className="py-16 bg-surface border-y border-border-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold text-text-main tracking-tight mb-4">
            Learn from what you already have.
          </h2>
          <p className="text-[18px] md:text-[20px] text-text-secondary">
            Your notes shouldn't just sit in a folder. Unfold turns them into an interactive learning environment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-[16px] flex items-center justify-center text-primary mb-2">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-semibold text-text-main">01 — Understand</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              Ask questions about your own material and get grounded explanations.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-[16px] flex items-center justify-center text-primary mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-semibold text-text-main">02 — Verify</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              See the document and page supporting an AI-generated answer.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-[16px] flex items-center justify-center text-primary mb-2">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-[20px] font-semibold text-text-main">03 — Practice</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed">
              Generate quizzes from what you're learning and discover where you need more practice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
