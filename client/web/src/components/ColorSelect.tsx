import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { Color } from "../../../../api/types";

export default function ColorSelect({ color, onChange }) {
  return (
    <div className="flex space-x-6 justify-center">
      <RadioInput
        value={Color.Black}
        label="Black"
        selectedColor={color}
        onChange={onChange}
      />
      <RadioInput
        value={Color.White}
        label="White"
        selectedColor={color}
        onChange={onChange}
      />
    </div>
  );
}

function RadioInput({ value, label, selectedColor, onChange }) {
  const id = `player-color-radio-input-${value}`;
  const checked = selectedColor === value;
  const borderStyle = checked ? "border-gray-500" : "border-white";
  return (
    <div className={`border ${borderStyle} pl-2 pr-2 rounded-full text-xl`}>
      <VisuallyHidden>
        <input
          type="radio"
          id={id}
          key={id}
          name="player-color"
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
        />
      </VisuallyHidden>
      <label
        className="cursor-pointer"
        key={id + "-label"}
        htmlFor={id}
      >{label}</label>
    </div>
  );
}
