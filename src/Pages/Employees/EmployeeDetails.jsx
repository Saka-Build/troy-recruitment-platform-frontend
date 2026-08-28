import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./Employees.css";
import {
    getAllEmployees,
    clearEmployeeError,
} from "../../Redux/Slice/employeeSlice";
import {
    getAllRoles,
    getEmployeeRoles,
    assignRoleToEmployee,
    removeRoleFromEmployee,
} from "../../Redux/Slice/roleSlice";
import RoleAssignmentModal from "./RoleAssignmentModal";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";

function EmployeeDetails() {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        employees = [],
        isLoading,
        error,
    } = useSelector((state) => state.employees);

    const {
        roles = [],
    } = useSelector((state) => state.role || {});

    const [activeTab, setActiveTab] = useState("Overview");
    const [employeeRoles, setEmployeeRoles] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [showRoleAssignmentModal, setShowRoleAssignmentModal] = useState(false);
    const [roleAssignmentLoading, setRoleAssignmentLoading] = useState(false);
    const [roleToRemove, setRoleToRemove] = useState(null);
    const [removingRole, setRemovingRole] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        type: "",
        message: "",
    });

    const employee = useMemo(() => {
        return employees.find(
            (item) => String(item.id) === String(employeeId)
        );
    }, [employees, employeeId]);

    useEffect(() => {
        if (!employees.length) {
            dispatch(getAllEmployees());
        }

        return () => {
            dispatch(clearEmployeeError());
        };
    }, [dispatch, employees.length]);

    useEffect(() => {
        if (!employee?.id) {
            return;
        }

        let cancelled = false;

        const loadRoles = async () => {
            setRolesLoading(true);

            try {
                const result = await dispatch(
                    getEmployeeRoles(employee.id)
                ).unwrap();

                if (cancelled) {
                    return;
                }

                const assignedRoles = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.roles)
                        ? result.roles
                        : Array.isArray(result?.data)
                            ? result.data
                            : [];

                setEmployeeRoles(assignedRoles);
            } catch (error) {
                console.error(
                    "Failed to load employee roles:",
                    error
                );

                if (!cancelled) {
                    setEmployeeRoles([]);
                }
            } finally {
                if (!cancelled) {
                    setRolesLoading(false);
                }
            }
        };

        loadRoles();

        return () => {
            cancelled = true;
        };
    }, [dispatch, employee?.id]);

    const showNotification = (type, message) => {
        setNotification({
            show: true,
            type,
            message,
        });

        setTimeout(() => {
            setNotification({
                show: false,
                type: "",
                message: "",
            });
        }, 3000);
    };

    const getRoleId = (role) =>
        role?.id ||
        role?.roleId ||
        role?.role_id;

    const getRoleName = (role) =>
        role?.name ||
        role?.roleName ||
        role?.role ||
        role?.title ||
        "";

    const capitalizeRole = (role) => {
        if (!role) {
            return "—";
        }

        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    const initials = (name) => {
        if (!name) {
            return "NA";
        }

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase();
    };

    const refreshEmployeeRoles = async () => {
        if (!employee?.id) {
            return;
        }

        try {
            const result = await dispatch(
                getEmployeeRoles(employee.id)
            ).unwrap();

            const updatedRoles = Array.isArray(result)
                ? result
                : Array.isArray(result?.roles)
                    ? result.roles
                    : Array.isArray(result?.data)
                        ? result.data
                        : [];

            setEmployeeRoles(updatedRoles);
        } catch (error) {
            console.error(
                "Failed to refresh employee roles:",
                error
            );
        }
    };

    const openRoleAssignmentModal = () => {
        dispatch(getAllRoles());
        setShowRoleAssignmentModal(true);
    };

    const closeRoleAssignmentModal = () => {
        if (roleAssignmentLoading) {
            return;
        }

        setShowRoleAssignmentModal(false);
    };

    const handleAssignRoles = async (selectedRoleIds) => {
        if (
            !employee?.id ||
            !selectedRoleIds?.length
        ) {
            return;
        }

        setRoleAssignmentLoading(true);

        try {
            await Promise.all(
                selectedRoleIds.map((roleId) =>
                    dispatch(
                        assignRoleToEmployee({
                            employeeId: employee.id,
                            roleId,
                        })
                    ).unwrap()
                )
            );

            await refreshEmployeeRoles();

            setShowRoleAssignmentModal(false);

            showNotification(
                "success",
                "Role assigned successfully"
            );
        } catch (error) {
            console.error(
                "Role assignment failed:",
                error
            );

            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : "Failed to assign role"
            );
        } finally {
            setRoleAssignmentLoading(false);
        }
    };

    const openRemoveRoleConfirmation = (role) => {
        setRoleToRemove({
            employee,
            role,
        });
    };

    const handleRemoveRole = async () => {
        if (
            !roleToRemove?.employee?.id ||
            !roleToRemove?.role
        ) {
            return;
        }

        const employeeId = roleToRemove.employee.id;
        const roleId = getRoleId(roleToRemove.role);

        if (!roleId) {
            return;
        }

        setRemovingRole(true);

        try {
            await dispatch(
                removeRoleFromEmployee({
                    employeeId,
                    roleId,
                })
            ).unwrap();

            await refreshEmployeeRoles();

            setRoleToRemove(null);

            showNotification(
                "success",
                "Role removed successfully"
            );
        } catch (error) {
            console.error(
                "Role removal failed:",
                error
            );

            showNotification(
                "error",
                typeof error === "string"
                    ? error
                    : "Failed to remove role"
            );
        } finally {
            setRemovingRole(false);
        }
    };

    if (isLoading && !employee) {
        return (
            <div className="page">
                <div className="employee-not-found">
                    <div className="employee-loading-icon">
                        <i className="bi bi-arrow-repeat"></i>
                    </div>
                    <h2>Loading employee...</h2>
                </div>
            </div>
        );
    }

    if (error && !employee) {
        return (
            <div className="page">
                <div className="employee-not-found">
                    <div className="employee-not-found-icon">
                        <i className="bi bi-person-x"></i>
                    </div>

                    <h2>
                        Unable to load employee
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard/employees")
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Employees
                    </button>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="page">
                <div className="employee-not-found">
                    <div className="employee-not-found-icon">
                        <i className="bi bi-person-x"></i>
                    </div>

                    <h2>
                        Employee not found
                    </h2>

                    <p>
                        The requested employee could not be found.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard/employees")
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back to Employees
                    </button>
                </div>
            </div>
        );
    }

