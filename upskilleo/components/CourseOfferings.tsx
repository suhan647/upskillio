
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Server, Layers, ArrowRight, User, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface CourseOfferingsProps {
  onSelectTrack: (track: string) => void;
}

const CourseOfferings = ({ onSelectTrack }: CourseOfferingsProps) => {
  const navigate = useNavigate();
  
  const courses = [
    {
      id: 'frontend',
      title: 'Frontend Development',
      description: 'Master HTML, CSS, JavaScript, and modern frameworks like React to build engaging user interfaces.',
      icon: <Code size={24} />,
      color: 'from-blue-500 to-indigo-500',
      modules: 12,
      projects: 8,
      level: 'Beginner to Advanced',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=500&h=300',
      features: [
        'Interactive UI Components',
        'Responsive Design',
        'State Management',
        'API Integration'
      ]
    },
    {
      id: 'backend',
      title: 'Backend Development',
      description: 'Learn server-side programming with Node.js, Express, databases, and API development.',
      icon: <Server size={24} />,
      color: 'from-green-500 to-emerald-500',
      modules: 10,
      projects: 6,
      level: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=500&h=300',
      features: [
        'Database Integration',
        'RESTful APIs',
        'Authentication',
        'Server Deployment'
      ]
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Development',
      description: 'Comprehensive path covering both frontend and backend technologies for complete application development.',
      icon: <Layers size={24} />,
      color: 'from-purple-500 to-pink-500',
      modules: 18,
      projects: 12,
      level: 'Beginner to Expert',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=500&h=300',
      features: [
        'End-to-End App Development',
        'Modern JS Frameworks',
        'Database Design',
        'Full App Deployment'
      ]
    }
  ];

  const handleSelectCourse = (id: string) => {
    // Update selected track for the roadmap on the homepage
    onSelectTrack(id);
    
    // Navigate to the course detail page
    navigate(`/course-detail/${id}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 right-20 w-72 h-72 bg-upskilleo-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Choose Your <span className="text-gradient">Learning Path</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the development track that matches your goals and interests. Each path offers structured learning with hands-on projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 animate-scale-up"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <Badge className={`bg-gradient-to-r ${course.color} border-none text-white`}>
                    {course.id === 'frontend' ? 'Most Popular' : 
                      course.id === 'backend' ? 'High Demand' : 'Comprehensive'}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">{course.title}</h3>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Modules</p>
                      <p className="font-medium">{course.modules}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Projects</p>
                      <p className="font-medium">{course.projects}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <User size={16} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="font-medium">{course.level}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Topics:</p>
                  <ul className="space-y-1">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-primary mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full group" 
                  onClick={() => handleSelectCourse(course.id)}
                >
                  View Details
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseOfferings;
