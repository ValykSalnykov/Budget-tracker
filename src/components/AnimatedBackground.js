import React from 'react';

const AnimatedBackground = ({ opacity = 0.5, darkMode }) => {
  const backgroundImage = darkMode ? "/theme-dark.svg" : "/theme-light.svg";

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden dark:bg-gray-900">
      <svg
        className="absolute w-[200%] h-[200%]"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <pattern
            id="cloud-pattern"
            patternUnits="userSpaceOnUse"
            width="372"
            height="812"
            x="0"
            y="0"
          >
            <image
              xlinkHref={backgroundImage}
              width="372"
              height="812"
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#cloud-pattern)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 0"
            to="-372 -128"
            dur="90s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
};

export default AnimatedBackground;