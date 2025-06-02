import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
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
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>🧬 Viralizer</Text>
      <Text style={styles.subtitle}>
        Explore how viruses spread and how vaccines impact the outcome.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/Simulation")}
        style={[styles.button, styles.startButton]}
      >
        <Text style={styles.buttonText}>Start Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/PrevSims")}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={styles.buttonText}>Previous Simulations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/Help")}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={styles.buttonText}>Help</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSignOut}
        style={[styles.logoutButton]}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f2d',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#a6e1fa',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#d0d6f9',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  startButton: {
    backgroundColor: '#2e8dfb',
  },
  secondaryButton: {
    backgroundColor: '#6a5acd',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#ff4c61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutText: {
    color: '#fff0f0',
    fontSize: 16,
    fontWeight: '600',
  },
});
