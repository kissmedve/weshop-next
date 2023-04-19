import React from "react";

const Message = ({ message, status }) => {
  const backgroundColor = (status) => {
    let bgClass = "";

    if (status > 199 && status < 300) {
      bgClass = "has-background-successgreen";
    }
    if (status > 399 && status < 500) {
      bgClass = "has-background-warningorange";
    }
    return bgClass;
  };
  return (
    <>
      <div
        className={`message ${backgroundColor(
          status
        )} has-text-centered py-3 px-2 has-text-white`}
      >
        {message}
      </div>
    </>
  );
};

export default Message;
