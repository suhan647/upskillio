/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPinCheckInside, Clock, BookOpen, CheckCircle, ChevronRight, ChevronDown, ChevronUp, BarChart, Play, Lock, MapPin, MapPinCheck } from 'lucide-react';
import { CourseModule } from '@/types/course';
import ModuleProgressBar from './ModuleProgressBar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface CurriculumQuickViewProps {
  modules: CourseModule[];
}

const CurriculumQuickView: React.FC<CurriculumQuickViewProps> = ({ modules }) => {
  const  router = useRouter();
  const searchParams = useSearchParams();
  
  // Get expanded sections from URL parameters
  const getExpandedSectionsFromURL = () => {
    const expanded = searchParams.get('quickview');
    return expanded ? expanded.split(',') : [];
  };
  
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
    const expandedSections = getExpandedSectionsFromURL();
    const initialState: Record<string, boolean> = {};
    
    expandedSections.forEach(moduleId => {
      initialState[moduleId] = true;
    });
    
    return initialState;
  });
  
  // Update URL parameters when openSections change
  // React.useEffect(() => {
  //   const expandedModules = Object.keys(openSections).filter(key => openSections[key]);
  //   const currentParams = new URLSearchParams(searchParams);
    
  //   if (expandedModules.length === 0) {
  //     currentParams.delete('quickview');
  //   } else {
  //     currentParams.set('quickview', expandedModules.join(','));
  //   }
    
  //   setSearchParams(currentParams);
  // }, [openSections, setSearchParams]);
  
  // Sync openSections when URL changes (browser back/forward)
  React.useEffect(() => {
    const expandedSections = getExpandedSectionsFromURL();
    const newOpenSections: Record<string, boolean> = {};
    
    modules.forEach(module => {
      newOpenSections[module.id] = expandedSections.includes(module.id);
    });
    
    setOpenSections(newOpenSections);
  }, [searchParams, modules]);
  
  const toggleSection = (moduleId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  // Toggle all modules expansion
  const toggleAllSections = () => {
    // Check if all modules are currently expanded
    const allExpanded = modules.every(module => openSections[module.id]);
    
    const newState: Record<string, boolean> = {};
    modules.forEach(module => {
      newState[module.id] = !allExpanded;
    });
    
    setOpenSections(newState);
  };
  
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Toggle All Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllSections}
          className="text-xs flex items-center gap-1"
        >
          {modules.every(module => openSections[module.id]) ? (
            <>
              <ChevronUp className="h-3 w-3" /> 
              Collapse All
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" /> 
              Expand All
            </>
          )}
        </Button>
      </div>
      
      {/* Progress Timeline */}
      <div className="relative ">
        {/* <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>
         */}
        {modules.map((module, index) => {
  const totalSections = module.sections?.length || 0;
  const completedSections = module.sections?.filter(section => section.completed).length || 0;
  // Calculate the completion percentage based on lessons completed
  const progressPercent = totalSections ? Math.round((completedSections / totalSections) * 100) : 0;
  const isOpen = openSections[module.id] || false;

  return (
    <div key={module.id} className="relative pl-12 pb-8">
      {/* Vertical progress bar container */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20">
  {/* Filled progress indicator */}
  <div
    className={`${progressPercent >= 100 ? "bg-green-700/70" : "bg-primary/70 "} w-full `}
    style={{ height: `${progressPercent}%`, position: 'absolute', top: 0 }}
  ></div>
</div>


      {/* Milestone marker */}

  <div
  className={`absolute left-4 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 
    ${module.completed ? 'bg-green-500 text-white' : 
      module.progress > 0 ? 'bg-primary text-white' : 
      'bg-muted border border-primary/30 text-muted-foreground'}`
  }
>

  <div >
    {module.completed ? (
      <MapPinCheck size={14} />
    ) : (
      <MapPin size={14} />
    )}
  </div>
</div>



{/* <p className='absolute -left-10  z-10 text-[9px] top-2 text-gray-600 my-edu-text'>level - {index+1}</p> */}

      {/* Module card */}
      <Card 
        className={`overflow-hidden transition-all duration-300 hover:shadow-md 
          ${module.completed ? 'border-green-500/55 bg-green-900/15 ' : 
            module.progress > 0 ? 'border-primary/30 bg-primary/5' : ''}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{index +1}. {module.title}</h3>
            <Badge 
              variant={module.completed ? "outline" : module.progress > 0 ? "secondary" : "outline"} 
              className={`${module.completed ? 'bg-green-500/10 text-green-600' : 
                module.progress > 0 ? 'bg-primary/10' : 'bg-muted'}`}
            >
              {module.completed ? "Completed" : 
                module.progress > 0 ? `In Progress` : "Not started"}
              {module.completed && <MapPinCheckInside size={14} className='ml-1' />}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {module.duration}
            </span>
            <span className="flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              {totalSections} lessons
            </span>
          </div>
          
          {/* Module Details Collapsible */}
          <div className="mb-4">
            <Collapsible open={isOpen} onOpenChange={() => toggleSection(module.id)}>
              <CollapsibleTrigger className={`flex items-center justify-between w-full text-sm font-medium transition-colors rounded-md px-3 py-2 border focus:outline-none ${
                isOpen 
                  ? ` border-primary/50 bg-accent/60 text-accent-foreground ${module.completed ? "border-gray-400/50": ""}`
                  : `${module.completed ? 'border-primary/20' : "" } hover:border-gray-500/50  hover:bg-accent hover:text-accent-foreground`
              }`}>
                <span className="flex items-center gap-2">
                  <BarChart className={`h-4 w-4 ${module.completed ? "text-green-500" : "text-primary"}`} /> 
                  <span>Show Module Details</span>
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-4 pt-4 px-1 animate-in fade-in-50 slide-in-from-top-2">
                {/* Module Tags */}
                {(module.badge || module.track || module.topics) && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {module.badge && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {module.badge}
                      </Badge>
                    )}
                    {module.track && (
                      <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/30">
                        {module.track}
                      </Badge>
                    )}
                    {module.topics && module.topics.length > 0 && (
                      module.topics.map((topic, i) => (
                        <Badge 
                          key={i}
                          variant="outline" 
                          className="bg-muted/50 text-xs border-muted/80"
                        >
                          {topic}
                        </Badge>
                      ))
                    )}
                  </div>
                )}
                
                {/* Progress Bar */}
                <ModuleProgressBar 
                  progress={module.progress} 
                  completedSections={completedSections}
                  totalSections={totalSections}
                />
                
                {/* Lessons Section */}
                {module.sections && module.sections.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs font-medium mb-2">
                      <span>Module Lessons:</span>
                      <span className="text-muted-foreground">{completedSections}/{totalSections} completed</span>
                    </div>
                    <div className="relative ">
  <div className="space-y-2 max-h-60 overflow-y-auto pb-10">
    {module.sections.map((section) => (
      <div 
        key={section.id}
        className={`p-2.5 rounded-md flex items-center justify-between
          ${section.completed ? 'bg-green-500/5 border border-green-500/20' : 
            section.locked ? 'bg-muted/30 opacity-60' : 
            'bg-muted/50 hover:bg-muted/70 border border-border'}
          transition-colors ${!section.locked ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (!section.locked) {
            router.push(`/section?sectionId=${module.id}`);
          }
        }}
      >
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            section.completed ? 'bg-green-500 text-white' : 
            section.locked ? 'bg-muted text-muted-foreground' : 
            'bg-primary/10 text-primary'
          }`}>
            {section.completed ? 
              <CheckCircle size={12} /> : 
              section.locked ? 
                <Lock size={12} /> : 
                <Play size={12} />
            }
          </div>
          <span className="text-sm font-medium">{section.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{section.duration}</span>
          {!section.locked && (
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 hover:opacity-100">
              <Play size={12} />
            </Button>
          )}
        </div>
      </div>
    ))}
  </div>

  {/* Gradient overlay at the bottom */}
{module.sections.length > 3 && (
   <div className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none bg-gradient-to-t from-gray-500/10 via-gray-400/5 to-transparent rounded-xl" />
)}
</div>

                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="flex justify-end">
            <Button 
              size="sm" 
              variant={module.completed ? "outline" : "default"} 
              onClick={() => router.push(`/section?sectionId=${module.id}`)}
              disabled={module.locked}
              className={module.locked ? "opacity-50 cursor-not-allowed" : ""}
            >
              {module.completed ? "Review" : module.progress > 0 ? "Continue" : "Start"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default CurriculumQuickView;
