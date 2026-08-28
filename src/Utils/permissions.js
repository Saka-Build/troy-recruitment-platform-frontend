export const hasPermission = (
    modules,
    moduleName,
    permission
) => {

    if (
        !Array.isArray(modules)
    ) {
        return false;
    }

    const moduleData =
        modules.find(
            (item) =>
                item.module?.toUpperCase() ===
                moduleName.toUpperCase()
        );

    if (!moduleData) {
        return false;
    }

    return (
        moduleData.permissions?.some(
            (item) =>
                item.toUpperCase() ===
                permission.toUpperCase()
        ) || false
    );
};