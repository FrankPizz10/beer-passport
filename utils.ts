export function decimalToPercent(decimal: number) {
  const percent = decimal * 100; // Multiply by 100 and round to 2 decimal places
  return percent + "%"; // Append "%" symbol
}
