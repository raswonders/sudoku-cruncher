export default function Cell({
  value,
  row,
  col,
  focusedCell,
  setFocusedCell,
  handleKeyDown,
}) {
  const hasFocusOnRowOrCol = row === focusedCell.row || col === focusedCell.col;

  return (
    <div
      className={`flex justify-center items-center bg-white ${
        hasFocusOnRowOrCol ? "bg-blue-50" : ""
      } ring-inset focus:outline-none focus:bg-blue-100`}
      tabIndex={0}
      onFocus={() => setFocusedCell({ row, col })}
      onBlur={() => setFocusedCell({ row: null, col: null })}
      onKeyDown={(e) => handleKeyDown(e, row, col)}
    >
      {value > 0 ? value : ""}
    </div>
  );
}
