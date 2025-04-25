import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { checkAuth, logoutUser } from '../store/slices/authSlice';

// TODO: Define RootState and AppDispatch types in store.js if using TypeScript
// import { RootState, AppDispatch } from '../store/store';

function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // --- TEMPORARY FOR DEBUGGING --- 
    // Dispatch logout first to clear stored credentials for this session
    // REMOVE THIS LINE AFTER DEBUGGING LOGIN
    dispatch(logoutUser()).then(() => {
        // Then check auth status (which should now find no stored credentials)
        dispatch(checkAuth());
    });
    // --------------------------------
  }, [dispatch]);

  if (isLoading) {
    // Show a loading spinner while checking auth status or logging in/out
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <MainTabs /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Use theme background color if available, otherwise fallback
    // backgroundColor: theme?.colors?.background || '#F2F2F7',
  },
});

export default AppNavigator; 