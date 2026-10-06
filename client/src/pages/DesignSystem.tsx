import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Search, Plus } from 'lucide-react';

const DesignSystem = () => {
  return (
    <div className="min-h-screen bg-bg-main p-8 md:p-16 font-sans text-text-main">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Header */}
        <div>
          <h1 className="text-[36px] md:text-[40px] font-bold tracking-tight mb-4">
            UNFOLD Design System
          </h1>
          <p className="text-[20px] md:text-[24px] text-text-secondary">Understand. Verify. Practice.</p>
        </div>

        {/* Typography */}
        <section className="space-y-8">
          <div className="border-b border-border-main pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold">Typography</h2>
            <p className="text-[15px] md:text-[16px] text-text-secondary mt-2">Inter font scale</p>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[13px] md:text-[14px] text-text-secondary mb-1">Display (48-56px, 700)</p>
              <div className="text-[48px] md:text-[56px] font-bold leading-tight">The quick brown fox</div>
            </div>
            <div>
              <p className="text-[13px] md:text-[14px] text-text-secondary mb-1">H1 (36-40px, 700)</p>
              <div className="text-[36px] md:text-[40px] font-bold leading-tight">The quick brown fox</div>
            </div>
            <div>
              <p className="text-[13px] md:text-[14px] text-text-secondary mb-1">H2 (28-32px, 700)</p>
              <div className="text-[28px] md:text-[32px] font-bold leading-snug">The quick brown fox</div>
            </div>
            <div>
              <p className="text-[13px] md:text-[14px] text-text-secondary mb-1">H3 (20-24px, 600)</p>
              <div className="text-[20px] md:text-[24px] font-semibold leading-snug">The quick brown fox</div>
            </div>
            <div>
              <p className="text-[13px] md:text-[14px] text-text-secondary mb-1">Body (15-16px, 400)</p>
              <div className="text-[15px] md:text-[16px] font-normal leading-normal">The quick brown fox jumps over the lazy dog.</div>
            </div>
            <div>
              <p className="text-[13px] md:text-[14px] text-text-secondary mb-1">Small (13-14px, 400)</p>
              <div className="text-[13px] md:text-[14px] font-normal leading-normal">The quick brown fox jumps over the lazy dog.</div>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="space-y-8">
          <div className="border-b border-border-main pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold">Colors</h2>
            <p className="text-[15px] md:text-[16px] text-text-secondary mt-2">Design tokens</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="h-16 w-full rounded-[8px] bg-bg-main border border-border-main"></div>
              <p className="text-[13px] md:text-[14px] font-medium">Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-[8px] bg-surface border border-border-main"></div>
              <p className="text-[13px] md:text-[14px] font-medium">Surface</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-[8px] bg-primary"></div>
              <p className="text-[13px] md:text-[14px] font-medium">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 w-full rounded-[8px] bg-border-main"></div>
              <p className="text-[13px] md:text-[14px] font-medium">Border</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-8">
          <div className="border-b border-border-main pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold">Buttons</h2>
            <p className="text-[15px] md:text-[16px] text-text-secondary mt-2">Interactive elements</p>
          </div>
          
          <div className="flex flex-wrap items-end gap-6">
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Primary</p>
              <Button>Get Started</Button>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Secondary</p>
              <Button variant="secondary">View Docs</Button>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Outline</p>
              <Button variant="outline">Cancel</Button>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Ghost</p>
              <Button variant="ghost">Learn More</Button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-end gap-6 pt-4">
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Small</p>
              <Button size="sm">Small</Button>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Medium</p>
              <Button size="md">Medium</Button>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Large</p>
              <Button size="lg">Large Button</Button>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">Disabled</p>
              <Button disabled>Disabled</Button>
            </div>
            <div className="space-y-3">
              <p className="text-[13px] md:text-[14px] text-text-secondary">With Icon</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Workspace
              </Button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-8">
          <div className="border-b border-border-main pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold">Inputs</h2>
            <p className="text-[15px] md:text-[16px] text-text-secondary mt-2">Form controls</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[13px] md:text-[14px] font-medium text-text-main">Standard Input</label>
              <Input placeholder="Enter your email..." />
            </div>
            
            <div className="space-y-3">
              <label className="text-[13px] md:text-[14px] font-medium text-text-main">With Error State</label>
              <Input error placeholder="Invalid input..." defaultValue="wrong@format" />
              <p className="text-[13px] md:text-[14px] text-error">Please enter a valid email address.</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-[13px] md:text-[14px] font-medium text-text-main">Disabled</label>
              <Input disabled placeholder="Cannot type here" />
            </div>
            
            <div className="space-y-3">
              <label className="text-[13px] md:text-[14px] font-medium text-text-main">With Icon</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <Input className="pl-9" placeholder="Search documents..." />
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-8">
          <div className="border-b border-border-main pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold">Badges</h2>
            <p className="text-[15px] md:text-[16px] text-text-secondary mt-2">Status indicators</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="warning">In Progress</Badge>
            <Badge variant="error">Failed</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-8">
          <div className="border-b border-border-main pb-4">
            <h2 className="text-[28px] md:text-[32px] font-bold">Cards</h2>
            <p className="text-[15px] md:text-[16px] text-text-secondary mt-2">Content containers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Machine Learning Basics</CardTitle>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-[13px] md:text-[14px] text-text-secondary mt-1">Created 2 days ago</p>
              </CardHeader>
              <CardContent>
                <p className="text-[15px] md:text-[16px] text-text-main">
                  A foundational study workspace containing 3 PDFs covering regression, classification, and neural networks.
                </p>
              </CardContent>
              <CardFooter className="gap-3">
                <Button className="w-full">Continue Studying</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create Workspace</CardTitle>
                <p className="text-[13px] md:text-[14px] text-text-secondary mt-1">Start a new study session</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[13px] md:text-[14px] font-medium text-text-main">Workspace Name</label>
                  <Input placeholder="e.g. Advanced Calculus" />
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-3">
                <Button variant="ghost">Cancel</Button>
                <Button>Create</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DesignSystem;
