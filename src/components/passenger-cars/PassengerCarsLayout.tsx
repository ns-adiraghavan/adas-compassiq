
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
      path: '/passenger-cars/landscape'
    },
    { 
      id: 'analytics', 
      name: 'Category Analysis', 
      path: '/passenger-cars/analytics'
    },
    { 
      id: 'intelligence', 
      name: 'Vehicle Segment Analysis', 
      path: '/passenger-cars/intelligence'
    },
    { 
      id: 'modeling', 
      name: 'Business Model Analysis', 
      path: '/passenger-cars/modeling'
    },
    { 
      id: 'insights', 
      name: 'Insights', 
      path: '/passenger-cars/insights'
    },
  ]

  const getCurrentSection = () => {
    return sections.find(section => location.pathname === section.path)?.id || 'landscape'
  }

  const getPageTitle = () => {
    const currentSection = getCurrentSection()
    if (currentSection === 'landscape') {
      return 'Passenger Cars - Connected Features Module'
    }
    return 'Passenger Cars'
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/5e73caf8-0d46-4b38-8cc5-db32acbd9c64.png')`,
          zIndex: -2
        }}
      />
      
      {/* Background Overlay */}
      <div 
        className={`absolute inset-0 ${theme.backgroundGradient} transition-all duration-500`}
        style={{ zIndex: -1 }}
      />

      <div className={`relative z-10 min-h-screen ${theme.textPrimary} transition-all duration-500 flex flex-col`}>
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
              {getPageTitle()}
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
                    ? `${theme.primary} text-white shadow-lg scale-105 animate-scale-in`
                    : `${theme.cardBackground} ${theme.cardBorder} border-2 ${theme.textSecondary} ${theme.hoverEffect}`
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
