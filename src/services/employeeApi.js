// import axios from "axios";
import axios from "./axiosInstance";


const API_BASE_URL = "";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const employeeApi = {
    createEmployee: async (employeeData, photoFile) => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error(
                "Authentication token not found."
            );
        }

        const formData = new FormData();

        formData.append(
            "employee",
            JSON.stringify(employeeData)
        );

        if (photoFile) {
            formData.append(
                "photo",
                photoFile
            );
        }

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/employees/create`,
            formData,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    },

    getAllEmployees: async () => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error(
                "Authentication token not found."
            );
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/employees`,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    },

    getEmployeeById: async (id) => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error(
                "Authentication token not found."
            );
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/employees/${id}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    },

    updateEmployee: async (id, employeeData, photoFile) => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error(
                "Authentication token not found."
            );
        }

        const formData = new FormData();

        formData.append(
            "employee",
            JSON.stringify(employeeData)
        );

        if (photoFile) {
            formData.append(
                "photo",
                photoFile
            );
        }

        const response = await axios.put(
            `${API_BASE_URL}/api/v1/employees/update/${id}`,
            formData,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    },

    deleteEmployee: async (id) => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error(
                "Authentication token not found."
            );
        }

        const response = await axios.delete(
            `${API_BASE_URL}/api/v1/employees/${id}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    },

exportEmployees: async (params = {}) => {

    const accessToken =
        localStorage.getItem("accessToken");

    if (!accessToken) {
        throw new Error(
            "Authentication token not found."
        );
    }

    const requestBody = {
        ...(params.fromDate && {
            fromDate: params.fromDate,
        }),

        ...(params.toDate && {
            toDate: params.toDate,
        }),

        ...(params.role && {
            role: params.role,
        }),

        ...(params.active !== undefined && {
            active: params.active,
        }),
    };

    console.log(
        "EXPORT EMPLOYEES REQUEST BODY:",
        requestBody
    );

    const response = await axios.post(
        `${API_BASE_URL}/api/v1/employees/export`,
        requestBody,
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,

                "Content-Type":
                    "application/json",

                Accept:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },

            responseType: "blob",
        }
    );

    console.log(
        "EXPORT STATUS:",
        response.status
    );

    console.log(
        "EXPORT CONTENT TYPE:",
        response.headers["content-type"]
    );

    console.log(
        "EXPORT CONTENT DISPOSITION:",
        response.headers["content-disposition"]
    );

    console.log(
        "EXPORT BLOB SIZE:",
        response.data?.size
    );

    return response;
},
};

export default employeeApi;