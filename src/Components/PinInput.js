import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { useTheme, Text } from 'react-native-paper';

const PinInput = ({ pinLength = 4, onPinComplete, containerStyle, inputStyle, error, errorTextStyle }) => {
  const theme = useTheme();
  const [pin, setPin] = useState(Array(pinLength).fill(''));
  const inputs = useRef([]);

  useEffect(() => {
    // Auto-focus first input on mount if needed
    // inputs.current[0]?.focus();
  }, []);

  const handleChange = (text, index) => {
    const newPin = [...pin];
    // Allow only digits and limit to 1 character
    newPin[index] = text.replace(/[^0-9]/g, '').slice(0, 1);
    setPin(newPin);

    // Move to next input if a digit is entered
    if (text.length === 1 && index < pinLength - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newPin.every(digit => digit.length === 1)) {
      Keyboard.dismiss(); // Dismiss keyboard on completion
      onPinComplete(newPin.join(''));
    } else if (pin.every(digit => digit.length === 1) && text.length === 0){
      // If deleting from a complete state, notify parent it's no longer complete
       onPinComplete('');
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && pin[index].length === 0 && index > 0) {
      inputs.current[index - 1]?.focus();
      // Clear the previous input as well after focusing
       const newPin = [...pin];
       newPin[index - 1] = '';
       setPin(newPin);
       onPinComplete(''); // Pin is incomplete now
    }
  };

  const defaultInputStyle = {
    borderWidth: 1,
    borderColor: error ? theme.colors.error : theme.colors.backdrop, // Use backdrop color for subtle border
    borderRadius: theme.roundness * 2, // More rounded
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 5,
    backgroundColor: theme.colors.background, // Match background
    color: theme.colors.text, // Ensure text color matches theme
  };

  const defaultErrorTextStyle = {
      color: theme.colors.error,
      marginTop: 8,
      textAlign: 'center',
      fontSize: 14,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.pinContainer}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={el => (inputs.current[index] = el)}
            style={[defaultInputStyle, inputStyle]}
            value={digit}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry={true} // Hide the entered digit
            textContentType="oneTimeCode" // Helps with autofill suggestions (might not work perfectly for custom input)
            selectionColor={theme.colors.primary} // Use theme primary color for cursor/selection
          />
        ))}
      </View>
      {error && <Text style={[defaultErrorTextStyle, errorTextStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PinInput; 