
// import React, { useEffect, useRef } from "react";

// // This will hold incoming token events
// export const tokenQueue = [];

// export const pushTokenEvent = (token) => {
//   tokenQueue.push({
//     token,
//     timestamp: Date.now(),
//   });
// };

// const VisualDisplay = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const resizeCanvas = () => {
//       canvas.width = canvas.parentElement.offsetWidth;
//       canvas.height = canvas.parentElement.offsetHeight;
//     };
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // Visual objects for active token events
//     const activeCircles = [];

//     function draw() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // background gradient
//       const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//       gradient.addColorStop(0, "#06b6d4"); // cyan
//       gradient.addColorStop(1, "#3b82f6"); // blue
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       const now = Date.now();

//       // Add new circles from tokenQueue
//       while (tokenQueue.length > 0) {
//         const { token, timestamp } = tokenQueue.shift();
//         const radius = 20 + Math.random() * 20;
//         const color = getColorForToken(token.type);
//         activeCircles.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           radius,
//           color,
//           startTime: timestamp,
//           lifetime: 600, // ms
//         });
//       }

//       // Draw active circles
//       for (let i = activeCircles.length - 1; i >= 0; i--) {
//         const circle = activeCircles[i];
//         const age = now - circle.startTime;
//         if (age > circle.lifetime) {
//           activeCircles.splice(i, 1);
//           continue;
//         }

//         const alpha = 1 - age / circle.lifetime;
//         ctx.globalAlpha = alpha;
//         ctx.fillStyle = circle.color;
//         ctx.beginPath();
//         ctx.arc(circle.x, circle.y, circle.radius * (1 + age / circle.lifetime), 0, 2 * Math.PI);
//         ctx.shadowBlur = 20;
//         ctx.shadowColor = circle.color;
//         ctx.fill();
//         ctx.globalAlpha = 1;
//       }

//       requestAnimationFrame(draw);
//     }

//     draw();

//     return () => window.removeEventListener("resize", resizeCanvas);
//   }, []);

//   return (
//     <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh]">
//       <div className="card shadow-xl bg-base-200 border border-base-300 rounded-2xl h-full flex items-center justify-center">
//         <canvas ref={canvasRef} className="w-full h-full rounded-2xl" />
//       </div>
//     </div>
//   );
// };

// export default VisualDisplay;

// // Helper: assign colors based on token type
// function getColorForToken(type) {
//   switch (type) {
//     case "keyword": return "#f87171";
//     case "identifier": return "#34d399";
//     case "string": return "#fbbf24";
//     case "number": return "#60a5fa";
//     case "operator": return "#a78bfa";
//     case "comment": return "#9ca3af";
//     case "punctuation": return "#f472b6";
//     case "error": return "#ff0000"; // 🚨 ERROR = Red pulse
//     default: return "#ffffff";
//   }
// }



//------------------------------------------------------------



// import React, { useEffect, useRef, useState } from "react";

// // This will hold incoming token events
// export const tokenQueue = [];

// export const pushTokenEvent = (token) => {
//   tokenQueue.push({
//     token,
//     timestamp: Date.now(),
//   });
// };

// const VisualDisplay = () => {
//   const canvasRef = useRef(null);
//   const [hasActivity, setHasActivity] = useState(false);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const resizeCanvas = () => {
//       canvas.width = canvas.parentElement.offsetWidth;
//       canvas.height = canvas.parentElement.offsetHeight;
//     };
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // Visual objects for active token events
//     const activeCircles = [];

//     function draw() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // animated background gradient
//       const time = Date.now() * 0.0003;
//       const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//       gradient.addColorStop(0, `hsl(${200 + Math.sin(time) * 40}, 80%, 55%)`);
//       gradient.addColorStop(1, `hsl(${260 + Math.cos(time) * 40}, 80%, 55%)`);
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       const now = Date.now();

