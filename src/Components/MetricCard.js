import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

function MetricCard({ title, value }) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    // Elevation can be added for shadow based on theme
  },
  content: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8, // Reduce horizontal padding for smaller cards
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
  },
});

export default MetricCard; 