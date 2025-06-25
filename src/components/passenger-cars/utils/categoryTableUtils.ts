
export const getCellColor = (value: number, maxInRow: number) => {
  if (value === 0) return 'transparent'
  const intensity = value / maxInRow
  if (intensity > 0.7) return 'rgba(59, 130, 246, 0.8)'
  if (intensity > 0.4) return 'rgba(59, 130, 246, 0.5)'
  return 'rgba(59, 130, 246, 0.3)'
}
