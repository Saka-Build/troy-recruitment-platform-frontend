import React from "react";

const NotesTab = ({
    noteText,
    setNoteText,
    notes = [],
    notesLoading = false,
    notesError = null,
    creatingNote = false,
    handleAddNote,
}) => {

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleString();
    };

    return (
        <div className="candidate-tab-card notes-card">

            <h2>
                Notes
            </h2>

            <textarea
                className="candidate-note-input"
                placeholder="Add a recruiter note..."
                value={noteText}
                onChange={(e) =>
                    setNoteText(e.target.value)
                }
                disabled={creatingNote}
            />

            <button
                type="button"
                className="add-note-btn"
                onClick={handleAddNote}
                disabled={
                    creatingNote ||
                    !noteText.trim()
                }
            >
                {creatingNote
                    ? "Adding..."
                    : "Add note"
                }
            </button>

            {notesLoading && (
                <div className="candidate-notes-loading">
                    Loading notes...
                </div>
            )}

            {notesError && (
                <div className="candidate-notes-error">
                    {notesError}
                </div>
            )}

            {!notesLoading &&
                !notesError &&
                notes.length === 0 && (

                <div className="candidate-notes-empty">
                    No notes added yet.
                </div>
            )}

            {!notesLoading &&
                notes.length > 0 && (

                <div className="candidate-notes-list">

                    {notes.map((note, index) => (

                        <div
                            className="candidate-note-item"
                            key={
                                note.id ||
                                `${note.chatAt || "note"}-${index}`
                            }
                        >

                            <div className="candidate-note-text">
                                {note.content || "-"}
                            </div>

                            <div className="candidate-note-label">

                                <span>
                                    Recruiter note
                                </span>

                                {note.chatAt && (
                                    <span>
                                        {" · "}
                                        {formatDate(
                                            note.chatAt
                                        )}
                                    </span>
                                )}

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

export default NotesTab;