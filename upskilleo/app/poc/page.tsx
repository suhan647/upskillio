/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/theme-monokai";

const ReactPreviewEditor = () => {
  const [code, setCode] = useState(`
const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ fontFamily: 'Arial', padding: 20 }}>
      <h1>Hello from React!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
  `);

  const [iframeContent, setIframeContent] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<any>([]);

  const updatePreview = () => {
    const html = `
<html>
  <head>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body { margin: 0; padding: 0; font-family: sans-serif; }
      #root { padding: 20px; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const log = console.log;
      const error = console.error;

      console.log = function(...args) {
        window.parent.postMessage({ type: 'log', message: args.join(" ") }, '*');
        log.apply(console, args);
      };

      console.error = function(...args) {
        window.parent.postMessage({ type: 'error', message: args.join(" ") }, '*');
        error.apply(console, args);
      };

      window.onerror = function (msg, src, line, col, err) {
        window.parent.postMessage(
          { type: 'error', message: msg + ' at line ' + line + ':' + col },
          '*'
        );
      };

      try {
        const result = Babel.transform(\`${code}\`, { presets: ['react'] });
        eval(result.code);
      } catch (e) {
        window.parent.postMessage(
          { type: 'error', message: 'Compile/Runtime Error: ' + e.message },
          '*'
        );
      }
    <\/script>
  </body>
</html>
    `;
    setIframeContent(html);
    setConsoleLogs([]);
  };

  useEffect(() => {
    const handleMessage = (event:any) => {
      if (event.data.type === "log" || event.data.type === "error") {
        setConsoleLogs((prev:any) => [...prev, event.data]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2>React Code (JSX)</h2>
      <AceEditor
        mode="jsx"
        theme="monokai"
        value={code}
        onChange={setCode}
        name="reactEditor"
        width="100%"
        height="300px"
        fontSize={14}
      />

      <button
        onClick={updatePreview}
        style={{
          padding: "10px 20px",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Preview React
      </button>

      <h2>Live React Preview</h2>
      <iframe
        title="React Preview"
        sandbox="allow-scripts"
        srcDoc={iframeContent}
        style={{
          width: "100%",
          height: "350px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      ></iframe>

      <h2>Console Output</h2>
      <div
        style={{
          background: "#111",
          color: "#0f0",
          padding: "10px",
          borderRadius: "6px",
          height: "150px",
          overflowY: "auto",
          fontFamily: "monospace",
        }}
      >
        {consoleLogs.length === 0 ? (
          <div style={{ color: "#888" }}>No output yet.</div>
        ) : (
          consoleLogs.map((log:any, idx:any) => (
            <div
              key={idx}
              style={{ color: log.type === "error" ? "#f55" : "#0f0" }}
            >
              {log.type === "error" ? "✖" : "➜"} {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReactPreviewEditor;
