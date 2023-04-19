import React from "react";

function SelectStatus({ handleChange, id, status, withLabel, withOptionAll }) {
  return (
    <>
      <div className="field">
        {withLabel && (
          <label htmlFor="status" className="label">
            Status
          </label>
        )}
        <div className="select is-normal">
          <select
            name="status"
            value={status}
            onChange={(event) => handleChange(event, id)}
          >
            {withOptionAll && <option value="all">All</option>}
            <option value="0">Open</option>
            <option value="1">In Delivery</option>
            <option value="2">Processed</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default SelectStatus;
