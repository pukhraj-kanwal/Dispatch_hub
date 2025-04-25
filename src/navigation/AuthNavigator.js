import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAV_ROUTES } from '../constants/navigationRoutes';

// Import LoginScreen
import LoginScreen from '../screens/Auth/LoginScreen';
// TODO: Import ForgotPasswordScreen
// import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={NAV_ROUTES.LOGIN} component={LoginScreen} />
      {/* <Stack.Screen name={NAV_ROUTES.FORGOT_PASSWORD} component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
}

export default AuthNavigator; 