// import React, { useRef, useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { tokenizeLine } from "../../features/Tokenizer";
// import {
//   playTokenSound,
//   startAudio,
//   startBackgroundMusic,
//   stopBackgroundMusic,
// } from "../../features/musicEngine";
// import * as Tone from "tone";
// import Swal from "sweetalert2";
// import FileUpload from "./FileUpload";

// const CodeEditor = ({ code, setCode, executionSpeed = 600 }) => {
//   const editorRef = useRef(null);
//   const monacoRef = useRef(null);
//   const [language, setLanguage] = useState("c");
//   const [languageId, setLanguageId] = useState(50);

//   const [isRunning, setIsRunning] = useState(false);
//   const [lastResult, setLastResult] = useState(null);
//   const [bgmOn, setBgmOn] = useState(true);

//   const [codeChanged, setCodeChanged] = useState(true); // ✅ Track if code changed

//   const codeRef = useRef(code);
//   const currentLineRef = useRef(1);
//   const cancelledRef = useRef(false);
//   const metronomePartRef = useRef(null);
//   const activeDecorationsRef = useRef([]);

//   const apiConfigs = [
//     {
//         url: "https://ce.judge0.com", 
//         key: null,
//     },
//     {
//       url: "https://judge0-ce.p.rapidapi.com",
//       key: "3a67aa1365msh2f618ae65f181a9p1862afjsn4ae15b69a455",
//     },
//     {
//       url: "https://judge0-ce.p.rapidapi.com",
//       key: "e74b089bd8msh812f56fd0beb95ep1c1e77jsnfcd1552cb6b3",
//     },
//     {
//       url: "https://judge0-ce.p.rapidapi.com",
//       key: "66d6ebbbb4mshefa893a16fa5d3dp13fd89jsnd2b0cd0185a0",
//     },
//   ];

//   useEffect(() => {
//     codeRef.current = code;
//     setCodeChanged(true); // ✅ mark as changed when user edits
//   }, [code]);

//   useEffect(() => {
//     const init = async () => {
//       await startAudio();
//       startBackgroundMusic();
//     };
//     init();

//     return () => {
//       stopBackgroundMusic();
//     };
//   }, []);

//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
//   };

//   // --- Start Execution ---
//   const handleStartClick = async () => {
//     try {
//       await startAudio();
//       cancelledRef.current = false;
//       setIsRunning(true);

//       // ✅ If code unchanged → skip Judge0 call
//       if (!codeChanged && lastResult) {
//         runExecution();
//         return;
//       }

//       Swal.fire({
//         title: "⏳ Please wait...",
//         text: "Your code is running on server...",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       const result = await runCodeOnJudge0();

//       if (result.error) {
//         setIsRunning(false);
//         Swal.fire("Execution Failed", `<pre>${result.error}</pre>`, "error");
//         highlightError(result.error);
//         stopAll();
//         return;
//       }

//       Swal.close();
//       setLastResult(result);
//       setCodeChanged(false); // ✅ reset flag after successful run

//       if (result.stdout) {
//         Swal.fire("Execution Result", `<pre>${result.stdout}</pre>`, "success");
//       }

//       runExecution();
//     } catch {
//       setIsRunning(false);
//       stopAll();
//       Swal.fire("Execution Failed", "Something went wrong. Please try again.", "error");
//     }
//   };

//   const handleStopClick = () => {
//     stopAll();
//     setIsRunning(false);
//   };

//   const handleClearClick = () => {
//     stopAll();
//     setIsRunning(false);
//     currentLineRef.current = 1;
//     setCode("");
//     setCodeChanged(true);

//     if (editorRef.current && monacoRef.current) {
//       editorRef.current.deltaDecorations(activeDecorationsRef.current, []);
//       monacoRef.current.editor.setModelMarkers(
//         editorRef.current.getModel(),
//         "owner",
//         []
//       );
//     }
//   };

//   const handlePasteClick = async () => {
//     try {
//       const text = await navigator.clipboard.readText();
//       if (editorRef.current) {
//         const editor = editorRef.current;
//         const selection = editor.getSelection();
//         const model = editor.getModel();
//         const range = selection || model.getFullModelRange();

//         editor.executeEdits("paste", [
//           { range, text, forceMoveMarkers: true },
//         ]);
//         editor.focus();
//       } else {
//         setCode((prev) => prev + "\n" + text);
//       }
//     } catch {
//       Swal.fire("Clipboard Error", "Could not paste from clipboard.", "error");
//     }
//   };

