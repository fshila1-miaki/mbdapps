import React from "react";

// Orbit mark — a ring with a break, with a satellite dot sitting in the break.
// Ring uses --primary, satellite uses --ai, so it adapts to light/dark mode.
export const OrbitMark = ({ size = 28, className = "" }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    style={{ display: "block" }}
  >
    <circle
      cx="32" cy="32" r="20"
      fill="none"
      stroke="var(--c-primary, #5B7CFA)"
      strokeWidth="7"
      strokeLinecap="round"
      strokeDasharray="102 23"
      strokeDashoffset="-6"
      transform="rotate(-110 32 32)"
    />
    <circle cx="48" cy="16" r="5" fill="var(--ai, #2DD4BF)" />
  </svg>
);

export default OrbitMark;
