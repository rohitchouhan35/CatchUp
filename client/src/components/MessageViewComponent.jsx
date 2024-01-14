import React from 'react';

const MessageViewComponent = ({ message, mine }) => {
  const messageStyle = {
    maxWidth: '70%',
    // margin: '10px',
    padding: '8px',
    borderRadius: '8px',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    fontSize: '15px',
    backgroundColor: mine ? '#2e39fcaa' : '#f5f5f5',
    color: mine ? 'white' : '#333',
    marginLeft: mine ? '30%' : '0%',
    marginRight: mine ? '0%' : '30%',
  };

  return (
    <div style={messageStyle}>
      <div>{message}</div>
    </div>
  );
};

export default MessageViewComponent;
