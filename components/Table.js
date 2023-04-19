import React from "react";

function Table({ headings, subheadings, items, rows, emptyMessage }) {
  let cols = headings
    .map((heading) => heading[1])
    .reduce((acc, curr) => acc + curr, 0);
  return (
    <table className="table is-striped is-narrow">
      <thead>
        <tr>
          {headings &&
            headings.map((heading, index) => (
              <th key={index} colSpan={heading[1]} rowSpan={heading[2]}>
                {heading[0]}
              </th>
            ))}
        </tr>
        <tr>
          {subheadings &&
            subheadings.map((subheading, index) => (
              <th key={index} colSpan={subheading[1]}>
                {subheading[0]}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {items.length < 1 && (
          <tr>
            <td colSpan={cols}>{emptyMessage}</td>
          </tr>
        )}
        {items.length > 0 &&
          rows.map((row) => (
            <tr key={row[1]}>
              {row[0].map((rowItem, i) => (
                <td key={i}>{rowItem}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default Table;
