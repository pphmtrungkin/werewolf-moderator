import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import UserContext from './UserContext';
import { get } from 'lodash';
// Create a context
export const DeckContext = createContext();

// Create the provider
export const DeckProvider = ({ children }) => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedCardsLoading, setSelectedCardsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [deckId, setDeckId] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    async function getSelectedCards() {
      const { data, error } = await supabase
        .from("decks_cards")
        .select("deck_id, card_id")
        .eq("deck_id", user.id);

      if (error) {
        console.log("Error fetching selected cards: ", error);
        return;
      }

      if (data) {
        setSelectedCards(data);
        setNumberOfPlayers(data.length);
        console.log("Selected cards: ", data);
        console.log("Total: ", total);
        console.log("Number of players: ", data.length);
      }
      setSelectedCardsLoading(false);
    }

    async function getTotalValue() {
      const { data, error } = await supabase
        .from("decks_cards")
        .select("cards(score)")
        .eq("deck_id", user.id);
      
      if (error) {
        console.log("Error fetching total value: ", error);
        return;
      }

      if(data) {
        // console.log(data[0].cards.score);
        const total = data.reduce((acc, curr) => {
          // console.log("Acc: ", acc);
          return acc + curr.cards.score;
        }, 0);
        setTotal(total);
        console.log("Total: ", total);
      }
    }
    if (user?.id) {
      getSelectedCards();
      getTotalValue(); 
    }
  }, [user?.id]);
  return (
    <DeckContext.Provider value={{ selectedCards, setSelectedCards, selectedCardsLoading, numberOfPlayers, setNumberOfPlayers, total, setTotal }}>
      {children}
    </DeckContext.Provider>
  );
};
export default DeckContext;

