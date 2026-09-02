import React, { useState } from "react";
import "./Employees.css";

function EmployeeExportModal({
    onClose,
    onExport,
    isExporting,
}) {

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [status, setStatus] =
        useState("all");


    const handleExport = () => {

        let active;

        if (status === "active") {
            active = true;
        }

        if (status === "inactive") {
            active = false;
        }

        onExport({
            fromDate: fromDate
                ? `${fromDate}T00:00:00`
                : undefined,

            toDate: toDate
                ? `${toDate}T23:59:59`
                : undefined,

            active,
        });
    };


    return (
        <div className="employee-export-overlay">

            <div className="employee-export-modal">

                <div className="employee-export-header">

                    <div>

                        <h2>
                            Export Employees
                        </h2>

                        <p>
                            Select the filters for the employee export.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="employee-export-close"
                        onClick={onClose}
                        disabled={isExporting}
                    >
                        ×
                    </button>

                </div>


                <div className="employee-export-body">

                    {/* FROM DATE */}

                    <div className="employee-export-field">

                        <label>
                            From Date
                        </label>

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(event) =>
                                setFromDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* TO DATE */}

                    <div className="employee-export-field">

                        <label>
                            To Date
                        </label>

                        <input
                            type="date"
                            value={toDate}
                            onChange={(event) =>
                                setToDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    {/* STATUS */}

                    <div className="employee-export-field">

                        <label>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                        >

                            <option value="all">
                                All Employees
                            </option>

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>


                <div className="employee-export-footer">

                    <button
                        type="button"
                        className="employee-export-cancel-btn"
                        onClick={onClose}
                        disabled={isExporting}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="employee-export-confirm-btn"
                        onClick={handleExport}
                        disabled={isExporting}
                    >

                        {isExporting
                            ? "Exporting..."
                            : "Export Employees"}

                    </button>

                </div>

            </div>

        </div>
    );
}

export default EmployeeExportModal;