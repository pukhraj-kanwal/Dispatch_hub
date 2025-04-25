import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF', // Blue used for primary buttons, links
    accent: '#FF9500', // Accent color (if needed)
    background: '#F2F2F7', // Light gray background
    surface: '#FFFFFF', // Card backgrounds, modals
    text: '#000000', // Default text
    placeholder: '#8E8E93', // Input placeholders
    error: '#FF3B30', // Red for errors
    success: '#34C759', // Green for success states
    warning: '#FFCC00', // Yellow for warnings/pending
    disabled: '#C7C7CC', // Disabled elements
    onSurface: '#000000', // Text on surface
    notification: '#FF3B30', // Badge/notification color
    // Custom colors based on screenshots
    tabBarActive: '#007AFF',
    tabBarInactive: '#8E8E93',
    statusBar: 'dark-content', // Assuming light theme initially
    headerBackground: '#FFFFFF',
    headerText: '#000000',
    cardBorder: '#E5E5EA',
    link: '#007AFF',
  },
  roundness: 8, // Consistent border radius for cards, buttons, inputs
  fonts: {
    ...DefaultTheme.fonts,
    // Optionally define custom fonts if needed and loaded in assets
  },
  // Add other theme customizations like spacing, animations if needed
};

export default theme; 