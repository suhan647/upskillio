import React, { useState, useRef, useEffect } from 'react';
import { Info, ArrowRight, RotateCcw, Eye, EyeOff, GripVertical, Terminal, X, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AceEditor from "react-ace";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import Ace Editor themes and modes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

interface Challenge {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  hints: string[];
}

interface File {
  type: 'html' | 'css' | 'javascript';
  challenges: Challenge[];
}

interface MultiLanguageCourseEditorProps {
  files: File[];
  onChange: (fileType: string, code: string) => void;
  onSkip?: () => void;
  onSubmit?: () => void;
  onReset?: (fileType: string) => void;
  height?: string;
}

// Sample dummy data
const defaultFiles: File[] = [
  {
    type: 'html',
    challenges: [
      {
        id: 'html-1',
        title: 'Create a Basic HTML Structure',
        description: 'Create a simple HTML page with a heading and paragraph.',
        initialCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  \n</body>\n</html>',
        hints: ['Use <h1> for the main heading', 'Add a <p> tag for the paragraph'],
      },
    ],
  },
  {
    type: 'css',
    challenges: [
      {
        id: 'css-1',
        title: 'Style the Page',
        description: 'Add CSS styles to make the heading red and center the paragraph.',
        initialCode: 'h1 {\n  \n}\np {\n  \n}',
        hints: ['Use color: red for the heading', 'Use text-align: center for the paragraph'],
      },
    ],
  },
  {
    type: 'javascript',
    challenges: [
      {
        id: 'js-1',
        title: 'Add Interactivity',
        description: 'Create a function that logs a message to the console.',
        initialCode: 'function sayHello() {\n  \n}',
        hints: ['Use console.log() to output a message', 'Call the function to see the output'],
      },
    ],
  },
];

const MultiLanguageCourseEditor: React.FC<MultiLanguageCourseEditorProps> = ({
  files = defaultFiles,
  onChange,
  onSkip,
  onSubmit,
  onReset,
  height = "300px",
}) => {
  const [activeTab, setActiveTab] = useState<string>(files[0]?.type || 'html');
  const [showHints, setShowHints] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  const [previewWidth, setPreviewWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [codeStates, setCodeStates] = useState<Record<string, string>>(
    files.reduce((acc, file) => ({
      ...acc,
      [file.type]: file.challenges[0]?.initialCode || '',
    }), {})
  );
  const [savedCodeStates, setSavedCodeStates] = useState<Record<string, string>>(
    files.reduce((acc, file) => ({
      ...acc,
      [file.type]: file.challenges[0]?.initialCode || '',
    }), {})
  );
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const initialCodeRef = useRef<Record<string, string>>(
    files.reduce((acc, file) => ({
      ...acc,
      [file.type]: file.challenges[0]?.initialCode || '',
    }), {})
  );
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const getAceMode = (type: string) => {
    const modeMap: Record<string, string> = {
      javascript: 'javascript',
      html: 'html',
      css: 'css',
    };
    return modeMap[type.toLowerCase()] || 'javascript';
  };

  const handleCodeChange = (newCode: string) => {
    setCodeStates((prev) => ({ ...prev, [activeTab]: newCode }));
  };

  const handleSave = () => {
    setSavedCodeStates((prev) => ({ ...prev, [activeTab]: codeStates[activeTab] }));
    onChange(activeTab, codeStates[activeTab]);
  };

  const handleReset = () => {
    setCodeStates((prev) => ({ ...prev, [activeTab]: initialCodeRef.current[activeTab] }));
    setSavedCodeStates((prev) => ({ ...prev, [activeTab]: initialCodeRef.current[activeTab] }));
    setConsoleOutput([]);
    if (onReset) {
      onReset(activeTab);
    }
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

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

    // Use saved code states for compilation
    const htmlCode = savedCodeStates.html || '';
    const cssCode = savedCodeStates.css || '';
    const jsCode = savedCodeStates.javascript || '';

    return (
      <div className="h-full w-full bg-white overflow-auto flex flex-col">
        <div className="flex-grow">
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { margin: 0; padding: 1rem; font-family: sans-serif; }
                    ${cssCode}
                  </style>
                </head>
                <body>
                  ${htmlCode}
                  <script>
                    (function() {
                      const oldLog = console.log;
                      console.log = function(...args) {
                        oldLog.apply(console, args);
                        window.parent.postMessage({
                          type: 'console',
                          message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
                        }, '*');
                      };
                    })();
                    try {
                      ${jsCode}
                    } catch (error) {
                      window.parent.postMessage({
                        type: 'console',
                        message: 'Error: ' + error.message,
                        error: true
                      }, '*');
                    }
                  </script>
                </body>
              </html>
            `}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
            key={JSON.stringify(savedCodeStates)} // Force re-render on save
          />
        </div>
        {showConsole && (
          <div
            ref={consoleRef}
            className="bg-black text-white p-4 font-mono text-sm overflow-auto"
            style={{ minHeight: '100px', maxHeight: '200px' }}
          >
            {consoleOutput.map((output, index) => (
              <div key={index} style={{ color: output.startsWith('Error:') ? 'red' : 'white' }}>
                {output}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleOutput((prev) => [...prev, event.data.message]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const currentFile = files.find((file) => file.type === activeTab);
  const currentChallenge = currentFile?.challenges[0];

  return (
    <div className="rounded-md border overflow-hidden shadow-md">
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
      <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'html' | 'css' | 'javascript')} className="w-full">
          <TabsList>
            {files.map((file) => (
              <TabsTrigger key={file.type} value={file.type}>
                {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          {currentChallenge?.hints.length && currentChallenge.hints.length > 0 && (
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
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
            onClick={() => setShowConsole(!showConsole)}
          >
            <Terminal className="h-4 w-4 mr-1" />
            {showConsole ? 'Hide Console' : 'Show Console'}
          </Button>
          {showConsole && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground"
              onClick={clearConsole}
            >
              <X className="h-4 w-4 mr-1" />
              Clear Console
            </Button>
          )}
        </div>
      </div>

      {showHints && currentChallenge?.hints.length && currentChallenge.hints.length > 0 && (
        <div className="bg-amber-500/10 border-amber-500/30 border-b px-4 py-3 text-sm animate-in fade-in-50 slide-in-from-top-5">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-600 mb-1">Hints:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {currentChallenge.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex" style={{ height }}>
        <div style={{ width: showPreview ? `calc(100% - ${previewWidth}px)` : '100%' }}>
          <AceEditor
            mode={getAceMode(activeTab)}
            theme="monokai"
            onChange={handleCodeChange}
            value={codeStates[activeTab]}
            name={`editor-${activeTab}`}
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

        {showPreview && (
          <>
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

            <div className="border-l bg-white" style={{ width: `${previewWidth}px` }}>
              {renderPreview()}
            </div>
          </>
        )}
      </div>

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
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
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

export default MultiLanguageCourseEditor;