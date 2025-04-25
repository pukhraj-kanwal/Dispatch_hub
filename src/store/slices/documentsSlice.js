import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_DOCUMENTS } from '../../constants/mockData';

// Mock Documents Service
const DocumentsService = {
    fetchDocuments: async () => {
        const delay = 500 + Math.random() * 300;
        await new Promise(resolve => setTimeout(resolve, delay));
        if (Math.random() < 0.05) {
            throw new Error('Network error: Failed to fetch documents.');
        }
        return MOCK_DOCUMENTS;
    },
    // TODO: Add mock service for upload/delete if needed
    // uploadDocument: async (fileData) => { ... },
    // deleteDocument: async (docId) => { ... },
};
// --- End Mock Service ---

export const fetchDocuments = createAsyncThunk(
    'documents/fetchDocuments',
    async (_, { rejectWithValue }) => {
        try {
            const data = await DocumentsService.fetchDocuments();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch documents');
        }
    }
);

const initialState = {
    compliance: [],
    driver: [],
    shipper: [],
    isLoading: false,
    error: null,
};

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        // Add reducer to clear the error state
        clearDocumentsError: (state) => {
            state.error = null;
        },
        // TODO: Add synchronous reducers if needed (e.g., for adding a pending upload)
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.compliance = action.payload.compliance;
                state.driver = action.payload.driver;
                state.shipper = action.payload.shipper;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
             // TODO: Handle states for upload/delete actions
    },
});

// Export the new action
export const { clearDocumentsError } = documentsSlice.actions;

export default documentsSlice.reducer; 