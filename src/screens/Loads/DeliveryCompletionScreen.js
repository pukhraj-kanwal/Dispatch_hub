import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, Portal, Snackbar, HelperText, Card, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import ImageUpload from '../../Components/ImageUpload';
import { completeDelivery, clearLoadDetailError } from '../../store/slices/loadsSlice'; // Import real thunk and clear action

function DeliveryCompletionScreen() {
    const theme = useTheme();
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { loadId } = route.params;

    // Fetch minimal load details if needed to display info
    const { confirmed, unconfirmed, isUpdating, detailError } = useSelector((state) => state.loads);
    const load = [...confirmed, ...unconfirmed].find(l => l.id === loadId);

    // Placeholder state for submission
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [podError, setPodError] = useState(null); // State for POD validation error

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            deliveryNotes: '',
        },
    });

    // Use detailError from Redux state for snackbar
    useEffect(() => {
        if (detailError) {
            setSnackbarVisible(true);
        }
    }, [detailError]);

    const validatePOD = () => {
        if (uploadedFiles.length === 0) {
            setPodError('At least one Proof of Delivery photo is required.');
            return false;
        }
        setPodError(null); // Clear error if valid
        return true;
    };

    const onSubmit = async (data) => {
        if (!validatePOD()) { // Validate photos before submitting
            return;
        }
        setShowSuccessCard(false);
        const resultAction = await dispatch(completeDelivery({
            loadId,
            notes: data.deliveryNotes,
            photos: uploadedFiles,
        }));
        if (completeDelivery.fulfilled.match(resultAction)) {
            setShowSuccessCard(true);
        }
    };

    const handleSnackbarDismiss = () => {
        setSnackbarVisible(false);
        dispatch(clearLoadDetailError()); // Dispatch clear error action
    };

    if (showSuccessCard) {
        return (
            <ScreenWrapper style={styles.noPadding} contentContainerStyle={styles.successContainer}>
                <AppHeader title="Delivery Complete" showBackButton={false} />
                <Card style={styles.successCard}>
                    <Card.Content style={styles.successContent}>
                        <MaterialCommunityIcons name="check-circle" size={60} color={theme.colors.success} />
                        <Text style={styles.successTitle}>Delivery Completed</Text>
                        <Text style={styles.successMessage}>Load #{loadId} marked as delivered successfully.</Text>
                        <Button mode="contained" onPress={() => navigation.popToTop()} style={styles.doneButton}>
                            Back to Loads
                        </Button>
                    </Card.Content>
                </Card>
            </ScreenWrapper>
        );
    }

    return (
        <Portal.Host>
            <ScreenWrapper scrollable style={styles.noPadding} contentContainerStyle={styles.content}>
                <AppHeader title={`Complete Delivery #${loadId}`} showBackButton />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                        {/* Optional: Display basic load info */} 
                         {load && (
                            <Card style={styles.loadInfoCard} mode="outlined">
                                <Card.Content>
                                    <Text style={styles.loadIdText}>Load #{load.id}</Text>
                                     <View style={styles.detailRow}>
                                        <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
                                        <Text style={styles.locationText}>{load.pickupLocation} → {load.dropoffLocation}</Text>
                                    </View>
                                </Card.Content>
                            </Card>
                        )}

                        <View style={styles.formContainer}>
                            <Text style={styles.sectionTitle}>Proof of Delivery (POD)</Text>
                            <ImageUpload
                                maxFiles={5}
                                onFilesChanged={(files) => {
                                    setUploadedFiles(files);
                                    if (podError) validatePOD(); // Re-validate if there was an error
                                }}
                                initialFiles={[]}
                            />
                            {/* Display POD validation error */} 
                            {podError && <HelperText type="error" visible={!!podError} style={styles.podErrorText}>{podError}</HelperText>}

                            <Text style={styles.sectionTitle}>Delivery Notes</Text>
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="Notes (Optional)"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        mode="outlined"
                                        multiline
                                        numberOfLines={4}
                                        style={styles.input}
                                    />
                                )}
                                name="deliveryNotes"
                            />

                            {/* TODO: Add Signature Pad component if required */} 

                            <Button
                                mode="contained"
                                onPress={handleSubmit(onSubmit)}
                                style={styles.submitButton}
                                loading={isUpdating} // Use Redux loading state
                                disabled={isUpdating} // Use Redux loading state
                                icon="check-circle-outline"
                            >
                                Confirm Delivery Completion
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={handleSnackbarDismiss} // Use handler
                    duration={Snackbar.DURATION_SHORT}
                >
                    {detailError /* Show Redux error */} 
                </Snackbar>
            </ScreenWrapper>
        </Portal.Host>
    );
}

const styles = StyleSheet.create({
    noPadding: { paddingTop: 0 },
    content: {
        flex: 1,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    loadInfoCard: {
        marginBottom: 16,
    },
    loadIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    locationText: {
        marginLeft: 8,
        fontSize: 14,
        color: 'grey',
        flexShrink: 1,
    },
    formContainer: {
        // Styles for the form area
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    input: {
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 20,
        paddingVertical: 8,
    },
    // Success card styles (similar to ReportIncidentScreen)
    successContainer: {
        flex: 1,
        paddingHorizontal: 0,
        paddingVertical: 0,
        justifyContent: 'flex-start',
    },
    successCard: {
        margin: 16,
        marginTop: 32,
    },
    successContent: {
        alignItems: 'center',
        padding: 20,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        color: 'grey',
    },
    doneButton: {
        paddingHorizontal: 20,
        paddingVertical: 6,
    },
    podErrorText: {
        marginBottom: 12, // Add margin below error
    },
});

export default DeliveryCompletionScreen; 