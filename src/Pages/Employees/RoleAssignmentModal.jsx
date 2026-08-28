import React, { useEffect, useMemo, useState } from "react";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";

const RoleAssignmentModal = ({
    employee,
    roles = [],
    assignedRoles = [],
    onClose,
    onAssign,
    isSubmitting = false,
}) => {
    const [selectedRoleIds, setSelectedRoleIds] = useState([]);

    /*
     * Normalize role ID because depending on backend response
     * it may be id / roleId.
     */
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

    /*
     * IDs of roles already assigned to this employee.
     */
    const assignedRoleIds = useMemo(() => {
        return assignedRoles
            .map((role) => getRoleId(role))
            .filter(Boolean)
            .map(String);
    }, [assignedRoles]);

    /*
     * Reset selection whenever another employee/modal opens.
     */
    useEffect(() => {
        setSelectedRoleIds([]);
    }, [employee?.id]);

    /*
     * Only show roles that are not already assigned.
     */
    const availableRoles = useMemo(() => {
        return roles.filter((role) => {
            const roleId = getRoleId(role);

            if (!roleId) {
                return false;
            }

            return !assignedRoleIds.includes(
                String(roleId)
            );
        });
    }, [roles, assignedRoleIds]);

    const handleRoleChange = (roleId) => {
        const id = String(roleId);

        setSelectedRoleIds((previous) => {
            if (previous.includes(id)) {
                return previous.filter(
                    (item) => item !== id
                );
            }

            return [...previous, id];
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedRoleIds.length === 0) {
            return;
        }

        await onAssign(selectedRoleIds);
    };

    return (
        <div
            className="role-assignment-modal-overlay"
            onMouseDown={onClose}
        >
            <div
                className="role-assignment-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                {/* HEADER */}
                <div className="role-assignment-modal-header">
                    <div>
                        <h2>Assign Role</h2>

                        <p>
                            Assign one or more roles to{" "}
                            <strong>
                                {employee?.fullName}
                            </strong>
                        </p>
                    </div>

                    <button
                        type="button"
                        className="role-assignment-modal-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        <FiX size={21} />
                    </button>
                </div>

                {/* BODY */}
                <form
                    className="role-assignment-modal-body"
                    onSubmit={handleSubmit}
                >
                    <div className="role-assignment-form-group">
                        <label>
                            Select Roles
                            <span>*</span>
                        </label>

                        {availableRoles.length === 0 ? (
                            <div className="role-assignment-empty">
                                All available roles are already
                                assigned to this employee.
                            </div>
                        ) : (
                            <div className="role-assignment-list">
                                {availableRoles.map(
                                    (role) => {
                                        const roleId =
                                            getRoleId(role);

                                        const roleName =
                                            getRoleName(role);

                                        const checked =
                                            selectedRoleIds.includes(
                                                String(roleId)
                                            );

                                        return (
                                            <label
                                                key={roleId}
                                                className={`role-assignment-option ${
                                                    checked
                                                        ? "selected"
                                                        : ""
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        handleRoleChange(
                                                            roleId
                                                        )
                                                    }
                                                />

                                                <span className="role-assignment-checkbox">
                                                    {checked && (
                                                        <FiCheck
                                                            size={13}
                                                        />
                                                    )}
                                                </span>

                                                <span className="role-assignment-name">
                                                    {roleName}
                                                </span>
                                            </label>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        {selectedRoleIds.length > 0 && (
                            <div className="role-assignment-selected-count">
                                {selectedRoleIds.length}{" "}
                                {selectedRoleIds.length === 1
                                    ? "role"
                                    : "roles"}{" "}
                                selected
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="role-assignment-modal-footer">
                        <button
                            type="button"
                            className="role-assignment-cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="role-assignment-submit"
                            disabled={
                                isSubmitting ||
                                selectedRoleIds.length === 0 ||
                                availableRoles.length === 0
                            }
                        >
                            {isSubmitting
                                ? "Assigning..."
                                : "Assign Role"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleAssignmentModal;