import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, BookOpen, Activity } from 'lucide-react';

const Hero = () => {
  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradient blur */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-upskilleo-purple/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-upskilleo-deep-purple/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-gradient">Master</span> Full-Stack Development
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Interactive, hands-on learning paths designed to transform beginners into confident full-stack developers through guided roadmaps and personalized AI feedback.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/try-demo">Try Demo</Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground pt-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center"
                  >
                    <span className="text-xs font-medium">U{i+1}</span>
                  </div>
                ))}
              </div>
              <span>Join 2,000+ learners already upskilling</span>
            </div>
          </div>
          
          <div className="lg:w-1/2 animate-scale-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-upskilleo-purple/20 to-upskilleo-deep-purple/20 rounded-xl transform rotate-1"></div>
              <div className="relative bg-card dark:bg-card shadow-xl rounded-xl border border-border p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">Interactive Learning</div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Code size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Interactive Code Editor</h3>
                      <p className="text-sm text-muted-foreground">Write and test code directly in your browser</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <BookOpen size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Guided Learning Paths</h3>
                      <p className="text-sm text-muted-foreground">Follow structured roadmaps tailored to your goals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
                      <Activity size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Real-time AI Feedback</h3>
                      <p className="text-sm text-muted-foreground">Get instant feedback on your code progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
