import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, Card, IconButton, useTheme } from 'react-native-paper';
import PinInput from './PinInput'; // Reuse the PinInput component

const ConfirmAllLoadsModal = ({ visible, onDismiss, onConfirm, isLoading, loadCount }) => {
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
      onConfirm(pin); // Pass the entered PIN to the confirmation handler
    }
  };

  const handleDismiss = () => {
      setPin(""); // Clear pin on dismiss
      setPinError(''); // Clear error on dismiss
      onDismiss();
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
          <Card.Title 
            title="Confirm All Loads"
            subtitle={`Confirm assignment for ${loadCount} load${loadCount !== 1 ? 's' : ''}?`}
            titleStyle={styles.title}
            subtitleStyle={styles.subtitle}
           />
          <Card.Content>
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
    elevation: 0,
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    right: -10,
    top: -10,
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    // marginBottom: 5, // Reduced margin if subtitle exists
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    color: 'grey',
  },
  pinLabel: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
    color: 'grey',
  },
  actions: {
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ConfirmAllLoadsModal; 