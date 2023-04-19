import React from "react";

function SelectResultsPerPage({ handleChange, resultsPerPage, options }) {
  return (
    <>
      <div className="field">
        <label htmlFor="results" className="label">
          Results per page
        </label>
        <div className="select is-normal">
          <select name="results" value={resultsPerPage} onChange={handleChange}>
            {options &&
              options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default SelectResultsPerPage;
