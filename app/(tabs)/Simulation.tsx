import React, { useState, useEffect } from "react";
import { View, Button, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";

const GRID_SIZE = 15;
const CELL_SIZE = 20;

export default function Simulation() {
  const [grid, setGrid] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill("neutral"))
  );

  const [selectedType, setSelectedType] = useState("infected");
  const [running, setRunning] = useState(false);

  const animationValues = grid.map((row) =>
    row.map(() => useSharedValue(0))
  );

  const handleTap = (row: number, col: number) => {
    if (running) return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => [...r]);
      newGrid[row][col] = selectedType;
      return newGrid;
    });

    animationValues[row][col].value = 0;
    animationValues[row][col].value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => [...row]);

        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (prevGrid[r][c] === "infected") {
              spreadToNeighbors(newGrid, r, c, "neutral", "infected");
            }
            if (prevGrid[r][c] === "vaccinated") {
              spreadToNeighbors(newGrid, r, c, "neutral", "vaccinated", 0.3);
            }
          }
        }

        return newGrid;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const spreadToNeighbors = (grid, row, col, target, newState, chance = 1) => {
    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 &&
        newRow < GRID_SIZE &&
        newCol >= 0 &&
        newCol < GRID_SIZE
      ) {
        if (
          (grid[newRow][newCol] === "infected" && newState === "vaccinated") ||
          (grid[newRow][newCol] === "vaccinated" && newState === "infected")
        ) {
          grid[newRow][newCol] = "merged";

          animationValues[newRow][newCol].value = 0;
          animationValues[newRow][newCol].value = withTiming(1, {
            duration: 500,
            easing: Easing.inOut(Easing.ease),
          });
        }
        else if (grid[newRow][newCol] === target) {
          if (Math.random() < chance) {
            grid[newRow][newCol] = newState;

            animationValues[newRow][newCol].value = 0;
            animationValues[newRow][newCol].value = withTiming(1, {
              duration: 500,
              easing: Easing.inOut(Easing.ease),
            });
          }
        }
      }
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <Button title="Infected" onPress={() => setSelectedType("infected")} />
        <Button title="Vaccinated" onPress={() => setSelectedType("vaccinated")} />
        <Button title="Neutral" onPress={() => setSelectedType("neutral")} />
      </View>

      <View
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          flexDirection: "row",
          flexWrap: "wrap",
          backgroundColor: "#ddd",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const animatedStyle = useAnimatedStyle(() => {
              const opacity = animationValues[r][c].value;

              const backgroundColor =
                cell === "infected"
                  ? `rgba(255, 0, 0, ${opacity})`
                  : cell === "vaccinated"
                    ? `rgba(0, 0, 255, ${opacity})`
                    : cell === "merged"
                      ? `rgba(128, 0, 128, ${opacity})`
                      : `rgba(200, 200, 200, ${opacity})`;

              return {
                backgroundColor,
              };
            });

            return (
              <TouchableOpacity
                key={`${r}-${c}`}
                onPress={() => handleTap(r, c)}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  borderWidth: 0.5,
                  borderColor: "#ccc",
                }}
              >
                <Animated.View style={[{ flex: 1 }, animatedStyle]} />
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Button title="Start" onPress={() => setRunning(true)} />
        <Button title="Stop" onPress={() => setRunning(false)} />
        <Button
          title="Reset"
          onPress={() =>
            setGrid(
              Array(GRID_SIZE)
                .fill(null)
                .map(() => Array(GRID_SIZE).fill("neutral"))
            )
          }
        />
      </View>
    </View>
  );
}
