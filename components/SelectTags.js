import React from "react";

function SelectTags({ tags, handleChange, productTag, productId }) {
  // find unique tagGroups
  const tagTagGroups = tags
    .map((tag) => tag?.tagGroup?.name)
    .filter((group) => group !== undefined);
  const extractedTagGroups = [...new Set(tagTagGroups)];

  return (
    <>
      <div className="field">
        <label htmlFor="tag" className="label">
          Product Type
        </label>
        <div className="select is-normal">
          <select
            name="tag"
            value={productTag}
            onChange={(event) => handleChange(event, productId)}
          >
            <option value="all">All</option>
            {extractedTagGroups.map((group, index) => (
              <optgroup key={index} label={group}>
                {tags.map((tag) =>
                  tag.tagGroup ? (
                    tag.tagGroup.name === group ? (
                      <option key={tag._id} value={tag._id}>
                        {tag.name}
                      </option>
                    ) : null
                  ) : null
                )}
              </optgroup>
            ))}
            {tags.find((tag) => !tag.tagGroup) ? (
              <optgroup key={extractedTagGroups.length + 1} label="No Group">
                {tags.map((tag) =>
                  !tag.tagGroup ? (
                    <option key={tag._id} value={tag._id}>
                      {tag.name}
                    </option>
                  ) : null
                )}
              </optgroup>
            ) : null}
          </select>
        </div>
      </div>
    </>
  );
}

export default SelectTags;
