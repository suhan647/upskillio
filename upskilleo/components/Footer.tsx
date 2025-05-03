
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/30 dark:bg-muted/10 border-t border-border">
      <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-gradient mb-4">Upskilleo</h2>
            <p className="text-muted-foreground mb-4">
              Empowering developers through interactive learning and AI-guided feedback.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Github size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin size={20} />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                {['Roadmaps', 'Courses', 'Projects', 'Challenges', 'Community'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                {['Documentation', 'Tutorials', 'Blog', 'FAQ', 'Support'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3">Subscribe to our newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with the latest features, courses, and offers.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="bg-background" />
              <Button type="submit" size="sm">
                <Mail size={16} className="mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Upskilleo. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
