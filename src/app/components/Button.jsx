export function Button({ variant, children, onClick, disabled }) {
  const filledStyles = `bg-gray-300`;
  const filledDisabledStyles = `text-gray-300 bg-gray-200 cursor-not-allowed`;
  const outlinedStyles = `border border-black`;
  const outlinedDisabledStyles = `text-gray-300 border border-gray-200 cursor-not-allowed`;

  const buttonStyles = `py-2 px-8 rounded-full ${
    variant === "filled" && (disabled ? filledDisabledStyles : filledStyles)
  } ${
    variant === "outlined" &&
    (disabled ? outlinedDisabledStyles : outlinedStyles)
  }`;

  return (
    <button className={buttonStyles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
