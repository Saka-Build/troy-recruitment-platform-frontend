import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    fetchCountries,
} from "../../Redux/Slice/clientSlice";

import {
    createEndClient,
    fetchEndClients,
    fetchActiveEndClients,
} from "../../Redux/Slice/endClientSlice";

import AddEndClientModal from "../Clients/AddEndClientModal";


function Add_Edit_clients({
    client,
    endClients = [],
    onClose,
    onSave,
    isSubmitting = false,
    error = null,
    countriesError = null,
}) {

    const dispatch = useDispatch();

    const isEditMode =
        Boolean(client);

    const wrapperRef = useRef(null);
    

    /* =========================================================
    CREATE NEW END CLIENT MODAL
    ========================================================= */

    const [
        showCreateEndClientModal,
        setShowCreateEndClientModal,
    ] = useState(false);

    /* =========================================================
       VALIDATION ERRORS STATE
    ========================================================= */

    const [errors, setErrors] = useState({});
    
    /* =========================================================
       API ERROR STATE - For user-friendly message
    ========================================================= */
    
    const [apiErrorMessage, setApiErrorMessage] = useState("");

/* =========================================================
   REDUX
========================================================= */

const {
    countries,
    countriesLoading,
} = useSelector(
    (state) => state.clients
);


const {
    creating: creatingEndClient,
} = useSelector(
    (state) => state.endClients
);

    /* =========================================================
       FORM
    ========================================================= */

    const [form, setForm] = useState({

        name: "",

        industry: "",

        countryCode: "",

        contactPerson: "",

        source: "",

        endClientIds: [],

        status: "Active",

        email: "",

        phone: "",

    });


    /* =========================================================
       END CLIENT SEARCH
    ========================================================= */

    const [endClientSearchTerm, setEndClientSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    /* =========================================================
       HELPER: EXTRACT USER-FRIENDLY ERROR MESSAGE
    ========================================================= */

    const getFriendlyErrorMessage = (err) => {
        if (!err) return null;
        
        // If error is a string
        if (typeof err === 'string') {
            // Check if it's a JSON string
            try {
                const parsed = JSON.parse(err);
                if (parsed.message) {
                    return parsed.message;
                }
                return err;
            } catch {
                return err;
            }
        }
        
        // If error is an object
        if (typeof err === 'object') {
            // Check for message property
            if (err.message) {
                // Clean up common error messages
                let message = err.message;
                
                // Handle "Client with email already exists" errors
                if (message.includes('Client with email already exists')) {
                    const emailMatch = message.match(/email already exists:\s*([^\s]+)/);
                    if (emailMatch && emailMatch[1]) {
                        return `This email (${emailMatch[1]}) is already registered. Please use a different email address.`;
                    }
                    return 'This email is already registered. Please use a different email address.';
                }
                
                // Handle other common errors
                if (message.includes('duplicate')) {
                    return 'This record already exists. Please check your data.';
                }
                
                return message;
            }
            
            // If error has error property (like from axios)
            if (err.error) {
                return err.error;
            }
        }
        
        // Fallback
        return 'An error occurred. Please try again.';
    };

    /* =========================================================
       UPDATE API ERROR MESSAGE
    ========================================================= */

    useEffect(() => {
        if (error) {
            const friendlyMessage = getFriendlyErrorMessage(error);
            setApiErrorMessage(friendlyMessage);
        } else if (countriesError) {
            const friendlyMessage = getFriendlyErrorMessage(countriesError);
            setApiErrorMessage(friendlyMessage);
        } else {
            setApiErrorMessage("");
        }
    }, [error, countriesError]);

    /* =========================================================
       FETCH COUNTRIES
    ========================================================= */

    useEffect(() => {

        if (!countries?.length) {

            dispatch(
                fetchCountries()
            );

        }

    }, [
        dispatch,
        countries,
    ]);


    /* =========================================================
       LOAD EDIT DATA
    ========================================================= */

    useEffect(() => {

        if (client) {

            const existingEndClientIds =
                Array.isArray(
                    client.endClients
                )
                    ? client.endClients
                        .map(
                            (item) =>
                                item.id
                        )
                        .filter(Boolean)
                    : Array.isArray(
                        client.endClientIds
                    )
                        ? client.endClientIds
                        : [];


            setForm({

                name:
                    client.name ||
                    client.company ||
                    "",

                industry:
                    client.industry ||
                    "",

                countryCode:
                    client.countryCode ||
                    "",

                contactPerson:
                    client.contactPerson ||
                    "",

                source:
                    client.source ||
                    client.opportunityThrough ||
                    "",

                endClientIds:
                    existingEndClientIds,

                status:
                    client.status ||
                    "Active",

                email:
                    client.email ||
                    "",

                phone:
                    client.phone ||
                    "",

            });

        } else {

            setForm({

                name: "",

                industry: "",

                countryCode: "",

                contactPerson: "",

                source: "",

                endClientIds: [],

                status: "Active",

                email: "",

                phone: "",

            });

        }

        // Reset search when modal opens/closes or client changes
        setEndClientSearchTerm("");
        setShowSuggestions(false);
        setFocusedIndex(-1);
        setErrors({}); // Reset errors when client changes
        setApiErrorMessage(""); // Reset API error when modal changes

    }, [client]);


    /* =========================================================
       HANDLE INPUT
    ========================================================= */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]: value,

        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
        
        // Clear API error when user starts typing
        if (apiErrorMessage) {
            setApiErrorMessage("");
        }

    };


    /* =========================================================
       HANDLE END CLIENT SEARCH
    ========================================================= */

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setEndClientSearchTerm(value);
        setShowSuggestions(true);
        setFocusedIndex(-1);
    };


    /* =========================================================
       FILTERED END CLIENTS
    ========================================================= */

    const getFilteredEndClients = () => {
        if (!endClientSearchTerm.trim()) {
            // Show all available end clients when search is empty
            return endClients;
        }

        const searchLower = endClientSearchTerm.toLowerCase().trim();
        return endClients.filter(endClient => 
            endClient.name.toLowerCase().includes(searchLower)
        );
    };

    // Filter out already selected clients from suggestions
    const getAvailableEndClients = () => {
        const filtered = getFilteredEndClients();
        return filtered.filter(endClient => 
            !form.endClientIds.includes(endClient.id)
        );
    };

    const availableEndClients = getAvailableEndClients();


    /* =========================================================
       TOGGLE END CLIENT
    ========================================================= */

    const handleEndClientToggle = (
        endClientId
    ) => {

        setForm((prev) => {

            const alreadySelected =
                prev.endClientIds.includes(
                    endClientId
                );


            if (alreadySelected) {

                return {

                    ...prev,

                    endClientIds:
                        prev.endClientIds.filter(
                            (id) =>
                                id !==
                                endClientId
                        ),

                };

            }


            return {

                ...prev,

                endClientIds: [

                    ...prev.endClientIds,

                    endClientId,

                ],

            };

        });

        // Clear error for end client if it exists
        if (errors.endClientIds) {
            setErrors((prev) => ({
                ...prev,
                endClientIds: "",
            }));
        }

        // Clear search and close suggestions after selection
        setEndClientSearchTerm("");
        setShowSuggestions(false);
        setFocusedIndex(-1);
    };


    /* =========================================================
       REMOVE END CLIENT
    ========================================================= */

    const removeEndClient = (
        endClientId
    ) => {

        setForm((prev) => ({

            ...prev,

            endClientIds:
                prev.endClientIds.filter(
                    (id) =>
                        id !==
                        endClientId
                ),

        }));

    };


    /* =========================================================
       GET END CLIENT NAME
    ========================================================= */

    const getEndClientName = (
        id
    ) => {

        const found =
            endClients.find(
                (item) =>
                    item.id === id
            );

        return (
            found?.name ||
            "Unknown"
        );

    };


    /* =========================================================
       KEYBOARD NAVIGATION
    ========================================================= */

    const handleKeyDown = (e) => {
        if (!showSuggestions || availableEndClients.length === 0) {
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) => 
                prev < availableEndClients.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter" && focusedIndex >= 0) {
            e.preventDefault();
            const selectedClient = availableEndClients[focusedIndex];
            if (selectedClient) {
                handleEndClientToggle(selectedClient.id);
            }
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            setFocusedIndex(-1);
        }
    };

    /* =========================================================
   OPEN CREATE END CLIENT MODAL
========================================================= */

