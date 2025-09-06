// --- Simple fallback tokenizer (per line) ---
export function tokenizeLine(line) {
  if (!line || line.trim() === "") return [];

  // Match identifiers, numbers (int, float, hex), strings, operators, symbols
  const regex =
    /\b0x[0-9A-Fa-f]+\b|\b\d+(\.\d+)?\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[A-Za-z_]\w*|==|!=|<=|>=|\+\+|--|&&|\|\||::|->|=>|[{}()[\];,.]|[=+\-*/%<>!&|^~?:]/g;

  const tokens = line.match(regex) || [];

  return tokens.map((tok) => ({
    type: detectTokenType(tok),
    value: tok,
  }));
}

// --- Keyword sets per language ---
const keywords = {
  common: [
    "if","else","for","while","do","switch","case","break","continue","return",
    "try","catch","finally","throw","new","class","struct","interface","import",
    "package","public","private","protected","static","void","true","false","null",
    "this","super","extends","implements"
  ],
  c: ["int","float","double","char","long","short","bool","unsigned","signed","sizeof","typedef","enum","union","goto","const","volatile","extern","inline"],
  cpp: ["namespace","template","typename","operator","friend","virtual","explicit","constexpr","using","delete","default","mutable","override","final"],
  java: ["synchronized","abstract","native","strictfp","throws","boolean","byte"],
  javascript: ["var","let","const","function","yield","async","await","of","in","with","debugger"],
  typescript: ["type","interface","enum","as","unknown","readonly","keyof","declare"],
  python: ["def","lambda","pass","yield","async","await","global","nonlocal","with","del","is","and","or","not","from","import","as","elif","except","raise"],
  go: ["map","chan","select","defer","go","range","make","len","cap","append","copy","struct","interface","package","func"],
  rust: ["fn","let","mut","pub","crate","mod","impl","trait","match","enum","use","where","as","dyn","ref","move","Self","super"],
  php: ["echo","print","function","namespace","use","global","isset","unset","empty","array","class","interface","trait","extends","implements","require","include"],
  sql: ["SELECT","INSERT","UPDATE","DELETE","FROM","WHERE","JOIN","INNER","LEFT","RIGHT","FULL","ON","AS","DISTINCT","GROUP","BY","ORDER","HAVING","LIMIT","OFFSET","INTO","VALUES","CREATE","DROP","ALTER","TABLE","DATABASE"],
  shell: ["echo","cd","ls","pwd","grep","awk","sed","if","then","else","elif","fi","for","while","do","done","case","esac","function","export","alias","trap","exit","return"]
};

// --- Detect token type for mapping to sounds ---
function detectTokenType(token) {
  // Numbers (int, float, hex)
  if (/^(0x[0-9A-Fa-f]+|\d+(\.\d+)?)$/.test(token)) return "number";

  // Strings (handles escapes)
  if (/^"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'$/.test(token)) return "string";

  // Keywords (case-insensitive)
  const allKeywords = new Set(
    Object.values(keywords).flat().map((kw) => kw.toLowerCase())
  );
  if (allKeywords.has(token.toLowerCase())) return "keyword";

  // Symbols
  if (/^[{}()[\];,.]$/.test(token)) return "symbol";

  // Operators
  if (
    /^(==|!=|<=|>=|\+\+|--|&&|\|\||::|->|=>|=|\+|-|\*|\/|%|<|>|!|&|\||\^|~|\?|:)$/.test(
      token
    )
  )
    return "operator";

  // Default = identifier
  return "identifier";
}

// --- Parse entire code into tokens (line by line) ---
export function getTokensForAllLines(code) {
  if (!code) return [];
  const lines = code.split("\n");
  return lines.map((line) => tokenizeLine(line));
}

// --- Error Detection ---
export function detectErrors(code, language = "javascript") {
  const errors = [];
  const stack = [];
  const lines = code.split("\n");

  lines.forEach((line, i) => {
    const lineNo = i + 1;
    const trimmed = line.trim();

    // --- Check for unclosed quotes (per line, ignoring escaped quotes)
    const unescapedSingle = (line.match(/(^|[^\\])'/g) || []).length;
    const unescapedDouble = (line.match(/(^|[^\\])"/g) || []).length;
    if (unescapedSingle % 2 !== 0 || unescapedDouble % 2 !== 0) {
      errors.push({ line: lineNo, message: "Unclosed string literal" });
    }

    // --- Check for brackets balance
    for (let char of line) {
      if ("{([".includes(char)) stack.push({ char, line: lineNo });
      if ("})]".includes(char)) {
        const last = stack.pop();
        if (!last) {
          errors.push({ line: lineNo, message: "Unmatched closing " + char });
        }
      }
    }

    // --- Language-specific checks
    if (["c", "cpp", "java", "javascript", "typescript", "php"].includes(language)) {
      if (
        trimmed &&
        !/[;{}:]$/.test(trimmed) &&
        !/^(if|else|for|while|switch|function|class|try|catch)\b/.test(trimmed)
      ) {
        errors.push({ line: lineNo, message: "Possible missing semicolon" });
      }
    }

    if (language === "python") {
      if (/;/.test(trimmed)) {
        errors.push({ line: lineNo, message: "Unnecessary semicolon in Python" });
      }
      if (/^\s+/.test(line) && !/^\s{4}/.test(line)) {
        errors.push({ line: lineNo, message: "Indentation should be multiples of 4 spaces" });
      }
    }
  });

  // --- If stack not empty → unmatched opening
  while (stack.length > 0) {
    const last = stack.pop();
    errors.push({
      line: last.line,
      message: "Unmatched opening " + last.char,
    });
  }

  return errors;
}
