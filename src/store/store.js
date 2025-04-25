import { configureStore } from '@reduxjs/toolkit';

// Import reducers from slices
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import loadsReducer from './slices/loadsSlice';
import tasksReducer from './slices/tasksSlice';
import documentsReducer from './slices/documentsSlice';
import reportsReducer from './slices/reportsSlice';
import notificationsReducer from './slices/notificationsSlice';
// ... other reducers

const store = configureStore({
  reducer: {
    // Combine reducers here
    auth: authReducer,
    dashboard: dashboardReducer,
    loads: loadsReducer,
    tasks: tasksReducer,
    documents: documentsReducer,
    reports: reportsReducer,
    notifications: notificationsReducer,
    // ... other slices
  },
  // Middleware can be added here if needed (e.g., for logging)
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Types are typically used in TypeScript projects.
// For JavaScript, you rely on runtime checks or JSDoc for type hints.
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store; 