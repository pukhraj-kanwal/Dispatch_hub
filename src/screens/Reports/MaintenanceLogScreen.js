import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Portal,
  Snackbar,
  HelperText,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import DropdownPicker from '../../Components/DropdownPicker'; // Import real component
import ImageUpload from '../../Components/ImageUpload';
import { submitMaintenanceLog, clearMaintenanceError } from '../../store/slices/reportsSlice'; // Import from reportsSlice
import { NAV_ROUTES } from '../../constants/navigationRoutes'; // Import NAV_ROUTES

const MAINTENANCE_TYPES = [
  { label: 'Select maintenance type', value: '' },
  { label: 'Tire Issue', value: 'tire' },
  { label: 'Engine Problem', value: 'engine' },
  { label: 'Brake System', value: 'brake' },
  { label: 'Electrical System', value: 'electrical' },
  { label: 'Fluids Leak', value: 'fluids' },
  { label: 'Body/Trailer Damage', value: 'body_trailer' },
  { label: 'Other', value: 'other' },
];

function MaintenanceLogScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute(); // Get route object
  const dispatch = useDispatch();

  // Extract origin from route params
  const { origin } = route.params || {};

  const { isLoading, error } = useSelector((state) => state.reports.maintenanceSubmission);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maintenanceType: '',
      description: '',
    },
  });

  useEffect(() => {
    if (error) {
        setSnackbarVisible(true);
    }
  }, [error]);

  // --- Custom Back Press Handler ---
  const handleBackPress = () => {
    if (origin === NAV_ROUTES.DASHBOARD) {
      navigation.navigate(NAV_ROUTES.HOME_STACK, { screen: NAV_ROUTES.DASHBOARD });
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  const onSubmit = async (data) => {
    dispatch(clearMaintenanceError());
    const resultAction = await dispatch(submitMaintenanceLog({ 
        maintenanceType: data.maintenanceType, 
        description: data.description, 
        photos: uploadedFiles,
     }));

    if (submitMaintenanceLog.fulfilled.match(resultAction)) {
        // After successful submission, navigate back using the custom handler
        // This ensures we go back to Dashboard if that was the origin
        handleBackPress();
    }
  };

  return (
    <Portal.Host>
    <ScreenWrapper scrollable style={styles.noPadding} contentContainerStyle={styles.content}>
      <AppHeader title="Maintenance Log" showBackButton onBackPress={handleBackPress} />
       <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
             <View style={styles.formContainer}>
                 <Controller
                    control={control}
                    rules={{ required: 'Please select a maintenance type' }}
                    render={({ field: { onChange, value } }) => (
                        <DropdownPicker
                            label="Maintenance Type *"
                            items={MAINTENANCE_TYPES}
                            value={value}
                            onValueChange={onChange}
                            error={!!errors.maintenanceType}
                            helperText={errors.maintenanceType?.message}
                        />
                    )}
                    name="maintenanceType"
                />

                 <Controller
                    control={control}
                    rules={{ required: 'Description is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Issue Description *"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            mode="outlined"
                            multiline
                            numberOfLines={5}
                            style={styles.input}
                            error={!!errors.description}
                        />
                    )}
                    name="description"
                 />
                 {errors.description && <HelperText type="error" visible={!!errors.description}>{errors.description.message}</HelperText>}

                 <ImageUpload maxFiles={5} onFilesChanged={setUploadedFiles} />

                 <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.submitButton}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Submit Maintenance Log
                </Button>
             </View>
        </ScrollView>
       </KeyboardAvoidingView>
         <Snackbar
            visible={snackbarVisible}
            onDismiss={() => {
                setSnackbarVisible(false);
                dispatch(clearMaintenanceError());
            }}
            duration={Snackbar.DURATION_SHORT}
         >
            {error}
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

export default MaintenanceLogScreen; 