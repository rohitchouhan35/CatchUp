import React from 'react';

const ConnectingPageComponent = () => {
  const style = {
    color: 'white',
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.3rem',
  };

  const loaderStyle = {
    border: '6px solid rgba(255, 255, 255, 0.3)',
    borderTop: '6px solid #fff',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={style} className='connecting-page'>
        <div style={loaderStyle}></div>
        Connecting...
      </div>
    </>
  );
};

export default ConnectingPageComponent;
