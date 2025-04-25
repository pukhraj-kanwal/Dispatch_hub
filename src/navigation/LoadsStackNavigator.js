import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_ROUTES } from '../constants/navigationRoutes';
import MyLoadsScreen from '../screens/Loads/MyLoadsScreen';
import LoadDetailsScreen from '../screens/Loads/LoadDetailsScreen';
import LoadReassignmentRequestScreen from '../screens/Loads/LoadReassignmentRequestScreen';
import DeliveryCompletionScreen from '../screens/Loads/DeliveryCompletionScreen';

const Stack = createNativeStackNavigator();

function LoadsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NAV_ROUTES.MY_LOADS} component={MyLoadsScreen} />
      <Stack.Screen name={NAV_ROUTES.LOAD_DETAILS} component={LoadDetailsScreen} />
      <Stack.Screen name={NAV_ROUTES.LOAD_REASSIGNMENT_REQUEST} component={LoadReassignmentRequestScreen} />
      <Stack.Screen name={NAV_ROUTES.DELIVERY_COMPLETION} component={DeliveryCompletionScreen} />
    </Stack.Navigator>
  );
}

export default LoadsStackNavigator; 