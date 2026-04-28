import type { CodeFiles } from "./types";

const escapeClosingScriptTag = (value: string) =>
  value.replace(/<\/script/gi, "<\\/script");

export function createPreviewDocument(files: CodeFiles, channelId: string) {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      ${files.css}
    </style>
  </head>
  <body>
    ${files.html}
    <script>
      (() => {
        const channelId = ${JSON.stringify(channelId)};
        const send = (type, payload) => window.parent?.postMessage({ source: "daw-preview", channelId, type, payload }, "*");
        const originalLog = console.log;
        const originalError = console.error;
        console.log = (...args) => {
          originalLog(...args);
          send("console", args.map(String).join(" "));
        };
        console.error = (...args) => {
          originalError(...args);
          send("console", "ERROR: " + args.map(String).join(" "));
        };
        window.addEventListener("error", (event) => send("console", "ERROR: " + event.message));
      })();
    </script>
    <script>${escapeClosingScriptTag(files.javascript)}</script>
  </body>
</html>`;
}
