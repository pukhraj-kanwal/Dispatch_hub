import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, useTheme, Portal, Snackbar, Button, Searchbar, List, Chip, Divider, Dialog, Paragraph } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import { fetchDocuments, clearDocumentsError } from '../../store/slices/documentsSlice'; // Import the thunk and clear action
import { NAV_ROUTES } from '../../constants/navigationRoutes'; // Ensure NAV_ROUTES is imported
// TODO: Import document upload/delete thunks when created

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
            scrollEnabled={false} // Tabs likely won't need scrolling
        />
    );
};

const DocumentItem = ({ item, onDownload, onView, onDelete }) => {
    const theme = useTheme();
    const isPending = item.status === 'Pending' || !item.url;
    const isUploaded = item.status === 'Uploaded' || !!item.url;
    const isRequired = item.status === 'Required';

    let statusColor = theme.colors.disabled;
    let statusIcon = 'help-circle-outline';

    if (isUploaded) {
        statusColor = theme.colors.success;
        statusIcon = 'check-circle-outline';
    } else if (isPending) {
        statusColor = theme.colors.warning;
        statusIcon = 'clock-outline';
    } else if (isRequired) {
        statusColor = theme.colors.error;
        statusIcon = 'alert-circle-outline';
    }

    return (
        <List.Item
            title={item.name}
            description={`Date: ${item.date} • Status: ${item.status}`}
            descriptionStyle={styles.itemDescription}
            titleStyle={styles.itemTitle}
            left={props => <List.Icon {...props} icon="file-document-outline" color={theme.colors.primary} />}
            right={props => (
                <View style={styles.itemActions}>
                     <Chip
                        icon={statusIcon}
                        textStyle={{ fontSize: 10, color: statusColor }}
                        style={[styles.statusChip, { backgroundColor: statusColor + '20' }]} >
                        {item.status}
                    </Chip>
                    {isUploaded && (
                         <TouchableOpacity onPress={() => onView(item)} style={styles.actionIcon}>
                             <MaterialCommunityIcons name="eye-outline" size={24} color={theme.colors.primary} />
                         </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => onDelete(item)} style={styles.actionIcon}>
                        <MaterialCommunityIcons name="delete-outline" size={24} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>
            )}
            style={styles.listItem}
            onPress={isUploaded ? () => onView(item) : undefined}
        />
    );
}

const DocumentList = ({ documents, isLoading, onRefresh, onView, onDelete, listKey, searchTerm }) => {

    const filteredDocs = useMemo(() => {
        if (!searchTerm) return documents;
        return documents.filter(doc =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [documents, searchTerm]);

    const renderItem = ({ item }) => (
        <DocumentItem
            item={item}
            onView={onView}
            onDelete={onDelete}
        />
    );

    const keyExtractor = (item) => `${listKey}-${item.id}`;

     if (isLoading && documents.length === 0) {
        return <ActivityIndicator animating={true} size="large" style={styles.listLoadingIndicator} />;
    }

    if (!isLoading && filteredDocs.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{searchTerm ? 'No documents match your search.' : 'No documents found in this category.'}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={filteredDocs}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => <Divider style={styles.listDivider} />}
            contentContainerStyle={styles.listContentContainer}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
        />
    );
}

function DocumentsScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { filter, origin } = route.params || {};

  const { compliance, driver, shipper, isLoading, error } = useSelector((state) => state.documents);

  const [index, setIndex] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedDocToDelete, setSelectedDocToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchDocuments());
     // TODO: Apply initial filter if passed via route.params
     if (filter) {
         console.log('Apply document filter:', filter);
         // Example: filter could be 'load:DR-1234' or 'category:compliance'
         // Apply filtering logic here, potentially setting initial search or tab
     }
  }, [dispatch, filter]);

  useEffect(() => {
     if (error) {
        setSnackbarMessage(error);
        setSnackbarVisible(true);
     }
  }, [error]);

  const onRefresh = () => {
    dispatch(fetchDocuments());
  };

  const handleViewDocument = (doc) => {
    console.log('View document:', doc.name, doc.url);
    if (doc.url) {
         // TODO: Implement actual document viewing (PDF, Image)
         // For now, just show alert with mock URL
         alert(`Simulating view of: ${doc.name} (URL: ${doc.url})`);
    } else {
         alert('This document does not have a file associated with it.');
    }
  };

   const handleDeletePress = (doc) => {
        setSelectedDocToDelete(doc);
        setDeleteDialogVisible(true);
    };

    const handleConfirmDelete = () => {
        if (selectedDocToDelete) {
            console.log('Confirm delete document:', selectedDocToDelete.name);
            // TODO: Dispatch delete document thunk here
            // dispatch(deleteDocument(selectedDocToDelete.id));
            setSnackbarMessage(`Document '${selectedDocToDelete.name}' deleted (simulated).`); // Placeholder feedback
            setSnackbarVisible(true);
        }
        setDeleteDialogVisible(false);
        setSelectedDocToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogVisible(false);
        setSelectedDocToDelete(null);
    };

   const handleUploadDocument = () => {
        console.log('Navigate to Upload Document Screen');
        // TODO: Implement navigation to an UploadDocumentScreen or show a modal/action sheet
        alert('Document upload feature coming soon!');
  };

  const handleSnackbarDismiss = () => {
    setSnackbarVisible(false);
    dispatch(clearDocumentsError()); // Dispatch clear error action
  };

  const routes = useMemo(() => [
    { key: 'compliance', title: 'Compliance' },
    { key: 'driver', title: 'Driver' },
    { key: 'shipper', title: 'Shipper' },
  ], []);

  const renderScene = SceneMap({
        compliance: () => (
            <DocumentList
                listKey="compliance"
                documents={compliance}
                isLoading={isLoading}
                onRefresh={onRefresh}
                onView={handleViewDocument}
                onDelete={handleDeletePress}
                searchTerm={searchQuery}
            />
        ),
        driver: () => (
             <DocumentList
                listKey="driver"
                documents={driver}
                isLoading={isLoading}
                onRefresh={onRefresh}
                onView={handleViewDocument}
                onDelete={handleDeletePress}
                searchTerm={searchQuery}
            />
        ),
        shipper: () => (
             <DocumentList
                listKey="shipper"
                documents={shipper}
                isLoading={isLoading}
                onRefresh={onRefresh}
                onView={handleViewDocument}
                onDelete={handleDeletePress}
                searchTerm={searchQuery}
            />
        ),
  });

  const allDocuments = useMemo(() => [...compliance, ...driver, ...shipper], [compliance, driver, shipper]);

  // Header actions
  const headerActions = [
      { icon: 'upload', onPress: handleUploadDocument },
  ];

  // --- Custom Back Press Handler ---
  const handleBackPress = () => {
    if (origin === NAV_ROUTES.DASHBOARD) {
      navigation.navigate(NAV_ROUTES.HOME_STACK, { screen: NAV_ROUTES.DASHBOARD });
    } else if (origin === NAV_ROUTES.LOAD_DETAILS && filter?.startsWith('load:')) {
      // If coming from Load Details, try to navigate back there
      // Extract loadId from filter (assuming format 'load:DR-1234')
      const originLoadId = filter.split(':')[1];
      if (originLoadId) {
        navigation.navigate(NAV_ROUTES.LOADS_STACK, {
            screen: NAV_ROUTES.LOAD_DETAILS,
            params: { loadId: originLoadId }
        });
      } else {
          // Fallback if loadId couldn't be extracted (shouldn't happen)
          if (navigation.canGoBack()) navigation.goBack();
      }
    } else {
      // Default behavior: go back within the current stack (MoreStack)
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  return (
    <Portal.Host>
    <ScreenWrapper style={styles.noPadding} contentContainerStyle={styles.fullHeightContent}>
      <AppHeader title="Documents" showBackButton onBackPress={handleBackPress}/>

      <Searchbar
          placeholder="Search documents..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          elevation={1}
      />

       {(isLoading && allDocuments.length === 0) ? (
             <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
        ) : (
             <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
                lazy // Render scenes only when needed
             />
        )}

         {/* Delete Confirmation Dialog */}
         <Dialog visible={deleteDialogVisible} onDismiss={handleCancelDelete}>
             <Dialog.Title>Confirm Deletion</Dialog.Title>
             <Dialog.Content>
                 <Paragraph>Are you sure you want to delete the document "{selectedDocToDelete?.name}"?</Paragraph>
                 <Paragraph>This action cannot be undone.</Paragraph>
             </Dialog.Content>
             <Dialog.Actions>
                 <Button onPress={handleCancelDelete}>Cancel</Button>
                 {/* TODO: Add loading state to delete button */}
                 <Button onPress={handleConfirmDelete} textColor={theme.colors.error}>Delete</Button>
             </Dialog.Actions>
         </Dialog>

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
  noPadding: { paddingTop: 0 },
  fullHeightContent: {
      flex: 1,
      paddingHorizontal: 0,
      paddingVertical: 0,
  },
  tabLabel: {
      fontWeight: 'bold',
      fontSize: 14,
      textTransform: 'capitalize',
  },
  searchbar: {
      margin: 8,
      elevation: 1,
  },
  listContentContainer: {
      paddingHorizontal: 8,
      paddingBottom: 16,
  },
  listDivider: {
      marginHorizontal: 16,
  },
  listItem: {
      backgroundColor: 'white',
      paddingVertical: 8,
  },
  itemTitle: {
      fontWeight: 'bold',
  },
  itemDescription: {
      fontSize: 12,
      color: 'grey',
  },
  itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  statusChip: {
    marginRight: 8,
    height: 24, // Smaller chip
    paddingHorizontal: 4, // Adjust padding
    alignItems: 'center',
    minWidth: 80, // Ensure status text fits
    justifyContent: 'center',
  },
  actionIcon: {
      padding: 4,
      marginLeft: 8,
  },
  listLoadingIndicator: {
      marginTop: 50,
  },
  loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
});

export default DocumentsScreen; 