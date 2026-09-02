import React from "react";
import "./Common.css";

function CommonPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    itemLabel = "items",
}) {
    if (totalPages <= 1 && totalItems === 0) {
        return null;
    }

    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    /*
     * =========================================================
     * PAGE NUMBERS
     *
     * <= 5 pages:
     * 1 2 3 4 5
     *
     * More than 5 pages:
     *
     * First:
     * 1 2 3 ... 259
     *
     * Middle:
     * 1 ... 49 50 51 ... 259
     *
     * Last:
     * 1 ... 257 258 259
     * =========================================================
     */

    const getPages = () => {
        // Show all pages if there are 5 or fewer
        if (totalPages <= 5) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        // Page 1, 2 or 3
        if (currentPage <= 3) {
            return [
                1,
                2,
                3,
                "...",
                totalPages,
            ];
        }

        // Last 3 pages
        if (currentPage >= totalPages - 2) {
            return [
                1,
                "...",
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        // Middle pages
        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    const pages = getPages();

    return (
        <div className="pagination-wrapper">

            {/* =================================================
                PAGINATION INFO
            ================================================= */}

            <div className="pagination-info">
                Showing{" "}
                <strong>{startItem}</strong>{" "}
                –{" "}
                <strong>{endItem}</strong>{" "}
                of{" "}
                <strong>{totalItems}</strong>{" "}
                {itemLabel}
            </div>


            {/* =================================================
                PAGINATION BUTTONS
            ================================================= */}

            <div className="pagination-container">

                {/* PREVIOUS */}

                <button
                    type="button"
                    className="pagination-btn pagination-arrow"
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>


                {/* PAGE NUMBERS */}

                {pages.map((page, index) => {

                    // Ellipsis
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="pagination-ellipsis"
                            >
                                ...
                            </span>
                        );
                    }

                    // Page button
                    return (
                        <button
                            key={page}
                            type="button"
                            className={`pagination-btn ${
                                currentPage === page
                                    ? "pagination-active"
                                    : ""
                            }`}
                            onClick={() =>
                                onPageChange(page)
                            }
                        >
                            {page}
                        </button>
                    );
                })}


                {/* NEXT */}

                <button
                    type="button"
                    className="pagination-btn pagination-arrow"
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                    disabled={
                        currentPage === totalPages
                    }
                >
                    <i className="bi bi-chevron-right"></i>
                </button>

            </div>

        </div>
    );
}

export default CommonPagination;