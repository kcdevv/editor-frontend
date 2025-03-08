import { PyodideInterface } from "pyodide";
import { SetStateAction } from "react";

type RunPythonType = {
  pyodide: PyodideInterface;
  code: string;
  setOutput: (value: SetStateAction<string>) => void;
};

type RunJavascriptType = Pick<runPython, "code" | "setOutput">;

type CodeType = {
  code: string;
  setCode: (value: SetStateAction<string>) => void;
  output: string;
  setOutput: (value: SetStateAction<string>) => void;
  socket: WebSocket | null;
  room: string;
};
