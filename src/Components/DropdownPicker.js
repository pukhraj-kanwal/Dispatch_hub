import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Text, Menu, Divider, TextInput, HelperText, useTheme, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from "@expo/vector-icons";

function DropdownPicker({ label, items, value, onValueChange, error, helperText, disabled = false }) {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);

    const openMenu = () => !disabled && setVisible(true);
    const closeMenu = () => setVisible(false);

    const selectedItem = items.find(item => item.value === value);
    const displayValue = selectedItem ? selectedItem.label : (label.includes('*') ? 'Select required...' : 'Select...');

    return (
        <View style={styles.container}>
             <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity onPress={openMenu} disabled={disabled}>
                        <TextInput
                            label={label}
                            value={displayValue}
                            mode="outlined"
                            editable={false}
                            right={<TextInput.Icon icon={visible ? "menu-up" : "menu-down"} onPress={openMenu} forceTextInputFocus={false} disabled={disabled} />}
                            style={styles.input}
                            error={error}
                            theme={{ colors: { text: disabled ? theme.colors.disabled : theme.colors.text } }}
                            // disabled={disabled} // Applies visual disabled state, but TouchableOpacity handles interaction
                        />
                     </TouchableOpacity>
                 }
                style={styles.menuContainer}
            >
                {items.map((item) => (
                    <Menu.Item
                        key={item.value}
                        onPress={() => {
                            onValueChange(item.value);
                            closeMenu();
                        }}
                        title={item.label}
                        // Optionally disable the placeholder item if it has no value
                        // disabled={!item.value}
                    />
                ))}
            </Menu>
            {error && helperText && <HelperText type="error" visible={error}>{helperText}</HelperText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    input: {
       backgroundColor: 'white', // Ensure consistent background
    },
    menuContainer: {
        marginTop: 50, // Adjust based on input height and label position
        width: '88%', // Try to match input width (adjust as needed)
    },
});

export default DropdownPicker; 