import React from "react";

function SelectTagGroups({ tagGroups, handleChange, selectedTagGroup }) {
  return (
    <>
      <div className="field">
        <label htmlFor="tagGroup" className="label">
          Tag Group
        </label>
        <div className="select is-normal">
          <select
            name="tagGroup"
            value={selectedTagGroup}
            onChange={handleChange}
          >
            <option value="">All</option>
            {tagGroups.map((tagGroup) => (
              <option key={tagGroup._id} value={tagGroup._id}>
                {tagGroup.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default SelectTagGroups;
