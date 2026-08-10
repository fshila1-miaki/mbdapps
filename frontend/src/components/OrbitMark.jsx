import React from "react";

// Orbit mark — gradient ring (blue→teal) with a gap at the top and a teal
// satellite dot sitting exactly on the ring's upper-right end (no protruding tail).
export const OrbitMark = ({ size = 28, className = "" }) => {
  const gid = React.useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`orbit-ring-${gid}`} x1="16" y1="54" x2="50" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5B7CFA" />
          <stop offset="0.65" stopColor="#5FA0E6" />
          <stop offset="1" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>
      {/* Ring: 298° arc (62° gap at top), rotated so the gap sits at 12 o'clock */}
      <circle
        cx="32" cy="33" r="20"
        fill="none"
        stroke={`url(#orbit-ring-${gid})`}
        strokeWidth="7"
        strokeLinecap="round"
        pathLength="360"
        strokeDasharray="298 62"
        transform="rotate(-59 32 33)"
      />
      {/* Satellite dot covers the ring's upper-right terminus */}
      <circle cx="42.3" cy="15.9" r="8" fill="#2DD4BF" />
    </svg>
  );
};

export default OrbitMark;
