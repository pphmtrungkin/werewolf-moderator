import React from "react";
import { createContext, useContext, useState } from "react";
import DeckContext from "../components/DeckContext";
const Timer = () => {
    
}
const Game = () => {
  const { selectedCards, setSelectedCards } = useContext(DeckContext);
  return (
    <div>
      <h1>Game</h1>
      {selectedCards.map((card, index) => (
        <p key={index}>{card.title}</p>
      ))}
    </div>
  );
};

export default Game;
