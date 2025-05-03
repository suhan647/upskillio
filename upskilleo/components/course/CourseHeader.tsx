/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';


interface CourseHeaderProps {
  courseTitle: string;
  courseDescription: string;
  courseImage: string;
  modulesCount: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  courseTitle,
  courseDescription,
  courseImage,
  modulesCount
}) => {
  const searchParams = useSearchParams();

  return (
    <div className="relative h-64 md:h-80 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 mix-blend-multiply"></div>
      <div className="absolute inset-0">
        <img 
          src={courseImage || "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=1200"}
          alt={courseTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md ">
              {courseTitle}
            </h1>
            <p className="text-white/90 md:text-lg mb-6 max-w-2xl drop-shadow-md">
              {courseDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                {modulesCount} Modules
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-500 border-green-500/30 backdrop-blur-sm">
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Enrolled
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
