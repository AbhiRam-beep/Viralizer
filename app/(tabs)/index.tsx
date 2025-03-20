import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/config';
import { useRouter } from 'expo-router';

export default function TabsIndex() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed out", "You have been signed out successfully.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the app! This is inside app/tabs</Text>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
