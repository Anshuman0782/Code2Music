import React, { useState, useRef } from "react";
import CodeEditor from "../Editor/CodeEditor";
import VisualDisplay from "../Editor/VisualDisplay";
import Navbar from "../Layout/Navbar";
import * as Tone from "tone";

const Home = () => {
  const [code, setCode] = useState();
  const visualRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const handleStartRecording = async () => {
    await Tone.start();

    // 🎥 Capture visual (needs <canvas> or video-friendly element)
    const visualEl = visualRef.current;
    const canvas = visualEl.querySelector("canvas"); // if VisualDisplay uses canvas
    const videoStream = canvas.captureStream(30); // 30fps

    // 🎵 Capture audio from Tone.js
    const audioDest = Tone.context.createMediaStreamDestination();
    Tone.getDestination().connect(audioDest);

    // Merge video + audio
    const combinedStream = new MediaStream([
      ...videoStream.getTracks(),
      ...audioDest.stream.getTracks(),
    ]);

    // Setup MediaRecorder
    mediaRecorderRef.current = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9",
    });

    recordedChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "output.webm"; // browsers won’t export MP4 directly
      link.click();
    };

    mediaRecorderRef.current.start();
    console.log("🎬 Recording started...");
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log("🛑 Recording stopped...");
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen bg-base-100 flex flex-col">
        <section className="flex-1 p-5 md:p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            
            {/* Code Editor Card */}
            <div className="card shadow-lg bg-base-200 border border-base-300 rounded-2xl overflow-hidden flex flex-col">
              <div className="card-body p-3 md:p-5 flex flex-col h-full justify-center">
                <h2 className="card-title text-info text-lg mb-2">Code Editor</h2>
                <div className="flex-1 overflow-hidden mt-3">
                  <CodeEditor code={code} setCode={setCode} />
                </div>
              </div>
            </div>

            {/* Visual Display Card */}
            <div className="card shadow-lg bg-base-200 border border-base-300 rounded-2xl overflow-hidden flex flex-col">
              <div className="card-body p-3 md:p-5 flex flex-col h-full items-center justify-center">
                <h2 className="card-title text-info text-lg mb-2">Visual Output</h2>
                <div
                  className="flex-1 flex items-center justify-center w-full"
                  ref={visualRef}
                >
                  <VisualDisplay />
                </div>

                {/* 🎬 Recording buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    className="btn btn-outline btn-secondary"
                    onClick={handleStartRecording}
                  >
                    ⏺ Start Recording
                  </button>
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={handleStopRecording}
                  >
                    ⏹ Stop & Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
