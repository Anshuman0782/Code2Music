// // musicEngine.js
// import * as Tone from "tone";
// import { pushTokenEvent as pushTokenEventFromVisualizer } from "../components/Editor/VisualDisplay"; // connect to visualizer

// // ---------- Instruments (shared) ----------
// const synth = new Tone.Synth().toDestination();
// const fmSynth = new Tone.FMSynth().toDestination();
// const membrane = new Tone.MembraneSynth().toDestination();
// const pluck = new Tone.PluckSynth().toDestination();
// const noise = new Tone.NoiseSynth().toDestination();
// const errorSynth = new Tone.FMSynth({
//   modulationIndex: 30,
//   envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 1 },
//   modulation: { type: "square" },
// }).toDestination();

// // increased polyphony (fix max polyphony exceeded issue)
// const polySynth = new Tone.PolySynth(Tone.Synth, { maxPolyphony: 64 }).toDestination();
// const bgSynth = new Tone.PolySynth(Tone.Synth, {
//   maxPolyphony: 64,
//   oscillator: { type: "sine" },
//   envelope: { attack: 2, decay: 1, sustain: 0.7, release: 2 }, // shorter release
// }).toDestination();
// bgSynth.volume.value = -18;

// // For EDM we use some FM + metallic sounds
// const edmfm = new Tone.FMSynth({
//   harmonicity: 3,
//   modulationIndex: 8,
//   detune: -120,
//   envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 },
// }).toDestination();
// edmfm.volume.value = -6;

// // Current theme state
// let currentTheme = "Lo-Fi";
// export function setTheme(t) {
//   currentTheme = t;
// }
// export function getTheme() {
//   return currentTheme;
// }

// // Background loop holder
// let bgLoop = null;
// let bgActive = false;
// let resumeTimeout = null;
// let isExecuting = false; // NEW: track if code execution is active

// /**
//  * Ensure AudioContext is started (must be called from user gesture to actually unlock audio)
//  * Returns true if audio context is running (or was already running), false otherwise.
//  */
// export async function startAudio() {
//   try {
//     const state = Tone.context.state;
//     if (state === "running") {
//       console.log("✅ Audio already running");
//       return true;
//     }
//     if (state === "suspended") {
//       await Tone.start();
//       console.log("✅ Audio engine started (Tone.start())");
//       return Tone.context.state === "running";
//     }
//     await Tone.start();
//     return Tone.context.state === "running";
//   } catch (err) {
//     console.warn("⚠️ Could not start AudioContext. Call startAudio() from a user gesture.", err);
//     return false;
//   }
// }

// export async function startBackgroundMusic(theme) {
//   const themeToUse = theme || currentTheme;
//   setTheme(themeToUse);

//   if (Tone.context.state !== "running") {
//     console.warn(`🔇 startBackgroundMusic: AudioContext not running (state=${Tone.context.state}).`);
//     return false;
//   }

//   if (bgLoop) {
//     try {
//       bgLoop.stop();
//     } catch (e) {}
//     bgLoop = null;
//   }

//   if (themeToUse === "Lo-Fi") {
//     startLoFiBGM();
//   } else if (themeToUse === "EDM") {
//     startEDMBGM();
//   } else if (themeToUse === "Classical") {
//     startClassicalBGM();
//   }

//   try {
//     if (!Tone.Transport.state || Tone.Transport.state !== "started") {
//       Tone.Transport.start();
//     }
//   } catch (e) {
//     console.warn("Could not start Tone.Transport:", e);
//   }

//   bgActive = true;
//   console.log("🎶 Background music started for theme:", themeToUse);
//   return true;
// }

// export function stopBackgroundMusic() {
//   if (bgLoop) {
//     try {
//       bgLoop.stop();
//     } catch (e) {}
//     bgLoop = null;
//   }
//   try {
//     Tone.Transport.stop();
//   } catch (e) {}
//   bgActive = false;
//   console.log("🛑 Background music stopped");
// }

// // NEW: pause/resume logic while executing code
// function pauseBackgroundWhileCodeExec() {
//   if (bgActive) {
//     stopBackgroundMusic();
//     clearTimeout(resumeTimeout);
//     // resume after short delay if execution ends
//     resumeTimeout = setTimeout(() => {
//       if (!isExecuting) startBackgroundMusic();
//     }, 1000);
//   }
// }

