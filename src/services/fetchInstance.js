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

    const response = await fetch(
        url,
        options
    );


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
     * Therefore all your existing code like:
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