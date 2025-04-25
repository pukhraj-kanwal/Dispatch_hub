import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_COMPLIANCE_TASKS } from '../../constants/mockData';

// Mock Tasks Service
const TasksService = {
    fetchComplianceTasks: async () => {
        const delay = 600 + Math.random() * 300;
        await new Promise(resolve => setTimeout(resolve, delay));
        if (Math.random() < 0.05) {
            throw new Error('Network error: Failed to fetch compliance tasks.');
        }
        return MOCK_COMPLIANCE_TASKS;
    },
    completeTask: async (taskId) => {
        const delay = 400 + Math.random() * 200;
        await new Promise(resolve => setTimeout(resolve, delay));
        if (Math.random() < 0.05) {
            throw new Error('Network error: Failed to complete task.');
        }
        console.log(`Marked task as complete: ${taskId}`);
        return taskId;
    }
};
// --- End Mock Service ---

export const fetchComplianceTasks = createAsyncThunk(
    'tasks/fetchComplianceTasks',
    async (_, { rejectWithValue }) => {
        try {
            const data = await TasksService.fetchComplianceTasks();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch compliance tasks');
        }
    }
);

export const completeComplianceTask = createAsyncThunk(
    'tasks/completeComplianceTask',
    async (taskId, { rejectWithValue }) => {
        try {
            await TasksService.completeTask(taskId);
            return taskId;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to complete task');
        }
    }
);

const initialState = {
    complianceTasks: [],
    // Add state for other task types if needed (e.g., deliveryTasks)
    isLoading: false,
    isUpdating: false,
    error: null,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Add reducer to clear the error state
        clearTasksError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Compliance Tasks
            .addCase(fetchComplianceTasks.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchComplianceTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.complianceTasks = action.payload;
            })
            .addCase(fetchComplianceTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Complete Compliance Task
            .addCase(completeComplianceTask.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(completeComplianceTask.fulfilled, (state, action) => {
                state.isUpdating = false;
                const taskId = action.payload;
                const taskIndex = state.complianceTasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    state.complianceTasks[taskIndex].status = 'Completed';
                }
            })
            .addCase(completeComplianceTask.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload; // Show error via Snackbar
            });
    },
});

// Export the new action
export const { clearTasksError } = tasksSlice.actions;

export default tasksSlice.reducer; 