import React from "react";
import GameSection from "./gameSection/gameSection";
import ChatBox from "./chatBox/chatBox";
export default (props) => {
  return (
    <>
      <div
        className="container"
      >
        <div className="row">
          <div className="col-sm-8">
            <GameSection roomCode={props.roomCode}></GameSection>
          </div>
          <div className="col-sm-4">
            <ChatBox roomCode={props.roomCode}></ChatBox>
          </div>
        </div>
      </div>
    </>
  );
};
