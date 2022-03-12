import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { Color } from "../../../../api/types";

export default function ColorSelect({ color, onChange }) {
  return (
    <div className="flex space-x-6 justify-center">
      <RadioInput
        label="Black"
        selectedColor={color}
        value={Color.Black}
        onChange={onChange}
      />
      <RadioInput
        label="White"
        selectedColor={color}
        value={Color.White}
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
    <div className={`border ${borderStyle} pl-2 pr-2 text-xl`}>
      <VisuallyHidden>
        <input
          key={id}
          checked={checked}
          id={id}
          name="player-color"
          type="radio"
          value={value}
          onChange={() => onChange(value)}
        />
      </VisuallyHidden>
      <label key={id + "-label"} className="cursor-pointer" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
