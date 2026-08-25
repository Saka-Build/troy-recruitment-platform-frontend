import axios from "axios";

const API_BASE_URL = "";

const jobApi = {
    createJob: async (jobData) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Authentication token not found.");
        }

        const response = await axios.post(`${API_BASE_URL}/api/v1/jobs/create`,jobData,
            {
                headers: { 
                    Authorization   :   `Bearer ${accessToken}`,
                    "Content-Type"  :   "application/json",
                },
            }
        );
        return response.data;
    },

    getAllJobs: async () => {
        const accessToken =localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error( "Authentication token not found.");
        }

        const response = await axios.get(`${API_BASE_URL}/api/v1/jobs`,
            {
                headers: {
                    Authorization:  `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    },

    getJobById: async (id) => {

        const accessToken =localStorage.getItem("accessToken");

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
                    Authorization   :   `Bearer ${accessToken}`,
                    "Content-Type"  :   "application/json",
                },
            }
        );
        return response.data;
    },

    deleteJob: async (id) => {
        const accessToken =localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error( "Authentication token not found." );
        }

        const response = await axios.delete( `${API_BASE_URL}/api/v1/jobs/delete/${id}`,
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
            throw new Error( "Authentication token not found.");
        }

        const response = await axios.get( `${API_BASE_URL}/api/v1/activityLog/job/${jobId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    },
};


export default jobApi;