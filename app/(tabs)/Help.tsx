import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Help() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simulation Help Guide</Text>

      <Text style={styles.heading}>Getting Started</Text>
      <Text style={styles.text}>
        Welcome to the Simulation screen! Here, you can experiment with how viruses
        and vaccines spread over a population grid. Use the controls at the top of the
        screen to toggle between different tools.
      </Text>

      <Text style={styles.heading}>Tools Overview</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Virus Mode:</Text> Tap on any cell to introduce a virus. Cells will show red as virus levels increase.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Vaccine Mode:</Text> Tap on cells to apply vaccines. Blue shades indicate vaccination levels.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Population Mode:</Text> Configure the population type (High, Neutral, Low) for each cell.
        This affects the rate of virus/vaccine spread.
      </Text>

      <Text style={styles.heading}>Population Types</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>High:</Text> Fast spread rate. More susceptible to virus or vaccine spread.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Neutral:</Text> Balanced spread. The default cell type.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Low:</Text> Slowest spread rate. Acts as a buffer to neighboring cells.
      </Text>

      <Text style={styles.heading}>Simulation Controls</Text>
      <Text style={styles.text}>
        Use the bottom control buttons:
      </Text>
      <Text style={styles.text}>- <Text style={styles.bold}>Start:</Text> Begin the simulation.</Text>
      <Text style={styles.text}>- <Text style={styles.bold}>Stop:</Text> Pause the simulation at any point.</Text>
      <Text style={styles.text}>- <Text style={styles.bold}>Reset:</Text> Clear the board and restart.</Text>

      <Text style={styles.heading}>Analysis Page</Text>
      <Text style={styles.text}>
        After stopping the simulation, press the <Text style={styles.bold}>"Go to Analysis"</Text> button to view a graph of how virus
        and vaccine levels evolved over time. Here, you can also press <Text style={styles.bold}>"Save Simulation"</Text>
        to preserve the results.
      </Text>

      <Text style={styles.heading}>Previous Simulations</Text>
      <Text style={styles.text}>
        On the <Text style={styles.bold}>Previous Simulations</Text> page, view all your saved runs and compare past trends. This helps
        analyze how different initial conditions or population types affect the simulation.
      </Text>

      <Text style={styles.heading}>Tips & Tricks</Text>
      <Text style={styles.text}>- Try spreading virus in a high-density population to see rapid spread.</Text>
      <Text style={styles.text}>- Combine vaccines with low-density zones to contain the virus effectively.</Text>
      <Text style={styles.text}>- Use reset to test different setups quickly.</Text>

      <Text style={styles.heading}>Questions?</Text>
      <Text style={styles.text}>
        This simulation is for experimentation and learning. If you have feedback or bugs,
        reach out to the developers. Enjoy experimenting!
      </Text>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
  },
});
