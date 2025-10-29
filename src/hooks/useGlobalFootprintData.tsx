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

// OEM normalization function to handle naming variations
export const normalizeOEM = (oem: string): string => {
  const normalized = oem.trim()
  const lowerOEM = normalized.toLowerCase()
  
  // Handle common variations - always use consistent display names
  if (lowerOEM === 'general motors' || lowerOEM === 'gm') return 'General Motors'
  if (lowerOEM === 'rivian') return 'Rivian'
  if (lowerOEM === 'tesla') return 'Tesla'
  if (lowerOEM === 'ford') return 'Ford'
  if (lowerOEM === 'bmw') return 'BMW'
  if (lowerOEM === 'mercedes-benz' || lowerOEM === 'mercedes') return 'Mercedes-Benz'
  if (lowerOEM === 'volkswagen' || lowerOEM === 'vw') return 'Volkswagen'
  if (lowerOEM === 'audi') return 'Audi'
  if (lowerOEM === 'porsche') return 'Porsche'
  if (lowerOEM === 'volvo') return 'Volvo'
  if (lowerOEM === 'byd') return 'BYD'
  if (lowerOEM === 'nio') return 'NIO'
  if (lowerOEM === 'xpeng') return 'XPeng'
  if (lowerOEM === 'li auto') return 'Li Auto'
  if (lowerOEM === 'geely') return 'Geely'
  
  return normalized
}

// Location normalization function
export const normalizeLocation = (location: string): string => {
  return location
    .toLowerCase()
    .replace(/,\s*/g, ', ') // Normalize comma spacing
    .replace('detroit,michigan, us', 'detroit, mi')
    .replace('palo alto, california', 'palo alto, ca')
    .replace('georgia, atlanta,us', 'atlanta, ga')
    .replace('normal, illinois,us', 'normal, il')
    .replace('california', 'ca')
    .replace('michigan', 'mi')
    .replace('illinois', 'il')
    .replace('south carolina', 'sc')
    .replace(/, us$/, '') // Remove trailing ", US"
    .trim()
}

// OEM to Category mapping (using normalized names)
const oemCategoryMap: Record<string, string> = {
  'Tesla': 'oem',
  'Rivian': 'oem',
  'Ford': 'oem',
  'General Motors': 'oem',
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
        const oem = normalizeOEM(row["OEM Name"] || "")
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
            return loc.includes("us") || 
              ["california", "ca", "texas", "tx", "michigan", "mi", "arizona", "az", 
               "nevada", "nv", "ohio", "oh", "tennessee", "tn", "florida", "fl", 
               "georgia", "ga", "illinois", "il", "new york", "ny", 
               "south carolina", "sc", "pennsylvania", "pa"].some(state => loc.includes(state))
          } else if (region === "China") {
            return loc.includes("china") || loc.includes("beijing") || loc.includes("shanghai") || 
                   loc.includes("shenzhen") || loc.includes("guangzhou")
          } else if (region === "Europe") {
            return loc.includes("europe") || 
              ["germany", "france", "uk", "italy", "czech", "sweden", 
               "serbia", "spain", "netherlands"].some(country => loc.includes(country))
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

      // Filter by selected OEM if provided (normalize both sides for comparison)
      let filteredFacilities = selectedOEM && selectedOEM !== "All"
        ? categoryFilteredFacilities.filter(f => normalizeOEM(f.oem) === normalizeOEM(selectedOEM))
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
