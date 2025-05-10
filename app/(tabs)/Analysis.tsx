import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Analysis = () => {
  const params = useLocalSearchParams();
  const history = params.history ? JSON.parse(params.history as string) : [];

  // Prepare data for the chart
  const labels = history.map(item =>
    new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const vaccineData = history.map(item => Number(item.vaccine));
  

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>History Data</Text>
      

      {history.length > 0 && (
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: vaccineData,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,  // Line color
                strokeWidth: 2, 
              },
              {
                data: history.map(item => Number(item.virus)),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,  // Line color for second dataset
                strokeWidth: 0.5, 
              }
            ],
          }}
          width={screenWidth - 20} // to account for padding
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
    </View>
  );
};


const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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



/*
const Analysis = () => {
  return (
    <ScrollView>
      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              data: [80, 75, 60, 50, 40, 35, 20, 10],
            },
          ],
        }}
        width={screenWidth}
        height={300}
        chartConfig={{
          backgroundColor: "#ff4d4d",
          backgroundGradientFrom: "#ff9999",
          backgroundGradientTo: "#ff4d4d",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 2,
          decimalPlaces: 0,
        }}
        style={{
          marginVertical: 10,
          borderRadius: 10,
        }}
        bezier
      />
      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              data: [10, 20, 30, 45, 60, 75, 80, 90],
            },
          ],
        }}
        width={screenWidth}
        height={300}
        chartConfig={{
          backgroundColor: "#4d79ff",
          backgroundGradientFrom: "#99b3ff",
          backgroundGradientTo: "#4d79ff",
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 2,
          decimalPlaces: 0,
        }}
        style={{
          marginVertical: 10,
          borderRadius: 10,
        }}
        bezier
      />
    </ScrollView>
  );
};

export default Analysis;
*/