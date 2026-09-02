import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./JobExportModal.css";

import {
    exportJobs,
    getJobFilters,
} from "../../Redux/Slice/jobSlice";


const JobExportModal = ({
    isOpen,
    onClose,
}) => {

    const dispatch = useDispatch();

    const {
        jobFilters = {},
        isJobFiltersLoading = false,
        isExporting = false,
        exportError = null,
    } = useSelector(
        (state) => state.jobs || {}
    );


    const {
        statuses = [],
        priorities = [],
    } = jobFilters;


    /* =========================================================
       FORM STATE
    ========================================================= */

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Store the actual status/priority NAME
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");


    /* =========================================================
       LOAD JOB FILTERS WHEN MODAL OPENS
    ========================================================= */

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        dispatch(getJobFilters());

    }, [
        isOpen,
        dispatch,
    ]);


    /* =========================================================
       RESET FORM WHEN MODAL CLOSES
    ========================================================= */

    useEffect(() => {

        if (!isOpen) {

            setFromDate("");
            setToDate("");
            setStatus("");
            setPriority("");

        }

    }, [isOpen]);


    /* =========================================================
       FORMAT STATUS LABEL
    ========================================================= */

    const formatStatusLabel = (value) => {

        if (value === "On_hold") {
            return "On hold";
        }

        return value;
    };


    /* =========================================================
       DOWNLOAD FILE
    ========================================================= */

    const downloadFile = (response) => {

        if (!response) {
            return;
        }

        const blobData =
            response?.data instanceof Blob
                ? response.data
                : response?.data?.data instanceof Blob
                    ? response.data.data
                    : response?.data;


        if (!blobData) {
            console.error(
                "No export file received."
            );

            return;
        }


        const blob =
            blobData instanceof Blob
                ? blobData
                : new Blob(
                    [blobData],
                    {
                        type:
                            response?.headers?.["content-type"] ||
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    }
                );


        /* =====================================================
           GET FILE NAME
        ===================================================== */

        const contentDisposition =
            response?.headers?.["content-disposition"] ||
            response?.headers?.["Content-Disposition"];


        let fileName =
            "jobs-export.xlsx";


        if (contentDisposition) {

            const fileNameMatch =
                contentDisposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                );


            if (fileNameMatch?.[1]) {

                fileName =
                    fileNameMatch[1]
                        .replace(/['"]/g, "")
                        .trim();

            }

        }


        /* =====================================================
           CREATE DOWNLOAD
        ===================================================== */

        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;
        link.download = fileName;


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        window.URL.revokeObjectURL(url);

    };


    /* =========================================================
       EXPORT
    ========================================================= */

    const handleExport = async () => {

        try {

            const params = {};

            /* =====================================================
               DATE FILTERS
            ===================================================== */

            if (fromDate) {
                params.fromDate = fromDate;
            }

            if (toDate) {
                params.toDate = toDate;
            }


            /* =====================================================
               STATUS NAME → statusId
            ===================================================== */

            if (status) {
                params.statusId = status;
            }


            /* =====================================================
               PRIORITY NAME → priorityId
            ===================================================== */

            if (priority) {
                params.priorityId = priority;
            }


            console.log(
                "Export Jobs params:",
                params
            );


            /* =====================================================
               CALL EXPORT API
            ===================================================== */

            const response =
                await dispatch(
                    exportJobs(params)
                ).unwrap();


            /* =====================================================
               DOWNLOAD EXCEL
            ===================================================== */

            downloadFile(response);


            /* =====================================================
               CLOSE MODAL
            ===================================================== */

            onClose();

        } catch (error) {

            console.error(
                "Job export failed:",
                error
            );

        }

    };


    /* =========================================================
       CLOSE
    ========================================================= */

    const handleClose = () => {

        if (isExporting) {
            return;
        }

        onClose();

    };


    /* =========================================================
       MODAL
    ========================================================= */

    if (!isOpen) {
        return null;
    }


    return (
        <div
            className="job-exp-overlay"
            onMouseDown={(e) => {

                if (
                    e.target === e.currentTarget &&
                    !isExporting
                ) {
                    handleClose();
                }

            }}
        >

            <div
                className="job-exp-modal"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="job-exp-header">

                    <div>

                        <h2>
                            Export Jobs
                        </h2>

                        <p>
                            Choose optional filters for your export
                        </p>

                    </div>


                    <button
                        type="button"
                        className="job-exp-close"
                        onClick={handleClose}
                        disabled={isExporting}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    BODY
                ================================================= */}

                <div className="job-exp-body">

                    {/* =================================================
                        DATE FIELDS
                    ================================================= */}

                    <div className="job-exp-date-row">

                        {/* FROM DATE */}

                        <div className="job-exp-field">

                            <label htmlFor="job-export-from-date">
                                From date
                            </label>

                            <input
                                id="job-export-from-date"
                                type="date"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }
                                disabled={isExporting}
                            />

                        </div>


                        {/* TO DATE */}

                        <div className="job-exp-field">

                            <label htmlFor="job-export-to-date">
                                To date
                            </label>

                            <input
                                id="job-export-to-date"
                                type="date"
                                value={toDate}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }
                                disabled={isExporting}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="job-exp-field">

                        <label htmlFor="job-export-status">
                            Status
                        </label>

                        <select
                            id="job-export-status"
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                            disabled={
                                isExporting ||
                                isJobFiltersLoading
                            }
                        >

                            <option value="">
                                All statuses
                            </option>


                            {Array.isArray(statuses) &&
                                statuses.map(
                                    (statusOption) => (

                                        <option
                                            key={statusOption}
                                            value={statusOption}
                                        >
                                            {formatStatusLabel(
                                                statusOption
                                            )}
                                        </option>

                                    )
                                )}

                        </select>

                    </div>


                    {/* =================================================
                        PRIORITY
                    ================================================= */}

                    <div className="job-exp-field">

                        <label htmlFor="job-export-priority">
                            Priority
                        </label>

                        <select
                            id="job-export-priority"
                            value={priority}
                            onChange={(e) =>
                                setPriority(
                                    e.target.value
                                )
                            }
                            disabled={
                                isExporting ||
                                isJobFiltersLoading
                            }
                        >

                            <option value="">
                                All priorities
                            </option>


                            {Array.isArray(priorities) &&
                                priorities.map(
                                    (priorityOption) => (

                                        <option
                                            key={priorityOption}
                                            value={priorityOption}
                                        >
                                            {priorityOption}
                                        </option>

                                    )
                                )}

                        </select>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {exportError && (

                        <div className="job-exp-error">
                            {exportError}
                        </div>

                    )}


                    {/* =================================================
                        INFO MESSAGE
                    ================================================= */}

                    <div className="job-exp-info">

                        <span className="job-exp-info-icon">
                            i
                        </span>

                        <span>
                            Leave all filters empty to export all jobs.
                        </span>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="job-exp-footer">

                    <button
                        type="button"
                        className="job-exp-cancel"
                        onClick={handleClose}
                        disabled={isExporting}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="job-exp-submit"
                        onClick={handleExport}
                        disabled={
                            isExporting ||
                            isJobFiltersLoading
                        }
                    >

                        {isExporting
                            ? "Exporting..."
                            : "Export"
                        }

                    </button>

                </div>

            </div>

        </div>
    );
};


export default JobExportModal;