//   const stopAll = () => {
//     cancelledRef.current = true;
//     if (metronomePartRef.current) metronomePartRef.current.stop();
//     Tone.Transport.stop();
//   };

//   const runExecution = () => {
//     const editor = editorRef.current;
//     const monaco = monacoRef.current;
//     if (!editor || !monaco) return;

//     const lines = (codeRef.current ?? "").split("\n");

//     const bpm = 60000 / executionSpeed;
//     Tone.Transport.bpm.value = bpm * 4;

//     const metronomePart = new Tone.Loop(() => {}, "1n");
//     Tone.Transport.start();
//     metronomePart.start(0);
//     metronomePartRef.current = metronomePart;

//     const runStep = async () => {
//       if (cancelledRef.current) return;
//       const currentLine = currentLineRef.current;

//       activeDecorationsRef.current = editor.deltaDecorations(
//         activeDecorationsRef.current,
//         [
//           {
//             range: new monaco.Range(currentLine, 1, currentLine, 1),
//             options: { isWholeLine: true, className: "lineHighlight-execution" },
//           },
//         ]
//       );

//       let tokens = tokenizeLine(lines[currentLine - 1] || "");
//       const barDuration = executionSpeed / 1000;
//       const step = barDuration / Math.max(1, tokens.length);
//       tokens.forEach((t, i) => playTokenSound(t, i * step));

//       currentLineRef.current++;
//       if (currentLineRef.current > lines.length) {
//         setTimeout(() => {
//           editor.deltaDecorations(activeDecorationsRef.current, []);
//           metronomePart.stop();
//           Tone.Transport.stop();
//           setIsRunning(false);
//         }, 500);
//         return;
//       }
//       setTimeout(runStep, executionSpeed);
//     };

//     runStep();
//   };

//   const runCodeOnJudge0 = async () => {
//     const tryRun = async (config) => {
//       const response = await fetch(
//         `${config.url}/submissions?base64_encoded=false&wait=false`,
//         {
//           method: "POST",
//           headers: {
//             "content-type": "application/json",
//             "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//             "x-rapidapi-key": config.key,
//           },
//           body: JSON.stringify({
//             language_id: languageId,
//             source_code: codeRef.current,
//             stdin: "",
//           }),
//         }
//       );

//       const data = await response.json();
//       const token = data.token;

//       let result;
//       while (true) {
//         const res = await fetch(
//           `${config.url}/submissions/${token}?base64_encoded=false`,
//           {
//             method: "GET",
//             headers: {
//               "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//               "x-rapidapi-key": config.key,
//             },
//           }
//         );
//         result = await res.json();
//         if (result.status.id <= 2) {
//           await new Promise((r) => setTimeout(r, 1000));
//         } else break;
//       }

//       if (result.stderr || result.compile_output) {
//         return { error: result.stderr || result.compile_output };
//       }
//       return result;
//     };

//     for (let i = 0; i < apiConfigs.length; i++) {
//       try {
//         return await tryRun(apiConfigs[i]);
//       } catch {
//         console.warn(`⚠ API ${i + 1} failed, trying next...`);
//       }
//     }
//     return { error: "Execution service is unavailable. Please try again later." };
//   };

//   const highlightError = (errorText) => {
//     if (!editorRef.current || !monacoRef.current) return;
//     const model = editorRef.current.getModel();
//     monacoRef.current.editor.setModelMarkers(model, "owner", []);

//     const lineMatch = errorText.match(/:(\d+):/);
//     const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 1;

//     monacoRef.current.editor.setModelMarkers(model, "owner", [
//       {
//         startLineNumber: lineNumber,
//         endLineNumber: lineNumber,
//         startColumn: 1,
//         endColumn: 1000,
//         message: errorText,
//         severity: monacoRef.current.MarkerSeverity.Error,
//       },
//     ]);

//     editorRef.current.revealLineInCenter(lineNumber);
//   };

//   const handleViewOutput = () => {
//     if (!lastResult) {
//       Swal.fire("No Result", "You need to run code first.", "info");
//       return;
//     }

