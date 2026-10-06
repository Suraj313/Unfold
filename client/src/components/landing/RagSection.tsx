import { ArrowDown, ArrowRight } from 'lucide-react';

export const RagSection = () => {
  const steps = [
    'Your Material',
    'Text Processing',
    'Embeddings',
    'Vector Search',
    'Relevant Context',
    'AI Response'
  ];

  return (
    <section className="py-16 bg-surface border-t border-border-main">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[28px] md:text-[32px] font-bold text-text-main tracking-tight mb-4">
          Built for grounded answers.
        </h2>
        <p className="text-[16px] md:text-[18px] text-text-secondary max-w-2xl mx-auto mb-12">
          Unfold combines document retrieval, semantic search, and language models to generate answers grounded in the material you're studying.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 flex-wrap">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col md:flex-row items-center">
              <div className={`px-4 py-2 rounded-[8px] font-medium text-[14px] md:text-[15px] ${
                index === 0 || index === steps.length - 1
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-white border border-border-main text-text-main shadow-sm'
              }`}>
                {step}
              </div>
              {index < steps.length - 1 && (
                <>
                  <ArrowRight className="w-4 h-4 text-border-main mx-2 hidden md:block" />
                  <ArrowDown className="w-4 h-4 text-border-main my-2 block md:hidden" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
