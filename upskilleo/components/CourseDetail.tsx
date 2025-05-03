import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Clock, Award, Shield, ArrowRight, CheckCircle, User, BarChart, Play } from 'lucide-react';
import BuyCourseButton from '@/components/BuyCourseButton';
import PurchasedCourseView from '@/components/PurchasedCourseView';

interface CourseModule {
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
  topics?: string[];
  sections?: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    locked: boolean;
  }[];
}

const coursesData: Record<string, {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  price: number;
  instructor: string;
  rating: number;
  reviews: number;
  students: number;
  level: string;
  lastUpdated: string;
  features: string[];
  topics: string[];
  modules: CourseModule[];
}> = {
  frontend: {
    title: "Frontend Development Masterclass",
    description: "Master HTML, CSS, JavaScript, and React to build engaging user interfaces",
    longDescription: "This comprehensive course takes you from the fundamentals of web design to advanced frontend frameworks. You'll learn how to create responsive, accessible, and dynamic web applications using modern best practices and tools.",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=1200",
    price: 79.99,
    instructor: "Sarah Johnson",
    rating: 4.8,
    reviews: 1245,
    students: 5430,
    level: "Beginner to Advanced",
    lastUpdated: "October 2023",
    features: [
      "Lifetime access to 120+ lessons",
      "Hands-on projects with real-world applications",
      "Downloadable source code and resources",
      "Certificate of completion",
      "24/7 community support"
    ],
    topics: [
      "HTML5 semantics and best practices",
      "CSS3 layouts and animations",
      "Modern JavaScript (ES6+)",
      "React component architecture",
      "State management with Redux",
      "Responsive design principles",
      "Web accessibility (WCAG)",
      "Performance optimization"
    ],
    modules: [
      {
        id: 'html-css',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of the web',
        duration: '4 hours',
        lessons: 8,
        completed: true,
        locked: false,
        progress: 100,
        badge: 'Beginner',
        track: 'frontend',
        topics: [
          "HTML document structure",
          "Semantic HTML elements",
          "CSS selectors and specificity",
          "Box model and layouts",
          "Responsive design basics"
        ],
        sections: [
          {
            id: 'html-intro',
            title: 'Introduction to HTML',
            duration: '30 min',
            completed: true,
            locked: false
          },
          {
            id: 'html-sematics',
            title: 'Introduction to Sematics',
            duration: '30 min',
            completed: true,
            locked: false
          },
          {
            id: 'html-pseudo',
            title: 'Knowing HTML Pseudo Elements',
            duration: '30 min',
            completed: true,
            locked: false
          },
          {
            id: 'html-tables',
            title: 'Introduction to HTML Tables',
            duration: '30 min',
            completed: true,
            locked: false
          },
          {
            id: 'css-basics',
            title: 'CSS Styling Basics',
            duration: '45 min',
            completed: true,
            locked: false
          },
          {
            id: 'responsive',
            title: 'Responsive Design Principles',
            duration: '60 min',
            completed: true,
            locked: false
          }
        ]
      },
      {
        id: 'javascript',
        title: 'JavaScript Essentials',
        description: 'Master the core language of web development',
        duration: '6 hours',
        lessons: 12,
        completed: false,
        locked: false,
        progress: 33,
        track: 'frontend',
        topics: [
          "JavaScript syntax and data types",
          "Functions and scope",
          "DOM manipulation",
          "Event handling",
          "Asynchronous JavaScript"
        ],
        sections: [
          {
            id: 'js-intro',
            title: 'JavaScript Fundamentals',
            duration: '45 min',
            completed: true,
            locked: false
          },
          {
            id: 'dom-manip',
            title: 'DOM Manipulation',
            duration: '60 min',
            completed: false,
            locked: false
          },
          {
            id: 'bom-manip',
            title: 'BOM - Browser Manuipulation',
            duration: '45 min',
            completed: false,
            locked: false
          }
        ]
      }
    ]
  },
  backend: {
    title: "Backend Development with Node.js",
    description: "Learn server-side programming with Node.js, Express, and MongoDB",
    longDescription: "Become a backend expert with this hands-on course that covers everything from server basics to advanced API development and database integration. Perfect for developers looking to expand their skills to the server side.",
    image: "https://plus.unsplash.com/premium_photo-1664299887779-5e8775951703?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 89.99,
    instructor: "Michael Chen",
    rating: 4.7,
    reviews: 893,
    students: 3120,
    level: "Intermediate",
    lastUpdated: "November 2023",
    features: [
      "Lifetime access to 90+ lessons",
      "5 complete backend projects",
      "API documentation and testing techniques",
      "Database design practices",
      "Deployment strategies"
    ],
    topics: [
      "Node.js environment and modules",
      "Express.js framework",
      "RESTful API development",
      "MongoDB and Mongoose ORM",
      "JWT authentication",
      "Error handling and validation",
      "Deployment to cloud platforms",
      "Testing with Jest and Supertest"
    ],
    modules: [
      {
        id: 'node-basics',
        title: 'Node.js Fundamentals',
        description: 'Learn the basics of server-side JavaScript',
        duration: '5 hours',
        lessons: 10,
        completed: false,
        locked: false,
        progress: 100,
        badge: 'Beginner',
        track: 'backend',
        sections: [
          {
            id: 'node-intro',
            title: 'Introduction to Node.js',
            duration: '45 min',
            completed: false,
            locked: false
          },
          {
            id: 'modules',
            title: 'Node.js Modules System',
            duration: '60 min',
            completed: false,
            locked: false
          }
        ]
      },
      {
        id: 'express',
        title: 'Express.js Framework',
        description: 'Build robust web applications with Express',
        duration: '6 hours',
        lessons: 12,
        completed: false,
        locked: false,
        progress: 2,
        track: 'backend',
        sections: [
          {
            id: 'express-intro',
            title: 'Getting Started with Express',
            duration: '45 min',
            completed: false,
            locked: false
          },
          {
            id: 'middleware',
            title: 'Express Middleware',
            duration: '60 min',
            completed: false,
            locked: true
          }
        ]
      }
    ]
  },
  fullstack: {
    title: "Full-Stack JavaScript Development",
    description: "Comprehensive path covering both frontend and backend technologies for complete application development",
    longDescription: "This complete course bridges the gap between frontend and backend development, enabling you to build full-stack applications from scratch. You'll learn to integrate React frontends with Node.js backends and deploy complete applications.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    price: 129.99,
    instructor: "Alex Rivera",
    rating: 4.9,
    reviews: 1578,
    students: 7850,
    level: "Beginner to Expert",
    lastUpdated: "December 2023",
    features: [
      "Lifetime access to 180+ lessons",
      "3 complete full-stack projects",
      "Front-to-back integration techniques",
      "Authentication and authorization",
      "CI/CD and deployment workflows"
    ],
    topics: [
      "JavaScript fundamentals (ES6+)",
      "React frontend development",
      "Node.js and Express backend",
      "MongoDB database integration",
      "RESTful and GraphQL APIs",
      "Authentication with JWT",
      "State management",
      "Deployment to Vercel and Heroku"
    ],
    modules: [
      {
        id: 'js-foundations',
        title: 'JavaScript Foundations',
        description: 'Master modern JavaScript for both frontend and backend',
        duration: '8 hours',
        lessons: 15,
        completed: false,
        locked: false,
        progress: 0,
        badge: 'Beginner',
        track: 'fullstack',
        sections: [
          {
            id: 'es6-basics',
            title: 'ES6+ Fundamentals',
            duration: '90 min',
            completed: false,
            locked: false
          },
          {
            id: 'async-js',
            title: 'Asynchronous JavaScript',
            duration: '75 min',
            completed: false,
            locked: true
          }
        ]
      },
      {
        id: 'react-frontend',
        title: 'React Frontend Development',
        description: 'Build dynamic user interfaces with React',
        duration: '10 hours',
        lessons: 20,
        completed: false,
        locked: false,
        progress: 0,
        track: 'fullstack',
        sections: [
          {
            id: 'react-core',
            title: 'React Core Concepts',
            duration: '60 min',
            completed: false,
            locked: false
          },
          {
            id: 'hooks',
            title: 'React Hooks',
            duration: '75 min',
            completed: false,
            locked: true
          }
        ]
      }
    ]
  }
};