//     let outputMsg = "";
//     if (lastResult.stdout) outputMsg = "✅ Output:\n" + lastResult.stdout;
//     else if (lastResult.stderr)
//       outputMsg = "❌ Runtime Error:\n" + lastResult.stderr;
//     else if (lastResult.compile_output)
//       outputMsg = "❌ Compilation Error:\n" + lastResult.compile_output;
//     else outputMsg = "⚠️ Unknown error";

//     Swal.fire("Execution Result", `<pre>${outputMsg}</pre>`, "info");
//   };

//   const toggleBgm = () => {
//     if (bgmOn) {
//       stopBackgroundMusic();
//       setBgmOn(false);
//     } else {
//       startBackgroundMusic();
//       setBgmOn(true);
//     }
//   };

//   const languages = ["c", "cpp", "java", "javascript", "typescript", "python", "go", "rust", "php", "sql", "shell"];

//   return (
//     <div className="w-full h-[70vh] md:h-[80vh] lg:h-[85vh] p-2 md:p-4 flex flex-col">
//       {/* Language Selector */}
//       <div className="flex justify-between items-center mb-2">
//         <label className="text-sm font-semibold">Select Language:</label>
//         <select
//           required
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//           className="select select-info w-full max-w-xs"
//         >
//           {languages.map((lang) => (
//             <option key={lang} value={lang}>
//               {lang.toUpperCase()}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* File Upload */}
//       <div className="flex justify-between items-center mb-2">
//         <label className="text-sm font-semibold">Upload Your File:</label>
//         <FileUpload
//           setCode={setCode}
//           editorRef={editorRef}
//           setLanguage={setLanguage}
//           setLanguageId={setLanguageId}
//         />
//       </div>

//       {/* Code Editor */}
//       <div className="rounded-2xl shadow-lg border border-base-300 overflow-hidden flex-1 bg-base-200 relative">
//         <Editor
//           language={language}
//           value={code}
//           onChange={(value) => setCode(value || "")}
//           onMount={handleEditorDidMount}
//           theme="vs-dark"
//           options={{
//             fontSize: 14,
//             minimap: { enabled: false },
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             wordWrap: "on",
//             padding: { top: 10 },
//           }}
//         />

//         {/* Paste button */}
//         <button onClick={handlePasteClick} className="absolute bottom-2 right-2">
//           📋
//         </button>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4 mt-4 flex-wrap">
//         <button
//           onClick={handleStartClick}
//           className="btn btn-outline btn-success"
//           disabled={isRunning}
//         >
//           ▶ Start
//         </button>
//         <button onClick={handleStopClick} className="btn btn-outline btn-warning">
//           ⏸ Stop
//         </button>
//         <button onClick={handleClearClick} className="btn btn-outline btn-error">
//           🧹 Clear
//         </button>
//         <button onClick={handleViewOutput} className="btn btn-outline btn-info">
//           📜 View Output
//         </button>
//         <button onClick={toggleBgm} className="btn btn-outline btn-secondary">
//           {bgmOn ? "🔇 Stop BGM" : "🎶 Play BGM"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;






// import React, { useRef, useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import { tokenizeLine } from "../../features/Tokenizer";
// import {
//   playTokenSound,
//   startAudio,
//   startBackgroundMusic,
//   stopBackgroundMusic,
//   setMusicTheme,
//   getMusicTheme,
// } from "../../features/musicEngine";
// import * as Tone from "tone";
// import Swal from "sweetalert2";
// import FileUpload from "./FileUpload";
// import VisualDisplay from "./VisualDisplay";

// const CodeEditor = ({ code, setCode, executionSpeed = 600 }) => {
//   const editorRef = useRef(null);
//   const monacoRef = useRef(null);
//   const [language, setLanguage] = useState("c");
//   const [languageId, setLanguageId] = useState(50);

//   const [isRunning, setIsRunning] = useState(false);
//   const [lastResult, setLastResult] = useState(null);
//   const [bgmOn, setBgmOn] = useState(true);

//   const [codeChanged, setCodeChanged] = useState(true); // ✅ Track if code changed

//   const codeRef = useRef(code);
//   const currentLineRef = useRef(1);
//   const cancelledRef = useRef(false);
//   const metronomePartRef = useRef(null);
//   const activeDecorationsRef = useRef([]);

//   const [theme, setTheme] = useState("lofi"); // lofi | edm | classical

