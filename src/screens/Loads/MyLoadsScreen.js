import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions, SectionList } from 'react-native';
import { Text, ActivityIndicator, useTheme, Portal, Snackbar, Button, Dialog, Paragraph } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs'; // Import dayjs for date manipulation
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import LoadCard from '../../Components/LoadCard';
import ConfirmLoadModal from '../../Components/ConfirmLoadModal';
import ConfirmAllLoadsModal from '../../Components/ConfirmAllLoadsModal';
import { fetchLoads, confirmLoad, rejectLoad, confirmAllUnconfirmedLoads, clearLoadsError } from '../../store/slices/loadsSlice';
import { NAV_ROUTES } from '../../constants/navigationRoutes';

// --- Date Formatting Helpers ---
const getSectionTitle = (dateStr) => {
    const date = dayjs(dateStr); // Assuming format is parseable by dayjs
    if (date.isToday()) return 'Today';
    if (date.isTomorrow()) return 'Tomorrow';
    return date.format('MMMM D'); // e.g., April 18
};

const renderSectionHeader = ({ section: { title, data } }) => {
    // Format title for display (e.g., "Today, April 16 (3)")
    const date = dayjs(data[0]?.pickupDate); // Get date from first item for formatting
    let displayTitle = title;
    if (title === 'Today' || title === 'Tomorrow') {
        displayTitle = `${title}, ${date.format('MMMM D')} (${data.length})`;
    } else if (title !== 'Active Load') {
         displayTitle = `${title} (${data.length})`;
    }

    return (
        <Text style={styles.sectionHeader}>{displayTitle}</Text>
    );
};

// --- Tab Bar --- (Keep as is)
const renderTabBar = props => {
    const theme = useTheme();
    return (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.surface }}
            labelStyle={styles.tabLabel}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.disabled}
            tabStyle={styles.tabStyle}
        />
    );
};

// --- Reusable LoadList Component (Modified for SectionList support) ---
const LoadList = ({ loadsData, isLoading, onRefresh, onConfirmPress, onRejectPress, onDetails, listKey, sectioned = false }) => {

     const renderItem = ({ item }) => (
        <LoadCard
            load={item}
            onConfirm={onConfirmPress} // Pass the press handler
            onReject={onRejectPress}
            onDetails={onDetails}
            showActions={listKey === 'unconfirmed'} // Show confirm/reject only for unconfirmed
        />
    );

    const keyExtractor = (item) => `${listKey}-${item.id}`;

     if (isLoading && loadsData.length === 0) {
        return <ActivityIndicator animating={true} size="large" style={styles.listLoadingIndicator} />;
    }

    if (!isLoading && loadsData.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No loads found in this category.</Text>
            </View>
        );
    }

    if (sectioned) {
        return (
             <SectionList
                sections={loadsData} // Expects [{ title: string, data: Load[] }]
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.listContentContainer}
                stickySectionHeadersEnabled={false} // Optional: make headers non-sticky
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                }
            />
        );
    } else {
         return (
            <FlatList
                data={loadsData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContentContainer}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                }
            />
        );
    }
}

