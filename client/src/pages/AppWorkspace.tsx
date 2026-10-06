import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/workspace/Sidebar';
import { Header } from '../components/workspace/Header';
import { EmptyDocumentState } from '../components/workspace/EmptyDocumentState';
import { LearningLoop } from '../components/workspace/LearningLoop';

const AppWorkspace = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-[#F8F7F4] font-sans">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:px-12">
          <div className="mx-auto max-w-5xl space-y-10">
            
            {/* Welcome Section */}
            <section>
              <h1 className="text-3xl font-bold tracking-tight text-text-main mb-2">
                Good morning, {user?.name?.split(' ')[0] || user?.name}
              </h1>
              <p className="text-text-secondary text-[15px]">
                Continue learning from your study material.
              </p>
            </section>

            {/* Empty State / Upload Card */}
            <section>
              <EmptyDocumentState />
            </section>

            {/* Learning Loop Overview */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-text-main">
                How Unfold works
              </h2>
              <LearningLoop />
            </section>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppWorkspace;
