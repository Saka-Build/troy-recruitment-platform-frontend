import React from "react";

const CVTab = () => {

    return (
        <div className="candidate-cv-tab">

            {/* ORIGINAL CV CARD */}
            <div className="candidate-cv-card">

                <h2>Original CV</h2>

                <div className="cv-detail-row">

                    <span>
                        File
                    </span>

                    <strong>
                        —
                    </strong>

                </div>

                <div className="cv-no-file">
                    No original file stored
                </div>

            </div>


            {/* CV PREVIEW / EMPTY STATE */}
            <div className="cv-preview-empty">

                <div className="cv-document-icon">

                    <svg
                        width="36"
                        height="43"
                        viewBox="0 0 36 43"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <path
                            d="M5 1H23L34 12V42H5C2.79 42 1 40.21 1 38V5C1 2.79 2.79 1 5 1Z"
                            fill="#F8FCFF"
                            stroke="#65B8ED"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M23 1V12H34"
                            stroke="#65B8ED"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M9 20H27"
                            stroke="#9ACCF0"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M9 25H27"
                            stroke="#9ACCF0"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M9 30H23"
                            stroke="#9ACCF0"
                            strokeWidth="1.5"
                        />

                    </svg>

                </div>


                <div className="cv-empty-title">
                    No Troy Format CV yet.
                </div>

                <div className="cv-empty-description">
                    Open Edit and upload the Troy Word CV.
                </div>

            </div>

        </div>
    );
};


export default CVTab;