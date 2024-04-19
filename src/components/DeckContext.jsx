import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import UserContext from './UserContext';
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
        .select("*")
        .eq("deck_id", user.id);

      if (error) {
        console.log("Error fetching selected cards: ", error);
        return;
      }

      if (data) {
        setSelectedCards(data);
        setNumberOfPlayers(data.reduce((acc, card) => acc + card.numberOfCards,0));
        setTotal(data.reduce((acc, card) => acc + card.numberOfCards * card.value,0));
      }
      setSelectedCardsLoading(false);
    }
    if (user?.id) {
      getSelectedCards();
    }
  }, [user?.id]);
  return (
    <DeckContext.Provider value={{ selectedCards, setSelectedCards, selectedCardsLoading, numberOfPlayers, setNumberOfPlayers, total, setTotal }}>
      {children}
    </DeckContext.Provider>
  );
};
export default DeckContext;

