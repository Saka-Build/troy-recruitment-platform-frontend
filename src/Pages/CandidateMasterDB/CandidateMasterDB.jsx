import { useMemo, useRef, useState } from "react";
import "./CandidateMasterDB.css";

const INITIAL_CANDIDATES = [
    {
        id: 1,
        referenceId: "REF-S453",
        client: "Nova Manufacturing",
        recruiter: "You",
        roleName: "SAP S/4HANA Consultant",
        candidateName: "Julia Deveraux",
        candidateStatus: "Interview",
        email: "julia@example.com",
        phone: "+44 7700 900123",
        location: "London, UK",
        experience: "11y",
        skills: "SAP FICO, S/4HANA",
    },
    {
        id: 2,
        referenceId: "REF-UT79",
        client: "Meridian Fintech",
        recruiter: "You",
        roleName: "Cloud Security Engineer",
        candidateName: "Omar Salah",
        candidateStatus: "Interview",
        email: "omar@example.com",
        phone: "+971 500 123456",
        location: "Dubai, UAE",
        experience: "9y",
        skills: "AWS, IAM",
    },
    {
        id: 3,
        referenceId: "REF-VXKJ",
        client: "Nova Manufacturing",
        recruiter: "You",
        roleName: "SAP S/4HANA Consultant",
        candidateName: "Anita Kumar",
        candidateStatus: "Screening",
        email: "anita@example.com",
        phone: "+91 98765 43210",
        location: "Pune, IN",
        experience: "8y",
        skills: "SAP FICO, MM",
    },
    {
        id: 4,
        referenceId: "REF-8QMQ",
        client: "Helix Health AI",
        recruiter: "You",
        roleName: "AI / ML Engineer",
        candidateName: "Marco Bianchi",
        candidateStatus: "New",
        email: "marco@example.com",
        phone: "+39 333 123456",
        location: "Berlin, DE",
        experience: "6y",
        skills: "PyTorch, Python",
    },
    {
        id: 5,
        referenceId: "REF-ZWTW",
        client: "Meridian Fintech",
        recruiter: "You",
        roleName: "Cloud Security Engineer",
        candidateName: "Priya Nair",
        candidateStatus: "Offer",
        email: "priya@example.com",
        phone: "+91 98765 12345",
        location: "Remote",
        experience: "7y",
        skills: "AWS, Security",
    },
    {
        id: 6,
        referenceId: "REF-4XX5",
        client: "Nova Manufacturing",
        recruiter: "You",
        roleName: "SAP S/4HANA Consultant",
        candidateName: "David Osei",
        candidateStatus: "Joined",
        email: "david@example.com",
        phone: "+44 7700 123456",
        location: "Manchester, UK",
        experience: "10y",
        skills: "SAP ABAP, Fiori",
    },
];

const DEFAULT_COLUMNS = {
    referenceId: true,
    client: true,
    recruiter: true,
    roleName: true,
    candidateName: true,
    candidateStatus: true,
    email: false,
    phone: false,
    location: false,
    experience: false,
    skills: false,
};

const COLUMN_LABELS = {
    referenceId: "Reference ID",
    client: "Client",
    recruiter: "Recruiter",
    roleName: "Role Name",
    candidateName: "Candidate Name",
    candidateStatus: "Candidate Status",
    email: "Email",
    phone: "Phone",
    location: "Location",
    experience: "Experience",
    skills: "Skills",
};

const STATUS_OPTIONS = [
    "New",
    "Screening",
    "Interview",
    "Offer",
    "Joined",
    "Rejected",
    "Hold",
];

