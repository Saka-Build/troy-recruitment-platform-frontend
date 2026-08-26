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

    const [previewFile, setPreviewFile] =
        useState(null);


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
    | FILE EXISTENCE
    |--------------------------------------------------------------------------
    */

    const hasOriginalCv =
        Boolean(candidate.originalCvUrl);


    const hasTroyCv =
        Boolean(candidate.troyCvUrl);


    /*
    |--------------------------------------------------------------------------
    | GET FILE URL
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | The API currently returns a server filesystem path.
    |
    | Once backend exposes a download/preview endpoint,
    | change this function to that endpoint.
    |
    */

    const getFileUrl = (fileUrl) => {

        if (!fileUrl) {
            return null;
        }

        /*
         * If backend already returns a complete URL,
         * use it directly.
         */

        if (
            fileUrl.startsWith("http://") ||
            fileUrl.startsWith("https://")
        ) {
            return fileUrl;
        }

        /*
         * If backend returns a relative browser URL,
         * attach API base URL.
         */

        const API_BASE_URL =
            import.meta.env.VITE_API_BASE_URL || "";

        return `${API_BASE_URL}${fileUrl}`;
    };


    /*
    |--------------------------------------------------------------------------
    | PREVIEW
    |--------------------------------------------------------------------------
    */

    const handlePreview = (
        fileUrl,
        fileName
    ) => {

        if (!fileUrl) {
            return;
        }

        const url =
            getFileUrl(fileUrl);

        setPreviewFile({
            url,
            name: fileName,
        });
    };


    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD
    |--------------------------------------------------------------------------
    */

    const handleDownload = (
        fileUrl,
        fileName
    ) => {

        if (!fileUrl) {
            return;
        }

        const url =
            getFileUrl(fileUrl);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            fileName;

        link.target = "_blank";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };


    /*
    |--------------------------------------------------------------------------
    | CLOSE PREVIEW
    |--------------------------------------------------------------------------
    */

    const closePreview = () => {

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
                                onClick={() =>
                                    handlePreview(
                                        fileUrl,
                                        fileName
                                    )
                                }
                            >
                                <i className="fas fa-eye"></i>

                                Preview

                            </button>


                            <button
                                type="button"
                                className="cv-download-btn"
                                onClick={() =>
                                    handleDownload(
                                        fileUrl,
                                        fileName
                                    )
                                }
                            >
                                <i className="fas fa-download"></i>

                                Download

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


    return (
        <div className="candidate-cv-tab">

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

                            {previewFile.url ? (

                                <iframe
                                    src={
                                        previewFile.url
                                    }
                                    title={
                                        previewFile.name
                                    }
                                    className="cv-preview-iframe"
                                />

                            ) : (

                                <div className="cv-preview-error">

                                    Unable to preview
                                    this file.

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default CVTab;