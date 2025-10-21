import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface AdvancedTechRow {
  "OEM Name": string | null
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

      // Transform data into the format needed for the table
      const parameters = [
        "Advanced Deep Learning Architectures",
        "LLM Integration",
        "Standout AI Features",
        "Cloud Computing",
        "Edge Computing",
        "Data Loop Process and Working Mechanism"
      ]

      const transformedData = parameters.map(param => {
        const row: Record<string, string> = { parameter: param }
        
        data?.forEach((item: AdvancedTechRow) => {
          const oemName = item["OEM Name"]
          if (oemName) {
            row[oemName] = (item[param as keyof AdvancedTechRow] as string) || "-"
          }
        })

        return row
      })

      // Get unique OEM names
      const oems = Array.from(new Set(data?.map((item: AdvancedTechRow) => item["OEM Name"]).filter(Boolean))) as string[]

      return { data: transformedData, oems }
    }
  })
}