const handleOpenCreateEndClient = () => {

    setShowCreateEndClientModal(true);

};


/* =========================================================
   CLOSE CREATE END CLIENT MODAL
========================================================= */

const handleCloseCreateEndClient = () => {

    if (creatingEndClient) {
        return;
    }

    setShowCreateEndClientModal(false);

};


/* =========================================================
   CREATE NEW END CLIENT
========================================================= */

const handleCreateEndClient = async (
    endClientData
) => {

    try {

        /* =====================================================
           CREATE
        ===================================================== */

        const createdEndClient =
            await dispatch(
                createEndClient({

                    name:
                        endClientData.name,

                    /*
                        AddEndClientModal sends
                        Active by default.
                    */
                    status:
                        endClientData.status ||
                        "Active",

                })
            ).unwrap();


        console.log(
            "Created End Client:",
            createdEndClient
        );


        /* =====================================================
           REFRESH END CLIENT LIST
           
           This updates Redux immediately without
           refreshing the browser/page.
        ===================================================== */

        await dispatch(
            fetchActiveEndClients()
        ).unwrap();


        /* =====================================================
           AUTO SELECT NEW END CLIENT
        ===================================================== */

        if (createdEndClient?.id) {

            setForm((prev) => {

                if (
                    prev.endClientIds.includes(
                        createdEndClient.id
                    )
                ) {
                    return prev;
                }


                return {

                    ...prev,

                    endClientIds: [
                        ...prev.endClientIds,

                        createdEndClient.id,
                    ],

                };

            });

        }


        /* =====================================================
           CLOSE CREATE MODAL
        ===================================================== */

        setShowCreateEndClientModal(false);


        /* =====================================================
           CLEAR SEARCH
        ===================================================== */

        setEndClientSearchTerm("");

        setShowSuggestions(false);

        setFocusedIndex(-1);


    } catch (error) {

        console.error(
            "Create end client error:",
            error
        );

    }

};
    /* =========================================================
       VALIDATE FORM
    ========================================================= */

    const validateForm = () => {
        const newErrors = {};

        // Required: Client name
        if (!form.name.trim()) {
            newErrors.name = "Client name is required";
        }

        // Required: Industry
        if (!form.industry.trim()) {
            newErrors.industry = "Industry is required";
        }

        // Required: Country
        if (!form.countryCode) {
            newErrors.countryCode = "Country is required";
        }

        // Required: Contact person
        if (!form.contactPerson.trim()) {
            newErrors.contactPerson = "Contact person is required";
        }

        // Required: At least one end client
        if (form.endClientIds.length === 0) {
            newErrors.endClientIds = "At least one end client is required";
        }

        // Required: Status
        if (!form.status) {
            newErrors.status = "Status is required";
        }

        // Required: Email (with validation)
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone is optional - no validation needed
        // Source/Opportunity through is optional - no validation needed

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit = (e) => {

        e.preventDefault();

        // Clear previous API error
        setApiErrorMessage("");

        // Validate all required fields
        if (!validateForm()) {
            // Scroll to the first error field
            const firstErrorField = document.querySelector('.client-form-group .error-input, .client-form-group .error-select');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            }
            return;
        }

        const payload = {

            name:
                form.name.trim(),

            industry:
                form.industry.trim(),

            countryCode:
                form.countryCode,

            contactPerson:
                form.contactPerson.trim(),

            source:
                form.source.trim(),

            endClientIds:
                form.endClientIds,

            status:
                form.status,

            email:
                form.email.trim(),

            phone:
                form.phone.trim(),

        };


        console.log(
            "CLIENT PAYLOAD:",
            payload
        );


        onSave(payload);

    };


    /* =========================================================
       CLOSE BACKDROP
    ========================================================= */

    const handleBackdropClick = (
        e
    ) => {

        if (
            e.target ===
            e.currentTarget
        ) {

            onClose();

        }

    };


    /* =========================================================
       CLOSE SUGGESTIONS ON OUTSIDE CLICK
    ========================================================= */

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside the wrapper
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setFocusedIndex(-1);
            }
        };

        // Use click event instead of mousedown for better compatibility
        document.addEventListener(
            "click",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "click",
                handleClickOutside
            );
        };
    }, []);


    return (

        <div
            className="client-modal-overlay"
            onMouseDown={
                handleBackdropClick
            }
        >

            <div
                className="client-modal"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="client-modal-header">

                    <h2>

                        {isEditMode
                            ? "Edit client"
                            : "Add client"}

                    </h2>


                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                        disabled={
                            isSubmitting
                        }
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    API ERROR - USER FRIENDLY
                ================================================= */}

                {apiErrorMessage && (
                    <div style={{
                        margin: "16px 28px 0",
                        padding: "12px 16px",
                        backgroundColor: "#fee2e2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        color: "#dc2626",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}>
                        <span style={{ fontSize: "18px" }}>⚠️</span>
                        <span>{apiErrorMessage}</span>
                    </div>
                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="client-modal-body">


                        {/* =================================================
                            CLIENT NAME
                        ================================================= */}

                        <div className="client-form-group full-width">

                            <label>

                                Client name{" "}

                                <span style={{ color: "red" }}>
                                    *
                                </span>

                            </label>


                            <input
                                type="text"
                                name="name"
                                value={
                                    form.name
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="off"
                                disabled={
                                    isSubmitting
                                }
                                className={errors.name ? "error-input" : ""}
                                style={{
                                    borderColor: errors.name ? "#dc2626" : "",
                                }}
                            />

                            {errors.name && (
                                <div style={{ 
                                    color: "#dc2626", 
                                    fontSize: "12px", 
                                    marginTop: "4px" 
                                }}>
                                    {errors.name}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            INDUSTRY
                        ================================================= */}

                        <div className="client-form-group">

                            <label>
                                Industry{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>


                            <input
                                type="text"
                                name="industry"
                                value={
                                    form.industry
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isSubmitting
                                }
                                className={errors.industry ? "error-input" : ""}
                                style={{
                                    borderColor: errors.industry ? "#dc2626" : "",
                                }}
                            />

                            {errors.industry && (
                                <div style={{ 
                                    color: "#dc2626", 
                                    fontSize: "12px", 
                                    marginTop: "4px" 
                                }}>
                                    {errors.industry}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            COUNTRY
                        ================================================= */}

                        <div className="client-form-group">

                            <label>
                                Country{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>


                            <select
                                name="countryCode"
                                value={
                                    form.countryCode
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isSubmitting ||
                                    countriesLoading
                                }
                                className={errors.countryCode ? "error-select" : ""}
                                style={{
                                    borderColor: errors.countryCode ? "#dc2626" : "",
                                }}
                            >

                                <option value="">

                                    {countriesLoading
                                        ? "Loading countries..."
                                        : "Select country"}

                                </option>


                                {countries.map(
                                    (country) => (

                                        <option
                                            key={
                                                country.id
                                            }
                                            value={
                                                country.code
                                            }
                                        >

                                            {country.name}

                                        </option>

                                    )
                                )}

                            </select>

                            {errors.countryCode && (
                                <div style={{ 
                                    color: "#dc2626", 
                                    fontSize: "12px", 
                                    marginTop: "4px" 
                                }}>
                                    {errors.countryCode}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            CONTACT PERSON
                        ================================================= */}

                        <div className="client-form-group">

                            <label>
                                Contact person{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>


                            <input
                                type="text"
                                name="contactPerson"
                                value={
                                    form.contactPerson
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isSubmitting
                                }
                                className={errors.contactPerson ? "error-input" : ""}
                                style={{
                                    borderColor: errors.contactPerson ? "#dc2626" : "",
                                }}
                            />

                            {errors.contactPerson && (
                                <div style={{ 
                                    color: "#dc2626", 
                                    fontSize: "12px", 
                                    marginTop: "4px" 
                                }}>
                                    {errors.contactPerson}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            OPPORTUNITY THROUGH (OPTIONAL)
                        ================================================= */}

                        <div className="client-form-group">

                            <label>
                                Opportunity through{" "}
                                <span style={{ color: "#999", fontSize: "12px" }}>(optional)</span>
                            </label>


                            <input
                                type="text"
                                name="source"
                                value={
                                    form.source
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Who brought / contacted this client (BDM)"
                                disabled={
                                    isSubmitting
                                }
                            />

                        </div>


                        {/* =================================================
                            END CLIENT SEARCH WITH SUGGESTIONS (REQUIRED)
                        ================================================= */}

                        <div
                            className="client-form-group full-width"
                        >

                            <label>
                                End client{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>


                            <div 
                                className="end-client-select-wrapper"
                                ref={wrapperRef}
                            >

                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Type to search end clients..."
                                    value={endClientSearchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isSubmitting}
                                    style={{
                                        width: "100%",
                                        height: "48px",
                                        padding: "0 14px",
                                        border: `1px solid ${errors.endClientIds ? "#dc2626" : "#d7e1ee"}`,
                                        borderRadius: "11px",
                                        fontSize: "16px",
                                        color: "#263b5b",
                                        outline: "none",
                                        background: "#ffffff",
                                        fontFamily: "inherit",
                                    }}
                                />
                                {/* =================================================
                                    CREATE NEW END CLIENT
                                ================================================= */}
                                    <div className="create-end-client-prompt">
                                        <span className="prompt-text">Don't see your end client?</span>
                                        <button
                                            type="button"
                                            className="create-new-end-client-btn"
                                            onClick={handleOpenCreateEndClient}
                                            disabled={isSubmitting}
                                        >
                                            + Create new
                                        </button>
                                    </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div className="end-client-dropdown">
                                        
                                        {availableEndClients.length === 0 ? (

                                            <div className="end-client-empty">
                                                {endClientSearchTerm.trim() 
                                                    ? "No matching end clients found" 
                                                    : endClients.length === 0
                                                        ? "No end clients available"
                                                        : "All end clients are already selected"}
                                            </div>

                                        ) : (

                                            availableEndClients.map(
                                                (
                                                    endClient,
                                                    index
                                                ) => {

                                                    const isFocused = index === focusedIndex;

                                                    return (

                                                        <div
                                                            key={endClient.id}
                                                            className={`end-client-option ${isFocused ? "selected" : ""}`}
                                                            onClick={() => handleEndClientToggle(endClient.id)}
                                                            onMouseEnter={() => setFocusedIndex(index)}
                                                            style={{
                                                                cursor: "pointer",
                                                                padding: "10px 14px",
                                                                backgroundColor: isFocused ? "#eef4ff" : "transparent",
                                                                transition: "background-color 0.15s ease",
                                                            }}
                                                        >

                                                            <span>
                                                                {endClient.name}
                                                            </span>

                                                        </div>

                                                    );

                                                }
                                            )

                                        )}

                                    </div>
                                )}

                            </div>


                            {/* SELECTED CHIPS */}

                            {form.endClientIds.length >
                                0 && (

                                <div className="selected-end-clients">

                                    {form.endClientIds.map(
                                        (
                                            endClientId
                                        ) => (

                                            <span
                                                key={
                                                    endClientId
                                                }
                                                className="selected-end-client-chip"
                                            >

                                                {
                                                    getEndClientName(
                                                        endClientId
                                                    )
                                                }


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeEndClient(
                                                            endClientId
                                                        )
                                                    }
                                                    disabled={
                                                        isSubmitting
                                                    }
                                                >
                                                    ×
                                                </button>

                                            </span>

                                        )
                                    )}

                                </div>

                            )}

                            {errors.endClientIds && (
                                <div style={{ 
                                    color: "#dc2626", 
                                    fontSize: "12px", 
                                    marginTop: "4px" 
                                }}>
                                    {errors.endClientIds}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div className="client-form-group">

                            <label>
                                Status{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>


                            <select
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isSubmitting
                                }
                                className={errors.status ? "error-select" : ""}
                                style={{
                                    borderColor: errors.status ? "#dc2626" : "",
                                }}
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                            {errors.status && (
                                <div style={{ 
                                    color: "#dc2626", 
                                    fontSize: "12px", 
                                    marginTop: "4px" 
                                }}>
                                    {errors.status}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="client-form-group">

                            <label>
                                Email{" "}
                                <span style={{ color: "red" }}>*</span>
                            </label>


                            <input
                                type="email"
                                name="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isSubmitting
                                }
                                className={errors.email ? "error-input" : ""}
                                style={{
                                    borderColor: errors.email ? "#dc2626" : "",
                                }}
                            />

                            {errors.email && (
                                <div style={{ 
                                    color: "#dc2626", 
                                    fontSize: "12px", 
                                    marginTop: "4px" 
                                }}>
                                    {errors.email}
                                </div>
                            )}

                        </div>


                        {/* =================================================
                            PHONE (OPTIONAL)
                        ================================================= */}

                        <div className="client-form-group">

                            <label>
                                Phone{" "}
                                <span style={{ color: "#999", fontSize: "12px" }}>(optional)</span>
                            </label>


                            <input
                                type="text"
                                name="phone"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    isSubmitting
                                }
                            />

                        </div>


                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="client-modal-footer">


                        <button
                            type="button"
                            className="modal-cancel-btn"
                            onClick={
                                onClose
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="modal-submit-btn"
                            disabled={
                                isSubmitting
                            }
                        >

                            {isSubmitting

                                ? isEditMode
                                    ? "Saving..."
                                    : "Adding..."

                                : isEditMode
                                    ? "Save changes"
                                    : "Add client"}

                        </button>


                    </div>

                </form>
                

            </div>
            {/* =========================================================
    CREATE NEW END CLIENT MODAL
========================================================= */}

{showCreateEndClientModal && (

    <AddEndClientModal

        client={null}

        onClose={
            handleCloseCreateEndClient
        }

        onSave={
            handleCreateEndClient
        }

        isSubmitting={
            creatingEndClient
        }

    />

)}

        </div>

        

    );
}


export default Add_Edit_clients;