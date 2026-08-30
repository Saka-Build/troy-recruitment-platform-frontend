import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiList,
    FiSearch,
    FiX,
} from "react-icons/fi";
import { FaPlaneDeparture } from "react-icons/fa";
import { MdWorkOutline } from "react-icons/md";
import {
    getCandidateApplications,
    clearCandidateApplications,
    getSubmissionActivities,
    clearSubmissionActivities,
    getSubmissionSubStatuses,
    updateSubmission,
    updateSubmissionRates,
    createInterview,
    getInterviewsBySubmission,
    deleteSubmission,
    updateInterview,
} from "../../Redux/Slice/candidateSlice";
import ApplyJobModal from "../Candidate/ApplyJobModal";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import RatesModal from "../Candidate/RatesModal";
import "./Components.css";

const ApplicationsTab = ({
    candidateId,

    openJobs = [],
    isOpenJobsLoading = false,

    submissionStatuses = [],
    submissionStatusesLoading = false,
    submissionStatusesError = null,

    creatingSubmission = false,
    createSubmissionError = null,

    onApplyJob,
}) => {
    const dispatch = useDispatch();

    const {
        candidateApplications = [],
        candidateApplicationsLoading = false,
        candidateApplicationsError = null,
        submissionActivities = [],
        submissionActivitiesLoading = false,
        submissionActivitiesError = null,
        submissionSubStatuses = {},
        submissionSubStatusesLoading = {},
        submissionSubStatusesError = {},

        updatingSubmission = false,
        updateSubmissionError = null,
        updatingSubmissionRates = false,
        updateSubmissionRatesError = null,
        creatingInterview = false,
        createInterviewError = null,
        interviewsBySubmission = {},
        interviewsBySubmissionLoading = {},
        interviewsBySubmissionError = {},
        deletingSubmission = false,
        deleteSubmissionError = null,
        updatingInterview = false,
updateInterviewError = null,
    } = useSelector((state) => state.candidate);

    const [applications, setApplications] = useState([]);

    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showApplyJobModal, setShowApplyJobModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedHistoryApplication, setSelectedHistoryApplication] = useState(null);
    const [historyCounts, setHistoryCounts] = useState({});
    const [deletingSubmissionId, setDeletingSubmissionId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

    const [showRatesModal, setShowRatesModal] =
        useState(false);

    const [selectedRatesApplication, setSelectedRatesApplication] =
        useState(null);

    const [pendingRateStatus, setPendingRateStatus] =
        useState(null);



    const [interviewData, setInterviewData] = useState({
        date: "",
        time: "",
        type: "TEAMS",
        round: "Final",
        interviewer: "",
    });
    const [
        applicationChanges,
        setApplicationChanges,
    ] = useState({});

    const [
    showCancelInterviewModal,
    setShowCancelInterviewModal
] = useState(false);

const [
    selectedCancelInterview,
    setSelectedCancelInterview
] = useState(null);

const [
    cancellingInterview,
    setCancellingInterview
] = useState(false);

    useEffect(() => {
        if (!candidateId) {
            return;
        }

        dispatch(getCandidateApplications(candidateId));

        return () => {
            dispatch(clearCandidateApplications());
        };
    }, [candidateId, dispatch]);

    useEffect(() => {
        setApplications(
            candidateApplications.map((application) => ({
                ...application,

                status:
                    application.statusName ||
                    "Applied",

                statusId:
                    application.statusId ||
                    "",

                subStatusId:
                    application.subStatusId ||
                    null,

                subStatus:
                    application.subStatusName ||
                    "",
            }))
        );

        setApplicationChanges({});
    }, [candidateApplications]);

    useEffect(() => {
        if (!candidateApplications.length) {
            return;
        }

        candidateApplications.forEach((application) => {
            const submissionId =
                application.id ||
                application.submissionId;

            if (!submissionId) {
                return;
            }

            dispatch(
                getInterviewsBySubmission(
                    submissionId
                )
            );
        });
    }, [candidateApplications, dispatch]);

    const getInterviewTimestamp = (item) => {
    const date =
        item?.interviewDate ||
        item?.date;

    const time =
        item?.interviewTime ||
        item?.time;

    if (!date) {
        return 0;
    }

    // DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(String(date))) {
        const [day, month, year] =
            String(date).split("-");

        let hours = 0;
        let minutes = 0;

        if (time) {
            const match = String(time).match(
                /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
            );

            if (match) {
                hours = Number(match[1]);
                minutes = Number(match[2]);

                const period =
                    match[3]?.toUpperCase();

                if (
                    period === "PM" &&
                    hours !== 12
                ) {
                    hours += 12;
                }

                if (
                    period === "AM" &&
                    hours === 12
                ) {
                    hours = 0;
                }
            }
        }

        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            hours,
            minutes
        ).getTime();
    }

    const timestamp =
        new Date(date).getTime();

    return Number.isNaN(timestamp)
        ? 0
        : timestamp;
};


const getInterviewList = (submissionId) => {
    if (!submissionId) {
        return [];
    }

    const key = String(submissionId);

    const rawInterviews =
        interviewsBySubmission[key] ||
        interviewsBySubmission[submissionId];

    if (!rawInterviews) {
        return [];
    }

    if (Array.isArray(rawInterviews)) {
        return rawInterviews;
    }

    if (Array.isArray(rawInterviews.content)) {
        return rawInterviews.content;
    }

    if (Array.isArray(rawInterviews.data)) {
        return rawInterviews.data;
    }

    if (Array.isArray(rawInterviews.data?.content)) {
        return rawInterviews.data.content;
    }

    if (
        rawInterviews.interviewDate ||
        rawInterviews.date
    ) {
        return [rawInterviews];
    }

    return [];
};


const getLatestInterview = (submissionId) => {
    const interviews =
        getInterviewList(submissionId);

    if (!interviews.length) {
        return null;
    }

    /*
     * Only active interviews are considered
     * for Reschedule / Cancel UI.
     */
    const activeInterviews = interviews.filter((item) => {
        const status = String(
            item?.status ||
            item?.interviewStatus ||
            ""
        )
            .trim()
            .toLowerCase();

        return (
            status === "" ||
            status === "scheduled" ||
            status === "schedule" ||
            status === "rescheduled"
        );
    });

    if (!activeInterviews.length) {
        return null;
    }

    return [...activeInterviews].sort(
        (a, b) =>
            getInterviewTimestamp(b) -
            getInterviewTimestamp(a)
    )[0];
};


