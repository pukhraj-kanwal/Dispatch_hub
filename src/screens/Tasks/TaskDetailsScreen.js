import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, ActivityIndicator, Card, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import { NAV_ROUTES } from '../../constants/navigationRoutes';
// TODO: Potentially fetch task details if not already in state
// import { fetchTaskDetails } from '../../store/slices/tasksSlice';

function TaskDetailsScreen() {
    const theme = useTheme();
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { taskId, origin } = route.params || {};

    // Select the specific task from the state
    const task = useSelector((state) =>
        state.tasks?.complianceTasks?.find((t) => t.id === taskId)
    );

    const isLoading = useSelector((state) => state.tasks.isLoading);
    // const task = useSelector((state) => state.tasks.currentTaskDetails); // Use if fetching details
    // const isLoadingDetails = useSelector((state) => state.tasks.isLoadingDetails);

    // useEffect(() => {
    //     if (taskId) {
    //         dispatch(fetchTaskDetails(taskId)); // Fetch if needed
    //     }
    // }, [dispatch, taskId]);

    // --- Custom Back Press Handler ---
    const handleBackPress = () => {
        if (origin === NAV_ROUTES.DASHBOARD) {
            // Navigate explicitly back to the Dashboard tab/screen
            navigation.navigate(NAV_ROUTES.HOME_STACK, { screen: NAV_ROUTES.DASHBOARD });
        } else {
            // Default behavior: go back within the current stack (MoreStack)
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        }
    };

    if (isLoading) {
        return (
            <ScreenWrapper>
                <AppHeader title="Task Details" showBackButton onBackPress={handleBackPress} />
                <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
            </ScreenWrapper>
        );
    }

    if (!task) {
        return (
            <ScreenWrapper>
                <AppHeader title="Task Details" showBackButton onBackPress={handleBackPress} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Task details not found.</Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <AppHeader title={task.title || "Task Details"} showBackButton onBackPress={handleBackPress} />
            <View style={styles.contentContainer}>
                <Card style={styles.card}>
                     <Card.Title title={task.title} subtitle={`Category: ${task.category || 'N/A'}`} />
                     <Card.Content>
                        <Paragraph style={styles.description}>{task.description}</Paragraph>
                         <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Status:</Text>
                            <Text style={[styles.detailValue, { color: task.status === 'Completed' ? theme.colors.success : theme.colors.primary }]}>{task.status}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Due Date:</Text>
                            <Text style={styles.detailValue}>{task.dueDate}</Text>
                        </View>
                         {/* Add more task details as needed */} 
                    </Card.Content>
                     {/* Optionally add actions like 'Mark Complete' if not done via list */}
                     {/* <Card.Actions>
                         <Button>Mark Complete</Button>
                     </Card.Actions> */}
                </Card>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    description: {
        marginBottom: 16,
        fontSize: 15,
        lineHeight: 22,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        fontWeight: 'bold',
        width: 80,
    },
    detailValue: {
        flex: 1,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'center',
    },
});

export default TaskDetailsScreen; 