import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Pause, MessageSquare, Code2, Terminal } from 'lucide-react';

const HowItWorks = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          setProgress(Math.min((newTime / 60) * 100, 100));
          
          if (newTime === 15) {
            setIsPlaying(false);
            setShowFeedback(true);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const sampleCode = `function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// Write a test for this function
`;

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How <span className="text-gradient">Upskilleo</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our interactive learning approach with video lessons, hands-on coding, and AI-powered feedback.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <Card className="overflow-hidden border-2 shadow-lg">
              <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 flex items-center justify-center bg-upskilleo-dark-purple">
                  <img 
                    src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80" 
                    alt="Video thumbnail" 
                    className="w-full h-full object-cover opacity-70"
                  />
                  
                  {!isPlaying && !showFeedback && (
                    <Button 
                      onClick={togglePlayback}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary rounded-full w-16 h-16 flex items-center justify-center"
                    >
                      <Play size={30} fill="white" className="ml-1" />
                    </Button>
                  )}
                  
                  {showFeedback && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8 animate-fade-in">
                      <Card className="w-full max-w-lg p-6 border-primary/20">
                        <h3 className="text-xl font-bold mb-3">Key Learning Moment</h3>
                        <p className="mb-4">Let's pause to understand this concept better. Try implementing this in the code editor:</p>
                        <div className="bg-card p-3 rounded-md text-sm font-mono mb-4">
                          Write a test function that validates our <code>calculateTotal</code> function with different inputs
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowFeedback(false);
                              setIsPlaying(true);
                            }}
                          >
                            Continue Video
                          </Button>
                          <Button>
                            Try in Editor
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white hover:bg-white/20 h-8 w-8"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </Button>
                    
                    <div className="text-xs">
                      {formatTime(currentTime)} / 1:00
                    </div>
                    
                    <div className="relative flex-grow h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="bg-muted/50 dark:bg-muted/10 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MessageSquare className="mr-2 text-primary" size={22} />
                Interactive Video Lessons
              </h3>
              <p className="text-muted-foreground mb-4">
                Our video lessons automatically pause at key learning moments to ensure you understand important concepts before moving forward.
              </p>
              <ul className="space-y-2">
                {['Bite-sized lessons with focused topics', 'Visual explanations of complex concepts', 'Automatic pausing at key learning moments'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="code-editor-container">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs opacity-50">script.js</div>
              </div>
              
              <div className="font-mono text-sm">
                {sampleCode.split('\n').map((line, i) => (
                  <div key={i} className="code-line">
                    <span className="line-number">{i + 1}</span>
                    <span className="flex-grow">
                      {line.includes('function') ? (
                        <span className="text-blue-400">{line}</span>
                      ) : line.includes('return') ? (
                        <span className="text-yellow-300">{line}</span>
                      ) : line.includes('//') ? (
                        <span className="text-green-400">{line}</span>
                      ) : (
                        line
                      )}
                    </span>
                  </div>
                ))}
                <div className="h-6 border-l-2 border-primary ml-8 animate-pulse"></div>
              </div>
              
              <div className="mt-6 p-3 rounded bg-gray-800 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal size={14} />
                  <span className="text-xs text-gray-400">AI Feedback</span>
                </div>
                <p className="text-sm text-gray-300">
                  <span className="text-yellow-400">Hint:</span> Remember to test with both empty arrays and multiple items to ensure your function is robust.
                </p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-muted/50 dark:bg-muted/10 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <Code2 className="mr-2 text-primary" size={20} />
                  Real-time Code Editing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Edit and test your code directly in the browser with our Monaco-based editor that supports syntax highlighting and auto-completion.
                </p>
              </div>
              
              <div className="bg-muted/50 dark:bg-muted/10 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <MessageSquare className="mr-2 text-primary" size={20} />
                  AI-powered Feedback
                </h3>
                <p className="text-sm text-muted-foreground">
                  Receive instant, personalized feedback on your code and suggestions for improvement from our AI assistant.
                </p>
              </div>
            </div>
            
            <Button className="w-full" asChild>
              <Link to="/try-demo">Try The Interactive Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
