import React, { useState, useRef, useEffect } from 'react';
import { Info, ArrowRight, AlertCircle, RotateCcw, Eye, EyeOff, GripVertical } from 'lucide-react';
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
  height?: string;
  previewType?: 'html' | 'css' | 'javascript' | 'typescript' | string;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ 
  code, 
  onChange, 
  language, 
  hints = [], 
  onSkip,
  onSubmit,
  onReset,
  initialCode = "",
  height = "300px",
  previewType
}) => {
  const [showHints, setShowHints] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewWidth, setPreviewWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const initialCodeRef = useRef(initialCode || code);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  
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
    onChange(initialCodeRef.current);
    if (onReset) {
      onReset();
    }
  };

  // Drag logic: listeners only attached while dragging
  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startXRef.current;
    const newWidth = startWidthRef.current - deltaX;
    if (newWidth > 300 && newWidth < window.innerWidth - 300) {
      setPreviewWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = previewWidth;
    document.body.style.cursor = 'col-resize';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const renderPreview = () => {
    if (!showPreview) return null;

    const type = previewType || language.toLowerCase();

    switch (type) {
      case 'html':
        return (
          <div className="h-full w-full bg-white overflow-auto">
            <div className="bg-white h-full">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 0; }
                        * { box-sizing: border-box; }
                      </style>
                    </head>
                    <body>
                      ${code}
                    </body>
                  </html>
                `}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        );
      case 'css':
        return (
          <div className="h-full w-full bg-white overflow-auto">
            <div className="text-sm text-muted-foreground mb-2 px-4">CSS Preview:</div>
            <div className="bg-white h-full">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { margin: 0; padding: 0; }
                        * { box-sizing: border-box; }
                        ${code}
                      </style>
                    </head>
                    <body>
                      <div class="preview-content">
                        <div>
                          <h3>Sample Heading</h3>
                          <p>This is a sample paragraph to preview your CSS styles.</p>
                        </div>
                        <div>
                          <button>Sample Button</button>
                        </div>
                      </div>
                    </body>
                  </html>
                `}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        );
      case 'javascript':
      case 'typescript':
        return (
          <div className="h-full w-full bg-black overflow-auto">
            <div className="bg-black h-full">
              <div className="text-sm font-mono">
                <div className="px-4">
                  <pre className="text-green-400 font-mono">
                    {(() => {
                      try {
                        // Create a new function from the code
                        const func = new Function(code);
                        // Execute the function and capture console.log output
                        let output = '';
                        const originalConsoleLog = console.log;
                        console.log = (...args) => {
                          output += args.join(' ') + '\n';
                        };
                        func();
                        console.log = originalConsoleLog;
                        return output || 'No output';
                      } catch (error) {
                        return `Error: ${error.message}`;
                      }
                    })()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full w-full bg-white p-4 overflow-auto">
            <div className="text-sm text-muted-foreground">
              Preview not available for this language
            </div>
          </div>
        );
    }
  };

  return (
    <div className="rounded-md border overflow-hidden shadow-md">
      {/* Overlay for drag events */}
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            cursor: 'col-resize',
            background: 'transparent',
          }}
        />
      )}
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
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
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
      
      {/* Editor and Preview Container */}
      <div className="flex" style={{ height }}>
        {/* Editor */}
        <div style={{ width: showPreview ? `calc(100% - ${previewWidth}px)` : '100%' }}>
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
            height="100%"
            showPrintMargin={false}
            className="font-mono"
          />
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <>
            {/* Drag Handle */}
            <div
              ref={dragHandleRef}
              className="w-1 bg-border cursor-col-resize hover:bg-primary/50 transition-colors"
              style={{ userSelect: 'none' }}
              onMouseDown={handleMouseDown}
            >
              <div className="h-full flex items-center justify-center">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Preview Content */}
            <div 
              className="border-l bg-white"
              style={{ width: `${previewWidth}px` }}
            >
              {renderPreview()}
            </div>
          </>
        )}
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