// /* ===== Theme-specific BGMs ===== */
// function startLoFiBGM() {
//   bgSynth.set({ oscillator: { type: "sine" } });
//   const loFiChords = [
//     ["C3", "G3", "E4"],
//     ["A2", "E3", "C4"],
//     ["F2", "C3", "A3"],
//     ["G2", "D3", "B3"],
//   ];
//   bgLoop = new Tone.Loop((time) => {
//     const chord = loFiChords[Math.floor(Math.random() * loFiChords.length)];
//     bgSynth.triggerAttackRelease(chord, "2n", time);
//     synth.triggerAttackRelease("G4", "4n", time + 0.1, 0.2);
//   }, "2n").start(0);
// }

// function startEDMBGM() {
//   bgSynth.set({ oscillator: { type: "square" } });
//   const edmArp = ["C4", "E4", "G4", "B3", "E4", "G4"];
//   let i = 0;
//   bgLoop = new Tone.Loop((time) => {
//     const note = edmArp[i % edmArp.length];
//     edmfm.triggerAttackRelease(note, "16n", time, 0.9);
//     if (i % 8 === 0) {
//       bgSynth.triggerAttackRelease(["C3", "G3", "E4"], "8n", time);
//     }
//     i++;
//   }, "8n").start(0);
// }

// function startClassicalBGM() {
//   bgSynth.set({
//     oscillator: { type: "triangle" },
//     envelope: { attack: 1.5, decay: 0.8, sustain: 0.7, release: 3 },
//   });
//   const progressions = [
//     ["C4", "E4", "G4"],
//     ["F3", "A3", "C4"],
//     ["G3", "B3", "D4"],
//     ["E3", "G3", "B3"],
//   ];
//   let idx = 0;
//   bgLoop = new Tone.Loop((time) => {
//     bgSynth.triggerAttackRelease(progressions[idx % progressions.length], "1m", time);
//     idx++;
//   }, "1m").start(0);
// }

// /* ===== Token → Sound Mappings per theme ===== */
// const THEME_MAPPINGS = {
//   "Lo-Fi": {
//     keyword: { instrument: synth, note: "C4" },
//     identifier: { instrument: pluck, note: "E4" },
//     string: { instrument: pluck, note: "A3" },
//     number: { instrument: membrane, note: "C2" },
//     operator: { instrument: noise, note: null },
//     comment: { instrument: synth, note: "G3" },
//     punctuation: { instrument: pluck, note: "D4" },
//     default: { instrument: synth, note: "B3" },
//   },
//   EDM: {
//     keyword: { instrument: edmfm, note: "C5" },
//     identifier: { instrument: fmSynth, note: "G4" },
//     string: { instrument: pluck, note: "E4" },
//     number: { instrument: membrane, note: "C3" },
//     operator: { instrument: noise, note: null },
//     comment: { instrument: synth, note: "B3" },
//     punctuation: { instrument: edmfm, note: "D4" },
//     default: { instrument: fmSynth, note: "A4" },
//   },
//   Classical: {
//     keyword: { instrument: polySynth, note: "E4" },
//     identifier: { instrument: synth, note: "G4" },
//     string: { instrument: pluck, note: "C4" },
//     number: { instrument: membrane, note: "C2" },
//     operator: { instrument: pluck, note: "D4" },
//     comment: { instrument: synth, note: "A3" },
//     punctuation: { instrument: pluck, note: "B3" },
//     default: { instrument: synth, note: "D4" },
//   },
// };

// const controlFlowChords = {
//   if: ["C4", "E4", "G4"],
//   else: ["A3", "C4", "E4"],
//   for: ["D4", "F4", "A4"],
//   while: ["E3", "G3", "B3"],
//   switch: ["G3", "B3", "D4"],
// };
// const functionChords = {
//   function: ["C5", "E5", "G5", "B5"],
//   def: ["C5", "D5", "F5", "A5"],
//   void: ["C4", "G4", "E5"],
// };
// const resolveChords = {
//   return: ["F3", "A3", "C4"],
//   break: ["G2", "B2", "D3"],
// };

// function playChord(chordNotes, timeOffset = 0) {
//   const now = Tone.now() + timeOffset;
//   polySynth.triggerAttackRelease(chordNotes, "2n", now);
// }

