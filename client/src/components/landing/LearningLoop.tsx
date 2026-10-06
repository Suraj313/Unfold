import { ArrowRight } from 'lucide-react';

export const LearningLoop = () => {
  const steps = ['Upload', 'Understand', 'Verify', 'Practice', 'Improve'];

  return (
    <section className="py-16 bg-bg-main overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[28px] md:text-[32px] font-bold text-text-main tracking-tight mb-12">
          From material to mastery.
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="bg-surface border border-border-main rounded-[12px] px-6 py-3 shadow-sm font-semibold text-text-main text-[16px]">
                {step}
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-text-secondary opacity-50 hidden md:block" />
              )}
              {index < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-text-secondary opacity-50 block md:hidden rotate-90" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
