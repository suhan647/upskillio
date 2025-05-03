
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from 'lucide-react';
import { CourseModule } from '@/types/course';

interface CourseProgressOverviewProps {
  modules: CourseModule[];
  overallProgress: number;
}

const CourseProgressOverview: React.FC<CourseProgressOverviewProps> = ({ 
  modules, 
  overallProgress 
}) => {
  return (
    <Card className="bg-card/95 backdrop-blur-sm mb-8 border-primary/20 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-muted/50 px-4 py-3 border-b border-border/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Course Progress</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round(overallProgress)}% Complete
          </span>
        </div>
        <Progress value={overallProgress} className="h-1.5 rounded-none" />
        
        <div className="grid md:grid-cols-4 divide-x divide-border/20">
          <div className="p-4 flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-primary mb-1">{modules.length}</div>
            <div className="text-xs text-muted-foreground">Total Modules</div>
          </div>
          <div className="p-4 flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {modules.filter(m => m.completed).length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="p-4 flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {modules.reduce((total, module) => {
                return total + (module.sections?.length || 0);
              }, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Lessons</div>
          </div>
          <div className="p-4 flex flex-col items-center text-center">
            <div className="text-3xl font-bold text-amber-500 mb-1">
              {modules.filter(m => m.progress > 0 && m.progress < 100).length}
            </div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseProgressOverview;
