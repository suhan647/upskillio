
import React, { useState, useEffect } from 'react';
import { Check, Lock, Play, ArrowRight, ChevronDown, ChevronUp, Info, Clock, BookOpen, BarChart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  locked: boolean;
  progress: number;
  badge?: string;
  track?: string;
}

const coursesData: Record<string, Module[]> = {
  frontend: [
    {
      id: 'html-css',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of the web',
      duration: '4 hours',
      lessons: 8,
      completed: true,
      locked: false,
      progress: 100,
      badge: 'Beginner'
    },
    {
      id: 'javascript',
      title: 'JavaScript Essentials',
      description: 'Master core JavaScript concepts and DOM manipulation',
      duration: '6 hours',
      lessons: 12,
      completed: false,
      locked: false,
      progress: 65,
      badge: 'Beginner'
    },
    {
      id: 'responsive',
      title: 'Responsive Web Design',
      description: 'Create websites that work on any device',
      duration: '3 hours',
      lessons: 6,
      completed: false,
      locked: false,
      progress: 0,
      badge: 'Intermediate'
    },
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Build interactive UIs with React',
      duration: '8 hours',
      lessons: 15,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Intermediate'
    },
    {
      id: 'advanced-react',
      title: 'Advanced React',
      description: 'Context, Hooks, and State Management',
      duration: '10 hours',
      lessons: 16,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Advanced'
    }
  ],
  backend: [
    {
      id: 'node-basics',
      title: 'Node.js Fundamentals',
      description: 'Server-side JavaScript with Node.js',
      duration: '5 hours',
      lessons: 10,
      completed: false,
      locked: false,
      progress: 0,
      badge: 'Beginner'
    },
    {
      id: 'express',
      title: 'Express.js API Development',
      description: 'Build RESTful APIs with Express',
      duration: '7 hours',
      lessons: 14,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Intermediate'
    },
    {
      id: 'databases',
      title: 'Database Integration',
      description: 'Work with SQL and NoSQL databases',
      duration: '8 hours',
      lessons: 12,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Intermediate'
    },
    {
      id: 'auth',
      title: 'Authentication & Security',
      description: 'Implement secure user authentication',
      duration: '6 hours',
      lessons: 9,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Advanced'
    }
  ],
  fullstack: [
    {
      id: 'html-css',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of the web',
      duration: '4 hours',
      lessons: 8,
      completed: false,
      locked: false,
      progress: 0,
      badge: 'Beginner'
    },
    {
      id: 'javascript',
      title: 'JavaScript Essentials',
      description: 'Master core JavaScript concepts',
      duration: '6 hours',
      lessons: 12,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Beginner'
    },
    {
      id: 'node-basics',
      title: 'Node.js Fundamentals',
      description: 'Server-side JavaScript with Node.js',
      duration: '5 hours',
      lessons: 10,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Intermediate'
    },
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Build interactive UIs with React',
      duration: '8 hours',
      lessons: 15,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Intermediate'
    },
    {
      id: 'fullstack-project',
      title: 'Full-Stack Project',
      description: 'Build a complete web application',
      duration: '12 hours',
      lessons: 20,
      completed: false,
      locked: true,
      progress: 0,
      badge: 'Advanced'
    }
  ]
};

interface RoadmapSectionProps {
  selectedTrack: string;
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({ selectedTrack }) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const modules = coursesData[selectedTrack] || coursesData.frontend;
  
  useEffect(() => {
    // Close the expanded module when track changes
    setExpandedModuleId(null);
  }, [selectedTrack]);
  
  const handleModuleClick = (moduleId: string) => {
    if (expandedModuleId === moduleId) {
      setExpandedModuleId(null);
    } else {
      setExpandedModuleId(moduleId);
    }
  };
  
  const handleStartModule = (module: Module) => {
    if (module.locked) {
      setSelectedModule(module);
      setDialogOpen(true);
    } else {
      navigate(`/course-detail/${module.id}`);
    }
  };
  
  const checkPrerequisites = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('upskilleo-user');
    if (!isLoggedIn) {
      navigate('/?login=false');
    } else {
      setDialogOpen(false);
    }
  };

  return (
    <section id="roadmap" className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-40 -right-40 w-80 h-80 bg-upskilleo-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 left-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your <span className="text-gradient">Learning</span> Roadmap
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow this structured learning path to master {selectedTrack === 'frontend' ? 'frontend' : 
              selectedTrack === 'backend' ? 'backend' : 'full-stack'} development skills.
          </p>
        </div>
        
        <div className="space-y-8">
          {modules.map((module, index) => (
            <Card 
              key={module.id}
              className={`relative overflow-hidden border-border transition-all duration-300 ${
                expandedModuleId === module.id ? 'border-primary shadow-md' : 'hover:border-primary/50'
              }`}
            >
              {/* Module badge (if any) */}
              {module.badge && (
                <Badge 
                  variant="outline" 
                  className={`absolute top-4 right-4 z-10 ${
                    module.badge === 'Beginner' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                    module.badge === 'Intermediate' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' :
                    'bg-purple-500/10 text-purple-500 border-purple-500/30'
                  }`}
                >
                  {module.badge}
                </Badge>
              )}
              
              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {/* Module Status Icon */}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      module.completed ? 'bg-green-500/20' : 
                      module.locked ? 'bg-muted' : 'bg-primary/20'
                    }`}
                  >
                    {module.completed ? (
                      <Check className="text-green-500" size={24} />
                    ) : module.locked ? (
                      <Lock className="text-muted-foreground" size={20} />
                    ) : (
                      <Play className="text-primary" size={20} />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">{module.title}</h3>
                      <button 
                        onClick={() => handleModuleClick(module.id)} 
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                        aria-label="Toggle module details"
                      >
                        {expandedModuleId === module.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                
                {/* Module Details (expanded state) */}
                {expandedModuleId === module.id && (
                  <div className="mt-6 pt-6 border-t border-border/60 animate-in fade-in-50 slide-in-from-top-5 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium">{module.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Lessons</p>
                          <p className="font-medium">{module.lessons} lessons</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart size={16} className="text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Progress</p>
                          <p className="font-medium">{module.progress}% complete</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleStartModule(module)}
                        disabled={module.locked}
                        className="gap-2"
                      >
                        {module.locked ? "Unlock Module" : module.progress > 0 ? "Continue" : "Start Module"}
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Prerequisites Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Module Prerequisites</DialogTitle>
            <DialogDescription>
              You need to complete previous modules before unlocking {selectedModule?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-start gap-2 text-sm">
              <Info size={18} className="text-amber-500 mt-0.5" />
              <p>
                Please ensure you've completed the earlier modules in this track to build the necessary foundation for this advanced content.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={checkPrerequisites}>
              Check Requirements
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RoadmapSection;
