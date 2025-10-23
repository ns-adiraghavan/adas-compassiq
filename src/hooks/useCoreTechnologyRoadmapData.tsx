import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface CoreTechnologyData {
  oem: string
  sensingPerception: string
  computingHardware: string
  systemSoftware: string
  hardwareAspiration: string
  softwareAspiration: string
  aiIntegration: string
  others: string
}

export const useCoreTechnologyRoadmapData = (region: string, selectedOEM?: string) => {
  return useQuery({
    queryKey: ['core-technology-roadmap', region, selectedOEM],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adas_future_blueprint')
        .select('*')
        .eq('Parameter', 'In-house Technology Development Approach')

      if (error) throw error

      const technologiesMap = new Map<string, CoreTechnologyData>()

      data?.forEach((row) => {
        const oem = row["OEM Name"] || ""
        
        if (!technologiesMap.has(oem)) {
          technologiesMap.set(oem, {
            oem,
            sensingPerception: row["Sensing and Perception"] || "",
            computingHardware: row["Computing Hardware"] || "",
            systemSoftware: row["System Software"] || "",
            hardwareAspiration: row["Hardware Aspiration"] || "",
            softwareAspiration: row["Software Aspiration"] || "",
            aiIntegration: row["AI Integration"] || "",
            others: row["Others (if any)"] || ""
          })
        }
      })

      let technologies = Array.from(technologiesMap.values())

      // Filter by selected OEM if provided
      if (selectedOEM && selectedOEM !== "All") {
        technologies = technologies.filter(tech => 
          tech.oem.toLowerCase().includes(selectedOEM.toLowerCase())
        )
      }

      return {
        technologies,
        oems: [...new Set(technologies.map(t => t.oem))].filter(Boolean)
      }
    },
  })
}
