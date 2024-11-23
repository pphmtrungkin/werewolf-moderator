import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { DeckContext } from "../components/DeckContext";
import { supabase } from "../supabase";
import SideButton from "../components/SideButton";
import Card from "../components/Card";
import { useNavigate, Outlet } from "react-router-dom";
import UserContext from "../components/UserContext";
import Spinner from "../components/Spinner";
import { set } from "lodash";

export default function SetUp() {
  const [cards, setCards] = useState([]);
  const [sides, setSides] = useState([]);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  const [filteredCards, setFilteredCards] = useState([]);

  const {
    total,
    setTotal,
    numberOfPlayers,
    setNumberOfPlayers,
    selectedCards,
    setSelectedCards,
    selectedCardsLoading,
  } = useContext(DeckContext);

  const { user } = useContext(UserContext);

  const [selectedSideButton, setSelectedSideButton] = useState(1);

  const handleSideButtonClick = (id) => {
    setSelectedSideButton(id);
  };

  const handleCardSelect = (card) => {
    const cardCount = getCardCount(card);
    const totalSelectedCards = selectedCards.length;
    const limit =
      card.card_limit > numberOfPlayers ? numberOfPlayers : card.card_limit;

    if (totalSelectedCards === numberOfPlayers) {
      // Only allow unselecting cards
      if (cardCount > 0) {
        const newSelectedCards = selectedCards.filter(
          (selectedCard) => selectedCard.card_id !== card.id
        );
        setSelectedCards(newSelectedCards);
        setTotal(total - card.score * cardCount);
      }
    } else {
      // Allow selecting and unselecting cards
      if (cardCount < limit) {
        setSelectedCards([
          ...selectedCards,
          { deck_id: user.id, card_id: card.id },
        ]);
        setTotal(total + card.score);
      } else if (cardCount === limit) {
        const newSelectedCards = selectedCards.filter(
          (selectedCard) => selectedCard.card_id !== card.id
        );
        setSelectedCards(newSelectedCards);
        setTotal(total - card.score * cardCount);
      }
    }
  };

  const getCardCount = (card) => {
    return selectedCards.filter(
      (selectedCard) => selectedCard.card_id === card.id
    ).length;
  };

  useEffect(() => {
    async function getCards() {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.log("Error fetching cards: ", error);
        return;
      }

      if (data) {
        setCards(data);
        console.log("Cards: ", data);
      }
    }

    async function getSides() {
      const { data, error } = await supabase
        .from("sides")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.log("Error fetching sides: ", error);
        return;
      }

      if (data) {
        setSides(data);
        console.log("Sides: ", data);
      }
    }


    if (cards.length === 0) {
      getCards();
    }

    if (sides.length === 0) {
      getSides();
    }

  }, []);

  useEffect(() => {
    async function getTimer() {
      const { data, error } = await supabase
        .from("decks")
        .select("timer")
        .eq("id", user.id);

      if (error) {
        console.log("Error fetching timer: ", error);
        return;
      }

      if (data) {
        setTimer(data[0].timer);
        console.log("Timer: ", data[0].timer);
      }
    }

    if (user?.id) {
      getTimer();
      formatTime(timer);
    }
  }, [user]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  useEffect(() => {
    if (cards.length > 0 && sides.length > 0) {
      const filtered = cards.filter(
        (card) => card.side_id === selectedSideButton
      );
      setFilteredCards(filtered);
      console.log("Filtered: ", filtered);
    } else {
      console.log("No cards or sides");
    }
  }, [selectedSideButton, cards, sides]);

  useEffect(() => {
    console.log("Selected cards: ", selectedCards);
  }, [selectedCards]);
  return (
    <>
      <Outlet />
      <div className="my-20 mx-60">
        <div className="text-4xl font-semibold text-center">Set Up</div>
        <hr class="w-4/5 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-8 dark:bg-gray-700" />
        <div className="flex justify-around items-center">
          <button
            className="flex items-center justify-center bg-gray-600 p-3 rounded-lg"
            onClick={() => setNumberOfPlayers(numberOfPlayers - 1)}
          >
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
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
                d="m15 19-7-7 7-7"
              />
            </svg>
          </button>
          <p className="text-center text-2xl font-semibold">
            Players: {numberOfPlayers}
          </p>
          <button
            className="flex items-center justify-center bg-gray-600 p-3 rounded-lg"
            onClick={() => setNumberOfPlayers(numberOfPlayers + 1)}
          >
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
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
                d="m9 5 7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <hr class="w-4/5 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-8 dark:bg-gray-700" />
        
        <p className="text-center text-2xl font-semibold">Total: {total}</p>
        <hr class="w-4/5 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-8 dark:bg-gray-700" />
        
        <div className="flex justify-around items-center my-8">
          {sides.map((side) => (
            <SideButton
              key={side.id}
              id={side.id}
              name={side.name}
              hex_color={side.hex_color}
              selected={selectedSideButton === side.id}
              onClick={handleSideButtonClick}
            />
          ))}
        </div>

        {selectedCardsLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex-wrap items-center justify-center text-center">
            {filteredCards.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                link={card.link}
                onSelect={() => handleCardSelect(card)}
                count={getCardCount(card)}
                selected={selectedCards.some(
                  (selectedCard) => selectedCard.card_id === card.id
                )}
              />
            ))}
          </div>
        )}
        <hr class="w-4/5 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-8 dark:bg-gray-700" />
        <h1 className="text-4xl text-center font-semibold">Timer</h1>
        <div className="flex justify-around items-center my-8">
        <button
            className="flex items-center justify-center bg-gray-600 p-3 rounded-lg"
            onClick={() => setTimer(timer - 1)}
          >
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
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
                d="m15 19-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-center text-6xl font-normal">
            {formatTime(timer)}
          </h2>
          <button
            className="flex items-center justify-center bg-gray-600 p-3 rounded-lg"
            onClick={() => setTimer(timer + 1)}
          >
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
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
                d="m9 5 7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center mt-14">
          <button onClick={() => navigate("/game")} className="bg-gray-300 text-black text-2xl font-semibold py-4 w-4/5 mx-auto rounded-xl">
            Start Game
          </button>
        </div>
      </div>
    </>
  );
}
