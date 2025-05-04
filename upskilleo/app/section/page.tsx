/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseSectionDetail from '@/components/CourseSectionDetail';
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "sonner";
import {  ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from 'next/navigation';

// Sample data for demonstration
const courseModules = {
  "html-css": {
    id: "module-html-css",
    title: "HTML & CSS Fundamentals",
    description: "Learn the building blocks of web development with hands-on exercises.",
    modules: [
      {
        id: "module-1",
        title: "HTML Basics",
        description: "Learn the fundamentals of HTML",
        lessons: [
          {
            id: "lesson-1-1",
            title: "HTML Document Structure",
            duration: "10 min",
            completed: false,
            locked: false,
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            keyMoments: [
              {
                id: 'html-structure-1',
                timeInSeconds: 15,
                challenge: "Create a basic HTML5 document structure",
                hints: [
                  "Use the DOCTYPE declaration",
                  "Include html, head, and body tags",
                  "Add a title in the head section"
                ],
                solution: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
                type: 'html'
              }
            ]
          },
          {
            id: "lesson-1-2",
            title: "HTML Elements and Attributes",
            duration: "12 min",
            completed: true,
            locked: false,
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            keyMoments: [
              {
                id: 'html-elements-1',
                timeInSeconds: 20,
                challenge: "Create a form with input fields",
                hints: [
                  "Use the form element",
                  "Add text and email input fields",
                  "Include a submit button"
                ],
                solution: `<form>
  <input type="text" placeholder="Name">
  <input type="email" placeholder="Email">
  <button type="submit">Submit</button>
</form>`,
                type: 'html'
              }
            ]
          }
        ]
      },
      {
        id: "module-2",
        title: "CSS Styling",
        description: "How to style HTML elements with CSS",
        lessons: [
          {
            id: "lesson-2-1",
            title: "CSS Selectors",
            duration: "8 min",
            completed: false,
            locked: false,
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            keyMoments: [
              {
                id: 'css-selectors-1',
                timeInSeconds: 15,
                challenge: "Style elements using different selectors",
                hints: [
                  "Use class and ID selectors",
                  "Apply different colors to elements",
                  "Use the universal selector for reset"
                ],
                solution: `* {
  margin: 0;
  padding: 0;
}

.header {
  background-color: #f0f0f0;
}

#main-title {
  color: #333;
}`,
                type: 'css'
              }
            ]
          },
          {
            id: "lesson-2-2",
            title: "Box Model",
            duration: "14 min",
            completed: false,
            locked: true,
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            keyMoments: [
              {
                id: 'box-model-1',
                timeInSeconds: 25,
                challenge: "Create a card with proper spacing",
                hints: [
                  "Use margin and padding",
                  "Add a border",
                  "Include a box shadow"
                ],
                solution: `.card {
  margin: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
                type: 'css'
              }
            ]
          }
        ]
      }
    ]
  },
  "javascript": {
    id: "module-javascript",
    title: "JavaScript Essentials",
    description: "Master the core language of web development with practical exercises.",
    modules: [
      {
        id: "module-1",
        title: "JavaScript Fundamentals",
        description: "Essential JavaScript concepts every developer should know",
        lessons: [
          {
            id: "lesson-1-1",
            title: "Variables and Data Types",
            duration: "10 min",
            completed: true,
            locked: false,
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            keyMoments: [
              {
                id: 'js-variables-1',
                timeInSeconds: 15,
                challenge: "Create variables with different data types",
                hints: [
                  "Use let and const",
                  "Create string, number, and boolean variables",
                  "Use template literals"
                ],
                solution: `let name = "John";
const age = 25;
let isStudent = true;
console.log(\`\${name} is \${age} years old\`);`,
                type: 'javascript'
              }
            ]
          },
          {
            id: "lesson-1-2",
            title: "Functions and Scope",
            duration: "15 min",
            completed: false,
            locked: false,
            videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            keyMoments: [
              {
                id: 'js-functions-1',
                timeInSeconds: 20,
                challenge: "Create a function that calculates the area of a rectangle",
                hints: [
                  "Use function declaration",
                  "Take width and height as parameters",
                  "Return the calculated area"
                ],
                solution: `function calculateArea(width, height) {
  return width * height;
}`,
                type: 'javascript'
              }
            ]
          }
        ]
      },
      {
        id: "module-2",
        title: "DOM Manipulation",
        description: "Learn how to interact with the Document Object Model",
        lessons: [
          {
            id: "lesson-2-1",
            title: "Selecting Elements",
            duration: "8 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-2-2",
            title: "Modifying DOM Elements",
            duration: "14 min",
            completed: false,
            locked: true
          },
          {
            id: "lesson-2-3",
            title: "Event Handling",
            duration: "18 min",
            completed: false,
            locked: true
          }
        ]
      }
    ]
  },
  "react": {
    id: "module-react",
    title: "React Framework",
    description: "Build interactive UIs with the popular React library and related tools.",
    modules: [
      {
        id: "module-1",
        title: "React Basics",
        description: "Fundamental concepts of React",
        lessons: [
          {
            id: "lesson-1-1",
            title: "Components and Props",
            duration: "12 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-1-2",
            title: "State and Lifecycle",
            duration: "15 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-1-3",
            title: "Handling Events",
            duration: "10 min",
            completed: false,
            locked: true
          }
        ]
      },
      {
        id: "module-2",
        title: "React Hooks",
        description: "Use React Hooks to manage state and side effects",
        lessons: [
          {
            id: "lesson-2-1",
            title: "useState and useEffect",
            duration: "14 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-2-2",
            title: "Custom Hooks",
            duration: "12 min",
            completed: false,
            locked: true
          },
          {
            id: "lesson-2-3",
            title: "Context API",
            duration: "16 min",
            completed: false,
            locked: true
          }
        ]
      }
    ]
  },
  "advanced": {
    id: "module-advanced",
    title: "Advanced Frontend Concepts",
    description: "Learn state management, performance optimization, and modern frontend architecture.",
    modules: [
      {
        id: "module-1",
        title: "State Management",
        description: "Advanced state management techniques",
        lessons: [
          {
            id: "lesson-1-1",
            title: "Redux Fundamentals",
            duration: "15 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-1-2",
            title: "Redux Toolkit",
            duration: "18 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-1-3",
            title: "Context vs Redux",
            duration: "12 min",
            completed: false,
            locked: true
          }
        ]
      },
      {
        id: "module-2",
        title: "Performance Optimization",
        description: "Techniques to optimize React applications",
        lessons: [
          {
            id: "lesson-2-1",
            title: "React.memo and useMemo",
            duration: "10 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-2-2",
            title: "Code Splitting",
            duration: "14 min",
            completed: false,
            locked: true
          },
          {
            id: "lesson-2-3",
            title: "Lazy Loading",
            duration: "12 min",
            completed: false,
            locked: true
          }
        ]
      }
    ]
  },
  "node-basics": {
    id: "module-node-basics",
    title: "Node.js Fundamentals",
    description: "Introduction to server-side JavaScript and the Node.js runtime.",
    modules: [
      {
        id: "module-1",
        title: "Node.js Introduction",
        description: "Get started with Node.js",
        lessons: [
          {
            id: "lesson-1-1",
            title: "What is Node.js?",
            duration: "8 min",
            completed: true,
            locked: false
          },
          {
            id: "lesson-1-2",
            title: "Modules and NPM",
            duration: "12 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-1-3",
            title: "File System Operations",
            duration: "15 min",
            completed: false,
            locked: true
          }
        ]
      },
      {
        id: "module-2",
        title: "Asynchronous Programming",
        description: "Learn how to write asynchronous code in Node.js",
        lessons: [
          {
            id: "lesson-2-1",
            title: "Callbacks and Promises",
            duration: "14 min",
            completed: false,
            locked: false
          },
          {
            id: "lesson-2-2",
            title: "Async/Await",
            duration: "12 min",
            completed: false,
            locked: true
          },
          {
            id: "lesson-2-3",
            title: "Event Emitters",
            duration: "10 min",
            completed: false,
            locked: true
          }
        ]
      }
    ]
  }
};

const SectionDetail = () => {
  const searchParams = useSearchParams();
  const sectionId:any = searchParams.get('sectionId');
  console.log('params:', searchParams);
  const router = useRouter();
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading state for a smoother transition
    setLoading(true);
    
    // Delayed data fetch simulation
    setTimeout(() => {
      if (sectionId && courseModules[sectionId as keyof typeof courseModules]) {
        const moduleData = courseModules[sectionId as keyof typeof courseModules];
        setCourseData(moduleData);
        
        toast.success(`Started ${moduleData.title}`, {
          description: "Interactive video and coding challenges are ready for you",
          position: "bottom-right",
        });
      } else {
        // If section not found, notify and redirect
        toast.error("Section not found", {
          description: "Redirecting to course list",
          position: "bottom-right",
        });
        
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
      setLoading(false);
    }, 800);
  }, [sectionId, router]);
  
  if (loading) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 relative">
          {/* Background elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute -top-20 -right-40 w-[40rem] h-[40rem] bg-upskilleo-purple/10 rounded-full blur-3xl transform-gpu"></div>
            <div className="absolute top-1/3 -left-60 w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-3xl transform-gpu"></div>
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-3xl transform-gpu"></div>
          </div>
          
          <div className="container mx-auto py-16 px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Skeleton Loading UI */}
              <div className="h-64 mb-12 rounded-xl bg-card/50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
                <div className="absolute bottom-8 left-8 space-y-4 w-2/3">
                  <Skeleton className="h-10 w-3/4 bg-muted/50" />
                  <Skeleton className="h-5 w-1/2 bg-muted/30" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full bg-muted/20" />
                    <Skeleton className="h-6 w-24 rounded-full bg-muted/20" />
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-4 lg:col-span-3">
                  <Skeleton className="h-[calc(100vh-300px)] rounded-lg bg-card/50" />
                </div>
                <div className="md:col-span-8 lg:col-span-9">
                  <Skeleton className="h-96 rounded-lg bg-card/50" />
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-4 w-full bg-muted/30" />
                    <Skeleton className="h-4 w-5/6 bg-muted/30" />
                    <Skeleton className="h-4 w-4/6 bg-muted/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }
  
  if (!courseData) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 relative">
          {/* Background elements */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute -top-20 -right-40 w-[40rem] h-[40rem] bg-upskilleo-purple/10 rounded-full blur-3xl transform-gpu"></div>
            <div className="absolute top-1/3 -left-60 w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-3xl transform-gpu"></div>
          </div>
          
          <div className="container mx-auto py-16 px-4 relative z-10 flex flex-col items-center justify-center">
            <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <h1 className="text-2xl font-bold mb-3">Section not found</h1>
                <p className="text-muted-foreground mb-6">The requested section does not exist or could not be loaded.</p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => router.push('/')}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <ChevronRight className="mr-2 h-4 w-4" /> Return to Home
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }
  
  return (
    <>
      <CourseSectionDetail 
        title={courseData.title}
        description={courseData.description}
        modules={courseData.modules}
      />
    </>
  );
};

export default SectionDetail;
