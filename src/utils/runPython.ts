import type { RunPythonType } from "../types";

export const runPythonCode = async ({ pyodide, code, setOutput }: RunPythonType) => {
  if (!pyodide) {
    setOutput("⚠️ Pyodide is still loading...");
    return;
  }

  try {
    await pyodide.runPythonAsync(`
          import sys
          from io import StringIO
          sys.stdout = sys.stderr = StringIO()
        `);

    await pyodide.runPythonAsync(code);

    const result = await pyodide.runPythonAsync("sys.stdout.getvalue()");
    setOutput(result.trim() || "✅ Code executed successfully!");
  } catch (error: any) {
    setOutput(`❌ Error: ${error.message}`);
  }
};
