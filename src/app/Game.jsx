import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import DeckContext from "../components/DeckContext";

const Game = () => {
  const { selectedCards, setSelectedCards } = useContext(DeckContext);
  
  return (
    <div>
      {selectedCards.map((card) => (
        <div key={card.id}>
          <img src={card.link} alt={card.title} />
          <h3>{card.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default Game;
