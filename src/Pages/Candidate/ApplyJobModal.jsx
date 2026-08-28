import React, {
    useEffect,
    useState,
} from "react";

import {
    FiChevronDown,
    FiX,
} from "react-icons/fi";

import "./Components1.css";


const ApplyJobModal = ({
    candidateId,

    jobs = [],
    jobsLoading = false,

    statuses = [],
    statusesLoading = false,

    creatingSubmission = false,

    onClose,
    onApply,

}) => {

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [
        selectedJob,
        setSelectedJob,
    ] = useState("");

    const [
        selectedStatus,
        setSelectedStatus,
    ] = useState("");

    const [
        submitError,
        setSubmitError,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | SET FIRST JOB
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            jobs.length > 0 &&
            !selectedJob
        ) {

            setSelectedJob(
                jobs[0]?.id || ""
            );

        }

    }, [
        jobs,
        selectedJob,
    ]);


    /*
    |--------------------------------------------------------------------------
    | DEFAULT STATUS = APPLIED
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            statuses.length === 0 ||
            selectedStatus
        ) {
            return;
        }


        const appliedStatus =
            statuses.find(
                (status) => {

                    const name =
                        (
                            status?.name ||
                            status?.statusName ||
                            status?.label ||
                            ""
                        )
                            .toString()
                            .trim()
                            .toLowerCase()
                            .replace(
                                /_/g,
                                " "
                            );

                    return (
                        name === "applied"
                    );

                }
            );


        if (appliedStatus?.id) {

            setSelectedStatus(
                appliedStatus.id
            );

            return;
        }


        /*
         * Fallback:
         * first available status
         */

        if (statuses[0]?.id) {

            setSelectedStatus(
                statuses[0].id
            );

        }

    }, [
        statuses,
        selectedStatus,
    ]);


    /*
    |--------------------------------------------------------------------------
    | JOB LABEL
    |--------------------------------------------------------------------------
    */

    const getJobLabel = (
        job
    ) => {

        if (!job) {
            return "Untitled Job";
        }


        const title =
            job.title ||
            job.jobTitle ||
            job.name ||
            "Untitled Job";


        const company =
            job.clientName ||
            job.client?.name ||
            job.client?.companyName ||
            job.company ||
            "";


        return company
            ? `${title} — ${company}`
            : title;

    };


    /*
    |--------------------------------------------------------------------------
    | STATUS LABEL
    |--------------------------------------------------------------------------
    */

    const getStatusLabel = (
        status
    ) => {

        if (!status) {
            return "";
        }


        const name =
            status.name ||
            status.statusName ||
            status.label ||
            "Unknown Status";


        return name
            .toString()
            .replace(
                /_/g,
                " "
            )
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );

    };


    /*
    |--------------------------------------------------------------------------
    | SELECTED DATA
    |--------------------------------------------------------------------------
    */

    const selectedJobData =
        jobs.find(
            (job) =>
                String(job.id) ===
                String(selectedJob)
        );


    const selectedStatusData =
        statuses.find(
            (status) =>
                String(status.id) ===
                String(selectedStatus)
        );


    /*
    |--------------------------------------------------------------------------
    | APPLY
    |--------------------------------------------------------------------------
    */

    const handleApply = async () => {

        setSubmitError("");


        console.log(
            "========== APPLY MODAL =========="
        );

        console.log({
            candidateId,
            selectedJob,
            selectedStatus,
            selectedJobData,
            selectedStatusData,
        });


        /*
         * Candidate validation
         */

        if (!candidateId) {

            setSubmitError(
                "Candidate information is missing."
            );

            return;
        }


        /*
         * Job validation
         */

        if (!selectedJob) {

            setSubmitError(
                "Please select a job."
            );

            return;
        }


        /*
         * Status validation
         */

        if (!selectedStatus) {

            setSubmitError(
                "Please select an initial status."
            );

            return;
        }


        try {

            /*
             * Parent dispatches:
             *
             * createSubmission({
             *     candidateId,
             *     jobId,
             *     statusId
             * })
             */

            await onApply({

                candidateId:
                    candidateId,

                jobId:
                    selectedJob,

                statusId:
                    selectedStatus,

                job:
                    selectedJobData,

                status:
                    selectedStatusData,

            });

        } catch (error) {

            console.error(
                "Apply Job Error:",
                error
            );


            setSubmitError(
                error?.message ||
                "Unable to apply candidate to this job."
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | CLOSE
    |--------------------------------------------------------------------------
    */

    const handleClose = () => {

        if (
            creatingSubmission
        ) {
            return;
        }

        onClose();

    };


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div
            className="apply-job-modal-overlay"
            onMouseDown={
                handleClose
            }
        >

            <div
                className="apply-job-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="apply-job-modal-header">

                    <div>

                        <h3>
                            Apply candidate to a job
                        </h3>

                        <p>
                            Select a job and the initial
                            recruitment status.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="apply-job-modal-close"
                        onClick={
                            handleClose
                        }
                        disabled={
                            creatingSubmission
                        }
                        aria-label="Close"
                    >

                        <FiX size={20} />

                    </button>

                </div>


                {/* BODY */}

                <div className="apply-job-modal-body">

                    {/* JOB */}

                    <div className="apply-job-form-group">

                        <label htmlFor="apply-job">
                            Job / Role
                        </label>


                        <div className="apply-job-select-wrapper">

                            <select
                                id="apply-job"

                                value={
                                    selectedJob
                                }

                                onChange={(
                                    event
                                ) =>
                                    setSelectedJob(
                                        event.target.value
                                    )
                                }

                                disabled={
                                    jobsLoading ||
                                    creatingSubmission
                                }
                            >

                                {jobsLoading ? (

                                    <option value="">
                                        Loading jobs...
                                    </option>

                                ) : jobs.length === 0 ? (

                                    <option value="">
                                        No open jobs available
                                    </option>

                                ) : (

                                    jobs.map(
                                        (job) => (

                                            <option
                                                key={
                                                    job.id
                                                }
                                                value={
                                                    job.id
                                                }
                                            >

                                                {getJobLabel(
                                                    job
                                                )}

                                            </option>

                                        )
                                    )

                                )}

                            </select>


                            <FiChevronDown
                                className="apply-job-select-icon"
                            />

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="apply-job-form-group">

                        <label htmlFor="initial-status">
                            Initial Status
                        </label>


                        <div className="apply-job-select-wrapper">

                            <select
                                id="initial-status"

                                value={
                                    selectedStatus
                                }

                                onChange={(
                                    event
                                ) =>
                                    setSelectedStatus(
                                        event.target.value
                                    )
                                }

                                disabled={
                                    statusesLoading ||
                                    creatingSubmission
                                }
                            >

                                {statusesLoading ? (

                                    <option value="">
                                        Loading statuses...
                                    </option>

                                ) : statuses.length === 0 ? (

                                    <option value="">
                                        No statuses available
                                    </option>

                                ) : (

                                    statuses.map(
                                        (status) => (

                                            <option
                                                key={
                                                    status.id
                                                }
                                                value={
                                                    status.id
                                                }
                                            >

                                                {getStatusLabel(
                                                    status
                                                )}

                                            </option>

                                        )
                                    )

                                )}

                            </select>


                            <FiChevronDown
                                className="apply-job-select-icon"
                            />

                        </div>

                    </div>


                    {/* SELECTED STATUS */}

                    {selectedStatusData && (

                        <div
                            className="apply-job-selected-status"

                            style={{
                                "--status-color":
                                    selectedStatusData.colourHex ||
                                    selectedStatusData.colorHex ||
                                    "#6B7280",
                            }}
                        >

                            <span
                                className="apply-job-status-dot"
                            ></span>


                            <span>

                                Candidate will start at{" "}

                                <strong>

                                    {getStatusLabel(
                                        selectedStatusData
                                    )}

                                </strong>

                            </span>

                        </div>

                    )}


                    {/* ERROR */}

                    {submitError && (

                        <div className="apply-job-error">

                            {submitError}

                        </div>

                    )}

                </div>


                {/* FOOTER */}

                <div className="apply-job-modal-footer">

                    <button
                        type="button"
                        className="apply-job-cancel-btn"

                        onClick={
                            handleClose
                        }

                        disabled={
                            creatingSubmission
                        }
                    >

                        Cancel

                    </button>


                    <button
                        type="button"
                        className="apply-job-submit-btn"

                        onClick={
                            handleApply
                        }

                        disabled={

                            jobsLoading ||

                            statusesLoading ||

                            creatingSubmission ||

                            jobs.length === 0 ||

                            statuses.length === 0 ||

                            !selectedJob ||

                            !selectedStatus

                        }
                    >

                        {creatingSubmission
                            ? "Applying..."
                            : "Apply"}

                    </button>

                </div>

            </div>

        </div>

    );

};


export default ApplyJobModal;