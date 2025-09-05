

// import * as Tone from "tone";
// import { pushTokenEvent } from "../components/Editor/VisualDisplay"; // connect to visualizer

// // 🎹 Instruments setup
// const synth = new Tone.Synth().toDestination();
// const fmSynth = new Tone.FMSynth().toDestination();
// const membrane = new Tone.MembraneSynth().toDestination();
// const pluck = new Tone.PluckSynth().toDestination();
// const noise = new Tone.NoiseSynth().toDestination();

// // Error alert synth
// const errorSynth = new Tone.FMSynth({
//   modulationIndex: 30,
//   envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 1 },
//   modulation: { type: "square" },
// }).toDestination();

// // Extra: PolySynth for chords
// const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();

// // === BACKGROUND MUSIC SETUP ===

// // Ambient poly synth for BGM
// const bgSynth = new Tone.PolySynth(Tone.Synth, {
//   oscillator: { type: "sine" },
//   envelope: { attack: 2, decay: 1, sustain: 0.7, release: 5 },
// }).toDestination();

// // Background volume lower
// bgSynth.volume.value = -18;

// // World-inspired scales
// const scales = {
//   japanese: ["C4", "D#4", "F4", "G4", "A#4", "C5"],
//   arabic: ["C4", "Db4", "E4", "F4", "G4", "Ab4", "B4"],
//   indian: ["C4", "D4", "E4", "G4", "A4", "C5"],
//   western: ["C4", "E4", "G4", "B4", "D5"],
// };

// let bgLoop = null;

// /**
//  * Start soft background music
//  */
// export function startBackgroundMusic() {
//   if (bgLoop) return; // already running

//   const scaleKeys = Object.keys(scales);
//   let currentScale = "japanese"; // start with Japanese pentatonic

//   bgLoop = new Tone.Loop((time) => {
//     const scale = scales[currentScale];

//     // pick 3 random notes → chord
//     const chord = [];
//     for (let i = 0; i < 3; i++) {
//       chord.push(scale[Math.floor(Math.random() * scale.length)]);
//     }

//     bgSynth.triggerAttackRelease(chord, "2n", time);

//     // randomly change scale → international creativity 🌍
//     if (Math.random() < 0.2) {
//       currentScale = scaleKeys[Math.floor(Math.random() * scaleKeys.length)];
//       console.log("🌍 Background scale switched to:", currentScale);
//     }
//   }, "4n").start(0);

//   Tone.Transport.start();
//   console.log("🎶 Background music started...");
// }

// /**
//  * Stop background music
//  */
// export function stopBackgroundMusic() {
//   if (bgLoop) {
//     bgLoop.stop();
//     bgLoop = null;
//     console.log("🛑 Background music stopped");
//   }
// }

// // === TOKEN → MUSIC MAPPING ===

// const tokenToMusic = {
//   keyword: { instrument: synth, note: "C4" },
//   identifier: { instrument: fmSynth, note: "E4" },
//   string: { instrument: pluck, note: "A3" },
//   number: { instrument: membrane, note: "C2" },
//   operator: { instrument: noise, note: null },
//   comment: { instrument: synth, note: "G3" },
//   punctuation: { instrument: pluck, note: "D4" },
//   default: { instrument: synth, note: "B3" },
// };

// // Special chords
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

// // 🎵 Play chord
// function playChord(chordNotes, timeOffset = 0) {
//   const now = Tone.now() + timeOffset;
//   polySynth.triggerAttackRelease(chordNotes, "2n", now);
// }

// /**
//  * Play token sound
//  */
// export function playTokenSound(token, timeOffset = 0) {
//   const valueLower = token.value.toLowerCase();

//   if (controlFlowChords[valueLower]) {
//     playChord(controlFlowChords[valueLower], timeOffset);
//     pushTokenEvent(token);
//     return;
//   }

//   if (functionChords[valueLower]) {
//     functionChords[valueLower].forEach((note, i) => {
//       const now = Tone.now() + timeOffset + i * 0.15;
//       synth.triggerAttackRelease(note, "8n", now);
//     });
//     pushTokenEvent(token);
//     return;
//   }

//   if (resolveChords[valueLower]) {
//     playChord(resolveChords[valueLower], timeOffset);
//     pushTokenEvent(token);
//     return;
//   }

//   const mapping = tokenToMusic[token.type] || tokenToMusic.default;
//   const { instrument, note } = mapping;
//   const now = Tone.now() + timeOffset;

