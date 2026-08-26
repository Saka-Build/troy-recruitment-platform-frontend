import React, { useState } from "react";
import "./CVTab.css";

const CVTab = ({ candidate }) => {

    if (!candidate) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [previewFile, setPreviewFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [loadingFile, setLoadingFile] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | GET FILE NAME
    |--------------------------------------------------------------------------
    */

    const getFileName = (fileUrl) => {

        if (!fileUrl) {
            return "—";
        }

        const cleanPath =
            fileUrl.split("?")[0];

        const fileName =
            cleanPath.split("/").pop();

        return fileName || "—";
    };


    /*
    |--------------------------------------------------------------------------
    | FILE NAMES
    |--------------------------------------------------------------------------
    */

    const originalCvName =
        getFileName(
            candidate.originalCvUrl
        );

    const troyCvName =
        getFileName(
            candidate.troyCvUrl
        );


    /*
    |--------------------------------------------------------------------------
    | GET FILE URL
    |--------------------------------------------------------------------------
    */

    const getFileUrl = (fileUrl) => {

        if (!fileUrl) {
            return null;
        }

        /*
         * Already a complete URL
         */

        if (
            fileUrl.startsWith("http://") ||
            fileUrl.startsWith("https://")
        ) {
            return fileUrl;
        }

        /*
         * Relative URL
         */

        const API_BASE_URL =
            import.meta.env.VITE_API_BASE_URL || "";

        return `${API_BASE_URL}${fileUrl}`;
    };


    /*
    |--------------------------------------------------------------------------
    | FETCH FILE SAFELY
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | We fetch the file ourselves instead of directly putting the URL
    | inside iframe / anchor.
    |
    | Therefore if backend returns 401, 403, 404, 500 etc.,
    | we show an error instead of navigating to login.
    |
    */

    const fetchFile = async (fileUrl) => {

        const url =
            getFileUrl(fileUrl);

        if (!url) {
            throw new Error("File URL not found");
        }

        const response =
            await fetch(url, {
                method: "GET",
                credentials: "include",
                redirect: "manual",
            });

        /*
         * Any HTTP error should be handled here.
         */

        if (!response.ok) {
            throw new Error(
                `File request failed: ${response.status}`
            );
        }

        /*
         * Make sure the response actually contains data.
         */

        const blob =
            await response.blob();

        if (!blob || blob.size === 0) {
            throw new Error("Empty file");
        }

        return blob;
    };


    /*
    |--------------------------------------------------------------------------
    | PREVIEW
    |--------------------------------------------------------------------------
    */

    const handlePreview = async (
        fileUrl,
        fileName
    ) => {

        if (!fileUrl) {
            return;
        }

        /*
         * Clear previous error
         */

        setFileError(null);

        setLoadingFile(true);

        try {

            const blob =
                await fetchFile(fileUrl);

            /*
             * Create temporary browser URL
             */

            const blobUrl =
                URL.createObjectURL(blob);

            setPreviewFile({
                url: blobUrl,
                name: fileName,
            });

        } catch (error) {

            console.error(
                "CV preview failed:",
                error
            );

            /*
             * DO NOT redirect.
             * DO NOT navigate to login.
             */

            setPreviewFile(null);

            setFileError({
                type: "preview",
                name: fileName,
                message: "Failed to open file.",
            });

        } finally {

            setLoadingFile(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD
    |--------------------------------------------------------------------------
    */

    const handleDownload = async (
        fileUrl,
        fileName
    ) => {

        if (!fileUrl) {
            return;
        }

        setFileError(null);

        setLoadingFile(true);

        try {

            const blob =
                await fetchFile(fileUrl);

            /*
             * Create temporary URL
             */

            const blobUrl =
                URL.createObjectURL(blob);

            /*
             * Download file without opening
             * a new tab.
             */

            const link =
                document.createElement("a");

            link.href =
                blobUrl;

            link.download =
                fileName || "CV";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            /*
             * Release temporary URL
             */

            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 1000);

        } catch (error) {

            console.error(
                "CV download failed:",
                error
            );

            /*
             * DO NOT redirect.
             */

            setFileError({
                type: "download",
                name: fileName,
                message: "Failed to open file.",
            });

        } finally {

            setLoadingFile(false);

        }
    };


    /*
    |--------------------------------------------------------------------------
    | CLOSE PREVIEW
    |--------------------------------------------------------------------------
    */

    const closePreview = () => {

        if (previewFile?.url) {
            URL.revokeObjectURL(
                previewFile.url
            );
        }

        setPreviewFile(null);
    };


    /*
    |--------------------------------------------------------------------------
    | CV CARD
    |--------------------------------------------------------------------------
    */

    const CVCard = ({
        title,
        fileUrl,
        fileName,
        format,
    }) => {

        const hasFile =
            Boolean(fileUrl);

        return (
            <div className="candidate-cv-card">

                <h2>
                    {title}
                </h2>

                <div className="cv-detail-row">

                    <span>
                        File
                    </span>

                    <strong>
                        {fileName}
                    </strong>

                </div>


                {hasFile ? (

                    <>

                        <div className="cv-no-file">

                            Format:{" "}

                            {format || "DOCX"}

                        </div>


                        {/* ACTION BUTTONS */}

                        <div className="cv-file-actions">

                            <button
                                type="button"
                                className="cv-preview-btn"
                                disabled={loadingFile}
                                onClick={() =>
                                    handlePreview(
                                        fileUrl,
                                        fileName
                                    )
                                }
                            >

                                <i className="fas fa-eye"></i>

                                {loadingFile
                                    ? "Opening..."
                                    : "Preview"}

                            </button>


                            <button
                                type="button"
                                className="cv-download-btn"
                                disabled={loadingFile}
                                onClick={() =>
                                    handleDownload(
                                        fileUrl,
                                        fileName
                                    )
                                }
                            >

                                <i className="fas fa-download"></i>

                                {loadingFile
                                    ? "Opening..."
                                    : "Download"}

                            </button>

                        </div>

                    </>

                ) : (

                    <div className="cv-no-file">

                        No file stored

                    </div>

                )}

            </div>
        );
    };


    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

    return (
        <div className="candidate-cv-tab">


            {/* =====================================================
                                FILE ERROR
            ====================================================== */}

            {fileError && (

                <div className="cv-file-error">

                    <i className="fas fa-exclamation-circle"></i>

                    <span>
                        Failed to open file.
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setFileError(null)
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =====================================================
                                ORIGINAL CV
            ====================================================== */}

            <CVCard
                title="Original CV"
                fileUrl={
                    candidate.originalCvUrl
                }
                fileName={
                    originalCvName
                }
                format={
                    candidate.originalCvFormat
                }
            />


            {/* =====================================================
                            TROY FORMAT CV
            ====================================================== */}

            <CVCard
                title="Troy Format CV"
                fileUrl={
                    candidate.troyCvUrl
                }
                fileName={
                    troyCvName
                }
                format="DOCX"
            />


            {/* =====================================================
                            PREVIEW MODAL
            ====================================================== */}

            {previewFile && (

                <div
                    className="cv-preview-overlay"
                    onClick={closePreview}
                >

                    <div
                        className="cv-preview-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="cv-preview-header">

                            <div>

                                <h2>
                                    CV Preview
                                </h2>

                                <span>
                                    {previewFile.name}
                                </span>

                            </div>


                            <button
                                type="button"
                                className="cv-preview-close"
                                onClick={
                                    closePreview
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* PREVIEW */}

                        <div className="cv-preview-body">

                            <iframe
                                src={
                                    previewFile.url
                                }
                                title={
                                    previewFile.name
                                }
                                className="cv-preview-iframe"
                            />

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default CVTab;