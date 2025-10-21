import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface AdvancedTechRow {
  "OEM Name": string | null
  "Parameter": string | null
  "Attribute": string | null
  "Sensing & Perception": string | null
  "Computing Hardware Suite": string | null
  "Software Stack": string | null
  "Advanced Deep Learning Architectures": string | null
  "LLM Integration": string | null
  "Standout AI Features": string | null
  "Cloud Computing": string | null
  "Edge Computing": string | null
  "Data Loop Process and Working Mechanism": string | null
}

export const useAdvancedTechnologiesData = (region: string, category: string) => {
  return useQuery({
    queryKey: ["advanced-technologies", region, category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adas_future_focused_tech")
        .select("*")

      if (error) throw error

      // Get unique OEM names
      const oems = Array.from(
        new Set(data?.map((item: AdvancedTechRow) => item["OEM Name"]).filter(Boolean))
      ) as string[]

      // Group data by OEM and collect all non-empty values
      const oemData: Record<string, Record<string, string>> = {}
      
      data?.forEach((item: AdvancedTechRow) => {
        const oemName = item["OEM Name"]
        if (!oemName) return

        if (!oemData[oemName]) {
          oemData[oemName] = {}
        }

        // Collect all fields with content
        const fields = [
          "Sensing & Perception",
          "Computing Hardware Suite",
          "Software Stack",
          "Advanced Deep Learning Architectures",
          "LLM Integration",
          "Standout AI Features",
          "Cloud Computing",
          "Edge Computing",
          "Data Loop Process and Working Mechanism"
        ]

        fields.forEach(field => {
          const value = item[field as keyof AdvancedTechRow]
          if (value && value.trim()) {
            const attribute = item["Attribute"] || field
            const key = `${field}${attribute !== field ? ` - ${attribute}` : ''}`
            oemData[oemName][key] = value
          }
        })
      })

      // Create rows for display - collect all unique parameters across all OEMs
      const allParameters = new Set<string>()
      Object.values(oemData).forEach(oemValues => {
        Object.keys(oemValues).forEach(param => allParameters.add(param))
      })

      const transformedData = Array.from(allParameters).sort().map(param => {
        const row: Record<string, string> = { parameter: param }
        
        oems.forEach(oem => {
          row[oem] = oemData[oem]?.[param] || "-"
        })

        return row
      })

      return { data: transformedData, oems }
    }
  })
}
