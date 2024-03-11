import React, { useEffect } from "react";
import { socket } from "../../../socket";
export default (props) => {
  const members = props?.roomDetails?.members;
  return (
    <>
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
      {props?.roomDetails.isHost && <button
        className="btn btn-primary"
        onClick={() => { props.setGameActiveStatus(true) }}
      >
        Start Game
      </button>}
    </>
  );
};
