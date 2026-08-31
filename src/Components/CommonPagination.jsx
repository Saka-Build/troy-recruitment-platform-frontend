import React from "react";
import "./Common.css";

function CommonPagination({currentPage,totalPages,totalItems,itemsPerPage,onPageChange,itemLabel = "items",}) {
    if (totalPages <= 1 && totalItems === 0) {
        return null;
    }

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min( currentPage * itemsPerPage, totalItems);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="pagination-wrapper">

            <div className="pagination-info">
                Showing{" "}
                <strong>{startItem}</strong>{" "}
                –{" "}
                <strong>{endItem}</strong>{" "}
                of{" "}
                <strong>{totalItems}</strong>{" "}
                {itemLabel}
            </div>

            <div className="pagination-container">

                <button
                    type="button"
                    className="pagination-btn pagination-arrow"
                    onClick={() =>onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        className={`pagination-btn ${ currentPage === page ? "pagination-active" : ""}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    className="pagination-btn pagination-arrow"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={ currentPage === totalPages}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>

            </div>
        </div>
    );
}

export default CommonPagination;