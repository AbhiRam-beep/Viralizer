import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/config";

import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();
export default function TabsLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) return null;

  return isAuthenticated ? (
    
<Tabs
  screenOptions={{
    headerShown: false, // 💥 Hides the top white header
    tabBarActiveTintColor: '#2e8dfb',
    tabBarStyle: {
      backgroundColor: '#0f0f2d',
      borderTopWidth: 0,
    },
  }}
>

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }} />
      <Tabs.Screen
        name="Simulation"
        options={{
          tabBarLabel: "Simulation",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers-outline" color={color} size={size} />
          ),
        }} />
      <Tabs.Screen
        name="Help"
        options={{
          tabBarLabel: "Help",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" color={color} size={size} />
          ),
        }} />
      <Tabs.Screen
        name="Analysis"
        options={{
          tabBarLabel: "Analysis",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }} />
      <Tabs.Screen
        name="PrevSims"
        options={{
          tabBarLabel: "PrevSims",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="archive-outline" color={color} size={size} />
          ),
        }} />
    </Tabs>
  ) : (
    <Redirect href="/login" />
  );
}
