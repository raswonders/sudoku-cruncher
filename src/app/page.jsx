"use client";

import { useState, useRef, useEffect } from "react";
import { Grid9x9 } from "./components/board";
import { Keypad } from "./components/keypad";
import { test1 } from "../../data/board-mocks";
import Menubar from "./components/menubar";
import Timer from "./components/timer";
import {
  getSudoku,
  createCellProtection,
  getRandomEmptyCell,
  areArraysEqual,
} from "./utils";
import GameOverModal from "./components/game-over";
import DifficultyModal, { TestModal } from "./components/difficulty-modal";

export default function Home() {
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
  const [game, setGame] = useState("off");
  const [difficulty, setDifficulty] = useState("easy");
  const [assists, setAssists] = useState(0);
  const [time, setTime] = useState(0);

  const gridRef = useRef(null);

  function initFreeFormBoard() {
    setCellValues(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setCellErrors(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setCellSolution(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setCellProtection(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setAssists(0);
  }

  function createGameBoard(boards) {
    setCellValuesGiven([...boards.cells.map((row) => [...row])]);
    setCellValues([...boards.cells.map((row) => [...row])]);
    setCellSolution([...boards.solution.map((row) => [...row])]);
    setCellProtection(createCellProtection(boards.cells));
    setCellErrors(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setAssists(0);
    setTime(0);
  }

  function resetGameBoard() {
    setCellValues([...cellValuesGiven.map((row) => [...row])]);
    setCellErrors(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setAssists(0);
    setTime(0);
  }

  useEffect(() => {
    async function updateUI() {
      switch (game) {
        case "off":
          initFreeFormBoard();
          break;
        case "difficulty":
          window.diff_modal.showModal();
          break;
        case "fetch":
          const boards = await getSudoku(difficulty);
          createGameBoard(boards);
          setGame("on");
          break;
        case "reset":
          resetGameBoard();
          setGame("on");
          break;
        case "on":
          break;
        case "won":
        case "lost":
          window.game_over_modal.showModal();
          break;
      }
    }

    updateUI();
  }, [game]);

  useEffect(() => {
    if (game !== "on") return;

    const isFinished =
      !getRandomEmptyCell(cellValues) &&
      areArraysEqual(cellValues, cellSolution);

    if (isFinished) {
      setGame("won");
    }
  }, [cellValues]);

  useEffect(() => {
    if (game !== "on") return;

    assists >= 3 && setGame("lost");
  }, [assists]);

  // for testing purposes only
  // const [cellValues, setCellValues] = useState(test1.cellValues);
  // const [cellSolution, setCellSolution] = useState(test1.cellSolution);
  // const [cellProtection, setCellProtection] = useState(test1.cellProtection);
  // const [cellValuesGiven, setCellValuesGiven] = useState(test1.cellValuesGiven);

  return (
    <main className="px-4 py-6 w-full h-full flex justify-center">
      <div className="w-full h-full max-w-screen-lg flex flex-col justify-between items-center">
        <Menubar
          game={game}
          setGame={setGame}
          assists={assists}
          setDifficulty={setDifficulty}
        />
        <div className="flex-grow flex flex-col justify-center">
          {(game === "won" || game === "lost") && (
            <GameOverModal
              game={game}
              setGame={setGame}
              time={time}
              gridRef={gridRef}
            />
          )}
          <DifficultyModal setGame={setGame} setDifficulty={setDifficulty} />
          {game === "on" && <Timer time={time} setTime={setTime} />}
          <Grid9x9
            cellValues={cellValues}
            setCellValues={setCellValues}
            cellProtection={cellProtection}
            cellSolution={cellSolution}
            cellErrors={cellErrors}
            setCellErrors={setCellErrors}
            cellValuesGiven={cellValuesGiven}
            setAssists={setAssists}
            assists={assists}
            ref={gridRef}
          />
          <Keypad gridRef={gridRef} />
        </div>
      </div>
    </main>
  );
}
