import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ConnectivityLocalizationRow {
  category: string
  parameter: string
  oemValues: Record<string, string>
}

export function useConnectivityLocalizationData(selectedRegion: string, selectedCategory: string) {
  return useQuery({
    queryKey: ['connectivity-localization', selectedRegion, selectedCategory],
    queryFn: async () => {
      console.log('Fetching Connectivity & Localization data')
      
      const { data, error } = await supabase
        .from('adas_comms_and_positioning_tech' as any)
        .select('*')
      
      if (error) {
        console.error('Error fetching connectivity localization data:', error)
        throw error
      }

      console.log('Raw connectivity localization data:', data)

      // Group data by categories
      const categories = [
        {
          name: 'Vision & Perception',
          fields: ['Traffic Light & Sign Recognition', 'Road Type Identification', 'Dynamic Object Detection', 'Others/Additional info']
        },
        {
          name: 'Communication',
          fields: ['Wireless Communication Network', 'In-Vehicle Data Transfer']
        },
        {
          name: 'Mapping & Localization',
          fields: ['HD Maps', '3D Maps', 'Remarks/Others']
        }
      ]

      const oemsSet = new Set<string>()
      const rowsMap: Record<string, ConnectivityLocalizationRow> = {}

      data?.forEach((row: any) => {
        const oem = row['OEM Name']?.trim()
        if (!oem) return
        oemsSet.add(oem)

        categories.forEach(category => {
          category.fields.forEach(field => {
            const value = row[field]?.trim()
            if (value) {
              const key = `${category.name}|${field}`
              if (!rowsMap[key]) {
                rowsMap[key] = {
                  category: category.name,
                  parameter: field,
                  oemValues: {}
                }
              }
              rowsMap[key].oemValues[oem] = value
            }
          })
        })
      })

      const result = Object.values(rowsMap)

      console.log('Processed connectivity localization data:', result)
      console.log('OEMs found:', Array.from(oemsSet))
      
      return { data: result, oems: Array.from(oemsSet).sort() }
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}
