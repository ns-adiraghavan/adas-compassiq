
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import HorizontalSectionContainer from "@/components/passenger-cars/HorizontalSectionContainer"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"
import ThemeSelector from "@/components/ThemeSelector"

const PassengerCarsContent = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme.backgroundGradient} ${theme.textPrimary} transition-all duration-500`}>
      <ThemeSelector />
      
      {/* Header */}
      <div className="container mx-auto px-8 py-6">
        <Link 
          to="/" 
          className={`inline-flex items-center ${theme.textMuted} hover:${theme.textPrimary.replace('text-', 'text-')} transition-colors mb-4`}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <h1 className={`text-4xl font-thin mb-2 ${theme.textPrimary} tracking-tight`}>
          Passenger Cars
        </h1>
        <p className={`text-lg ${theme.textSecondary} font-light mb-6`}>
          Premium Automotive Intelligence
        </p>
      </div>

      {/* Horizontal Sections Container */}
      <div className="h-[calc(100vh-200px)]">
        <HorizontalSectionContainer
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
      </div>
    </div>
  )
}

const PassengerCars = () => {
  return (
    <ThemeProvider>
      <PassengerCarsContent />
    </ThemeProvider>
  )
}

export default PassengerCars
