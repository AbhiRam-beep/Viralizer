import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TabsIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the app!This is my app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
