import React from "react";
import { FaPlayCircle, FaMusic, FaCode, FaYoutube } from "react-icons/fa";
import Navbar from "./Navbar";

const About = () => {
  return (
    <>
    <Navbar />
    <div className="p-6 md:p-10 bg-base-200 min-h-screen">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-primary">
        🎶 About Code2Music Project
      </h1>

      {/* Intro */}
      <p className="text-base md:text-lg leading-relaxed text-center max-w-3xl mx-auto mb-8">
        This project transforms your source code into <b>musical notes</b> 🎵.  
        As you write and execute programs, each <b>token</b> (like keywords, 
        identifiers, operators) is mapped to different <b>instruments and sounds</b>, 
        creating a unique melody while your code runs.  
        You can also run the code in real-time, see 
        output, and even detect errors with live feedback.
      </p>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="card bg-base-100 shadow-xl p-6">
          <FaCode className="text-4xl text-primary mb-3" />
          <h2 className="font-semibold text-lg mb-2">Step 1: Write / Upload Code</h2>
          <p className="text-sm leading-relaxed">
            Write your program directly in the built-in editor or upload your file. 
            Supports multiple languages like <b>C, C++, Java, Python, JS</b>, etc. And choose different theme according to your mind <b>Lo-Fi,EDM & Classical</b>
          </p>
        </div>
        <div className="card bg-base-100 shadow-xl p-6">
          <FaPlayCircle className="text-4xl text-success mb-3" />
          <h2 className="font-semibold text-lg mb-2">Step 2: Run & Execute</h2>
          <p className="text-sm leading-relaxed">
            Click <b>Start</b> to execute the code. The system do compilation and execution.  
            Errors are highlighted inside the editor.
          </p>
        </div>
        <div className="card bg-base-100 shadow-xl p-6">
          <FaMusic className="text-4xl text-info mb-3" />
          <h2 className="font-semibold text-lg mb-2">Step 3: Listen to Your Code</h2>
          <p className="text-sm leading-relaxed">
            As the code runs, each <b>token</b> is converted into sound.  
            Keywords, functions, and loops map to different <b>instruments</b>, 
            generating real-time background music.
          </p>
        </div>
      </div>

      {/* Tutorial */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">📚 Tutorial</h2>
        <p className="mb-4 text-base">
          Want to learn how to use this project? Watch the step-by-step tutorial video below:
        </p>
        <a
          href="https://drive.google.com/file/d/1DOSD0hSZbblTJuZ4RsLGY9BxCREwvIB8/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-primary gap-2"
        >
          <FaYoutube className="text-xl" />
          Watch Tutorial Video
        </a>
      </div>
    </div>
    </>
  );
};

export default About;
