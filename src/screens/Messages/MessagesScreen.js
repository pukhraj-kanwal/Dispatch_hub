import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenWrapper from '../../Components/ScreenWrapper';
import AppHeader from '../../Components/AppHeader';

function MessagesScreen() {
      const headerActions = [
        { icon: 'pencil', onPress: () => console.log('New Message pressed') },
      ];

  return (
    <ScreenWrapper style={styles.noPadding} contentContainerStyle={styles.content}>
        <AppHeader title="Messages" actions={headerActions} />
        <View style={styles.innerContent}>
            <Text>Messages Content Placeholder</Text>
            {/* TODO: Implement Messages UI (List, Input) based on designs */}
        </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
   noPadding: {
      paddingTop: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  innerContent: {
      flex: 1,
       // Remove centering for list view
      // padding: 16, // Adjust padding
  }
});

export default MessagesScreen; 