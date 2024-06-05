import React, { useState, useEffect } from "react";
import SubmitPrompt from "./SubmitPrompt";
import ChooseResponse from "./ChooseResponse";
import GuessNumber from "./GuessNumber";
import socket from "../socket";
import { useLocation } from "react-router-dom";

function Game() {
  const location = useLocation();
  const gameCode = location.state?.gameCode;
  const [phase, setPhase] = useState(0);
  const [players, setPlayers] = useState([]);
  const [chosenPlayer, setChosenPlayer] = useState(null);
  const [playerResponses, setPlayerResponses] = useState({});
  const [guesses, setGuesses] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [guesserState, setGuesserState] = useState({
    isGuesser: false,
    number: null,
  });

  useEffect(() => {
    const handleGameStarted = ({ guesserId }) => {
      console.log("Game started event received, Guesser ID:", guesserId);
      const isGuesser = socket.id === guesserId;
      const number = Math.floor(1 + Math.random() * 10);
      setChosenPlayer(guesserId);
      setIsGameStarted(true);
      setPhase(1);
      setGuesserState({ isGuesser, number });
    };

    socket.on("updateGuesser", handleGameStarted);
    return () => {
      socket.off("updateGuesser", handleGameStarted);
    };
  }, []);

  const handleInitGame = () => {
    socket.emit("initGame", gameCode);
  };

  const handlePhaseChange = () => {
    setPhase(phase + 1);
  };

  // if (!isGameStarted) {
  //   return <div>Waiting for game to start...</div>;
  // }

  return (
    <div>
      <button onClick={handleInitGame}>begin</button>
      {phase === 1 && (
        <SubmitPrompt
          isGuesser={guesserState.isGuesser}
          number={guesserState.number}
        />
      )}
      {phase === 2 && (
        <ChooseResponse
          onChosen={handlePhaseChange}
          setPlayerResponses={setPlayerResponses}
        />
      )}
      {phase === 3 && (
        <GuessNumber onFinished={handlePhaseChange} setGuesses={setGuesses} />
      )}
    </div>
  );
}

export default Game;
