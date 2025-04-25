import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_ROUTES } from '../constants/navigationRoutes';
import MessagesScreen from '../screens/Messages/MessagesScreen';
// TODO: Import ChatDetailScreen

const Stack = createNativeStackNavigator();

function MessagesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NAV_ROUTES.MESSAGES} component={MessagesScreen} />
      {/* Add ChatDetailScreen later */}
      {/* <Stack.Screen name={NAV_ROUTES.CHAT_DETAIL} component={ChatDetailScreen} /> */}
    </Stack.Navigator>
  );
}

export default MessagesStackNavigator; 