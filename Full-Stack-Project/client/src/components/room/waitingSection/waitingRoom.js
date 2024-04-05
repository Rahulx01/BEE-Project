import React, { useState } from "react";
// import { socket } from "../../../socket";

export default (props) => {
  const members = props?.roomDetails?.members;
  const [timeInterval, setTimeInterval] = useState(5);
  const [maxPlayer, setMaxPlayer] = useState(8);

  return (
    <>
      <div>
        {props?.roomDetails?.isHost && <div>
          <h2>Host Control</h2>
          <div id="time-interval-div">
            <h4>time interval is {timeInterval}</h4>
            <button onClick={() => setTimeInterval(timeInterval + 1)}>up</button>
            <button onClick={() => setTimeInterval(timeInterval - 1)}>down</button>
          </div>
          <div id="max-player-div" >
            <h4>max player is {maxPlayer}</h4>
            <button onClick={() => setMaxPlayer(maxPlayer + 1)}>up</button>
            <button onClick={() => setMaxPlayer(maxPlayer - 1)}>down</button>
          </div>
          {/* <div id="scope-of-room">
            <button></button>
          </div> */}
        </div>}
        <div>
          <table className="table">
            <thead className="table-light">
              <tr>
                <th></th>
                <th>
                  <h2>Players</h2>
                </th>
              </tr>
            </thead>
            <tbody>
              {members && members.map((member, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}.</td>
                    <td>{member}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {props?.roomDetails?.isHost && <button
            className="btn btn-success"
            onClick={() => { props.setGameStatus(true) }}
          >
            Start Game
          </button>}
        </div>
      </div>
    </>
  );
};
