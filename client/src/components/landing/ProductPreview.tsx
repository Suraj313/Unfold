import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';

export const ProductPreview = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto border-border-main shadow-lg">
      <CardHeader className="border-b border-border-main bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="neutral" className="mb-2">UNFOLD WORKSPACE</Badge>
            <CardTitle className="text-[20px]">Database Management Systems</CardTitle>
          </div>
        </div>
      </CardHeader>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border-main p-4 bg-gray-50/30">
          <p className="text-[13px] font-semibold text-text-secondary mb-3 uppercase tracking-wider">Materials</p>
          <div className="space-y-2">
            <div className="flex items-center text-[14px] text-text-main p-2 rounded-md bg-white border border-border-main shadow-sm">
              <FileText className="w-4 h-4 mr-2 text-primary" /> Unit 1
            </div>
            <div className="flex items-center text-[14px] text-text-secondary p-2 hover:bg-gray-100 rounded-md transition-colors">
              <FileText className="w-4 h-4 mr-2" /> Unit 2
            </div>
            <div className="flex items-center text-[14px] text-text-secondary p-2 hover:bg-gray-100 rounded-md transition-colors">
              <FileText className="w-4 h-4 mr-2" /> Unit 3
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 p-6 flex flex-col gap-6">
          <div className="self-end bg-gray-100 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%]">
            <p className="text-[15px] text-text-main font-medium">What is normalization?</p>
          </div>
          
          <div className="self-start bg-white border border-border-main px-4 py-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-[14px]">
              <Sparkles className="w-4 h-4" /> Unfold AI
            </div>
            <p className="text-[15px] text-text-main leading-relaxed">
              Normalization is the process of organizing data to reduce redundancy and improve data integrity.
            </p>
            
            <div className="mt-4 pt-4 border-t border-border-main flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-text-secondary mb-1">Sources</p>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">DBMS — Unit 3</Badge>
                  <span className="text-[13px] text-text-secondary">Page 14</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-[13px] text-primary hover:text-primary-hover px-2">
                View source <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
