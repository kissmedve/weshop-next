import React from "react";

function PaginationButtons({ numberOfPages, currentPage, paginate }) {
  const paginationList = (numberOfPages, currentPage, paginate) => {
    let pageList = [];
    if (numberOfPages < 8) {
      for (let i = 1; i < numberOfPages + 1; i++) {
        pageList.push(i);
      }
    }
    if (
      numberOfPages > 7 &&
      currentPage > 4 &&
      currentPage < numberOfPages - 3
    ) {
      pageList.push(1, "...");
      for (let i = currentPage - 1; i < currentPage + 2; i++) {
        pageList.push(i);
      }
      pageList.push("...", numberOfPages);
    }
    if (numberOfPages > 7 && currentPage < 5) {
      for (let i = 1; i < 6; i++) {
        pageList.push(i);
      }
      pageList.push("...", numberOfPages);
    }
    if (numberOfPages > 7 && currentPage > numberOfPages - 4) {
      pageList.push(1, "...");
      for (let i = numberOfPages - 4; i < numberOfPages + 1; i++) {
        pageList.push(i);
      }
    }

    const listedPages = pageList.map((page, index) => {
      if (numberOfPages === 1) {
        return (
          <li key={index}>
            <button
              className="btn pagination-link"
              aria-label={`Page ${page}`}
              onClick={(event) => paginate(event, page)}
            >
              {page}
            </button>
          </li>
        );
      }
      if (numberOfPages > 1 && page !== "...") {
        return (
          <li key={index}>
            <button
              className={
                page === currentPage
                  ? `btn pagination-link is-current`
                  : `btn pagination-link`
              }
              aria-label={
                page === currentPage ? `Page ${page}` : `Go to page ${page}`
              }
              onClick={(event) => paginate(event, page)}
            >
              {page}
            </button>
          </li>
        );
      }
      if (page === "...") {
        return (
          <li key={index}>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        );
      }
      return page;
    });
    return listedPages;
  };

  return (
    <>
      <nav
        className="pagination is-centered"
        role="navigation"
        aria-label="pagination"
      >
        {currentPage > 1 && (
          <button
            className="pagination-previous"
            onClick={(event) => paginate(event, currentPage - 1)}
          >
            Previous
          </button>
        )}
        {currentPage < numberOfPages && (
          <button
            className="pagination-next"
            onClick={(event) => paginate(event, currentPage + 1)}
          >
            Next
          </button>
        )}
        <ul className="pagination-list">
          {paginationList(numberOfPages, currentPage, paginate)}
        </ul>
      </nav>
    </>
  );
}

export default PaginationButtons;