// export function playTokenSound(token, timeOffset = 0) {
//   if (Tone.context.state !== "running") {
//     try {
//       pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
//     } catch (e) {}
//     console.warn("🔇 playTokenSound called while AudioContext is not running.");
//     return;
//   }

//   // mark execution running
//   isExecuting = true;
//   pauseBackgroundWhileCodeExec();

//   const valueLower = (token.value || "").toLowerCase();

//   if (controlFlowChords[valueLower]) {
//     playChord(controlFlowChords[valueLower], timeOffset);
//     pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
//   } else if (functionChords[valueLower]) {
//     functionChords[valueLower].forEach((note, i) => {
//       const now = Tone.now() + timeOffset + i * 0.12;
//       synth.triggerAttackRelease(note, "8n", now);
//     });
//     pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
//   } else if (resolveChords[valueLower]) {
//     playChord(resolveChords[valueLower], timeOffset);
//     pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
//   } else {
//     const mapping =
//       (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme][token.type]) ||
//       (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme].default) ||
//       THEME_MAPPINGS["Lo-Fi"].default;
//     const { instrument, note } = mapping;
//     const now = Tone.now() + timeOffset;

//     try {
//       if (instrument instanceof Tone.NoiseSynth) {
//         instrument.triggerAttackRelease("8n", now);
//       } else if (instrument instanceof Tone.PolySynth) {
//         instrument.triggerAttackRelease(note ? [note] : ["C4"], "8n", now);
//       } else {
//         let dur = "8n";
//         if (currentTheme === "EDM") dur = "16n";
//         if (currentTheme === "Lo-Fi") dur = "8n";
//         if (currentTheme === "Classical") dur = "4n";
//         instrument.triggerAttackRelease(note || "C4", dur, now);
//       }
//       pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
//     } catch (err) {
//       console.warn("Error while triggering instrument:", err);
//       try {
//         pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
//       } catch (e) {}
//     }
//   }

//   // mark execution finished → schedule resume
//   setTimeout(() => {
//     isExecuting = false;
//     if (!bgActive) startBackgroundMusic();
//   }, 600);
// }

// export function playErrorSound(lineNumber) {
//   stopBackgroundMusic(); // stop bg music on error
//   isExecuting = false;  // ensure no resume
//   const now = Tone.now();
//   try {
//     errorSynth.triggerAttackRelease("C1", "2n", now);
//     errorSynth.triggerAttackRelease("F#1", "2n", now + 0.1);
//   } catch (e) {}
//   try {
//     pushTokenEventFromVisualizer({ type: "error", value: `Error at line ${lineNumber}`, theme: currentTheme });
//   } catch (e) {}
// }





// musicEngine.js
import * as Tone from "tone";
import { pushTokenEvent as pushTokenEventFromVisualizer } from "../components/Editor/VisualDisplay"; // connect to visualizer

// ---------- Instruments (shared) ----------
const synth = new Tone.Synth().toDestination();
const fmSynth = new Tone.FMSynth().toDestination();
const membrane = new Tone.MembraneSynth().toDestination();
const pluck = new Tone.PluckSynth().toDestination();
const noise = new Tone.NoiseSynth().toDestination();
const errorSynth = new Tone.FMSynth({
  modulationIndex: 30,
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 1 },
  modulation: { type: "square" },
}).toDestination();

// increased polyphony
const polySynth = new Tone.PolySynth(Tone.Synth, { maxPolyphony: 64 }).toDestination();
const bgSynth = new Tone.PolySynth(Tone.Synth, {
  maxPolyphony: 64,
  oscillator: { type: "sine" },
  envelope: { attack: 2, decay: 1, sustain: 0.7, release: 2 },
}).toDestination();
bgSynth.volume.value = -18;

// EDM FM synth
const edmfm = new Tone.FMSynth({
  harmonicity: 3,
  modulationIndex: 8,
  detune: -120,
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 },
}).toDestination();
edmfm.volume.value = -6;

// Current theme state
let currentTheme = "Lo-Fi";
export function setTheme(t) {
  currentTheme = t;
}
export function getTheme() {
  return currentTheme;
}

