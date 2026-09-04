// import axios from "axios";

// const API_BASE_URL = "";

// const axiosInstance = axios.create({
//     baseURL: API_BASE_URL,
// });

// // Add access token to every API request
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("accessToken");

//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Handle expired token
// axiosInstance.interceptors.response.use(
//     (response) => response,

//     (error) => {
//         if (error.response?.status === 401) {
//             // Clear saved authentication data
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("refreshToken");
//             localStorage.removeItem("user");
//             localStorage.removeItem("activeRole");
//             localStorage.removeItem("roles");

//             // Redirect to login page
//             window.location.href = "/ats/";
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;




import axios from "axios";

const API_BASE_URL = "";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add access token to API requests
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        // IMPORTANT:
        // Do not overwrite an Authorization header
        // that has already been explicitly provided.
        if (
            accessToken &&
            !config.headers.Authorization
        ) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired token
axiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("activeRole");
            localStorage.removeItem("roles");

            window.location.href = "/ats/";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;