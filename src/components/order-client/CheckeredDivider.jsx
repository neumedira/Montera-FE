import React from 'react';

export default function CheckeredDivider() {
  return (
    <div className="my-6 overflow-hidden -mx-4">
      <div 
        className="h-6 w-full"
        style={{
          backgroundImage: `conic-gradient(#18181b 90deg, #ffffff 90deg 180deg, #18181b 180deg 270deg, #ffffff 270deg)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}