// Background loop holder
let bgLoop = null;
let bgActive = false;
let resumeTimeout = null;
let isExecuting = false;

// ---------- Ensure AudioContext is running ----------
export async function startAudio() {
  try {
    if (Tone.context.state !== "running") {
      await Tone.start();
      console.log("✅ Audio engine started (Tone.start())");
    }
    return Tone.context.state === "running";
  } catch (err) {
    console.warn("⚠️ Could not start AudioContext. Call startAudio() from a user gesture.", err);
    return false;
  }
}

// ---------- Background Music ----------
export async function startBackgroundMusic(theme) {
  const themeToUse = theme || currentTheme;
  setTheme(themeToUse);

  // ✅ Always ensure audio is unlocked
  const ok = await startAudio();
  if (!ok) {
    console.warn(`🔇 startBackgroundMusic: AudioContext not running (state=${Tone.context.state}).`);
    return false;
  }

  if (bgLoop) {
    try {
      bgLoop.stop();
    } catch (e) {}
    bgLoop = null;
  }

  if (themeToUse === "Lo-Fi") {
    startLoFiBGM();
  } else if (themeToUse === "EDM") {
    startEDMBGM();
  } else if (themeToUse === "Classical") {
    startClassicalBGM();
  }

  try {
    if (!Tone.Transport.state || Tone.Transport.state !== "started") {
      Tone.Transport.start();
    }
  } catch (e) {
    console.warn("Could not start Tone.Transport:", e);
  }

  bgActive = true;
  console.log("🎶 Background music started for theme:", themeToUse);
  return true;
}

export function stopBackgroundMusic() {
  if (bgLoop) {
    try {
      bgLoop.stop();
    } catch (e) {}
    bgLoop = null;
  }
  try {
    Tone.Transport.stop();
  } catch (e) {}
  bgActive = false;
  console.log("🛑 Background music stopped");
}

// ---------- Pause while executing ----------
function pauseBackgroundWhileCodeExec() {
  if (bgActive) {
    stopBackgroundMusic();
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (!isExecuting) startBackgroundMusic();
    }, 1000);
  }
}

/* ===== Theme-specific BGMs ===== */
function startLoFiBGM() {
  bgSynth.set({ oscillator: { type: "sine" } });
  const loFiChords = [
    ["C3", "G3", "E4"],
    ["A2", "E3", "C4"],
    ["F2", "C3", "A3"],
    ["G2", "D3", "B3"],
  ];
  bgLoop = new Tone.Loop((time) => {
    const chord = loFiChords[Math.floor(Math.random() * loFiChords.length)];
    bgSynth.triggerAttackRelease(chord, "2n", time);
    synth.triggerAttackRelease("G4", "4n", time + 0.1, 0.2);
  }, "2n").start(0);
}

function startEDMBGM() {
  bgSynth.set({ oscillator: { type: "square" } });
  const edmArp = ["C4", "E4", "G4", "B3", "E4", "G4"];
  let i = 0;
  bgLoop = new Tone.Loop((time) => {
    const note = edmArp[i % edmArp.length];
    edmfm.triggerAttackRelease(note, "16n", time, 0.9);
    if (i % 8 === 0) {
      bgSynth.triggerAttackRelease(["C3", "G3", "E4"], "8n", time);
    }
    i++;
  }, "8n").start(0);
}

function startClassicalBGM() {
  bgSynth.set({
    oscillator: { type: "triangle" },
    envelope: { attack: 1.5, decay: 0.8, sustain: 0.7, release: 3 },
  });
  const progressions = [
    ["C4", "E4", "G4"],
    ["F3", "A3", "C4"],
    ["G3", "B3", "D4"],
    ["E3", "G3", "B3"],
  ];
  let idx = 0;
  bgLoop = new Tone.Loop((time) => {
    bgSynth.triggerAttackRelease(progressions[idx % progressions.length], "1m", time);
    idx++;
  }, "1m").start(0);
}

