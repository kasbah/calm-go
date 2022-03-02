import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";

export default function BoardSizeSelect({ onChange, size }) {
  const [selectedSize, setSize] = React.useState(size);
  React.useEffect(() => {
    setSize(size);
  }, [size]);
  React.useEffect(() => {
    if (typeof onChange === "function") {
      onChange(selectedSize);
    }
  }, [selectedSize]);
  return (
    <div className="flex space-x-6 justify-left">
      <RadioInput value={"9"} selectedSize={selectedSize} onChange={setSize} />
      <RadioInput value={"13"} selectedSize={selectedSize} onChange={setSize} />
      <RadioInput value={"19"} selectedSize={selectedSize} onChange={setSize} />
    </div>
  );
}

function RadioInput({ value, selectedSize, onChange }) {
  const id = `goban-size-radio-input-${value}`;
  const checked = selectedSize === value;
  const borderStyle = checked ? "border-gray-500" : "border-white";
  return (
    <div className={`border ${borderStyle} pl-2 pr-2 rounded-full text-xl`}>
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
      <label
        className="cursor-pointer"
        key={id + "-label"}
        htmlFor={id}
      >{`${value} x ${value}`}</label>
    </div>
  );
}
