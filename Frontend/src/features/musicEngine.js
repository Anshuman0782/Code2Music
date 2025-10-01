import * as Tone from "tone";
import { pushTokenEvent as pushTokenEventFromVisualizer } from "../components/Editor/VisualDisplay";

// ---------- Instruments ----------
const synth = new Tone.Synth().toDestination();
const fmSynth = new Tone.FMSynth().toDestination();
const membrane = new Tone.MembraneSynth().toDestination();
const pluck = new Tone.PluckSynth().toDestination();
const noise = new Tone.NoiseSynth().toDestination();
const errorSynth = new Tone.FMSynth({
  modulationIndex: 30,
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.6 },
  modulation: { type: "square" },
}).toDestination();

const polySynth = new Tone.PolySynth(Tone.Synth, {
  maxPolyphony: 16,
  volume: -8,
}).toDestination();

const bgSynth = new Tone.PolySynth(Tone.Synth, {
  maxPolyphony: 12,
  oscillator: { type: "triangle" },
  envelope: { attack: 1, decay: 0.6, sustain: 0.5, release: 1.5 },
}).toDestination();
bgSynth.volume.value = -12;

const edmfm = new Tone.FMSynth({
  harmonicity: 3,
  modulationIndex: 8,
  detune: -120,
  envelope: { attack: 0.01, decay: 0.15, sustain: 0.1, release: 0.2 },
}).toDestination();
edmfm.volume.value = -6;

// ---------- Theme State ----------
let currentTheme = "Lo-Fi"; // default
export function setTheme(t) { currentTheme = t; }
export function getTheme() { return currentTheme; }

// ---------- Background ----------
let bgLoop = null;
let bgActive = false;
let isExecuting = false;

/** Ensure AudioContext is started */
export async function startAudio() {
  try {
    if (Tone.context.state !== "running") await Tone.start();
    return Tone.context.state === "running";
  } catch (err) {
    console.warn("⚠️ Could not start AudioContext:", err);
    return false;
  }
}

export async function startBackgroundMusic() {
  // Always Classical background
  if (Tone.context.state !== "running") {
    console.warn("🔇 AudioContext not running");
    return false;
  }

  if (bgLoop) {
    bgLoop.stop();
    bgLoop = null;
  }

  startClassicalBGM();

  if (!Tone.Transport.state || Tone.Transport.state !== "started") {
    Tone.Transport.start();
  }

  bgActive = true;
  console.log("🎶 Background music started: Classical");
  return true;
}

export function stopBackgroundMusic() {
  if (bgLoop) { bgLoop.stop(); bgLoop = null; }
  try { Tone.Transport.stop(); } catch {}
  bgActive = false;
  console.log("🛑 Background music stopped");
}

// ---------- Execution Handling ----------
export function notifyExecutionStart() {
  if (bgActive) {
    isExecuting = true;
    stopBackgroundMusic();
  }
}

export function notifyExecutionEnd() {
  if (isExecuting) {
    isExecuting = false;
    startBackgroundMusic(); // always Classical
  }
}

// ---------- Classical BGM Only ----------
function startClassicalBGM() {
  const progressions = [
    ["C4", "E4", "G4"],
    ["F3", "A3", "C4"],
    ["G3", "B3", "D4"],
    ["E3", "G3", "B3"],
  ];
  let idx = 0;
  bgLoop = new Tone.Loop((time) => {
    bgSynth.triggerAttackRelease(progressions[idx % progressions.length], "2n", time);
    idx++;
  }, "2n").start(0);
}

// ---------- Token Sound Mapping ----------
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
  function: ["C5", "E5", "G5"],
  def: ["C5", "D5", "F5"],
  void: ["C4", "G4", "E5"],
};
const resolveChords = {
  return: ["F3", "A3", "C4"],
  break: ["G2", "B2", "D3"],
};

function playChord(chordNotes, timeOffset = 0) {
  const now = Tone.now() + timeOffset;
  polySynth.triggerAttackRelease(chordNotes, "4n", now);
}

// ---------- Play Token Sounds ----------
export function playTokenSound(token, timeOffset = 0) {
  if (Tone.context.state !== "running") return;

  const valueLower = (token.value || "").toLowerCase();
  if (controlFlowChords[valueLower]) {
    playChord(controlFlowChords[valueLower], timeOffset);
  } else if (functionChords[valueLower]) {
    functionChords[valueLower].forEach((note, i) => {
      synth.triggerAttackRelease(note, "16n", Tone.now() + timeOffset + i * 0.1);
    });
  } else if (resolveChords[valueLower]) {
    playChord(resolveChords[valueLower], timeOffset);
  } else {
    const mapping =
      (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme][token.type]) ||
      (THEME_MAPPINGS[currentTheme] && THEME_MAPPINGS[currentTheme].default) ||
      THEME_MAPPINGS["Lo-Fi"].default;

    const { instrument, note } = mapping;
    const now = Tone.now() + timeOffset;
    if (instrument instanceof Tone.NoiseSynth) {
      instrument.triggerAttackRelease("16n", now);
    } else {
      instrument.triggerAttackRelease(note || "C4", "16n", now);
    }
  }

  pushTokenEventFromVisualizer({ ...token, theme: currentTheme });
}

export function playErrorSound(lineNumber) {
  const now = Tone.now();
  errorSynth.triggerAttackRelease("C1", "8n", now);
  errorSynth.triggerAttackRelease("F#1", "8n", now + 0.1);

  pushTokenEventFromVisualizer({
    type: "error",
    value: `Error at line ${lineNumber}`,
    theme: currentTheme,
  });
}


