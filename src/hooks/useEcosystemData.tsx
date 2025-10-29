import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { normalizeOEM } from "./useGlobalFootprintData"

interface EcosystemRow {
  "OEM Name": string | null
  "Parameter": string | null
  "Attribute/Indicator": string | null
  "Sub-attribute": string | null
  "Engagement Type": string | null
  "Key Suppliers": string | null
  "OEM Product Level Strategy - Build/Buy/Hybrid": string | null
  "Remarks": string | null
}

// Map parameter categories to their attributes
const parameterMapping: Record<string, string[]> = {
  "Sensorics": ["Camera", "Radar", "Lidar"],
  "Hardware": ["SoC/AI Chips", "Other (if any)"],
  "Software": ["Software Stack"],
  "Advanced Tech": ["Cloud and Edge Service Provider", "Localization & Mapping", "Vehicle Gateway/eSIM"]
}

export const useEcosystemData = (region: string, category: string, parameter: string) => {
  return useQuery({
    queryKey: ["ecosystem", region, category, parameter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adas_collaboration_network")
        .select("*")

      if (error) throw error

      // Filter data based on selected parameter
      const attributes = parameterMapping[parameter] || []
      const filteredData = data?.filter((item: EcosystemRow) => {
        const attr = item["Attribute/Indicator"]
        return attr && attributes.includes(attr)
      })

      // Get unique OEMs and normalize names
      const oems = Array.from(
        new Set(filteredData?.map((item: EcosystemRow) => 
          item["OEM Name"] ? normalizeOEM(item["OEM Name"]) : null
        ).filter(Boolean))
      ) as string[]

      // Get unique attributes for columns
      const columnAttributes = Array.from(
        new Set(
          filteredData?.map((item: EcosystemRow) => {
            const attr = item["Attribute/Indicator"]
            const subAttr = item["Sub-attribute"]
            return subAttr && subAttr.trim() ? `${attr} - ${subAttr}` : attr
          }).filter(Boolean)
        )
      ) as string[]

      // Group data by OEM and attribute
      const oemData: Record<string, Record<string, Array<{
        supplier: string
        strategy: string
        type: string
      }>>> = {}

      filteredData?.forEach((item: EcosystemRow) => {
        const rawOEM = item["OEM Name"]
        if (!rawOEM) return
        
        const oemName = normalizeOEM(rawOEM)
        const attr = item["Attribute/Indicator"]
        const subAttr = item["Sub-attribute"]
        const column = subAttr && subAttr.trim() ? `${attr} - ${subAttr}` : attr

        if (!oemName || !column) return

        if (!oemData[oemName]) {
          oemData[oemName] = {}
        }
        if (!oemData[oemName][column]) {
          oemData[oemName][column] = []
        }

        const supplier = item["Key Suppliers"]
        const strategy = item["OEM Product Level Strategy - Build/Buy/Hybrid"]
        const type = item["Engagement Type"]

        if (supplier && supplier.trim()) {
          oemData[oemName][column].push({
            supplier: supplier.trim(),
            strategy: strategy || "",
            type: type || ""
          })
        }
      })

      return { oems, columnAttributes, oemData }
    }
  })
}
