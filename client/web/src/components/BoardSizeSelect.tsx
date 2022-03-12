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
    <div className="flex space-x-6 justify-center">
      <RadioInput selectedSize={selectedSize} value={"9"} onChange={setSize} />
      <RadioInput selectedSize={selectedSize} value={"13"} onChange={setSize} />
      <RadioInput selectedSize={selectedSize} value={"19"} onChange={setSize} />
    </div>
  );
}

function RadioInput({ value, selectedSize, onChange }) {
  const id = `goban-size-radio-input-${value}`;
  const checked = selectedSize === value;
  const borderStyle = checked ? "border-gray-500" : "border-white";
  return (
    <div className={`border ${borderStyle} pl-2 pr-2 text-xl`}>
      <VisuallyHidden>
        <input
          key={id}
          checked={checked}
          id={id}
          name="goban-size"
          type="radio"
          value={value}
          onChange={() => onChange(value)}
        />
      </VisuallyHidden>
      <label
        key={id + "-label"}
        className="cursor-pointer"
        htmlFor={id}
      >{`${value} x ${value}`}</label>
    </div>
  );
}
