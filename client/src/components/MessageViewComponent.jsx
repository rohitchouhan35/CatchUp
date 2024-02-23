import React from 'react';

const MessageViewComponent = ({ message, mine }) => {
  const messageStyle = {
    maxWidth: '70%',
    padding: '8px 16px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    fontSize: '15px',
    backgroundColor: mine ? '#2e39fcaa' : '#f5f5f5',
    color: mine ? 'white' : '#333',
    borderRadius: mine ? '12px 12px 0 12px' : '0 12px 12px 12px',
  };

  const messageWrapperStyle = {
    display: 'flex',
    justifyContent: mine ? 'end' : 'start',
  };

  return (
    <div style={messageWrapperStyle}>
      <div style={messageStyle}>{message}</div>
    </div>
  );
};

export default MessageViewComponent;
