
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { BarChart } from 'lucide-react';

interface ModuleProgressBarProps {
  progress: number;
  completedSections?: number;
  totalSections?: number;
}

const ModuleProgressBar: React.FC<ModuleProgressBarProps> = ({ 
  progress, 
  completedSections, 
  totalSections 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart className={`h-4 w-4 ${progress >=100 ? "text-green-600/90": "text-primary"} `} />
          <span className="text-sm font-medium">Module Progress</span>
        </div>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      {completedSections !== undefined && totalSections !== undefined && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-muted-foreground">{completedSections}/{totalSections} lessons completed</span>
        </div>
      )}
    </div>
  );
};

export default ModuleProgressBar;