//   const apiConfigs = [
//     {
//       url: "https://ce.judge0.com",
//       key: null,
//     },
//     {
//       url: "https://judge0-ce.p.rapidapi.com",
//       key: "3a67aa1365msh2f618ae65f181a9p1862afjsn4ae15b69a455",
//     },
//     {
//       url: "https://judge0-ce.p.rapidapi.com",
//       key: "e74b089bd8msh812f56fd0beb95ep1c1e77jsnfcd1552cb6b3",
//     },
//     {
//       url: "https://judge0-ce.p.rapidapi.com",
//       key: "66d6ebbbb4mshefa893a16fa5d3dp13fd89jsnd2b0cd0185a0",
//     },
//   ];

//   useEffect(() => {
//     codeRef.current = code;
//     setCodeChanged(true); // ✅ mark as changed when user edits
//   }, [code]);

//   useEffect(() => {
//     // set engine theme and start audio + bgm
//     const init = async () => {
//       await startAudio();
//       setMusicTheme(theme);
//       startBackgroundMusic(theme);
//     };
//     init();

//     return () => {
//       stopBackgroundMusic();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // run once on mount

//   // when theme changes, update engine and restart BGM if it's on
//   useEffect(() => {
//     setMusicTheme(theme);
//     if (bgmOn) {
//       stopBackgroundMusic();
//       startBackgroundMusic(theme);
//     }
//   }, [theme]); // eslint-disable-line

//   const handleEditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;
//     monacoRef.current = monaco;
//   };

//   // --- Start Execution ---
//   const handleStartClick = async () => {
//     try {
//       await startAudio();
//       cancelledRef.current = false;
//       setIsRunning(true);

//       // ✅ If code unchanged → skip Judge0 call
//       if (!codeChanged && lastResult) {
//         runExecution();
//         return;
//       }

//       Swal.fire({
//         title: "⏳ Please wait...",
//         text: "Your code is running on server...",
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       const result = await runCodeOnJudge0();

//       if (result.error) {
//         setIsRunning(false);
//         Swal.fire("Execution Failed", `<pre>${result.error}</pre>`, "error");
//         highlightError(result.error);
//         stopAll();
//         return;
//       }

//       Swal.close();
//       setLastResult(result);
//       setCodeChanged(false); // ✅ reset flag after successful run

//       if (result.stdout) {
//         Swal.fire("Execution Result", `<pre>${result.stdout}</pre>`, "success");
//       }

//       runExecution();
//     } catch {
//       setIsRunning(false);
//       stopAll();
//       Swal.fire("Execution Failed", "Something went wrong. Please try again.", "error");
//     }
//   };

//   const handleStopClick = () => {
//     stopAll();
//     setIsRunning(false);
//   };

//   const handleClearClick = () => {
//     stopAll();
//     setIsRunning(false);
//     currentLineRef.current = 1;
//     setCode("");
//     setCodeChanged(true);

//     if (editorRef.current && monacoRef.current) {
//       editorRef.current.deltaDecorations(activeDecorationsRef.current, []);
//       monacoRef.current.editor.setModelMarkers(
//         editorRef.current.getModel(),
//         "owner",
//         []
//       );
//     }
//   };

//   const handlePasteClick = async () => {
//     try {
//       const text = await navigator.clipboard.readText();
//       if (editorRef.current) {
//         const editor = editorRef.current;
//         const selection = editor.getSelection();
//         const model = editor.getModel();
//         const range = selection || model.getFullModelRange();

//         editor.executeEdits("paste", [
//           { range, text, forceMoveMarkers: true },
//         ]);
//         editor.focus();
//       } else {
//         setCode((prev) => prev + "\n" + text);
//       }
//     } catch {
//       Swal.fire("Clipboard Error", "Could not paste from clipboard.", "error");
//     }
//   };

//   const stopAll = () => {
//     cancelledRef.current = true;
//     if (metronomePartRef.current) metronomePartRef.current.stop();
//     Tone.Transport.stop();
//   };

//   const runExecution = () => {
//     const editor = editorRef.current;
//     const monaco = monacoRef.current;
//     if (!editor || !monaco) return;

//     const lines = (codeRef.current ?? "").split("\n");

//     const bpm = 60000 / executionSpeed;
//     Tone.Transport.bpm.value = bpm * 4;

//     const metronomePart = new Tone.Loop(() => {}, "1n");
//     Tone.Transport.start();
//     metronomePart.start(0);
//     metronomePartRef.current = metronomePart;

