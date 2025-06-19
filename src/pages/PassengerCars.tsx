
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import LandscapeSection from "@/components/passenger-cars/sections/LandscapeSection"
import Section2 from "@/components/passenger-cars/sections/Section2"
import Section3 from "@/components/passenger-cars/sections/Section3"
import Section4 from "@/components/passenger-cars/sections/Section4"
import Section5 from "@/components/passenger-cars/sections/Section5"

const PassengerCars = () => {
  const sections = [
    { id: 0, name: "Landscape", component: LandscapeSection },
    { id: 1, name: "Section2", component: Section2 },
    { id: 2, name: "Section3", component: Section3 },
    { id: 3, name: "Section4", component: Section4 },
    { id: 4, name: "Section5", component: Section5 },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="container mx-auto px-8 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-thin mb-2 text-white tracking-tight">
          Passenger Cars
        </h1>
        <p className="text-lg text-white/60 font-light mb-6">
          Premium Automotive Intelligence
        </p>
      </div>

      {/* Sections - Vertical Layout */}
      <div className="w-full">
        {sections.map((section) => {
          const SectionComponent = section.component
          return (
            <div
              key={section.id}
              className="w-full min-h-screen py-8"
            >
              <div className="container mx-auto px-8 mb-8">
                <h2 className="text-2xl font-thin text-white">{section.name}</h2>
              </div>
              <SectionComponent />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PassengerCars
