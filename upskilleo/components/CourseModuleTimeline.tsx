
import React from 'react';
import { Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface CourseModuleTimelineProps {
  modules: Module[];
  currentModuleIndex: number;
  currentLessonIndex: number;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
}

const CourseModuleTimeline: React.FC<CourseModuleTimelineProps> = ({
  modules,
  currentModuleIndex,
  currentLessonIndex,
  onSelectLesson
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      {modules.map((module, moduleIndex) => (
        <div key={module.id} className="relative">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${moduleIndex < currentModuleIndex ? 'bg-green-500/20 text-green-500' : 
                moduleIndex === currentModuleIndex ? 'bg-primary/20 text-primary' : 
                'bg-muted text-muted-foreground'}`}
              >
                {moduleIndex < currentModuleIndex ? (
                  <Check size={20} className="animate-in fade-in-50" />
                ) : (
                  <span className="font-semibold">{moduleIndex + 1}</span>
                )}
              </div>
              {moduleIndex < modules.length - 1 && (
                <div className="h-full w-px bg-border my-2"></div>
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="font-medium text-lg">{module.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
              
              <div className="space-y-2 ml-2 border-l border-border pl-4">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isActive = moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                  const isCompleted = lesson.completed;
                  
                  return (
                    <div 
                      key={lesson.id}
                      className={`relative flex items-center py-2 px-3 rounded-md transition-colors duration-200
                        ${isActive ? 'bg-primary/10 border-l-2 border-primary' : ''}
                        ${lesson.locked ? 'opacity-50' : 'hover:bg-muted cursor-pointer'}`}
                      onClick={() => {
                        if (!lesson.locked) {
                          onSelectLesson(moduleIndex, lessonIndex);
                        }
                      }}
                    >
                      <div className="mr-3">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center animate-in fade-in-50">
                            <Check size={12} className="text-white" />
                          </div>
                        ) : lesson.locked ? (
                          <Lock size={16} className="text-muted-foreground" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border ${isActive ? 'border-primary' : 'border-muted-foreground'}`}></div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-sm">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                      </div>
                      {isActive && (
                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary animate-in fade-in-50">
                          Current
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseModuleTimeline;