function CandidateMasterDatabase({ onAddCandidate }) {
    const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [clientFilter, setClientFilter] = useState("All");

    const [selectedRows, setSelectedRows] = useState([]);
    const [columns, setColumns] = useState(DEFAULT_COLUMNS);

    const [showColumns, setShowColumns] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [editingCell, setEditingCell] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const [page, setPage] = useState(1);
    const rowsPerPage = 25;

    const fileInputRef = useRef(null);

    const clients = useMemo(() => {
        return ["All", ...new Set(candidates.map((candidate) => candidate.client))];
    }, [candidates]);

    const filteredCandidates = useMemo(() => {
        const query = search.trim().toLowerCase();

        return candidates.filter((candidate) => {
            const matchesSearch =
                !query ||
                Object.values(candidate).some((value) =>
                    String(value).toLowerCase().includes(query)
                );

            const matchesStatus =
                statusFilter === "All" ||
                candidate.candidateStatus === statusFilter;

            const matchesClient =
                clientFilter === "All" ||
                candidate.client === clientFilter;

            return matchesSearch && matchesStatus && matchesClient;
        });
    }, [candidates, search, statusFilter, clientFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCandidates.length / rowsPerPage)
    );

    const visibleCandidates = filteredCandidates.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const stats = useMemo(() => {
        const total = candidates.length;

        const today = 0;

        const submitted = candidates.filter(
            (candidate) => candidate.candidateStatus === "Submitted"
        ).length;

        const clientReview = candidates.filter(
            (candidate) => candidate.candidateStatus === "Client Review"
        ).length;

        const interviewR1 = candidates.filter(
            (candidate) => candidate.candidateStatus === "Interview"
        ).length;

        const interviewR2 = 0;

        const final = candidates.filter(
            (candidate) => candidate.candidateStatus === "Final"
        ).length;

        const offerReleased = candidates.filter(
            (candidate) => candidate.candidateStatus === "Offer"
        ).length;

        const offerAccepted = candidates.filter(
            (candidate) => candidate.candidateStatus === "Joined"
        ).length;

        const joined = candidates.filter(
            (candidate) => candidate.candidateStatus === "Joined"
        ).length;

        const rejected = candidates.filter(
            (candidate) => candidate.candidateStatus === "Rejected"
        ).length;

        const hold = candidates.filter(
            (candidate) => candidate.candidateStatus === "Hold"
        ).length;

        const avgCvMatch = 72;

        return {
            total,
            today,
            submitted,
            clientReview,
            interviewR1,
            interviewR2,
            final,
            offerReleased,
            offerAccepted,
            joined,
            rejected,
            hold,
            duplicates: 0,
            avgCvMatch,
            avgSubmit: "—",
        };
    }, [candidates]);

    const statCards = [
        ["total", "Total"],
        ["today", "New today"],
        ["submitted", "Submitted today"],
        ["clientReview", "Client review"],
        ["interviewR1", "Interview R1"],
        ["interviewR2", "Interview R2"],
        ["final", "Final"],
        ["offerReleased", "Offer released"],
        ["offerAccepted", "Offer accepted"],
        ["joined", "Joined"],
        ["rejected", "Rejected"],
        ["hold", "Hold"],
        ["duplicates", "Duplicates"],
        ["avgCvMatch", "Avg CV match"],
        ["avgSubmit", "Avg submit"],
    ];

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedRows(visibleCandidates.map((candidate) => candidate.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows((current) =>
            current.includes(id)
                ? current.filter((rowId) => rowId !== id)
                : [...current, id]
        );
    };

    const handleInlineEdit = (candidate, field) => {
        setEditingCell(`${candidate.id}-${field}`);
        setEditingValue(candidate[field]);
    };

    const saveInlineEdit = (candidateId, field) => {
        setCandidates((current) =>
            current.map((candidate) =>
                candidate.id === candidateId
                    ? {
                        ...candidate,
                        [field]: editingValue,
                    }
                    : candidate
            )
        );

        setEditingCell(null);
        setEditingValue("");
    };

    const handleKeyDown = (e, candidateId, field) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveInlineEdit(candidateId, field);
        }

        if (e.key === "Escape") {
            setEditingCell(null);
            setEditingValue("");
        }
    };

    const updateStatus = (candidateId, newStatus) => {
        setCandidates((current) =>
            current.map((candidate) =>
                candidate.id === candidateId
                    ? {
                        ...candidate,
                        candidateStatus: newStatus,
                    }
                    : candidate
            )
        );
    };

    const bulkUpdateStatus = (status) => {
        if (!status || selectedRows.length === 0) return;

        setCandidates((current) =>
            current.map((candidate) =>
                selectedRows.includes(candidate.id)
                    ? {
                        ...candidate,
                        candidateStatus: status,
                    }
                    : candidate
            )
        );
    };

    const deleteSelected = () => {
        if (selectedRows.length === 0) return;

        setCandidates((current) =>
            current.filter((candidate) => !selectedRows.includes(candidate.id))
        );

        setSelectedRows([]);
    };

    const deleteCandidate = (id) => {
        setCandidates((current) =>
            current.filter((candidate) => candidate.id !== id)
        );

        setSelectedRows((current) => current.filter((rowId) => rowId !== id));
    };

    const toggleColumn = (column) => {
        setColumns((current) => ({
            ...current,
            [column]: !current[column],
        }));
    };

    const exportCsv = () => {
        const headers = Object.keys(COLUMN_LABELS);

        const csvRows = [
            headers.map((header) => COLUMN_LABELS[header]),
            ...filteredCandidates.map((candidate) =>
                headers.map((header) => candidate[header])
            ),
        ];

        const csv = csvRows
            .map((row) =>
                row
                    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "candidate-master-database.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    const handleImportCsv = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target.result;

            const lines = text
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);

            if (lines.length <= 1) return;

            const headers = lines[0]
                .split(",")
                .map((header) => header.trim().replace(/^"|"$/g, ""));

            const imported = lines.slice(1).map((line, index) => {
                const values = line
                    .split(",")
                    .map((value) => value.trim().replace(/^"|"$/g, ""));

                const row = {};

                headers.forEach((header, headerIndex) => {
                    const matchingKey = Object.keys(COLUMN_LABELS).find(
                        (key) => COLUMN_LABELS[key].toLowerCase() === header.toLowerCase()
                    );

                    if (matchingKey) {
                        row[matchingKey] = values[headerIndex] || "";
                    }
                });

                return {
                    id: Date.now() + index,
                    referenceId: row.referenceId || `REF-${Date.now() + index}`,
                    client: row.client || "",
                    recruiter: row.recruiter || "You",
                    roleName: row.roleName || "",
                    candidateName: row.candidateName || "",
                    candidateStatus: row.candidateStatus || "New",
                    email: row.email || "",
                    phone: row.phone || "",
                    location: row.location || "",
                    experience: row.experience || "",
                    skills: row.skills || "",
                };
            });

            setCandidates((current) => [...current, ...imported]);
        };

        reader.readAsText(file);

        event.target.value = "";
    };

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setClientFilter("All");
        setPage(1);
    };

    const renderCell = (candidate, field) => {
        const cellKey = `${candidate.id}-${field}`;
        const isEditing = editingCell === cellKey;

        if (isEditing) {
            return (
                <input
                    autoFocus
                    className="inline-edit-input"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => saveInlineEdit(candidate.id, field)}
                    onKeyDown={(e) => handleKeyDown(e, candidate.id, field)}
                />
            );
        }

        return (
            <button
                type="button"
                className="cell-edit-button"
                onDoubleClick={() => handleInlineEdit(candidate, field)}
                title="Double click to edit"
            >
                {candidate[field] || "—"}
            </button>
        );
    };

    const statusClass = (status) => {
        return `status-badge status-${status
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
    };

    return (
        <div className="candidate-master-page">
            <div className="candidate-master-content">
                {/* PAGE HEADER */}

                <div className="master-header">
                    <div>
                        <h1>Candidate Master Database</h1>
                        <p>
                            Every candidate from CV received to joined — one editable grid
                        </p>
                    </div>

                    <button
                        className="master-add-btn"
                        onClick={onAddCandidate}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add candidate
                    </button>
                </div>

                {/* STATS */}

                <div className="stats-grid">
                    {statCards.map(([key, label]) => (
                        <div className="stat-card" key={key}>
                            <div className="stat-value">{stats[key]}</div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>

                {/* TOOLBAR */}

                <div className="database-toolbar">
                    <div className="search-wrapper">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search name, ref, email, phone, skills, client..."
                        />
                    </div>

                    <div className="toolbar-actions">
                        <div className="toolbar-dropdown-wrapper">
                            <button
                                className={`toolbar-btn ${showFilters ? "toolbar-btn-active" : ""
                                    }`}
                                onClick={() => setShowFilters((current) => !current)}
                            >
                                <i className="bi bi-funnel"></i>
                                Filters
                            </button>

                            {showFilters && (
                                <div className="filter-dropdown">
                                    <div className="filter-title">Filter candidates</div>

                                    <label>
                                        Status
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setPage(1);
                                            }}
                                        >
                                            <option>All</option>

                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status}>{status}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label>
                                        Client
                                        <select
                                            value={clientFilter}
                                            onChange={(e) => {
                                                setClientFilter(e.target.value);
                                                setPage(1);
                                            }}
                                        >
                                            {clients.map((client) => (
                                                <option key={client}>{client}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <button
                                        className="clear-filter-btn"
                                        onClick={resetFilters}
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="toolbar-dropdown-wrapper">
                            <button
                                className={`toolbar-btn ${showColumns ? "toolbar-btn-active" : ""
                                    }`}
                                onClick={() => setShowColumns((current) => !current)}
                            >
                                <i className="bi bi-layout-three-columns"></i>
                                Columns
                            </button>

                            {showColumns && (
                                <div className="columns-dropdown">
                                    <div className="filter-title">Visible columns</div>

                                    {Object.entries(COLUMN_LABELS).map(
                                        ([key, label]) => (
                                            <label
                                                className="column-option"
                                                key={key}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={columns[key]}
                                                    onChange={() => toggleColumn(key)}
                                                />

                                                <span>{label}</span>
                                            </label>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            hidden
                            onChange={handleImportCsv}
                        />

                        <button
                            className="toolbar-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <i className="bi bi-upload"></i>
                            Import CSV
                        </button>

                        <button
                            className="toolbar-btn"
                            onClick={exportCsv}
                        >
                            <i className="bi bi-download"></i>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* BULK BAR */}

                {selectedRows.length > 0 && (
                    <div className="bulk-toolbar">
                        <div>
                            <strong>{selectedRows.length}</strong> candidates selected
                        </div>

                        <div className="bulk-actions">
                            <select
                                defaultValue=""
                                onChange={(e) => bulkUpdateStatus(e.target.value)}
                            >
                                <option value="" disabled>
                                    Bulk status
                                </option>

                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status}>{status}</option>
                                ))}
                            </select>

                            <button
                                className="bulk-delete-btn"
                                onClick={deleteSelected}
                            >
                                <i className="bi bi-trash"></i>
                                Delete
                            </button>

                            <button
                                className="bulk-clear-btn"
                                onClick={() => setSelectedRows([])}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* TABLE */}

                <div className="candidate-table-wrapper">
                    <table className="candidate-table">
                        <thead>
                            <tr>
                                <th className="sticky-select-column">
                                    <input
                                        type="checkbox"
                                        checked={
                                            visibleCandidates.length > 0 &&
                                            visibleCandidates.every((candidate) =>
                                                selectedRows.includes(candidate.id)
                                            )
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                    />
                                </th>

                                <th className="sticky-action-column">...</th>

                                {columns.referenceId && (
                                    <th>REFERENCE ID</th>
                                )}

                                {columns.client && <th>CLIENT</th>}

                                {columns.recruiter && <th>RECRUITER</th>}

                                {columns.roleName && <th>ROLE NAME</th>}

                                {columns.candidateName && (
                                    <th>CANDIDATE NAME</th>
                                )}

                                {columns.candidateStatus && (
                                    <th>CANDIDATE STATUS</th>
                                )}

                                {columns.email && <th>EMAIL</th>}

                                {columns.phone && <th>PHONE</th>}

                                {columns.location && <th>LOCATION</th>}

                                {columns.experience && <th>EXPERIENCE</th>}

                                {columns.skills && <th>SKILLS</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {visibleCandidates.map((candidate) => {
                                const interviewRow =
                                    candidate.candidateStatus === "Interview";

                                return (
                                    <tr
                                        key={candidate.id}
                                        className={
                                            interviewRow
                                                ? "interview-row"
                                                : ""
                                        }
                                    >
                                        <td className="sticky-select-column">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(
                                                    candidate.id
                                                )}
                                                onChange={() =>
                                                    handleSelectRow(candidate.id)
                                                }
                                            />
                                        </td>

                                        <td className="sticky-action-column">
                                            <button
                                                className="row-action-btn"
                                                title="Row actions"
                                            >
                                                ...
                                            </button>
                                        </td>

                                        {columns.referenceId && (
                                            <td>
                                                {renderCell(
                                                    candidate,
                                                    "referenceId"
                                                )}
                                            </td>
                                        )}

                                        {columns.client && (
                                            <td>
                                                {renderCell(candidate, "client")}
                                            </td>
                                        )}

                                        {columns.recruiter && (
                                            <td>
                                                {renderCell(candidate, "recruiter")}
                                            </td>
                                        )}

                                        {columns.roleName && (
                                            <td>
                                                {renderCell(candidate, "roleName")}
                                            </td>
                                        )}

                                        {columns.candidateName && (
                                            <td>
                                                <button
                                                    type="button"
                                                    className="candidate-name-link"
                                                    onDoubleClick={() =>
                                                        handleInlineEdit(
                                                            candidate,
                                                            "candidateName"
                                                        )
                                                    }
                                                >
                                                    {candidate.candidateName}
                                                </button>
                                            </td>
                                        )}

                                        {columns.candidateStatus && (
                                            <td>
                                                <select
                                                    className={statusClass(
                                                        candidate.candidateStatus
                                                    )}
                                                    value={candidate.candidateStatus}
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            candidate.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        )}

                                        {columns.email && (
                                            <td>
                                                {renderCell(candidate, "email")}
                                            </td>
                                        )}

                                        {columns.phone && (
                                            <td>
                                                {renderCell(candidate, "phone")}
                                            </td>
                                        )}

                                        {columns.location && (
                                            <td>
                                                {renderCell(candidate, "location")}
                                            </td>
                                        )}

                                        {columns.experience && (
                                            <td>
                                                {renderCell(
                                                    candidate,
                                                    "experience"
                                                )}
                                            </td>
                                        )}

                                        {columns.skills && (
                                            <td>
                                                {renderCell(candidate, "skills")}
                                            </td>
                                        )}

                                        <td className="hidden-delete-cell">
                                            <button
                                                onClick={() =>
                                                    deleteCandidate(candidate.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {visibleCandidates.length === 0 && (
                        <div className="empty-state">
                            <i className="bi bi-search"></i>
                            <strong>No candidates found</strong>
                            <span>
                                Try changing your search or filters.
                            </span>
                        </div>
                    )}
                </div>

                {/* FOOTER / PAGINATION */}

                <div className="table-footer">
                    <div className="record-count">
                        {filteredCandidates.length} records
                    </div>

                    <div className="pagination-size">
                        <select
                            value={rowsPerPage}
                            disabled
                            onChange={() => { }}
                        >
                            <option>25</option>
                        </select>
                    </div>

                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() =>
                                setPage((current) => Math.max(1, current - 1))
                            }
                        >
                            ‹ Prev
                        </button>

                        <span>
                            Page {page} / {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(totalPages, current + 1)
                                )
                            }
                        >
                            Next ›
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CandidateMasterDatabase;