import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import { DeckContext } from '../components/DeckContext'
import { supabase } from '../supabase'
import SideButton from '../components/SideButton'
import Card from '../components/Card'


export default function SetUp() {
  const [cards, setCards] = useState([])
  const [sides, setSides] = useState([])
  const [timer, setTimer] = useState(0)

  const [filteredCards, setFilteredCards] = useState([])

  const { total, setTotal, numberOfPlayers, setNumberoFNumbers, selectedCards, setSelectedCards, selectedCardsLoading, } = useContext(DeckContext)

  const [selectedSideButton, setSelectedSideButton] = useState(1);

  const [selectedCard, setSelectedCard] = useState(0)

  const handleSideButtonClick = (id) => {
    setSelectedSideButton(id);
  }

  useEffect(() => {
    async function getCards() {
      const { data, error } = await supabase
        .from("cards")
        .select("*").order("id", { ascending: true })

      if (error) {
        console.log("Error fetching cards: ", error)
        return
      }

      if (data) {
        setCards(data)
        console.log("Cards: ", data)
      }
    }

    async function getSides() {
      const { data, error } = await supabase
        .from("sides")
        .select("*").order("id", { ascending: true })

      if (error) {
        console.log("Error fetching sides: ", error)
        return
      }

      if (data) {
        setSides(data)
        console.log("Sides: ", data)
      }
    }

    if (cards.length === 0) {
      getCards()
    }

    if (sides.length === 0) {
      getSides()
    }
  }, [])

  useEffect(() => {
    if (cards.length > 0 && sides.length > 0) {
      const filtered = cards.filter((card) => card.side_id === selectedSideButton)
      setFilteredCards(filtered)
      console.log("Filtered: ", filtered)
    } else {
      console.log("No cards or sides")
    }
  }, [selectedSideButton, cards, sides])
  return (
    <>
      <div>SetUp</div>
      <div>Total: {total}</div>
      <div>Players: {numberOfPlayers}</div>

      <div>
        {
          sides.map((side) => (
            <SideButton
              key={side.id}
              id={side.id}
              name={side.name}
              hex_color={side.hex_color}
              selected={selectedSideButton === side.id}
              onClick={handleSideButtonClick}
            />
          ))
        }
      </div>

      <div>
        {
          filteredCards.map((card) => (
            <Card 
              key={card.id}
              score={card.score}
              title={card.title}
              card_limit={card.card_limit}
              link={card.link}
              setTotal={setTotal}
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
              numberOfPlayers={numberOfPlayers}
            />
          ))
        }
      </div>
    </>
  )
}
