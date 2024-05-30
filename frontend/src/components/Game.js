import React, { useState } from "react";
import AssignPlayer from "./AssignPlayer";
import SubmitPrompt from "./SubmitPrompt";
import ChooseResponse from "./ChooseResponse";
import GuessNumber from "./GuessNumber";

function Game() {
  const [phase, setPhase] = useState(1);
  const [players, setPlayers] = useState([]); // Example players data
  const [chosenPlayer, setChosenPlayer] = useState(null);
  const [playerResponses, setPlayerResponses] = useState({});
  const [guesses, setGuesses] = useState([]);

  const handlePhaseChange = () => {
    setPhase(phase + 1); // Increment phase to move to the next part of the game
  };

  return (
    <div>
      {phase === 1 && (
        <AssignPlayer
          onAssigned={handlePhaseChange}
          setChosenPlayer={setChosenPlayer}
        />
      )}
      {phase === 2 && <SubmitPrompt onSubmitted={handlePhaseChange} />}
      {phase === 3 && (
        <ChooseResponse
          onChosen={handlePhaseChange}
          setPlayerResponses={setPlayerResponses}
        />
      )}
      {phase === 4 && (
        <GuessNumber onFinished={handlePhaseChange} setGuesses={setGuesses} />
      )}
    </div>
  );
}

export default Game;
