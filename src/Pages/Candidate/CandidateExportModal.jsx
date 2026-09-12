import React from "react";

function CandidateExportModal({
    isOpen,
    onClose,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    status,
    setStatus,
    onClear,
    onExport,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="candidate-filter-modal-overlay"
            onClick={onClose}
        >
            <div
                className="candidate-filter-modal candidate-export-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="candidate-filter-modal-header">
                    <div>
                        <h3>Export Candidates</h3>
                        <p>Select the filters you want to use for the Excel export.</p>
                    </div>

                    <button
                        type="button"
                        className="candidate-filter-close-btn"
                        onClick={onClose}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="candidate-filter-modal-body">
                    <div className="candidate-filter-field">
                        <label>From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>

                    <div
                        className="candidate-filter-field"
                        style={{ marginTop: "18px" }}
                    >
                        <label>To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>

                    <div
                        className="candidate-filter-field"
                        style={{ marginTop: "18px" }}
                    >
                        <label>Candidate Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Blacklisted">Blacklisted</option>
                        </select>
                    </div>
                </div>

                <div className="candidate-filter-modal-footer">
                    <button
                        type="button"
                        className="candidate-filter-clear-btn"
                        onClick={onClear}
                    >
                        Clear
                    </button>

                    <button
                        type="button"
                        className="candidate-filter-cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="candidate-filter-apply-btn"
                        onClick={onExport}
                    >
                        <i className="fas fa-download"></i>
                        Export Excel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CandidateExportModal;