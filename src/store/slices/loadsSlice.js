import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_LOADS, MOCK_LOAD_DETAILS } from '../../services/mockData';

// MOCK API CALLS
const fetchLoadsApi = async () => {
  console.log('[Mock API] Fetching loads...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return MOCK_LOADS;
};

const confirmLoadApi = async (loadId, pin) => {
  console.log(`[Mock API] Confirming load ${loadId} with PIN: ${pin}...`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (pin !== '1234') {
      throw new Error('Invalid PIN');
  }
  console.log(`[Mock API] Load ${loadId} confirmed successfully.`);
  return { loadId, status: 'Confirmed' };
};

const rejectLoadApi = async (loadId) => {
  console.log(`[Mock API] Rejecting load ${loadId}...`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { loadId };
};

const confirmAllUnconfirmedLoadsApi = async (unconfirmedLoadIds, pin) => {
    console.log(`[Mock API] Confirming all loads: ${unconfirmedLoadIds.join(', ')} with PIN: ${pin}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate PIN check failure
    if (pin !== '1234') { // Example correct PIN
        throw new Error('Invalid PIN for bulk confirmation');
    }

    console.log(`[Mock API] Bulk confirmation successful for ${unconfirmedLoadIds.length} loads.`);
    return { confirmedLoadIds: unconfirmedLoadIds };
};

const fetchLoadDetailsApi = async (loadId) => {
    console.log(`[Mock API] Fetching details for load ${loadId}...`);
    await new Promise(resolve => setTimeout(resolve, 800));
    const detail = MOCK_LOAD_DETAILS[loadId];
    if (!detail) {
        throw new Error('Load details not found');
    }
    return detail;
};

const confirmPickupApi = async (loadId) => {
    console.log(`[Mock API] Confirming pickup for load ${loadId}...`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { loadId, status: 'In Progress', currentStage: 'In Transit' };
};

// --- ADD MOCK API FUNCTIONS FOR COMPLETE DELIVERY AND REASSIGNMENT --- 
const completeDeliveryApi = async (loadId, notes, photos) => {
    console.log(`[Mock API] Completing delivery for load: ${loadId}, Notes: ${notes}, Photos: ${photos?.length || 0}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate potential error
    // if (Math.random() > 0.8) {
    //   throw new Error('Failed to submit delivery proof');
    // }
    console.log(`[Mock API] Delivery completed for ${loadId}.`);
    return { loadId }; // Return loadId on success
};

const submitReassignmentApi = async (loadId, reason, details) => {
    console.log(`[Mock API] Submitting reassignment for load ${loadId}. Reason: ${reason}, Details: ${details}...`);
    await new Promise(resolve => setTimeout(resolve, 900));
    // Simulate potential error
    // if (reason === 'Other' && !details) {
    //     throw new Error('Details required for \'Other\' reassignment reason.');
    // }
    console.log(`[Mock API] Reassignment request submitted for ${loadId}.`);
    return { loadId, reason }; // Return details on success
};

// Async Thunks
export const fetchLoads = createAsyncThunk('loads/fetchLoads', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchLoadsApi();
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Could not fetch loads');
  }
});

export const confirmLoad = createAsyncThunk('loads/confirmLoad', async ({ loadId, pin }, { rejectWithValue }) => {
  try {
    const data = await confirmLoadApi(loadId, pin);
    return data; // Contains { loadId, status: 'Confirmed' }
  } catch (error) {
    return rejectWithValue(error.message || 'Could not confirm load');
  }
});

export const rejectLoad = createAsyncThunk('loads/rejectLoad', async (loadId, { rejectWithValue }) => {
  try {
    await rejectLoadApi(loadId);
    return loadId;
  } catch (error) {
    return rejectWithValue(error.message || 'Could not reject load');
  }
});

export const confirmAllUnconfirmedLoads = createAsyncThunk(
    'loads/confirmAllUnconfirmedLoads',
    async ({ pin }, { getState, rejectWithValue }) => {
        const { unconfirmed } = getState().loads;
        const unconfirmedLoadIds = unconfirmed.map(load => load.id);
        if (unconfirmedLoadIds.length === 0) {
            return rejectWithValue('No loads to confirm');
        }
        try {
            // Pass pin to the mock API call
            const data = await confirmAllUnconfirmedLoadsApi(unconfirmedLoadIds, pin);
            return data.confirmedLoadIds;
        } catch (error) {
            return rejectWithValue(error.message || 'Could not confirm all loads');
        }
    }
);

export const fetchLoadDetails = createAsyncThunk(
    'loads/fetchLoadDetails',
    async (loadId, { rejectWithValue }) => {
        try {
            const data = await fetchLoadDetailsApi(loadId);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Could not load details');
        }
    }
);

export const confirmPickup = createAsyncThunk(
    'loads/confirmPickup',
    async (loadId, { rejectWithValue }) => {
        try {
            const data = await confirmPickupApi(loadId);
            return data; // Contains { loadId, status, currentStage }
        } catch (error) {
            return rejectWithValue(error.message || 'Could not confirm pickup');
        }
    }
);

// --- ADD THUNK DEFINITIONS AND EXPORTS --- 
export const completeDelivery = createAsyncThunk(
    'loads/completeDelivery',
    async ({ loadId, notes, photos }, { rejectWithValue }) => {
        try {
            const data = await completeDeliveryApi(loadId, notes, photos);
            return data.loadId; // Return loadId for reducer
        } catch (error) {
             return rejectWithValue(error.message || 'Failed to complete delivery');
        }
    }
);

export const submitReassignmentRequest = createAsyncThunk(
    'loads/submitReassignment',
    async ({ loadId, reason, details }, { rejectWithValue }) => {
        try {
            const result = await submitReassignmentApi(loadId, reason, details);
            return result; // Pass result to reducer { loadId, reason }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to submit reassignment request');
        }
    }
);

// Slice Definition
const initialState = {
    confirmed: [],
    unconfirmed: [],
    currentLoadDetails: null,
    isLoading: false,        // For fetching the main lists
    isLoadingDetails: false, // For fetching individual load details
    isUpdating: false,       // For confirm/reject/confirmAll actions
    isRequestingReassignment: false,
    error: null,
    detailError: null,       // Separate error for detail screen
    reassignmentError: null,
};

const loadsSlice = createSlice({
    name: 'loads',
    initialState,
    reducers: {
        clearLoadDetails: (state) => {
            state.currentLoadDetails = null;
            state.detailError = null;
        },
        clearLoadsError: (state) => {
            state.error = null;
        },
        clearReassignmentError: (state) => {
            state.reassignmentError = null;
        },
        clearLoadDetailError: (state) => {
             state.detailError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Loads
            .addCase(fetchLoads.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLoads.fulfilled, (state, action) => {
                state.isLoading = false;
                state.confirmed = action.payload.filter(load => load.status !== 'Unconfirmed' && load.status !== 'Rejected');
                state.unconfirmed = action.payload.filter(load => load.status === 'Unconfirmed');
            })
            .addCase(fetchLoads.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Confirm Single Load
            .addCase(confirmLoad.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(confirmLoad.fulfilled, (state, action) => {
                state.isUpdating = false;
                const confirmedLoadId = action.payload.loadId;
                const confirmedLoad = state.unconfirmed.find(load => load.id === confirmedLoadId);
                if (confirmedLoad) {
                    confirmedLoad.status = 'Confirmed';
                    state.confirmed.push(confirmedLoad);
                    state.unconfirmed = state.unconfirmed.filter(load => load.id !== confirmedLoadId);
                }
            })
            .addCase(confirmLoad.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })
             // Reject Single Load
            .addCase(rejectLoad.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(rejectLoad.fulfilled, (state, action) => {
                state.isUpdating = false;
                const rejectedLoadId = action.payload;
                state.unconfirmed = state.unconfirmed.filter(load => load.id !== rejectedLoadId);
            })
            .addCase(rejectLoad.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })
             // Confirm All Unconfirmed Loads
            .addCase(confirmAllUnconfirmedLoads.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(confirmAllUnconfirmedLoads.fulfilled, (state, action) => {
                state.isUpdating = false;
                const confirmedLoadIds = action.payload;
                const newlyConfirmed = state.unconfirmed.filter(load => confirmedLoadIds.includes(load.id));
                newlyConfirmed.forEach(load => load.status = 'Confirmed');
                state.confirmed.push(...newlyConfirmed);
                state.unconfirmed = state.unconfirmed.filter(load => !confirmedLoadIds.includes(load.id));
            })
            .addCase(confirmAllUnconfirmedLoads.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload; // This will now catch the Invalid PIN error
            })
            // Fetch Load Details
            .addCase(fetchLoadDetails.pending, (state) => {
                state.isLoadingDetails = true;
                state.detailError = null;
            })
            .addCase(fetchLoadDetails.fulfilled, (state, action) => {
                state.isLoadingDetails = false;
                state.currentLoadDetails = action.payload;
            })
            .addCase(fetchLoadDetails.rejected, (state, action) => {
                state.isLoadingDetails = false;
                state.detailError = action.payload;
                state.currentLoadDetails = null;
            })
             // Confirm Pickup
            .addCase(confirmPickup.pending, (state) => {
                state.isUpdating = true;
                state.detailError = null;
            })
            .addCase(confirmPickup.fulfilled, (state, action) => {
                state.isUpdating = false;
                if (state.currentLoadDetails && state.currentLoadDetails.id === action.payload.loadId) {
                    state.currentLoadDetails.status = action.payload.status;
                    state.currentLoadDetails.currentStage = action.payload.currentStage;
                }
                const loadInList = state.confirmed.find(load => load.id === action.payload.loadId);
                if (loadInList) {
                    loadInList.status = action.payload.status;
                    loadInList.currentStage = action.payload.currentStage;
                }
            })
            .addCase(confirmPickup.rejected, (state, action) => {
                state.isUpdating = false;
                state.detailError = action.payload;
            })
            // Complete Delivery
            .addCase(completeDelivery.pending, (state) => {
                state.isUpdating = true;
                state.detailError = null;
            })
            .addCase(completeDelivery.fulfilled, (state, action) => {
                state.isUpdating = false;
                const loadId = action.payload;
                const confirmedIdx = state.confirmed.findIndex(l => l.id === loadId);
                if (confirmedIdx !== -1) {
                    state.confirmed[confirmedIdx].status = 'Delivered';
                }
                if (state.currentLoadDetails && state.currentLoadDetails.id === loadId) {
                    state.currentLoadDetails = null;
                }
            })
            .addCase(completeDelivery.rejected, (state, action) => {
                state.isUpdating = false;
                state.detailError = action.payload;
            })
             // Submit Reassignment Request
            .addCase(submitReassignmentRequest.pending, (state) => {
                state.isRequestingReassignment = true;
                state.reassignmentError = null;
            })
            .addCase(submitReassignmentRequest.fulfilled, (state, action) => {
                state.isRequestingReassignment = false;
                const { loadId } = action.payload;
                console.log(`Reassignment request successful for ${loadId}`);
                if (state.currentLoadDetails && state.currentLoadDetails.id === loadId) {
                    state.currentLoadDetails = null;
                }
            })
            .addCase(submitReassignmentRequest.rejected, (state, action) => {
                state.isRequestingReassignment = false;
                state.reassignmentError = action.payload;
            });
    },
});

export const { clearLoadDetails, clearLoadsError, clearReassignmentError, clearLoadDetailError } = loadsSlice.actions;

export default loadsSlice.reducer; 