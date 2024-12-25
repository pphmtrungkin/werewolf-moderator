import React, { useContext, useState, useEffect } from "react";
import DeckContext from "../components/DeckContext";
import { Outlet } from "react-router-dom";

const Game = () => {
  const { selectedCards } = useContext(DeckContext);
  const [currentCard, setCurrentCard] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Filter out villager cards
  const filteredCards = selectedCards.filter((card) => card.id !== 1);

  // Count the occurrences of each card
  const cardCountMap = filteredCards.reduce((acc, card) => {
    acc[card.title] = (acc[card.title] || 0) + 1;
    return acc;
  }, {});

  // Remove duplicate cards
  const uniqueCards = Array.from(new Set(filteredCards.map((a) => a.title)))
    .map((title) => {
      return filteredCards.find((a) => a.title === title);
    })
    .sort((a, b) => a.id - b.id);


  useEffect(() => {
    console.log("Current card: ", uniqueCards[currentCard]);
  }, [currentCard]);

  const length = uniqueCards.length;

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % length);
  };

  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + length) % length);
  };

  const inputBox = (count) => {
    const inputs = [];
    for (let i = 0; i < count; i++) {
      inputs.push(
        <input
          key={i}
          type="text"
          className="border border-gray-300 w-max mb-4"
          placeholder={`Player ${i + 1}'s name`}
        />
      );
    }
    return inputs;
  };

  const inputTargetBox = (count) => {
    const inputs = [];
    for (let i = 0; i < count; i++) {
      inputs.push(
        <div key={i} className="flex items-center mb-4">
          <input
            type="text"
            className="border border-gray-300 w-max"
            placeholder={`Target ${i + 1}'s name`}
          />
          {uniqueCards[currentCard].title == "witch" && (
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m7 16 4-4-4-4m6 8 4-4-4-4"
              />
            </svg>
          )}
        </div>
      );
    }
    return inputs;
  }

  const inputBoxes = uniqueCards[currentCard]
    ? inputBox(cardCountMap[uniqueCards[currentCard].title])
    : null;

  const inputTargetBoxes = uniqueCards[currentCard]
    ? inputTargetBox(uniqueCards[currentCard].number_of_targets || 0)
    : null;

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#241F21] rounded-lg p-8 w-1/2">
            <div className="flex flex-col justify-center items-center">
              <svg
                className="w-32 h-32 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h1 className="text-2xl font-semibold text-center my-8">
                Do you wish to cancel this game?
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => deleteGame()}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Yes, Cancel this game
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="absolute right-12 top-4 p-4">
        <button onClick={() => setShowModal(true)}>
          <svg
            class="w-14 h-14 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col justify-center items-center h-screen">
        {length > 0 && (
          <div className="flex items-center mb-4">
            {currentCard !== 0 && (
              <button onClick={handlePrev} className="mr-4">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke-width="2"
                    d="m15 19-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            {uniqueCards[currentCard] && (
              <div className="text-center">
                <img
                  src={uniqueCards[currentCard].link}
                  alt={uniqueCards[currentCard].title}
                  className="w-96 h-auto mx-20"
                />
                <h3>{uniqueCards[currentCard].title}</h3>
              </div>
            )}
            {currentCard !== length - 1 && (
              <button onClick={handleNext} className="ml-4">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke-width="2"
                    d="m9 5 7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="flex w-max items-center justify-between gap-x-4">
          <div className="">{inputBoxes}</div>
          <div>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke-width="2"
                d="m7 16 4-4-4-4m6 8 4-4-4-4"
              />
            </svg>
          </div>
          <div>{inputTargetBoxes}</div>
        </div>
      </div>
    </>
  );
};

export default Game;
