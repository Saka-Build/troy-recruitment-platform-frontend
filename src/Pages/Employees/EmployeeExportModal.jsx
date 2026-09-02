import React, { useState } from "react";
import { useDispatch } from "react-redux";

import "./EmployeeExportModal.css";

import {
    exportEmployees,
} from "../../Redux/Slice/employeeSlice";


const EmployeeExportModal = ({
    isOpen,
    onClose,
}) => {

    const dispatch = useDispatch();


    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [active, setActive] =
        useState("");

    const [isExporting, setIsExporting] =
        useState(false);


    if (!isOpen) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | EXPORT EMPLOYEES
    |--------------------------------------------------------------------------
    */

    const handleExport = async () => {

        try {

            setIsExporting(true);


            const exportParams = {};


            /*
            |--------------------------------------------------------------------------
            | FROM DATE
            |--------------------------------------------------------------------------
            */

            if (fromDate) {

                exportParams.fromDate =
                    `${fromDate}T00:00:00`;
            }


            /*
            |--------------------------------------------------------------------------
            | TO DATE
            |--------------------------------------------------------------------------
            */

            if (toDate) {

                exportParams.toDate =
                    `${toDate}T23:59:59`;
            }


            /*
            |--------------------------------------------------------------------------
            | ACTIVE / INACTIVE
            |--------------------------------------------------------------------------
            */

            if (active !== "") {

                exportParams.active =
                    active === "true";
            }

            /*
            |--------------------------------------------------------------------------
            | CALL EXPORT API
            |--------------------------------------------------------------------------
            */

            const result =
                await dispatch(
                    exportEmployees(
                        exportParams
                    )
                ).unwrap();


            const contentType =
                result?.headers?.[
                    "content-type"
                ] || "";

            if (
                contentType.includes(
                    "application/json"
                ) ||
                contentType.includes(
                    "text/plain"
                )
            ) {

                const text =
                    await result.data.text();


                console.error(
                    "EXPORT API ERROR:",
                    text
                );


                let errorMessage =
                    text;


                try {

                    const json =
                        JSON.parse(text);


                    errorMessage =
                        json.message ||
                        json.error ||
                        text;

                } catch {

                    // Not JSON
                }


                alert(
                    errorMessage ||
                    "Failed to export employees."
                );


                return;
            }
            if (
                !result?.data ||
                result.data.size === 0
            ) {

                alert(
                    "Export returned an empty file."
                );


                return;
            }


            /*
            |--------------------------------------------------------------------------
            | USE BACKEND BLOB DIRECTLY
            |--------------------------------------------------------------------------
            */

            const blob =
                result.data;

            let fileName =
                "troy-employees.xls";


            const contentDisposition =
                result?.headers?.[
                    "content-disposition"
                ] || "";


            const fileNameMatch =
                contentDisposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                );


            if (fileNameMatch?.[1]) {

                fileName =
                    fileNameMatch[1]
                        .replace(
                            /['"]/g,
                            ""
                        )
                        .trim();
            }

            const url =
                window.URL.createObjectURL(
                    blob
                );


            /*
            |--------------------------------------------------------------------------
            | CREATE DOWNLOAD LINK
            |--------------------------------------------------------------------------
            */

            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                fileName;


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            /*
            |--------------------------------------------------------------------------
            | CLEANUP
            |--------------------------------------------------------------------------
            */

            setTimeout(() => {

                window.URL.revokeObjectURL(
                    url
                );

            }, 100);


            /*
            |--------------------------------------------------------------------------
            | RESET FILTERS
            |--------------------------------------------------------------------------
            */

            setFromDate("");
            setToDate("");
            setActive("");


            /*
            |--------------------------------------------------------------------------
            | CLOSE MODAL
            |--------------------------------------------------------------------------
            */

            onClose();


        } catch (error) {

            console.error(
                "EMPLOYEE EXPORT FAILED:",
                error
            );


            alert(
                typeof error === "string"
                    ? error
                    : error?.message ||
                      "Failed to export employees."
            );


        } finally {

            setIsExporting(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | CLOSE MODAL
    |--------------------------------------------------------------------------
    */

    const handleClose = () => {

        if (isExporting) {
            return;
        }


        setFromDate("");
        setToDate("");
        setActive("");


        onClose();
    };


    return (

        <div className="employee-export-overlay">

            <div className="employee-export-modal">


                {/* HEADER */}

                <div className="employee-export-header">

                    <div>

                        <h2>
                            Export Employees
                        </h2>

                        <p>
                            Choose optional filters for your export
                        </p>

                    </div>


                    <button
                        type="button"
                        className="employee-export-close"
                        onClick={handleClose}
                        disabled={isExporting}
                    >
                        ×
                    </button>

                </div>


                {/* BODY */}

                <div className="employee-export-body">


                    {/* DATE FILTERS */}

                    <div className="employee-export-date-row">


                        {/* FROM DATE */}

                        <div className="employee-export-field">

                            <label>
                                From date
                            </label>


                            <div className="employee-export-date-wrapper">

                                <input
                                    type="date"
                                    value={fromDate}
                                    max={
                                        toDate ||
                                        undefined
                                    }
                                    onChange={(e) =>
                                        setFromDate(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        isExporting
                                    }
                                />

                            </div>

                        </div>


                        {/* TO DATE */}

                        <div className="employee-export-field">

                            <label>
                                To date
                            </label>


                            <div className="employee-export-date-wrapper">

                                <input
                                    type="date"
                                    value={toDate}
                                    min={
                                        fromDate ||
                                        undefined
                                    }
                                    onChange={(e) =>
                                        setToDate(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        isExporting
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="employee-export-field employee-export-status-field">

                        <label>
                            Status
                        </label>


                        <select
                            value={active}
                            onChange={(e) =>
                                setActive(
                                    e.target.value
                                )
                            }
                            disabled={
                                isExporting
                            }
                        >

                            <option value="">
                                All statuses
                            </option>

                            <option value="true">
                                Active
                            </option>

                            <option value="false">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* INFO */}

                    <div className="employee-export-info">

                        <span className="employee-export-info-icon">
                            i
                        </span>

                        <span>
                            Leave all filters empty to export all employees.
                        </span>

                    </div>

                </div>


                {/* FOOTER */}

                <div className="employee-export-footer">


                    <button
                        type="button"
                        className="employee-export-cancel-btn"
                        onClick={handleClose}
                        disabled={isExporting}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="employee-export-btn"
                        onClick={handleExport}
                        disabled={isExporting}
                    >

                        {isExporting
                            ? "Exporting..."
                            : "Export"}

                    </button>

                </div>

            </div>

        </div>
    );
};


export default EmployeeExportModal;