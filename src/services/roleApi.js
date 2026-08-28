import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

const getAuthHeaders = () => {
    const accessToken =
        localStorage.getItem("accessToken");

    if (!accessToken) {
        throw new Error(
            "Authentication token not found."
        );
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

const roleApi = {

    getAllRolesAndModules: async () => {

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/roles/allRolesAndModules`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    getAllRoles: async () => {

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/roles`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    getRoleById: async (roleId) => {

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/roles/${roleId}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    createRole: async (roleData) => {

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/roles/create`,
            roleData,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    updateRole: async (roleId, roleData) => {

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/roles/update/${roleId}`,
            roleData,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    deleteRole: async (roleId) => {

        const response = await axios.delete(
            `${API_BASE_URL}/api/v1/roles/delete/${roleId}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    getEmployeeRoles: async (employeeId) => {

        const response = await axios.get(
            `${API_BASE_URL}/api/v1/roles/employee/${employeeId}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    assignRoleToEmployee: async (
        employeeId,
        roleId
    ) => {

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/roles/employee/${employeeId}`,
            {
                roleId,
            },
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },


    removeRoleFromEmployee: async (
        employeeId,
        roleId
    ) => {

        const response = await axios.delete(
            `${API_BASE_URL}/api/v1/roles/${roleId}/employee/${employeeId}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },

        switchRole: async (roleId) => {

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/switchRole`,
            {
                roleId,
            },
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    },
};

export default roleApi;