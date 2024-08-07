// components/Message.js
const Message = ({ role, content }) => {
    return (
      <div className={`message ${role}`}>
        <p>{content}</p>
        <style jsx>{`
          .message {
            margin-bottom: 12px;
            padding: 8px;
            border-radius: 8px;
          }
  
          .user {
            background-color: #dcf8c6;
            align-self: flex-end;
          }
  
          .bot {
            background-color: #fff;
            align-self: flex-start;
          }
        `}</style>
      </div>
    );
  };
  
  export default Message;
  