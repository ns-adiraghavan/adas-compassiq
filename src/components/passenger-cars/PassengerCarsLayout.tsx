
import { ArrowLeft } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"
import ThemeSelector from "@/components/ThemeSelector"
import WaypointLogo from "@/components/WaypointLogo"

interface PassengerCarsLayoutProps {
  children: React.ReactNode
}

const PassengerCarsLayoutContent = ({ children }: PassengerCarsLayoutProps) => {
  const { theme } = useTheme()
  const location = useLocation()

  const sections = [
    { 
      id: 'landscape', 
      name: 'Landscape', 
      path: '/passenger-cars/landscape',
      activeColor: 'bg-blue-600 hover:bg-blue-700',
      inactiveColor: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      borderColor: 'border-blue-300'
    },
    { 
      id: 'analytics', 
      name: 'Category Analysis', 
      path: '/passenger-cars/analytics',
      activeColor: 'bg-purple-600 hover:bg-purple-700',
      inactiveColor: 'bg-purple-100 hover:bg-purple-200 text-purple-800',
      borderColor: 'border-purple-300'
    },
    { 
      id: 'intelligence', 
      name: 'Vehicle Segment Analysis', 
      path: '/passenger-cars/intelligence',
      activeColor: 'bg-green-600 hover:bg-green-700',
      inactiveColor: 'bg-green-100 hover:bg-green-200 text-green-800',
      borderColor: 'border-green-300'
    },
    { 
      id: 'modeling', 
      name: 'Business Model Analysis', 
      path: '/passenger-cars/modeling',
      activeColor: 'bg-orange-600 hover:bg-orange-700',
      inactiveColor: 'bg-orange-100 hover:bg-orange-200 text-orange-800',
      borderColor: 'border-orange-300'
    },
    { 
      id: 'insights', 
      name: 'Insights', 
      path: '/passenger-cars/insights',
      activeColor: 'bg-indigo-600 hover:bg-indigo-700',
      inactiveColor: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
      borderColor: 'border-indigo-300'
    },
  ]

  const getCurrentSection = () => {
    return sections.find(section => location.pathname === section.path)?.id || 'landscape'
  }

  return (
    <div className={`min-h-screen ${theme.backgroundGradient} ${theme.textPrimary} transition-all duration-500 flex flex-col`}>
      {/* Logo positioned in top right */}
      <div className="fixed top-4 right-4 z-50">
        <WaypointLogo />
      </div>
      
      {/* Header - Realigned to left top */}
      <div className="container mx-auto px-8 py-4">
        <div className="flex flex-col items-start">
          {/* Themes button at extreme top left */}
          <div className="absolute top-4 left-8 z-50">
            <ThemeSelector />
          </div>
          
          {/* Back to Home button - with top margin to account for themes button */}
          <div className="mt-12">
            <Link 
              to="/" 
              className={`inline-flex items-center ${theme.textMuted} hover:${theme.textPrimary.replace('text-', 'text-')} transition-colors mb-3`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          
          {/* Title and subtitle aligned to left */}
          <h1 className={`text-3xl font-thin mb-1 ${theme.textPrimary} tracking-tight`}>
            Passenger Cars
          </h1>
          <p className={`text-base ${theme.textSecondary} font-light mb-4`}>
            Premium Automotive Intelligence
          </p>
        </div>
      </div>

      {/* Section Navigation - Fixed height with enhanced animations */}
      <div className="w-full px-8 mb-4">
        <div className="flex items-center justify-between w-full max-w-none">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className={`flex-1 mx-1 px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg ${
                getCurrentSection() === section.id
                  ? `${section.activeColor} text-white shadow-lg scale-105 animate-scale-in`
                  : `${section.inactiveColor} ${section.borderColor} border-2 hover:border-opacity-80`
              }`}
            >
              <span className="block transition-all duration-300">
                {section.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content - Natural height with page scrolling and fade transition */}
      <div className="flex-grow pb-8 animate-fade-in">
        <div className="transition-all duration-500 ease-in-out">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto py-4">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            2025 © Netscribes. All Rights Reserved.
          </p>
        </div>
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
