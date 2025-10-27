import { useTheme } from "@/contexts/ThemeContext"
import AVLandscapeTable from "./current-snapshot/AVLandscapeTable"
import AVLandscapeInsights from "./current-snapshot/AVLandscapeInsights"
import PortfolioDynamicsTable from "./current-snapshot/PortfolioDynamicsTable"
import ODDTable from "./current-snapshot/ODDTable"
import SensoricsTable from "./core-systems/SensoricsTable"
import ComputationalCoreTable from "./core-systems/ComputationalCoreTable"
import DrivingIntelligenceTable from "./core-systems/DrivingIntelligenceTable"
import AdvancedTechnologiesTable from "./core-systems/AdvancedTechnologiesTable"
import ConnectivityLocalizationTable from "./core-systems/ConnectivityLocalizationTable"
import GlobalFootprint from "./future-blueprint/GlobalFootprint"
import KeyTechnologyInvestments from "./future-blueprint/KeyTechnologyInvestments"
import CoreTechnologyRoadmap from "./future-blueprint/CoreTechnologyRoadmap"
import VehicleRoadmap from "./future-blueprint/VehicleRoadmap"

interface SubTabContentProps {
  selectedSubTab: string
  selectedRegion: string
  selectedCategory: string
}

const SubTabContent = ({ selectedSubTab, selectedRegion, selectedCategory }: SubTabContentProps) => {
  const { theme } = useTheme()

  // Sensorics content
  if (selectedSubTab === "Sensorics") {
    return (
      <SensoricsTable 
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
      />
    )
  }

  // AV Landscape content
  if (selectedSubTab === "AV Landscape") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AVLandscapeTable 
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="lg:col-span-1">
          <AVLandscapeInsights />
        </div>
      </div>
    )
  }

  // Portfolio Dynamics content
  if (selectedSubTab === "Portfolio Dynamics") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioDynamicsTable 
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="lg:col-span-1">
          <AVLandscapeInsights />
        </div>
      </div>
    )
  }

  // ODD content
  if (selectedSubTab === "Operational Design Domain (ODD)") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ODDTable 
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="lg:col-span-1">
          <AVLandscapeInsights />
        </div>
      </div>
    )
  }

  // Computational Core content
  if (selectedSubTab === "Computational Core") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ComputationalCoreTable 
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="lg:col-span-1">
          <AVLandscapeInsights />
        </div>
      </div>
    )
  }

  // Driving Intelligence content
  if (selectedSubTab === "Driving Intelligence") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DrivingIntelligenceTable 
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="lg:col-span-1">
          <AVLandscapeInsights />
        </div>
      </div>
    )
  }

  // Advanced Technologies content
  if (selectedSubTab === "Advanced Technologies") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdvancedTechnologiesTable 
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="lg:col-span-1">
          <AVLandscapeInsights />
        </div>
      </div>
    )
  }

  // Connectivity & Localization content
  if (selectedSubTab === "Connectivity & Localization") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ConnectivityLocalizationTable 
            selectedRegion={selectedRegion}
            selectedCategory={selectedCategory}
          />
        </div>
        <div className="lg:col-span-1">
          <AVLandscapeInsights />
        </div>
      </div>
    )
  }

  // Global Footprint content
  if (selectedSubTab === "Global Footprint") {
    return (
      <GlobalFootprint 
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
      />
    )
  }

  // Key Technology Investments content
  if (selectedSubTab === "Key Technology Investments") {
    return (
      <KeyTechnologyInvestments 
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
      />
    )
  }

  // Core Technology Roadmap content
  if (selectedSubTab === "Core Technology Roadmap") {
    return (
      <CoreTechnologyRoadmap 
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
      />
    )
  }

  // Vehicle-Level Roadmap content
  if (selectedSubTab === "Vehicle-Level Roadmap") {
    return (
      <VehicleRoadmap 
        selectedRegion={selectedRegion}
        selectedCategory={selectedCategory}
      />
    )
  }

  // Default placeholder for other tabs
  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-8 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h2 className="text-2xl font-bold mb-6">{selectedSubTab}</h2>
      <div className={`text-center ${theme.textMuted} py-12`}>
        <p className="text-lg">Content for {selectedSubTab} will be displayed here</p>
        <p className="text-sm mt-2">Region: {selectedRegion} | Category: {selectedCategory}</p>
      </div>
    </div>
  )
}

export default SubTabContent
