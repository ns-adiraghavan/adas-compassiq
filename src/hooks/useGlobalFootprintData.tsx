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
        
        // Process R&D Centers
        if (row["R&D Centers"]) {
          facilities.push({
            oem,
            location: row.Location || "",
            facilityType: "R&D Center",
            details: row["R&D Centers"]
          })
        }

        // Process Testing Facilities
        if (row["Testing Facilities"]) {
          facilities.push({
            oem,
            location: row.Location || "",
            facilityType: "Testing",
            details: row["Testing Facilities"]
          })
        }

        // Process Expansion Plans
        if (row["Expansion Plans"]) {
          facilities.push({
            oem,
            location: row.Location || "",
            facilityType: "Expansion",
            details: row["Expansion Plans"]
          })
        }
      })

      // Filter by selected OEM if provided
      let filteredFacilities = selectedOEM && selectedOEM !== "All"
        ? facilities.filter(f => f.oem.toLowerCase().includes(selectedOEM.toLowerCase()))
        : facilities

      // Filter by facility type if provided
      if (facilityType && facilityType !== "All") {
        filteredFacilities = filteredFacilities.filter(f => f.facilityType === facilityType)
      }

      // Add approximate coordinates for US locations
      const locationCoords: Record<string, {lat: number, lng: number}> = {
        "california": {lat: 36.7783, lng: -119.4179},
        "texas": {lat: 31.9686, lng: -99.9018},
        "michigan": {lat: 44.3148, lng: -85.6024},
        "arizona": {lat: 34.0489, lng: -111.0937},
        "nevada": {lat: 38.8026, lng: -116.4194},
        "ohio": {lat: 40.4173, lng: -82.9071},
        "tennessee": {lat: 35.5175, lng: -86.5804},
        "florida": {lat: 27.6648, lng: -81.5158},
      }

      filteredFacilities = filteredFacilities.map(facility => {
        const locationKey = facility.location.toLowerCase()
        const coords = locationCoords[locationKey]
        return {
          ...facility,
          lat: coords?.lat,
          lng: coords?.lng
        }
      })

      return {
        facilities: filteredFacilities,
        oems: [...new Set(facilities.map(f => f.oem))].filter(Boolean),
        facilityTypes: [...new Set(facilities.map(f => f.facilityType))].filter(Boolean)
      }
    },
  })
}
