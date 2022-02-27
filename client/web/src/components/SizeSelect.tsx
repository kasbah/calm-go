import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";

export default function SizeSelect({ onChange }) {
  const [size, setSize] = React.useState("9");
  React.useEffect(() => {
    if (typeof onChange === "function") {
      onChange(parseInt(size, 10));
    }
  }, [size]);
  return (
    <div className="flex space-x-6  justify-center">
      <RadioInput value={"9"} selectedSize={size} onChange={setSize} />
      <RadioInput value={"13"} selectedSize={size} onChange={setSize} />
      <RadioInput value={"19"} selectedSize={size} onChange={setSize} />
    </div>
  );
}

function RadioInput({ value, selectedSize, onChange }) {
  const id = `goban-size-radio-input-${value}`;
  const checked = selectedSize === value;
  const borderStyle = checked ? "border-gray-500" : "border-white";
  return (
    <div className={`border ${borderStyle} pl-1 pr-1 rounded-full text-xl`}>
      <VisuallyHidden>
        <input
          type="radio"
          id={id}
          key={id}
          name="goban-size"
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
        />
      </VisuallyHidden>
      <label key={id + "-label"} htmlFor={id}>{`${value} x ${value}`}</label>
    </div>
  );
}