//   if (instrument instanceof Tone.NoiseSynth) {
//     instrument.triggerAttackRelease("8n", now);
//   } else {
//     instrument.triggerAttackRelease(note, "8n", now);
//   }
//   pushTokenEvent(token);
// }

// /**
//  * Error sound + push event
//  */
// export function playErrorSound(lineNumber) {
//   stopBackgroundMusic(); // stop bg music when error occurs
//   const now = Tone.now();
//   errorSynth.triggerAttackRelease("C1", "2n", now);
//   errorSynth.triggerAttackRelease("F#1", "2n", now + 0.1);
//   pushTokenEvent({ type: "error", value: `Error at line ${lineNumber}` });
// }

// /**
//  * Start/resume audio context
//  */
// export async function startAudio() {
//   await Tone.start();
//   console.log("✅ Audio engine started");
// }




// working----->



// import * as Tone from "tone";
// import { pushTokenEvent } from "../components/Editor/VisualDisplay"; // connect to visualizer

// // ======= GLOBAL THEME STATE =======
// let currentTheme = "lofi";
// export const setTheme = (t) => { currentTheme = (t || "").toLowerCase(); };
// export const getTheme = () => currentTheme;

// // ======= CORE INSTRUMENTS =======
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
// const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();

// // ======= THEME-SPECIFIC NODES =======
// // Lofi: gentle filter + reverb + vinyl hiss
// const lofiFilter = new Tone.Filter(900, "lowpass").toDestination();
// const lofiVerb = new Tone.Reverb({ decay: 3, wet: 0.3 }).connect(lofiFilter);
// const lofiBus = new Tone.Gain(0.7).connect(lofiVerb);
// const vinyl = new Tone.Noise("pink").start();
// const vinylAmp = new Tone.Gain(0.03).toDestination();
// vinyl.connect(vinylAmp);

// // EDM: sidechain-like tremolo, punchy kick
// const edmBus = new Tone.Gain(0.8).toDestination();
// const sidechain = new Tone.Tremolo({ frequency: 4, depth: 0.6 }).start().connect(edmBus);
// const kick = new Tone.MembraneSynth({ octaves: 3, pitchDecay: 0.02 }).connect(edmBus);

// // Classical: soft strings pad + hall reverb
// const hall = new Tone.Reverb({ decay: 6, wet: 0.35 }).toDestination();
// const strings = new Tone.PolySynth(Tone.AMSynth).connect(hall);

// // ======= BACKGROUND MUSIC =======
// const scales = {
//   lofi:      ["C4", "D#4", "G4", "A#4", "C5"],                 // minor pentatonic-ish
//   edm:       ["C4", "D4", "E4", "G4", "A4", "B4", "C5"],        // bright major
//   classical: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],  // full diatonic
// };

// let bgLoop = null;
// let kickLoop = null;

// export function startBackgroundMusic(themeArg) {
//   const theme = (themeArg || currentTheme || "lofi").toLowerCase();

//   // prevent duplicate loops
//   stopBackgroundMusic();

//   const scale = scales[theme] || scales.lofi;

//   if (theme === "lofi") {
//     const loChords = [
//       ["C4", "E4", "A4"], ["D4", "G4", "A#4"], ["F4", "A4", "C5"], ["G4", "A#4", "D5"],
//     ];
//     bgLoop = new Tone.Loop((time) => {
//       const chord = loChords[Math.floor(Math.random() * loChords.length)];
//       // send to lofi bus
//       const temp = new Tone.PolySynth(Tone.Synth).connect(lofiBus);
//       temp.set({ oscillator: { type: "sine" }, envelope: { attack: 0.8, release: 2 } });
//       temp.triggerAttackRelease(chord, "2n", time);
//       setTimeout(() => temp.dispose(), 5000);
//     }, "2n").start(0);
//   }

//   if (theme === "edm") {
//     // simple chord stab + kick on quarter notes
//     const edmChords = [
//       ["C4", "E4", "G4"], ["F4", "A4", "C5"], ["G4", "B4", "D5"], ["A4", "C5", "E5"],
//     ];
//     bgLoop = new Tone.Loop((time) => {
//       const chord = edmChords[Math.floor(Math.random() * edmChords.length)];
//       const temp = new Tone.PolySynth(Tone.Synth).connect(sidechain);
//       temp.set({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.03, release: 0.4 } });
//       temp.triggerAttackRelease(chord, "8n", time);
//       setTimeout(() => temp.dispose(), 3000);
//     }, "2n").start(0);

