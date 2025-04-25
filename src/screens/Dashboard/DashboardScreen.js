import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, useTheme, Divider, Portal, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import MetricCard from '../../Components/MetricCard';
import ActiveLoadCard from '../../Components/ActiveLoadCard';
import TaskListItem from '../../Components/TaskListItem';
import QuickActionButton from '../../Components/QuickActionButton';
import { fetchDashboard, clearDashboardError } from '../../store/slices/dashboardSlice';
import { NAV_ROUTES } from '../../constants/navigationRoutes';

function DashboardScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { metrics, activeLoad, tasks, isLoading, error } = useSelector((state) => state.dashboard);
  const user = useSelector((state) => state.auth.user); // Get user name for greeting

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const onRefresh = useCallback(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const handleNavigate = (route) => {
    console.log(`Attempting to navigate to: ${route}`);
    switch (route) {
        case NAV_ROUTES.MY_LOADS:
            navigation.navigate(NAV_ROUTES.LOADS_STACK);
            break;
        case NAV_ROUTES.DOCUMENTS:
        case NAV_ROUTES.MAINTENANCE_LOG:
        case NAV_ROUTES.NOTIFICATIONS:
            navigation.navigate(NAV_ROUTES.MORE_STACK, {
                 screen: route,
                 params: { origin: NAV_ROUTES.DASHBOARD }
            });
            break;
        case NAV_ROUTES.TRIP_HISTORY: // Example placeholder
            alert('Trip History feature coming soon!');
            break;
        default:
            console.warn(`Navigation route not handled: ${route}`);
            alert('This feature is not yet available.');
    }
  };

  const handleTaskPress = (taskId) => {
     console.log(`Navigate to task details for: ${taskId}`);
     navigation.navigate(NAV_ROUTES.MORE_STACK, {
         screen: NAV_ROUTES.TASK_DETAILS,
         params: { taskId, origin: NAV_ROUTES.DASHBOARD }
     });
  }

  const handleLoadPress = () => {
      if (!activeLoad) return; // Add guard clause
      console.log(`Navigate to load details for: ${activeLoad.id}`);
      navigation.navigate(NAV_ROUTES.LOADS_STACK, {
        screen: NAV_ROUTES.LOAD_DETAILS,
        params: { loadId: activeLoad.id, origin: NAV_ROUTES.DASHBOARD }
      });
      // navigation.navigate(NAV_ROUTES.LOADS_STACK); // Temp: go to loads list - REMOVED
  }

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    dispatch(clearDashboardError());
  };

  const headerActions = [
    { icon: 'bell-outline', onPress: () => handleNavigate(NAV_ROUTES.NOTIFICATIONS) }, // TODO: Implement notifications screen
  ];

  return (
    <Portal.Host> {/* Needed for Snackbar */} 
    <ScreenWrapper style={styles.noPadding} contentContainerStyle={styles.content}>
        <AppHeader
            title={`Welcome, ${user?.name ? user.name.split(' ')[0] : 'Driver'}`}
            subtitle="Your dashboard overview"
            actions={headerActions}
         />
         <ScrollView
            style={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
         >
            {isLoading && !metrics && (
                <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
            )}

            {metrics && (
                <View style={styles.metricsContainer}>
                    <MetricCard title="Today's Loads" value={metrics.todaysLoads} />
                    <MetricCard title="Miles Today" value={metrics.milesToday} />
                    <MetricCard title="Tasks Done" value={`${metrics.tasksDone.completed}/${metrics.tasksDone.total}`} />
                </View>
            )}

             {/* Use a key to force re-render if load changes to/from null */}
            <View key={activeLoad ? activeLoad.id : 'no-load'} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Active Load</Text>
                <ActiveLoadCard load={activeLoad} onPress={activeLoad ? handleLoadPress : undefined} />
            </View>

            <View style={styles.quickActionsContainer}>
                <QuickActionButton title="New Loads" icon="truck-plus-outline" onPress={() => handleNavigate(NAV_ROUTES.MY_LOADS)} />
                <QuickActionButton title="Trip History" icon="history" onPress={() => handleNavigate(NAV_ROUTES.TRIP_HISTORY)} />
                <QuickActionButton title="Documents" icon="file-document-outline" onPress={() => handleNavigate(NAV_ROUTES.DOCUMENTS)} />
                <QuickActionButton title="Maintenance" icon="wrench-outline" onPress={() => handleNavigate(NAV_ROUTES.MAINTENANCE_LOG)} />
            </View>

            <Divider style={styles.divider} />

            {tasks && tasks.length > 0 && (
                 <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Tasks</Text>
                    {tasks.map((task) => (
                        <TaskListItem key={task.id} task={task} onPress={() => handleTaskPress(task.id)} />
                    ))}
                </View>
            )}

         </ScrollView>
          <Snackbar
                visible={snackbarVisible}
                onDismiss={handleSnackbarDismiss}
                duration={Snackbar.DURATION_LONG}
                action={{
                    label: 'Retry',
                    onPress: onRefresh,
                }}
            >
                {error || 'An error occurred loading dashboard data.'}
            </Snackbar>
    </ScreenWrapper>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  noPadding: {
      paddingTop: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  scrollView: {
      flex: 1,
      paddingHorizontal: 16, // Add padding for scroll content
  },
  loadingIndicator: {
      marginTop: 50,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 16, // Add margin top
  },
  sectionContainer: {
      marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
  },
  divider: {
      marginVertical: 16,
  }
});

export default DashboardScreen; 