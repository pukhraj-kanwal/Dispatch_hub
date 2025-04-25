import React from 'react';
import { StyleSheet } from 'react-native';
import { List, useTheme } from 'react-native-paper';

function TaskListItem({ task, onPress }) {
  const theme = useTheme();

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return 'check-circle';
      case 'overdue':
        return 'alert-circle';
      case 'pending':
      default:
        return 'clock-outline'; // Or null if no icon for pending
    }
  };

  const getStatusColor = () => {
     switch (task.status) {
      case 'completed':
        return theme.colors.success;
      case 'overdue':
        return theme.colors.error;
      case 'pending':
      default:
        return theme.colors.warning; // Or text color
    }
  }

  return (
    <List.Item
      title={task.title}
      description={`Due: ${task.dueDate}`}
      left={() => (
          <List.Icon
            icon={getStatusIcon()}
            color={getStatusColor()}
           />
        )}
      right={() => <List.Icon icon="chevron-right" />}
      onPress={onPress}
      style={styles.listItem}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    // Add specific styling like background, border if needed
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    paddingVertical: 8, // Adjust vertical padding
  },
  title: {
      fontWeight: 'bold',
  },
  description: {
      fontSize: 12,
  }
});

export default TaskListItem; 