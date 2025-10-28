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

// OEM to Category mapping
const oemCategoryMap: Record<string, string> = {
  'Tesla': 'oem',
  'Rivian': 'oem',
  'Ford': 'oem',
  'GM': 'oem',
  'BMW': 'oem',
  'Mercedes-Benz': 'oem',
  'Volkswagen': 'oem',
  'Audi': 'oem',
  'Porsche': 'oem',
  'Volvo': 'oem',
  'BYD': 'oem',
  'NIO': 'oem',
  'XPeng': 'oem',
  'Li Auto': 'oem',
  'Geely': 'oem',
}

export const useGlobalFootprintData = (region: string, selectedCategory?: string, selectedOEM?: string, facilityType?: string) => {
  return useQuery({
    queryKey: ['global-footprint', region, selectedCategory, selectedOEM, facilityType],
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

      // Filter by category
      let categoryFilteredFacilities = regionFilteredFacilities
      if (selectedCategory && selectedCategory !== 'all') {
        categoryFilteredFacilities = regionFilteredFacilities.filter(f => 
          oemCategoryMap[f.oem] === selectedCategory
        )
      }

      // Filter by selected OEM if provided
      let filteredFacilities = selectedOEM && selectedOEM !== "All"
        ? categoryFilteredFacilities.filter(f => f.oem.toLowerCase().includes(selectedOEM.toLowerCase()))
        : categoryFilteredFacilities

      // Filter by facility type if provided
      if (facilityType && facilityType !== "All") {
        filteredFacilities = filteredFacilities.filter(f => f.facilityType === facilityType)
      }

      // Get available OEMs after category filtering
      const availableOEMs = [...new Set(categoryFilteredFacilities.map(f => f.oem))].filter(Boolean)

      return {
        facilities: filteredFacilities,
        oems: availableOEMs,
        facilityTypes: [...new Set(categoryFilteredFacilities.map(f => f.facilityType))].filter(Boolean)
      }
    },
  })
}
