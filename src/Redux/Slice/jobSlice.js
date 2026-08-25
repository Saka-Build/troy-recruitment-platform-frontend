import {createAsyncThunk,createSlice,} from "@reduxjs/toolkit";
import jobApi from "../../services/jobApi";


export const createJob = createAsyncThunk(
  "jobs/createJob",

  async (jobData,{ rejectWithValue }) => {
    try {
      const response =
        await jobApi.createJob(jobData);
      return response;
    } 
    catch (error) {
      console.error("Create Job API Error:",error);
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

  async (_,{ rejectWithValue }) => {
    try {
      const response =await jobApi.getAllJobs();
      return response;
    } 
    catch (error) {
      console.error("Get All Jobs API Error:",error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load jobs.";

      return rejectWithValue(message);    }
  }
);

export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (id,{ rejectWithValue }) => {
    try {
      const response =await jobApi.getJobById(id);
      return response;
    } 
    catch (error) {
      console.error("Get Job By ID API Error:",error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load job.";
      return rejectWithValue(message );
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({id,jobData,},{ rejectWithValue }) => {
    try {
      const response =
        await jobApi.updateJob(id,jobData);
      return response;
    } 
    catch (error) {
      console.error("Update Job API Error:",error);
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
  async (id,{ rejectWithValue }) => {
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
      console.error("Get Job Activities API Error:",error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to load job activities.";

      return rejectWithValue( message);
    }
  }
);


const initialState = {
  jobs: [],
  selectedJob: null,
  isCreating: false,
  createError: null,
  activities: [],
  isActivitiesLoading: false,
  activitiesError: null,
   isLoading: false,
  isFetching: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  success: false,
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
  },

  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending,(state) => {
          state.isCreating =true;
          state.createError =null;
          state.error =null;
        }
      )

      .addCase(createJob.fulfilled,(state,action) => {
          state.isCreating =false;
          state.createError =null;
          state.error =null;
          state.success =true;
          if (action.payload) {
            state.jobs.unshift(
              action.payload
            );
          }
        }
      )

      .addCase(createJob.rejected,(state, action) => {
          state.isCreating = false;
          state.success = false;
          state.createError = action.payload ||"Unable to create job.";
        }
      )

      .addCase(getAllJobs.pending,(state) => {
          state.isFetching =true;
          state.error =null;
        }
      )

      .addCase(getAllJobs.fulfilled,(state, action) => {
          state.isFetching = false;
          state.error = null;

          if (Array.isArray(action.payload?.content)) {
            state.jobs = action.payload.content;
          } else if (
            Array.isArray(action.payload)
          ) {
            state.jobs = action.payload;
          } else if (
            Array.isArray(action.payload?.data)
          ) {
            state.jobs = action.payload.data;
          } else if (
            Array.isArray( action.payload?.jobs )
          ) {
            state.jobs = action.payload.jobs;
          } else {
            state.jobs = [];
          }
        }
      )

      .addCase(getAllJobs.rejected,(  state,  action) => {
          state.isFetching =false;
          state.error =action.payload ||"Unable to load jobs.";
        }
      )

      .addCase(
        getJobById.pending,(state) => {
          state.isFetching =true;
          state.error =null;
        }
      )

      .addCase(getJobById.fulfilled,(  state,  action) => {
          state.isFetching =false;
          state.error =null;
          state.selectedJob =action.payload;
        }
      )

      .addCase(getJobById.rejected,(  state,  action) => {
          state.isFetching =false;
          state.error =action.payload ||"Unable to load job.";
        }
      )

      .addCase(updateJob.pending,(state) => {
          state.isUpdating =true;
          state.error =null;
          state.success =false;
        }
      )

      .addCase(updateJob.fulfilled,(  state,  action) => {
          state.isUpdating =false;
          state.success =true;
          state.error =null;
          const updatedJob =action.payload;

          if (updatedJob?.id) {
            const index = state.jobs.findIndex((job) =>  job.id ===  updatedJob.id);

            if (index !== -1) {
              state.jobs[index] =  updatedJob;
            }

            if (state.selectedJob?.id ===updatedJob.id) {
              state.selectedJob =  updatedJob;
            }
          }
        }
      )

      .addCase(updateJob.rejected,(  state,  action) => {
          state.isUpdating =false;
          state.success =false;
          state.error =action.payload ||"Unable to update job.";
        }
      )

      .addCase(deleteJob.pending,(state) => {
          state.isDeleting = true;
          state.error = null;
        }
      )

      .addCase(deleteJob.fulfilled,(  state,  action) => {
          state.isDeleting = false;
          state.error = null;
          state.jobs = state.jobs.filter(   (job) =>     job.id !==     action.payload );

          if (state.selectedJob?.id === action.payload) {
            state.selectedJob =null;
          }
        }
      )

      .addCase(deleteJob.rejected,(  state,  action) => {
          state.isDeleting =false;
          state.error =action.payload ||"Unable to delete job.";
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

      .addCase(getJobActivities.fulfilled,(state,action) => {
          state.isActivitiesLoading = false;
          state.activitiesError = null;
          state.activities =Array.isArray(action.payload)  ? action.payload  : [];
        }
      )

      .addCase(getJobActivities.rejected,(state,action) => {
          state.isActivitiesLoading = false;
          state.activitiesError =action.payload ||"Unable to load job activities.";
          state.activities = [];
        }
      );

  },
});


export const {
  clearJobError,
  clearJobSuccess,
  clearSelectedJob,
} = jobSlice.actions;


export default jobSlice.reducer;