const getLatestCancelledInterview = (submissionId) => {
    const interviews =
        getInterviewList(submissionId);

    if (!interviews.length) {
        return null;
    }

    const cancelledInterviews =
        interviews.filter((item) => {
            const status = String(
                item?.status ||
                item?.interviewStatus ||
                ""
            )
                .trim()
                .toLowerCase();

            return status === "cancelled";
        });

    if (!cancelledInterviews.length) {
        return null;
    }

    return [...cancelledInterviews].sort(
        (a, b) =>
            getInterviewTimestamp(b) -
            getInterviewTimestamp(a)
    )[0];
};

    const loadSubStatuses = (statusId) => {
        if (!statusId) {
            return;
        }

        dispatch(
            getSubmissionSubStatuses(statusId)
        );
    };

    const getJobTitle = (application) => {
        return (
            application.jobName ||
            "Untitled Job"
        );
    };

    const getCompany = (application) => {
        return (
            application.company ||
            application.companyName ||
            application.clientName ||
            application.job?.clientName ||
            application.job?.client?.name ||
            application.job?.client?.companyName ||
            ""
        );
    };

    const getApplicationDate = (application) => {
        return (
            application.appliedDate ||
            application.createdAt ||
            application.createdDate ||
            application.submittedAt ||
            "-"
        );
    };

    const getCurrencySymbol = (currency) => {
        const currencyMap = {
            INR: "₹",
            GBP: "£",
            USD: "$",
            EUR: "€",
            AED: "د.إ",
            CAD: "C$",
            AUD: "A$",
        };

        return currencyMap[currency] || currency || "";
    };

    const formatRate = (amount, currency, period) => {
        if (amount === undefined || amount === null) {
            return null;
        }

        const symbol = getCurrencySymbol(currency);

        const formattedAmount = Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

        return `${symbol}${formattedAmount} / ${period || "month"}`;
    };

    const getExpectedSalary = (application) => {
        // API response fields
        if (
            application.candidateExpectedAmount !== undefined &&
            application.candidateExpectedAmount !== null
        ) {
            return formatRate(
                application.candidateExpectedAmount,
                application.candidateExpectedCurrency,
                application.candidateExpectedPeriod
            );
        }

        // Backward compatibility
        if (application.expectedSalary) {
            return application.expectedSalary;
        }

        const amount =
            application.expectedSalaryAmount ??
            application.expectedRateAmount ??
            application.candidateRateAmount;

        const currency =
            application.expectedSalaryCurrency ||
            application.expectedRateCurrency ||
            application.candidateRateCurrency;

        const period =
            application.expectedSalaryPeriod ||
            application.expectedRatePeriod ||
            application.candidateRatePeriod;

        return formatRate(amount, currency, period) || "-";
    };

    const getSubmissionRate = (application) => {
        // API response fields
        if (
            application.submissionAmount !== undefined &&
            application.submissionAmount !== null
        ) {
            return formatRate(
                application.submissionAmount,
                application.submissionCurrency,
                application.submissionPeriod
            );
        }

        // Backward compatibility
        if (application.submissionRate) {
            return application.submissionRate;
        }

        const amount =
            application.submissionRateAmount ??
            application.submittedRateAmount;

        const currency =
            application.submissionRateCurrency ||
            application.submittedRateCurrency;

        const period =
            application.submissionRatePeriod ||
            application.submittedRatePeriod;

        return formatRate(amount, currency, period);
    };

    const getOfferRate = (application) => {
        // API response fields
        if (
            application.offerAmount !== undefined &&
            application.offerAmount !== null
        ) {
            return formatRate(
                application.offerAmount,
                application.offerCurrency,
                application.offerPeriod
            );
        }

        // Backward compatibility
        if (application.offer) {
            return application.offer;
        }

        const amount =
            application.offerRateAmount;

        const currency =
            application.offerRateCurrency;

        const period =
            application.offerRatePeriod;

        return formatRate(amount, currency, period);
    };

    const getHistoryCount = (application) => {
        return (
            application.historyCount ??
            application.activityCount ??
            application.history?.length ??
            0
        );
    };

    const getStatusClass = (status) => {
        const classes = {
            Applied: "cxandidate-status-pipeline",
            "Actively Sourcing": "cxandidate-status-sourcing",
            "Ready to Submit": "cxandidate-status-ready",
            Submitted: "cxandidate-status-submitted",
            Interview: "cxandidate-status-interview",
            Selected: "cxandidate-status-selected",
            "Offer Released": "cxandidate-status-selected",
            Onboarding: "cxandidate-status-selected",
            Onboarded: "cxandidate-status-selected",
            Hold: "cxandidate-status-hold",
            Rejected: "cxandidate-status-rejected",
            Offboarded: "cxandidate-status-withdrawn",
        };

        return classes[status] || "cxandidate-status-default";
    };

    const getStatusIcon = (status) => {
        const icons = {
            Applied: <FiSearch />,
            "Actively Sourcing": <FiSearch />,
            "Ready to Submit": <MdWorkOutline />,
            Submitted: <MdWorkOutline />,
            Interview: <FiCalendar />,
            Selected: <MdWorkOutline />,
            "Offer Released": <MdWorkOutline />,
            Onboarding: <MdWorkOutline />,
            Onboarded: <FaPlaneDeparture />,
            Hold: <FiClock />,
            Rejected: <FiX />,
            Offboarded: <FiX />,
        };

        return icons[status] || <MdWorkOutline />;
    };

    // const handleStatusChange = (
    //     submissionId,
    //     statusId
    // ) => {
    //     const selectedStatus =
    //         submissionStatuses.find(
    //             (status) =>
    //                 String(status.id) ===
    //                 String(statusId)
    //         );

    //     if (!selectedStatus) {
    //         return;
    //     }

    //     const statusName =
    //         selectedStatus.name ||
    //         selectedStatus.statusName ||
    //         selectedStatus.label ||
    //         "";

    //     setApplications((prev) =>
    //         prev.map((application) =>
    //             (
    //                 application.id ||
    //                 application.submissionId
    //             ) === submissionId
    //                 ? {
    //                     ...application,

    //                     statusId:
    //                         statusId,

    //                     status:
    //                         statusName,

    //                     /*
    //                      * Changing parent status means
    //                      * old sub-status is no longer valid.
    //                      */
    //                     subStatusId:
    //                         null,

    //                     subStatus:
    //                         "",
    //                 }
    //                 : application
    //         )
    //     );

    //     setApplicationChanges((prev) => ({
    //         ...prev,

    //         [submissionId]: {
    //             ...(prev[submissionId] || {}),

    //             statusId,
    //             subStatusId: null,
    //         },
    //     }));

    //     loadSubStatuses(statusId);
    // };


    const handleStatusChange = (submissionId, statusId) => {
        console.log("STATUS CHANGE:", {
            submissionId,
            statusId,
            submissionStatuses,
        });

        const selectedStatus = submissionStatuses.find(
            (status) =>
                String(status?.id) === String(statusId)
        );

        if (!selectedStatus) {
            console.error(
                "Selected status not found:",
                {
                    statusId,
                    submissionStatuses,
                }
            );

            return;
        }

        const statusName =
            selectedStatus.name ||
            selectedStatus.statusName ||
            selectedStatus.label ||
            selectedStatus.displayName ||
            selectedStatus.value ||
            "";

        const normalizedStatus = String(statusName)
            .trim()
            .toLowerCase();

        console.log("SELECTED STATUS:", {
            selectedStatus,
            statusName,
            normalizedStatus,
        });

        const application = applications.find(
            (item) =>
                String(
                    item.id || item.submissionId
                ) === String(submissionId)
        );

        if (!application) {
            console.error(
                "Application not found for submission:",
                submissionId
            );

            return;
        }

        const updatedApplication = {
            ...application,

            statusId: statusId,

            status: statusName,

            statusName: statusName,

            subStatusId: null,

            subStatus: "",
        };

        /*
         * Update UI immediately
         */
        setApplications((prev) =>
            prev.map((item) =>
                String(
                    item.id || item.submissionId
                ) === String(submissionId)
                    ? updatedApplication
                    : item
            )
        );

        /*
         * SELECTED / OFFER RELEASED
         * -----------------------------------------
         * Open RatesModal immediately.
         *
         * Do NOT call updateSubmission yet.
         * Status will be saved after rates are saved.
         */
        if (
            normalizedStatus === "selected" ||
            normalizedStatus === "offer released"
        ) {
            console.log(
                "Opening RatesModal for status:",
                normalizedStatus
            );

            setPendingRateStatus({
                submissionId: submissionId,
                statusId: statusId,
                statusName: statusName,
            });

            setSelectedRatesApplication(
                updatedApplication
            );

            setShowRatesModal(true);

            /*
             * Load sub-statuses if required.
             */
            loadSubStatuses(statusId);

            return;
        }

        /*
         * Normal statuses
         * -----------------------------------------
         * Store change and let Save button handle API.
         */
        setApplicationChanges((prev) => ({
            ...prev,

            [submissionId]: {
                ...(prev[submissionId] || {}),

                statusId: statusId,

                subStatusId: null,
            },
        }));

        loadSubStatuses(statusId);
    };
    const formatInterviewDate = (date) => {
        if (!date) {
            return "";
        }

        /*
         * Already in DD-MM-YYYY
         */
        if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
            return date;
        }

        /*
         * If browser gives YYYY-MM-DD
         */
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            const [year, month, day] =
                date.split("-");

            return `${day}-${month}-${year}`;
        }

        return date;
    };

    const formatInterviewTime = (time) => {
        if (!time) {
            return "";
        }

        /*
         * Already formatted as 01:40 PM
         */
        if (
            /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(
                time
            )
        ) {
            const [timePart, period] =
                time.split(/\s+/);

            const [hours, minutes] =
                timePart.split(":");

            return `${hours.padStart(
                2,
                "0"
            )}:${minutes} ${period.toUpperCase()}`;
        }

        /*
         * Convert 24-hour HH:mm
         * to 12-hour format.
         */
        if (/^\d{1,2}:\d{2}$/.test(time)) {
            const [hoursString, minutes] =
                time.split(":");

            let hours =
                Number(hoursString);

            const period =
                hours >= 12
                    ? "PM"
                    : "AM";

            hours =
                hours % 12 || 12;

            return `${String(hours).padStart(
                2,
                "0"
            )}:${minutes} ${period}`;
        }

        return time;
    };

    const getInterviewTypeForApi = (type) => {
        return (
            type || "TEAMS"
        ).toUpperCase();
    };
    const getInterviewRoundForApi = (round) => {
        const roundMap = {
            "Technical Round": "Technical",
            "HR Round": "HR",
            "Final Round": "Final",

            Technical: "Technical",
            HR: "HR",
            Final: "Final",
        };

        return (
            roundMap[round] ||
            round
        );
    };
    const handleOpenInterview = (application, interview = null) => {
        console.log("Opening interview modal:", {
            application,
            interview,
        });

        setSelectedApplication(application);
        setSelectedInterview(interview);

        /*
         * If an interview already exists,
         * populate the modal with its current values.
         *
         * This will be used for RESCHEDULE later.
         */
        if (interview) {
            const interviewDate =
                interview.interviewDate ||
                interview.date ||
                "";

            const interviewTime =
                interview.interviewTime ||
                interview.time ||
                "";

            const interviewType =
                interview.interviewType ||
                interview.type ||
                "TEAMS";

            const interviewRound =
                interview.round ||
                "Final";

            const interviewer =
                interview.interviewerName ||
                interview.interviewer ||
                "";

            /*
             * Convert DD-MM-YYYY to YYYY-MM-DD
             * because <input type="date"> requires YYYY-MM-DD.
             */
            let formattedDate = interviewDate;

            if (/^\d{2}-\d{2}-\d{4}$/.test(interviewDate)) {
                const [day, month, year] =
                    interviewDate.split("-");

                formattedDate =
                    `${year}-${month}-${day}`;
            }

            /*
             * Convert API time to HH:mm
             * because <input type="time"> requires HH:mm.
             */
            let formattedTime = interviewTime;

            if (
                /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(
                    interviewTime
                )
            ) {
                const match = interviewTime.match(
                    /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i
                );

                if (match) {
                    let hours = Number(match[1]);
                    const minutes = match[2];
                    const period =
                        match[3].toUpperCase();

                    if (
                        period === "PM" &&
                        hours !== 12
                    ) {
                        hours += 12;
                    }

                    if (
                        period === "AM" &&
                        hours === 12
                    ) {
                        hours = 0;
                    }

                    formattedTime =
                        `${String(hours).padStart(2, "0")}:${minutes}`;
                }
            }

            setInterviewData({
                date: formattedDate,
                time: formattedTime,
                type: interviewType.toUpperCase(),
                round: interviewRound,
                interviewer,
            });
        } else {
            /*
             * Normal Schedule Interview
             */
            setInterviewData({
                date: "",
                time: "",
                type: "TEAMS",
                round: "Final",
                interviewer: "",
            });
        }

        setShowInterviewModal(true);
    };

    const handleCloseInterview = () => {
        setShowInterviewModal(false);
        setSelectedApplication(null);
        setSelectedInterview(null);
    };

    const handleInterviewChange = (field, value) => {
        setInterviewData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveInterview = async () => {
        if (!selectedApplication) {
            return;
        }

        const submissionId =
            selectedApplication.submissionId ||
            selectedApplication.id;

        const currentCandidateId =
            selectedApplication.candidateId ||
            candidateId;

        const jobId =
            selectedApplication.jobId ||
            selectedApplication.job?.id;

        if (!submissionId) {
            console.error(
                "Submission ID missing",
                selectedApplication
            );
            return;
        }

        if (!currentCandidateId) {
            console.error("Candidate ID missing");
            return;
        }

        if (!jobId) {
            console.error(
                "Job ID missing",
                selectedApplication
            );
            return;
        }

        if (!interviewData.date) {
            alert("Please select interview date.");
            return;
        }

        if (!interviewData.time) {
            alert("Please select interview time.");
            return;
        }

        if (!interviewData.interviewer.trim()) {
            alert("Please enter interviewer name.");
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | FIND INTERVIEW STATUS
        |--------------------------------------------------------------------------
        */

        const interviewStatus = submissionStatuses.find(
            (status) => {
                const statusName =
                    status?.name ||
                    status?.statusName ||
                    status?.label ||
                    "";

                return (
                    statusName
                        .toString()
                        .trim()
                        .toLowerCase() === "interview"
                );
            }
        );

        if (!interviewStatus?.id) {
            console.error(
                "Interview status not found in submissionStatuses:",
                submissionStatuses
            );

            alert(
                "Interview status is not available. Please refresh the page and try again."
            );

            return;
        }

        const requestData = {
            submissionId,

            candidateId:
                currentCandidateId,

            jobId,

            interviewDate:
                formatInterviewDate(
                    interviewData.date
                ),

            interviewTime:
                formatInterviewTime(
                    interviewData.time
                ),

            interviewType:
                getInterviewTypeForApi(
                    interviewData.type
                ),

            round:
                getInterviewRoundForApi(
                    interviewData.round
                ),

            interviewerName:
                interviewData.interviewer.trim(),

            status: "scheduled",
        };

        console.log(
            "Creating interview:",
            requestData
        );
try {
    if (selectedInterview?.id) {
        const updateRequestData = {
            interviewId: selectedInterview.id,

            submissionId,

            candidateId:
                currentCandidateId,

            jobId,

            interviewDate:
                formatInterviewDate(
                    interviewData.date
                ),

            interviewTime:
                formatInterviewTime(
                    interviewData.time
                ),

            interviewType:
                getInterviewTypeForApi(
                    interviewData.type
                ),

            round:
                getInterviewRoundForApi(
                    interviewData.round
                ),

            interviewerName:
                interviewData.interviewer.trim(),

            status: "Rescheduled",
        };

        console.log(
            "Rescheduling interview:",
            updateRequestData
        );

        await dispatch(
            updateInterview(
                updateRequestData
            )
        ).unwrap();

        console.log(
            "Interview rescheduled successfully"
        );

        await dispatch(
            getInterviewsBySubmission(
                submissionId
            )
        ).unwrap();

        await dispatch(
            getCandidateApplications(
                candidateId
            )
        ).unwrap();

        handleCloseInterview();

        return;
    }

    const interviewResponse =
        await dispatch(
            createInterview(
                requestData
            )
        ).unwrap();

    console.log(
        "Interview created successfully:",
        interviewResponse
    );

    await dispatch(
        updateSubmission({
            submissionId,

            statusId:
                interviewStatus.id,

            subStatusId: null,
        })
    ).unwrap();

    await dispatch(
        getCandidateApplications(
            candidateId
        )
    ).unwrap();

    handleCloseInterview();

} catch (error) {
    console.error(
        "Failed to save interview:",
        error
    );
}
    };

    const handleOpenDeleteModal = (submissionId) => {
        if (!submissionId) {
            console.error("Submission ID missing");
            return;
        }

        setSelectedSubmissionId(submissionId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        if (deletingSubmission) {
            return;
        }

        setShowDeleteModal(false);
        setSelectedSubmissionId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSubmissionId) {
            console.error("Submission ID missing");
            return;
        }

        try {
            setDeletingSubmissionId(selectedSubmissionId);

            console.log(
                "Deleting submission:",
                selectedSubmissionId
            );

            await dispatch(
                deleteSubmission(selectedSubmissionId)
            ).unwrap();

            console.log(
                "Submission deleted successfully:",
                selectedSubmissionId
            );

            /*
             * Refresh applications from backend
             */
            await dispatch(
                getCandidateApplications(candidateId)
            ).unwrap();

            /*
             * Close modal after successful deletion
             */
            setShowDeleteModal(false);
            setSelectedSubmissionId(null);

        } catch (error) {
            console.error(
                "Failed to delete submission:",
                error
            );

            alert(
                typeof error === "string"
                    ? error
                    : "Failed to remove application. Please try again."
            );
        } finally {
            setDeletingSubmissionId(null);
        }
    };
    const handleOpenHistory = (application) => {
        const submissionId =
            application.id ||
            application.submissionId;

        if (!submissionId) {
            console.error("Submission ID not found", application);
            return;
        }

        setSelectedHistoryApplication(application);
        setShowHistoryModal(true);

        dispatch(getSubmissionActivities(submissionId));
    };

    const handleCloseHistory = () => {
        setShowHistoryModal(false);
        setSelectedHistoryApplication(null);

        dispatch(clearSubmissionActivities());
    };

    const formatHistoryDate = (dateString) => {
        if (!dateString) {
            return "-";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const handleOpenCancelInterview = (
    application,
    interview
) => {
    if (!interview?.id) {
        console.error(
            "Interview ID missing:",
            interview
        );

        return;
    }

    setSelectedCancelInterview({
        application,
        interview,
    });

    setShowCancelInterviewModal(true);
};

const handleCloseCancelInterview = () => {
    if (cancellingInterview) {
        return;
    }

    setShowCancelInterviewModal(false);
    setSelectedCancelInterview(null);
};

const handleConfirmCancelInterview = async () => {
    const interview =
        selectedCancelInterview?.interview;

    const application =
        selectedCancelInterview?.application;

    if (!interview?.id) {
        console.error("Interview ID missing");
        return;
    }

    const submissionId =
        application?.submissionId ||
        application?.id;

    const currentCandidateId =
        application?.candidateId ||
        candidateId;

    const jobId =
        application?.jobId ||
        application?.job?.id;

    if (!submissionId) {
        console.error(
            "Submission ID missing",
            application
        );
        return;
    }

    if (!currentCandidateId) {
        console.error(
            "Candidate ID missing",
            application
        );
        return;
    }

    if (!jobId) {
        console.error(
            "Job ID missing",
            application
        );
        return;
    }

    try {
        setCancellingInterview(true);

        const cancelRequestData = {
            interviewId: interview.id,

            submissionId,

            candidateId:
                currentCandidateId,

            jobId,

            status: "Cancelled",
        };

        console.log(
            "========== CANCEL INTERVIEW =========="
        );

        console.log(
            "Cancel Interview Request:",
            cancelRequestData
        );

        await dispatch(
            updateInterview(
                cancelRequestData
            )
        ).unwrap();

        console.log(
            "Interview cancelled successfully"
        );

        /*
         * Refresh interviews
         */
        await dispatch(
            getInterviewsBySubmission(
                submissionId
            )
        ).unwrap();

        /*
         * Refresh applications
         */
        await dispatch(
            getCandidateApplications(
                candidateId
            )
        ).unwrap();

        /*
         * Close confirmation modal
         */
        setShowCancelInterviewModal(false);
        setSelectedCancelInterview(null);

    } catch (error) {
        console.error(
            "Failed to cancel interview:",
            error
        );

        alert(
            typeof error === "string"
                ? error
                : "Failed to cancel interview. Please try again."
        );
    } finally {
        setCancellingInterview(false);
    }
};
    const handleSubStatusChange = (
        submissionId,
        subStatusId
    ) => {
        const application =
            applications.find(
                (item) =>
                    (
                        item.id ||
                        item.submissionId
                    ) === submissionId
            );

        if (!application) {
            return;
        }

        const statusId =
            application.statusId;

        const subStatuses =
            submissionSubStatuses[statusId] ||
            [];

        const selectedSubStatus =
            subStatuses.find(
                (subStatus) =>
                    String(subStatus.id) ===
                    String(subStatusId)
            );

        setApplications((prev) =>
            prev.map((item) =>
                (
                    item.id ||
                    item.submissionId
                ) === submissionId
                    ? {
                        ...item,

                        subStatusId:
                            subStatusId,

                        subStatus:
                            selectedSubStatus?.name ||
                            "",
                    }
                    : item
            )
        );

        setApplicationChanges((prev) => ({
            ...prev,

            [submissionId]: {
                ...(prev[submissionId] || {}),

                statusId:
                    application.statusId,

                subStatusId:
                    subStatusId || null,
            },
        }));
    };

    const handleSaveStatus = async (
        application
    ) => {
        const submissionId =
            application.id ||
            application.submissionId;

        if (!submissionId) {
            console.error(
                "Submission ID missing",
                application
            );

            return;
        }

        /*
         * Selected / Offer Released are handled
         * through the RatesModal.
         */
        const currentStatus =
            application.status ||
            application.statusName ||
            "";

        const normalizedStatus =
            currentStatus
                .toString()
                .trim()
                .toLowerCase();

        if (
            normalizedStatus === "selected" ||
            normalizedStatus === "offer released"
        ) {
            /*
             * If the rate modal is already open,
             * don't save again from the normal Save button.
             */
            if (
                pendingRateStatus &&
                String(
                    pendingRateStatus.submissionId
                ) === String(submissionId)
            ) {
                return;
            }
        }

        const changes =
            applicationChanges[
            submissionId
            ];

        if (!changes) {
            return;
        }

        try {
            await dispatch(
                updateSubmission({
                    submissionId,

                    statusId:
                        changes.statusId ||
                        application.statusId,

                    subStatusId:
                        changes.subStatusId ||
                        null,
                })
            ).unwrap();

            /*
             * Refresh from backend.
             */
            await dispatch(
                getCandidateApplications(
                    candidateId
                )
            ).unwrap();

            /*
             * Clear local changes after successful save.
             */
            setApplicationChanges((prev) => {
                const updated = {
                    ...prev,
                };

                delete updated[submissionId];

                return updated;
            });

        } catch (error) {
            console.error(
                "UPDATE SUBMISSION ERROR:",
                error
            );
        }
    };

    const hasApplicationChanges = (
        application
    ) => {
        const submissionId =
            application.id ||
            application.submissionId;

        return Boolean(
            applicationChanges[
            submissionId
            ]
        );
    };

    const handleOpenRatesModal = (application) => {
        setSelectedRatesApplication(application);
        setShowRatesModal(true);
    };

    const handleCloseRatesModal = () => {
        setShowRatesModal(false);

        setSelectedRatesApplication(null);

        setPendingRateStatus(null);
        if (candidateId) {
            dispatch(
                getCandidateApplications(candidateId)
            );
        }
    };


    const handleSaveRates = async (rateData) => {
        if (!rateData?.submissionId) {
            console.error("Submission ID is missing");
            return;
        }

        try {

            const ratePayload = {
                submissionId: rateData.submissionId,

                candidateExpectedAmount:
                    rateData.candidateExpectedAmount ?? null,

                candidateExpectedCurrency:
                    rateData.candidateExpectedCurrency ?? null,

                candidateExpectedPeriod:
                    rateData.candidateExpectedPeriod ?? null,

                submissionAmount:
                    rateData.submissionAmount ?? null,

                submissionCurrency:
                    rateData.submissionCurrency ?? null,

                submissionPeriod:
                    rateData.submissionPeriod ?? null,

                offerAmount:
                    rateData.offerAmount ?? null,

                offerCurrency:
                    rateData.offerCurrency ?? null,

                offerPeriod:
                    rateData.offerPeriod ?? null,
            };

            console.log(
                "FINAL RATE UPDATE PAYLOAD:",
                ratePayload
            );

            await dispatch(
                updateSubmissionRates(ratePayload)
            ).unwrap();

            console.log(
                "Rates saved successfully."
            );

            /*
             * ---------------------------------------------------------
             * STEP 2 — IF SELECTED / OFFER RELEASED,
             * SAVE THE PENDING STATUS
             * ---------------------------------------------------------
             */

            if (
                pendingRateStatus &&
                String(
                    pendingRateStatus.submissionId
                ) ===
                String(rateData.submissionId)
            ) {
                console.log(
                    "Saving pending status after rates:",
                    pendingRateStatus
                );

                await dispatch(
                    updateSubmission({
                        submissionId:
                            pendingRateStatus.submissionId,

                        statusId:
                            pendingRateStatus.statusId,

                        subStatusId: null,
                    })
                ).unwrap();

                console.log(
                    "Submission status updated successfully:",
                    pendingRateStatus.statusName
                );
            }

            /*
             * ---------------------------------------------------------
             * STEP 3 — REFRESH APPLICATIONS
             * ---------------------------------------------------------
             */

            await dispatch(
                getCandidateApplications(
                    candidateId
                )
            ).unwrap();

            /*
             * ---------------------------------------------------------
             * STEP 4 — CLOSE MODAL
             * ---------------------------------------------------------
             */

            setShowRatesModal(false);

            setSelectedRatesApplication(null);

            setPendingRateStatus(null);

        } catch (error) {
            console.error(
                "Failed to save rates / update status:",
                error
            );
        }
    };



    useEffect(() => {
        if (!candidateApplications.length) {
            setHistoryCounts({});
            return;
        }

        const loadHistoryCounts = async () => {
            const counts = {};

            await Promise.all(
                candidateApplications.map(async (application) => {
                    const submissionId =
                        application.id ||
                        application.submissionId;

                    if (!submissionId) {
                        return;
                    }

                    try {
                        const result = await dispatch(
                            getSubmissionActivities(submissionId)
                        ).unwrap();

                        counts[submissionId] = Array.isArray(result)
                            ? result.length
                            : 0;
                    } catch (error) {
                        console.error(
                            "Failed to load history count:",
                            submissionId,
                            error
                        );

                        counts[submissionId] = 0;
                    }
                })
            );

            setHistoryCounts(counts);
        };

        loadHistoryCounts();
    }, [candidateApplications, dispatch]);


    useEffect(() => {
        if (!candidateApplications.length) {
            return;
        }

        const statusIds = [
            ...new Set(
                candidateApplications
                    .map((application) => application.statusId)
                    .filter(Boolean)
            ),
        ];

        statusIds.forEach((statusId) => {
            dispatch(getSubmissionSubStatuses(statusId));
        });
    }, [candidateApplications, dispatch]);

    const isInterviewStatus = (application) => {
        const status =
            application?.status ||
            application?.statusName ||
            "";

        return (
            String(status)
                .trim()
                .toLowerCase() === "interview"
        );
    };
    const getInterviewRoundLabel = (interview) => {
        const round =
            interview?.round || "";

        const normalizedRound =
            String(round)
                .trim()
                .toLowerCase();

        if (normalizedRound === "technical") {
            return "Technical Round";
        }

        if (normalizedRound === "hr") {
            return "HR Round";
        }

        if (normalizedRound === "final") {
            return "Final Round";
        }

        return round || "-";
    };
    return (
        <>
            <div className="candidate-tab-card cxandidate applications-tab">
                <div className="cxandidate-applications-header d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div>
                        <h2 className="cxandidate-applications-title">
                            Applications ({applications.length})
                        </h2>

                        <p className="cxandidate-applications-description">
                            Each application is this candidate's journey
                            through one job — with its own status, interview
                            and history.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="cxandidate-apply-job-btn"
                        onClick={() => setShowApplyJobModal(true)}
                    >
                        + Apply to a job
                    </button>
                </div>

                {candidateApplicationsLoading && (
                    <div className="text-center py-4">
                        Loading applications...
                    </div>
                )}

                {!candidateApplicationsLoading &&
                    candidateApplicationsError && (
                        <div className="text-center py-4 text-danger">
                            {candidateApplicationsError}
                        </div>
                    )}

                {!candidateApplicationsLoading &&
                    !candidateApplicationsError &&
                    applications.length === 0 && (
                        <div className="text-center py-5">
                            No applications found for this candidate.
                        </div>
                    )}

                {!candidateApplicationsLoading &&
                    !candidateApplicationsError &&
                    applications.length > 0 && (
                        <div className="cxandidate-applications-list">
                            {applications.map((app, index) => {
                                const jobTitle = getJobTitle(app);
                                const company = getCompany(app);
                                const expectedSalary =
                                    getExpectedSalary(app);
                                const submissionRate =
                                    getSubmissionRate(app);
                                const offerRate =
                                    getOfferRate(app);
                                const submissionId =
                                    app.id ||
                                    app.submissionId;
                                const interview =
                                    getLatestInterview(submissionId);

                                const cancelledInterview =
                                    getLatestCancelledInterview(submissionId);


                                const historyCount =
                                    historyCounts[submissionId] ??
                                    getHistoryCount(app);

                                return (
                                    <div
                                        key={
                                            app.id ||
                                            app.submissionId ||
                                            index
                                        }
                                        className="cxandidate-application-card"
                                    >
                                        <div className="cxandidate-application-top">
                                            <div className="cxandidate-application-title">
                                                <strong>
                                                    {jobTitle}
                                                </strong>

                                                {company && (
                                                    <span>
                                                        {" "}
                                                        — {company}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="cxandidate-application-date">
                                                applied{" "}
                                                {getApplicationDate(app)}
                                            </span>
                                        </div>

                                        <div className="cxandidate-application-content">
                                            <div className="cxandidate-application-controls">
                                                <div
                                                    className={`cxandidate-status-badge ${getStatusClass(
                                                        app.status
                                                    )}`}
                                                >
                                                    <span className="cxandidate-status-icon">
                                                        {getStatusIcon(
                                                            app.status
                                                        )}
                                                    </span>

                                                    <span>
                                                        {app.status}
                                                    </span>
                                                </div>

                                                {/* <select
    className="cxandidate-status-select"
    value={app.status || ""}
    onChange={(e) =>
        handleStatusChange(
            app.id || app.submissionId,
            e.target.value
        )
    }
    disabled={submissionStatusesLoading}
>
    {submissionStatusesLoading ? (
        <option value="">
            Loading statuses...
        </option>
    ) : submissionStatuses.length === 0 ? (
        <option value="">
            No statuses available
        </option>
    ) : (
        submissionStatuses.map((status) => {
            const statusName =
                status?.name ||
                status?.statusName ||
                status?.label ||
                "";

            return (
                <option
                    key={status.id}
                    value={statusName}
                >
                    {statusName
                        .toString()
                        .replace(/_/g, " ")
                        .replace(
                            /\b\w/g,
                            (letter) =>
                                letter.toUpperCase()
                        )}
                </option>
            );
        })
    )}
</select> */}

                                                <select
                                                    className="cxandidate-status-select"
                                                    value={app.statusId || ""}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            app.id || app.submissionId,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={updatingSubmission}
                                                >
                                                    {submissionStatusesLoading ? (
                                                        <option value="">
                                                            Loading statuses...
                                                        </option>
                                                    ) : (
                                                        submissionStatuses.map((status) => {
                                                            const statusName =
                                                                status?.name ||
                                                                status?.statusName ||
                                                                status?.label ||
                                                                "";

                                                            return (
                                                                <option
                                                                    key={status.id}
                                                                    value={status.id}
                                                                >
                                                                    {statusName
                                                                        .toString()
                                                                        .replace(/_/g, " ")
                                                                        .replace(
                                                                            /\b\w/g,
                                                                            (letter) =>
                                                                                letter.toUpperCase()
                                                                        )}
                                                                </option>
                                                            );
                                                        })
                                                    )}
                                                </select>
                                                {(() => {
                                                    const submissionId =
                                                        app.id || app.submissionId;

                                                    const statusId = app.statusId;

                                                    const subStatuses =
                                                        submissionSubStatuses[statusId] || [];

                                                    const subStatusesLoading =
                                                        submissionSubStatusesLoading[statusId];

                                                    return (
                                                        <select
                                                            className="cxandidate-sub-status-select"
                                                            value={app.subStatusId || ""}
                                                            onChange={(e) =>
                                                                handleSubStatusChange(
                                                                    submissionId,
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={
                                                                !statusId ||
                                                                subStatusesLoading ||
                                                                updatingSubmission
                                                            }
                                                        >
                                                            {subStatusesLoading ? (
                                                                <option value="">
                                                                    Loading sub-statuses...
                                                                </option>
                                                            ) : (
                                                                <>
                                                                    <option value="">
                                                                        Select sub-status
                                                                    </option>

                                                                    {subStatuses.map((subStatus) => (
                                                                        <option
                                                                            key={subStatus.id}
                                                                            value={subStatus.id}
                                                                        >
                                                                            {subStatus.name}
                                                                        </option>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </select>
                                                    );
                                                })()}

                                                <button
                                                    type="button"
                                                    className="cxandidate-save-status-btn"
                                                    disabled={
                                                        !hasApplicationChanges(app) ||
                                                        updatingSubmission
                                                    }
                                                    onClick={() =>
                                                        handleSaveStatus(app)
                                                    }
                                                >
                                                    {updatingSubmission
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action"
                                                    onClick={() =>
                                                        handleOpenInterview(
                                                            app
                                                        )
                                                    }
                                                >
                                                    <FiCalendar />
                                                    <span>
                                                        Interview
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action"
                                                    onClick={() => handleOpenRatesModal(app)}
                                                >
                                                    <FiDollarSign />
                                                    <span>
                                                        Rates
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action"
                                                    onClick={() => handleOpenHistory(app)}
                                                >
                                                    <FiList />
                                                    <span>
                                                        History ({historyCount})
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cxandidate-application-action cxandidate-remove-btn"
                                                    onClick={() =>
                                                        handleOpenDeleteModal(
                                                            app.id ||
                                                            app.submissionId
                                                        )
                                                    }
                                                    disabled={
                                                        deletingSubmissionId ===
                                                        (app.id || app.submissionId)
                                                    }
                                                >
                                                    <FiX />

                                                    <span>
                                                        {deletingSubmissionId ===
                                                            (app.id || app.submissionId)
                                                            ? "Removing..."
                                                            : "Remove"}
                                                    </span>
                                                </button>
                                            </div>

                                            <div className="cxandidate-application-rates">
                                                <span>
                                                    Expected:{" "}
                                                    <strong>
                                                        {
                                                            expectedSalary
                                                        }
                                                    </strong>
                                                </span>

                                                {submissionRate && (
                                                    <>
                                                        <span className="cxandidate-rate-separator">
                                                            ·
                                                        </span>

                                                        <span>
                                                            Submitted:{" "}
                                                            <strong>
                                                                {
                                                                    submissionRate
                                                                }
                                                            </strong>
                                                        </span>
                                                    </>
                                                )}

                                                {offerRate && (
                                                    <>
                                                        <span className="cxandidate-rate-separator">
                                                            ·
                                                        </span>

                                                        <span className="cxandidate-offer-rate">
                                                            Offer:{" "}
                                                            <strong>
                                                                {
                                                                    offerRate
                                                                }
                                                            </strong>
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            {/* =====================================================
    ACTIVE INTERVIEW
===================================================== */}
{interview && isInterviewStatus(app) && (
    <div className="cxandidate-interview-scheduled-box">

        <div className="cxandidate-interview-scheduled-left">

            <div className="cxandidate-interview-scheduled-badge">
                <span className="cxandidate-interview-badge-icon">
                    🎤
                </span>

                INTERVIEW SCHEDULED
            </div>

            <div className="cxandidate-interview-scheduled-details">

                <strong>
                    {interview.interviewDate ||
                        interview.date ||
                        "-"}
                </strong>

                <strong>
                    {interview.interviewTime ||
                        interview.time ||
                        ""}
                </strong>

                <span className="cxandidate-interview-dot">
                    ·
                </span>

                <span>
                    {interview.interviewType ||
                        interview.type ||
                        "-"}
                </span>

                <span className="cxandidate-interview-dot">
                    ·
                </span>

                <span>
                    {getInterviewRoundLabel(interview)}
                </span>

                {interview.interviewerName && (
                    <>
                        <span className="cxandidate-interview-dot">
                            ·
                        </span>

                        <span>
                            {interview.interviewerName}
                        </span>
                    </>
                )}

            </div>
        </div>

        <div className="cxandidate-interview-actions">

            <button
                type="button"
                className="cxandidate-reschedule-btn"
                onClick={() =>
                    handleOpenInterview(
                        app,
                        interview
                    )
                }
            >
                Reschedule
            </button>

            <button
                type="button"
                className="cxandidate-cancel-btn"
                onClick={() =>
                    handleOpenCancelInterview(
                        app,
                        interview
                    )
                }
            >
                Cancel
            </button>

        </div>
    </div>
)}


{/* =====================================================
    CANCELLED INTERVIEW
===================================================== */}
{!interview &&
    cancelledInterview &&
    isInterviewStatus(app) && (
        <div className="cxandidate-interview-cancelled-box">

            <div className="cxandidate-interview-cancelled-content">

                <div className="cxandidate-interview-cancelled-header">

                    <div className="cxandidate-interview-cancelled-badge">

                        <span className="cxandidate-interview-cancelled-icon">
                            ×
                        </span>

                        INTERVIEW CANCELLED

                    </div>

                    <span className="cxandidate-interview-cancelled-message">
                        This interview has been cancelled.
                    </span>

                </div>

                <div className="cxandidate-interview-cancelled-details">

                    <strong>
                        {cancelledInterview.interviewDate ||
                            cancelledInterview.date ||
                            "-"}
                    </strong>

                    <span className="cxandidate-interview-dot">
                        ·
                    </span>

                    <span>
                        {cancelledInterview.interviewTime ||
                            cancelledInterview.time ||
                            "-"}
                    </span>

                    <span className="cxandidate-interview-dot">
                        ·
                    </span>

                    <span>
                        {cancelledInterview.interviewType ||
                            cancelledInterview.type ||
                            "-"}
                    </span>

                    <span className="cxandidate-interview-dot">
                        ·
                    </span>

                    <span>
                        {getInterviewRoundLabel(
                            cancelledInterview
                        )}
                    </span>

                    {cancelledInterview.interviewerName && (
                        <>
                            <span className="cxandidate-interview-dot">
                                ·
                            </span>

                            <span>
                                {cancelledInterview.interviewerName}
                            </span>
                        </>
                    )}

                </div>

            </div>

            <div className="cxandidate-interview-cancelled-action">
                No active interview
            </div>

        </div>
    )}

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
            </div>

            {showInterviewModal &&
                selectedApplication && (
                    <div
                        className="cxandidate-modal-overlay"
                        onMouseDown={
                            handleCloseInterview
                        }
                    >
                        <div
                            className="cxandidate-interview-modal"
                            onMouseDown={(e) =>
                                e.stopPropagation()
                            }
                        >
                            <div className="cxandidate-interview-modal-header">
                                <h3>
                                    Schedule interview —{" "}
                                    {getJobTitle(
                                        selectedApplication
                                    )}
                                </h3>

                                <button
                                    type="button"
                                    className="cxandidate-modal-close"
                                    onClick={
                                        handleCloseInterview
                                    }
                                    aria-label="Close"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="cxandidate-interview-modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Date *
                                        </label>

                                        <div className="cxandidate-input-icon-wrapper">
                                            <input
                                                type="date"
                                                className="form-control cxandidate-form-control"
                                                value={
                                                    interviewData.date
                                                }
                                                onChange={(e) =>
                                                    handleInterviewChange(
                                                        "date",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            {/* <FiCalendar /> */}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Time
                                        </label>

                                        <div className="cxandidate-input-icon-wrapper">
                                            <input
                                                type="time"
                                                className="form-control cxandidate-form-control"
                                                value={
                                                    interviewData.time
                                                }
                                                onChange={(e) =>
                                                    handleInterviewChange(
                                                        "time",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            {/* <FiClock /> */}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Type
                                        </label>

                                        <select
                                            className="form-select cxandidate-form-control"
                                            value={
                                                interviewData.type
                                            }
                                            onChange={(e) =>
                                                handleInterviewChange(
                                                    "type",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="TEAMS">
                                                Teams
                                            </option>

                                            <option value="ZOOM">
                                                Zoom
                                            </option>

                                            <option value="PHONE">
                                                Phone
                                            </option>

                                            <option value="ONSITE">
                                                Onsite
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="cxandidate-form-label">
                                            Round
                                        </label>

                                        <select
                                            className="form-select cxandidate-form-control"
                                            value={
                                                interviewData.round
                                            }
                                            onChange={(e) =>
                                                handleInterviewChange(
                                                    "round",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Technical">
                                                Technical Round
                                            </option>

                                            <option value="HR">
                                                HR Round
                                            </option>

                                            <option value="Final">
                                                Final Round
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="cxandidate-form-label">
                                            Interviewer
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control cxandidate-form-control"
                                            placeholder="e.g. Sarah Lin (Client)"
                                            value={
                                                interviewData.interviewer
                                            }
                                            onChange={(e) =>
                                                handleInterviewChange(
                                                    "interviewer",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {createInterviewError && (
                                <div className="cxandidate-interview-error">
                                    {createInterviewError}
                                </div>
                            )}
                            <div className="cxandidate-interview-modal-footer">
                                <button
                                    type="button"
                                    className="cxandidate-cancel-btn"
                                    onClick={
                                        handleCloseInterview
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="cxandidate-save-interview-btn"
                                    onClick={handleSaveInterview}
                                    disabled={creatingInterview}
                                >
                                    {creatingInterview
                                        ? "Scheduling..."
                                        : "Schedule Interview"}
                                </button>
                            </div>
                        </div>

                    </div>
                )}


            {showApplyJobModal && (
                <ApplyJobModal
                    candidateId={candidateId}

                    jobs={openJobs}
                    jobsLoading={isOpenJobsLoading}

                    statuses={submissionStatuses}
                    statusesLoading={submissionStatusesLoading}

                    creatingSubmission={creatingSubmission}

                    onClose={() =>
                        setShowApplyJobModal(false)
                    }

                    onApply={onApplyJob}
                />
            )}

            {showHistoryModal && selectedHistoryApplication && (
                <div
                    className="cxandidate-history-overlay"
                    onMouseDown={handleCloseHistory}
                >
                    <div
                        className="cxandidate-history-modal"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="cxandidate-history-header">
                            <div>
                                <h3>Application History</h3>

                                <p>
                                    {getJobTitle(selectedHistoryApplication)}
                                    {getCompany(selectedHistoryApplication) && (
                                        <>
                                            {" "}
                                            —{" "}
                                            {getCompany(
                                                selectedHistoryApplication
                                            )}
                                        </>
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="cxandidate-history-close"
                                onClick={handleCloseHistory}
                            >
                                ×
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="cxandidate-history-body">

                            {submissionActivitiesLoading && (
                                <div className="cxandidate-history-loading">
                                    <div className="cxandidate-history-loading-bar"></div>
                                    <p>Loading application history...</p>
                                </div>
                            )}

                            {!submissionActivitiesLoading &&
                                submissionActivitiesError && (
                                    <div className="cxandidate-history-error">
                                        {submissionActivitiesError}
                                    </div>
                                )}

                            {!submissionActivitiesLoading &&
                                !submissionActivitiesError &&
                                submissionActivities.length === 0 && (
                                    <div className="cxandidate-history-empty">
                                        No history available for this application.
                                    </div>
                                )}

                            {!submissionActivitiesLoading &&
                                !submissionActivitiesError &&
                                submissionActivities.length > 0 && (
                                    <div className="cxandidate-history-list">
                                        {submissionActivities.map(
                                            (activity, index) => (
                                                <div
                                                    className="cxandidate-history-item"
                                                    key={
                                                        activity.id ||
                                                        index
                                                    }
                                                >
                                                    {/* LEFT COLOR LINE */}
                                                    <div
                                                        className={`cxandidate-history-line ${activity.newValue
                                                            ?.toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )
                                                            }`}
                                                    ></div>

                                                    {/* CONTENT */}
                                                    <div className="cxandidate-history-content">

                                                        <div className="cxandidate-history-top">
                                                            <span className="cxandidate-history-action">
                                                                {activity.action}
                                                            </span>

                                                            <span className="cxandidate-history-date">
                                                                {formatHistoryDate(
                                                                    activity.performedAt
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="cxandidate-history-status-change">

                                                            <span className="cxandidate-history-old-status">
                                                                {activity.oldValue ||
                                                                    "—"}
                                                            </span>

                                                            <span className="cxandidate-history-arrow">
                                                                →
                                                            </span>

                                                            <span
                                                                className={`cxandidate-history-new-status ${activity.newValue
                                                                    ?.toLowerCase()
                                                                    .replace(
                                                                        /\s+/g,
                                                                        "-"
                                                                    )
                                                                    }`}
                                                            >
                                                                {activity.newValue ||
                                                                    "—"}
                                                            </span>

                                                        </div>

                                                        <p className="cxandidate-history-description">
                                                            {activity.description ||
                                                                "No description available."}
                                                        </p>

                                                        <div className="cxandidate-history-performed">
                                                            Performed by{" "}
                                                            <strong>
                                                                {activity.performedBy ||
                                                                    "Unknown"}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>

                        {/* FOOTER */}
                        <div className="cxandidate-history-footer">
                            <span>
                                {submissionActivities.length}{" "}
                                {submissionActivities.length === 1
                                    ? "activity"
                                    : "activities"}
                            </span>

                            <button
                                type="button"
                                onClick={handleCloseHistory}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRatesModal && selectedRatesApplication && (
                <RatesModal
                    application={selectedRatesApplication}
                    onClose={handleCloseRatesModal}
                    onSave={handleSaveRates}
                    saving={updatingSubmissionRates}
                />
            )}

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Remove application"
                message="Are you sure you want to remove this application?"
                deleteText={
                    deletingSubmissionId
                        ? "Removing..."
                        : "Remove"
                }
                cancelText="Cancel"
            />

            <DeleteConfirmationModal
    isOpen={showCancelInterviewModal}
    onClose={handleCloseCancelInterview}
    onConfirm={handleConfirmCancelInterview}
    title="Cancel interview"
    message="Are you sure you want to cancel this interview?"
    deleteText={
        cancellingInterview
            ? "Cancelling..."
            : "Yes, Cancel"
    }
    cancelText="No, Keep Interview"
/>
        </>
    );
};

export default ApplicationsTab;