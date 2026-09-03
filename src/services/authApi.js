// import axios from "axios";
import axios from "./axiosInstance";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = "";

const authApi = {
    getToken: async (email, password) => {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/token`,
            {
                emailId: email,
                password: password,
            }
        );

        return response.data;
    },

    login: async (accessToken) => {
        const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/login`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    },
};

export default authApi;