/* ===== Token → Sound Mappings ===== */
const THEME_MAPPINGS = {
  "Lo-Fi": {
    keyword: { instrument: synth, note: "C4" },
    identifier: { instrument: pluck, note: "E4" },
    string: { instrument: pluck, note: "A3" },
    number: { instrument: membrane, note: "C2" },
    operator: { instrument: noise, note: null },
    comment: { instrument: synth, note: "G3" },
    punctuation: { instrument: pluck, note: "D4" },
    default: { instrument: synth, note: "B3" },
  },
  EDM: {
    keyword: { instrument: edmfm, note: "C5" },
    identifier: { instrument: fmSynth, note: "G4" },
    string: { instrument: pluck, note: "E4" },
    number: { instrument: membrane, note: "C3" },
    operator: { instrument: noise, note: null },
    comment: { instrument: synth, note: "B3" },
    punctuation: { instrument: edmfm, note: "D4" },
    default: { instrument: fmSynth, note: "A4" },
  },
  Classical: {
    keyword: { instrument: polySynth, note: "E4" },
    identifier: { instrument: synth, note: "G4" },
    string: { instrument: pluck, note: "C4" },
    number: { instrument: membrane, note: "C2" },
    operator: { instrument: pluck, note: "D4" },
    comment: { instrument: synth, note: "A3" },
    punctuation: { instrument: pluck, note: "B3" },
    default: { instrument: synth, note: "D4" },
  },
};

const controlFlowChords = {
  if: ["C4", "E4", "G4"],
  else: ["A3", "C4", "E4"],
  for: ["D4", "F4", "A4"],
  while: ["E3", "G3", "B3"],
  switch: ["G3", "B3", "D4"],
};
const functionChords = {
  function: ["C5", "E5", "G5", "B5"],
  def: ["C5", "D5", "F5", "A5"],
  void: ["C4", "G4", "E5"],
};
const resolveChords = {
  return: ["F3", "A3", "C4"],
  break: ["G2", "B2", "D3"],
};

function playChord(chordNotes, timeOffset = 0) {
  const now = Tone.now() + timeOffset;
  polySynth.triggerAttackRelease(chordNotes, "2n", now);
}

export async function playTokenSound(token, timeOffset = 0) {
  // ✅ Ensure audio is running before any sound
  const ok = await startAudio();
  if (!ok) {
    console.warn("🔇 playTokenSound called while AudioContext not running.");
    try {
      pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
    } catch (e) {}
    return;
  }

  isExecuting = true;
  pauseBackgroundWhileCodeExec();

  const valueLower = (token.value || "").toLowerCase();

  if (controlFlowChords[valueLower]) {
    playChord(controlFlowChords[valueLower], timeOffset);
    pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
  } else if (functionChords[valueLower]) {
    functionChords[valueLower].forEach((note, i) => {
      const now = Tone.now() + timeOffset + i * 0.12;
      synth.triggerAttackRelease(note, "8n", now);
    });
    pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
  } else if (resolveChords[valueLower]) {
    playChord(resolveChords[valueLower], timeOffset);
    pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
  } else {
    const mapping =
      (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme][token.type]) ||
      (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme].default) ||
      THEME_MAPPINGS["Lo-Fi"].default;
    const { instrument, note } = mapping;
    const now = Tone.now() + timeOffset;

    try {
      if (instrument instanceof Tone.NoiseSynth) {
        instrument.triggerAttackRelease("8n", now);
      } else if (instrument instanceof Tone.PolySynth) {
        instrument.triggerAttackRelease(note ? [note] : ["C4"], "8n", now);
      } else {
        let dur = "8n";
        if (currentTheme === "EDM") dur = "16n";
        if (currentTheme === "Lo-Fi") dur = "8n";
        if (currentTheme === "Classical") dur = "4n";
        instrument.triggerAttackRelease(note || "C4", dur, now);
      }
      pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
    } catch (err) {
      console.warn("Error while triggering instrument:", err);
      try {
        pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
      } catch (e) {}
    }
  }

  setTimeout(() => {
    isExecuting = false;
    if (!bgActive) startBackgroundMusic();
  }, 600);
}

export function playErrorSound(lineNumber) {
  stopBackgroundMusic();
  isExecuting = false;
  const now = Tone.now();
  try {
    errorSynth.triggerAttackRelease("C1", "2n", now);
    errorSynth.triggerAttackRelease("F#1", "2n", now + 0.1);
  } catch (e) {}
  try {
    pushTokenEventFromVisualizer({ type: "error", value: `Error at line ${lineNumber}`, theme: currentTheme });
  } catch (e) {}
}