//       // Add new circles from tokenQueue
//       while (tokenQueue.length > 0) {
//         const { token, timestamp } = tokenQueue.shift();
//         const radius = 20 + Math.random() * 25;
//         const color = getColorForToken(token.type);
//         activeCircles.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           radius,
//           color,
//           startTime: timestamp,
//           lifetime: 1000, // ms
//         });
//         setHasActivity(true); // Mark as active
//       }

//       // Draw active circles
//       for (let i = activeCircles.length - 1; i >= 0; i--) {
//         const circle = activeCircles[i];
//         const age = now - circle.startTime;
//         if (age > circle.lifetime) {
//           activeCircles.splice(i, 1);
//           continue;
//         }

//         const progress = age / circle.lifetime;
//         const alpha = 1 - progress;

//         ctx.globalAlpha = alpha * 0.9;
//         ctx.fillStyle = circle.color;
//         ctx.beginPath();
//         ctx.arc(
//           circle.x,
//           circle.y,
//           circle.radius * (1 + progress * 1.5),
//           0,
//           2 * Math.PI
//         );

//         // glowing pulse
//         ctx.shadowBlur = 30 + progress * 20;
//         ctx.shadowColor = circle.color;
//         ctx.fill();
//         ctx.globalAlpha = 1;

//         // small trailing particles
//         ctx.beginPath();
//         ctx.arc(
//           circle.x + Math.sin(age * 0.01) * 10,
//           circle.y + Math.cos(age * 0.01) * 10,
//           3,
//           0,
//           2 * Math.PI
//         );
//         ctx.fillStyle = circle.color;
//         ctx.fill();
//       }

//       requestAnimationFrame(draw);
//     }

//     draw();

//     return () => window.removeEventListener("resize", resizeCanvas);
//   }, []);

//   return (
//     <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] relative">
//       <div className="card shadow-xl bg-base-200 border border-base-300 rounded-2xl h-full flex items-center justify-center overflow-hidden">
//         <canvas ref={canvasRef} className="w-full h-full rounded-2xl" />
//         {!hasActivity && (
//           <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-medium pointer-events-none">
//             ✨ Run your code to see the magic ✨
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VisualDisplay;

// // Helper: assign colors based on token type
// function getColorForToken(type) {
//   switch (type) {
//     case "keyword": return "#f87171";
//     case "identifier": return "#34d399";
//     case "string": return "#fbbf24";
//     case "number": return "#60a5fa";
//     case "operator": return "#a78bfa";
//     case "comment": return "#9ca3af";
//     case "punctuation": return "#f472b6";
//     case "error": return "#ff0000"; // 🚨 ERROR = Red pulse
//     default: return "#ffffff";
//   }
// }

import React, { useEffect, useRef, useState } from "react";

// This will hold incoming token events (pushed by musicEngine)
export const tokenQueue = [];

export const pushTokenEvent = (token) => {
  // accept token objects: { type, value, theme, ... }
  tokenQueue.push({
    token,
    timestamp: Date.now(),
  });
};

