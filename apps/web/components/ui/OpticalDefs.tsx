import React from "react";

export function OpticalDefs() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed h-0 w-0 overflow-hidden"
    >
      <defs>
        <filter id="showcase-protanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.152286 1.052583 -0.204868 0 0
              0.114503 0.786281  0.099216 0 0
             -0.003882 -0.048116 1.051998 0 0
              0        0         0        1 0"
          />
        </filter>
        <filter id="showcase-deuteranopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.367322 0.860646 -0.227968 0 0
              0.280085 0.672501  0.047413 0 0
             -0.011820 0.042940  0.968881 0 0
              0        0         0        1 0"
          />
        </filter>
        <filter id="showcase-tritanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              1.255528 -0.076749 -0.178779 0 0
             -0.078411  0.930809  0.147602 0 0
              0.004733  0.691367  0.303900 0 0
              0         0         0        1 0"
          />
        </filter>
        <filter id="showcase-achromatopsia" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0.2126 0.7152 0.0722 0 0
              0.2126 0.7152 0.0722 0 0
              0.2126 0.7152 0.0722 0 0
              0      0      0      1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}