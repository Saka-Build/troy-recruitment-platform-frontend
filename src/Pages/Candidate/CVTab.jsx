import React, { useState } from "react";
import "./Components1.css";

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
    | API BASE URL
    |--------------------------------------------------------------------------
    */

    const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "";


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


    const originalCvName =
        getFileName(candidate.originalCvUrl);

    const troyCvName =
        getFileName(candidate.troyCvUrl);


    /*
    |--------------------------------------------------------------------------
    | GET JWT TOKEN
    |--------------------------------------------------------------------------
    |
    | Change this key ONLY if your application stores the JWT
    |
    */

    const getAuthToken = () => {

        return (
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            sessionStorage.getItem("token") ||
            sessionStorage.getItem("accessToken")
        );
    };


    /*
    |--------------------------------------------------------------------------
    | GET DOWNLOAD API URL
    |--------------------------------------------------------------------------
    */

    const getDownloadApiUrl = (candidateId, cvType) => {

        return `${API_BASE_URL}/api/v1/candidates/${candidateId}/download/cv/${cvType}`;
    };


    /*
    |--------------------------------------------------------------------------
    | GET PRESIGNED S3 URL FROM BACKEND
    |--------------------------------------------------------------------------
    |
    */

    const getPresignedUrl = async (cvType) => {

        const url =
            getDownloadApiUrl(
                candidate.id,
                cvType
            );

        const token =
            getAuthToken();

        const headers = {
            "Accept": "application/json"
        };

     

        if (token) {
            headers["Authorization"] =
                `Bearer ${token}`;
        }

        const response =
            await fetch(url, {
                method: "GET",
                headers,
                credentials: "include"
            });

        if (!response.ok) {

            let errorMessage =
                `Download API failed: ${response.status}`;

            try {

                const errorText =
                    await response.text();

                if (errorText) {
                    errorMessage =
                        errorText;
                }

            } catch (e) {
                // Ignore error parsing
            }

            throw new Error(errorMessage);
        }

        const data =
            await response.json();

        /*
         * 
         *
         * url
         * fileName
         *
         */

        if (!data || !data.url) {
            throw new Error(
                "Backend did not return a presigned URL"
            );
        }

        return data;
    };


  //Downlad from S3

   const handleDownload = async (cvType) => {

    setFileError(null);
    setLoadingFile(true);

    try {

        /*
         * Ask backend for the presigned S3 URL.
         */
        const downloadData =
            await getPresignedUrl(cvType);

        console.log(
            "Presigned URL received:",
            downloadData
        );

        /*
         * Therefore S3 will return the file as a download.
         */

        window.location.href =
            downloadData.url;

    } catch (error) {

        console.error(
            "CV download failed:",
            error
        );

        setFileError({
            type: "download",
            message: "Failed to download CV."
        });

    } finally {

        setLoadingFile(false);
    }
};


    /*
    |--------------------------------------------------------------------------
    | PREVIEW
    |--------------------------------------------------------------------------
    */

    const handlePreview = async (cvType) => {

        setFileError(null);
        setLoadingFile(true);

        try {

            /*
             * Get presigned S3 URL from backend.
             */

            const downloadData =
                await getPresignedUrl(cvType);


        

            const fileName =
                downloadData.fileName || "CV";

            const extension =
                fileName
                    .split(".")
                    .pop()
                    ?.toLowerCase();


            if (
                extension === "pdf"
            ) {

                setPreviewFile({
                    url: downloadData.url,
                    name: fileName
                });

            } else {

                /*
                 * DOC/DOCX cannot reliably be previewed
                 * directly by the browser.
                 */

                setFileError({
                    type: "preview",
                    message:
                        "Preview is available for PDF files. Please use Download for DOC/DOCX files."
                });

            }

        } catch (error) {

            console.error(
                "CV preview failed:",
                error
            );

            setFileError({
                type: "preview",
                message:
                    "Failed to open CV."
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

            /*
             * Only revoke blob URLs.
             * Presigned S3 URLs should not be revoked.
             */

            if (
                previewFile.url.startsWith("blob:")
            ) {

                URL.revokeObjectURL(
                    previewFile.url
                );
            }
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
        cvType
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


                        <div className="cv-file-actions">

                            {/* PREVIEW */}

                            <button
                                type="button"
                                className="cv-preview-btn"
                                disabled={loadingFile}
                                onClick={() =>
                                    handlePreview(cvType)
                                }
                            >

                                <i className="fas fa-eye"></i>

                                {loadingFile
                                    ? "Opening..."
                                    : "Preview"}

                            </button>


                            {/* DOWNLOAD */}

                            <button
                                type="button"
                                className="cv-download-btn"
                                disabled={loadingFile}
                                onClick={() =>
                                    handleDownload(cvType)
                                }
                            >

                                <i className="fas fa-download"></i>

                                {loadingFile
                                    ? "Downloading..."
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
                        {fileError.message}
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
                cvType="original"
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
                cvType="troy"
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