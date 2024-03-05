import React from "react";
export default (props) => {
  return (
    <>
      <h1>hello is this waiting room </h1>
      <button
        onClick={() => {
          props.setGameStarted(true);
        }}
      >
        Start Game
      </button>
    </>
  );
};
