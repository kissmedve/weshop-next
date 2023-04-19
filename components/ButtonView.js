import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function ButtonEdit({ path, title }) {
  return (
    <Link href={path}>
      <a
        className="button is-small has-background-white has-text-grey-dark"
        title={title}
      >
        <span className="icon is-small">
          <FontAwesomeIcon icon={faEye} style={{ fontSize: 16 }} />
        </span>
      </a>
    </Link>
  );
}

export default ButtonEdit;
