import React, { useState, useEffect, useRef } from "react";
import { View, Button, TouchableOpacity, Text } from "react-native";

const GRID_SIZE = 15;
const CELL_SIZE = 20;

export default function Simulation() {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("virus");
  const [selectedType, setSelectedType] = useState("infected");
  const [_, forceUpdate] = useState(0);


  const gridRef = useRef(
    Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        status: "neutral",
        population: "neutral",
      }))
    )
  );

  const handleTap = (row, col) => {
    if (running) return;

    const cell = gridRef.current[row][col];
    if (mode === "virus") {
      cell.status = selectedType;
    } else if (mode === "population") {
      cell.population = selectedType;
    }

    forceUpdate((prev) => prev + 1);
  };

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      const newGrid = JSON.parse(JSON.stringify(gridRef.current));

      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const cell = gridRef.current[r][c];

          const spreadFactor = {
            high: 1,
            neutral: 0.5,
            low: 0.3,
          }[cell.population];

          if (cell.status === "infected") {
            spreadToNeighbors(newGrid, r, c, "neutral", "infected", spreadFactor);
          }

          if (cell.status === "vaccinated") {
            spreadToNeighbors(newGrid, r, c, "neutral", "vaccinated", 0.7 * spreadFactor);
          }
        }
      }

      gridRef.current = newGrid;
      forceUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const spreadToNeighbors = (grid, row, col, targetStatus, newStatus, chance) => {
    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    directions.forEach(([dr, dc]) => {
      const nr = row + dr, nc = col + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        const neighbor = grid[nr][nc];
        if (neighbor.status === targetStatus && Math.random() < chance) {
          neighbor.status = newStatus;
        }
      }
    });
  };

  const getCellColor = (cell) => {
    if (cell.status !== "neutral") {
      return {
        infected: "red",
        vaccinated: "blue",
      }[cell.status];
    }

    return {
      high: "#ffe5b4",
      low: "#b2f0e8",
      neutral: "lightgray",
    }[cell.population];
  };


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["virus", "population"].map((m) => (
          <Button key={m} title={m} onPress={() => setMode(m)} />
        ))}
      </View>

      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {mode === "virus" &&
          ["infected", "vaccinated", "neutral"].map((type) => (
            <Button key={type} title={type} onPress={() => setSelectedType(type)} />
          ))}
        {mode === "population" &&
          ["high", "low", "neutral"].map((type) => (
            <Button key={type} title={type} onPress={() => setSelectedType(type)} />
          ))}
      </View>

      <View style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "#ddd"
      }}>
        {gridRef.current.flatMap((row, r) =>
          row.map((cell, c) => (
            <TouchableOpacity
              key={`${r}-${c}`}
              onPress={() => handleTap(r, c)}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderWidth: 0.5,
                borderColor: "#ccc",
                backgroundColor: getCellColor(gridRef.current[r][c]),
              }}
            />
          ))
        )}
      </View>

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Button title="Start" onPress={() => setRunning(true)} />
        <Button title="Stop" onPress={() => setRunning(false)} />
        <Button title="Reset" onPress={() => {
          gridRef.current = Array(GRID_SIZE).fill(null).map(() =>
            Array(GRID_SIZE).fill(null).map(() => ({
              status: "neutral",
              population: "neutral"
            }))
          );
          setRunning(false);
          forceUpdate((prev) => prev + 1);
        }} />
      </View>
    </View>
  );
}
