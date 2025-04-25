import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, List, Switch, Divider, useTheme, Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import { logoutUser } from '../../store/slices/authSlice'; // Assuming logout is handled here

const APP_VERSION = Constants.manifest?.version ?? '1.0.0'; // Get version from app.json

function SettingsScreen() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
    // TODO: Add state and logic for other settings

    const handleLogoutPress = () => {
        setLogoutDialogVisible(true); // Show confirmation dialog
    };

    const handleConfirmLogout = () => {
        setLogoutDialogVisible(false);
        dispatch(logoutUser());
        // Navigation back to Auth stack is usually handled by the main AppNavigator
        // when the auth state changes.
    };

    const handleCancelLogout = () => {
        setLogoutDialogVisible(false);
    };

    const handleOpenLink = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            alert(`Don't know how to open this URL: ${url}`);
        }
    };

    return (
        <Portal.Host> {/* Ensure Portal.Host is wrapping for Dialog */}
            <ScreenWrapper>
                <AppHeader title="Settings" showBackButton />
                <ScrollView style={styles.container}>
                    <List.Section title="Notifications">
                        <List.Item
                            title="Push Notifications"
                            right={() => (
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    // TODO: Add logic to update notification settings
                                />
                            )}
                        />
                        {/* Add more notification settings if needed */}
                    </List.Section>

                    <Divider />

                    <List.Section title="Appearance">
                         <List.Item
                            title="Dark Mode"
                            right={() => (
                                <Switch
                                    value={darkModeEnabled}
                                    onValueChange={setDarkModeEnabled}
                                    // TODO: Implement theme switching logic
                                />
                            )}
                        />
                         <List.Item
                            title="Text Size"
                            description="Adjust application text size"
                            right={() => <List.Icon icon="chevron-right" />}
                            onPress={() => alert('Text size adjustment coming soon!')}
                         />
                    </List.Section>

                    <Divider />

                    <List.Section title="Account">
                        <List.Item
                            title="Change Password"
                            right={() => <List.Icon icon="chevron-right" />}
                            onPress={() => alert('Change password feature coming soon!')}
                        />
                        <List.Item
                            title="Privacy Policy"
                            right={() => <List.Icon icon="chevron-right" />}
                            onPress={() => handleOpenLink('https://example.com/privacy')}
                        />
                        <List.Item
                            title="Terms of Service"
                            right={() => <List.Icon icon="chevron-right" />}
                            onPress={() => handleOpenLink('https://example.com/terms')}
                        />
                    </List.Section>

                    <Divider />

                    <View style={styles.logoutButtonContainer}>
                        <Button
                            mode="outlined"
                            icon="logout"
                            onPress={handleLogoutPress} // Show dialog instead of direct logout
                            color={theme.colors.error} // Color for icon and text
                            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
                        >
                            Logout
                        </Button>
                    </View>

                     <Text style={styles.versionText}>App Version: {APP_VERSION}</Text> {/* Use dynamic version */}

                </ScrollView>

                {/* Logout Confirmation Dialog */}
                <Dialog visible={logoutDialogVisible} onDismiss={handleCancelLogout}>
                    <Dialog.Title>Confirm Logout</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Are you sure you want to logout?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleCancelLogout}>Cancel</Button>
                        <Button onPress={handleConfirmLogout} color={theme.colors.error}>Logout</Button>
                    </Dialog.Actions>
                </Dialog>

            </ScreenWrapper>
        </Portal.Host>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoutButtonContainer: {
        padding: 16,
        marginTop: 20,
    },
    logoutButton: {
        // borderColor: theme.colors.error, // REMOVED from StyleSheet
        // Add any other static styles for the button here if needed
    },
    versionText: {
        textAlign: 'center',
        color: 'grey',
        fontSize: 12,
        marginTop: 10,
        marginBottom: 20,
    }
});

export default SettingsScreen; 