import React, { useState, useEffect, useRef } from "react";
import { View, Button, TouchableOpacity } from "react-native";

const GRID_SIZE = 20;
const CELL_SIZE = 15;

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
        virus: 0,
        vaccine: 0,
      }))
    )
  );

  const handleTap = (row, col) => {
    if (running) return;

    const cell = gridRef.current[row][col];
    if (mode === "virus") {
      cell.virus = 100;
      cell.vaccine = 0;
    } else if (mode === "vaccine") {
      cell.virus = 0;
      cell.vaccine = 100;
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
          spreadToNeighbors(newGrid, r, c);
        }
      }

      const allVaccinated = newGrid.every(row =>
        row.every(cell => cell.vaccine === 100)
      );
      if (allVaccinated) {
        setRunning(false);
      }

      gridRef.current = newGrid;
      forceUpdate(n => n + 1);
    }, 60);

    return () => clearInterval(interval);
  }, [running]);




  const spreadToNeighbors = (grid, row, col) => {
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    const src = grid[row][col];

    const factorMap = {
      high: 1,
      neutral: 0.5,
      low: 0.3
    };

    dirs.forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        const n = grid[r][c];
        const pop = src.population || 'neutral';
        const f = factorMap[pop] ?? 0.5;

        if (src.virus > 0 || src.vaccine > 0) {
          if (Math.random() < 0.1 * f) {
            const vIn = src.virus * 0.08;
            const vacIn = src.vaccine * 0.15;

            let v = n.virus + vIn;
            let vac = n.vaccine + vacIn;

            const t = v + vac;
            if (t > 100) {
              const s = 100 / t;
              v *= s;
              vac *= s;
            }

            n.virus = v;
            n.vaccine = vac;
          }
        }
      }
    });

    const cell = grid[row][col];
    if (cell.vaccine > 0 && cell.virus > 0) {
      const rate = 0.05;
      cell.vaccine = Math.min(100, cell.vaccine + rate);
      cell.virus = Math.max(0, cell.virus - rate * 1.5);
    }
  };



  const getCellColor = (cell) => {
    const { virus, vaccine, population } = cell;

    if (virus > 0 || vaccine > 0) {
      const total = virus + vaccine;
      const redRatio = virus / total;
      const blueRatio = vaccine / total;

      const red = Math.round(255 * redRatio);
      const green = 0;
      const blue = Math.round(255 * blueRatio);

      return `rgb(${red},${green},${blue})`;
    }

    return {
      high: "#ffe5b4",
      low: "#b2f0e8",
      neutral: "lightgray",
    }[population];
  };




  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>



      <View style={{ flexDirection: "row", marginBottom: 20, gap: 8 }}>
        {["virus", "vaccine", "population"].map((m) => (
          <Button
            key={m}
            title={m.charAt(0).toUpperCase() + m.slice(1)}
            onPress={() => setMode(m)}
            color={mode === m ? "darkblue" : undefined}
          />
        ))}

        {mode === "population" && (
          <View style={{ flexDirection: "column", gap: 8 }}>
            {["high", "neutral", "low"].map((type) => (
              <Button
                key={type}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                onPress={() => setSelectedType(type)}
                color={selectedType === type ? "gray" : undefined}
              />
            ))}
          </View>
        )}
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
              population: "neutral",
              virus: 0,
              vaccine: 0,
            }))
          );
          setRunning(false);
          forceUpdate((prev) => prev + 1);
        }} />
      </View>
    </View>
  );
}
