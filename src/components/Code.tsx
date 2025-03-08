import { Editor } from "@monaco-editor/react";
import { useEffect, useState, useCallback } from "react";
import { loadPyodide, PyodideInterface } from "pyodide";
import { runPythonCode } from "../utils/runPython";
import { runJavascript } from "../utils/runJavascript";
import { CodeType } from "../types";

const Code = ({ code, setCode, output, setOutput, socket, room }: CodeType) => {
  const [language, setLanguage] = useState("javascript");
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);

  useEffect(() => {
    (async () => {
      const pyodideInstance = await loadPyodide();
      setPyodide(pyodideInstance);
      console.log("✅ Pyodide loaded successfully");
    })();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === "code") {
        setCode(data.code);
        setOutput(data.output);
        setLanguage(data.language);
      }
      else if(data.type === "joined") {
        setCode(data.code);
        setOutput(data.output);
        setLanguage(data.language);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, setCode, setOutput]);

  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "code", room, code, output, language }));
  }, [code, output, language, socket, room]);

  const runCode = useCallback(async () => {
    setOutput("Running...");
    if (language === "javascript") {
      runJavascript({ code, setOutput });
    } else if (language === "python" && pyodide) {
      runPythonCode({ pyodide, code, setOutput });
    }
  }, [code, language, pyodide]);

  return (
    <div className="h-screen w-full p-4 bg-gray-950 text-white">
      <div className="flex items-center gap-4 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

        <button
          onClick={runCode}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
          Run Code
        </button>
      </div>

      <Editor
        height="60vh"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />

      <div className="bg-gray-900 text-white p-4 mt-4 h-32 overflow-auto rounded-lg">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Code;
