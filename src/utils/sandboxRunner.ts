/**
 * Sandbox Runner for live in-browser preview of generated web apps.
 * Bundles virtual files into an executable HTML/React iframe document
 * with real-time console interception, error handling, and Tailwind CSS.
 */

export interface ConsoleLogMessage {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export function generateSandboxHtml(files: Record<string, string>): string {
  // Find index.html or create a standard one
  let indexHtml = files['index.html'] || files['public/index.html'] || '';
  const appTsx = files['src/App.tsx'] || files['src/App.jsx'] || files['src/main.tsx'] || files['src/index.tsx'] || '';

  // Extract custom css from src/index.css or style tags
  const customCss = files['src/index.css'] || files['src/App.css'] || '';

  // Look for any extra components in src/
  const extraComponents: Record<string, string> = {};
  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith('src/') && path !== 'src/App.tsx' && (path.endsWith('.tsx') || path.endsWith('.jsx') || path.endsWith('.ts') || path.endsWith('.js'))) {
      extraComponents[path] = content;
    }
  }

  // Escape backticks in code
  const sanitizedApp = appTsx
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '') // strip imports for browser runtime
    .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, 'function $1')
    .replace(/export\s+default\s+/g, 'const DefaultExport = ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview Sandbox</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- React & ReactDOM -->
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <!-- Babel for JSX -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    ${customCss}
  </style>
  <script>
    // Console log interceptor to communicate with parent IDE
    (function() {
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;

      function sendToParent(type, args) {
        try {
          const msg = Array.from(args).map(a => {
            if (typeof a === 'object') {
              try { return JSON.stringify(a); } catch(e) { return String(a); }
            }
            return String(a);
          }).join(' ');

          window.parent.postMessage({
            source: 'athokpam-sandbox',
            type: type,
            message: msg,
            time: new Date().toLocaleTimeString()
          }, '*');
        } catch(e) {}
      }

      console.log = function(...args) {
        origLog.apply(console, args);
        sendToParent('log', args);
      };
      console.warn = function(...args) {
        origWarn.apply(console, args);
        sendToParent('warn', args);
      };
      console.error = function(...args) {
        origError.apply(console, args);
        sendToParent('error', args);
      };

      window.onerror = function(message, source, lineno, colno, error) {
        sendToParent('error', [message + ' (' + lineno + ':' + colno + ')']);
        const root = document.getElementById('root');
        if (root) {
          root.innerHTML = '<div style="padding:24px;background:#1e1e2e;color:#f38ba8;font-family:monospace;border-radius:8px;margin:16px;">' +
            '<h3 style="margin-top:0;font-size:16px;color:#f38ba8;">Runtime Error</h3>' +
            '<p style="color:#cdd6f4;">' + message + '</p>' +
            '<pre style="font-size:12px;color:#a6adc8;overflow:auto;">' + (error && error.stack ? error.stack : 'Line: ' + lineno) + '</pre>' +
            '</div>';
        }
      };
    })();
  </script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
  <div id="root">
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
    </div>
  </div>

  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback } = React;

    try {
      // User code
      ${sanitizedApp}

      const AppToRender = typeof App !== 'undefined' ? App : (typeof DefaultExport !== 'undefined' ? DefaultExport : null);

      if (AppToRender) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<AppToRender />);
      } else {
        document.getElementById('root').innerHTML = '<div class="p-8 text-center text-slate-400">No App component found to render.</div>';
      }
    } catch(err) {
      console.error(err);
      document.getElementById('root').innerHTML = '<div style="padding:24px;background:#1e1e2e;color:#f38ba8;font-family:monospace;border-radius:8px;margin:16px;">' +
        '<h3 style="margin-top:0;font-size:16px;color:#f38ba8;">Transpilation / Execution Error</h3>' +
        '<p style="color:#cdd6f4;">' + err.message + '</p>' +
        '</div>';
    }
  </script>
</body>
</html>`;
}
