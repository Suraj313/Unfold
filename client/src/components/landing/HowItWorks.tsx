export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-surface border-y border-border-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-12">
            <div className="relative pl-8">
              <span className="absolute left-0 top-0 text-[14px] font-bold text-primary">01</span>
              <h3 className="text-[24px] font-bold text-text-main mb-3">Add your material</h3>
              <p className="text-[16px] text-text-secondary">Upload PDFs and organize them inside a study workspace.</p>
            </div>
            
            <div className="relative pl-8">
              <span className="absolute left-0 top-0 text-[14px] font-bold text-primary">03</span>
              <h3 className="text-[24px] font-bold text-text-main mb-3">Verify the answer</h3>
              <p className="text-[16px] text-text-secondary">See where the answer came from with source references.</p>
            </div>
          </div>
          
          <div className="space-y-12 md:mt-12">
            <div className="relative pl-8">
              <span className="absolute left-0 top-0 text-[14px] font-bold text-primary">02</span>
              <h3 className="text-[24px] font-bold text-text-main mb-3">Ask questions</h3>
              <p className="text-[16px] text-text-secondary">Ask naturally. Unfold retrieves the most relevant parts of your material.</p>
            </div>
            
            <div className="relative pl-8">
              <span className="absolute left-0 top-0 text-[14px] font-bold text-primary">04</span>
              <h3 className="text-[24px] font-bold text-text-main mb-3">Practice</h3>
              <p className="text-[16px] text-text-secondary">Generate quizzes and use your results to identify what needs more attention.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
