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
    socket.on("updateGuesser", ({ guesserId }) => {
      console.log("Game started event received, Guesser ID:", guesserId);
      const isGuesser = socket.id === guesserId;
      const number = Math.floor(1 + Math.random() * 10);
      setChosenPlayer(guesserId);
      setIsGameStarted(true);
      setPhase(1);
      setGuesserState({ isGuesser, number });
    });

    return () => {
      socket.off("updateGuesser");
    };
  }, []);

  useEffect (() => {
    if(gameCode){
      socket.emit("initGame", gameCode);
    }
  }, [gameCode]);
  

  const handlePhaseChange = () => {
    setPhase(phase + 1);
  };

  return (
    <div>
      {phase === 1 && (
        <SubmitPrompt
          isGuesser={guesserState.isGuesser}
          number={guesserState.number}
          onSubmit={handlePhaseChange}
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