return (
    <div className="page employee-details-page">
        <div className="employee-detail-top">
            <button
                type="button"
                className="back-employees-btn"
                onClick={() => navigate("/dashboard/employees")}
            >
                <i className="bi bi-arrow-left"></i>
                Employees
            </button>
        </div>

        <div className="employee-profile-header">
            <div className="employee-profile-left">
                {employee.photoUrl ? (
                    <img
                        src={employee.photoUrl}
                        alt={employee.fullName}
                        className="employee-profile-avatar employee-profile-avatar-image"
                    />
                ) : (
                    <div className="employee-profile-avatar">
                        {initials(employee.fullName)}
                    </div>
                )}

                <div className="employee-profile-info">
                    <div className="employee-name-row">
                        <h1>
                            {employee.fullName || "—"}
                        </h1>

                        <span
                            className={
                                employee.active
                                    ? "employee-status-badge-detail active"
                                    : "employee-status-badge-detail inactive"
                            }
                        >
                            <span></span>
                            {employee.active ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <p>
                        {employee.designation || "—"}
                        {" · "}
                        {employee.employeeCode || "—"}
                    </p>

                    {employee.officialEmail && (
                        <div className="employee-profile-email">
                            <i className="bi bi-envelope"></i>
                            <span>{employee.officialEmail}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="employee-detail-tabs">
            {["Overview", "Roles"].map((tab) => (
                <button
                    key={tab}
                    type="button"
                    className={activeTab === tab ? "active" : ""}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>

        {activeTab === "Overview" && (
            <div className="employee-overview">

                <div className="employee-information-grid">
                    <div className="employee-info-card">
                        <div className="employee-info-card-header">
                            <div className="employee-info-icon">
                                <i className="bi bi-person"></i>
                            </div>

                            <div>
                                <h3>Personal Information</h3>
                                <p>
                                    Personal details of the employee
                                </p>
                            </div>
                        </div>

                        <div className="employee-info-table">
                            <div className="employee-info-row">
                                <span>Full Name</span>
                                <strong>
                                    {employee.fullName || "—"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>Employee ID</span>
                                <strong>
                                    {employee.employeeCode || "—"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>Personal Email</span>
                                <strong>
                                    {employee.personalEmail || "—"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>Contact Number</span>
                                <strong>
                                    {employee.phone || "—"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>WhatsApp Number</span>
                                <strong>
                                    {employee.whatsapp || "—"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>Country</span>
                                <strong>
                                    {employee.country?.name ||
                                        employee.country?.code ||
                                        "—"}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="employee-info-card">
                        <div className="employee-info-card-header">
                            <div className="employee-info-icon">
                                <i className="bi bi-briefcase"></i>
                            </div>

                            <div>
                                <h3>Professional Information</h3>
                                <p>
                                    Current professional details
                                </p>
                            </div>
                        </div>

                        <div className="employee-info-table">
                            <div className="employee-info-row">
                                <span>Designation</span>
                                <strong>
                                    {employee.designation || "—"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>Official Email</span>
                                <strong>
                                    {employee.officialEmail || "—"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>Employment Status</span>
                                <strong
                                    className={
                                        employee.active
                                            ? "employee-status-text-active"
                                            : "employee-status-text-inactive"
                                    }
                                >
                                    {employee.active
                                        ? "Active"
                                        : "Inactive"}
                                </strong>
                            </div>

                            <div className="employee-info-row">
                                <span>Employee ID</span>
                                <strong>
                                    {employee.employeeCode || "—"}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="employee-contact-card">
                    <div className="employee-info-card-header">
                        <div className="employee-info-icon">
                            <i className="bi bi-telephone"></i>
                        </div>

                        <div>
                            <h3>Contact Information</h3>
                            <p>
                                Employee communication details
                            </p>
                        </div>
                    </div>

                    <div className="employee-contact-grid">
                        <div className="employee-contact-item">
                            <div className="employee-contact-item-icon">
                                <i className="bi bi-telephone"></i>
                            </div>

                            <div>
                                <span>Phone</span>
                                <strong>
                                    {employee.phone || "—"}
                                </strong>
                            </div>
                        </div>

                        <div className="employee-contact-item">
                            <div className="employee-contact-item-icon">
                                <i className="bi bi-whatsapp"></i>
                            </div>

                            <div>
                                <span>WhatsApp</span>
                                <strong>
                                    {employee.whatsapp || "—"}
                                </strong>
                            </div>
                        </div>

                        <div className="employee-contact-item">
                            <div className="employee-contact-item-icon">
                                <i className="bi bi-envelope"></i>
                            </div>

                            <div>
                                <span>Official Email</span>
                                <strong>
                                    {employee.officialEmail || "—"}
                                </strong>
                            </div>
                        </div>

                        <div className="employee-contact-item">
                            <div className="employee-contact-item-icon">
                                <i className="bi bi-envelope-at"></i>
                            </div>

                            <div>
                                <span>Personal Email</span>
                                <strong>
                                    {employee.personalEmail || "—"}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === "Roles" && (
            <div className="employee-roles-card">
                <div className="employee-roles-header">
                    <div className="employee-info-card-header">
                        <div className="employee-info-icon">
                            <i className="bi bi-shield-check"></i>
                        </div>

                        <div>
                            <h3>Assigned Roles</h3>
                            <p>
                                Roles currently assigned to this employee
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="employee-primary-btn"
                        onClick={openRoleAssignmentModal}
                    >
                        <i className="bi bi-person-plus"></i>
                        Assign Role
                    </button>
                </div>

                {rolesLoading ? (
                    <div className="employee-roles-state">
                        <i className="bi bi-arrow-repeat"></i>
                        <span>Loading roles...</span>
                    </div>
                ) : employeeRoles.length === 0 ? (
                    <div className="employee-roles-state employee-no-roles">
                        <i className="bi bi-shield-x"></i>
                        <strong>
                            No roles assigned
                        </strong>
                        <span>
                            This employee does not have any roles yet.
                        </span>
                        <button
                            type="button"
                            className="employee-outline-btn"
                            onClick={openRoleAssignmentModal}
                        >
                            Assign Role
                        </button>
                    </div>
                ) : (
                    <div className="employee-role-list">
                        {employeeRoles.map((role, index) => {
                            const roleId = getRoleId(role);
                            const roleName = getRoleName(role);

                            return (
                                <div
                                    key={roleId || index}
                                    className="employee-role-item"
                                >
                                    <div className="employee-role-left">
                                        <div className="employee-role-icon">
                                            <i className="bi bi-shield-check"></i>
                                        </div>

                                        <div className="employee-role-content">
                                            <strong>
                                                {capitalizeRole(roleName)}
                                            </strong>

                                            {role.description && (
                                                <p>
                                                    {role.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="employee-role-remove"
                                        title={`Remove ${roleName}`}
                                        onClick={() =>
                                            openRemoveRoleConfirmation(role)
                                        }
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {notification.show && (
            <div
                className={`employee-notification employee-notification-${notification.type}`}
            >
                <div className="employee-notification-icon">
                    {notification.type === "success" && (
                        <i className="bi bi-check-lg"></i>
                    )}

                    {notification.type === "error" && (
                        <i className="bi bi-x-lg"></i>
                    )}
                </div>

                <span>{notification.message}</span>

                <button
                    type="button"
                    onClick={() =>
                        setNotification({
                            show: false,
                            type: "",
                            message: "",
                        })
                    }
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>
        )}

        {showRoleAssignmentModal && (
            <RoleAssignmentModal
                employee={employee}
                roles={roles}
                assignedRoles={employeeRoles}
                onClose={closeRoleAssignmentModal}
                onAssign={handleAssignRoles}
                isSubmitting={roleAssignmentLoading}
            />
        )}

        <DeleteConfirmationModal
            isOpen={!!roleToRemove}
            onClose={() => {
                if (!removingRole) {
                    setRoleToRemove(null);
                }
            }}
            onConfirm={handleRemoveRole}
            title="Remove role"
            itemName={
                roleToRemove
                    ? getRoleName(roleToRemove.role)
                    : ""
            }
            message={
                roleToRemove
                    ? `Are you sure you want to remove the role "${getRoleName(
                        roleToRemove.role
                    )}" from ${roleToRemove.employee.fullName}?`
                    : ""
            }
            deleteText={
                removingRole
                    ? "Removing..."
                    : "Remove Role"
            }
            cancelText="Cancel"
        />
    </div>
);
}

export default EmployeeDetails;