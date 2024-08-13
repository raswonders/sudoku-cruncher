"use client";

import { useState, useRef, useEffect } from "react";
import { Grid9x9 } from "./components/board";
import { Keypad } from "./components/keypad";
import Menubar from "./components/menubar";
import Timer from "./components/timer";
import {
  getSudoku,
  createCellProtection,
  getRandomEmptyCell,
  areArraysEqual,
} from "./utils";
import {
  ClearBoardConfirmation,
  RestartGameConfirmation,
  GameOverModal,
  DifficultyModal,
  LoadingSpinner,
  BoardInErrorModal,
} from "./components/modals";

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
  const [game, setGame] = useState("difficulty");
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
          window.loading_spinner.showModal();
          const boards = await getSudoku(difficulty);
          createGameBoard(boards);
          setGame("on");
          break;
        case "reset":
          resetGameBoard();
          setGame("on");
          break;
        case "on":
          window.loading_spinner.close();
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
              difficulty={difficulty}
            />
          )}
          <ClearBoardConfirmation gridRef={gridRef} />
          <RestartGameConfirmation setGame={setGame} />
          <DifficultyModal setGame={setGame} setDifficulty={setDifficulty} />
          <LoadingSpinner />
          <BoardInErrorModal />
          <Timer time={time} setTime={setTime} game={game} />
          <Grid9x9
            game={game}
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
          <Keypad gridRef={gridRef} game={game} setGame={setGame} />
        </div>
      </div>
    </main>
  );
}