//     kickLoop = new Tone.Loop((time) => {
//       kick.triggerAttackRelease("C1", "16n", time);
//     }, "4n").start(0);
//   }

//   if (theme === "classical") {
//     const degrees = [0, 2, 4, 5, 7, 9, 11]; // major degrees
//     bgLoop = new Tone.Loop((time) => {
//       const root = 60 + degrees[Math.floor(Math.random() * degrees.length)]; // MIDI-ish
//       const chord = [root, root + 4, root + 7].map(m => Tone.Frequency(m, "midi").toNote());
//       strings.triggerAttackRelease(chord, "2n", time);
//     }, "2n").start(0);
//   }

//   if (Tone.Transport.state !== "started") Tone.Transport.start();
//   console.log("🎶 Background music started with theme:", theme);
// }

// export function stopBackgroundMusic() {
//   if (bgLoop) { bgLoop.stop(); bgLoop.dispose(); bgLoop = null; }
//   if (kickLoop) { kickLoop.stop(); kickLoop.dispose(); kickLoop = null; }
//   console.log("🛑 Background music stopped");
// }

// // ======= TOKEN → MUSIC (Theme-aware) =======

// const baseTokenMap = {
//   keyword:    { instrument: synth,   note: "C4" },
//   identifier: { instrument: fmSynth, note: "E4" },
//   string:     { instrument: pluck,   note: "A3" },
//   number:     { instrument: membrane,note: "C2" },
//   operator:   { instrument: noise,   note: null },
//   comment:    { instrument: synth,   note: "G3" },
//   punctuation:{ instrument: pluck,   note: "D4" },
//   default:    { instrument: synth,   note: "B3" },
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

// function themeNoteTransform(note) {
//   // remap note into theme's scale/character
//   const theme = currentTheme || "lofi";
//   const scale = scales[theme] || scales.lofi;
//   if (!note) return null;
//   // snap to nearest scale degree around same register
//   const freq = Tone.Frequency(note).toFrequency();
//   const target = scale
//     .map(n => ({ n, f: Tone.Frequency(n).toFrequency() }))
//     .reduce((best, cur) => (Math.abs(cur.f - freq) < Math.abs(best.f - freq) ? cur : best));
//   return target.n;
// }

// function playChord(chordNotes, timeOffset = 0) {
//   const now = Tone.now() + timeOffset;
//   const theme = currentTheme || "lofi";
//   const transformed = chordNotes.map(themeNoteTransform);

//   if (theme === "lofi") {
//     const lo = new Tone.PolySynth(Tone.Synth).connect(lofiBus);
//     lo.set({ oscillator: { type: "triangle" }, envelope: { attack: 0.2, release: 1.5 } });
//     lo.triggerAttackRelease(transformed, "4n", now);
//     setTimeout(() => lo.dispose(), 3000);
//     return;
//   }
//   if (theme === "edm") {
//     const ed = new Tone.PolySynth(Tone.Synth).connect(sidechain);
//     ed.set({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, release: 0.3 } });
//     ed.triggerAttackRelease(transformed, "8n", now);
//     setTimeout(() => ed.dispose(), 2000);
//     return;
//   }
//   // classical
//   strings.triggerAttackRelease(transformed, "4n", now);
// }

// /**
//  * Play token sound (theme-aware)
//  */
// export function playTokenSound(token, timeOffset = 0) {
//   const valueLower = (token.value || "").toLowerCase();

//   if (controlFlowChords[valueLower]) {
//     playChord(controlFlowChords[valueLower], timeOffset);
//     pushTokenEvent(token);
//     return;
//   }
//   if (functionChords[valueLower]) {
//     functionChords[valueLower].forEach((note, i) => {
//       const now = Tone.now() + timeOffset + i * 0.12;
//       const themed = themeNoteTransform(note);
//       const theme = currentTheme || "lofi";

//       if (theme === "edm") {
//         const lead = new Tone.Synth({
//           oscillator: { type: "sawtooth" },
//           envelope: { attack: 0.005, release: 0.2 },
//         }).connect(sidechain);
//         lead.triggerAttackRelease(themed, "16n", now);
//         setTimeout(() => lead.dispose(), 1500);
//       } else if (theme === "classical") {
//         strings.triggerAttackRelease([themed], "8n", now);
//       } else {
//         const bell = new Tone.Synth({
//           oscillator: { type: "sine" },
//           envelope: { attack: 0.01, release: 0.6 },
//         }).connect(lofiBus);
//         bell.triggerAttackRelease(themed, "8n", now);
//         setTimeout(() => bell.dispose(), 2000);
//       }
//     });
//     pushTokenEvent(token);
//     return;
//   }
//   if (resolveChords[valueLower]) {
//     playChord(resolveChords[valueLower], timeOffset);
//     pushTokenEvent(token);
//     return;
//   }

