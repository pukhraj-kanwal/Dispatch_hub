import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ScreenWrapper({ children, style, scrollable = false, contentContainerStyle }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.colors.background },
    { paddingTop: insets.top, paddingBottom: insets.bottom },
    style,
  ];

  const innerContentContainerStyle = [
      styles.content,
      scrollable && styles.scrollContent, // Add flexGrow for scrollable content
      contentContainerStyle
  ];

  if (scrollable) {
    return (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={innerContentContainerStyle}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={containerStyle}>
        <View style={innerContentContainerStyle}>
            {children}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
      flex: 1,
      paddingHorizontal: 16, // Default horizontal padding
      paddingVertical: 16, // Default vertical padding
  },
  scrollContent: {
      flexGrow: 1,
  }
});

export default ScreenWrapper; 