
interface InsightsSectionProps {
  selectedOEM: string
}

const InsightsSection = ({ selectedOEM }: InsightsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-16">
        <h2 className="text-2xl font-light text-white mb-4">
          Ready to Build Analytics
        </h2>
        <p className="text-white/60 font-light">
          Selected OEM: <span className="text-blue-400">{selectedOEM}</span>
        </p>
        <p className="text-white/40 font-light mt-2">
          Insights sections will be built here
        </p>
      </div>
    </div>
  )
}

export default InsightsSection