//     const runStep = async () => {
//       if (cancelledRef.current) return;
//       const currentLine = currentLineRef.current;

//       activeDecorationsRef.current = editor.deltaDecorations(
//         activeDecorationsRef.current,
//         [
//           {
//             range: new monaco.Range(currentLine, 1, currentLine, 1),
//             options: { isWholeLine: true, className: "lineHighlight-execution" },
//           },
//         ]
//       );

//       let tokens = tokenizeLine(lines[currentLine - 1] || "");
//       const barDuration = executionSpeed / 1000;
//       const step = barDuration / Math.max(1, tokens.length);
//       tokens.forEach((t, i) => playTokenSound(t, i * step));

//       currentLineRef.current++;
//       if (currentLineRef.current > lines.length) {
//         setTimeout(() => {
//           editor.deltaDecorations(activeDecorationsRef.current, []);
//           metronomePart.stop();
//           Tone.Transport.stop();
//           setIsRunning(false);
//         }, 500);
//         return;
//       }
//       setTimeout(runStep, executionSpeed);
//     };

//     runStep();
//   };

//   const runCodeOnJudge0 = async () => {
//     const tryRun = async (config) => {
//       const response = await fetch(
//         `${config.url}/submissions?base64_encoded=false&wait=false`,
//         {
//           method: "POST",
//           headers: {
//             "content-type": "application/json",
//             "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//             "x-rapidapi-key": config.key,
//           },
//           body: JSON.stringify({
//             language_id: languageId,
//             source_code: codeRef.current,
//             stdin: "",
//           }),
//         }
//       );

//       const data = await response.json();
//       const token = data.token;

//       let result;
//       while (true) {
//         const res = await fetch(
//           `${config.url}/submissions/${token}?base64_encoded=false`,
//           {
//             method: "GET",
//             headers: {
//               "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//               "x-rapidapi-key": config.key,
//             },
//           }
//         );
//         result = await res.json();
//         if (result.status.id <= 2) {
//           await new Promise((r) => setTimeout(r, 1000));
//         } else break;
//       }

//       if (result.stderr || result.compile_output) {
//         return { error: result.stderr || result.compile_output };
//       }
//       return result;
//     };

//     for (let i = 0; i < apiConfigs.length; i++) {
//       try {
//         return await tryRun(apiConfigs[i]);
//       } catch {
//         console.warn(`⚠ API ${i + 1} failed, trying next...`);
//       }
//     }
//     return { error: "Execution service is unavailable. Please try again later." };
//   };

//   const highlightError = (errorText) => {
//     if (!editorRef.current || !monacoRef.current) return;
//     const model = editorRef.current.getModel();
//     monacoRef.current.editor.setModelMarkers(model, "owner", []);

//     const lineMatch = errorText.match(/:(\d+):/);
//     const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 1;

//     monacoRef.current.editor.setModelMarkers(model, "owner", [
//       {
//         startLineNumber: lineNumber,
//         endLineNumber: lineNumber,
//         startColumn: 1,
//         endColumn: 1000,
//         message: errorText,
//         severity: monacoRef.current.MarkerSeverity.Error,
//       },
//     ]);

//     editorRef.current.revealLineInCenter(lineNumber);
//   };

//   const handleViewOutput = () => {
//     if (!lastResult) {
//       Swal.fire("No Result", "You need to run code first.", "info");
//       return;
//     }

//     let outputMsg = "";
//     if (lastResult.stdout) outputMsg = "✅ Output:\n" + lastResult.stdout;
//     else if (lastResult.stderr)
//       outputMsg = "❌ Runtime Error:\n" + lastResult.stderr;
//     else if (lastResult.compile_output)
//       outputMsg = "❌ Compilation Error:\n" + lastResult.compile_output;
//     else outputMsg = "⚠️ Unknown error";

//     Swal.fire("Execution Result", `<pre>${outputMsg}</pre>`, "info");
//   };

//   const toggleBgm = () => {
//     if (bgmOn) {
//       stopBackgroundMusic();
//       setBgmOn(false);
//     } else {
//       const current = getMusicTheme() || theme;
//       startBackgroundMusic(current);
//       setBgmOn(true);
//     }
//   };

//   const languages = ["c", "cpp", "java", "javascript", "typescript", "python", "go", "rust", "php", "sql", "shell"];

