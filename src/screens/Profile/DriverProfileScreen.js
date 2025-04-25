import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Avatar,
  useTheme,
  ActivityIndicator,
  Snackbar,
  Portal,
  HelperText,
  Divider,
  Chip
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker again here

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import { updateProfile, resetProfileUpdateError, updateProfilePicture } from '../../store/slices/authSlice';

function DriverProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, isUpdatingProfile, profileUpdateError } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
      defaultValues: {
          name: user?.name || '',
          email: user?.email || '',
          driverId: user?.driverId || '',
          licenseNumber: user?.licenseNumber || '',
          licenseExpiry: user?.licenseExpiry || '',
          emergencyContactName: user?.emergencyContact?.name || '',
          emergencyContactPhone: user?.emergencyContact?.phone || '',
          emergencyContactRelationship: user?.emergencyContact?.relationship || '',
      }
  });

  // Reset form when user data changes (e.g., after successful update)
  useEffect(() => {
      if (user) {
          reset({
            name: user.name,
            email: user.email,
            driverId: user.driverId,
            licenseNumber: user.licenseNumber,
            licenseExpiry: user.licenseExpiry,
            emergencyContactName: user.emergencyContact?.name,
            emergencyContactPhone: user.emergencyContact?.phone,
            emergencyContactRelationship: user.emergencyContact?.relationship,
          });
      }
  }, [user, reset]);

   // Show errors in snackbar
   useEffect(() => {
    if (profileUpdateError) {
        setSnackbarMessage(profileUpdateError);
        setSnackbarVisible(true);
        // Reset error in redux state after showing
        dispatch(resetProfileUpdateError());
    }
  }, [profileUpdateError, dispatch]);

   // Show success message in snackbar
   useEffect(() => {
       // Check if we just finished updating and there was no error
       if (!isUpdatingProfile && isDirty && !profileUpdateError && !snackbarVisible) {
          // Only show if the snackbar isn't already showing an error
          setSnackbarMessage('Profile updated successfully');
          setSnackbarVisible(true);
          setIsEditing(false); // Exit edit mode on success
       }
   }, [isUpdatingProfile, isDirty, profileUpdateError, snackbarVisible]);

  const handleSave = (data) => {
    const updatedData = {
        name: data.name,
        email: data.email, // Assuming email can be updated, adjust if not
        driverId: data.driverId, // Assuming ID cannot be updated, keep original?
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry,
        emergencyContact: {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone,
            relationship: data.emergencyContactRelationship,
        },
        // Include profilePictureUri if managed separately or here
        profilePictureUri: user?.profilePictureUri
    };
    dispatch(updateProfile({ userId: user.id, updatedData }));
  };

  const handleChoosePhoto = async () => {
     // Request permissions first (similar to ImageUpload component)
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Square aspect ratio for profile pic
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const imageUri = result.assets[0].uri;
            // Dispatch action to upload/update picture
            dispatch(updateProfilePicture({ userId: user.id, imageUri }));
        }
  };

   // Check license validity (simple date check)
   const isLicenseValid = user?.licenseExpiry ? new Date(user.licenseExpiry) >= new Date() : false;

  return (
    <Portal.Host>
    <ScreenWrapper scrollable style={styles.noPadding} contentContainerStyle={styles.content}>
      <AppHeader title="Driver Profile" showBackButton actions={!isEditing ? [{ icon: 'pencil', onPress: () => setIsEditing(true) }] : []} />
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.profileHeader}>
                    <TouchableOpacity onPress={handleChoosePhoto} disabled={!isEditing}>
                        <Avatar.Image
                            size={100}
                            source={user?.profilePictureUri ? { uri: user.profilePictureUri } : require('../../assets/images/default_avatar.png')} // Add a default avatar image
                        />
                        {isEditing && (
                            <View style={styles.cameraIconOverlay}>
                                <Avatar.Icon size={30} icon="camera" style={styles.cameraIcon} />
                            </View>
                        )}
                    </TouchableOpacity>
                    {!isEditing && <Text style={styles.name}>{user?.name}</Text>}
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <Controller
                        control={control}
                        rules={{ required: 'Full Name is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput label="Full Name" value={value} onChangeText={onChange} onBlur={onBlur} mode="outlined" style={styles.input} error={!!errors.name} disabled={!isEditing} />
                        )}
                        name="name"
                    />
                    {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}

                    <Controller control={control} name="driverId" render={({ field: { value } }) => (<TextInput label="Driver ID" value={value} mode="outlined" style={styles.input} disabled />)} />
                    <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (<TextInput label="Email" value={value} onChangeText={onChange} onBlur={onBlur} mode="outlined" style={styles.input} keyboardType="email-address" disabled={!isEditing} />)} />

                     <Divider style={styles.divider} />

                     <Text style={styles.sectionTitle}>License Information</Text>
                      <Controller control={control} name="licenseNumber" render={({ field: { onChange, onBlur, value } }) => (<TextInput label="License Number" value={value} onChangeText={onChange} onBlur={onBlur} mode="outlined" style={styles.input} disabled={!isEditing} />)} />
                      <Controller control={control} name="licenseExpiry" render={({ field: { onChange, onBlur, value } }) => (<TextInput label="License Expiry (YYYY-MM-DD)" value={value} onChangeText={onChange} onBlur={onBlur} mode="outlined" style={styles.input} disabled={!isEditing} />)} />
                       <Chip
                            icon={isLicenseValid ? "check-circle" : "alert-circle"}
                            style={[styles.chip, { backgroundColor: isLicenseValid ? theme.colors.success + '20' : theme.colors.error + '20' }]}
                            textStyle={{ color: isLicenseValid ? theme.colors.success : theme.colors.error }}
                        >
                           {isLicenseValid ? 'Valid' : 'Expired'}
                        </Chip>

                      <Divider style={styles.divider} />

                     <Text style={styles.sectionTitle}>Emergency Contact</Text>
                     <Controller control={control} name="emergencyContactName" render={({ field: { onChange, onBlur, value } }) => (<TextInput label="Contact Name" value={value} onChangeText={onChange} onBlur={onBlur} mode="outlined" style={styles.input} disabled={!isEditing} />)} />
                      <Controller
                        control={control}
                        rules={{ pattern: { value: /^\+?[1]?[-.\s]?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/, message: 'Invalid phone number format' } }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput label="Phone Number" value={value} onChangeText={onChange} onBlur={onBlur} mode="outlined" style={styles.input} keyboardType="phone-pad" error={!!errors.emergencyContactPhone} disabled={!isEditing} />
                        )}
                        name="emergencyContactPhone"
                       />
                     {errors.emergencyContactPhone && <HelperText type="error">{errors.emergencyContactPhone.message}</HelperText>}
                     <Controller control={control} name="emergencyContactRelationship" render={({ field: { onChange, onBlur, value } }) => (<TextInput label="Relationship" value={value} onChangeText={onChange} onBlur={onBlur} mode="outlined" style={styles.input} disabled={!isEditing} />)} />

                </View>

                {isEditing && (
                    <View style={styles.buttonContainer}>
                        <Button mode="outlined" onPress={() => { setIsEditing(false); reset(); }} style={styles.button}>Cancel</Button>
                        <Button mode="contained" onPress={handleSubmit(handleSave)} style={styles.button} loading={isUpdatingProfile} disabled={isUpdatingProfile || !isDirty}>Save Changes</Button>
                    </View>
                )}
            </ScrollView>
         </KeyboardAvoidingView>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={Snackbar.DURATION_SHORT}
          >
            {snackbarMessage}
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cameraIconOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 15,
      padding: 2,
  },
  cameraIcon: {
      backgroundColor: 'transparent'
  },
  name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 12,
  },
  formContainer: {
      // Container for form sections
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop: 8,
  },
  input: {
      marginBottom: 12,
  },
  divider: {
      marginVertical: 16,
  },
  chip: {
      alignSelf: 'flex-start',
      marginTop: -4, // Adjust position relative to input
      marginBottom: 12,
  },
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 24,
      marginBottom: 16,
  },
  button: {
      flex: 1,
      marginHorizontal: 8,
  }
});

export default DriverProfileScreen; 