const VisualDisplay = () => {
  const canvasRef = useRef(null);
  const [hasActivity, setHasActivity] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const activeShapes = []; // generic shape store (varies by theme)

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now() * 0.001;

      // Base background - animated and theme-aware
      drawBackground(ctx, canvas.width, canvas.height, now);

      // Add new shapes from tokenQueue
      while (tokenQueue.length > 0) {
        const { token, timestamp } = tokenQueue.shift();
        const theme = token.theme || "Lo-Fi";
        const shape = createShapeForToken(token, timestamp, canvas.width, canvas.height, theme);
        activeShapes.push(shape);
        setHasActivity(true);
      }

      // update & draw shapes (iterate backwards to allow removal)
      for (let i = activeShapes.length - 1; i >= 0; i--) {
        const s = activeShapes[i];
        const age = Date.now() - s.startTime;
        if (age > s.lifetime) {
          activeShapes.splice(i, 1);
          continue;
        }
        // draw by shape.type
        drawShape(ctx, s, age / s.lifetime);
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => window.removeEventListener("resize", resizeCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] relative">
      <div className="card shadow-xl bg-base-200 border border-base-300 rounded-2xl h-full flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full rounded-2xl" />
        {!hasActivity && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-medium pointer-events-none">
            ✨ Run your code to see the magic ✨
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualDisplay;

/* ---------- Helpers for visuals ---------- */

function drawBackground(ctx, w, h, t) {
  // Theme-aware animated background
  // We choose different gradient / speed for each theme depending on last seen tokens.
  // For simplicity we sample a "recent theme" from upcoming tokens if any, else default to Lo-Fi
  const theme = peekNextTheme() || "Lo-Fi";

  if (theme === "Lo-Fi") {
    // soft warm gradient with slow pulsation
    const g = ctx.createLinearGradient(0, 0, w, h);
    const v = 200 + Math.sin(t * 0.2) * 30;
    g.addColorStop(0, `hsl(${v}, 55%, 55%)`);
    g.addColorStop(1, `hsl(${v + 50}, 60%, 42%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // subtle vignette
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  } else if (theme === "EDM") {
    // high-contrast neon moving gradient
    const g = ctx.createLinearGradient(0, 0, w, h);
    const a = (Math.sin(t * 2.5) + 1) * 0.5;
    g.addColorStop(0, `hsl(${290 + a * 40}, 90%, 48%)`);
    g.addColorStop(1, `hsl(${200 + a * 60}, 90%, 48%)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // subtle grid lines for EDM energy
    ctx.globalAlpha = 0.06;
    for (let x = 0; x < w; x += 40) {
      ctx.fillRect(x, 0, 1, h);
    }
    ctx.globalAlpha = 1;
  } else {
    // Classical: soft parchment-like linear gradient
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#f8f4e6");
    g.addColorStop(1, "#efe8d6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // faint musical staff lines
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = "#bba";
    for (let y = h * 0.2; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}

function peekNextTheme() {
  // look briefly into queue to find a recent theme (non-destructive)
  for (let i = 0; i < Math.min(8, tokenQueue.length); i++) {
    if (tokenQueue[i] && tokenQueue[i].token && tokenQueue[i].token.theme) return tokenQueue[i].token.theme;
  }
  return null;
}

function createShapeForToken(token, timestamp, w, h, theme) {
  // shape definitions differ per theme
  const base = {
    token,
    startTime: timestamp,
    lifetime: 1000 + Math.random() * 900, // ms
  };

  if (theme === "Lo-Fi") {
    return {
      ...base,
      type: "softCircle",
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 12 + Math.random() * 36,
      color: getColorForToken(theme, token.type),
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    };
  } else if (theme === "EDM") {
    return {
      ...base,
      type: "neonLine",
      x: Math.random() * w,
      y: Math.random() * h,
      len: 40 + Math.random() * 160,
      angle: Math.random() * Math.PI * 2,
      color: getColorForToken(theme, token.type),
      speed: 0.6 + Math.random() * 1.2,
    };
  } else {
    // Classical: floating note-like shapes
    return {
      ...base,
      type: "musicalNote",
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 8 + Math.random() * 18,
      color: getColorForToken(theme, token.type),
      floatSpeed: 0.2 + Math.random() * 0.6,
      rotation: Math.random() * Math.PI,
    };
  }
}

function drawShape(ctx, s, progress) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  if (s.type === "softCircle") {
    // Lo-Fi soft glow circle
    ctx.globalAlpha = 1 - progress;
    ctx.beginPath();
    ctx.fillStyle = s.color;
    const r = s.radius * (1 + progress * 1.6);
    ctx.shadowBlur = 20 + progress * 40;
    ctx.shadowColor = s.color;
    ctx.arc(s.x + s.vx * (progress * 30), s.y + s.vy * (progress * 30), r, 0, 2 * Math.PI);
    ctx.fill();
    // small particle
    ctx.globalAlpha = 0.7 * (1 - progress);
    ctx.beginPath();
    ctx.arc(s.x + Math.sin(progress * 6) * 8, s.y + Math.cos(progress * 6) * 8, 3, 0, 2 * Math.PI);
    ctx.fillStyle = s.color;
    ctx.fill();
  } else if (s.type === "neonLine") {
    // EDM angular neon streak
    ctx.globalAlpha = 1 - progress * 0.9;
    ctx.lineWidth = 2 + (1 - progress) * 6;
    ctx.strokeStyle = s.color;
    ctx.shadowBlur = 30;
    ctx.shadowColor = s.color;
    ctx.beginPath();
    const dx = Math.cos(s.angle) * s.len * (0.5 + progress);
    const dy = Math.sin(s.angle) * s.len * (0.5 + progress);
    ctx.moveTo(s.x - dx * progress, s.y - dy * progress);
    ctx.lineTo(s.x + dx, s.y + dy);
    ctx.stroke();
    // flicker dots
    ctx.globalAlpha = 0.8 * (1 - progress);
    ctx.beginPath();
    ctx.arc(s.x + Math.cos(progress * 10) * 10, s.y + Math.sin(progress * 10) * 10, 3 + (1 - progress) * 3, 0, 2 * Math.PI);
    ctx.fillStyle = s.color;
    ctx.fill();
  } else if (s.type === "musicalNote") {
    // Classical: note-like ellipse + stem
    ctx.globalAlpha = 1 - progress * 0.95;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    const floatY = s.y - progress * 30 * s.floatSpeed;
    ctx.ellipse(s.x, floatY, s.radius * (1 + (1 - progress) * 0.4), s.radius * 0.7 * (1 + (1 - progress) * 0.4), s.rotation, 0, Math.PI * 2);
    ctx.fill();
    // stem
    ctx.beginPath();
    ctx.rect(s.x + s.radius * 0.6, floatY - s.radius * 1.6, 2, s.radius * 3 * (1 - progress));
    ctx.fill();
    // small ornamental sparkle
    ctx.globalAlpha = 0.5 * (1 - progress);
    ctx.beginPath();
    ctx.arc(s.x - s.radius * 1.2, floatY - s.radius * 1.2, 2 + (1 - progress) * 2, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.fill();
  }
  ctx.restore();
}

function getColorForToken(theme, type) {
  // theme-aware palettes
  if (theme === "Lo-Fi") {
    switch (type) {
      case "keyword":
        return "#f6ad55"; // warm orange
      case "identifier":
        return "#86efac"; // mint
      case "string":
        return "#fde68a"; // soft yellow
      case "number":
        return "#93c5fd"; // calm blue
      case "operator":
        return "#c4b5fd"; // lilac
      case "comment":
        return "#9CA3AF"; // grey
      case "punctuation":
        return "#f472b6"; // pink
      case "error":
        return "#ff4d4f";
      default:
        return "#ffffff";
    }
  } else if (theme === "EDM") {
    switch (type) {
      case "keyword":
        return "#7c3aed"; // neon purple
      case "identifier":
        return "#06b6d4"; // cyan
      case "string":
        return "#f97316"; // neon orange
      case "number":
        return "#60a5fa"; // electric blue
      case "operator":
        return "#ef4444"; // red
      case "comment":
        return "#94a3b8";
      case "punctuation":
        return "#f43f5e";
      case "error":
        return "#ff1e56";
      default:
        return "#ffffff";
    }
  } else {
    // Classical palette
    switch (type) {
      case "keyword":
        return "#2b6cb0"; // deep blue
      case "identifier":
        return "#1f7a4c"; // deep green
      case "string":
        return "#b0833b"; // warm brown/gold
      case "number":
        return "#6b7280"; // slate
      case "operator":
        return "#8b5cf6";
      case "comment":
        return "#9ca3af";
      case "punctuation":
        return "#d946ef";
      case "error":
        return "#b91c1c";
      default:
        return "#222222";
    }
  }
}
