import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_ROUTES } from '../constants/navigationRoutes';
import NavigationMenuScreen from '../screens/More/NavigationMenuScreen';
// Import other screens reachable from the More menu
import ReportIncidentScreen from '../screens/Reports/ReportIncidentScreen';
import ComplianceTasksScreen from '../screens/Compliance/ComplianceTasksScreen';
import MaintenanceLogScreen from '../screens/Reports/MaintenanceLogScreen';
import DriverProfileScreen from '../screens/Profile/DriverProfileScreen';
import DocumentsScreen from '../screens/More/DocumentsScreen';
import SettingsScreen from '../screens/More/SettingsScreen';
import TaskDetailsScreen from '../screens/Tasks/TaskDetailsScreen';
// Import NotificationsScreen
import NotificationsScreen from "../screens/More/NotificationsScreen"; // Adjust path if necessary
// TODO: Import other remaining screens

const Stack = createNativeStackNavigator();

// Helper function for common screen options (e.g., back button styling)
// Can be customized further later
const commonScreenOptions = {
    headerShown: false, // Let individual screens manage their headers via AppHeader
    // headerBackTitleVisible: false,
    // headerTintColor: theme.colors.primary, // Use theme color
};

function MoreStackNavigator() {
  return (
    <Stack.Navigator initialRouteName={NAV_ROUTES.NAVIGATION_MENU} screenOptions={commonScreenOptions}>
        {/* The initial screen for the 'More' tab */}
        <Stack.Screen
            name={NAV_ROUTES.NAVIGATION_MENU}
            component={NavigationMenuScreen}
            // options={{ headerShown: false }} // Already default via commonScreenOptions
        />

        {/* Other screens accessible from the menu */}
         <Stack.Screen
            name={NAV_ROUTES.REPORT_INCIDENT}
            component={ReportIncidentScreen}
            // Options can be set here if needed, but AppHeader handles title/back
        />
         <Stack.Screen
            name={NAV_ROUTES.COMPLIANCE_TASKS}
            component={ComplianceTasksScreen}
        />
        <Stack.Screen
            name={NAV_ROUTES.MAINTENANCE_LOG}
            component={MaintenanceLogScreen}
         />
         <Stack.Screen
            name={NAV_ROUTES.PROFILE}
            component={DriverProfileScreen}
         />
         <Stack.Screen
            name={NAV_ROUTES.DOCUMENTS}
            component={DocumentsScreen}
         />
         <Stack.Screen
            name={NAV_ROUTES.SETTINGS}
            component={SettingsScreen}
         />
         <Stack.Screen
            name={NAV_ROUTES.TASK_DETAILS}
            component={TaskDetailsScreen}
         />
        {/* Add the Notifications screen */}
        <Stack.Screen
            name={NAV_ROUTES.NOTIFICATIONS}
            component={NotificationsScreen}
         />
         {/* Add all other screens from the menu here */}

    </Stack.Navigator>
  );
}

export default MoreStackNavigator; 