import React from "react";
import Link from "next/link";

function ButtonLink({ path, name }) {
  return (
    <Link href={path}>
      <a className="button is-normal has-background-grey-dark has-text-white ">
        {name}
      </a>
    </Link>
  );
}

export default ButtonLink;