const CourseDetail = () => {
  const searchParams = useSearchParams();
  const courseId:any = searchParams.get('courseId');
  const router = useRouter();
  const [isPurchased, setIsPurchased] = useState(true);
  
  useEffect(() => {
    // Check if course is purchased from localStorage
    const purchasedCourses = JSON.parse(localStorage.getItem('purchased-courses') || '[]');
    setIsPurchased(true);
    
    window.scrollTo(0, 0);
  }, [courseId]);
  
  if (!courseId || !coursesData[courseId]) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
        <p className="text-muted-foreground mb-8">{"The course you're looking for doesn't exist or has been removed."}</p>
        <Button onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    );
  }
  
  const course = coursesData[courseId];
  
  if (isPurchased) {
    return (
      <PurchasedCourseView 
        courseId={courseId}
        courseTitle={course.title}
        courseDescription={course.description}
        courseImage={course.image}
        modules={course.modules}
      />
    );
  }

  return (
    <>
      <div className="bg-muted/30 py-16 border-b">
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-primary/5">
                  <BookOpen className="mr-1 h-3 w-3" />
                  {course.modules.reduce((acc, module) => acc + module.lessons, 0)} Lessons
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  <Clock className="mr-1 h-3 w-3" />
                  {course.modules.reduce((acc, module) => {
                    const hours = parseInt(module.duration.split(' ')[0]);
                    return acc + hours;
                  }, 0)} Hours
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  <User className="mr-1 h-3 w-3" />
                  {course.level}
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  <BarChart className="mr-1 h-3 w-3" />
                  {course.students.toLocaleString()} Students
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                  <img 
                    src={`https://i.pravatar.cc/40?u=${course.instructor}`} 
                    alt={course.instructor}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Instructor: {course.instructor}</p>
                  <div className="flex items-center text-sm">
                    <span className="text-amber-500 flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(course.rating) ? "text-amber-500" : "text-muted"}>★</span>
                      ))}
                    </span>
                    <span className="ml-1 text-muted-foreground">({course.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-5 bg-card shadow-sm">
                <div className="text-2xl font-bold mb-3">${course.price}</div>
                <BuyCourseButton 
                  courseId={courseId}
                  price={course.price}
                  isPurchased={isPurchased}
                  redirectUrl={`/?courseId=${courseId}`}
                  className="w-full text-base py-2.5"
                />
                <p className="text-xs text-muted-foreground text-center mt-3">
                  30-day money-back guarantee
                </p>
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">This course includes:</h3>
                  <ul className="space-y-2">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="animate-scale-up">
              <div className="relative rounded-lg overflow-hidden shadow-lg border border-border">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Button variant="default" className="w-full" asChild>
                    <a href="#preview-video">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Preview
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-muted-foreground">{course.longDescription}</p>
              
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-primary" />
                    {"Skills You'll Gain"}
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {course.topics.slice(0, 4).map((topic, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <ArrowRight className="h-3.5 w-3.5 text-primary mr-2 mt-0.5" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center">
                    <Award className="mr-2 h-4 w-4 text-primary" />
                    Certificate
                  </h3>
                  <p className="mt-3 text-sm">
                    Complete all modules to earn a completion certificate that demonstrates your proficiency in {course.title.toLowerCase()}.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="text-sm text-muted-foreground mb-4">
                {course.modules.length} modules • {course.modules.reduce((acc, module) => acc + module.lessons, 0)} lessons • {course.modules.reduce((acc, module) => {
                  const hours = parseInt(module.duration.split(' ')[0]);
                  return acc + hours;
                }, 0)} hours total
              </div>
              
              <Accordion type="single" collapsible className="border rounded-lg">
                {course.modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center text-left">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{module.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {module.lessons} lessons • {module.duration}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pt-0 pb-3">
                      <div className="ml-11 border-l border-border pl-4 space-y-3">
                        {module.sections ? (
                          module.sections.map((section, i) => (
                            <div 
                              key={section.id} 
                              className="py-2 flex items-start justify-between"
                            >
                              <div className="flex items-start">
                                <Play className="h-4 w-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{section.title}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {section.duration}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground italic">Content details coming soon</span>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
            
            <section id="preview-video">
              <h2 className="text-2xl font-bold mb-4">Course Preview</h2>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border flex items-center justify-center shadow-md">
                <div className="text-center p-6">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Preview video available after signing in</p>
                </div>
              </div>
            </section>
          </div>
          
          <div className="space-y-6">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold mb-4">Topics Covered</h2>
              <ul className="space-y-2 mb-6">
                {course.topics.map((topic, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">{topic}</span>
                  </li>
                ))}
              </ul>
              
              <div className="rounded-lg border bg-card shadow-sm p-4">
                <h3 className="font-semibold mb-3">Ready to start learning?</h3>
                <BuyCourseButton 
                  courseId={courseId}
                  price={course.price}
                  isPurchased={isPurchased}
                  redirectUrl={`/?courseId=${courseId}`}
                  className="w-full"
                />
                <div className="mt-4 text-xs text-center text-muted-foreground">
                  Last updated: {course.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail; 