//   // default mapping
//   const mapping = baseTokenMap[token.type] || baseTokenMap.default;
//   const now = Tone.now() + timeOffset;

//   if (mapping.instrument instanceof Tone.NoiseSynth) {
//     mapping.instrument.triggerAttackRelease("8n", now);
//   } else {
//     const themedNote = themeNoteTransform(mapping.note);
//     mapping.instrument.triggerAttackRelease(themedNote, "8n", now);
//   }

//   pushTokenEvent(token);
// }

// // ======= ERRORS =======
// export function playErrorSound(lineNumber) {
//   const prevState = Tone.Transport.state;
//   // brief duck / pause
//   Tone.Transport.pause();
//   const now = Tone.now();
//   errorSynth.triggerAttackRelease("C1", "2n", now);
//   errorSynth.triggerAttackRelease("F#1", "2n", now + 0.1);
//   setTimeout(() => { if (prevState === "started") Tone.Transport.start(); }, 500);
//   pushTokenEvent({ type: "error", value: `Error at line ${lineNumber}` });
// }

// // ======= AUDIO START =======
// export async function startAudio() {
//   await Tone.start();
//   console.log("✅ Audio engine started");
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
const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
const bgSynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "sine" },
  envelope: { attack: 2, decay: 1, sustain: 0.7, release: 5 },
}).toDestination();
bgSynth.volume.value = -18;

// For EDM we use some FM + metallic sounds
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

/**
 * Ensure AudioContext is started (must be called from user gesture to actually unlock audio)
 * Returns true if audio context is running (or was already running), false otherwise.
 */
export async function startAudio() {
  try {
    // If Tone's context is not running, attempt to start. This must be invoked from a user gesture to succeed.
    const state = Tone.context.state;
    if (state === "running") {
      console.log("✅ Audio already running");
      return true;
    }
    if (state === "suspended") {
      // Attempt to start (may fail if not a user gesture). Caller should call this from a user gesture (e.g., button click).
      await Tone.start();
      console.log("✅ Audio engine started (Tone.start())");
      return Tone.context.state === "running";
    }
    // other states: "closed" etc. Try to resume via Tone.start() as a best effort
    await Tone.start();
    return Tone.context.state === "running";
  } catch (err) {
    // Likely this was called outside a user gesture; log clearly and return false.
    console.warn(
      "⚠️ Could not start AudioContext. Call startAudio() from a user gesture (e.g., inside the Start button handler).",
      err
    );
    return false;
  }
}

/**
 * Start background music for a given theme (optional param).
 * Calling with no param uses currentTheme.
 */
export async function startBackgroundMusic(theme) {
  const themeToUse = theme || currentTheme;
  setTheme(themeToUse);

  // If audio isn't unlocked, do not try to start Transport (avoids suspended error).
  if (Tone.context.state !== "running") {
    console.warn(
      `🔇 startBackgroundMusic: AudioContext not running (state=${Tone.context.state}). Call startAudio() from a user gesture first.`
    );
    return false;
  }

  // If there's an existing loop, stop it first
  if (bgLoop) {
    try {
      bgLoop.stop();
    } catch (e) {
      /* ignore */
    }
    bgLoop = null;
  }

  if (themeToUse === "Lo-Fi") {
    startLoFiBGM();
  } else if (themeToUse === "EDM") {
    startEDMBGM();
  } else if (themeToUse === "Classical") {
    startClassicalBGM();
  }

  // Start Tone.Transport only if not already started
  try {
    if (!Tone.Transport.state || Tone.Transport.state !== "started") {
      Tone.Transport.start();
    }
  } catch (e) {
    console.warn("Could not start Tone.Transport:", e);
  }

  console.log("🎶 Background music started for theme:", themeToUse);
  return true;
}

export function stopBackgroundMusic() {
  if (bgLoop) {
    try {
      bgLoop.stop();
    } catch (e) {
      /* ignore */
    }
    bgLoop = null;
  }
  try {
    Tone.Transport.stop();
  } catch (e) {
    // ignore
  }
  console.log("🛑 Background music stopped");
}

