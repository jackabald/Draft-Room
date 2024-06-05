import React from 'react';

function SubmitPrompt({ isGuesser, number }) {
  return (
    <div>
      {isGuesser ? (
        <p>You are the guesser. Your number is {number}.</p>
      ) : (
        <div>
          <input type="text" placeholder="Enter your prompt" />
          <button>Submit</button>
        </div>
      )}
    </div>
  );
}

export default SubmitPrompt; 