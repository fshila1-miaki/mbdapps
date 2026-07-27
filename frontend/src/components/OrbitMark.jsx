import React from "react";

// Orbit logomark: solid planet core + tilted elliptical orbit ring + satellite dot.
// Uses currentColor so it adapts to context (text-white on dark, text-[#2563EB] on light).
export const OrbitMark = ({ size = 32, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="none"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="6" fill="currentColor" />
    <ellipse cx="16" cy="16" rx="14" ry="5" stroke="currentColor" strokeWidth="2.5" transform="rotate(-30 16 16)" />
    <circle cx="28" cy="9" r="2.5" fill="currentColor" />
  </svg>
);

export default OrbitMark;
