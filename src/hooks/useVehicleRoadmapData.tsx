import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface VehicleRoadmapData {
  oem: string
  nextGenPlatform: string
  upcomingModels: string
  newFeatures: string
  strategicInitiatives: string
  strategicRoadmap: string
  remarks: string
}

export const useVehicleRoadmapData = (region: string, selectedOEM?: string) => {
  return useQuery({
    queryKey: ['vehicle-roadmap', region, selectedOEM],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adas_future_blueprint')
        .select('*')
        .or('"Next-Gen Vehicle Platform".not.is.null,"Upcoming Vehicle Models".not.is.null,"New Features in the Pipeline".not.is.null,"Strategic Initiatives".not.is.null,"Strategic Roadmap and Aspiration".not.is.null')

      if (error) throw error

      const vehiclesMap = new Map<string, VehicleRoadmapData>()

      data?.forEach((row) => {
        const oem = row["OEM Name"] || ""
        
        if (!vehiclesMap.has(oem) && oem) {
          vehiclesMap.set(oem, {
            oem,
            nextGenPlatform: row["Next-Gen Vehicle Platform"] || "",
            upcomingModels: row["Upcoming Vehicle Models"] || "",
            newFeatures: row["New Features in the Pipeline"] || "",
            strategicInitiatives: row["Strategic Initiatives"] || "",
            strategicRoadmap: row["Strategic Roadmap and Aspiration"] || "",
            remarks: row.Remarks || ""
          })
        } else if (oem && vehiclesMap.has(oem)) {
          // Merge data if there are multiple rows for same OEM
          const existing = vehiclesMap.get(oem)!
          vehiclesMap.set(oem, {
            ...existing,
            nextGenPlatform: existing.nextGenPlatform || row["Next-Gen Vehicle Platform"] || "",
            upcomingModels: existing.upcomingModels || row["Upcoming Vehicle Models"] || "",
            newFeatures: existing.newFeatures || row["New Features in the Pipeline"] || "",
            strategicInitiatives: existing.strategicInitiatives || row["Strategic Initiatives"] || "",
            strategicRoadmap: existing.strategicRoadmap || row["Strategic Roadmap and Aspiration"] || "",
            remarks: existing.remarks || row.Remarks || ""
          })
        }
      })

      let vehicles = Array.from(vehiclesMap.values())

      // Filter by selected OEM if provided
      if (selectedOEM && selectedOEM !== "All") {
        vehicles = vehicles.filter(v => 
          v.oem.toLowerCase().includes(selectedOEM.toLowerCase())
        )
      }

      return {
        vehicles,
        oems: [...new Set(vehicles.map(v => v.oem))].filter(Boolean)
      }
    },
  })
}
