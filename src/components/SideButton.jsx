import React from 'react';

export default function SideButton({ id, name, hex_color, selected, onClick }) {
  return (
    <button
      className={`w-1/3 ${selected ? 'selected' : ''}`}
      style={{ backgroundColor: selected ? hex_color : 'grey' }}
      onClick={() => onClick(id)}
    >
      {name}
    </button>
  );
}