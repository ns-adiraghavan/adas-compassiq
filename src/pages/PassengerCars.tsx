
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import HorizontalSectionContainer from "@/components/passenger-cars/HorizontalSectionContainer"
import AISnippetsSidebar from "@/components/passenger-cars/AISnippetsSidebar"

const PassengerCars = () => {
  const [currentSection, setCurrentSection] = useState(0)

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

      {/* Main Content Area - Full Width Sections */}
      <div className="h-[calc(100vh-200px)]">
        <HorizontalSectionContainer 
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
      </div>
    </div>
  )
}

export default PassengerCars
