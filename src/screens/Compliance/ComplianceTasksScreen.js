import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions } from 'react-native';
import { Text, ActivityIndicator, useTheme, Portal, Snackbar, Button, Dialog, Paragraph } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import ComplianceTaskCard from '../../Components/ComplianceTaskCard';
import { fetchComplianceTasks, completeComplianceTask, clearTasksError } from '../../store/slices/tasksSlice';
import { NAV_ROUTES } from '../../constants/navigationRoutes';

const renderTabBar = props => {
    const theme = useTheme();
    return (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.surface }}
            labelStyle={styles.tabLabel}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.disabled}
            scrollEnabled={true} // Allow tabs to scroll if many
            tabStyle={styles.tabStyle} // Adjust tab width
        />
    );
};

const TaskList = ({ tasksData, isLoading, onRefresh, onComplete, onDetails, listKey }) => {

     const renderItem = ({ item }) => (
        <ComplianceTaskCard
            task={item}
            onComplete={onComplete}
            onDetails={onDetails}
        />
    );

    const keyExtractor = (item) => `${listKey}-${item.id}`;

     if (isLoading && tasksData.length === 0) {
        return <ActivityIndicator animating={true} size="large" style={styles.listLoadingIndicator} />;
    }

    if (!isLoading && tasksData.length === 0) {
         return (
             <View style={styles.emptyContainer}>
                 <Text style={styles.emptyText}>No tasks found in this category.</Text>
             </View>
         );
    }

    return (
        <FlatList
            data={tasksData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContentContainer}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
        />
    );
}

function ComplianceTasksScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { complianceTasks, isLoading, isUpdating, error } = useSelector((state) => state.tasks);

  const [index, setIndex] = useState(0);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchComplianceTasks());
  }, [dispatch]);

  useEffect(() => {
     if (error) {
        setSnackbarMessage(error);
        setSnackbarVisible(true);
     }
  }, [error]);

  const onRefresh = useCallback(() => {
    dispatch(fetchComplianceTasks());
  }, [dispatch]);

  const handleShowConfirmDialog = (taskId) => {
    setSelectedTaskId(taskId);
    setConfirmDialogVisible(true);
  };

  const handleCompleteTask = () => {
    setConfirmDialogVisible(false);
    if (selectedTaskId) {
      dispatch(completeComplianceTask(selectedTaskId));
    }
  };

   const handleDetailsPress = (taskId) => {
    console.log(`Navigate to task details: ${taskId}`);
    // TODO: Navigate to actual TaskDetailsScreen when created
     navigation.navigate(NAV_ROUTES.TASK_DETAILS, { taskId });
  };

  // Memoize filtered tasks to avoid recalculations on every render
  const filteredTasks = useMemo(() => ({
      pending: complianceTasks.filter(t => t.status === 'Pending'),
      completed: complianceTasks.filter(t => t.status === 'Completed'),
      overdue: complianceTasks.filter(t => t.status === 'Overdue'),
  }), [complianceTasks]);

  const routes = useMemo(() => [
    { key: 'all', title: 'All Tasks' },
    { key: 'pending', title: `Pending (${filteredTasks.pending.length})` },
    { key: 'completed', title: `Completed (${filteredTasks.completed.length})` },
    { key: 'overdue', title: `Overdue (${filteredTasks.overdue.length})` },
  ], [filteredTasks]);

  // Need to create SceneMap outside the component body or memoize it
   const renderScene = SceneMap({
        all: () => (
            <TaskList
                listKey="all"
                tasksData={complianceTasks}
                isLoading={isLoading}
                onRefresh={onRefresh}
                onComplete={handleShowConfirmDialog}
                onDetails={handleDetailsPress}
            />
        ),
        pending: () => (
             <TaskList
                listKey="pending"
                tasksData={filteredTasks.pending}
                isLoading={isLoading}
                onRefresh={onRefresh}
                onComplete={handleShowConfirmDialog}
                onDetails={handleDetailsPress}
            />
        ),
        completed: () => (
             <TaskList
                listKey="completed"
                tasksData={filteredTasks.completed}
                isLoading={isLoading}
                onRefresh={onRefresh}
                onComplete={handleShowConfirmDialog}
                onDetails={handleDetailsPress}
            />
        ),
        overdue: () => (
            <TaskList
                listKey="overdue"
                tasksData={filteredTasks.overdue}
                isLoading={isLoading}
                onRefresh={onRefresh}
                onComplete={handleShowConfirmDialog}
                onDetails={handleDetailsPress}
            />
        ),
  });

  // Header actions (optional filter/sort)
  const headerActions = [
      { icon: 'filter-variant', onPress: () => console.log('Filter tasks') },
  ];

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    dispatch(clearTasksError());
  };

  return (
    <Portal.Host>
    <ScreenWrapper style={styles.noPadding} contentContainerStyle={styles.fullHeightContent}>
      <AppHeader title="Compliance Tasks" showBackButton actions={headerActions}/>
       {(isLoading && complianceTasks.length === 0) ? (
             <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
        ) : (
             <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
                lazy // Render scenes only when needed
             />
        )}

         {/* Confirmation Dialog */} 
        <Dialog visible={confirmDialogVisible} onDismiss={() => setConfirmDialogVisible(false)}>
            <Dialog.Title>Confirm Task Completion</Dialog.Title>
            <Dialog.Content>
                 <Paragraph>Are you sure you want to mark this task as complete?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => setConfirmDialogVisible(false)}>Cancel</Button>
                <Button onPress={handleCompleteTask} loading={isUpdating} disabled={isUpdating}>Yes, Complete</Button>
            </Dialog.Actions>
         </Dialog>

         <Snackbar
            visible={snackbarVisible}
            onDismiss={handleSnackbarDismiss}
            duration={Snackbar.DURATION_SHORT}
         >
            {snackbarMessage}
         </Snackbar>
    </ScreenWrapper>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  noPadding: { paddingTop: 0 },
  fullHeightContent: {
      flex: 1,
      paddingHorizontal: 0,
      paddingVertical: 0,
  },
  tabLabel: {
      fontWeight: 'bold',
      fontSize: 13, // Slightly smaller font for tabs
      textTransform: 'capitalize',
  },
   tabStyle: {
        width: 'auto', // Adjust width based on label
        paddingHorizontal: 12,
    },
  listContentContainer: {
      padding: 16,
  },
  listLoadingIndicator: {
      marginTop: 50,
  },
   loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
  },
  emptyText: {
      fontSize: 16,
      color: 'grey',
      textAlign: 'center',
  },
});

export default ComplianceTasksScreen; 