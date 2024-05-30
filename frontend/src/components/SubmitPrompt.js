import React, { useState } from "react";

function SubmitPrompt({ onSubmitted }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    console.log("Prompt submitted:", prompt); // Additional handling as needed
    onSubmitted();
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
      />
      <button onClick={handleSubmit}>Submit Prompt</button>
    </div>
  );
}

export default SubmitPrompt;
