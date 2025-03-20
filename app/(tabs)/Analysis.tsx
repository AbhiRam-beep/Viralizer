import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, ScrollView } from "react-native";

const screenWidth = Dimensions.get("window").width;

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
