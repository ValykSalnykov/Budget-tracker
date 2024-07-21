import React from 'react';

const AnimatedGradientBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1]">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-100 via-violet-100 to-teal-100 animate-gradient-x"></div>
    </div>
  );
};

export default AnimatedGradientBackground;