import React, { useEffect, useState, useContext } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Outlet } from "react-router-dom";
import DeckContext from "../components/DeckContext";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/UserContext";
import { supabase } from "../../supabase";
import { v4 as uuidv4 } from "uuid";
import { get, set } from "lodash";

//Side data
const Sides = [
  {
    index: 0,
    title: "Villager",
    value: "villager",
    hexColor: "#294C74",
  },
  {
    index: 1,
    title: "Werewolf",
    value: "werewolf",
    hexColor: "#600C17",
  },
  {
    index: 2,
    title: "WW Team",
    value: "ww",
    hexColor: "#600C17",
  },
  {
    index: 3,
    title: "Independents",
    value: "3rd",
    hexColor: "#70471C",
  },
];
const Spinner = () => {
  return (
    <div
      role="status"
      className="flex flex-col justify-center items-center mt-20"
    >
      <svg
        aria-hidden="true"
        className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <h2 className="mt-10 text-xl font-semibold">Loading Saved Cards...</h2>
    </div>
  );
};
//Card Component
const Card = ({
  DeckId,
  id,
  value,
  title,
  link,
  limit,
  setTotal,
  selectedCards,
  setSelectedCards,
  numberOfPlayers,
}) => {
  //Declare select Use State.
  const [selected, setSelect] = useState(
    selectedCards.filter((card) => card.card_id == id).length
  );
  const [numberOfCards, setNumberOfCards] = useState(1);
  //Use Effect to track selected cards array
  useEffect(() => {
    console.log(selectedCards);
  }, [selectedCards]);
  const handleSelect = () => {
    let limitAllowed = limit < numberOfPlayers ? limit : numberOfPlayers;
    const existingCardIndex = selectedCards.findIndex(
      (card) => card.card_id === id
    );
    const totalSelectedCards = selectedCards.reduce(
      (acc, card) => acc + card.numberOfCards,
      0
    );
    if (
      totalSelectedCards < numberOfPlayers &&
      selectedCards.filter((card) => card.card_id == id).length < limitAllowed
    ) {
      setSelect(1);
      setNumberOfCards((numberOfCards) => numberOfCards + 1);

      if (existingCardIndex !== -1) {
        const existingCard = selectedCards[existingCardIndex];
        if (existingCard.numberOfCards < limitAllowed) {
          existingCard.numberOfCards += 1;
          existingCard.value += value;
          setSelectedCards([...selectedCards]);
          setTotal((total) => total + value);
        } else {
          setSelect(0);
          setNumberOfCards(1);
          setTotal(
            (total) =>
              total -
              selectedCards.filter((card) => card.card_id === id)[0]
                ?.numberOfCards *
                value
          );
          setSelectedCards(selectedCards.filter((card) => card.card_id !== id));
        }
      } else {
        setSelectedCards([
          ...selectedCards,
          { card_id: id, deck_id: DeckId, numberOfCards: numberOfCards, value: value },
        ]);
        setTotal((total) => total + value);
      }
    } else {
      setSelect(0);
      setNumberOfCards(1);
      setTotal((total) => {
        const card = selectedCards.filter((card) => card.card_id === id)[0];
        const numberOfCards = card?.numberOfCards;
        // console.log('numberOfCards:', numberOfCards);
        // console.log('value:', value);
        return numberOfCards ? total - numberOfCards * value : total;
      });
      setSelectedCards(selectedCards.filter((card) => card.card_id !== id));
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleSelect(DeckId)}
      className="relative p-1 w-1/4"
    >
      {selected ? (
        <div>
          <img
            src={link}
            alt={title}
            className="w-auto h-auto rounded-lg m-1 object-cover"
          />
          {selectedCards.filter((card) => card.card_id === id)[0] &&
          selectedCards.filter((card) => card.card_id === id)[0].numberOfCards >
            1 ? (
            <h3 className="absolute top-0 right-0 bg-white text-black rounded-full p-1 px-3 text-base font-bold">
              {
                selectedCards.filter((card) => card.card_id === id)[0]
                  .numberOfCards
              }
            </h3>
          ) : null}
        </div>
      ) : (
        <>
          <img
            src={link}
            alt={title}
            width={500}
            height={700}
            className="max-w-full h-auto rounded-lg m-1 object-cover filter grayscale"
          />
        </>
      )}
      <div
        style={{ backgroundColor: "white" }}
        className="absolute bottom-3 left-3 right-2 bg-opacity-50 py-2 rounded w-9/10"
      >
        <p className="text-xl text-black font-semibold text-center capitalize">
          {title}
        </p>
      </div>
    </button>
  );
};

