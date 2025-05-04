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
  type: 'html' | 'css' | 'javascript' | 'typescript' | 'default';
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  keyMoments?: KeyMoment[];
  videoUrl?: string;
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

const keyMomentsMap: Record<string, KeyMoment[]> = {
  default: [
    {
      id: 'default-1',
      timeInSeconds: 15,
      challenge: "Welcome to the course! Let's get started with a basic challenge.",
      hints: ["This is a default challenge to help you get familiar with the interface."],
      solution: "// Default solution",
      type: 'default' as const
    }
  ],
  html: [
    {
      id: 'html-1',
      timeInSeconds: 15,
      challenge: "Create a semantic HTML structure for a blog post with a header, main content, and footer.",
      hints: [
        "Use appropriate semantic HTML5 elements like <header>, <main>, <article>, and <footer>",
        "Include a title, author information, and publication date in the header"
      ],
      solution: `<header>
  <h1>My Blog Post</h1>
  <div class="meta">
    <span class="author">By John Doe</span>
    <time datetime="2024-03-20">March 20, 2024</time>
  </div>
</header>
<main>
  <article>
    <p>This is the main content of my blog post...</p>
  </article>
</main>
<footer>
  <p>© 2024 My Blog. All rights reserved.</p>
</footer>`,
      type: 'html' as const
    },
    {
      id: 'html-2',
      timeInSeconds: 45,
      challenge: "Create a responsive navigation menu with dropdown items.",
      hints: [
        "Use <nav> element with unordered list",
        "Implement nested lists for dropdown items",
        "Add appropriate ARIA attributes for accessibility"
      ],
      solution: `<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li>
      <a href="/products">Products</a>
      <ul>
        <li><a href="/products/electronics">Electronics</a></li>
        <li><a href="/products/clothing">Clothing</a></li>
      </ul>
    </li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>`,
      type: 'html' as const
    }
  ],
  css: [
    {
      id: 'css-1',
      timeInSeconds: 15,
      challenge: "Create a responsive grid layout for a photo gallery.",
      hints: [
        "Use CSS Grid for the layout",
        "Implement responsive breakpoints using media queries",
        "Add hover effects for better user interaction"
      ],
      solution: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .gallery {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}`,
      type: 'css' as const
    },
    {
      id: 'css-2',
      timeInSeconds: 45,
      challenge: "Create a responsive card component with hover effects.",
      hints: [
        "Use flexbox for the card layout",
        "Implement smooth transitions for hover effects",
        "Add a subtle shadow effect"
      ],
      solution: `.card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #666;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .card {
    margin: 1rem;
  }
}`,
      type: 'css' as const
    }
  ],
  javascript: [
    {
      id: 'js-1',
      timeInSeconds: 15,
      challenge: "Create a function to handle form validation for an email input.",
      hints: [
        "Use regular expressions to validate email format",
        "Return appropriate error messages for different validation cases",
        "Handle both required field and format validation"
      ],
      solution: `function validateEmail(email) {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: 'Email is valid' };
}`,
      type: 'javascript' as const
    },
    {
      id: 'js-2',
      timeInSeconds: 45,
      challenge: "Create a function to fetch and display data from an API.",
      hints: [
        "Use async/await for handling the API request",
        "Implement error handling",
        "Add loading state management"
      ],
      solution: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error.message
    };
  }
}`,
      type: 'javascript' as const
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
  const [code, setCode] = useState("// Write your solution here");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentKeyMoment, setCurrentKeyMoment] = useState<KeyMoment | null>(null);
  const [progress, setProgress] = useState(0);
  const [localModules, setLocalModules] = useState(modules);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastVideoTime, setLastVideoTime] = useState(0);
  
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
    const currentModule = localModules[currentModuleIndex];
    if (!currentModule) return [];
    
    const currentLesson = currentModule.lessons[currentLessonIndex];
    if (!currentLesson || !currentLesson.keyMoments) return [];
    
    return currentLesson.keyMoments;
  };

  const getCurrentVideoUrl = () => {
    const currentModule = localModules[currentModuleIndex];
    if (!currentModule) return "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    
    const currentLesson = currentModule.lessons[currentLessonIndex];
    if (!currentLesson || !currentLesson.videoUrl) return "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    
    return currentLesson.videoUrl;
  };

  const handleKeyMomentEncountered = (keyMoment: KeyMoment) => {
    setCurrentKeyMoment(keyMoment);
    setShowEditor(true);
    setLastVideoTime(keyMoment.timeInSeconds);
    
    // Set initial code based on the challenge type
    if (keyMoment.id.startsWith('html')) {
      setCode(`<!-- Write your HTML solution here -->
${keyMoment.solution.split('\n')[0]}`);
    } else if (keyMoment.id.startsWith('css')) {
      setCode(`/* Write your CSS solution here */
${keyMoment.solution.split('\n')[0]}`);
    } else if (keyMoment.id.startsWith('js')) {
      setCode(`// Write your JavaScript solution here
${keyMoment.solution.split('\n')[0]}`);
    } else {
      setCode("// Write your solution here");
    }
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
    let isCorrect = false;
    
    if (currentKeyMoment) {
      if (currentKeyMoment.id.startsWith('html')) {
        // For HTML challenges, check if the code contains the main structural elements
        isCorrect = code.includes(currentKeyMoment.solution.split('\n')[0].trim());
      } else if (currentKeyMoment.id.startsWith('css')) {
        // For CSS challenges, check if the code contains the main CSS properties
        isCorrect = code.includes(currentKeyMoment.solution.split('\n')[0].trim());
      } else if (currentKeyMoment.id.startsWith('js')) {
        // For JavaScript challenges, check if the code contains the main function structure
        isCorrect = code.includes(currentKeyMoment.solution.split('\n')[0].trim());
      }
    }
    
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
    
    // Update the current lesson's progress
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
    
    // Update the current lesson's progress
    const updatedModules = [...localModules];
    if (updatedModules[currentModuleIndex] && updatedModules[currentModuleIndex].lessons[currentLessonIndex]) {
      updatedModules[currentModuleIndex].lessons[currentLessonIndex].completed = true;
      setLocalModules(updatedModules);
      calculateProgress(updatedModules);
    }
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
  
  return (
    <div className={`${isFullscreen ? 'fixed inset-0 h-[100vh] w-[100vw] overflow-hidden z-[9999]' : 'min-h-screen'} bg-gradient-to-b from-background via-background/95 to-muted/30`}>
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

      <div className={`${isFullscreen ? 'fixed inset-0 z-[10000] bg-background h-[100vh] w-[100vw]' : 'container mx-auto px-4 md:px-6'}`}>
        <div className={`${isFullscreen ? 'h-[80vh] w-[100vw] flex flex-col' : 'grid md:grid-cols-12 gap-6'}`}>
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
          
          <div className={`${isFullscreen ? 'flex-1 flex flex-col h-[100vh]' : 'md:col-span-8 lg:col-span-9'}`}>
            {showEditor ? (
              <div className={`${isFullscreen ? 'h-[100vh] w-[100vw] flex flex-col' : 'animate-in fade-in-50 bg-card rounded-lg border shadow-sm'}`}>
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
                
                <div className={`${isFullscreen ? 'flex-1 overflow-y-auto h-[calc(100vh-4rem)]' : 'p-6'}`}>
                  <div className="p-4 bg-muted rounded-md border mb-6">
                    <h4 className="font-medium mb-2">Your Challenge:</h4>
                    <p className="text-muted-foreground">{currentKeyMoment?.challenge}</p>
                  </div>
                  
                  <CourseEditor 
                    code={code} 
                    onChange={setCode} 
                    language={currentKeyMoment?.type || 'javascript'}
                    previewType={currentKeyMoment?.type || 'javascript'}
                    hints={currentKeyMoment?.hints || []}
                    onSkip={handleSkipChallenge}
                    onSubmit={handleSubmitCode}
                    height={isFullscreen ? "50vh" : "300px"}
                  />
                  
                  {showFeedback && (
                    <div className="mt-6">
                      <CourseFeedback
                        code={code}
                        expectedSolution={currentKeyMoment?.solution || ""}
                        onClose={handleContinue}
                        onSkip={handleSkipChallenge}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${isFullscreen ? 'h-[100vh] w-[100vw] flex flex-col' : 'bg-card rounded-lg border shadow-sm transition-all hover:shadow-md'}`}>
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
                
                <div className={`${isFullscreen ? 'flex-1 flex flex-col h-[calc(100vh-4rem)]' : 'p-6'}`}>
                  {!isFullscreen && (
                    <p className="text-muted-foreground mb-6">
                      {currentModule.description || "Welcome to this lesson. Please watch the video to continue your learning journey."}
                    </p>
                  )}

                  <div className={`${isFullscreen ? 'flex-1 h-[calc(100vh-4rem)]' : ''}`}>
                    <CourseVideoPlayer 
                      videoUrl={getCurrentVideoUrl()}
                      keyMoments={getKeyMomentsForCurrentVideo()}
                      onKeyMomentEncountered={handleKeyMomentEncountered}
                      onComplete={handleVideoComplete}
                      showVideo={true}
                      isFullscreen={isFullscreen}
                      onToggleFullscreen={toggleFullscreen}
                      resumeVideo={resumeVideo}
                      lastVideoTime={lastVideoTime}
                    />
                  </div>
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
