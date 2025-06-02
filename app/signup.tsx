import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { auth } from "../services/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      if (userCredential.user) {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.message || "An unknown error occurred."
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>📝 Sign Up</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#aab3c5"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aab3c5"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aab3c5"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f2d",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a6e1fa",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1c1c3a",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#2e8dfb",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2e8dfb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#00ffff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#6a5acd",
    fontSize: 16,
    fontWeight: "bold",
  },
});
