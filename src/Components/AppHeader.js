import React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

function AppHeader({ title, subtitle, showBackButton = false, actions, onBackPress }) {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Appbar.Header
        style={{ backgroundColor: theme.colors.headerBackground }}
        // statusBarHeight={0} // Adjust if using custom status bar handling
    >
      {showBackButton && <Appbar.BackAction onPress={handleBack} color={theme.colors.headerText} />}
      <Appbar.Content title={title} subtitle={subtitle} titleStyle={{ color: theme.colors.headerText }} subtitleStyle={{ color: theme.colors.headerText }}/>
      {actions && actions.map((action, index) => (
          <Appbar.Action
            key={index}
            icon={action.icon}
            onPress={action.onPress}
            color={action.color || theme.colors.headerText}
            disabled={action.disabled}
          />
      ))}
    </Appbar.Header>
  );
}

export default AppHeader; 