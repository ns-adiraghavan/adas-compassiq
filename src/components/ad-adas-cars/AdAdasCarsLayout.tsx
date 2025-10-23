import { ArrowLeft, ChevronDown } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext"
import ThemeSelector from "@/components/ThemeSelector"
import WaypointLogo from "@/components/WaypointLogo"
import AskWayPointChatButton from "@/components/AskWayPointChatButton"
import { Button } from "@/components/ui/button"
import RegionButtons from "./RegionButtons"
import PlayerCategoryButtons from "./PlayerCategoryButtons"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface AdAdasCarsLayoutProps {
  children: React.ReactNode
}

interface ContentSectionProps {
  selectedRegion: string
  onRegionChange: (region: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  children?: React.ReactNode
}

const ContentSection = ({ 
  selectedRegion, 
  onRegionChange, 
  selectedCategory, 
  onCategoryChange,
  children
}: ContentSectionProps) => {
  const { theme } = useTheme()
  
  return (
    <div className="container mx-auto px-8 py-6 space-y-6">
      {/* Combined Filters Row - Region and Player Category on same line */}
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <div className="grid grid-cols-2 gap-8">
          <RegionButtons
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
          />
          <PlayerCategoryButtons
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>

      {/* Custom Content or Placeholder */}
      {children || (
        <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-12 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
          <div className={`text-center ${theme.textMuted}`}>
            <p className="text-lg">Content will be displayed here</p>
            <p className="text-sm mt-2">Selected: {selectedRegion} | {selectedCategory}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const AdAdasCarsLayoutContent = ({ children }: AdAdasCarsLayoutProps) => {
  const { theme } = useTheme()
  const location = useLocation()

  const sections = [
    { 
      id: 'homepage', 
      name: 'Homepage', 
      path: '/ad-adas-cars/homepage'
    },
    { 
      id: 'current-snapshot', 
      name: 'Current Snapshot', 
      path: '/ad-adas-cars/current-snapshot',
      subTabs: ['AV Landscape', 'Portfolio Dynamics', 'Operational Design Domain (ODD)']
    },
    { 
      id: 'core-systems', 
      name: 'Core Systems Breakdown', 
      path: '/ad-adas-cars/core-systems',
      subTabs: ['Sensorics', 'Computational Core', 'Driving Intelligence', 'Connectivity & Localization', 'Advanced Technologies']
    },
    { 
      id: 'future-blueprint', 
      name: 'Future Blueprint', 
      path: '/ad-adas-cars/future-blueprint',
      subTabs: ['Global Footprint', 'Key Technology Investments', 'Core Technology Roadmap', 'Vehicle-Level Roadmap']
    },
    { 
      id: 'ecosystem', 
      name: 'Ecosystem', 
      path: '/ad-adas-cars/ecosystem'
    },
  ]

  const getCurrentSection = () => {
    return sections.find(section => location.pathname === section.path)?.id || 'homepage'
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
        
        {/* Background Overlay for Header */}
        <div className="absolute inset-0 bg-black/80" />

        <div className={`relative z-10 text-white transition-all duration-500`}>
          {/* Logo positioned in top right */}
          <div className="absolute top-4 right-4 z-50">
            <WaypointLogo />
          </div>
          
          {/* Header Content */}
          <div className="relative px-8 py-4">
            {/* Themes button at extreme top left */}
            <div className="absolute top-4 left-8 z-50 flex items-center gap-3">
              <ThemeSelector />
            </div>
            
            {/* Back to Home button - positioned below theme selector */}
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
                CompassIQ — Autonomous Driving Intelligence
              </h1>
              <p className="text-base text-gray-200 font-light">
                Advanced Driver Assistance Systems & Autonomous Vehicle Technology
              </p>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="w-full px-8 mb-4">
            <div className="flex items-center justify-between w-full max-w-none">
              {sections.map((section) => (
                section.subTabs ? (
                  <HoverCard key={section.id} openDelay={0} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Link
                        to={section.path}
                        className={`flex-1 mx-1 px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center justify-center gap-1 ${
                          getCurrentSection() === section.id
                            ? `${theme.primary} text-white shadow-lg scale-105 animate-scale-in`
                            : `bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/20`
                        }`}
                      >
                        <span className="block transition-all duration-300">
                          {section.name}
                        </span>
                        <ChevronDown className="h-3 w-3" />
                      </Link>
                    </HoverCardTrigger>
                    <HoverCardContent 
                      className="w-64 p-2 bg-background/95 backdrop-blur-sm border shadow-xl z-50"
                      side="bottom"
                      align="center"
                    >
                      <div className="space-y-1">
                        {section.subTabs.map((subTab) => (
                          <Link
                            key={subTab}
                            to={`${section.path}?tab=${encodeURIComponent(subTab)}`}
                            className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                          >
                            {subTab}
                          </Link>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
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
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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

      {/* Ask WayPoint Chat Button */}
      <AskWayPointChatButton />
    </div>
  )
}

const AdAdasCarsLayout = ({ children }: AdAdasCarsLayoutProps) => {
  return (
    <ThemeProvider>
      <AdAdasCarsLayoutContent>
        {children}
      </AdAdasCarsLayoutContent>
    </ThemeProvider>
  )
}

AdAdasCarsLayout.Content = ContentSection

export default AdAdasCarsLayout
