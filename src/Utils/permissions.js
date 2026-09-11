import { useSelector } from "react-redux";

const usePermissions = () => {
  const activeRole = useSelector(
    (state) => state.auth?.activeRole
  );

  const hasPermission = (moduleName, permissionName) => {
    if (
      !activeRole?.modules ||
      !moduleName ||
      !permissionName
    ) {
      return false;
    }

    const modulePermission = activeRole.modules.find(
      (item) =>
        item?.module?.toString().toUpperCase() ===
        moduleName.toString().toUpperCase()
    );

    if (!modulePermission?.permissions) {
      return false;
    }

    return modulePermission.permissions.some(
      (permission) =>
        permission?.toString().toUpperCase() ===
        permissionName.toString().toUpperCase()
    );
  };

  const canRead = (moduleName) =>
    hasPermission(moduleName, "READ");

  const canWrite = (moduleName) =>
    hasPermission(moduleName, "WRITE");

  const canDelete = (moduleName) =>
    hasPermission(moduleName, "DELETE");

  return {
    activeRole,
    hasPermission,
    canRead,
    canWrite,
    canDelete,
  };
};

export default usePermissions;