const SetUp = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [Cards, setCards] = useState([]);
  //declare number of players
  //Declare filter Use State
  const [filter, setFilter] = useState("villager");
  //handle filter function
  const handleFilter = (side) => {
    setFilter(side);
  };
  //Declare selected button Use State
  const [selectedButton, setSelectedButton] = useState("villager");
  const { selectedCards, setSelectedCards, selectedCardsLoading, numberOfPlayers, setNumberOfPlayers, total, setTotal } =
    useContext(DeckContext);
  //Timer
  const [seconds, setSeconds] = useState(0);
  const minutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;
  //Side Button Component
  useEffect(() => {
    async function getCards() {
      const { data, error } = await supabase.from("cards").select("*");
      if (error) {
        console.log("Error fetching cards: ", error);
        return;
      }
      if (data) {
        console.log(data);
        setCards(data.sort((a, b) => a.order - b.order));
      }
    }
    getCards();
  }, []);

  useEffect(() => {
    async function getTimer(userId) {
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", userId);

      if (error) {
        console.log("Error fetching deck: ", error);
        return;
      }

      if (data) {
        console.log(data);
        setSeconds(data[0]?.timer);
      } else {
        setSeconds(0);
      }
    }
    if (user?.id) {
      console.log(user.id);
      getTimer(user?.id);
    }
  }, [user?.id]);

  const SideButton = ({ title, value, color }) => {
    const handleSelectButton = () => {
      setSelectedButton(value);
    };
    return (
      <button
        type="button"
        className="py-2 px-3 rounded-md transition hover:scale-110"
        onClick={() => {
          handleFilter(value);
          handleSelectButton();
        }}
        style={{
          backgroundColor: selectedButton === value ? color : "#4D4446",
        }}
      >
        <p className="text-white text-lg font-semibold uppercase">{title}</p>
      </button>
    );
  };
  return (
    <>
      <Outlet />
      <div className="flex-1 bg-[#241F21] items-center justify-center w-full mt-24">
        <h1 className="text-white text-4xl uppercase font-semibold tracking-wide text-center mb-12">
          Set Up
        </h1>

        {/* Number Of Players Button */}
        <div className="flex flex-row justify-evenly items-center my-4">
          <button
            onClick={() => {
              {
                numberOfPlayers > 5
                  ? setNumberOfPlayers(numberOfPlayers - 1)
                  : null;
              }
            }}
            className="w-10 h-10 p-2 rounded-xl bg-[#4D4446] flex flex-row items-center justify-center"
          >
            <ArrowLeftIcon fontSize="large" />
          </button>
          <h2 className="text-white text-2xl uppercase font-semibold tracking-wide">
            {numberOfPlayers} Players
          </h2>
          <button
            onClick={() => {
              setNumberOfPlayers(numberOfPlayers + 1);
            }}
            className="w-10 h-10 p-2 rounded-xl bg-[#4D4446] flex flex-row items-center justify-center"
          >
            <ArrowRightIcon fontSize="large" />
          </button>
        </div>

        <hr className="w-3/5 my-0 mx-auto opacity-30 border-2" />

        {/* Balance */}
        <div className="flex justify-center items-center my-4">
          <h2 className="text-white text-xl uppercase font-semibold tracking-wide">
            Balance: {total}
          </h2>
        </div>

        <hr className="w-3/5 my-0 mx-auto opacity-30 border-2" />

        {/* Side Buttons */}
        <div className="flex flex-row items-center justify-evenly w-full mt-8">
          {Sides.map((side) => {
            return (
              <SideButton
                title={side.title}
                value={side.value}
                color={side.hexColor}
                key={side.index}
              />
            );
          })}
        </div>

        {/* Cards */}
        <div className="flex-1 flex-row justify-center w-3/5 h-[38rem] my-8 mx-auto">
          {selectedCardsLoading ? (
            <Spinner />
          ) : (
            Cards.map((item) => {
              if (item.side === filter) {
                return (
                  <Card
                    DeckId={user.id}
                    id={item.id}
                    side={item.side}
                    order={item.order}
                    value={item.value}
                    title={item.title}
                    limit={item.limit}
                    link={item.link}
                    key={item.id}
                    setTotal={setTotal}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                    numberOfPlayers={numberOfPlayers}
                  />
                );
              }
              return null;
            })
          )}
        </div>

        {/* Timer */}
        <div className="relative bottom-0 w-full top-[94%]">
          <hr className="w-3/5 my-0 mx-auto opacity-30 border-2" />
          <h2 className="text-white text-xl uppercase font-semibold tracking-wide text-center my-4">
            Daylight Timer
          </h2>
          <div className="flex flex-row justify-evenly items-start mb-4">
            <button
              onClick={() => {
                setSeconds((seconds) => seconds - 1);
              }}
              className="w-12 h-12 p-2 rounded-xl bg-[#4D4446] flex flex-row items-center justify-center"
            >
              <ArrowLeftIcon fontSize="large" />
            </button>
            <h1 className="text-white text-5xl uppercase font-semibold tracking-wide">
              {`${minutes}:${displaySeconds < 10 ? "0" : ""}${displaySeconds}`}
            </h1>
            <button
              onClick={() => {
                setSeconds((seconds) => seconds + 1);
              }}
              className="w-12 h-12 p-2 rounded-xl bg-[#4D4446] flex flex-row items-center justify-center"
            >
              <ArrowRightIcon fontSize="large" />
            </button>
          </div>

          <hr className="w-3/5 my-0 mx-auto opacity-30 border-2" />

          {/* Start Button */}
          <div className="w-3/5 mx-auto my-8">
            <button
              className="bg-white p-2 w-full rounded-lg hover:animate-pulse"
              onClick={() => {
                async function updateDeck() {
                  const totalSelectedCards = selectedCards.reduce(
                    (acc, card) => acc + card.numberOfCards,
                    0
                  );
                  if (totalSelectedCards === numberOfPlayers) {
                    const { error: updateError } = await supabase
                      .from("decks")
                      .update({
                        timer: seconds,
                      })
                      .eq("id", user.id);
                    const { error: insertError } = await supabase
                      .from("decks_cards")
                      .upsert(selectedCards);

                    const allCardIds = Cards.map((card) => card.id);

                    // Extract selected card IDs
                    const selectedCardIds = selectedCards.map(
                      (card) => card.id
                    );

                    // Filter out selected card IDs from all card IDs to get unselected card IDs
                    const unselectedCardIds = allCardIds.filter(
                      (id) => !selectedCardIds.includes(id)
                    );
                    console.log(unselectedCardIds);
                    // const { error: deleteError } = await supabase
                    //   .from("decks_cards")
                    //   .delete()
                    //   .in("card_id", unselectedCardIds)
                    //   .eq("deck_id", user.id); // Assuming user.id is the id of the deck

                    // if (deleteError) {
                    //   console.log(
                    //     "Error deleting unselected cards: ",
                    //     deleteError.message
                    //   );
                    // } else {
                    //   console.log("Unselected cards deleted successfully");
                    // }

                    setLoading(true);
                    if (updateError) {
                      console.log("Error updating deck: ", updateError.message);
                    } else if (insertError) {
                      console.log("Error updating deck: ", insertError.message);
                    } else {
                      console.log("Deck updated successfully");
                    }
                  } else {
                    alert("Please select the correct number of players");
                  }
                  setLoading(false);
                }
                updateDeck();
              }}
            >
              <h3 className="text-black text-2xl font-semibold uppercase p-1 px-2 text-center">
                Save and Play
              </h3>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SetUp;
