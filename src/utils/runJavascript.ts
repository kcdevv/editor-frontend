import { RunJavascriptType } from "../types";

export const runJavascript = ({code, setOutput}: RunJavascriptType)=>{
    try {
            let logs: string[] = [];
            const originalConsoleLog = console.log;
    
            console.log = (...args) => logs.push(args.join(" "));
            const result = new Function(code)();
            console.log = originalConsoleLog;
    
            setOutput(logs.length ? logs.join("\n") : result?.toString() || "✅ Code executed successfully!");
          } catch (error: any) {
            setOutput(`❌ Error: ${error.message}`);
          }
}