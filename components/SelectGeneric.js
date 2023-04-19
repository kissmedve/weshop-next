import React from "react";
import { capitalize } from "../utils/capitalize";

function SelectGeneric({
  optionsArray,
  arrayName,
  arrayItemName,
  arrayItemId,
  selectionName,
  handleChange,
  selectedOption,
  withSelect,
}) {
  return (
    <div className="field">
      <label htmlFor={selectionName} className="label">
        {arrayName}
      </label>
      <div className="select is-normal">
        <select
          name={selectionName}
          value={selectedOption}
          onChange={handleChange}
        >
          {withSelect && <option value="">Select</option>}
          {optionsArray.map((arrayItem, index) => (
            <option key={index} value={arrayItemId}>
              {capitalize(arrayItemName)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectGeneric;
