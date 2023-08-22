"use client";

import { useState, useRef } from "react";
import { Header } from "./components/Header";
import { Button } from "./components/Button";
import { Grid9x9 } from "./components/board";
import { Keypad } from "./components/keypad";
import { test1 } from "../../data/board-mocks";

export default function Home() {
  const [cells, setCells] = useState(
    Array(81).fill({ value: "", isValid: true })
  );

  const [cellValues, setCellValues] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [cellValuesGiven, setCellValuesGiven] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [cellSolution, setCellSolution] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [cellProtection, setCellProtection] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [cellErrors, setCellErrors] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );

  const gridRef = useRef(null);

  // for testing purposes only
  // const [cellValues, setCellValues] = useState(test1.cellValues);
  // const [cellSolution, setCellSolution] = useState(test1.cellSolution);
  // const [cellProtection, setCellProtection] = useState(test1.cellProtection);
  // const [cellValuesGiven, setCellValuesGiven] = useState(test1.cellValuesGiven);

  const allValuesSet = cells.every((cell) => cell.value !== "");
  const isValidBoard = cells.every((cell) => cell.isValid);
  const isSolution = allValuesSet && isValidBoard;

  function handleClearAll() {
    setCells(Array(81).fill({ value: "", isValid: true }));
  }

  function solve(cells) {
    const newCells = [...cells];

    for (let i = 0; i < 81; i++) {
      if (newCells[i].value === "") {
        for (let guess = 1; guess < 10; guess++) {
          newCells[i] = { ...newCells[i], value: guess.toString() };
          if (!hasDuplicates(newCells, i)) {
            if (solve(newCells)) {
              return true;
            }
          } else {
            newCells[i] = { ...newCells[i], value: "" };
          }
        }
        return false;
      }
    }
    setCells(newCells);
    return true;
  }

  function hasDuplicates(cells, index) {
    const value = cells[index].value;
    const row = Math.floor(index / 9);
    const col = index % 9;

    if (value === "") return false;

    // Check duplicates in the row
    for (let i = 0; i < 9; i++) {
      if (i !== col && cells[row * 9 + i].value === value) {
        return true;
      }
    }

    // Check duplicates in the column
    for (let i = 0; i < 9; i++) {
      if (i !== row && cells[i * 9 + col].value === value) {
        return true;
      }
    }

    // Check duplicates in the 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (i !== row && j !== col && cells[i * 9 + j].value === value) {
          return true;
        }
      }
    }

    return false;
  }

  return (
    <main className="px-4 py-6 w-full h-full flex justify-center">
      <div className="w-full h-full max-w-screen-lg flex flex-col justify-between items-center">
        {!isSolution && (
          <Header appMode="solver" title="Fill in your challenge" />
        )}
        {isSolution && <Header appMode="solver" title="Solution found!" />}

        <div className="flex-grow flex flex-col justify-center">
          <Grid9x9
            cellValues={cellValues}
            setCellValues={setCellValues}
            cellProtection={cellProtection}
            cellSolution={cellSolution}
            cellErrors={cellErrors}
            setCellErrors={setCellErrors}
            cellValuesGiven={cellValuesGiven}
            ref={gridRef}
          />
          <Keypad gridRef={gridRef} />

          {!isSolution && (
            <div className="space-x-8 mt-10 flex justify-center">
              <Button
                variant="filled"
                onClick={() => solve(cells)}
                disabled={!isValidBoard}
              >
                Solve
              </Button>
              <Button variant="outlined" onClick={handleClearAll}>
                Clear
              </Button>
            </div>
          )}

          {isSolution && (
            <div className="space-x-8 mt-10 flex justify-center">
              <Button
                variant="filled"
                onClick={() => alert("This feature is coming soon")}
                disabled={!isValidBoard}
              >
                Export
              </Button>
              <Button variant="outlined" onClick={handleClearAll}>
                Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
