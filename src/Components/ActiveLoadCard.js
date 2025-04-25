import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ProgressBar, useTheme, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function ActiveLoadCard({ load, onPress }) {
  const theme = useTheme();

  if (!load) {
    return (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.noLoadText}>No active loads currently.</Text>
            </Card.Content>
        </Card>
    )
  }

  // Calculate progress (example: based on status or time)
  // This needs real logic based on how progress is determined
  const progress = 0.6; // Placeholder 60%

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.headerRow}>
             <Text style={styles.title}>Load #{load.id}</Text>
             <Chip icon="information" mode="outlined" textStyle={{color: theme.colors.primary}} style={{borderColor: theme.colors.primary, backgroundColor: '#E6F2FF'}}>In Progress</Chip>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
          <Text style={styles.locationText}>{`${load.pickupLocation || ''} → ${load.dropoffLocation || ''}`}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.timeText}>Est. arrival {load.estimatedArrival}</Text>
        </View>
         <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
  },
  timeText: {
     marginLeft: 8,
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  noLoadText: {
      textAlign: 'center',
      paddingVertical: 20,
      color: 'grey'
  }
});

export default ActiveLoadCard; 