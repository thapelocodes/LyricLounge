import React from "react";
import PropTypes from "prop-types";

const Message = ({ message }) => {
  return (
    <div className="message">
      <p>
        <strong>{message.sender}</strong>: {message.content}
      </p>
      <p>
        <small>{new Date(message.createdAt).toLocaleString()}</small>
      </p>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Message;
