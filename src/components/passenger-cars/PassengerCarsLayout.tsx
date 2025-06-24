
import { ArrowLeft } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"
import ThemeSelector from "@/components/ThemeSelector"

interface PassengerCarsLayoutProps {
  children: React.ReactNode
}

const PassengerCarsLayoutContent = ({ children }: PassengerCarsLayoutProps) => {
  const { theme } = useTheme()
  const location = useLocation()

  const sections = [
    { id: 'landscape', name: 'Landscape', path: '/passenger-cars/landscape' },
    { id: 'analytics', name: 'Category Analysis', path: '/passenger-cars/analytics' },
    { id: 'intelligence', name: 'Vehicle Segment Analysis', path: '/passenger-cars/intelligence' },
    { id: 'modeling', name: 'Business Model Analysis', path: '/passenger-cars/modeling' },
    { id: 'insights', name: 'Insights', path: '/passenger-cars/insights' },
  ]

  const getCurrentSection = () => {
    return sections.find(section => location.pathname === section.path)?.id || 'landscape'
  }

  return (
    <div className={`${theme.backgroundGradient} ${theme.textPrimary} transition-all duration-500`}>
      <ThemeSelector />
      
      {/* Header - Fixed height */}
      <div className="container mx-auto px-8 py-4">
        <Link 
          to="/" 
          className={`inline-flex items-center ${theme.textMuted} hover:${theme.textPrimary.replace('text-', 'text-')} transition-colors mb-3`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className={`text-3xl font-thin mb-1 ${theme.textPrimary} tracking-tight`}>
          Passenger Cars
        </h1>
        <p className={`text-base ${theme.textSecondary} font-light mb-4`}>
          Premium Automotive Intelligence
        </p>
      </div>

      {/* Section Navigation - Fixed height */}
      <div className="w-full px-8 mb-4">
        <div className="flex items-center justify-between w-full max-w-none">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className={`flex-1 mx-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-center ${theme.shadowColor} ${
                getCurrentSection() === section.id
                  ? `${theme.primary} ${theme.textPrimary} shadow-lg transform scale-105`
                  : `${theme.cardBackground} ${theme.cardBorder} border ${theme.textSecondary} ${theme.hoverEffect}`
              }`}
            >
              {section.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content - Natural height with page scrolling */}
      <div className="pb-8">
        {children}
      </div>
    </div>
  )
}

const PassengerCarsLayout = ({ children }: PassengerCarsLayoutProps) => {
  return (
    <ThemeProvider>
      <PassengerCarsLayoutContent>
        {children}
      </PassengerCarsLayoutContent>
    </ThemeProvider>
  )
}

export default PassengerCarsLayout