/* ===== Theme-specific BGMs ===== */

function startLoFiBGM() {
  // mellow vinyl-like loop: slow chords + gentle noise crackle
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
    // subtle warm tone on top (low velocity)
    synth.triggerAttackRelease("G4", "4n", time + 0.1, 0.2);
  }, "2n").start(0);
}

function startEDMBGM() {
  // driving arpeggio + FM stab
  bgSynth.set({ oscillator: { type: "square" } });
  const edmArp = ["C4", "E4", "G4", "B3", "E4", "G4"];
  let i = 0;
  bgLoop = new Tone.Loop((time) => {
    // arpeggio
    const note = edmArp[i % edmArp.length];
    edmfm.triggerAttackRelease(note, "16n", time, 0.9);
    if (i % 8 === 0) {
      // occasional chord stab
      bgSynth.triggerAttackRelease(["C3", "G3", "E4"], "8n", time);
    }
    i++;
  }, "8n").start(0);
}

function startClassicalBGM() {
  // slow voice-leading arpeggio using polySynth with softer envelope
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

/* ===== Token → Sound Mappings per theme ===== */

// For each theme we define a mapping: tokenType -> {instrument, note / behavior}
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

// Special chords (kept from your original logic; used across themes)
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

// Play chords helper
function playChord(chordNotes, timeOffset = 0) {
  const now = Tone.now() + timeOffset;
  polySynth.triggerAttackRelease(chordNotes, "2n", now);
}

/**
 * Play token sound — uses theme mapping and pushes token event with theme.
 * token is expected to be { type, value, ... }
 */
export function playTokenSound(token, timeOffset = 0) {
  // safety: don't try to trigger audio if context isn't running
  if (Tone.context.state !== "running") {
    // still push visual event so visualizer can show something
    try {
      pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
    } catch (e) {
      // swallow
    }
    console.warn("🔇 playTokenSound called while AudioContext is not running. Call startAudio() from a user gesture.");
    return;
  }

  // if control flow / function / resolve tokens -> special chords
  const valueLower = (token.value || "").toLowerCase();

  if (controlFlowChords[valueLower]) {
    playChord(controlFlowChords[valueLower], timeOffset);
    pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
    return;
  }

  if (functionChords[valueLower]) {
    functionChords[valueLower].forEach((note, i) => {
      const now = Tone.now() + timeOffset + i * 0.12;
      synth.triggerAttackRelease(note, "8n", now);
    });
    pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
    return;
  }

  if (resolveChords[valueLower]) {
    playChord(resolveChords[valueLower], timeOffset);
    pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
    return;
  }

  // theme mapping
  const mapping =
    (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme][token.type]) ||
    (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme].default) ||
    THEME_MAPPINGS["Lo-Fi"].default;
  const { instrument, note } = mapping;
  const now = Tone.now() + timeOffset;

  try {
    // Behavior: EDM prefers short tight notes; Lo-Fi softer; Classical uses polySynth for warmth
    if (instrument instanceof Tone.NoiseSynth) {
      instrument.triggerAttackRelease("8n", now);
    } else if (instrument instanceof Tone.PolySynth) {
      instrument.triggerAttackRelease(note ? [note] : ["C4"], "8n", now);
    } else {
      // For EDM: slightly longer gain/velocity
      let dur = "8n";
      if (currentTheme === "EDM") dur = "16n";
      if (currentTheme === "Lo-Fi") dur = "8n";
      if (currentTheme === "Classical") dur = "4n";

      instrument.triggerAttackRelease(note || "C4", dur, now);
    }

    // push to visualizer with theme included
    pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
  } catch (err) {
    console.warn("Error while triggering instrument:", err);
    // still push visual event to avoid losing visuals
    try {
      pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
    } catch (e) {
      // swallow
    }
  }
}

/**
 * Play error sound + push event
 */
export function playErrorSound(lineNumber) {
  stopBackgroundMusic(); // stop bg music when error occurs
  const now = Tone.now();
  try {
    errorSynth.triggerAttackRelease("C1", "2n", now);
    errorSynth.triggerAttackRelease("F#1", "2n", now + 0.1);
  } catch (e) {
    // ignore playback errors
  }

  try {
    pushTokenEventFromVisualizer({ type: "error", value: `Error at line ${lineNumber}`, theme: currentTheme });
  } catch (e) {
    // ignore
  }
}
