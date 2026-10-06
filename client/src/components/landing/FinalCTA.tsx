import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalCTA = () => {
  return (
    <section className="py-20 bg-surface border-t border-border-main text-center px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-[32px] md:text-[40px] font-bold text-text-main tracking-tight mb-6">
          Ready to unfold what you're learning?
        </h2>
        <p className="text-[18px] text-text-secondary max-w-2xl mx-auto mb-10">
          Create a workspace, add your study material, and start exploring.
        </p>
        <Link to="/register">
          <Button size="lg" variant="primary" className="text-[16px]">
            Create Your Workspace <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
