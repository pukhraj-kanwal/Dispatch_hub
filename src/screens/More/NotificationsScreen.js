import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, List, ActivityIndicator, Divider, Badge } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import { NAV_ROUTES } from '../../constants/navigationRoutes';
import { fetchNotifications, markNotificationAsRead } from '../../store/slices/notificationsSlice';

function NotificationsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { origin } = route.params || {};

  const { items: notifications, isLoading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleBackPress = () => {
    if (origin === NAV_ROUTES.DASHBOARD) {
      navigation.navigate(NAV_ROUTES.HOME_STACK, { screen: NAV_ROUTES.DASHBOARD });
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  const handleNotificationPress = (item) => {
    console.log('Notification pressed:', item.id);
    if (!item.readStatus) {
        dispatch(markNotificationAsRead(item.id));
    }

    if (item.type === 'Load Update' || item.type === 'Load Assignment') {
        if (item.relatedId) {
             console.log(`Navigating to Load Details for ${item.relatedId}`);
            navigation.navigate(NAV_ROUTES.LOADS_STACK, { screen: NAV_ROUTES.LOAD_DETAILS, params: { loadId: item.relatedId } });
        }
    } else if (item.type === 'Compliance') {
        if (item.relatedId) {
             console.log(`Navigating to Task Details for ${item.relatedId}`);
             navigation.navigate(NAV_ROUTES.TASK_DETAILS, { taskId: item.relatedId });
        }
    }
  };

  const renderNotificationItem = ({ item }) => {
    const timeAgo = dayjs(item.timestamp).fromNow();
    let icon = 'bell-outline';
    if (item.type === 'Load Update' || item.type === 'Load Assignment') icon = 'truck-fast-outline';
    if (item.type === 'Compliance') icon = 'clipboard-check-outline';
    if (item.type === 'System') icon = 'cogs';

    const itemStyle = [styles.listItem, !item.readStatus && styles.unreadItem];
    const titleStyle = !item.readStatus && styles.unreadTitle;

    return (
      <List.Item
        title={item.title}
        description={item.message}
        descriptionNumberOfLines={2}
        titleStyle={titleStyle}
        style={itemStyle}
        left={props => (
            <View style={styles.iconContainer}>
                 <List.Icon {...props} icon={icon} color={!item.readStatus ? theme.colors.primary : theme.colors.disabled} />
                 {!item.readStatus && <Badge style={styles.unreadBadge} size={8} />}
            </View>
        )}
        right={() => <Text style={styles.timestamp}>{timeAgo}</Text>}
        onPress={() => handleNotificationPress(item)}
      />
    );
  };

  if (isLoading && notifications.length === 0) {
    return (
      <ScreenWrapper>
        <AppHeader title="Notifications" showBackButton onBackPress={handleBackPress} />
        <ActivityIndicator animating={true} size="large" style={styles.loadingIndicator} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.noPadding}>
      <AppHeader title="Notifications" showBackButton onBackPress={handleBackPress} />
      {error && <Text style={styles.errorText}>Error loading notifications: {error}</Text>}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
             !isLoading && <View style={styles.emptyContainer}><Text style={styles.emptyText}>No notifications found.</Text></View>
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  noPadding: { paddingTop: 0 },
  loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
      padding: 10,
  },
  listContent: {
      paddingBottom: 16,
  },
  listItem: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  unreadItem: {
     backgroundColor: '#eef5ff',
  },
  unreadTitle: {
      fontWeight: 'bold',
  },
  iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      position: 'relative',
  },
   unreadBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: 'red',
  },
  timestamp: {
    fontSize: 12,
    color: 'grey',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginRight: 8,
  },
  divider: {
      height: 1,
      backgroundColor: '#eee',
  },
   emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      marginTop: 50,
  },
  emptyText: {
      fontSize: 16,
      color: 'grey',
      textAlign: 'center',
  },
});

export default NotificationsScreen; 