// --- Main Screen Component ---
function MyLoadsScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { confirmed, unconfirmed, isLoading, isUpdating, error } = useSelector((state) => state.loads);

  const [tabIndex, setTabIndex] = useState(0); // Default to Confirmed tab
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // State for Single Confirm Modal
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedLoadToConfirm, setSelectedLoadToConfirm] = useState(null);

  // State for Confirm All Modal
  const [confirmAllModalVisible, setConfirmAllModalVisible] = useState(false);

  // State for Reject Dialog
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
  const [selectedLoadToReject, setSelectedLoadToReject] = useState(null);

  useEffect(() => {
    dispatch(fetchLoads());
  }, [dispatch]);

  useEffect(() => {
     if (error) {
        // If the error came from an update action (like invalid PIN), show it.
        // Otherwise, a fetch error might be better handled inline or with a retry button.
        setSnackbarMessage(error); // Display error in snackbar (e.g., Invalid PIN)
        setSnackbarVisible(true);
        // Potentially close modals if the error is related to their action
        setConfirmModalVisible(false);
        setRejectDialogVisible(false);
     }
  }, [error]);

  const onRefresh = useCallback(() => {
    dispatch(fetchLoads());
  }, [dispatch]);

  // --- Modal/Dialog Handlers ---
  const handleConfirmPress = (loadId) => {
      const load = unconfirmed.find(l => l.id === loadId);
      if (load) {
          setSelectedLoadToConfirm(load);
          setConfirmModalVisible(true);
      }
  };

  const handleModalConfirm = (pin) => {
      if (selectedLoadToConfirm) {
          dispatch(confirmLoad({ loadId: selectedLoadToConfirm.id, pin }))
              .unwrap()
              .then(() => {
                  setConfirmModalVisible(false);
                  setSelectedLoadToConfirm(null);
              })
              .catch((err) => {
                  // Error is handled by useEffect
                  console.log("Confirm load failed in modal:", err);
              });
      }
  };

   const handleModalDismiss = () => {
       setConfirmModalVisible(false);
       setSelectedLoadToConfirm(null);
   };

   // --- Handlers for Confirm All Modal ---
   const handleConfirmAllPress = () => {
       if (unconfirmed.length > 0) {
           setConfirmAllModalVisible(true); // Open the new modal
       } else {
           // Optional: Show snackbar if no loads to confirm?
           setSnackbarMessage("No unconfirmed loads to confirm.");
           setSnackbarVisible(true);
       }
   };

   const handleModalConfirmAllSubmit = (pin) => {
       dispatch(confirmAllUnconfirmedLoads({ pin })) // Dispatch with PIN
            .unwrap()
            .then(() => {
                setConfirmAllModalVisible(false); // Close on success
            })
            .catch((err) => {
                // Error is handled by useEffect
                 console.log("Confirm all loads failed in modal:", err);
            });
   };

   const handleConfirmAllModalDismiss = () => {
        setConfirmAllModalVisible(false);
   };
   // --- End Handlers for Confirm All Modal ---

  const handleRejectPress = (loadId) => {
      setSelectedLoadToReject(loadId);
      setRejectDialogVisible(true);
  };

  const handleConfirmReject = () => {
      if (selectedLoadToReject) {
          dispatch(rejectLoad(selectedLoadToReject))
            .unwrap()
            .then(() => {
                setRejectDialogVisible(false);
                setSelectedLoadToReject(null);
            })
            .catch((err) => {
                 console.log("Reject load failed in dialog:", err);
            });
      }
  };

  const handleCancelReject = () => {
      setRejectDialogVisible(false);
      setSelectedLoadToReject(null);
  };

  const handleDetails = (loadId) => {
    // Removed origin param - rely on default back behavior
    navigation.navigate(NAV_ROUTES.LOAD_DETAILS, { loadId });
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    dispatch(clearLoadsError());
  };

  // --- Data Processing (Remove Sorting) ---
  const processedConfirmedLoads = useMemo(() => {
    let activeLoad = null;
    const otherConfirmed = confirmed.filter(l => {
        if (!activeLoad && (l.status === 'In Progress' || l.status === 'Confirmed')) {
            activeLoad = l;
            return false;
        }
        return l.status !== 'Delivered';
    });

    // Remove sorting step
    // const sortedConfirmed = [...otherConfirmed].sort(sortFn);
    const dateSortedConfirmed = [...otherConfirmed].sort((a, b) => dayjs(a.pickupDate).valueOf() - dayjs(b.pickupDate).valueOf()); // Default sort by date

    // Group sorted loads by date
    const groups = dateSortedConfirmed.reduce((acc, load) => {
        const title = getSectionTitle(load.pickupDate);
        if (!acc[title]) {
            acc[title] = [];
        }
        acc[title].push(load);
        return acc;
    }, {});

    // Convert groups to SectionList format, preserving sort order within groups
    const sections = Object.entries(groups).map(([title, data]) => ({ title, data }));

    // Sort sections by date (Today -> Tomorrow -> Future Dates)
    sections.sort((a, b) => {
        if (a.title === 'Today') return -1;
        if (b.title === 'Today') return 1;
        if (a.title === 'Tomorrow') return -1;
        if (b.title === 'Tomorrow') return 1;
        return dayjs(a.data[0]?.pickupDate).valueOf() - dayjs(b.data[0]?.pickupDate).valueOf();
    });

    // Prepend Active Load section if it exists
    if (activeLoad) {
        sections.unshift({ title: 'Active Load', data: [activeLoad] });
    }

    return sections;
  }, [confirmed]); // Remove sortFn from dependencies

  const processedUnconfirmedLoads = useMemo(() => {
      // Remove sorting step - maybe default sort by date?
      // return [...unconfirmed].sort(sortFn);
      return [...unconfirmed].sort((a, b) => dayjs(a.pickupDate).valueOf() - dayjs(b.pickupDate).valueOf()); // Default sort by date
  }, [unconfirmed]); // Remove sortFn from dependencies

  const processedCompletedLoads = useMemo(() => {
      const completed = confirmed.filter(l => l.status === 'Delivered');
      // Remove sorting step - maybe default sort by date?
      // return [...completed].sort(sortFn);
      return [...completed].sort((a, b) => dayjs(a.pickupDate).valueOf() - dayjs(b.pickupDate).valueOf()); // Default sort by date
  }, [confirmed]); // Remove sortFn from dependencies

  const routes = useMemo(() => [
    // Renamed 'Active' to 'Confirmed'
    { key: 'confirmed', title: `Confirmed (${processedConfirmedLoads.flatMap(s => s.data).length})` },
    { key: 'unconfirmed', title: `Unconfirmed (${unconfirmed.length})` },
    { key: 'completed', title: `Completed (${processedCompletedLoads.length})` },
  ], [processedConfirmedLoads, unconfirmed.length, processedCompletedLoads.length]);

  const renderScene = SceneMap({
        confirmed: () => (
            <LoadList
                listKey="confirmed"
                loadsData={processedConfirmedLoads} // Use sectioned data
                isLoading={isLoading}
                onRefresh={onRefresh}
                onConfirmPress={handleConfirmPress} // Pass correct handler
                onRejectPress={handleRejectPress}
                onDetails={handleDetails}
                sectioned={true} // Enable SectionList rendering
            />
        ),
        unconfirmed: () => (
             <LoadList
                listKey="unconfirmed"
                loadsData={processedUnconfirmedLoads} // Use sorted flat list
                isLoading={isLoading}
                onRefresh={onRefresh}
                onConfirmPress={handleConfirmPress}
                onRejectPress={handleRejectPress}
                onDetails={handleDetails}
            />
        ),
        completed: () => (
            <LoadList
                listKey="completed"
                loadsData={processedCompletedLoads} // Use sorted flat list
                isLoading={isLoading}
                onRefresh={onRefresh}
                onDetails={handleDetails}
            />
        ),
  });

  const showConfirmAllButton = tabIndex === 1 && unconfirmed.length > 0;

  return (
    <Portal.Host>
    <ScreenWrapper style={styles.noPadding} contentContainerStyle={styles.fullHeightContent}>
      <AppHeader title="My Loads" />

       {/* Remove Sorting Controls */}
       {/*
       <View style={styles.sortingContainer}>
          <SegmentedButtons
            value={sortValue}
            onValueChange={setSortValue}
            // ... other props ...
          />
       </View>
       */}

      <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setTabIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={renderTabBar}
          lazy // Render scenes only when needed
      />

      {/* Floating Action Button for Confirm All */} 
      {showConfirmAllButton && (
          <Button
              icon="check-all"
              mode="contained"
              onPress={handleConfirmAllPress}
              style={styles.confirmAllButton}
              loading={isUpdating}
              disabled={isUpdating}
          >
              Confirm All Unconfirmed
          </Button>
      )}

      {/* Single Load Confirmation Modal */} 
      <ConfirmLoadModal
         visible={confirmModalVisible}
         onDismiss={handleModalDismiss}
         onConfirm={handleModalConfirm}
         loadDetails={selectedLoadToConfirm}
         isLoading={isUpdating}
       />

       {/* Confirm All Loads Modal */} 
       <ConfirmAllLoadsModal
          visible={confirmAllModalVisible}
          onDismiss={handleConfirmAllModalDismiss}
          onConfirm={handleModalConfirmAllSubmit}
          loadCount={unconfirmed.length}
          isLoading={isUpdating}
       />

      {/* Rejection Confirmation Dialog */} 
      <Dialog visible={rejectDialogVisible} onDismiss={handleCancelReject}>
            <Dialog.Title>Confirm Load Rejection</Dialog.Title>
            <Dialog.Content>
                 <Paragraph>Are you sure you want to reject Load #{selectedLoadToReject}?</Paragraph>
                 <Paragraph>This action cannot be undone.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={handleCancelReject} disabled={isUpdating}>Cancel</Button>
                <Button
                    onPress={handleConfirmReject}
                    textColor={theme.colors.error} // Use textColor for Dialog buttons
                    loading={isUpdating}
                    disabled={isUpdating}
                >
                    Yes, Reject
                </Button>
            </Dialog.Actions>
        </Dialog>

      <Snackbar
          visible={snackbarVisible}
          onDismiss={handleSnackbarDismiss}
          duration={Snackbar.DURATION_SHORT}
          style={{ backgroundColor: error ? theme.colors.error : theme.colors.onSurface }}
      >
          {snackbarMessage}
      </Snackbar>
    </ScreenWrapper>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  noPadding: { paddingTop: 0 },
  fullHeightContent: {
      flex: 1,
      paddingHorizontal: 0,
      paddingVertical: 0,
      backgroundColor: '#f0f0f0', // Add a light background for contrast
  },
  /* Remove sortingContainer style
  sortingContainer: {
    padding: 8,
    paddingTop: 12,
    backgroundColor: 'white',
  },
  segmentedButtons: {
      // height: 35,
  },
  */
  tabLabel: {
      fontWeight: 'bold',
      fontSize: 13,
      textTransform: 'capitalize',
  },
  tabStyle: {
      // width: 'auto',
  },
  listContentContainer: {
      padding: 16,
      paddingTop: 8, // Reduce top padding if headers/sorting have padding
  },
  listLoadingIndicator: {
      marginTop: 50,
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      marginTop: 30,
  },
  emptyText: {
      fontSize: 16,
      color: 'grey',
      textAlign: 'center',
  },
  confirmAllButton: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 16, // Match list padding
    backgroundColor: '#e9e9e9', // Lighter background for section headers
    color: '#555',
    marginTop: 8, // Add space between sections
    marginBottom: 4,
  },
});

export default MyLoadsScreen; 