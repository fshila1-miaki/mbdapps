import React from "react";

// Orbit mark — gradient ring (blue→teal) with a break, and a teal satellite
// dot sitting in the break. Matches the uploaded brand mark.
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
        <linearGradient id={`orbit-ring-${gid}`} x1="12" y1="54" x2="52" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5B7CFA" />
          <stop offset="0.6" stopColor="#5F9CE8" />
          <stop offset="1" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>
      <circle
        cx="32" cy="33" r="20"
        fill="none"
        stroke={`url(#orbit-ring-${gid})`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="104 22"
        strokeDashoffset="-8"
        transform="rotate(-108 32 33)"
      />
      <circle cx="46" cy="18" r="8" fill="#2DD4BF" />
    </svg>
  );
};

export default OrbitMark;
