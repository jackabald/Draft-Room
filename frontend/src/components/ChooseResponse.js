import React from "react";

function ChooseResponse({ onChosen, setPlayerResponses }) {
  const handleResponse = (response) => {
    setPlayerResponses({ chosenResponse: response });
    onChosen();
  };

  return (
    <div>
      <button onClick={() => handleResponse("LeBron James")}>
        Select LeBron James
      </button>
      {/* More buttons or a dynamic list can be implemented here */}
    </div>
  );
}

export default ChooseResponse;
