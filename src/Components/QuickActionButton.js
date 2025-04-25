import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function QuickActionButton({ title, icon, onPress }) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}> // Light primary background
            <MaterialCommunityIcons name={icon} size={24} color={theme.colors.primary} />
        </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  iconContainer: {
      padding: 12,
      borderRadius: 8, // Slightly rounded corners for the background
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
      width: 50, // Fixed width
      height: 50, // Fixed height
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default QuickActionButton; 