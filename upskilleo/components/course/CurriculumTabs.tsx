/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, MessageSquare, Map, Layers, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { CourseModule } from '@/types/course';
import CurriculumQuickView from './CurriculumQuickView';
import CurriculumDetailedView from './CurriculumDetailedView';

interface CurriculumTabsProps {
  modules: CourseModule[];
}

const CurriculumTabs: React.FC<CurriculumTabsProps> = ({ modules }) => {
  const searchParams = useSearchParams();
  const router = useRouter()
  
  // Get view preference from URL parameters
  const getCurriculumViewFromURL = () => {
    const view = searchParams.get('view');
    return (view === 'detailed' || view === 'quick') ? view : 'quick';
  };
  
  const [curriculumView, setCurriculumView] = useState<'quick' | 'detailed'>(getCurriculumViewFromURL);
  
  // Get expanded modules from URL parameters
  const getExpandedModulesFromURL = () => {
    const expanded = searchParams.get('expanded');
    return expanded ? expanded.split(',') : [];
  };
  
  const [expandedModules, setExpandedModules] = useState<string[]>(getExpandedModulesFromURL());

  // Sync curriculum view with URL parameters
  useEffect(() => {
    const view = getCurriculumViewFromURL();
    setCurriculumView(view as 'quick' | 'detailed');
  }, [searchParams]);

  // Update URL when curriculum view changes
  const handleViewChange = (view: 'quick' | 'detailed') => {
    setCurriculumView(view);
  
    // const params = new URLSearchParams(searchParams.toString());
    // params.set('view', view);
    
    // router.push(`?${params.toString()}`);
  };

  // Sync URL parameters on expandedModules change
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  
  //   if (expandedModules.length === 0) {
  //     params.delete('expanded');
  //   } else {
  //     params.set('expanded', expandedModules.join(','));
  //   }
  
  //   router.push(`?${params.toString()}`);
  // }, [expandedModules, router, searchParams]);
  // Also sync expandedModules when URL changes (browser back/forward)
  useEffect(() => {
    setExpandedModules(getExpandedModulesFromURL());
  }, [searchParams]);

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };
  
  const expandAllModules = () => {
    setExpandedModules(modules.map(module => module.id));
  };
  
  const collapseAllModules = () => {
    setExpandedModules([]);
  };

  return (
    <Tabs persistParam="courseTab" defaultValue="curriculum" className="space-y-4">
      <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 h-auto">
        <TabsTrigger value="curriculum" className="px-4 py-2">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Curriculum</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="px-4 py-2">
          <FileText className="h-4 w-4 mr-2" />
          <span>Resources</span>
        </TabsTrigger>
        <TabsTrigger value="discussions" className="px-4 py-2">
          <MessageSquare className="h-4 w-4 mr-2" />
          <span>Discussions</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="curriculum" className="animate-in fade-in-50">
        {/* View Toggle Buttons */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold">Course Curriculum</h2>
          <div className="flex gap-2">
            <div className="bg-muted rounded-lg p-1">
              <Button 
                variant={curriculumView === 'quick' ? "default" : "ghost"} 
                size="sm"
                onClick={() => handleViewChange('quick')}
                className="gap-1.5"
              >
                <Map className="w-4 h-4" />
                Quick View
              </Button>
              <Button 
                variant={curriculumView === 'detailed' ? "default" : "ghost"} 
                size="sm"
                onClick={() => handleViewChange('detailed')}
                className="gap-1.5"
              >
                <Layers className="w-4 h-4" />
                Detailed View
              </Button>
            </div>
            
            {curriculumView === 'detailed' && (
              <div className="bg-muted rounded-lg p-1">
                {expandedModules.length < modules.length ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={expandAllModules}
                    className="gap-1.5"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Expand All
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={collapseAllModules}
                    className="gap-1.5"
                  >
                    <ChevronUp className="w-4 h-4" />
                    Collapse All
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Conditional rendering based on selected view */}
        {curriculumView === 'quick' 
          ? <CurriculumQuickView modules={modules} /> 
          : <CurriculumDetailedView 
              modules={modules} 
              expandedModules={expandedModules} 
              toggleModuleExpansion={toggleModuleExpansion} 
            />
        }
      </TabsContent>

      <TabsContent value="resources" className="animate-in fade-in-50">
        <Card>
          <CardHeader>
            <CardTitle>Course Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-3">
                {[
                  "Course Slides.pdf",
                  "Example Code Repository",
                  "Cheat Sheet.pdf",
                  "Additional Reading Material"
                ].map((resource, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{resource}</span>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="discussions" className="animate-in fade-in-50">
        <Card>
          <CardHeader>
            <CardTitle>Course Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">Join the conversation</h3>
              <p className="text-muted-foreground mb-4">
                Discuss course material with fellow learners and instructors
              </p>
              <Button>Start a Discussion</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CurriculumTabs;
