
import React, { useState } from 'react';
import { Info, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AceEditor from "react-ace";

// Import Ace Editor themes and modes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

interface CourseEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  hints?: string[];
  onSkip?: () => void;
  onSubmit?: () => void;
  onReset?: () => void;
  initialCode?: string;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ 
  code, 
  onChange, 
  language, 
  hints = [], 
  onSkip,
  onSubmit,
  onReset,
  initialCode = ""
}) => {
  const [showHints, setShowHints] = useState(false);
  
  // Map language prop to Ace Editor mode
  const getAceMode = (lang: string) => {
    const modeMap: Record<string, string> = {
      javascript: "javascript",
      js: "javascript",
      typescript: "typescript",
      ts: "typescript",
      html: "html",
      css: "css",
      python: "python",
    };
    return modeMap[lang.toLowerCase()] || "javascript";
  };

  const handleReset = () => {
    if (initialCode) {
      onChange(initialCode);
    }
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="rounded-md border overflow-hidden shadow-md">
      {/* Header with language indicator */}
      <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
        <div className="text-sm font-medium">{language.charAt(0).toUpperCase() + language.slice(1)}</div>
        <div className="flex items-center gap-2">
          {hints.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-muted-foreground"
              onClick={() => setShowHints(!showHints)}
            >
              <Info className="h-4 w-4 mr-1" />
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
          )}
          <div className="text-xs text-muted-foreground">Editor</div>
        </div>
      </div>
      
      {/* Hints section */}
      {showHints && hints.length > 0 && (
        <div className="bg-amber-500/10 border-amber-500/30 border-b px-4 py-3 text-sm animate-in fade-in-50 slide-in-from-top-5">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-600 mb-1">Hints:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Ace Code Editor */}
      <div className="w-full">
        <AceEditor
          mode={getAceMode(language)}
          theme="monokai"
          onChange={onChange}
          value={code}
          name="course-code-editor"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          fontSize={14}
          width="100%"
          height="300px"
          showPrintMargin={false}
          className="font-mono"
        />
      </div>
      
      {/* Action buttons */}
      <div className="bg-muted/30 px-4 py-3 border-t flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleReset}
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Code
        </Button>
        
        <div className="flex items-center gap-2">
          {onSkip && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSkip}
              className="text-muted-foreground"
            >
              Continue Anyway
            </Button>
          )}
          
          {onSubmit && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onSubmit}
              className="flex items-center gap-1"
            >
              Submit
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
