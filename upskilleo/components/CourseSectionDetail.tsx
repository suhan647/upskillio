import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ChevronRight, Video, BookOpen, Clock, Award, BarChart, Maximize2, Minimize2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import CourseVideoPlayer from '@/components/CourseVideoPlayer';
import CourseEditor from '@/components/CourseEditor';
import CourseFeedback from '@/components/CourseFeedback';
import CourseModuleTimeline from '@/components/CourseModuleTimeline';
import { toast } from "sonner";
import { useSearchParams } from 'next/navigation';

interface KeyMoment {
  id: string;
  timeInSeconds: number;
  challenge: string;
  hints: string[];
  solution: string;
}

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

interface CourseSectionDetailProps {
  title: string;
  description?: string;
  modules: Module[];
}

const keyMomentsMap = {
  default: [
    {
      id: '1',
      timeInSeconds: 15,
      challenge: "Try implementing a function that checks if a number is even or odd.",
      hints: ["Use the modulo operator (%) to check if a number is divisible by 2."],
      solution: "function isEven(num) {\n  return num % 2 === 0;\n}"
    },
    {
      id: '2',
      timeInSeconds: 45,
      challenge: "Write a function to capitalize the first letter of a string.",
      hints: ["Use the string methods charAt(), slice(), and toUpperCase()."],
      solution: "function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}"
    },
    {
      id: '3',
      timeInSeconds: 65,
      challenge: "Implement a simple array filtering function.",
      hints: ["Use the Array.filter() method to create a new array with elements that pass a test."],
      solution: "function filterPositive(numbers) {\n  return numbers.filter(num => num > 0);\n}"
    }
  ]
};

