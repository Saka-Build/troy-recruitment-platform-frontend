import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import jobApi from "../../services/jobApi";


export const createJob = createAsyncThunk(
  "jobs/createJob",

  async (jobData, { rejectWithValue }) => {
    try {
      const response =
        await jobApi.createJob(jobData);
      return response;
    }
    catch (error) {
      console.error("Create Job API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to create job. Please try again.";
      return rejectWithValue(
        message
      );
    }
  }
);

export const getAllJobs = createAsyncThunk(
  "jobs/getAllJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobApi.getAllJobs(params);
      return response;
    } catch (error) {
      console.error("Get All Jobs API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load jobs.";
      return rejectWithValue(message);
    }
  }
);

// Update getOpenJobs to accept parameters
export const getOpenJobs = createAsyncThunk(
  "jobs/getOpenJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobApi.getOpenJobs(params);
      return response;
    } catch (error) {
      console.error("Get Open Jobs API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load open jobs.";
      return rejectWithValue(message);
    }
  }
);

export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await jobApi.getJobById(id);
      return response;
    }
    catch (error) {
      console.error("Get Job By ID API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load job.";
      return rejectWithValue(message);
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, jobData, }, { rejectWithValue }) => {
    try {
      const response =
        await jobApi.updateJob(id, jobData);
      return response;
    }
    catch (error) {
      console.error("Update Job API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to update job. Please try again.";

      return rejectWithValue(message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await jobApi.deleteJob(id);
      return id;
    }
    catch (error) {
      console.error(
        "Delete Job API Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to delete job.";

      return rejectWithValue(
        message
      );
    }
  }
);


/* =========================================================
   GET JOB ACTIVITIES
========================================================= */

export const getJobActivities = createAsyncThunk(
  "jobs/getJobActivities",

  async (
    jobId,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await jobApi.getJobActivities(
          jobId
        );

      return response;

    } catch (error) {
      console.error("Get Job Activities API Error:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load job activities.";

      return rejectWithValue(message);
    }
  }
);

/* =========================================================
   GET JOB FILTERS / HEADER COUNTS
========================================================= */

export const getJobFilters = createAsyncThunk(
  "jobs/getJobFilters",

  async (_, { rejectWithValue }) => {
    try {
      const response = await jobApi.getJobFilters();

      return response;

    } catch (error) {
      console.error(
        "Get Job Filters API Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load job filters.";

      return rejectWithValue(message);
    }
  }
);

/* =========================================================
   EXPORT JOBS
========================================================= */

export const exportJobs = createAsyncThunk(
    "jobs/exportJobs",

    async (params = {}, { rejectWithValue }) => {
        try {
            const response =
                await jobApi.exportJobs(params);

            return response;

        } catch (error) {
            console.error(
                "Export Jobs API Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to export jobs.";

            return rejectWithValue(message);
        }
    }
);


const initialState = {
  jobs: [],
  openJobs: [],
  selectedJob: null,
  isCreating: false,
  createError: null,
  activities: [],
  isActivitiesLoading: false,
  activitiesError: null,
  isLoading: false,
  isFetching: false,
  isOpenJobsLoading: false,
  openJobsError: null,
  isUpdating: false,
  isDeleting: false,
  error: null,
  success: false,
  jobFilters: {
    totalJobs: 0,
    totalOpenJobs: 0,
    totalClosedJobs: 0,
    totalOnHoldJobs: 0,

    statuses: [],
    priorities: [],
  },

  isJobFiltersLoading: false,
  jobFiltersError: null,

  /* =========================================================
     JOB EXPORT
  ========================================================= */

  isExporting: false,
  exportError: null,
  isEmployeeExporting: false,
  employeeExportError: null,
  // Add pagination state
  pagination: {
    currentPage: 0,
    pageSize: 20,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: false,
  },
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearJobSuccess: (state) => {
      state.success = false;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    // Add reset pagination reducer
    resetPagination: (state) => {
      state.pagination = {
        currentPage: 0,
        pageSize: 20,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: false,
      };
    },
  },


  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.error = null;
      }
      )

      .addCase(createJob.fulfilled, (state, action) => {
        state.isCreating = false;
        state.createError = null;
        state.error = null;
        state.success = true;
        if (action.payload) {
          state.jobs.unshift(
            action.payload
          );
        }
      }
      )

      .addCase(createJob.rejected, (state, action) => {
        state.isCreating = false;
        state.success = false;
        state.createError = action.payload || "Unable to create job.";
      }
      )

      .addCase(getAllJobs.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.isFetching = false;
        state.error = null;

        // Store the content array
        if (Array.isArray(action.payload?.content)) {
          state.jobs = action.payload.content;
        } else if (Array.isArray(action.payload)) {
          state.jobs = action.payload;
        } else if (Array.isArray(action.payload?.data)) {
          state.jobs = action.payload.data;
        } else if (Array.isArray(action.payload?.jobs)) {
          state.jobs = action.payload.jobs;
        } else {
          state.jobs = [];
        }

        // Store pagination metadata
        if (action.payload) {
          state.pagination = {
            currentPage: action.payload.number || 0,
            pageSize: action.payload.size || 20,
            totalPages: action.payload.totalPages || 0,
            totalElements: action.payload.totalElements || 0,
            first: action.payload.first !== undefined ? action.payload.first : true,
            last: action.payload.last !== undefined ? action.payload.last : false,
          };
        }
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload || "Unable to load jobs.";
      })

      // Update getOpenJobs reducers similarly
      .addCase(getOpenJobs.pending, (state) => {
        state.isOpenJobsLoading = true;
        state.openJobsError = null;
      })
      .addCase(getOpenJobs.fulfilled, (state, action) => {
        state.isOpenJobsLoading = false;
        state.openJobsError = null;

        if (Array.isArray(action.payload?.content)) {
          state.openJobs = action.payload.content;
          // Store pagination for open jobs if needed
          if (action.payload) {
            state.pagination = {
              currentPage: action.payload.number || 0,
              pageSize: action.payload.size || 20,
              totalPages: action.payload.totalPages || 0,
              totalElements: action.payload.totalElements || 0,
              first: action.payload.first !== undefined ? action.payload.first : true,
              last: action.payload.last !== undefined ? action.payload.last : false,
            };
          }
        } else if (Array.isArray(action.payload)) {
          state.openJobs = action.payload;
        } else if (Array.isArray(action.payload?.data)) {
          state.openJobs = action.payload.data;
        } else if (Array.isArray(action.payload?.jobs)) {
          state.openJobs = action.payload.jobs;
        } else {
          state.openJobs = [];
        }
      })
      .addCase(getOpenJobs.rejected, (state, action) => {
        state.isOpenJobsLoading = false;
        state.openJobsError = action.payload || "Unable to load open jobs.";
        state.openJobs = [];
      })


      .addCase(
        getJobById.pending, (state) => {
          state.isFetching = true;
          state.error = null;
        }
      )

      .addCase(getJobById.fulfilled, (state, action) => {
        state.isFetching = false;
        state.error = null;
        state.selectedJob = action.payload;
      }
      )

      .addCase(getJobById.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload || "Unable to load job.";
      }
      )

      .addCase(updateJob.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.success = false;
      }
      )

      .addCase(updateJob.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.success = true;
        state.error = null;
        const updatedJob = action.payload;

        if (updatedJob?.id) {
          const index = state.jobs.findIndex((job) => job.id === updatedJob.id);

          if (index !== -1) {
            state.jobs[index] = updatedJob;
          }

          if (state.selectedJob?.id === updatedJob.id) {
            state.selectedJob = updatedJob;
          }
        }
      }
      )

      .addCase(updateJob.rejected, (state, action) => {
        state.isUpdating = false;
        state.success = false;
        state.error = action.payload || "Unable to update job.";
      }
      )

      .addCase(deleteJob.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      }
      )

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.error = null;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);

        if (state.selectedJob?.id === action.payload) {
          state.selectedJob = null;
        }
      }
      )

      .addCase(deleteJob.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload || "Unable to delete job.";
      }
      )

      .addCase(
        getJobActivities.pending,
        (state) => {
          state.isActivitiesLoading = true;
          state.activitiesError = null;
          state.activities = [];
        }
      )

      .addCase(getJobActivities.fulfilled, (state, action) => {
        state.isActivitiesLoading = false;
        state.activitiesError = null;
        state.activities = Array.isArray(action.payload) ? action.payload : [];
      }
      )

      .addCase(getJobActivities.rejected, (state, action) => {
        state.isActivitiesLoading = false;
        state.activitiesError = action.payload || "Unable to load job activities.";
        state.activities = [];
      }
      )
      /* =========================================================
   GET JOB FILTERS / HEADER COUNTS
========================================================= */

      .addCase(
        getJobFilters.pending,
        (state) => {
          state.isJobFiltersLoading = true;
          state.jobFiltersError = null;
        }
      )

      .addCase(
        getJobFilters.fulfilled,
        (state, action) => {
          state.isJobFiltersLoading = false;
          state.jobFiltersError = null;

          const data = action.payload || {};

          state.jobFilters = {
            totalJobs: data.totalJobs || 0,

            totalOpenJobs:
              data.totalOpenJobs || 0,

            totalClosedJobs:
              data.totalClosedJobs || 0,

            totalOnHoldJobs:
              data.totalOnHoldJobs || 0,

            /*
             * Backend returns:
             * Open
             * Closed
             * On_hold
             * Filled
             * Cancelled
             *
             * But frontend should only show:
             * Open
             * Closed
             * On hold
             */

            statuses: Array.isArray(data.statuses)
              ? data.statuses.filter(
                (status) =>
                  [
                    "Open",
                    "Closed",
                    "On_hold",
                  ].includes(status)
              )
              : [],

            /*
             * Backend returns:
             * Low
             * Medium
             * High
             * Urgent
             *
             * But frontend should only show:
             * High
             * Medium
             * Low
             */

            priorities: Array.isArray(data.priorities)
              ? data.priorities.filter(
                (priority) =>
                  [
                    "High",
                    "Medium",
                    "Low",
                  ].includes(priority)
              )
              : [],
          };
        }
      )

      .addCase(
        getJobFilters.rejected,
        (state, action) => {
          state.isJobFiltersLoading = false;

          state.jobFiltersError =
            action.payload ||
            "Unable to load job filters.";
        }
      )
      /* =========================================================
         EXPORT JOBS
      ========================================================= */

      .addCase(
        exportJobs.pending,
        (state) => {
          state.isExporting = true;
          state.exportError = null;
        }
      )

      .addCase(
        exportJobs.fulfilled,
        (state) => {
          state.isExporting = false;
          state.exportError = null;
        }
      )

      .addCase(
        exportJobs.rejected,
        (state, action) => {
          state.isExporting = false;

          state.exportError =
            action.payload ||
            "Unable to export jobs.";
        }
      );

  },
});


export const { clearJobError, clearJobSuccess, clearSelectedJob, resetPagination } = jobSlice.actions;
export default jobSlice.reducer;