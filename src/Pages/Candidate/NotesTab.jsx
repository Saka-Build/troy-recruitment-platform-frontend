import React from "react";

const NotesTab = ({
    noteText,
    setNoteText,
    notes,
    handleAddNote,
}) => {

    return (
        <div className="candidate-tab-card notes-card">

            <h2>Notes</h2>

            <textarea
                className="candidate-note-input"
                placeholder="Add a recruiter note..."
                value={noteText}
                onChange={(e) =>
                    setNoteText(e.target.value)
                }
            />

            <button
                className="add-note-btn"
                onClick={handleAddNote}
            >
                Add note
            </button>


            <div className="candidate-notes-list">

                {notes.map((note, index) => (

                    <div
                        className="candidate-note-item"
                        key={index}
                    >

                        <div className="candidate-note-text">
                            {note.text}
                        </div>

                        <div className="candidate-note-label">
                            {note.label}
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};


export default NotesTab;