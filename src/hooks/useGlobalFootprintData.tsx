import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface FacilityLocation {
  oem: string
  location: string
  facilityType: string
  details: string
  lat?: number
  lng?: number
}

export const useGlobalFootprintData = (region: string, selectedOEM?: string, facilityType?: string) => {
  return useQuery({
    queryKey: ['global-footprint', region, selectedOEM, facilityType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adas_future_blueprint')
        .select('*')
        .or('"R&D Centers".not.is.null,"Testing Facilities".not.is.null,"Expansion Plans".not.is.null')

      if (error) throw error

      const facilities: FacilityLocation[] = []

      data?.forEach((row) => {
        const oem = row["OEM Name"] || ""
        const location = row.Location || ""
        
        // Process R&D Centers
        if (row["R&D Centers"]) {
          facilities.push({
            oem,
            location,
            facilityType: "R&D Center",
            details: row["R&D Centers"]
          })
        }

        // Process Testing Facilities and Expansion Plans (combined)
        if (row["Testing Facilities"] || row["Expansion Plans"]) {
          const details = [row["Testing Facilities"], row["Expansion Plans"]].filter(Boolean).join("; ")
          facilities.push({
            oem,
            location,
            facilityType: "Testing & Expansion",
            details
          })
        }
      })

      // Filter by region first
      let regionFilteredFacilities = facilities
      if (region !== "Global") {
        regionFilteredFacilities = facilities.filter(f => {
          const loc = f.location.toLowerCase()
          if (region === "US") {
            return ["california", "texas", "michigan", "arizona", "nevada", "ohio", "tennessee", "florida"].some(state => loc.includes(state))
          } else if (region === "China") {
            return loc.includes("china") || loc.includes("beijing") || loc.includes("shanghai") || loc.includes("shenzhen") || loc.includes("guangzhou")
          } else if (region === "Europe") {
            return loc.includes("germany") || loc.includes("france") || loc.includes("uk") || loc.includes("italy") || loc.includes("czech")
          }
          return true
        })
      }

      // Filter by selected OEM if provided
      let filteredFacilities = selectedOEM && selectedOEM !== "All"
        ? regionFilteredFacilities.filter(f => f.oem.toLowerCase().includes(selectedOEM.toLowerCase()))
        : regionFilteredFacilities

      // Filter by facility type if provided
      if (facilityType && facilityType !== "All") {
        filteredFacilities = filteredFacilities.filter(f => f.facilityType === facilityType)
      }

      return {
        facilities: filteredFacilities,
        oems: [...new Set(regionFilteredFacilities.map(f => f.oem))].filter(Boolean),
        facilityTypes: [...new Set(regionFilteredFacilities.map(f => f.facilityType))].filter(Boolean)
      }
    },
  })
}
