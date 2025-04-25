import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_NOTIFICATIONS } from '../../services/mockData';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// Mock API Call
const fetchNotificationsApi = async () => {
    console.log('[Mock API] Fetching notifications...');
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
    // Sort by timestamp descending before returning
    return MOCK_NOTIFICATIONS.slice().sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());
};

// Thunk
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchNotificationsApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Could not fetch notifications');
        }
    }
);

// Slice
const initialState = {
    items: [],
    isLoading: false,
    error: null,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotificationsError: (state) => {
            state.error = null;
        },
        markNotificationAsRead: (state, action) => {
            const notificationId = action.payload;
            const notification = state.items.find(item => item.id === notificationId);
            if (notification) {
                notification.readStatus = true;
            }
        },
        // TODO: Add actions for delete, mark all as read, etc.
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearNotificationsError, markNotificationAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer; 