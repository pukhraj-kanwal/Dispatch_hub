import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  ActivityIndicator,
  Portal,
  Snackbar,
  HelperText,
  Card
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import DropdownPicker from '../../Components/DropdownPicker'; // Import the real component
import { submitReassignmentRequest, clearReassignmentError } from '../../store/slices/loadsSlice'; // Import the real thunk and clear action

const REASSIGNMENT_REASONS = [
  { label: 'Select reason', value: '' },
  { label: 'Equipment Failure', value: 'equipment_failure' },
  { label: 'Incorrect Load Information', value: 'incorrect_info' },
  { label: 'Driver Unavailable (Sick)', value: 'driver_sick' },
  { label: 'Driver Unavailable (Other)', value: 'driver_other' },
  { label: 'Logistical Issue', value: 'logistical_issue' },
  { label: 'Other', value: 'other' },
];

function LoadReassignmentRequestScreen() {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loadId } = route.params;

  // Select reassignment-specific state
  const { confirmed, unconfirmed, isRequestingReassignment, reassignmentError } = useSelector((state) => state.loads);
  const load = [...confirmed, ...unconfirmed].find(l => l.id === loadId);

  // Rename state variables for clarity
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [showOtherReasonInput, setShowOtherReasonInput] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason: '',
      otherReason: '',
      details: '',
    },
  });

  const selectedReason = watch('reason');

  // Use reassignmentError from Redux state for snackbar
  useEffect(() => {
    setShowOtherReasonInput(selectedReason === 'other');
  }, [selectedReason]);

  useEffect(() => {
    if (reassignmentError) {
        setSnackbarVisible(true);
    }
  }, [reassignmentError]);

  const onSubmit = async (data) => {
    const finalReason = data.reason === 'other' ? data.otherReason : REASSIGNMENT_REASONS.find(r => r.value === data.reason)?.label;
    // No need for try/catch here, thunk handles it
    const resultAction = await dispatch(submitReassignmentRequest({ loadId, reason: finalReason, details: data.details }));

    if (submitReassignmentRequest.fulfilled.match(resultAction)) {
        // Navigate back or show success message
        navigation.goBack();
    } else {
        // Error is set in Redux state, snackbar will show
    }
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    dispatch(clearReassignmentError()); // Dispatch clear error action
  };

  return (
    <Portal.Host>
    <ScreenWrapper scrollable style={styles.noPadding} contentContainerStyle={styles.content}>
      <AppHeader title="Load Reassignment Request" showBackButton />
       <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
            {/* Display Basic Load Info */} 
             {load && (
                <Card style={styles.loadInfoCard} mode="outlined">
                    <Card.Content>
                        <Text style={styles.loadId}>Load #{load.id}</Text>
                         <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
                            <Text style={styles.locationText}>{load.pickupLocation} → {load.dropoffLocation}</Text>
                        </View>
                         <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.primary} />
                            <Text style={styles.timeText}>Pickup: {load.pickupDate} • {load.pickupTime}</Text>
                        </View>
                    </Card.Content>
                </Card>
            )}

            {/* Form */} 
             <View style={styles.formContainer}>
                <Controller
                    control={control}
                    rules={{ required: 'Please select a reason' }}
                    render={({ field: { onChange, value } }) => (
                        <DropdownPicker
                            label="Reason for Reassignment *"
                            items={REASSIGNMENT_REASONS}
                            value={value}
                            onValueChange={onChange}
                            error={!!errors.reason}
                            helperText={errors.reason?.message}
                        />
                    )}
                    name="reason"
                />
                 {/* HelperText is now inside DropdownPicker */}

                 {showOtherReasonInput && (
                     <Controller
                        control={control}
                        rules={{ required: selectedReason === 'other' ? 'Please specify the reason' : false }}
                        render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Other Reason *"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.otherReason}
                        />
                        )}
                        name="otherReason"
                    />
                 )}
                 {errors.otherReason && <HelperText type="error" visible={!!errors.otherReason}>{errors.otherReason.message}</HelperText>}

                 <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="Additional Details"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />
                    )}
                    name="details"
                 />

                 <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.submitButton}
                    loading={isRequestingReassignment}
                    disabled={isRequestingReassignment}
                >
                    Submit Request
                </Button>

             </View>
        </ScrollView>
       </KeyboardAvoidingView>
         <Snackbar
            visible={snackbarVisible}
            onDismiss={handleSnackbarDismiss}
            duration={Snackbar.DURATION_SHORT}
         >
            {reassignmentError}
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
      marginBottom: 24,
  },
   loadId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
   detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    flexShrink: 1, // Allow text to wrap
  },
  timeText: {
     marginLeft: 8,
    fontSize: 14,
  },
  formContainer: {
    // Styles for the form area
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default LoadReassignmentRequestScreen; 