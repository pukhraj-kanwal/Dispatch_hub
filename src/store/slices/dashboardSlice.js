import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DASHBOARD_DATA } from '../../constants/mockData';

// Mock Dashboard Service
const DashboardService = {
    fetchDashboardData: async () => {
        const delay = 700 + Math.random() * 400; // Variable delay
        await new Promise(resolve => setTimeout(resolve, delay));
        if (Math.random() < 0.05) { // Simulate occasional network error
             throw new Error('Network error: Failed to fetch dashboard data.');
        }
        return MOCK_DASHBOARD_DATA;
    }
};
// --- End Mock Service ---

export const fetchDashboard = createAsyncThunk(
    'dashboard/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const data = await DashboardService.fetchDashboardData();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch dashboard data');
        }
    }
);

const initialState = {
    metrics: null,
    activeLoad: null,
    tasks: [],
    isLoading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // Add reducer to clear the error state
        clearDashboardError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.metrics = action.payload.metrics;
                state.activeLoad = action.payload.activeLoad;
                state.tasks = action.payload.tasks;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                 // Optionally clear data on error or keep stale data
                // state.metrics = null;
                // state.activeLoad = null;
                // state.tasks = [];
            });
    },
});

// Export the new action
export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer; 