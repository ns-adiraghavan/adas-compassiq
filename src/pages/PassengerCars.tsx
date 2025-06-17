
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import WaypointLogo from "@/components/WaypointLogo"
import OEMButtons from "@/components/OEMButtons"
import InsightsSection from "@/components/InsightsSection"
import { useFirstAvailableOEM } from "@/hooks/useWaypointData"

const PassengerCars = () => {
  const { data: firstOEM, isLoading: isLoadingFirstOEM } = useFirstAvailableOEM()
  const [selectedOEM, setSelectedOEM] = useState("")

  // Set the first available OEM as default when data is loaded
  useEffect(() => {
    if (firstOEM && !selectedOEM) {
      setSelectedOEM(firstOEM)
    }
  }, [firstOEM, selectedOEM])

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex w-full">
        <AppSidebar selectedOEM={selectedOEM} />
        
        <SidebarInset className="flex-1">
          {/* Enhanced Header */}
          <header className="relative overflow-hidden border-b border-gray-700/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="relative z-10 flex items-center justify-between p-6">
              <div className="flex items-center space-x-6">
                <SidebarTrigger className="text-white hover:bg-white/10" />
                <Link to="/">
                  <Button variant="ghost" size="sm" className="text-white hover:text-gray-300 hover:bg-white/10">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <WaypointLogo />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-light tracking-tight">Passenger Cars Intelligence</h1>
                <p className="text-white/60 font-light mt-1">Global automotive market analytics powered by AI</p>
              </div>
              <div className="w-32"></div> {/* Spacer for balance */}
            </div>
          </header>

          {/* OEM Selection */}
          <div className="px-6 py-4 border-b border-gray-700/50 bg-gray-900/30">
            <div className="max-w-7xl mx-auto">
              {isLoadingFirstOEM ? (
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-400 mr-4 flex items-center font-light">OEM Selection:</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <OEMButtons selectedOEM={selectedOEM} onOEMChange={setSelectedOEM} />
              )}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="min-h-[calc(100vh-200px)]">
            <main className="bg-gradient-to-br from-gray-900/10 to-gray-800/20">
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-light text-white mb-2">
                    Global Intelligence Dashboard
                  </h2>
                  <p className="text-white/60 font-light">
                    Comprehensive analysis of {selectedOEM} across all global markets
                  </p>
                </div>
                
                <InsightsSection selectedOEM={selectedOEM} />
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default PassengerCars
