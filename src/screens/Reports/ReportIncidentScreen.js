import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  ActivityIndicator,
  Portal,
  Snackbar,
  HelperText,
  ProgressBar,
  Card
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import DropdownPicker from '../../Components/DropdownPicker'; // Import real component
import ImageUpload from '../../Components/ImageUpload';
import { submitIncidentReport, clearIncidentError } from '../../store/slices/reportsSlice'; // Import from reportsSlice
import { NAV_ROUTES } from '../../constants/navigationRoutes'; // Import NAV_ROUTES

const INCIDENT_TYPES = [
  { label: 'Select incident type *', value: '' },
  { label: 'Accident', value: 'accident' },
  { label: 'Breakdown (Mechanical)', value: 'breakdown_mechanical' },
  { label: 'Breakdown (Electrical)', value: 'breakdown_electrical' },
  { label: 'Tire Issue', value: 'tire_issue' },
  { label: 'Cargo Damage', value: 'cargo_damage' },
  { label: 'Hazard', value: 'hazard' },
  { label: 'Other', value: 'other' },
];

const MAX_DESCRIPTION_LENGTH = 500;

function ReportIncidentScreen() {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // Extract loadId and origin from route params
  const { loadId, origin } = route.params || {};

  const { isLoading, error } = useSelector((state) => state.reports.incidentSubmission);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      incidentType: '',
      description: '',
    },
  });

  const descriptionValue = watch('description');

  useEffect(() => {
    if (error) {
        setSnackbarVisible(true);
    }
  }, [error]);

  // --- Custom Back Press Handler ---
  const handleBackPress = () => {
    if (origin === NAV_ROUTES.LOAD_DETAILS && loadId) {
      // Navigate explicitly back to the Load Details screen within Loads stack
      navigation.navigate(NAV_ROUTES.LOADS_STACK, {
          screen: NAV_ROUTES.LOAD_DETAILS,
          params: { loadId } // Pass loadId back if needed by LoadDetails
      });
    } else {
      // Default behavior: go back within the current stack (MoreStack)
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  const onSubmit = async (data) => {
    setShowSuccessCard(false);
    dispatch(clearIncidentError());

    const resultAction = await dispatch(submitIncidentReport({ 
        incidentType: data.incidentType, 
        description: data.description, 
        photos: uploadedFiles,
        loadId: loadId // Pass loadId if available
     }));

    if (submitIncidentReport.fulfilled.match(resultAction)) {
        setShowSuccessCard(true);
    }
  };

  if (showSuccessCard) {
    return (
         <ScreenWrapper style={styles.noPadding} contentContainerStyle={styles.successContainer}>
             <AppHeader title="Report Incident" showBackButton onBackPress={handleBackPress} />
             <Card style={styles.successCard}>
                <Card.Content style={styles.successContent}>
                    <MaterialCommunityIcons name="check-circle" size={60} color={theme.colors.success} />
                    <Text style={styles.successTitle}>Report Submitted</Text>
                    <Text style={styles.successMessage}>Your incident has been reported successfully.</Text>
                    <Button mode="contained" onPress={handleBackPress} style={styles.doneButton}>
                        Done
                    </Button>
                </Card.Content>
            </Card>
         </ScreenWrapper>
    );
  }

  return (
    <Portal.Host>
    <ScreenWrapper scrollable style={styles.noPadding} contentContainerStyle={styles.content}>
      <AppHeader title="Report Incident" showBackButton onBackPress={handleBackPress} />
       <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
             <View style={styles.formContainer}>
                 <Controller
                    control={control}
                    rules={{ required: 'Please select an incident type' }}
                    render={({ field: { onChange, value } }) => (
                        <DropdownPicker
                            label="Incident Type *"
                            items={INCIDENT_TYPES}
                            value={value}
                            onValueChange={onChange}
                            error={!!errors.incidentType}
                            helperText={errors.incidentType?.message}
                        />
                    )}
                    name="incidentType"
                />
                 <Controller
                    control={control}
                    rules={{ required: 'Description is required', maxLength: { value: MAX_DESCRIPTION_LENGTH, message: `Maximum ${MAX_DESCRIPTION_LENGTH} characters` } }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Description *"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            mode="outlined"
                            multiline
                            numberOfLines={5}
                            style={styles.input}
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            error={!!errors.description}
                        />
                    )}
                    name="description"
                 />
                <View style={styles.charCountContainer}>
                    <HelperText type="info" visible={!!errors.description && errors.description.type === 'maxLength'} style={{color: theme.colors.error}}>
                        {errors.description?.message}
                    </HelperText>
                     <Text style={styles.charCount}>
                       {descriptionValue.length}/{MAX_DESCRIPTION_LENGTH}
                    </Text>
                </View>
                 {errors.description && errors.description.type !== 'maxLength' && <HelperText type="error" visible={!!errors.description}>{errors.description.message}</HelperText>}

                 <ImageUpload maxFiles={5} onFilesChanged={setUploadedFiles} />

                 {/* Placeholder for potential location input/display if needed */}

                 <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.submitButton}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Submit Report
                </Button>
             </View>
        </ScrollView>
       </KeyboardAvoidingView>
         <Snackbar
            visible={snackbarVisible}
            onDismiss={() => {
                setSnackbarVisible(false);
                dispatch(clearIncidentError());
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
    marginBottom: 4,
  },
  charCountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  charCount: {
      fontSize: 12,
      color: 'grey',
      textAlign: 'right',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  // Success card styles
   successContainer: {
        flex: 1,
        paddingHorizontal: 0,
        paddingVertical: 0,
        justifyContent: 'flex-start', // Align card towards the top
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
     // Remove Dummy Dropdown styles
   /* dropdownContainer: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginBottom: 12,
        backgroundColor: '#f8f8f8'
   },
   dropdownLabel: {
       position: 'absolute',
       top: -10,
       left: 10,
       backgroundColor: '#f8f8f8',
       paddingHorizontal: 4,
       fontSize: 12,
       color: 'grey'
   },
   dropdownValue: {
       fontSize: 16,
   } */
});

export default ReportIncidentScreen; 