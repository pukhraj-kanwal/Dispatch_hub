import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { NAV_ROUTES } from '../constants/navigationRoutes';

// Import Tab Stack Navigators
import HomeStackNavigator from './HomeStackNavigator';
import LoadsStackNavigator from './LoadsStackNavigator';
import MessagesStackNavigator from './MessagesStackNavigator';
import MoreStackNavigator from './MoreStackNavigator';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Headers will be managed by stack navigators within each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // Match route names defined in the Tab.Screen components below
          if (route.name === NAV_ROUTES.HOME_STACK) { // Use Stack name for tab route
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === NAV_ROUTES.LOADS_STACK) {
            iconName = focused ? 'truck' : 'truck-outline';
          } else if (route.name === NAV_ROUTES.MESSAGES_STACK) {
            iconName = focused ? 'message-text' : 'message-text-outline';
          } else if (route.name === NAV_ROUTES.MORE_STACK) {
            iconName = focused ? 'dots-horizontal-circle' : 'dots-horizontal-circle-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: { backgroundColor: theme.colors.surface }, // Use theme surface color for background
      })}
    >
      {/* Real Tabs */}
      <Tab.Screen
        name={NAV_ROUTES.HOME_STACK} // Use the Stack Navigator's constant name
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name={NAV_ROUTES.LOADS_STACK}
        component={LoadsStackNavigator}
        options={{
          tabBarLabel: 'Loads',
          unmountOnBlur: true
        }}
      />
      <Tab.Screen
        name={NAV_ROUTES.MESSAGES_STACK}
        component={MessagesStackNavigator}
        options={{ tabBarLabel: 'Messages' }}
      />
      <Tab.Screen
        name={NAV_ROUTES.MORE_STACK}
        component={MoreStackNavigator}
        options={{ tabBarLabel: 'More' }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs; 