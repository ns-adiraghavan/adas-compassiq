export function ErrorState() {
  return (
    <div className="py-4">
      <p className="text-red-400 text-sm">Unable to generate insights</p>
      <p className="text-white/40 text-xs mt-1">Check data connectivity and try again</p>
    </div>
  )
}