import { BookOpen, FileText, Search, BookCheck, LogOut, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-[260px] flex-col border-r border-border-main bg-[#F8F7F4] hidden md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-text-main">
          UNFOLD
        </span>
      </div>

      <div className="px-4 mb-6">
        <Button className="w-full justify-start gap-2" variant="primary">
          <Plus className="h-4 w-4" />
          New Study
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="mb-6">
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Workspace
          </p>
          <div className="space-y-1">
            <Link to="/app" className="flex items-center gap-3 rounded-md bg-white px-2 py-2 text-sm font-medium text-primary shadow-sm border border-border-main">
              <FileText className="h-4 w-4" />
              Documents
            </Link>
          </div>
        </div>

        <div>
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Learning
          </p>
          <div className="space-y-1">
            <Link to="/app/ask" className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-text-main hover:bg-white hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
              Ask AI
            </Link>
            <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-text-main hover:bg-white hover:text-primary transition-colors">
              <BookCheck className="h-4 w-4" />
              Practice
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-border-main p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border-main text-sm font-bold text-text-main shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="truncate text-sm font-medium text-text-main">
                {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-text-secondary hover:text-error transition-colors rounded-md hover:bg-red-50"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
