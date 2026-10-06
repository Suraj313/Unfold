import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border-main bg-[#F8F7F4]/80 px-8 backdrop-blur-md">
      <h2 className="text-lg font-semibold text-text-main">Documents</h2>
      <div className="relative w-64 hidden sm:block">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input 
          type="search" 
          placeholder="Search materials..." 
          className="pl-9 h-9 bg-white"
        />
      </div>
    </header>
  );
};
