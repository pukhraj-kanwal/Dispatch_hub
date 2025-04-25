import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_ROUTES } from '../constants/navigationRoutes';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
// TODO: Import other screens reachable from Dashboard (NotificationsScreen, ComplianceTasksScreen, etc.)

const Stack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NAV_ROUTES.DASHBOARD} component={DashboardScreen} />
      {/* Add other screens later */}
      {/* <Stack.Screen name={NAV_ROUTES.NOTIFICATIONS} component={NotificationsScreen} /> */}
      {/* <Stack.Screen name={NAV_ROUTES.COMPLIANCE_TASKS} component={ComplianceTasksScreen} /> */}
    </Stack.Navigator>
  );
}

export default HomeStackNavigator; 