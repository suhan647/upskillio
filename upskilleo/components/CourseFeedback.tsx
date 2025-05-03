
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, LightbulbIcon, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CourseFeedbackProps {
  code: string;
  expectedSolution: string;
  onClose: () => void;
  onSkip?: () => void;
}

const CourseFeedback: React.FC<CourseFeedbackProps> = ({ 
  code, 
  expectedSolution, 
  onClose,
  onSkip 
}) => {
  // In a real app, this would use a more sophisticated comparison
  // or potentially call an API for AI-based feedback
  const isCorrect = code.includes(expectedSolution.trim());
  
  return (
    <div className="mt-4 space-y-4 animate-in fade-in-50">
      {isCorrect ? (
        <Alert className="bg-green-500/10 border-green-500/30">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-500">Correct Solution!</AlertTitle>
          <AlertDescription>
            Great job! Your solution meets all the requirements for this challenge.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-amber-500/10 border-amber-500/30">
          <LightbulbIcon className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-500">Almost there...</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Your solution is close but doesn't quite match the expected output. Here are some hints:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Check for syntax errors like missing semicolons or brackets</li>
              <li>Make sure variable names match the requirements</li>
              <li>Try to write more efficient code where possible</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between">
        {!isCorrect && onSkip && (
          <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
            <ArrowRight className="h-4 w-4 mr-1" /> Continue Anyway
          </Button>
        )}
        <div className={!isCorrect && onSkip ? "" : "w-full flex justify-end"}>
          <Button onClick={onClose}>
            {isCorrect ? 'Continue' : 'Try Again'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseFeedback;
