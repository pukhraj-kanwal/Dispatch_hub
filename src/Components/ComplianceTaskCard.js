import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, Button, useTheme, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function ComplianceTaskCard({ task, onComplete, onDetails }) {
  const theme = useTheme();

  const isPending = task.status === 'Pending';
  const isOverdue = task.status === 'Overdue';
  const isCompleted = task.status === 'Completed';

  const getStatusChip = () => {
      let chipStyle = {};
      let textStyle = {};
      let icon = 'clock-outline'; // default

      switch (task.status) {
          case 'Pending':
              chipStyle = { borderColor: theme.colors.warning, backgroundColor: theme.colors.warning + '20' };
              textStyle = { color: theme.colors.warning };
              icon = 'clock-outline';
              break;
          case 'Overdue':
              chipStyle = { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '20' };
              textStyle = { color: theme.colors.error };
              icon = 'alert-circle';
              break;
          case 'Completed':
              chipStyle = { borderColor: theme.colors.success, backgroundColor: theme.colors.success + '20' };
              textStyle = { color: theme.colors.success };
              icon = 'check-circle';
               break;
          default:
              chipStyle = { borderColor: theme.colors.disabled, backgroundColor: theme.colors.disabled + '20' };
              textStyle = { color: theme.colors.disabled };
              break;
      }
      return <Chip icon={icon} mode="outlined" textStyle={textStyle} style={[styles.chip, chipStyle]}>{task.status}</Chip>;
  };

  return (
    <Card style={styles.card} onPress={onDetails ? () => onDetails(task.id) : undefined}>
        <Card.Content>
            <View style={styles.headerRow}>
                 <Text style={styles.title}>{task.title}</Text>
                 {getStatusChip()}
            </View>
            <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar-clock" size={16} color="grey" style={styles.icon} />
                 <Text style={styles.dueDateText}>Due: {task.dueDate}</Text>
                 {/* Optional: Add Right Arrow for navigation */}
                 <View style={{ flex: 1 }} /> {/* Spacer */} 
                 <MaterialCommunityIcons name="chevron-right" size={24} color="grey" />
            </View>
            <Paragraph style={styles.description}>{task.description}</Paragraph>
            {!isCompleted && (
                 <Button
                    mode="contained"
                    onPress={() => onComplete(task.id)}
                    style={styles.completeButton}
                    // Optional: Show loading state if needed
                >
                    Complete Task
                </Button>
            )}
         </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
   headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1, // Allow title to wrap
    marginRight: 8,
  },
  chip: {
    height: 30,
    alignItems: 'center',
  },
   detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
  },
   icon: {
      marginRight: 8,
  },
  dueDateText: {
      color: 'grey',
      fontSize: 12,
  },
  description: {
      fontSize: 14,
      color: '#333',
      marginBottom: 12,
  },
  completeButton: {
      marginTop: 8,
  }
});

export default ComplianceTaskCard; 