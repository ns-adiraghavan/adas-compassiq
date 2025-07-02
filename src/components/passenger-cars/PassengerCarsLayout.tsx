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
    <div className={`min-h-screen flex flex-col ${theme.backgroundGradient} transition-all duration-500`}>
      {/* Header Section with Background Image */}
      <div className="relative">
        {/* Background Image for Header Only */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://ymnnvlhzdftchppusxkx.supabase.co/storage/v1/object/public/documents/uploads/bg-1.jpg')`,
          }}
        />
        
        {/* Background Overlay for Header - made darker */}
        <div className="absolute inset-0 bg-black/80" />

        <div className={`relative z-10 text-white transition-all duration-500`}>
          {/* Logo positioned in top right */}
          <div className="absolute top-4 right-4 z-50">
            <WaypointLogo />
          </div>
          
          {/* Header Content */}
          <div className="relative px-8 py-4">
            {/* Themes button at extreme top left */}
            <div className="absolute top-4 left-8 z-50">
              <ThemeSelector />
            </div>
            
            {/* Back to Home button - positioned below theme selector, aligned to left */}
            <div className="mt-12 mb-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
            
            {/* Title and subtitle aligned to left */}
            <div className="mb-4">
              <h1 className="text-3xl font-thin mb-1 text-white tracking-tight">
                {getPageTitle()}
              </h1>
              <p className="text-base text-gray-200 font-light">
                Premium Automotive Intelligence
              </p>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="w-full px-8 mb-4">
            <div className="flex items-center justify-between w-full max-w-none">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  to={section.path}
                  className={`flex-1 mx-1 px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg ${
                    getCurrentSection() === section.id
                      ? `${theme.primary} text-white shadow-lg scale-105 animate-scale-in`
                      : `bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20`
                  }`}
                >
                  <span className="block transition-all duration-300">
                    {section.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
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
