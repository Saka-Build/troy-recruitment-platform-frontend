// import axios from "axios";
import axios from "./axiosInstance";

const API_BASE_URL = "";

const jobApi = {
    createJob: async (jobData) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_BASE_URL}/api/v1/jobs/create`, jobData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    getAllJobs: async (params = {}) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/jobs`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    page: params.page ?? 0,
                    size: params.size ?? 10,

                    ...(params.search?.trim() && {
                        search: params.search.trim(),
                    }),

                    ...(params.status &&
                        params.status !== "All statuses" && {
                        status: params.status,
                    }),

                    ...(params.priority &&
                        params.priority !== "All priorities" && {
                        priority: params.priority,
                    }),
                },
            }
        );

        return response.data;
    },
    getOpenJobs: async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/jobs?status=Open`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    },
    getJobById: async (id) => {

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(`${API_BASE_URL}/api/v1/jobs/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    },

    updateJob: async (id, jobData) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.put(`${API_BASE_URL}/api/v1/jobs/update/${id}`, jobData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    },

    deleteJob: async (id) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.delete(`${API_BASE_URL}/api/v1/jobs/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    },


    getJobActivities: async (jobId) => {
        const accessToken =
            localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(`${API_BASE_URL}/api/v1/activityLog/job/${jobId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    },
    /* =========================================================
   JOB FILTERS / HEADER COUNTS
========================================================= */

    getJobFilters: async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/jobs/jobheader/jobfilters`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    },


exportJobs: async (params = {}) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        throw new Error("Authentication token not found.");
    }

    const requestParams = {
        ...(params.fromDate && {
            fromDate: params.fromDate,
        }),

        ...(params.toDate && {
            toDate: params.toDate,
        }),

        ...(params.statusId && {
            statusId: params.statusId,
        }),

        ...(params.priorityId && {
            priorityId: params.priorityId,
        }),
    };

    console.log(
        "Export Jobs request params:",
        requestParams
    );

    const response = await axios.post(
        `${API_BASE_URL}/api/v1/jobs/export`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: requestParams,
            responseType: "blob",
        }
    );

    return response;
},
};

export default jobApi;