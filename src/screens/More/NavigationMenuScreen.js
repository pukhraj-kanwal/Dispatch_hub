import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Divider, useTheme, Dialog, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Portal } from 'react-native-paper';

import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';
import { NAV_ROUTES } from '../../constants/navigationRoutes';
import { logoutUser } from '../../store/slices/authSlice';

function NavigationMenuScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const handleLogoutPress = () => {
      setLogoutDialogVisible(true);
  };

  const handleConfirmLogout = () => {
      console.log('Dispatching logoutUser...');
      setLogoutDialogVisible(false);
      dispatch(logoutUser());
  };

  const handleCancelLogout = () => {
      setLogoutDialogVisible(false);
  };

  const menuItems = [
    {
      title: 'My Profile',
      description: 'View and edit your personal information',
      icon: 'account-circle-outline',
      route: NAV_ROUTES.PROFILE,
    },
    {
      title: 'Compliance Tasks',
      description: 'Manage required tasks and certifications',
      icon: 'clipboard-check-outline',
      route: NAV_ROUTES.COMPLIANCE_TASKS,
    },
    {
      title: 'Documents',
      description: 'Access load, compliance, and driver documents',
      icon: 'file-document-multiple-outline',
      route: NAV_ROUTES.DOCUMENTS,
    },
    {
      title: 'Maintenance Log',
      description: 'Report vehicle maintenance issues',
      icon: 'wrench-outline',
      route: NAV_ROUTES.MAINTENANCE_LOG,
    },
     {
      title: 'Report Incident',
      description: 'Log accidents, breakdowns, or hazards',
      icon: 'alert-octagon-outline',
      route: NAV_ROUTES.REPORT_INCIDENT,
    },
    {
      title: 'Settings',
      description: 'Configure application preferences',
      icon: 'cog-outline',
      route: NAV_ROUTES.SETTINGS,
      disabled: false,
    },
    {
      title: 'Notifications',
      description: 'Manage your notification settings',
      icon: 'bell-outline',
      route: NAV_ROUTES.NOTIFICATIONS,
      action: () => alert('Notification settings coming soon!')
    },
    {
      title: 'Help & Support',
      description: 'Find answers and get assistance',
      icon: 'help-circle-outline',
      route: NAV_ROUTES.HELP_SUPPORT,
      action: () => alert('Help & Support feature coming soon!')
    },
    {
        title: 'Logout',
        description: 'Sign out of your account',
        icon: 'logout-variant',
        action: handleLogoutPress,
        isLogout: true
    }
  ];

  return (
    <Portal.Host>
    <ScreenWrapper>
      <AppHeader title="More Options" />
      <ScrollView style={styles.container}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.route || item.title || index}>
            <List.Item
              title={item.title}
              description={item.description}
              descriptionNumberOfLines={2}
              left={(props) => <List.Icon {...props} icon={item.icon} color={item.isLogout ? theme.colors.error : (item.disabled ? theme.colors.disabled : theme.colors.primary)} />}
              right={(props) => !item.action && !item.disabled && <List.Icon {...props} icon="chevron-right" />}
              style={[styles.listItem, (item.disabled || item.action) && styles.disabledItem, item.isLogout && styles.logoutItem]}
              titleStyle={item.isLogout ? styles.logoutText : ((item.disabled || item.action) ? styles.disabledText : null)}
              descriptionStyle={item.isLogout ? styles.logoutText : ((item.disabled || item.action) ? styles.disabledText : null)}
              onPress={() => {
                  if (item.action) {
                      item.action();
                  } else if (!item.disabled && item.route) {
                      navigation.navigate(item.route);
                  }
              }}
            />
            <Divider />
          </React.Fragment>
        ))}
      </ScrollView>

      <Dialog visible={logoutDialogVisible} onDismiss={handleCancelLogout}>
            <Dialog.Title>Confirm Logout</Dialog.Title>
            <Dialog.Content>
                 <Paragraph>Are you sure you want to log out?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={handleCancelLogout}>Cancel</Button>
                <Button onPress={handleConfirmLogout} textColor={theme.colors.error}>Logout</Button>
            </Dialog.Actions>
        </Dialog>

    </ScreenWrapper>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  disabledItem: {
    backgroundColor: '#f8f8f8',
  },
  disabledText: {
    color: 'grey',
  },
  logoutItem: {
    
  },
  logoutText: {
      color: '#B00020',
  },
});

export default NavigationMenuScreen;