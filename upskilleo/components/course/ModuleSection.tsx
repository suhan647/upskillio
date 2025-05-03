
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Play, Lock, CheckCircle } from 'lucide-react';

interface ModuleSectionProps {
  moduleId: string;
  section: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    locked: boolean;
  };
  sectionIndex: number;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({ 
  moduleId, 
  section, 
  sectionIndex 
}) => {
  const router = useRouter();

  const handleSectionClick = () => {
    if (!section.locked) {
      router.push(`/section?sectionId${moduleId}?lesson=${sectionIndex}`);
    }
  };

  return (
    <div 
      key={section.id} 
      className={`p-3 rounded-md flex items-center justify-between ${
        section.completed 
          ? 'bg-green-500/5 border border-green-500/20' 
          : section.locked 
            ? 'bg-muted/30 opacity-60' 
            : 'bg-card hover:bg-muted/50 border border-border'
      } transition-colors ${!section.locked ? 'cursor-pointer' : ''}`}
      onClick={handleSectionClick}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          section.completed 
            ? 'bg-green-500 text-white' 
            : section.locked 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-primary/10 text-primary'
        }`}>
          {section.completed 
            ? <CheckCircle size={12} /> 
            : section.locked 
              ? <Lock size={12} /> 
              : <Play size={12} />
          }
        </div>
        <span className="text-sm font-medium">
          {section.title}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {section.duration}
        </span>
        {!section.locked && (
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Play size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ModuleSection;
