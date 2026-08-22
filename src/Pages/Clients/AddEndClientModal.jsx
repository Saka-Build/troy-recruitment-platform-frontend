import React, {
    useEffect,
    useState,
} from "react";

import "./AddEndClientModal.css";


function AddEndClientModal({
    client,
    onClose,
    onSave,
    isSubmitting = false,
}) {

    const isEditMode = Boolean(client);


    /* =========================================================
       FORM STATE
    ========================================================= */

    const [form, setForm] = useState({
        name: "",
        status: "Active",
    });


    const [error, setError] = useState("");


    /* =========================================================
       LOAD EDIT DATA
    ========================================================= */

    useEffect(() => {

        if (client) {

            setForm({
                name: client.name || "",
                status: client.status || "Active",
            });

        } else {

            setForm({
                name: "",
                status: "Active",
            });

        }

        setError("");

    }, [client]);


    /* =========================================================
       HANDLE INPUT CHANGE
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


        if (error) {
            setError("");
        }
    };


    /* =========================================================
       HANDLE SAVE
    ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        const trimmedName =
            form.name.trim();


        /* =====================================================
           VALIDATION
        ===================================================== */

        if (!trimmedName) {

            setError(
                "End client name is required."
            );

            return;
        }


        /* =====================================================
           SAVE
        ===================================================== */

        await onSave({

            name: trimmedName,

            /*
                Status is only required by the
                edit modal.

                We still send Active in add mode
                so your existing parent code and
                slice remain compatible.
            */
            status: isEditMode
                ? form.status
                : "Active",
        });
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div
            className="end-client-modal-overlay"
            onMouseDown={(e) => {

                if (
                    e.target === e.currentTarget &&
                    !isSubmitting
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="end-client-modal"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >


                {/* =================================================
                    MODAL HEADER
                ================================================= */}

                <div className="end-client-modal-header">

                    <div>

                        <h2>
                            {isEditMode
                                ? "Edit End Client"
                                : "Add End Client"}
                        </h2>

                        {/* <p>
                            {isEditMode
                                ? "Update end client details"
                                : "Add a new end client"}
                        </p> */}

                    </div>


                    <button
                        type="button"
                        className="end-client-modal-close"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="end-client-modal-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        NAME
                    ================================================= */}

                    <div className="end-client-form-group">

                        <label htmlFor="end-client-name">

                            End Client Name

                            <span className="required">
                                *
                            </span>

                        </label>


                        <input
                            id="end-client-name"
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter end client name"
                            autoComplete="off"
                            disabled={isSubmitting}
                            autoFocus
                        />

                    </div>


                    {/* =================================================
                        STATUS - EDIT ONLY
                    ================================================= */}

                    {isEditMode && (

                        <div className="end-client-form-group">

                            <label htmlFor="end-client-status">

                                Status

                                <span className="required">
                                    *
                                </span>

                            </label>


                            <select
                                id="end-client-status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            >

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="end-client-form-error">

                            {error}

                        </div>

                    )}


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="end-client-modal-footer">

                        <button
                            type="button"
                            className="end-client-cancel-btn"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="end-client-save-btn"
                            disabled={
                                isSubmitting ||
                                !form.name.trim()
                            }
                        >

                            {isSubmitting

                                ? (
                                    isEditMode
                                        ? "Updating..."
                                        : "Adding..."
                                )

                                : (
                                    isEditMode
                                        ? "Update End Client"
                                        : "Add End Client"
                                )
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default AddEndClientModal;