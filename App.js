import React from 'react';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import the Redux store
import store from './src/store/store';

// Import the main AppNavigator
import AppNavigator from './src/navigation/AppNavigator.js';

// Import the theme
import theme from './src/theme/theme';

// New component to safely access theme context
function ThemedApp() {
  const paperTheme = useTheme();
  return (
    <>
      {/* Apply status bar style from theme context */}
      <StatusBar style={paperTheme.colors.statusBar === 'light-content' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            {/* Render the new component which uses the hook */}
            <ThemedApp />
          </NavigationContainer>
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
} 