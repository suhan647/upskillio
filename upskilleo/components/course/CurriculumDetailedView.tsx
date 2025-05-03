
import React from 'react';
import { CourseModule } from '@/types/course';
import ModuleCard from './ModuleCard';

interface CurriculumDetailedViewProps {
  modules: CourseModule[];
  expandedModules: string[];
  toggleModuleExpansion: (moduleId: string) => void;
}

const CurriculumDetailedView: React.FC<CurriculumDetailedViewProps> = ({ 
  modules, 
  expandedModules, 
  toggleModuleExpansion 
}) => {
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {modules.map((module, index) => (
        <ModuleCard 
          key={module.id}
          module={module}
          index={index}
          isExpanded={expandedModules.includes(module.id)}
          toggleModuleExpansion={toggleModuleExpansion}
        />
      ))}
    </div>
  );
};

export default CurriculumDetailedView;
