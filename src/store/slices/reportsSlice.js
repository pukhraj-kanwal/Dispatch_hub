import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Reports Service
const ReportsService = {
    submitIncident: async (incidentType, description, photos, loadId) => {
        console.log(`Submitting incident report: Type - ${incidentType}, Load - ${loadId || 'N/A'}`);
        const delay = 1200 + Math.random() * 600; // Simulate slower submission
        await new Promise(resolve => setTimeout(resolve, delay));

        // Simulate potential error based on type for testing
        if (incidentType === 'fail_test') {
            throw new Error('Simulated server error during incident submission.');
        }
        if (Math.random() < 0.05) {
            throw new Error('Network error: Failed to submit incident report.');
        }

        console.log('Incident report submitted successfully.');
        return { success: true, reportId: `INC-${Date.now()}` };
    },
    submitMaintenance: async (maintenanceType, description, photos) => {
        console.log(`Submitting maintenance log: Type - ${maintenanceType}`);
        const delay = 1100 + Math.random() * 500; // Simulate slower submission
        await new Promise(resolve => setTimeout(resolve, delay));

        // Simulate potential error
        if (maintenanceType === 'fail_test') {
            throw new Error('Simulated server error during maintenance submission.');
        }
        if (Math.random() < 0.05) {
            throw new Error('Network error: Failed to submit maintenance log.');
        }

        console.log('Maintenance log submitted successfully.');
        return { success: true, logId: `MAINT-${Date.now()}` };
    },
};
// --- End Mock Service ---

export const submitIncidentReport = createAsyncThunk(
    'reports/submitIncident',
    async ({ incidentType, description, photos, loadId }, { rejectWithValue }) => {
        try {
            const result = await ReportsService.submitIncident(incidentType, description, photos, loadId);
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to submit incident report');
        }
    }
);

export const submitMaintenanceLog = createAsyncThunk(
    'reports/submitMaintenanceLog',
    async ({ maintenanceType, description, photos }, { rejectWithValue }) => {
        try {
            const result = await ReportsService.submitMaintenance(maintenanceType, description, photos);
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to submit maintenance log');
        }
    }
);

const initialState = {
    incidentSubmission: {
        isLoading: false,
        error: null,
        lastResult: null, // Store result of the last submission (optional)
    },
    maintenanceSubmission: {
        isLoading: false,
        error: null,
        lastResult: null,
    },
    // Add state for fetching reports if needed later
    // incidents: [],
    // maintenanceLogs: [],
    // isLoadingReports: false,
    // reportsError: null,
};

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearIncidentError: (state) => {
            state.incidentSubmission.error = null;
        },
        clearMaintenanceError: (state) => {
            state.maintenanceSubmission.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Submit Incident Report
            .addCase(submitIncidentReport.pending, (state) => {
                state.incidentSubmission.isLoading = true;
                state.incidentSubmission.error = null;
                state.incidentSubmission.lastResult = null;
            })
            .addCase(submitIncidentReport.fulfilled, (state, action) => {
                state.incidentSubmission.isLoading = false;
                state.incidentSubmission.lastResult = action.payload;
            })
            .addCase(submitIncidentReport.rejected, (state, action) => {
                state.incidentSubmission.isLoading = false;
                state.incidentSubmission.error = action.payload;
            })
            // Submit Maintenance Log
            .addCase(submitMaintenanceLog.pending, (state) => {
                state.maintenanceSubmission.isLoading = true;
                state.maintenanceSubmission.error = null;
                state.maintenanceSubmission.lastResult = null;
            })
            .addCase(submitMaintenanceLog.fulfilled, (state, action) => {
                state.maintenanceSubmission.isLoading = false;
                state.maintenanceSubmission.lastResult = action.payload;
            })
            .addCase(submitMaintenanceLog.rejected, (state, action) => {
                state.maintenanceSubmission.isLoading = false;
                state.maintenanceSubmission.error = action.payload;
            });
    },
});

export const { clearIncidentError, clearMaintenanceError } = reportsSlice.actions;

export default reportsSlice.reducer; 