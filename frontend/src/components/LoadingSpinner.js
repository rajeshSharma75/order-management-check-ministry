import React from 'react';

function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: { width: '16px', height: '16px' },
    md: { width: '32px', height: '32px' },
    lg: { width: '48px', height: '48px' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div
        className="spinner"
        style={sizeClasses[size]}
      ></div>
      {text && <p style={{ marginTop: '1rem', color: '#6b7280' }}>{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
