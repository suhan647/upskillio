import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User, Star } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
}

const courses: Course[] = [
  {
    id: 'frontend',
    title: 'Frontend Development Masterclass',
    description: 'Master HTML, CSS, JavaScript, and React to build engaging user interfaces',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&q=80&w=1200',
    price: 79.99,
    instructor: 'Sarah Johnson',
    rating: 4.8,
    students: 5430,
    duration: '40 hours',
    level: 'Beginner to Advanced'
  },
  {
    id: 'backend',
    title: 'Backend Development Course',
    description: 'Learn Node.js, Express, and MongoDB to build robust server-side applications',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    price: 89.99,
    instructor: 'Michael Chen',
    rating: 4.7,
    students: 4320,
    duration: '45 hours',
    level: 'Intermediate'
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development Course',
    description: 'Become a full-stack developer by mastering both frontend and backend technologies',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200',
    price: 129.99,
    instructor: 'David Wilson',
    rating: 4.9,
    students: 6780,
    duration: '80 hours',
    level: 'Advanced'
  }
];

const CourseListing: React.FC = () => {
  const router = useRouter();

  const handleCourseClick = (courseId: string) => {
    router.push(`/?courseId=${courseId}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute -top-40 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Explore Our <span className="text-gradient">Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive range of courses designed to help you master modern web development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm">
                  {course.level}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    {course.duration}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                    <User className="w-3.5 h-3.5 mr-1.5" />
                    {course.students.toLocaleString()} students
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                    <Star className="w-3.5 h-3.5 mr-1.5" />
                    {course.rating}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Instructor: {course.instructor}
                  </div>
                  <div className="text-lg font-bold">
                    ${course.price}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  View Course
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseListing; 