const CourseSectionDetail: React.FC<CourseSectionDetailProps> = ({
  title,
  description,
  modules
}) => {
  const searchParams = useSearchParams();
  const lessonParam = searchParams.get('lesson');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(lessonParam ? parseInt(lessonParam) : 0);
  const [showEditor, setShowEditor] = useState(false);
  const [resumeVideo, setResumeVideo] = useState(false);
  const [code, setCode] = useState("// Write your solution here\nfunction isEven(num) {\n  // Your code here\n}");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentKeyMoment, setCurrentKeyMoment] = useState<KeyMoment | null>(null);
  const [progress, setProgress] = useState(0);
  const [localModules, setLocalModules] = useState(modules);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const currentVideoKey = useRef(`module-${currentModuleIndex}-lesson-${currentLessonIndex}`);

  useEffect(() => {
    setLocalModules(modules);
    calculateProgress(modules);
  }, [modules]);

  useEffect(() => {
    if (lessonParam) {
      const lessonIndex = parseInt(lessonParam);
      if (!isNaN(lessonIndex) && lessonIndex >= 0) {
        setCurrentLessonIndex(lessonIndex);
      }
    }
  }, [lessonParam]);

  useEffect(() => {
    currentVideoKey.current = `module-${currentModuleIndex}-lesson-${currentLessonIndex}`;
  }, [currentModuleIndex, currentLessonIndex]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isFullscreen]);

  const calculateProgress = (updatedModules: Module[]) => {
    const totalLessons = updatedModules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = updatedModules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => lesson.completed).length, 0);
    
    setProgress((completedLessons / totalLessons) * 100);
  };

  const getKeyMomentsForCurrentVideo = () => {
    return keyMomentsMap.default;
  };

  const handleKeyMomentEncountered = (keyMoment: KeyMoment) => {
    setCurrentKeyMoment(keyMoment);
    setShowEditor(true);
    setCode("// Write your solution here\nfunction isEven(num) {\n  // Your code here\n}");
    setResumeVideo(false);
  };

  const handleSelectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
    setShowEditor(false);
    setResumeVideo(false);
    setIsFullscreen(false);
    calculateProgress(localModules);
  };

  const handleSubmitCode = () => {
    setShowFeedback(true);
    const isCorrect = code.includes(
      currentKeyMoment?.id === '1' ? "return num % 2 === 0" :
      currentKeyMoment?.id === '2' ? "return str.charAt(0).toUpperCase() + str.slice(1)" :
      "return numbers.filter(num => num > 0)"
    );
    
    if (isCorrect) {
      toast.success("Great job! Your solution is correct!");
      setTimeout(() => {
        handleContinue();
      }, 5000);
    } else {
      toast.info("Try again! Your solution needs some work.");
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setShowEditor(false);
    setResumeVideo(true);
    const updatedModules = [...localModules];
    if (updatedModules[currentModuleIndex] && updatedModules[currentModuleIndex].lessons[currentLessonIndex]) {
      updatedModules[currentModuleIndex].lessons[currentLessonIndex].completed = true;
      setLocalModules(updatedModules);
      calculateProgress(updatedModules);
    }
  };

  const handleSkipChallenge = () => {
    toast.info("Challenge skipped. Moving on to the next part.");
    setShowEditor(false);
    setResumeVideo(true);
  };

  const handleVideoComplete = () => {
    toast.success("Lesson completed!", {
      description: "Moving to the next lesson automatically in 3 seconds"
    });
    
    const updatedModules = [...localModules];
    if (updatedModules[currentModuleIndex] && updatedModules[currentModuleIndex].lessons[currentLessonIndex]) {
      updatedModules[currentModuleIndex].lessons[currentLessonIndex].completed = true;
      if (currentLessonIndex < updatedModules[currentModuleIndex].lessons.length - 1) {
        updatedModules[currentModuleIndex].lessons[currentLessonIndex + 1].locked = false;
      } else if (currentModuleIndex < updatedModules.length - 1) {
        updatedModules[currentModuleIndex + 1].lessons[0].locked = false;
      }
      setLocalModules(updatedModules);
      calculateProgress(updatedModules);
      setTimeout(() => {
        if (currentLessonIndex < updatedModules[currentModuleIndex].lessons.length - 1) {
          setCurrentLessonIndex(currentLessonIndex + 1);
        } else if (currentModuleIndex < updatedModules.length - 1) {
          setCurrentModuleIndex(currentModuleIndex + 1);
          setCurrentLessonIndex(0);
        }
        setIsFullscreen(false);
      }, 3000);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const currentModule = localModules[currentModuleIndex] || { title: '', lessons: [], description: '' };
  const currentLesson = currentModule.lessons[currentLessonIndex] || { title: 'Introduction' };
  
  const sampleVideoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30">
      {!isFullscreen && (
        <>
          <div className="relative h-64 md:h-80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 mix-blend-multiply"></div>
            <div className="absolute inset-0 transform translate-y-2 scale-105 transition-transform duration-1000">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                alt="Course background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl animate-fade-in">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">{title}</h1>
                  {description && <p className="text-white/90 md:text-lg mb-6 max-w-2xl drop-shadow-md">{description}</p>}
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                      <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                      {modules.length} Modules
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground border-secondary/30 backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {modules.reduce((total, module) => 
                        total + module.lessons.length, 0)} Lessons
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30 backdrop-blur-sm">
                      <Award className="w-3.5 h-3.5 mr-1.5" />
                      Certificate Included
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto py-8 px-4 md:px-6 -mt-12 md:-mt-16 relative z-10">
            <Card className="bg-card/95 backdrop-blur-sm mb-8 border-primary/20 shadow-lg overflow-hidden transition-all hover:border-primary/40">
              <CardContent className="p-0">
                <div className="bg-muted/50 px-4 py-3 border-b border-border/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Course Progress</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-1.5 rounded-none" />
                
                <div className="p-4 flex items-center text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">
                    Currently on: <span className="font-medium text-foreground">{currentModule.title}</span>
                    <ChevronRight className="inline h-3 w-3 mx-1" />
                    <span className="font-medium text-foreground">{currentLesson.title}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background p-0 m-0' : 'container mx-auto px-4 md:px-6'} ${isFullscreen ? 'pt-0' : ''}`}>
        <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'md:grid-cols-12'} gap-6`}>
          {!isFullscreen && (
            <div className="md:col-span-4 lg:col-span-3">
              <div className="bg-card rounded-lg border shadow-sm sticky top-24 transition-all hover:shadow-md">
                <div className="p-4 border-b">
                  <h3 className="font-semibold flex items-center">
                    <BookOpen className="h-4 w-4 text-primary mr-2" />
                    Course Content
                  </h3>
                </div>
                <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
                  <CourseModuleTimeline 
                    modules={localModules}
                    currentModuleIndex={currentModuleIndex}
                    currentLessonIndex={currentLessonIndex}
                    onSelectLesson={handleSelectLesson}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className={`${isFullscreen ? 'col-span-full' : 'md:col-span-8 lg:col-span-9'}`}>
            {showEditor ? (
              <div className={`animate-in fade-in-50 bg-card rounded-lg border shadow-sm ${isFullscreen ? 'max-h-screen flex flex-col' : ''}`}>
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold text-lg">Coding Challenge</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setShowEditor(false);
                        setResumeVideo(true);
                      }}
                      className="flex items-center gap-1.5 text-primary"
                    >
                      <Video className="h-4 w-4" /> Back to Video
                    </Button>
                    {!isFullscreen && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-8 w-8"
                      >
                        <Maximize2 size={16} />
                      </Button>
                    )}
                    {isFullscreen && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-8 w-8"
                      >
                        <Minimize2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className={`p-6 ${isFullscreen ? 'flex-grow overflow-y-auto' : ''}`}>
                  <div className="p-4 bg-muted rounded-md border mb-6">
                    <h4 className="font-medium mb-2">Your Challenge:</h4>
                    <p className="text-muted-foreground">{currentKeyMoment?.challenge}</p>
                  </div>
                  
                  <CourseEditor 
                    code={code} 
                    onChange={setCode} 
                    language="javascript" 
                    hints={currentKeyMoment?.hints || []}
                    onSkip={handleSkipChallenge}
                    onSubmit={handleSubmitCode}
                  />
                  
                  {showFeedback && (
                    <div className="mt-6">
                      <CourseFeedback
                        code={code}
                        expectedSolution={
                          currentKeyMoment?.id === '1' ? "return num % 2 === 0" :
                          currentKeyMoment?.id === '2' ? "return str.charAt(0).toUpperCase() + str.slice(1)" :
                          "return numbers.filter(num => num > 0)"
                        }
                        onClose={handleContinue}
                        onSkip={handleSkipChallenge}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`bg-card rounded-lg border shadow-sm transition-all hover:shadow-md ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Play className="text-primary h-4 w-4 mr-2" />
                    {currentLesson.title || "Introduction"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {currentLesson.duration || "10:00"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="h-8 w-8"
                    >
                      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className={`p-6 ${isFullscreen ? 'flex-grow overflow-y-auto' : ''}`}>
                  {!isFullscreen && (
                    <p className="text-muted-foreground mb-6">
                      {currentModule.description || "Welcome to this lesson. Please watch the video to continue your learning journey."}
                    </p>
                  )}

                  <CourseVideoPlayer 
                    videoUrl={sampleVideoUrl}
                    keyMoments={getKeyMomentsForCurrentVideo()}
                    onKeyMomentEncountered={handleKeyMomentEncountered}
                    onComplete={handleVideoComplete}
                    showVideo={true}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={toggleFullscreen}
                    resumeVideo={resumeVideo}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSectionDetail;
