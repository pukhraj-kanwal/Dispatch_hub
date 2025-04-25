import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function LoadCard({ load, onDetails, onConfirm, onReject }) {
  const theme = useTheme();

  // Define styles inside the component to access theme
  const styles = StyleSheet.create({
    card: {
      marginBottom: 12,
      backgroundColor: 'white',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    loadId: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    chip: {
      height: 30, // Adjust height for smaller chip
      alignItems: 'center',
    },
    locationContainer: {
        marginVertical: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationLabel: {
        marginLeft: 8,
        fontWeight: 'bold',
        width: 60, // Fixed width for alignment
    },
    locationValue: {
      flex: 1, // Allow value to take remaining space
      marginRight: 8,
    },
    dateTime: {
        fontSize: 12,
        color: 'grey',
    },
    warningIcon: {
      marginLeft: 4,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    button: {
      flex: 1,
      marginHorizontal: 4,
    },
    buttonLabel: {
        fontSize: 14,
    },
    incompleteContainer: {
        marginTop: 12,
        padding: 10,
        backgroundColor: theme.colors.error + '15', // Light error background
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.error + '30',
        alignItems: 'center' // Center items including the icon and text row
    },
    incompleteTextRow: { // New style for icon and text row
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    incompleteText: {
        color: theme.colors.error,
        // Removed textAlign: 'center' as it's now in a row
        fontSize: 12,
        marginLeft: 4, // Add some space between icon and text
    }
  });

  const isConfirmed = load.status === 'Confirmed';
  const isUnconfirmed = load.status === 'Unconfirmed';
  const isIncomplete = load.status === 'Incomplete';

  const getStatusChip = () => {
      let chipStyle = {};
      let textStyle = {};
      let icon = 'information'; // default

      switch (load.status) {
          case 'Confirmed':
              chipStyle = { borderColor: theme.colors.success, backgroundColor: theme.colors.success + '20' };
              textStyle = { color: theme.colors.success };
              icon = 'check-circle';
              break;
          case 'Unconfirmed':
              chipStyle = { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '20' };
              textStyle = { color: theme.colors.primary };
              icon = 'help-circle';
              break;
          case 'Incomplete':
               chipStyle = { borderColor: theme.colors.error, backgroundColor: theme.colors.error + '20' };
               textStyle = { color: theme.colors.error };
               icon = 'alert-circle';
               break;
           case 'Pending': // From Trip History screen
                chipStyle = { borderColor: theme.colors.warning, backgroundColor: theme.colors.warning + '20' };
                textStyle = { color: theme.colors.warning };
                icon = 'clock-outline';
                break;
             case 'In Progress': // From Trip History screen
                chipStyle = { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '20' };
                textStyle = { color: theme.colors.primary };
                icon = 'truck-fast';
                break;
             case 'Completed': // From Trip History screen
                chipStyle = { borderColor: theme.colors.disabled, backgroundColor: theme.colors.disabled + '20' };
                textStyle = { color: theme.colors.disabled };
                icon = 'check-decagram';
                break;
          default:
              chipStyle = { borderColor: theme.colors.disabled, backgroundColor: theme.colors.disabled + '20' };
              textStyle = { color: theme.colors.disabled };
              break;
      }
      return <Chip icon={icon} mode="outlined" textStyle={textStyle} style={[styles.chip, chipStyle]}>{load.status}</Chip>;
  };

  const renderPickupDropoff = () => (
     <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
             <MaterialCommunityIcons name="arrow-up-circle" size={18} color={theme.colors.primary} />
             <Text style={styles.locationLabel}>Pickup:</Text>
             <Text style={styles.locationValue}>{load.pickupLocation}</Text>
             <Text style={styles.dateTime}>{`${load.pickupDate} • ${load.pickupTime}`}</Text>
              {load.pickupWarning && <MaterialCommunityIcons name="alert" size={16} color={theme.colors.error} style={styles.warningIcon} />}
        </View>
        <View style={styles.locationRow}>
             <MaterialCommunityIcons name="arrow-down-circle" size={18} color={theme.colors.primary} />
            <Text style={styles.locationLabel}>Dropoff:</Text>
            <Text style={styles.locationValue}>{load.dropoffLocation}</Text>
            <Text style={styles.dateTime}>{`${load.dropoffDate} • ${load.dropoffTime}`}</Text>
        </View>
    </View>
  );

  const renderActions = () => {
    if (isUnconfirmed) {
      return (
        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={() => onConfirm(load.id)}
            style={[styles.button, { backgroundColor: theme.colors.success }]}
            labelStyle={styles.buttonLabel}
          >
            Confirm
          </Button>
          <Button
            mode="contained"
            onPress={() => onReject(load.id)}
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            labelStyle={styles.buttonLabel}
          >
            Reject
          </Button>
        </View>
      );
    } else if (isIncomplete) {
       return (
         <View style={styles.incompleteContainer}>
            {/* Wrap icon and text in a row */}
            <View style={styles.incompleteTextRow}>
              <MaterialCommunityIcons name="alert-circle-outline" size={16} color={theme.colors.error} /* Removed style={styles.warningIcon} as alignment is handled by row */ />
              <Text style={styles.incompleteText}>Load information incomplete. Contact dispatcher.</Text>
            </View>
            <View style={styles.buttonRow}>
                 <Button mode="outlined" disabled style={styles.button} labelStyle={styles.buttonLabel}>Confirm</Button>
                 <Button mode="outlined" disabled style={styles.button} labelStyle={styles.buttonLabel}>Reject</Button>
            </View>
        </View>
       )
    }
    return null;
  };

  return (
    <Card style={styles.card} onPress={onDetails ? () => onDetails(load.id) : undefined}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text style={styles.loadId}>{load.id}</Text>
          {getStatusChip()}
        </View>
        {renderPickupDropoff()}
        {renderActions()}
      </Card.Content>
    </Card>
  );
}

export default LoadCard; 