import { useState } from 'react';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-border-main bg-bg-main/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-[20px] font-bold text-text-main tracking-tight">
              Unfold
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#how-it-works" className="text-[15px] font-medium text-text-secondary hover:text-text-main transition-colors">How it works</a>
              <a href="#features" className="text-[15px] font-medium text-text-secondary hover:text-text-main transition-colors">Features</a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-text-secondary hover:text-text-main" aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden border-t border-border-main bg-bg-main px-4 pt-2 pb-4 space-y-1">
          <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-text-main hover:bg-gray-50 rounded-md">How it works</a>
          <a href="#features" className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-text-main hover:bg-gray-50 rounded-md">Features</a>
          <div className="pt-4 flex flex-col gap-2">
            <Link to="/login">
              <Button variant="ghost" className="w-full justify-start">Log in</Button>
            </Link>
            <Link to="/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
