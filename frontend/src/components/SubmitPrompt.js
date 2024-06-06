import React from 'react';

function SubmitPrompt({ isGuesser, number, onSubmit }) {
  const handleSubmit = () => {
    onSubmit();
  }
  return (
    <div>
      {isGuesser ? (
        <p>You are the guesser. Your number is {number}.</p>
      ) : (
        <div>
          <input type="text" placeholder="Enter your prompt" />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default SubmitPrompt; 