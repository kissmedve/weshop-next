import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

function ButtonPrint({ printFunction, title }) {
  return (
    <button
      className="button is-small has-background-grey-dark has-text-white-ter delete-item"
      title={title}
      onClick={(event) => {
        printFunction;
      }}
    >
      <span className="icon is-small">
        <FontAwesomeIcon icon={faPrint} style={{ fontSize: 16 }} />
      </span>
    </button>
  );
}

export default ButtonPrint;
