import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Button, Text, useTheme, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

function ImageUpload({ maxFiles = 5, onFilesChanged, initialFiles = [] }) {
    const theme = useTheme();
    const [files, setFiles] = useState(initialFiles);
    const [permissionError, setPermissionError] = useState(null);

    const requestPermissions = async () => {
        if (Platform.OS !== 'web') {
            const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraRollStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
                setPermissionError('Camera and Media Library permissions are required to upload photos.');
                return false;
            }
        }
        setPermissionError(null);
        return true;
    };

    const handlePickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true, // Optional
            // aspect: [4, 3], // Optional
            quality: 0.8, // Reduce quality slightly
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const newUri = result.assets[0].uri;
             // Basic size check (example: 5MB limit)
            // TODO: Implement more robust file size check if needed
            // const fileSize = result.assets[0].fileSize;
            // if (fileSize > 5 * 1024 * 1024) {
            //     alert('File size exceeds 5MB limit.');
            //     return;
            // }

            if (files.length < maxFiles) {
                const updatedFiles = [...files, newUri];
                setFiles(updatedFiles);
                onFilesChanged(updatedFiles);
            }
        }
    };

     const handleTakePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        });

         if (!result.canceled && result.assets && result.assets.length > 0) {
            const newUri = result.assets[0].uri;
             if (files.length < maxFiles) {
                const updatedFiles = [...files, newUri];
                setFiles(updatedFiles);
                onFilesChanged(updatedFiles);
            }
        }
    };

    const handleRemoveImage = (uriToRemove) => {
        const updatedFiles = files.filter(uri => uri !== uriToRemove);
        setFiles(updatedFiles);
        onFilesChanged(updatedFiles);
    };

    return (
        <View style={styles.container}>
            <Card style={styles.uploadCard} mode="outlined">
                <TouchableOpacity onPress={handlePickImage} style={styles.uploadArea}>
                     <MaterialCommunityIcons name="camera" size={40} color={theme.colors.primary} />
                     <Text style={styles.uploadText}>Tap to upload photos</Text>
                     <Text style={styles.uploadSubtext}>Maximum {maxFiles} photos</Text>
                </TouchableOpacity>
                 {/* Optionally add a dedicated Take Photo button */} 
                 {/* <Button icon="camera" mode="outlined" onPress={handleTakePhoto} style={styles.button}>Take Photo</Button> */} 
            </Card>

            {permissionError && <Text style={styles.errorText}>{permissionError}</Text>}

            {files.length > 0 && (
                 <View style={styles.previewContainer}>
                    {files.map((uri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                             <Image source={{ uri }} style={styles.previewImage} />
                             <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(uri)}>
                                 <MaterialCommunityIcons name="close-circle" size={24} color={theme.colors.error} style={styles.removeIcon} />
                             </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    uploadCard: {
        borderStyle: 'dashed',
        borderColor: 'grey',
        backgroundColor: '#f8f8f8',
        marginBottom: 8,
    },
    uploadArea: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        minHeight: 120,
    },
    uploadText: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
     uploadSubtext: {
        marginTop: 4,
        fontSize: 12,
        color: 'grey',
    },
    button: {
        margin: 10,
    },
    previewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageWrapper: {
        position: 'relative',
        margin: 4,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    removeButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    removeIcon: {
        // Optional: add slight shadow or background
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
    }
});

export default ImageUpload; 