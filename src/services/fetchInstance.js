// const handleUnauthorized = () => {

//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     localStorage.removeItem("activeRole");
//     localStorage.removeItem("roles");

//     window.location.href = "/ats/";
// };


// const fetchInstance = async (
//     url,
//     options = {}
// ) => {

//     const response = await fetch(
//         url,
//         options
//     );


//     /*
//      * Token expired / invalid token
//      */
//     if (response.status === 401) {

//         handleUnauthorized();

//     }


//     /*
//      * IMPORTANT:
//      *
//      * Return the original fetch Response.
//      *
//      * Therefore all your existing code like:
//      *
//      * response.ok
//      * response.json()
//      * response.text()
//      * response.blob()
//      * response.headers.get()
//      *
//      * continues working exactly the same.
//      */

//     return response;
// };


// export default fetchInstance;


const handleUnauthorized = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("activeRole");
    localStorage.removeItem("roles");

    window.location.href = "/ats/";
};

const fetchInstance = async (
    url,
    options = {}
) => {
    const accessToken = localStorage.getItem("accessToken");

    // Preserve any Authorization header explicitly provided
    // by the caller.
    const headers = new Headers(options.headers || {});

    if (
        accessToken &&
        !headers.has("Authorization")
    ) {
        headers.set(
            "Authorization",
            `Bearer ${accessToken}`
        );
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    /*
     * Token expired / invalid token
     */
    if (response.status === 401) {
        handleUnauthorized();
    }

    /*
     * IMPORTANT:
     *
     * Return the original fetch Response.
     *
     * Existing code like:
     *
     * response.ok
     * response.json()
     * response.text()
     * response.blob()
     * response.headers.get()
     *
     * continues working exactly the same.
     */
    return response;
};

export default fetchInstance;