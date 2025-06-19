
import { useRef, useEffect } from "react"
import LandscapeSection from "./sections/LandscapeSection"
import Section2 from "./sections/Section2"
import Section3 from "./sections/Section3"
import Section4 from "./sections/Section4"
import Section5 from "./sections/Section5"

interface HorizontalSectionContainerProps {
  currentSection: number
  onSectionChange: (section: number) => void
}

const HorizontalSectionContainer = ({ currentSection, onSectionChange }: HorizontalSectionContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

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
    <div className="h-full">
      {/* Section Navigation */}
      <div className="flex items-center justify-center mb-4 space-x-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentSection === section.id
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide h-full snap-x snap-mandatory"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sections.map((section) => {
          const SectionComponent = section.component
          return (
            <div
              key={section.id}
              className="min-w-full h-full snap-start flex-shrink-0 px-4"
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