//   return (
//     <div className="w-full h-[70vh] md:h-[80vh] lg:h-[85vh] p-2 md:p-4 flex flex-col">
//       {/* Language Selector + Theme Selector */}
//       <div className="flex justify-between items-center mb-2 gap-4">
//         <div className="flex items-center gap-2">
//           <label className="text-sm font-semibold">Language:</label>
//           <select
//             required
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//             className="select select-info w-full max-w-xs"
//           >
//             {languages.map((lang) => (
//               <option key={lang} value={lang}>
//                 {lang.toUpperCase()}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <label className="text-sm font-semibold">Audio Theme:</label>
//           <select
//             value={theme}
//             onChange={(e) => setTheme(e.target.value)}
//             className="select select-secondary w-full max-w-xs"
//           >
//             <option value="lofi">Lo-Fi</option>
//             <option value="edm">EDM</option>
//             <option value="classical">Classical</option>
//           </select>
//         </div>
//       </div>

//       {/* File Upload */}
//       <div className="flex justify-between items-center mb-2">
//         <label className="text-sm font-semibold">Upload Your File:</label>
//         <FileUpload
//           setCode={setCode}
//           editorRef={editorRef}
//           setLanguage={setLanguage}
//           setLanguageId={setLanguageId}
//         />
//       </div>

//       {/* Code Editor */}
//       <div className="rounded-2xl shadow-lg border border-base-300 overflow-hidden flex-1 bg-base-200 relative">
//         <Editor
//           language={language}
//           value={code}
//           onChange={(value) => setCode(value || "")}
//           onMount={handleEditorDidMount}
//           theme="vs-dark"
//           options={{
//             fontSize: 14,
//             minimap: { enabled: false },
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//             wordWrap: "on",
//             padding: { top: 10 },
//           }}
//         />
// <VisualDisplay theme={theme} />

//         {/* Paste button */}
//         <button onClick={handlePasteClick} className="absolute bottom-2 right-2">
//           📋
//         </button>
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-4 mt-4 flex-wrap">
//         <button
//           onClick={handleStartClick}
//           className="btn btn-outline btn-success"
//           disabled={isRunning}
//         >
//           ▶ Start
//         </button>
//         <button onClick={handleStopClick} className="btn btn-outline btn-warning">
//           ⏸ Stop
//         </button>
//         <button onClick={handleClearClick} className="btn btn-outline btn-error">
//           🧹 Clear
//         </button>
//         <button onClick={handleViewOutput} className="btn btn-outline btn-info">
//           📜 View Output
//         </button>
//         <button onClick={toggleBgm} className="btn btn-outline btn-secondary">
//           {bgmOn ? "🔇 Stop BGM" : "🎶 Play BGM"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;


// last one
import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { tokenizeLine } from "../../features/Tokenizer";
import {
  playTokenSound,
  startAudio,
  startBackgroundMusic,
  stopBackgroundMusic,
  setTheme as setMusicTheme,
  getTheme as getMusicTheme,
} from "../../features/musicEngine";
import * as Tone from "tone";
import Swal from "sweetalert2";
import FileUpload from "./FileUpload";

