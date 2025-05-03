/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { PlayCircle } from 'lucide-react';
import { toast } from "sonner";
import { PurchasedCourseProps } from '@/types/course';
import CourseHeader from './course/CourseHeader';
import CourseProgressOverview from './course/CourseProgressOverview';
import CurriculumTabs from './course/CurriculumTabs';

const courseKeyMoments = {
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
    }
  ]
};

const PurchasedCourseView: React.FC<PurchasedCourseProps> = ({
  courseId,
  courseTitle,
  courseDescription,
  courseImage,
  modules
}) => {
  const  router = useRouter();
  const [overallProgress, setOverallProgress] = useState(0);
  
  useEffect(() => {
    if (modules && modules.length) {
      const progresses = modules.map(module => module.progress || 0);
      const avgProgress = progresses.reduce((acc, curr) => acc + curr, 0) / progresses.length;
      setOverallProgress(avgProgress);
    }
  }, [modules]);

  const handleContinue = () => {
    const nextModule = modules.find(module => module.progress < 100);
    if (nextModule) {
       router.push(`/section?sectionId=${nextModule.id}`);
      toast.success("Continuing your learning journey", {
        description: `Loading ${nextModule.title}`
      });
    } else {
       router.push(`/section?sectionId=${modules[0].id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30">
      <CourseHeader 
        courseTitle={courseTitle}
        courseDescription={courseDescription}
        courseImage={courseImage}
        modulesCount={modules.length}
      />

      <div className="container mx-auto py-8 px-4 md:px-6 -mt-12 md:-mt-16 relative z-10">
        <CourseProgressOverview 
          modules={modules}
          overallProgress={overallProgress}
        />

        <Button size="lg" onClick={handleContinue} className="mb-8 w-full sm:w-auto">
          <PlayCircle className="mr-2 h-5 w-5" />
          Continue Learning
        </Button>

        <CurriculumTabs modules={modules} />
      </div>
    </div>
  );
};

export { courseKeyMoments };
export default PurchasedCourseView;
