import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { db, auth } from '../../services/config';  // adjust path as needed
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'expo-router';

type Simulation = {
  id: string;
  timestamp: any;
  userId: string;
  graphData?: any;
  imageUrl?: string;
};

export default function PrevSims() {
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSimulations() {
      try {
        const currentUser = auth.currentUser;
        console.log('Current user:', currentUser);
        if (!currentUser) {
          setSimulations([]);
          setLoading(false);
          return;
        }

        // Query simulations where userId == current user's uid
        const q = query(
          collection(db, 'simulations'),
          where('uid', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        console.log('Query snapshot size:', querySnapshot.size);
        const sims: Simulation[] = [];
        querySnapshot.forEach(doc => {
          console.log('Doc data:', doc.data());
          sims.push({
            id: doc.id,
            ...(doc.data() as Omit<Simulation, 'id'>),
          });
        });
        setSimulations(sims);
      } catch (e) {
        console.error('Error fetching simulations:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchSimulations();
  }, []);

  function formatTimestamp(timestamp: any) {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  }

  function handlePress(sim: Simulation) {
    router.push({
      pathname: '/(tabs)/Analysis',
      params: { simId: sim.id },
    });
  }

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
  }

  if (simulations.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No previous simulations found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={simulations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
          <Text style={styles.dateText}>{formatTimestamp(item.timestamp)}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
  },
});
