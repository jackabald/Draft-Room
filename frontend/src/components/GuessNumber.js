import React from "react";

function GuessNumber({ onFinished, setGuesses }) {
  const handleGuess = (guess) => {
    setGuesses((prev) => [...prev, guess]);
    onFinished();
  };

  return (
    <div>
      <button onClick={() => handleGuess(7)}>Guess 7</button>
      {/* More buttons or a dynamic list for guessing */}
    </div>
  );
}

export default GuessNumber;
