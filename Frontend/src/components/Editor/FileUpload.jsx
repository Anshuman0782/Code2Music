import React from "react";

const FileUpload = ({ setCode, editorRef, setLanguage, setLanguageId }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const text = await file.text();

        // --- Detect language from file extension ---
        const ext = file.name.split(".").pop().toLowerCase();

        const langMap = {
          c: { name: "c", id: 50 },
          cpp: { name: "cpp", id: 54 },
          h: { name: "cpp", id: 54 },
          java: { name: "java", id: 62 },
          js: { name: "javascript", id: 63 },
          jsx: { name: "javascript", id: 63 },
          ts: { name: "typescript", id: 74 },
          tsx: { name: "typescript", id: 74 },
          py: { name: "python", id: 71 },
          go: { name: "go", id: 60 },
          rs: { name: "rust", id: 73 },
          php: { name: "php", id: 68 },
          json: { name: "json", id: null },
          sql: { name: "sql", id: 82 },
          sh: { name: "shell", id: 46 },
          yaml: { name: "yaml", id: null },
          yml: { name: "yaml", id: null },
          swift: { name: "swift", id: 83 },
          kt: { name: "kotlin", id: 78 },
          m: { name: "objective-c", id: 79 },
          cs: { name: "csharp", id: 51 },
          rb: { name: "ruby", id: 72 },
        };

        const langInfo = langMap[ext];

        if (langInfo) {
          if (setLanguage) setLanguage(langInfo.name);
          if (setLanguageId && langInfo.id) setLanguageId(langInfo.id);
        }

        // --- Insert into editor if available ---
        if (editorRef?.current) {
          const editor = editorRef.current;
          const selection = editor.getSelection();
          const model = editor.getModel();
          const range = selection || model.getFullModelRange();

          editor.executeEdits("file-upload", [
            {
              range,
              text,
              forceMoveMarkers: true,
            },
          ]);
          editor.focus();
        } else {
          setCode(text);
        }
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".c,.cpp,.java,.js,.ts,.jsx,.tsx,.py,.go,.rs,.php,sql"
        onChange={handleFileChange}
        className="file-input file-input-bordered file-input-info w-full max-w-xs"
      />
    </div>
  );
};

export default FileUpload;
