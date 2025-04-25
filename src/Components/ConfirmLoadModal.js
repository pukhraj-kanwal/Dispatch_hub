import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, Card, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PinInput from './PinInput'; // Import the PinInput component

const ConfirmLoadModal = ({ visible, onDismiss, onConfirm, loadDetails, isLoading }) => {
  const theme = useTheme();
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const handlePinComplete = (enteredPin) => {
    setPin(enteredPin);
    if (enteredPin.length === 4) {
      setPinError(''); // Clear error when pin is complete
    }
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setPinError('Please enter a 4-digit PIN');
    } else {
      setPinError('');
      onConfirm(pin);
    }
  };

  const handleDismiss = () => {
      setPin(""); // Clear pin on dismiss
      setPinError(''); // Clear error on dismiss
      onDismiss();
  }

  // Basic check for valid loadDetails
  if (!loadDetails) {
    return null; // Or return a placeholder/loading indicator inside the modal
  }

  const containerStyle = {
    backgroundColor: theme.colors.background,
    padding: 20,
    margin: 20,
    borderRadius: theme.roundness * 2,
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={containerStyle}>
        <Card style={styles.card}>
          <IconButton
            icon="close"
            size={24}
            onPress={handleDismiss}
            style={styles.closeButton}
            color={theme.colors.text}
          />
          <Card.Title title="Confirm Load Assignment" titleStyle={styles.title} />
          <Card.Content>
            <Text style={styles.loadId}>{loadDetails.id}</Text>
            <View style={styles.locationRow}>
                <Text style={styles.locationText}>{loadDetails.pickupLocation}</Text>
                <MaterialCommunityIcons name="arrow-right" size={18} color={theme.colors.text} style={styles.arrowIcon}/>
                <Text style={styles.locationText}>{loadDetails.dropoffLocation}</Text>
            </View>
             <View style={styles.timeRow}>
                <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="grey" />
                <Text style={styles.timeText}>Pickup: {loadDetails.pickupDate} • {loadDetails.pickupTime}</Text>
            </View>

            <Text style={styles.pinLabel}>Enter PIN</Text>
            <PinInput
              pinLength={4}
              onPinComplete={handlePinComplete}
              error={pinError}
            />
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button onPress={handleDismiss} disabled={isLoading} mode="outlined" style={styles.button}>Cancel</Button>
            <Button onPress={handleSubmit} mode="contained" loading={isLoading} disabled={isLoading || pin.length !== 4} style={styles.button}>Submit PIN</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 0, // Remove shadow if modal provides background
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    right: -10, // Adjust positioning as needed
    top: -10,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10, // Add some space below title
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadId: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    // flexShrink: 1, // Allow text to shrink if needed
  },
  arrowIcon: {
    marginHorizontal: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    color: 'grey',
  },
  timeText: {
    marginLeft: 8,
    color: 'grey',
    fontSize: 12,
  },
  pinLabel: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    color: 'grey',
  },
  actions: {
    justifyContent: 'space-around', // Distribute buttons
    marginTop: 20, // Add space above actions
  },
  button: {
    flex: 1, // Make buttons take equal width
    marginHorizontal: 5,
  },
});

export default ConfirmLoadModal; 