const CodeEditor = ({ code, setCode, executionSpeed = 600 }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [language, setLanguage] = useState("c");
  const [languageId, setLanguageId] = useState(50);

  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [bgmOn, setBgmOn] = useState(true);

  const [codeChanged, setCodeChanged] = useState(true); // ✅ Track if code changed

  const codeRef = useRef(code);
  const currentLineRef = useRef(1);
  const cancelledRef = useRef(false);
  const metronomePartRef = useRef(null);
  const activeDecorationsRef = useRef([]);

  // NEW: theme selection for background music / token timbre / visuals
  const THEMES = ["Lo-Fi", "EDM", "Classical"];
  const [selectedTheme, setSelectedTheme] = useState("Lo-Fi");

  const apiConfigs = [
    {
      url: "https://ce.judge0.com",
      key: null,
    },
    {
      url: "https://judge0-ce.p.rapidapi.com",
      key: "3a67aa1365msh2f618ae65f181a9p1862afjsn4ae15b69a455",
    },
    {
      url: "https://judge0-ce.p.rapidapi.com",
      key: "e74b089bd8msh812f56fd0beb95ep1c1e77jsnfcd1552cb6b3",
    },
    {
      url: "https://judge0-ce.p.rapidapi.com",
      key: "66d6ebbbb4mshefa893a16fa5d3dp13fd89jsnd2b0cd0185a0",
    },
  ];

  // Update codeRef when code changes
  useEffect(() => {
    codeRef.current = code;
    setCodeChanged(true);
  }, [code]);

  // Update music engine when theme changes
  useEffect(() => {
    setMusicTheme(selectedTheme);
    if (bgmOn) {
      stopBackgroundMusic();
      startBackgroundMusic(selectedTheme);
    }
  }, [selectedTheme]); // eslint-disable-line

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // --- Start Execution ---
  const handleStartClick = async () => {
    try {
      // Start audio from user gesture
      const audioOk = await startAudio();
      if (!audioOk) {
        Swal.fire(
          "Audio Locked",
          "Please click Start again to enable audio playback.",
          "warning"
        );
        return;
      }

      // Set theme & start BGM
      setMusicTheme(selectedTheme);
      if (bgmOn) startBackgroundMusic(selectedTheme);

      cancelledRef.current = false;
      setIsRunning(true);

      // If code unchanged → skip Judge0 call
      if (!codeChanged && lastResult) {
        runExecution();
        return;
      }

      Swal.fire({
        title: "⏳ Please wait...",
        text: "Your code is running on server...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      const result = await runCodeOnJudge0();

      if (result.error) {
        setIsRunning(false);
        Swal.fire("Execution Failed", `<pre>${result.error}</pre>`, "error");
        highlightError(result.error);
        stopAll();
        return;
      }

      Swal.close();
      setLastResult(result);
      setCodeChanged(false);

      if (result.stdout) {
        Swal.fire("Execution Result", `<pre>${result.stdout}</pre>`, "success");
      }

      runExecution();
    } catch {
      setIsRunning(false);
      stopAll();
      Swal.fire("Execution Failed", "Something went wrong. Please try again.", "error");
    }
  };

  const handleStopClick = () => {
    stopAll();
    setIsRunning(false);
  };

  const handleClearClick = () => {
    stopAll();
    setIsRunning(false);
    currentLineRef.current = 1;
    setCode("");
    setCodeChanged(true);

    if (editorRef.current && monacoRef.current) {
      editorRef.current.deltaDecorations(activeDecorationsRef.current, []);
      monacoRef.current.editor.setModelMarkers(editorRef.current.getModel(), "owner", []);
    }
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (editorRef.current) {
        const editor = editorRef.current;
        const selection = editor.getSelection();
        const model = editor.getModel();
        const range = selection || model.getFullModelRange();

        editor.executeEdits("paste", [{ range, text, forceMoveMarkers: true }]);
        editor.focus();
      } else {
        setCode((prev) => prev + "\n" + text);
      }
    } catch {
      Swal.fire("Clipboard Error", "Could not paste from clipboard.", "error");
    }
  };

  const stopAll = () => {
    cancelledRef.current = true;
    if (metronomePartRef.current) metronomePartRef.current.stop();
    try {
      Tone.Transport.stop();
    } catch {}
  };

  const runExecution = () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const lines = (codeRef.current ?? "").split("\n");
    const bpm = 60000 / executionSpeed;
    Tone.Transport.bpm.value = bpm * 4;

    const metronomePart = new Tone.Loop(() => {}, "1n");
    Tone.Transport.start();
    metronomePart.start(0);
    metronomePartRef.current = metronomePart;

    const runStep = async () => {
      if (cancelledRef.current) return;
      const currentLine = currentLineRef.current;

      activeDecorationsRef.current = editor.deltaDecorations(activeDecorationsRef.current, [
        {
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: { isWholeLine: true, className: "lineHighlight-execution" },
        },
      ]);

      let tokens = tokenizeLine(lines[currentLine - 1] || "");
      const barDuration = executionSpeed / 1000;
      const step = barDuration / Math.max(1, tokens.length);
      tokens.forEach((t, i) => playTokenSound(t, i * step));

      currentLineRef.current++;
      if (currentLineRef.current > lines.length) {
        setTimeout(() => {
          editor.deltaDecorations(activeDecorationsRef.current, []);
          metronomePart.stop();
          Tone.Transport.stop();
          setIsRunning(false);
        }, 500);
        return;
      }
      setTimeout(runStep, executionSpeed);
    };

    runStep();
  };

  const runCodeOnJudge0 = async () => {
    const tryRun = async (config) => {
      const response = await fetch(`${config.url}/submissions?base64_encoded=false&wait=false`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": config.key,
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: codeRef.current,
          stdin: "",
        }),
      });

      const data = await response.json();
      const token = data.token;

      let result;
      while (true) {
        const res = await fetch(`${config.url}/submissions/${token}?base64_encoded=false`, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": config.key,
          },
        });
        result = await res.json();
        if (result.status.id <= 2) await new Promise((r) => setTimeout(r, 1000));
        else break;
      }

      if (result.stderr || result.compile_output) {
        return { error: result.stderr || result.compile_output };
      }
      return result;
    };

    for (let i = 0; i < apiConfigs.length; i++) {
      try {
        return await tryRun(apiConfigs[i]);
      } catch {
        console.warn(`⚠ API ${i + 1} failed, trying next...`);
      }
    }
    return { error: "Execution service is unavailable. Please try again later." };
  };

  const highlightError = (errorText) => {
    if (!editorRef.current || !monacoRef.current) return;
    const model = editorRef.current.getModel();
    monacoRef.current.editor.setModelMarkers(model, "owner", []);

    const lineMatch = errorText.match(/:(\d+):/);
    const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 1;

    monacoRef.current.editor.setModelMarkers(model, "owner", [
      {
        startLineNumber: lineNumber,
        endLineNumber: lineNumber,
        startColumn: 1,
        endColumn: 1000,
        message: errorText,
        severity: monacoRef.current.MarkerSeverity.Error,
      },
    ]);

    editorRef.current.revealLineInCenter(lineNumber);
  };

  const handleViewOutput = () => {
    if (!lastResult) {
      Swal.fire("No Result", "You need to run code first.", "info");
      return;
    }

    let outputMsg = "";
    if (lastResult.stdout) outputMsg = "✅ Output:\n" + lastResult.stdout;
    else if (lastResult.stderr) outputMsg = "❌ Runtime Error:\n" + lastResult.stderr;
    else if (lastResult.compile_output) outputMsg = "❌ Compilation Error:\n" + lastResult.compile_output;
    else outputMsg = "⚠️ Unknown error";

    Swal.fire("Execution Result", `<pre>${outputMsg}</pre>`, "info");
  };

  const toggleBgm = () => {
    if (bgmOn) {
      stopBackgroundMusic();
      setBgmOn(false);
    } else {
      startBackgroundMusic(selectedTheme);
      setBgmOn(true);
    }
  };

  const languages = [
    "c",
    "cpp",
    "java",
    "javascript",
    "typescript",
    "python",
    "go",
    "rust",
    "php",
    "sql",
    "shell",
  ];

  return (
    <div className="w-full h-[70vh] md:h-[80vh] lg:h-[85vh] p-2 md:p-4 flex flex-col">
      {/* Language Selector + Theme Selector */}
      <div className="flex justify-between items-center mb-2 gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Select Language:</label>
          <select
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select select-info w-full max-w-xs"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Theme:</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="select select-secondary w-full max-w-xs"
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold">Upload Your File:</label>
        <FileUpload
          setCode={setCode}
          editorRef={editorRef}
          setLanguage={setLanguage}
          setLanguageId={setLanguageId}
        />
      </div>

      {/* Code Editor */}
      <div className="rounded-2xl shadow-lg border border-base-300 overflow-hidden flex-1 bg-base-200 relative">
        <Editor
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            padding: { top: 10 },
          }}
        />

        {/* Paste button */}
        <button onClick={handlePasteClick} className="absolute bottom-2 right-2">
          📋
        </button>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-4 flex-wrap">
        <button onClick={handleStartClick} className="btn btn-outline btn-success" disabled={isRunning}>
          ▶ Start
        </button>
        <button onClick={handleStopClick} className="btn btn-outline btn-warning">
          ⏸ Stop
        </button>
        <button onClick={handleClearClick} className="btn btn-outline btn-error">
          🧹 Clear
        </button>
        <button onClick={handleViewOutput} className="btn btn-outline btn-info">
          📜 View Output
        </button>
        <button onClick={toggleBgm} className="btn btn-outline btn-secondary">
          {bgmOn ? "🔇 Stop BGM" : "🎶 Play BGM"}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
