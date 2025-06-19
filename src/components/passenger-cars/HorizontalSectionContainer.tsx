
import { useRef, useEffect } from "react"
import LandscapeSection from "./sections/LandscapeSection"
import Section2 from "./sections/Section2"
import Section3 from "./sections/Section3"
import Section4 from "./sections/Section4"
import Section5 from "./sections/Section5"
import { useTheme } from "@/contexts/ThemeContext"

interface HorizontalSectionContainerProps {
  currentSection: number
  onSectionChange: (section: number) => void
}

const HorizontalSectionContainer = ({ currentSection, onSectionChange }: HorizontalSectionContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const sections = [
    { id: 0, name: "Landscape", component: LandscapeSection },
    { id: 1, name: "Section2", component: Section2 },
    { id: 2, name: "Section3", component: Section3 },
    { id: 3, name: "Section4", component: Section4 },
    { id: 4, name: "Section5", component: Section5 },
  ]

  const scrollToSection = (sectionIndex: number) => {
    if (containerRef.current) {
      const sectionWidth = containerRef.current.clientWidth
      containerRef.current.scrollTo({
        left: sectionIndex * sectionWidth,
        behavior: 'smooth'
      })
      onSectionChange(sectionIndex)
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft
      const sectionWidth = containerRef.current.clientWidth
      const newSection = Math.round(scrollLeft / sectionWidth)
      if (newSection !== currentSection) {
        onSectionChange(newSection)
      }
    }
  }

  return (
    <div className="h-full w-full">
      {/* Section Navigation - Full Width Distribution */}
      <div className="w-full px-8 mb-4">
        <div className="flex items-center justify-between w-full max-w-none">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex-1 mx-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${theme.shadowColor} ${
                currentSection === section.id
                  ? `${theme.primary} ${theme.textPrimary} shadow-lg transform scale-105`
                  : `${theme.cardBackground} ${theme.cardBorder} border ${theme.textSecondary} ${theme.hoverEffect}`
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scrollable Container - Full Width */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide h-full snap-x snap-mandatory w-full"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sections.map((section) => {
          const SectionComponent = section.component
          return (
            <div
              key={section.id}
              className="min-w-full h-full snap-start flex-shrink-0"
            >
              <SectionComponent />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HorizontalSectionContainer
