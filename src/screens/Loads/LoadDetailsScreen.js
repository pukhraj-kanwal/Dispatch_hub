import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import {
  Text,
  useTheme,
  ActivityIndicator,
  Divider,
  List,
  Chip,
  Button,
  Card,
  Portal,
  Snackbar,
  Paragraph,
  Dialog
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import LoadTimeline from '../../Components/LoadTimeline';
import ConfirmLoadModal from '../../Components/ConfirmLoadModal';
import { fetchLoadDetails, confirmPickup, confirmLoad, rejectLoad, clearLoadsError, clearLoadDetails, clearLoadDetailError } from '../../store/slices/loadsSlice';
import { NAV_ROUTES } from '../../constants/navigationRoutes';

// Define action types (could be moved to constants)
const LOAD_ACTIONS = {
  CONFIRM_PICKUP: 'CONFIRM_PICKUP',
  CONFIRM_DROPOFF: 'CONFIRM_DROPOFF',
  UPLOAD_BOL: 'UPLOAD_BOL',
  NONE: 'NONE', // No specific action currently required
};

function LoadDetailsScreen() {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loadId } = route.params;

  const { currentLoadDetails: load, isLoadingDetails, isUpdating, detailError, error: listError } = useSelector((state) => state.loads);
  const activeLoadId = useSelector((state) => state.dashboard.activeLoad?.id);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false);

  useEffect(() => {
    if (loadId) {
      dispatch(fetchLoadDetails(loadId));
    }
    return () => {
        dispatch(clearLoadDetails());
    }
  }, [dispatch, loadId]);

  useEffect(() => {
     const message = detailError || listError;
     if (message) {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
        setConfirmModalVisible(false);
        setRejectDialogVisible(false);
     }
  }, [detailError, listError]);

  // --- Action Handlers ---
  const handleConfirmPickup = () => {
      dispatch(confirmPickup(loadId));
  }

  const handleConfirmDropoff = () => {
      console.log('Dispatch Confirm Dropoff action for load:', loadId);
      // Placeholder: navigate to delivery completion screen which handles the API call
      navigation.navigate(NAV_ROUTES.DELIVERY_COMPLETION, { loadId });
      // Or dispatch a specific confirmDropoff thunk if it exists
      // dispatch(confirmDropoff(loadId));
  }

  const handleUploadBol = () => {
      console.log('Navigate to Upload BOL screen or flow for load:', loadId);
      // Example: Navigate to Documents screen filtered for BOL for this load
      navigation.navigate(NAV_ROUTES.MORE_STACK, {
         screen: NAV_ROUTES.DOCUMENTS,
         params: { filter: `load:${loadId}:bol`, origin: NAV_ROUTES.LOAD_DETAILS }
      });
      // Or potentially navigate to a dedicated upload screen
      // navigation.navigate(NAV_ROUTES.UPLOAD_DOCUMENT, { loadId, docType: 'BOL' });
  }

  const handleReportIncident = () => {
      console.log('Navigate to Report Incident');
      navigation.navigate(NAV_ROUTES.MORE_STACK, {
          screen: NAV_ROUTES.REPORT_INCIDENT,
          params: { loadId, origin: NAV_ROUTES.LOAD_DETAILS }
      });
  }

  const handleRequestReassignment = () => {
      console.log('Navigate to Request Reassignment');
       navigation.navigate(NAV_ROUTES.LOAD_REASSIGNMENT_REQUEST, { loadId });
  }

    const handleAccessDocuments = () => {
        console.log('Navigate to Documents for load:', loadId);
         navigation.navigate(NAV_ROUTES.MORE_STACK, {
             screen: NAV_ROUTES.DOCUMENTS,
             params: { filter: `load:${loadId}`, origin: NAV_ROUTES.LOAD_DETAILS }
        });
    }

  const handleConfirmPress = () => {
      if (load?.status === 'Unconfirmed') {
          setConfirmModalVisible(true);
      }
  };

  const handleModalConfirm = (pin) => {
      dispatch(confirmLoad({ loadId: load.id, pin }))
          .unwrap()
          .then(() => {
              setConfirmModalVisible(false);
              // Optional: Show success snackbar or rely on data refresh?
              // Maybe navigate back to MyLoads automatically?
              // navigation.goBack();
          })
          .catch((err) => { console.log("Confirm load failed:", err); });
  };

  const handleModalDismiss = () => {
       setConfirmModalVisible(false);
   };

  const handleRejectPress = () => {
      if (load?.status === 'Unconfirmed') {
          setRejectDialogVisible(true);
      }
  };

  const handleConfirmReject = () => {
      dispatch(rejectLoad(load.id))
          .unwrap()
          .then(() => {
              setRejectDialogVisible(false);
              if (navigation.canGoBack()) navigation.goBack();
          })
          .catch((err) => { console.log("Reject load failed:", err); });
  };

  const handleCancelReject = () => {
      setRejectDialogVisible(false);
  };

  const handleSnackbarDismiss = () => {
      setSnackbarVisible(false);
      dispatch(clearLoadDetailError());
    dispatch(clearLoadsError());
  };

  // --- Determine Current Primary Action ---
  const primaryAction = useMemo(() => {
      if (!load || load.id !== activeLoadId) {
           return { type: LOAD_ACTIONS.NONE };
      }

      switch (load.status) {
          case 'Confirmed':
              if (load.currentStage === 'Pickup') {
                  return {
                      type: LOAD_ACTIONS.CONFIRM_PICKUP,
                      label: 'Confirm Pickup',
                      icon: 'check',
                      onPress: handleConfirmPickup,
                  };
              }
              break;
          case 'In Progress':
              if (load.currentStage === 'Delivery') {
                   return {
                      type: LOAD_ACTIONS.CONFIRM_DROPOFF,
                      label: 'Confirm Dropoff & Upload POD',
                      icon: 'package-variant',
                      onPress: handleConfirmDropoff,
                  };
              }
              // Add other active load actions here (e.g., UPLOAD_BOL)
              break;
          default:
              break;
      }
      // Default to no action if no specific conditions met for the active load
      return { type: LOAD_ACTIONS.NONE };

  }, [load, activeLoadId]); // Dependencies: re-calculate if viewed load or active load changes

  if (isLoadingDetails) {
    return (
      <ScreenWrapper>
        <AppHeader title={`Load Details #${loadId}`} showBackButton />
        <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
      </ScreenWrapper>
    );
  }

  if (!load) {
    return (
      <ScreenWrapper>
        <AppHeader title={`Load Details #${loadId}`} showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{detailError || 'Failed to load details for this load.'}</Text>
          <Button onPress={() => dispatch(fetchLoadDetails(loadId))}>Retry</Button>
        </View>
      </ScreenWrapper>
    );
  }

  // Simplified view for Unconfirmed Loads
  if (load.status === 'Unconfirmed') {
      return (
          <Portal.Host>
              <ScreenWrapper scrollable style={styles.noPadding} contentContainerStyle={styles.content}>
                  <AppHeader title={`Load Details #${load.id}`} showBackButton />
                  <View style={styles.innerContent}>
                      {/* Header Info */} 
                      <View style={styles.section}>
                           <Chip
                              icon="information"
                              mode="outlined"
                              textStyle={{color: theme.colors.primary}}
                              style={[styles.statusChip, {borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '20'}]}
                            >
                              {load.status}
                          </Chip>
                          <Text style={styles.locationHeader}>{load.pickupLocation} → {load.dropoffLocation}</Text>
                          <View style={styles.timeRow}>
                              <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="grey" />
                              <Text style={styles.timeText}>Pickup: {load.pickupDate} • {load.pickupTime}</Text>
                          </View>
                          <View style={styles.timeRow}>
                               <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="grey" />
                              <Text style={styles.timeText}>Dropoff: {load.dropoffDate} • {load.dropoffTime}</Text>
                          </View>
                      </View>

                      {/* Confirm/Reject Buttons */} 
                      <View style={styles.actionsContainer_unconfirmed}>
                          <Button
                              mode="contained"
                              icon="check"
                              onPress={handleConfirmPress}
                              style={[styles.actionButton, { backgroundColor: theme.colors.success } ]}
                              loading={isUpdating}
                              disabled={isUpdating}
                          >
                              Confirm Load
                          </Button>
                          <Button
                              mode="contained"
                              icon="close"
                              onPress={handleRejectPress}
                              style={[styles.actionButton, { backgroundColor: theme.colors.error } ]}
                              loading={isUpdating}
                              disabled={isUpdating}
                          >
                              Reject Load
                          </Button>
                      </View>

                      <Divider style={styles.divider} />

                      {/* Load Information */} 
                      <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Load Information</Text>
                          <View style={styles.infoRow}>
                              <MaterialCommunityIcons name="package-variant-closed" size={20} color="grey" style={styles.infoIcon}/>
                              <Text style={styles.infoLabel}>Load Type:</Text>
                              <Text style={styles.infoValue}>{load.loadInfo.type}</Text>
                          </View>
                           <View style={styles.infoRow}>
                              <MaterialCommunityIcons name="weight-pound" size={20} color="grey" style={styles.infoIcon}/>
                              <Text style={styles.infoLabel}>Weight:</Text>
                              <Text style={styles.infoValue}>{load.loadInfo.weight}</Text>
                          </View>
                           <View style={styles.infoRow}>
                              <MaterialCommunityIcons name="ruler-square" size={20} color="grey" style={styles.infoIcon}/>
                              <Text style={styles.infoLabel}>Dimensions:</Text>
                              <Text style={styles.infoValue}>{load.loadInfo.dimensions}</Text>
                          </View>
                      </View>

                      <Divider style={styles.divider} />

                      {/* Special Instructions */} 
                      {load.specialInstructions && (
                          <Card style={styles.specialInstructionsCard} mode="outlined">
                               <Card.Title
                                  title="Special Instructions"
                                  titleStyle={{color: theme.colors.error}}
                                  left={(props) => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
                                />
                              <Card.Content>
                                  <Paragraph style={styles.specialInstructionsText}>{load.specialInstructions}</Paragraph>
                              </Card.Content>
                          </Card>
                      )}

                      {/* Recommendations Accordion */} 
                      <List.Section title="Load Recommendations" titleStyle={styles.sectionTitle}>
                          {load.recommendations.temperature && (
                               <List.Accordion
                                  title="Temperature Guidelines"
                                  id="temp"
                                  left={props => <List.Icon {...props} icon="thermometer" />}>
                                  <List.Item title={load.recommendations.temperature} titleNumberOfLines={5} titleStyle={styles.accordionItemText} />
                              </List.Accordion>
                          )}
                           {load.recommendations.route && (
                              <List.Accordion
                                  title="Route Information"
                                  id="route"
                                  left={props => <List.Icon {...props} icon="directions-fork" />}>
                                  <List.Item title={load.recommendations.route} titleNumberOfLines={5} titleStyle={styles.accordionItemText} />
                              </List.Accordion>
                           )}
                           {load.recommendations.weather && (
                              <List.Accordion
                                  title="Weather Advisory"
                                  id="weather"
                                  left={props => <List.Icon {...props} icon="weather-partly-cloudy" />}>
                                  <List.Item title={load.recommendations.weather} titleNumberOfLines={5} titleStyle={styles.accordionItemText} />
                              </List.Accordion>
                           )}
                      </List.Section>

                       <Divider style={styles.divider} />

                      {/* Dispatch Notes */} 
                      <View style={styles.section}>
                           <Text style={styles.sectionTitle}>Dispatch Notes</Text>
                           {load.dispatchNotes && load.dispatchNotes.length > 0 ? (
                               load.dispatchNotes.map((note, index) => {
                                  // Basic check for phone number
                                  const isPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(note);
                                  const phoneMatch = note.match(/(\d{3}[-.)\s]?\d{3}[-.\s]?\d{4})/);
                                  const handlePress = isPhone && phoneMatch ? () => Linking.openURL(`tel:${phoneMatch[0]}`) : undefined;
                                  return (
                                      <List.Item
                                          key={index}
                                          title={note}
                                          titleNumberOfLines={3}
                                          style={styles.dispatchNoteItem}
                                          titleStyle={isPhone ? styles.phoneLink : styles.dispatchNoteText}
                                          left={() => <Text style={styles.dispatchNoteBullet}>•</Text>}
                                          onPress={handlePress}
                                      />
                                  );
                               })
                           ) : (
                              <Text style={styles.noNotesText}>No dispatch notes available.</Text>
                           )}
                      </View>

                  </View>

                  {/* Modals/Dialogs */} 
                   <ConfirmLoadModal
                      visible={confirmModalVisible}
                      onDismiss={handleModalDismiss}
                      onConfirm={handleModalConfirm}
                      loadDetails={load}
                      isLoading={isUpdating}
                    />
                    <Dialog visible={rejectDialogVisible} onDismiss={handleCancelReject}>
                        <Dialog.Title>Confirm Load Rejection</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Are you sure you want to reject Load #{load.id}?</Paragraph>
                            <Paragraph>This action cannot be undone.</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={handleCancelReject} disabled={isUpdating}>Cancel</Button>
                            <Button onPress={handleConfirmReject} textColor={theme.colors.error} loading={isUpdating} disabled={isUpdating}>
                                Yes, Reject
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Snackbar visible={snackbarVisible} onDismiss={handleSnackbarDismiss} duration={Snackbar.DURATION_SHORT}>
                        {snackbarMessage}
                    </Snackbar>

              </ScreenWrapper>
          </Portal.Host>
      );
  }

  // Default view for Confirmed, In Progress, etc.
  return (
      <Portal.Host>
        <ScreenWrapper scrollable style={styles.noPadding} contentContainerStyle={styles.content}>
            <AppHeader
               title={`Load Details #${load.id}`}
               showBackButton
               actions={[{ icon: 'share-variant', onPress: () => console.log('Share pressed') }]} />

            <View style={styles.innerContent}>
                {/* Header Info */} 
                <View style={styles.section}>
                     <Chip
                        icon="information"
                        mode="outlined"
                        textStyle={{color: theme.colors.primary}}
                        style={[styles.statusChip, {borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '20'}]}
                      >
                        {load.status}
                    </Chip>
                    <Text style={styles.locationHeader}>{load.pickupLocation} → {load.dropoffLocation}</Text>
                    <View style={styles.timeRow}>
                        <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="grey" />
                        <Text style={styles.timeText}>Pickup: {load.pickupDate} • {load.pickupTime}</Text>
                    </View>
                    <View style={styles.timeRow}>
                         <MaterialCommunityIcons name="clock-time-four-outline" size={16} color="grey" />
                        <Text style={styles.timeText}>Dropoff: {load.dropoffDate} • {load.dropoffTime}</Text>
                    </View>
                </View>

                {/* Timeline */} 
                 <LoadTimeline
                    currentStage={load.currentStage}
                    pickupTime={load.pickupTimeActual}
                    transitTime={load.inTransitStartTime}
                    deliveryTime={load.deliveryTimeEstimate}
                 />

                 {/* --- Action Buttons Section (Conditional Based on Status) --- */}
                 <View style={styles.actionsContainer}>
                    {/* Logic for Confirmed status */}
                    {load.status === 'Confirmed' && (
                        <Button
                            mode="outlined" // Or contained? User specified only this button
                            onPress={handleRequestReassignment}
                            icon="swap-horizontal"
                            style={styles.actionButtonOutline} // Or primary actionButton style?
                        >
                            Request Re-assignment
                        </Button>
                    )}

                    {/* Logic for other statuses (e.g., In Progress) */}
                    {load.status !== 'Confirmed' && (
                        <>
                            {/* Dynamic Primary Action Button */}
                            {primaryAction.type !== LOAD_ACTIONS.NONE && (
                                <Button
                                    mode="contained"
                                    icon={primaryAction.icon}
                                    onPress={primaryAction.onPress}
                                    style={styles.actionButton}
                                    loading={isUpdating}
                                    disabled={isUpdating}
                                >
                                    {primaryAction.label}
                                </Button>
                            )}

                            {/* Access Documents Button */}
                            <Button
                                mode={primaryAction.type !== LOAD_ACTIONS.NONE ? "outlined" : "contained"}
                                onPress={handleAccessDocuments}
                                icon="file-document-outline"
                                style={styles.actionButton}
                                disabled={!load?.documentsAvailable}
                            >
                                Access Documents
                            </Button>

                            {/* Secondary Outlined Buttons */}
                            <Button mode="outlined" onPress={handleReportIncident} icon="alert-octagon" style={styles.actionButtonOutline} >
                                Report Incident/Issue
                            </Button>
                             <Button mode="outlined" onPress={handleRequestReassignment} icon="swap-horizontal" style={styles.actionButtonOutline} >
                                Request Re-assignment
                            </Button>
                        </>
                    )}
                 </View>
                 {/* --- End Action Buttons Section --- */}

                <Divider style={styles.divider} />

                {/* Load Information */} 
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Load Information</Text>
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="package-variant-closed" size={20} color="grey" style={styles.infoIcon}/>
                        <Text style={styles.infoLabel}>Load Type:</Text>
                        <Text style={styles.infoValue}>{load.loadInfo.type}</Text>
                    </View>
                     <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="weight-pound" size={20} color="grey" style={styles.infoIcon}/>
                        <Text style={styles.infoLabel}>Weight:</Text>
                        <Text style={styles.infoValue}>{load.loadInfo.weight}</Text>
                    </View>
                     <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="ruler-square" size={20} color="grey" style={styles.infoIcon}/>
                        <Text style={styles.infoLabel}>Dimensions:</Text>
                        <Text style={styles.infoValue}>{load.loadInfo.dimensions}</Text>
                    </View>
                </View>

                <Divider style={styles.divider} />

                {/* Special Instructions */} 
                {load.specialInstructions && (
                    <Card style={styles.specialInstructionsCard} mode="outlined">
                         <Card.Title
                            title="Special Instructions"
                            titleStyle={{color: theme.colors.error}}
                            left={(props) => <List.Icon {...props} icon="alert-circle" color={theme.colors.error} />}
                          />
                        <Card.Content>
                            <Paragraph style={styles.specialInstructionsText}>{load.specialInstructions}</Paragraph>
                        </Card.Content>
                    </Card>
                )}

                {/* Recommendations Accordion */} 
                <List.Section title="Load Recommendations" titleStyle={styles.sectionTitle}>
                    {load.recommendations.temperature && (
                         <List.Accordion
                            title="Temperature Guidelines"
                            id="temp"
                            left={props => <List.Icon {...props} icon="thermometer" />}>
                            <List.Item title={load.recommendations.temperature} titleNumberOfLines={5} titleStyle={styles.accordionItemText} />
                        </List.Accordion>
                    )}
                     {load.recommendations.route && (
                        <List.Accordion
                            title="Route Information"
                            id="route"
                            left={props => <List.Icon {...props} icon="directions-fork" />}>
                            <List.Item title={load.recommendations.route} titleNumberOfLines={5} titleStyle={styles.accordionItemText} />
                        </List.Accordion>
                     )}
                     {load.recommendations.weather && (
                        <List.Accordion
                            title="Weather Advisory"
                            id="weather"
                            left={props => <List.Icon {...props} icon="weather-partly-cloudy" />}>
                            <List.Item title={load.recommendations.weather} titleNumberOfLines={5} titleStyle={styles.accordionItemText} />
                        </List.Accordion>
                     )}
                </List.Section>

                 <Divider style={styles.divider} />

                {/* Dispatch Notes */} 
                <View style={styles.section}>
                     <Text style={styles.sectionTitle}>Dispatch Notes</Text>
                     {load.dispatchNotes && load.dispatchNotes.length > 0 ? (
                         load.dispatchNotes.map((note, index) => {
                            // Basic check for phone number
                            const isPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(note);
                            const phoneMatch = note.match(/(\d{3}[-.)\s]?\d{3}[-.\s]?\d{4})/);
                            const handlePress = isPhone && phoneMatch ? () => Linking.openURL(`tel:${phoneMatch[0]}`) : undefined;
                            return (
                                <List.Item
                                    key={index}
                                    title={note}
                                    titleNumberOfLines={3}
                                    style={styles.dispatchNoteItem}
                                    titleStyle={isPhone ? styles.phoneLink : styles.dispatchNoteText}
                                    left={() => <Text style={styles.dispatchNoteBullet}>•</Text>}
                                    onPress={handlePress}
                                />
                            );
                         })
                     ) : (
                        <Text style={styles.noNotesText}>No dispatch notes available.</Text>
                     )}
                 </View>

            </View>

             <Snackbar
                visible={snackbarVisible}
                onDismiss={handleSnackbarDismiss}
                duration={Snackbar.DURATION_SHORT}
             >
                {snackbarMessage}
             </Snackbar>
        </ScreenWrapper>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  noPadding: {
      paddingTop: 0,
  },
  content: {
    // paddingHorizontal: 0, // Let ScrollView handle padding
    paddingVertical: 0,
  },
  innerContent: {
      padding: 16,
  },
  loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 16,
        color: 'grey'
    },
  section: {
      marginBottom: 16,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
  },
   statusChip: {
      alignSelf: 'flex-start',
      marginBottom: 12,
   },
   locationHeader: {
       fontSize: 18,
       fontWeight: 'bold',
       marginBottom: 8,
   },
   timeRow: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 4,
   },
   timeText: {
       marginLeft: 8,
       color: 'grey',
   },
   divider: {
      marginVertical: 16,
  },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
  },
  infoIcon: {
      marginRight: 12,
  },
  infoLabel: {
      fontWeight: 'bold',
      width: 90, // Fixed width for alignment
  },
  infoValue: {
      flex: 1,
  },
  specialInstructionsCard: {
      marginBottom: 16,
  },
   specialInstructionsText: {
      // color: theme.colors.error,
   },
   accordionItemText: {
       fontSize: 14,
       color: '#333',
       paddingLeft: 0, // Align with accordion title
   },
   dispatchNoteItem: {
       paddingLeft: 0,
       paddingVertical: 4,
   },
   dispatchNoteBullet: {
       marginRight: 8,
       fontSize: 16,
       lineHeight: 20, // Align bullet with text
   },
   dispatchNoteText: {
       fontSize: 14,
   },
    phoneLink: {
        fontSize: 14,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    noNotesText: {
        color: 'grey',
        fontStyle: 'italic',
    },
    actionsContainer: {
        marginTop: 16, // Add space after timeline
        marginBottom: 16, // Add space before divider
    },
    actionButton: {
        marginBottom: 12,
        paddingVertical: 6,
    },
     actionButtonOutline: {
        marginBottom: 12,
        paddingVertical: 6,
        // Ensure outline buttons use theme colors correctly if needed
        // borderColor: theme.colors.primary,
        // color: theme.colors.primary, // for text
    },
    actionsContainer_unconfirmed: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
        marginBottom: 16,
    },
    actionButton: {
        marginBottom: 12,
        paddingVertical: 6,
        flex: 1,
        marginHorizontal: 8,
    }
});

export default LoadDetailsScreen; 