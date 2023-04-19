import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

function ButtonDelete({ deleteFunction, id, title }) {
  return (
    <button
      className="button is-small has-text-orange delete-item"
      title={title}
      onClick={(event) => {
        deleteFunction(id);
      }}
    >
      <span className="icon is-small">
        <FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: 16 }} />
      </span>
    </button>
  );
}

export default ButtonDelete;
