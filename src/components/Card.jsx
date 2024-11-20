import React from 'react'

export default function Card({score, title, card_limit, link, setTotal, selectedCards, setSelectedCards, numberOfPlayers}) {
  
    return (
    <>
        <img src={link} alt={title} />
        <p>{title}</p>
    </>
  )
}
