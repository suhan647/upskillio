
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  Clock, 
  Award, 
  ChevronDown,
  ChevronUp,
  BookOpen,
  BarChart,
  CheckCircle
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import BuyCourseButton from './BuyCourseButton';

interface Course {
  id: string;
  title: string;
  progress: number;
  lastAccessed: string;
  nextLesson: string;
  image: string;
  price: number;
}

const LearningDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>([]);
  const [showAvailableCourses, setShowAvailableCourses] = useState(true);
  
  const expandedParam = searchParams.get('expanded');
  const initialExpandedCourseIds = expandedParam ? expandedParam.split(',') : [];
  const boughtCourseParam = searchParams.get('boughtCourse');
  
  const [expandedCourseIds, setExpandedCourseIds] = useState<string[]>(initialExpandedCourseIds);
  const [coursesData, setCoursesData] = useState<Course[]>([
    {
      id: 'javascript',
      title: 'JavaScript Essentials',
      progress: 65,
      lastAccessed: '2 days ago',
      nextLesson: 'Functions & Scope',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=300&h=200',
      price: 49.99
    },
    {
      id: 'html-css',
      title: 'HTML & CSS Fundamentals',
      progress: 100,
      lastAccessed: '1 week ago',
      nextLesson: 'Course Completed',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=300&h=200',
      price: 39.99
    },
    {
      id: 'react',
      title: 'React Front-End Development',
      progress: 30,
      lastAccessed: '3 days ago',
      nextLesson: 'State Management',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300&h=200',
      price: 69.99
    },
    {
      id: 'node-basics',
      title: 'Node.js Fundamentals',
      progress: 0,
      lastAccessed: 'Never',
      nextLesson: 'Introduction to Node.js',
      image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=300&h=200',
      price: 59.99
    },
    {
      id: 'advanced',
      title: 'Advanced Frontend Concepts',
      progress: 0,
      lastAccessed: 'Never',
      nextLesson: 'Redux Fundamentals',
      image: 'https://images.unsplash.com/photo-1558346547-4439467bd1d5?auto=format&fit=crop&q=80&w=300&h=200',
      price: 79.99
    }
  ]);
  
  const [inProgressCourses, setInProgressCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [learningStats, setLearningStats] = useState({
    totalMinutesLearned: 0,
    coursesInProgress: 0,
    completedCourses: 0,
    totalCourses: 0
  });

  useEffect(() => {
    const storedPurchasedCourses = JSON.parse(localStorage.getItem('purchased-courses') || '[]');
    setPurchasedCourseIds(storedPurchasedCourses);
    
    const coursesInProgress = coursesData
      .filter(course => storedPurchasedCourses.includes(course.id) && course.progress > 0 && course.progress < 100)
      .sort((a, b) => b.progress - a.progress);
    
    const coursesCompleted = coursesData
      .filter(course => storedPurchasedCourses.includes(course.id) && course.progress === 100);
    
    const coursesAvailable = coursesData
      .filter(course => !storedPurchasedCourses.includes(course.id));
    
    setInProgressCourses(coursesInProgress);
    setCompletedCourses(coursesCompleted);
    setAvailableCourses(coursesAvailable);
    
    if (boughtCourseParam === 'false') {
      setShowAvailableCourses(true);
    } else if (boughtCourseParam === 'true' && storedPurchasedCourses.length === 0) {
      setShowAvailableCourses(true);
    } else if (boughtCourseParam === 'true' && storedPurchasedCourses.length > 0) {
      setShowAvailableCourses(false);
    }

    const completed = coursesCompleted.length;
    const inProgress = coursesInProgress.length;

    setLearningStats({
      totalMinutesLearned: Math.floor(Math.random() * 500) + 120,
      coursesInProgress: inProgress,
      completedCourses: completed,
      totalCourses: storedPurchasedCourses.length
    });
  }, [boughtCourseParam]);

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourseIds(prev => {
      const newState = prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId];
      
      if (newState.length > 0) {
        setSearchParams(prevParams => {
          const newParams = new URLSearchParams(prevParams);
          newParams.set('expanded', newState.join(','));
          return newParams;
        });
      } else {
        setSearchParams(prevParams => {
          const newParams = new URLSearchParams(prevParams);
          newParams.delete('expanded');
          return newParams;
        });
      }
      
      return newState;
    });
  };

  const handleBuyCourse = (courseId: string) => {
    const newPurchasedCourses = [...purchasedCourseIds, courseId];
    localStorage.setItem('purchased-courses', JSON.stringify(newPurchasedCourses));
    setPurchasedCourseIds(newPurchasedCourses);
    
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('boughtCourse', 'true');
      return newParams;
    });
    
    const coursesInProgress = coursesData
      .filter(course => newPurchasedCourses.includes(course.id) && course.progress > 0 && course.progress < 100);
    const coursesCompleted = coursesData
      .filter(course => newPurchasedCourses.includes(course.id) && course.progress === 100);
    const coursesAvailable = coursesData
      .filter(course => !newPurchasedCourses.includes(course.id));
    
    setInProgressCourses(coursesInProgress);
    setCompletedCourses(coursesCompleted);
    setAvailableCourses(coursesAvailable);
    
    setLearningStats(prev => ({
      ...prev,
      totalCourses: newPurchasedCourses.length
    }));
  };

  const renderCourseCard = (course: Course, isCompleted: boolean = false) => (
    <Card key={course.id} className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <div className="absolute bottom-3 left-3 right-3">
          <Progress value={course.progress} className="h-2 bg-background/40" />
          <div className="flex justify-between text-xs text-white mt-1">
            <span>{isCompleted ? "Completed!" : `Progress: ${course.progress}%`}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {course.lastAccessed}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleCourseExpansion(course.id)}
            className="p-1 h-auto text-muted-foreground hover:text-primary"
            aria-label="Toggle course details"
          >
            {expandedCourseIds.includes(course.id) ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {isCompleted ? "Status: Complete" : `Next: ${course.nextLesson}`}
        </p>
        
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/section?sectionId=${course.id}`} className="flex items-center gap-2">
              {isCompleted ? (
                <>
                  <Award size={16} className="text-yellow-500" />
                  Review
                </>
              ) : (
                <>
                  <PlayCircle size={16} />
                  Continue
                </>
              )}
            </Link>
          </Button>
          
          <Link to={`/course-detail/${course.id}`} className="text-xs text-primary hover:underline">
            {isCompleted ? "View Certificate" : "View Course Details"}
          </Link>
        </div>
        
        <Collapsible open={expandedCourseIds.includes(course.id)}>
          <CollapsibleContent className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <p className="text-sm mb-2">{isCompleted ? "Course completion stats:" : "Course progress overview:"}</p>
            <div className="space-y-2">
              {isCompleted ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Completed on:</span>
                    <span className="text-xs font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Grade:</span>
                    <span className="text-xs font-medium">A+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Time spent:</span>
                    <span className="text-xs font-medium">{Math.floor(Math.random() * 10) + 5} hours</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Started:</span>
                    <span className="text-xs font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Last activity:</span>
                    <span className="text-xs font-medium">{course.lastAccessed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Current lesson:</span>
                    <span className="text-xs font-medium">{course.nextLesson}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Time spent:</span>
                    <span className="text-xs font-medium">{Math.floor(Math.random() * 5) + 2} hours</span>
                  </div>
                </>
              )}
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link to={`/course-detail/${course.id}`}>
                {isCompleted ? "Download Certificate" : "Full Course Overview"}
              </Link>
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );

  const renderMyCourses = () => {
    const hasMyCourses = inProgressCourses.length > 0 || completedCourses.length > 0;
    
    if (!hasMyCourses) {
      return (
        <div className="text-center py-10 bg-card/50 rounded-lg border border-border">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">You haven't purchased any courses yet</h3>
            <p className="text-muted-foreground mb-6">
              Browse our available courses below and start your learning journey.
            </p>
            <Button asChild>
              <a href="#available-courses">Browse Courses</a>
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {inProgressCourses.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map(course => renderCourseCard(course))}
          </div>
        )}
        
        {completedCourses.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mt-12 mb-4">Completed Courses</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map(course => renderCourseCard(course, true))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Your <span className="text-gradient">Learning</span> Progress
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Continue your learning journey where you left off.
        </p>
      </div>

      {(inProgressCourses.length > 0 || completedCourses.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{learningStats.totalCourses}</span>
            </div>
            <p className="text-sm text-center text-muted-foreground">Total Courses</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{learningStats.totalMinutesLearned}</span>
            </div>
            <p className="text-sm text-center text-muted-foreground">Minutes Learned</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-center mb-2">
              <BarChart className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">{learningStats.coursesInProgress}</span>
            </div>
            <p className="text-sm text-center text-muted-foreground">In Progress</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{learningStats.completedCourses}</span>
            </div>
            <p className="text-sm text-center text-muted-foreground">Completed</p>
          </div>
        </div>
      )}
      
      {inProgressCourses.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.slice(0, 3).map(course => renderCourseCard(course))}
          </div>
        </section>
      )}
      
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>
        {renderMyCourses()}
      </section>
      
      {(showAvailableCourses || availableCourses.length > 0) && (
        <section id="available-courses" className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
          {availableCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(course => (
                <Card key={course.id} className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">${course.price}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 5) + 5} hours of content
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/course-detail/${course.id}`}>
                          Course Details
                        </Link>
                      </Button>
                      
                      <Button onClick={() => handleBuyCourse(course.id)}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-card/50 rounded-lg border border-border">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">You've enrolled in all our courses!</h3>
                <p className="text-muted-foreground mb-6">
                  Check back soon for new courses and updates.
                </p>
                <Button asChild>
                  <Link to="/learning">Review Your Courses</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default LearningDashboard;
