import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiEdit2,
    FiPlus,
    FiSearch,
    FiTrash2,
    FiChevronDown,
    FiRefreshCw,
} from "react-icons/fi";

import {
    getAllRoles,
    getAllRolesAndModules,
    getRoleById,
    deleteRole,
    clearRoleError,
} from "../../Redux/Slice/roleSlice";

import RoleModal from "./RoleModal";
import "./Roles.css";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";

const Roles = () => {
    const dispatch = useDispatch();

    const {
        roles = [],
        availableRoles = [],
        modules = [],
        permissions = [],
        loading,
        error,
    } = useSelector((state) => state.role);

    const [search, setSearch] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    const [showRoleModal, setShowRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    // Delete confirmation state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    /*
     * =========================================================
     * INITIAL LOAD
     * =========================================================
     */
    useEffect(() => {
        dispatch(getAllRoles());
        dispatch(getAllRolesAndModules());

        return () => {
            dispatch(clearRoleError());
        };
    }, [dispatch]);

    /*
     * =========================================================
     * NORMALIZE ROLE NAME
     * =========================================================
     */
    const getRoleName = (role) => {
        return (
            role?.name ||
            role?.roleName ||
            role?.role ||
            ""
        );
    };

    /*
     * =========================================================
     * FILTER ROLES
     * =========================================================
     */
    const filteredRoles = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return roles;
        }

        return roles.filter((role) =>
            getRoleName(role)
                .toLowerCase()
                .includes(searchValue)
        );
    }, [roles, search]);

    /*
     * =========================================================
     * ADD ROLE
     * =========================================================
     */
    const handleAddRole = () => {
        setEditingRole(null);
        setShowRoleModal(true);
    };

    /*
     * =========================================================
     * EDIT ROLE
     * =========================================================
     */
    const handleEditRole = async (role) => {
        try {
            const result = await dispatch(
                getRoleById(role.id)
            ).unwrap();

            setEditingRole(result);
            setShowRoleModal(true);
        } catch (error) {
            console.error("Failed to load role:", error);
        }
    };

    /*
     * =========================================================
     * OPEN DELETE CONFIRMATION
     * =========================================================
     */
    const handleDeleteRole = (role) => {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    };

    /*
     * =========================================================
     * CLOSE DELETE CONFIRMATION
     * =========================================================
     */
    const handleDeleteModalClose = () => {
        if (deleteLoading) {
            return;
        }

        setShowDeleteModal(false);
        setRoleToDelete(null);
    };

    /*
     * =========================================================
     * CONFIRM DELETE
     * =========================================================
     */
    const handleConfirmDelete = async () => {
        if (!roleToDelete?.id) {
            return;
        }

        try {
            setDeleteLoading(true);

            await dispatch(
                deleteRole(roleToDelete.id)
            ).unwrap();

            // Refresh roles after successful deletion
            await dispatch(
                getAllRoles()
            ).unwrap();

            // Keep module/permission data in sync
            await dispatch(
                getAllRolesAndModules()
            ).unwrap();

            setShowDeleteModal(false);
            setRoleToDelete(null);
        } catch (error) {
            console.error("Failed to delete role:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    /*
     * =========================================================
     * ROLE MODAL CLOSE
     * =========================================================
     */
    const handleModalClose = () => {
        setShowRoleModal(false);
        setEditingRole(null);
    };

    /*
     * =========================================================
     * AFTER CREATE / UPDATE
     * =========================================================
     */
    const handleRoleSaved = async () => {
        try {
            await dispatch(
                getAllRoles()
            ).unwrap();

            await dispatch(
                getAllRolesAndModules()
            ).unwrap();

            handleModalClose();
        } catch (error) {
            console.error(
                "Failed to refresh roles:",
                error
            );
        }
    };

    /*
     * =========================================================
     * FORMAT MODULE NAME
     * =========================================================
     */
    const formatModuleName = (module) => {
        if (!module) {
            return "";
        }

        return module
            .toString()
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    /*
     * =========================================================
     * GET MODULES / PERMISSIONS FROM ROLE
     * =========================================================
     */
    const getRoleModules = (role) => {
        if (Array.isArray(role?.modules)) {
            return role.modules;
        }

        if (Array.isArray(role?.permissions)) {
            return role.permissions;
        }

        return [];
    };

    return (
        <div className="page roles-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}
            <div className="roles-page-header">

                <div>
                    <h1 className="roles-page-title">
                        Manage Role
                    </h1>

                    <p className="roles-page-subtitle">
                        Manage roles and module permissions
                    </p>
                </div>

                <div className="roles-page-header-actions">

                    <button
                        type="button"
                        className="primary-btn add-role-button"
                        onClick={handleAddRole}
                    >
                        <FiPlus size={18} />
                        <span>Add role</span>
                    </button>

                </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}
            {error && (
                <div className="role-error-message">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            dispatch(clearRoleError())
                        }
                        aria-label="Close error"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* =================================================
                ROLE CARD
            ================================================= */}
            <div className="roles-card">

                {/* =================================================
                    TOOLBAR
                ================================================= */}
                <div className="roles-table-toolbar">

                    <div className="entries-wrapper">

                        <div className="entries-select-wrapper">

                            <select
                                value={entriesPerPage}
                                onChange={(e) =>
                                    setEntriesPerPage(
                                        Number(e.target.value)
                                    )
                                }
                                className="entries-select"
                                aria-label="Entries per page"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>

                            <FiChevronDown
                                className="entries-arrow"
                                size={16}
                            />

                        </div>

                        <span className="entries-text">
                            entries per page
                        </span>

                    </div>

                    {/* SEARCH */}
                    <div className="role-search-wrapper">

                        <FiSearch
                            className="role-search-icon"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search role..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="role-search-input"
                        />

                    </div>

                </div>

                {/* =================================================
                    TABLE
                ================================================= */}
                <div className="roles-table-wrapper">

                    <table className="roles-table">

                        <thead>
                            <tr>
                                <th className="role-column">
                                    ROLE
                                </th>

                                <th className="permissions-column">
                                    PERMISSIONS
                                </th>

                                <th className="action-column">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* LOADING */}
                            {loading && roles.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="3"
                                        className="no-roles"
                                    >
                                        <FiRefreshCw className="role-loading-icon" />
                                        Loading roles...
                                    </td>
                                </tr>

                            ) : filteredRoles.length === 0 ? (

                                /* EMPTY */
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="no-roles"
                                    >
                                        {search.trim()
                                            ? "No roles match your search."
                                            : "No roles found."}
                                    </td>
                                </tr>

                            ) : (

                                filteredRoles
                                    .slice(0, entriesPerPage)
                                    .map((role) => {

                                        const roleModules =
                                            getRoleModules(role);

                                        return (
                                            <tr key={role.id}>

                                                {/* ROLE */}
                                                <td className="role-name-cell">

                                                    <div className="role-name">
                                                        {getRoleName(role)}
                                                    </div>

                                                </td>

                                                {/* PERMISSIONS */}
                                                <td className="permissions-cell">

                                                    <div className="permission-groups">

                                                        {roleModules.length === 0 ? (

                                                            <span className="no-permission-text">
                                                                No permissions assigned
                                                            </span>

                                                        ) : (

                                                            roleModules.map(
                                                                (
                                                                    moduleItem,
                                                                    index
                                                                ) => {

                                                                    const moduleName =
                                                                        moduleItem?.module ||
                                                                        moduleItem?.moduleName ||
                                                                        moduleItem?.name ||
                                                                        "";

                                                                    const modulePermissions =
                                                                        Array.isArray(
                                                                            moduleItem?.permissions
                                                                        )
                                                                            ? moduleItem.permissions
                                                                            : [];

                                                                    return (
                                                                        <div
                                                                            className="permission-group"
                                                                            key={`${moduleName}-${index}`}
                                                                        >

                                                                            <div className="permission-module-name">
                                                                                {formatModuleName(
                                                                                    moduleName
                                                                                )}
                                                                            </div>

<div className="permission-badges">

    {modulePermissions.length === 0 ? (
        <span className="no-module-permission">
            No permissions
        </span>
    ) : (
        (() => {
            const displayPermissions = [];

            modulePermissions.forEach((permission) => {
                const permissionName =
                    permission?.name || permission;

                const normalizedPermission =
                    permissionName
                        ?.toString()
                        .toLowerCase()
                        .trim();

                if (normalizedPermission === "read") {
                    if (!displayPermissions.includes("read")) {
                        displayPermissions.push("read");
                    }
                }

                /*
                 * Backend "write" means:
                 * - Create
                 * - Update
                 *
                 * So show BOTH badges in frontend.
                 */
                if (normalizedPermission === "write") {
                    if (!displayPermissions.includes("create")) {
                        displayPermissions.push("create");
                    }

                    if (!displayPermissions.includes("update")) {
                        displayPermissions.push("update");
                    }
                }

                /*
                 * If backend ever sends update separately,
                 * still show Update.
                 */
                if (normalizedPermission === "update") {
                    if (!displayPermissions.includes("update")) {
                        displayPermissions.push("update");
                    }
                }

                if (normalizedPermission === "delete") {
                    if (!displayPermissions.includes("delete")) {
                        displayPermissions.push("delete");
                    }
                }
            });

            return displayPermissions.map(
                (permission) => (
                    <span
                        key={permission}
                        className={`permission-badge permission-${permission}`}
                    >
                        {permission
                            .charAt(0)
                            .toUpperCase() +
                            permission.slice(1)}
                    </span>
                )
            );
        })()
    )}

</div>

                                                                        </div>
                                                                    );
                                                                }
                                                            )
                                                        )}

                                                    </div>

                                                </td>

                                                {/* ACTIONS */}
                                                <td className="role-actions-cell">

                                                    <div className="role-actions">

                                                        <button
                                                            type="button"
                                                            className="role-action-button edit-role-button"
                                                            onClick={() =>
                                                                handleEditRole(role)
                                                            }
                                                            title="Edit Role"
                                                            disabled={
                                                                loading ||
                                                                deleteLoading
                                                            }
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="role-action-button delete-role-button"
                                                            onClick={() =>
                                                                handleDeleteRole(
                                                                    role
                                                                )
                                                            }
                                                            title="Delete Role"
                                                            disabled={
                                                                loading ||
                                                                deleteLoading
                                                            }
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =====================================================
                ADD / EDIT ROLE MODAL
            ===================================================== */}
            {showRoleModal && (
                <RoleModal
                    role={editingRole}
                    availableRoles={availableRoles}
                    modules={modules}
                    permissions={permissions}
                    existingRoles={roles}
                    loading={loading}
                    onClose={handleModalClose}
                    onSaved={handleRoleSaved}
                />
            )}

            {/* =====================================================
                DELETE CONFIRMATION MODAL
            ===================================================== */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteModalClose}
                onConfirm={handleConfirmDelete}
                title="Delete role"
                itemName={
                    roleToDelete
                        ? getRoleName(roleToDelete)
                        : ""
                }
                deleteText={
                    deleteLoading
                        ? "Deleting..."
                        : "Delete"
                }
                cancelText="Cancel"
            />

        </div>
    );
};

export default Roles;