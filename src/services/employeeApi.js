import axios from "axios";

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
};

export default employeeApi;