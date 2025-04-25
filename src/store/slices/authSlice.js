import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_LOADS_DATA, MOCK_LOAD_DETAIL_DATA } from '../../constants/mockData'; // Assuming mockData is needed elsewhere, otherwise remove unused imports

// TODO: Import AuthService
// import AuthService from '../../services/AuthService';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

// Mock AuthService for now
const AuthService = {
  login: async (email, password) => {
    console.log(`Attempting login for ${email}`);
    const delay = 800 + Math.random() * 500; // Variable delay 800-1300ms
    await new Promise(resolve => setTimeout(resolve, delay));

    if (email.toLowerCase() === 'fail@drivehub.com') { // Simulate specific user not found
        console.log('Login failed: User not found');
        throw new Error('User with this email does not exist.');
    }

    if (email.toLowerCase() === 'alex.t@drivehub.com' && password === 'password123') {
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockUser = {
        id: 'DH-2847',
        name: 'Alex Thompson',
        email: 'alex.t@drivehub.com',
        driverId: 'DRV-2023-1234',
        licenseNumber: 'LIC-98765432',
        licenseExpiry: '2024-12-31',
        emergencyContact: {
            name: 'Sarah Thompson',
            phone: '+1 (555) 123-4567',
            relationship: 'Spouse'
        },
        profilePictureUri: null
      };
      console.log('Login successful');
      return { token: mockToken, user: mockUser };
    } else {
      console.log('Login failed: Invalid credentials');
      throw new Error('Invalid username or password. Please try again.');
    }
  },
  logout: async () => {
    console.log('Logging out');
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 100));
    console.log('Logout successful');
    return true;
  },
  checkAuthStatus: async () => {
    console.log('Checking auth status');
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (token && userData) {
      console.log('User is authenticated');
      return { isAuthenticated: true, user: JSON.parse(userData), token };
    }
    console.log('User is not authenticated');
    return { isAuthenticated: false, user: null, token: null };
  },
  updateProfile: async (userId, updatedData) => {
    console.log(`Updating profile for ${userId}:`, updatedData);
    const delay = 900 + Math.random() * 400; // Variable delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate phone format error
    const phoneRegex = /^\+?[1]?[-.\s]?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    if (updatedData.emergencyContact?.phone && !phoneRegex.test(updatedData.emergencyContact.phone)) {
        console.log('Profile update failed: Invalid phone number');
        throw new Error('Please enter a valid phone number format (e.g., +1 555-123-4567).'); // More specific message
    }

    // Simulate another potential error (e.g., duplicate email if API enforced it)
    if (updatedData.email?.toLowerCase() === 'existing@drivehub.com') {
        console.log('Profile update failed: Email already exists');
        throw new Error('This email address is already in use by another account.');
    }

    const storedData = await AsyncStorage.getItem(USER_DATA_KEY);
    const currentUser = storedData ? JSON.parse(storedData) : {};
    const updatedUser = { ...currentUser, ...updatedData, id: userId };

    console.log('Profile update successful');
    return updatedUser;
  },
  updateProfilePicture: async (userId, imageUri) => {
    console.log(`Updating profile picture for ${userId} with ${imageUri}`);
    const delay = 1200 + Math.random() * 600; // Simulate slower upload
    await new Promise(resolve => setTimeout(resolve, delay));
    // Simulate occasional upload failure
    if (Math.random() < 0.1) { // 10% chance of failure
         console.log('Profile picture update failed: Upload error');
         throw new Error('Failed to upload profile picture. Please try again.');
    }
    const newImageUrl = imageUri;
    console.log('Profile picture updated');
    return newImageUrl;
  }
};
// --- End Mock AuthService ---

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { token, user } = await AuthService.login(email, password);
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Async thunk to check initial auth status
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { isAuthenticated, user, token } = await AuthService.checkAuthStatus();
      return { isAuthenticated, user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check auth status');
    }
  }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ userId, updatedData }, { rejectWithValue }) => {
        try {
            const user = await AuthService.updateProfile(userId, updatedData);
            // Update stored user data
            await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
            return user;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);

export const updateProfilePicture = createAsyncThunk(
    'auth/updateProfilePicture',
    async ({ userId, imageUri }, { rejectWithValue }) => {
        try {
            const newImageUrl = await AuthService.updateProfilePicture(userId, imageUri);
            // Only return the URL, the profile update thunk handles storing the user
            return { userId, newImageUrl };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update profile picture');
        }
    }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start in loading state to check auth
  isUpdatingProfile: false,
  error: null,
  profileUpdateError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    resetProfileUpdateError: (state) => {
      state.profileUpdateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload; // Error message from rejectWithValue
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true; // Optional: show loading during logout
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Decide if you want to keep the user logged in if logout fails
        // state.isAuthenticated = false;
        // state.user = null;
        // state.token = null;
        state.error = action.payload; // Log error, but maybe don't log out UI
      })
      // Check Auth Status
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Update Profile
       .addCase(updateProfile.pending, (state) => {
          state.isUpdatingProfile = true;
          state.profileUpdateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
          state.isUpdatingProfile = false;
          state.user = action.payload; // Update user state with returned data
      })
      .addCase(updateProfile.rejected, (state, action) => {
          state.isUpdatingProfile = false;
          state.profileUpdateError = action.payload;
      })
       // Update Profile Picture (might just update user state indirectly via updateProfile)
       .addCase(updateProfilePicture.pending, (state) => {
           state.isUpdatingProfile = true; // Use same loading state
           state.profileUpdateError = null;
       })
       .addCase(updateProfilePicture.fulfilled, (state, action) => {
           state.isUpdatingProfile = false;
           if (state.user && state.user.id === action.payload.userId) {
               state.user.profilePictureUri = action.payload.newImageUrl;
               // Also update async storage after successful upload + profile save
               AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(state.user));
           }
       })
       .addCase(updateProfilePicture.rejected, (state, action) => {
           state.isUpdatingProfile = false;
           state.profileUpdateError = action.payload;
       });
  },
});

export const { resetAuthError, resetProfileUpdateError } = authSlice.actions;

export default authSlice.reducer; 