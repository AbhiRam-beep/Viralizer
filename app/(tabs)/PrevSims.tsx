import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { db, auth } from '../../services/config';
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

  const fetchSimulations = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      console.log('Current user:', currentUser);
      if (!currentUser) {
        setSimulations([]);
        setLoading(false);
        return;
      }

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
console.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  function formatTimestamp(timestamp: any) {
    if (!timestamp) return 'Simulation';
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
        <TouchableOpacity style={styles.refreshButton} onPress={fetchSimulations}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={simulations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 20 }}
      ListHeaderComponent={
        <TouchableOpacity style={styles.refreshButton} onPress={fetchSimulations}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      }
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
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginBottom: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
