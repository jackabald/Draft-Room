import React from "react";

function AssignPlayer({ onAssigned, setChosenPlayer }) {
  const choosePlayer = () => {
    const player = "John"; // Logic to select a player randomly
    setChosenPlayer(player);
    onAssigned();
  };

  return (
    <div>
      <button onClick={choosePlayer}>Start Game</button>
    </div>
  );
}

export default AssignPlayer;
