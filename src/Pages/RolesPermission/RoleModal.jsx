import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
    FiCheck,
    FiChevronDown,
    FiX,
    FiLoader,
} from "react-icons/fi";

import {
    createRole,
    updateRole,
} from "../../Redux/Slice/roleSlice";


const RoleModal = ({
    role,
    availableRoles = [],
    modules = [],
    permissions = [],
    existingRoles = [],
    loading = false,
    onClose,
    onSaved,
}) => {

    const dispatch = useDispatch();


    /*
     * =========================================================
     * FORM STATE
     * =========================================================
     */

    const [selectedRole, setSelectedRole] =
        useState("");

    const [selectedPermissions, setSelectedPermissions] =
        useState({});

    const [formError, setFormError] =
        useState("");


    /*
     * =========================================================
     * GET ROLE NAME
     * =========================================================
     */
    const getRoleName = (roleData) => {

        return (
            roleData?.name ||
            roleData?.roleName ||
            roleData?.role ||
            ""
        );

    };


    /*
     * =========================================================
     * GET EXISTING ROLE NAMES
     *
     * These roles already exist in database.
     *
     * Example:
     *
     * Backend available:
     *
     * Super_admin
     * Admin
     * Lead_recruiter
     * Recruiter
     *
     * Existing:
     * Admin
     *
     * Dropdown:
     * Super_admin
     * Lead_recruiter
     * Recruiter
     * =========================================================
     */
    const existingRoleNames = useMemo(() => {

        return existingRoles
            .map((item) =>
                getRoleName(item)
            )
            .filter(Boolean)
            .map((name) =>
                name.toLowerCase()
            );

    }, [existingRoles]);


    /*
     * =========================================================
     * AVAILABLE ROLE OPTIONS
     *
     * CREATE:
     * Only unused roles.
     *
     * EDIT:
     * Unused roles + current role.
     * =========================================================
     */
    const roleOptions = useMemo(() => {

        const currentRoleName =
            getRoleName(role);

        const currentRoleLower =
            currentRoleName.toLowerCase();


        return availableRoles.filter(
            (roleName) => {

                const roleLower =
                    roleName.toLowerCase();

                /*
                 * During edit, current role should
                 * remain visible.
                 */
                if (
                    role &&
                    roleLower ===
                        currentRoleLower
                ) {
                    return true;
                }

                /*
                 * Do not show roles that are
                 * already assigned to another
                 * role record.
                 */
                return !existingRoleNames.includes(
                    roleLower
                );

            }
        );

    }, [
        availableRoles,
        existingRoleNames,
        role,
    ]);


    /*
     * =========================================================
     * PREFILL FORM
     * =========================================================
     */
    useEffect(() => {

        if (!role) {

            setSelectedRole("");
            setSelectedPermissions({});
            setFormError("");

            return;
        }


        /*
         * Role name
         */
        setSelectedRole(
            getRoleName(role)
        );


        /*
         * Existing permissions
         */
        const permissionObject = {};


        /*
         * Expected backend structure:
         *
         * modules: [
         *   {
         *      module: "CANDIDATE",
         *      permissions: [
         *          "READ",
         *          "WRITE"
         *      ]
         *   }
         * ]
         */
        if (Array.isArray(role.modules)) {

            role.modules.forEach(
                (moduleItem) => {

                    const moduleName =
                        moduleItem?.module ||
                        moduleItem?.moduleName ||
                        moduleItem?.name;


                    if (!moduleName) {
                        return;
                    }


                    const modulePermissions =
                        moduleItem?.permissions ||
                        [];


                    permissionObject[
                        moduleName.toUpperCase()
                    ] =
                        modulePermissions
                            .map(
                                (permission) =>
                                    (
                                        permission?.name ||
                                        permission
                                    )
                                        .toString()
                                        .toUpperCase()
                            );

                }
            );

        }


        /*
         * Some APIs may return:
         *
         * permissions: {
         *    CANDIDATE: ["READ"]
         * }
         */
        else if (
            role.permissions &&
            typeof role.permissions ===
                "object" &&
            !Array.isArray(
                role.permissions
            )
        ) {

            Object.entries(
                role.permissions
            ).forEach(
                ([moduleName, modulePermissions]) => {

                    permissionObject[
                        moduleName.toUpperCase()
                    ] =
                        Array.isArray(
                            modulePermissions
                        )
                            ? modulePermissions.map(
                                  (
                                      permission
                                  ) =>
                                      (
                                          permission?.name ||
                                          permission
                                      )
                                          .toString()
                                          .toUpperCase()
                              )
                            : [];

                }
            );

        }


        setSelectedPermissions(
            permissionObject
        );

        setFormError("");

    }, [role]);


    /*
     * =========================================================
     * TOGGLE PERMISSION
     * =========================================================
     */
    const handlePermissionChange = (
        module,
        permission
    ) => {

        const moduleName =
            module.toUpperCase();

        const permissionValue =
            permission.toUpperCase();


        setSelectedPermissions(
            (previous) => {

                const currentPermissions =
                    previous[moduleName] ||
                    [];


                const alreadySelected =
                    currentPermissions.includes(
                        permissionValue
                    );


                let updatedPermissions;


                if (alreadySelected) {

                    updatedPermissions =
                        currentPermissions.filter(
                            (item) =>
                                item !==
                                permissionValue
                        );

                } else {

                    updatedPermissions = [
                        ...currentPermissions,
                        permissionValue,
                    ];

                }


                const updated = {
                    ...previous,
                };


                if (
                    updatedPermissions.length ===
                    0
                ) {

                    delete updated[
                        moduleName
                    ];

                } else {

                    updated[
                        moduleName
                    ] =
                        updatedPermissions;

                }


                return updated;

            }
        );

    };


    /*
     * =========================================================
     * CHECK PERMISSION
     * =========================================================
     */
    const isPermissionSelected = (
        module,
        permission
    ) => {

        return (
            selectedPermissions[
                module.toUpperCase()
            ]?.includes(
                permission.toUpperCase()
            ) || false
        );

    };


    /*
     * =========================================================
     * SUBMIT
     * =========================================================
     */
    const handleSubmit = async (e) => {

        e.preventDefault();

        setFormError("");


        /*
         * Validate role
         */
        if (!selectedRole) {

            setFormError(
                "Please select a role."
            );

            return;
        }


        /*
         * Validate permissions
         */
        if (
            Object.keys(
                selectedPermissions
            ).length === 0
        ) {

            setFormError(
                "Please assign at least one permission."
            );

            return;
        }


        /*
         * =====================================================
         * BACKEND PAYLOAD
         * =====================================================
         *
         * Write = Create + Update
         *
         * Example:
         *
         * {
         *     roleName: "Recruiter",
         *     permissions: {
         *         JOB: ["READ", "WRITE"],
         *         CANDIDATE: ["READ"]
         *     }
         * }
         */
        const payload = {
            roleName: selectedRole,
            permissions: selectedPermissions,
        };


        try {

            if (role?.id) {

                /*
                 * UPDATE
                 */
                await dispatch(
                    updateRole({
                        roleId: role.id,
                        roleData: payload,
                    })
                ).unwrap();

            } else {

                /*
                 * CREATE
                 */
                await dispatch(
                    createRole(payload)
                ).unwrap();

            }


            /*
             * Tell parent to refresh
             * and close modal.
             */
            if (onSaved) {
                await onSaved();
            }

        } catch (error) {

            console.error(
                "Role save error:",
                error
            );

            setFormError(
                error ||
                    "Failed to save role."
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
     * RENDER
     * =========================================================
     */
    return (

        <div
            className="role-modal-overlay"
            onMouseDown={onClose}
        >

            <div
                className="role-modal"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >

                {/* ==========================================
                    HEADER
                ========================================== */}
                <div className="role-modal-header">

                    <div>

                        <h2>
                            {role
                                ? "Edit Role"
                                : "Add Role"}
                        </h2>

                        <p>
                            {role
                                ? "Update role permissions"
                                : "Create a new role and assign permissions"}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="role-modal-close"
                        onClick={onClose}
                    >
                        <FiX size={21} />
                    </button>

                </div>


                {/* ==========================================
                    BODY
                ========================================== */}
                <form
                    className="role-modal-body"
                    onSubmit={handleSubmit}
                >

                    {/* ======================================
                        ERROR
                    ====================================== */}
                    {formError && (

                        <div className="role-form-error">
                            {formError}
                        </div>

                    )}


                    {/* ======================================
                        ROLE
                    ====================================== */}
                    <div className="role-form-group">

                        <label>
                            Role <span>*</span>
                        </label>


                        <div className="role-select-wrapper">

                            <select
                                value={
                                    selectedRole
                                }
                                onChange={(e) =>
                                    setSelectedRole(
                                        e.target.value
                                    )
                                }
                                className="role-form-select"
                                disabled={loading}
                            >

                                <option value="">
                                    Select role
                                </option>


                                {roleOptions.map(
                                    (roleName) => (

                                        <option
                                            key={
                                                roleName
                                            }
                                            value={
                                                roleName
                                            }
                                        >
                                            {roleName}
                                        </option>

                                    )
                                )}

                            </select>


                            <FiChevronDown
                                className="role-select-arrow"
                                size={17}
                            />

                        </div>


                        {roleOptions.length === 0 && (

                            <small className="role-help-text">
                                No unused roles are available.
                            </small>

                        )}

                    </div>


                    {/* ======================================
                        PERMISSIONS TITLE
                    ====================================== */}
                    <div className="permissions-heading">

                        <div>

                            <h3>
                                Module Permissions
                            </h3>

                            <p>
                                Select the permissions this
                                role should have for each module.
                            </p>

                        </div>

                    </div>


                    {/* ======================================
                        MODULES
                    ====================================== */}
                    <div className="module-permissions-list">

                        {modules.length === 0 ? (

                            <div className="no-modules">
                                No modules available.
                            </div>

                        ) : (

                            modules.map(
                                (module) => (

                                    <div
                                        className="module-permission-row"
                                        key={module}
                                    >

                                        {/* MODULE */}
                                        <div className="module-name">
                                            {formatModuleName(
                                                module
                                            )}
                                        </div>


                                        {/* PERMISSIONS */}
                                        <div className="module-permission-options">

                                            {permissions.map(
                                                (
                                                    permission
                                                ) => {

                                                    const checked =
                                                        isPermissionSelected(
                                                            module,
                                                            permission
                                                        );


                                                    return (

                                                        <label
                                                            key={
                                                                permission
                                                            }
                                                            className={`permission-checkbox ${
                                                                checked
                                                                    ? "checked"
                                                                    : ""
                                                            }`}
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={() =>
                                                                    handlePermissionChange(
                                                                        module,
                                                                        permission
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            />


                                                            <span className="custom-checkbox">

                                                                {checked && (
                                                                    <FiCheck
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                )}

                                                            </span>


                                                            <span>
                                                                {permission}
                                                            </span>


                                                            {permission
                                                                .toLowerCase() ===
                                                                "write" && (

                                                                <small>
                                                                    Create +
                                                                    Update
                                                                </small>

                                                            )}

                                                        </label>

                                                    );

                                                }
                                            )}

                                        </div>

                                    </div>

                                )

                            )

                        )}

                    </div>


                    {/* ======================================
                        FOOTER
                    ====================================== */}
                    <div className="role-modal-footer">

                        <button
                            type="button"
                            className="role-cancel-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="role-save-button"
                            disabled={
                                loading ||
                                !selectedRole
                            }
                        >

                            {loading ? (

                                <>
                                    <FiLoader
                                        className="role-button-loader"
                                        size={16}
                                    />

                                    {role
                                        ? "Updating..."
                                        : "Creating..."}
                                </>

                            ) : (

                                role
                                    ? "Update Role"
                                    : "Create Role"

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default RoleModal;