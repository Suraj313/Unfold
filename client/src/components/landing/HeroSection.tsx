import { Button } from '../ui/Button';
import { ProductPreview } from './ProductPreview';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 space-y-8 z-10 relative">
          <div>
            <p className="text-[13px] md:text-[14px] font-semibold text-primary uppercase tracking-widest mb-4">
              AI-Powered Study Workspace
            </p>
            <h1 className="text-[40px] md:text-[48px] lg:text-[56px] font-bold text-text-main leading-tight tracking-tight">
              Turn your study material into understanding.
            </h1>
          </div>
          <p className="text-[18px] md:text-[20px] text-text-secondary leading-relaxed max-w-xl">
            Upload your notes and study material. Ask questions, verify answers against your sources, and practice what you've learned — all in one focused workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-[16px]">
                Create Your Workspace <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -z-10 transform translate-x-10 translate-y-10" />
          <ProductPreview />
        </div>
      </div>
    </section>
  );
};
