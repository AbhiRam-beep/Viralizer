import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../../services/config';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;

const Analysis = () => {
  const params = useLocalSearchParams();
  const simId = params.simId as string | undefined;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If simId param exists, fetch saved simulation from Firestore
    if (simId) {
      setLoading(true);
      const fetchSimulation = async () => {
        try {
          const docRef = doc(db, 'simulations', simId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setHistory(data.history || []);
          } else {
            Alert.alert('Error', 'Simulation not found.');
          }
        } catch (error) {
          console.error('Error fetching simulation:', error);
          Alert.alert('Error', 'Failed to fetch simulation.');
        } finally {
          setLoading(false);
        }
      };
      fetchSimulation();
    }
  }, [simId]);

  // If no simId and no history param, fallback to history param (e.g., new simulation)
  useEffect(() => {
    if (!simId && params.history) {
      try {
        setHistory(JSON.parse(params.history as string));
      } catch {
        setHistory([]);
      }
    }
  }, [simId, params.history]);

  // Prepare chart data
  const labels = history.map(item =>
    new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const vaccineData = history.map(item => Number(item.vaccine));
  const virusData = history.map(item => Number(item.virus));

  const saveSimulation = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      await addDoc(collection(db, 'simulations'), {
        uid: user.uid,
        timestamp: serverTimestamp(),
        history: history,
      });

      Alert.alert('Success', 'Simulation saved successfully!');
    } catch (error) {
      console.error('Error saving simulation:', error);
      Alert.alert('Error', 'Could not save simulation.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Simulation Graph</Text>

      {history.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: vaccineData,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: virusData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 0.5,
              },
            ],
          }}
          width={screenWidth - 20}
          height={400}
          chartConfig={{
            backgroundColor: '#4d79ff',
            backgroundGradientFrom: '#99b3ff',
            backgroundGradientTo: '#4d79ff',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 0.5,
            decimalPlaces: 0,
          }}
          style={{
            marginVertical: 10,
            borderRadius: 0,
          }}
          withVerticalLabels={false}
        />
      ) : (
        <Text>No simulation data to display.</Text>
      )}

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'blue' }]} />
          <Text style={styles.legendText}>Vaccine</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Virus</Text>
        </View>
      </View>

      <Button title="Save This Simulation" onPress={saveSimulation} />
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

export default Analysis;
