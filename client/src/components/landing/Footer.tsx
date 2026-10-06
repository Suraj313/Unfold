

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border-main py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-4">
          <h3 className="text-[20px] font-bold text-text-main tracking-tight">Unfold</h3>
          <p className="text-[14px] text-text-secondary">Understand. Verify. Practice.</p>
        </div>
        
        <div className="flex gap-16">
          <div className="space-y-4">
            <h4 className="text-[14px] font-semibold text-text-main">Product</h4>
            <ul className="space-y-3">
              <li><a href="#how-it-works" className="text-[14px] text-text-secondary hover:text-text-main">How it works</a></li>
              <li><a href="#features" className="text-[14px] text-text-secondary hover:text-text-main">Features</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[14px] font-semibold text-text-main">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-[14px] text-text-secondary hover:text-text-main">Documentation</a></li>
              <li><a href="https://github.com/Suraj313/Unfold" target="_blank" rel="noreferrer" className="text-[14px] text-text-secondary hover:text-text-main">GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border-main flex justify-between items-center">
        <p className="text-[13px] text-text-secondary">© 2026 Unfold</p>
      </div>
    </footer>
  );
};
