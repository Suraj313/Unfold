import { BrainCircuit, ShieldCheck, Dumbbell } from 'lucide-react';
import { Card } from '../ui/Card';

export const LearningLoop = () => {
  const steps = [
    {
      title: 'Understand',
      description: 'Ask questions about your study material.',
      icon: <BrainCircuit className="h-5 w-5" />,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Verify',
      description: 'Check answers against your sources.',
      icon: <ShieldCheck className="h-5 w-5" />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Practice',
      description: 'Generate practice questions from what you learned.',
      icon: <Dumbbell className="h-5 w-5" />,
      color: 'text-amber-600 bg-amber-50',
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step) => (
        <Card key={step.title} className="p-5 flex items-start gap-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${step.color}`}>
            {step.icon}
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-text-main mb-1">{step.title}</h4>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              {step.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
