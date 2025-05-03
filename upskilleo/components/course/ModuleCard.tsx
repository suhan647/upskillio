/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Clock, CheckCircle, ChevronRight, Play, BookOpen, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CourseModule } from '@/types/course';
import ModuleSection from './ModuleSection';
import ModuleProgressBar from './ModuleProgressBar';

interface ModuleCardProps {
  module: CourseModule;
  index: number;
  isExpanded: boolean;
  toggleModuleExpansion: (moduleId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  index, 
  isExpanded, 
  toggleModuleExpansion 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleStartModule = () => {
     router.push(`/section?sectionId=${module.id}`);
  };
  
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'ring-1 ring-primary/20' : ''
      }`}
    >
      <Collapsible open={isExpanded} onOpenChange={() => toggleModuleExpansion(module.id)}>
        <CardHeader className="p-4 bg-muted/30">
          <CollapsibleTrigger className="w-full text-left">
            <div className="flex items-start justify-between cursor-pointer">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  module.completed 
                    ? 'bg-green-500/20 text-green-500' 
                    : module.progress > 0 
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {module.completed 
                    ? <CheckCircle size={16} />
                    : <span className="text-sm font-semibold">{index + 1}</span>
                  }
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {module.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {module.progress}% Complete
                  </span>
                  <Progress value={module.progress} className="w-20 h-1.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {module.duration}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <BookOpen className="inline h-3 w-3 mr-1" />
                    {module.lessons} lessons
                  </span>
                  <ChevronRight className={`h-5 w-5 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`} />
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent className="animate-in fade-in-50 slide-in-from-top-2">
          <CardContent className="p-4 pt-0 border-t-0">
            {/* Module metadata */}
            <div className="flex flex-wrap gap-2 my-3">
              {module.badge && (
                <Badge variant="outline" className="bg-primary/5">
                  {module.badge}
                </Badge>
              )}
              {module.track && (
                <Badge variant="outline" className="bg-secondary/5">
                  Track: {module.track}
                </Badge>
              )}
              {module.topics && module.topics.map(topic => (
                <Badge key={topic} variant="outline" className="bg-muted">
                  {topic}
                </Badge>
              ))}
            </div>
            
            {/* Progress visualization */}
            <ModuleProgressBar progress={module.progress} />

            <div className="mt-4 space-y-2">
              {module.sections && module.sections.map((section, sectionIndex) => (
                <ModuleSection 
                  key={section.id}
                  moduleId={module.id}
                  section={section}
                  sectionIndex={sectionIndex}
                />
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex flex-wrap gap-3 justify-end border-t mt-4">
            {module.completed ? (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-green-500/5 text-green-600 border-green-200 hover:bg-green-500/10"
                onClick={handleStartModule}
              >
                <ArrowRight size={16} className="mr-1" />
                Review Module
              </Button>
            ) : module.progress > 0 ? (
              <Button 
                variant="default" 
                size="sm"
                onClick={handleStartModule}
              >
                <Play size={16} className="mr-1" />
                Continue Learning
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={handleStartModule}
                disabled={module.locked}
              >
                <Play size={16} className="mr-1" />
                Start Learning
              </Button>
            )}
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ModuleCard;
