import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface DrivingIntelligenceData {
  parameter: string
  oemValues: Record<string, string>
}

export function useDrivingIntelligenceData(selectedRegion: string, selectedCategory: string) {
  return useQuery({
    queryKey: ['driving-intelligence-data', 'v1'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adas_software')
        .select('*')

      if (error) throw error

      // Process the data to create a structured format
      const processedData: Record<string, DrivingIntelligenceData> = {}
      const oemsSet = new Set<string>()

      data?.forEach((row) => {
        const oem = row['OEM Name']
        if (!oem) return
        
        oemsSet.add(oem)

        // Map the parameters
        const parameters = [
          { key: 'Operating System', value: row['OS Compatibility'] },
          { key: 'Middleware', value: row['Middleware Platform'] },
          { key: 'In-house AD Software Development Capability', value: row['Software Development Approach'] },
          { key: 'OTA_FOTA Capability', value: row['OTA_FOTA'] },
          { key: 'OTA_SOTA Capability', value: row['OTA_SOTA'] },
          { key: 'Cybersecurity Approach', value: row['Cybersecurity Approach'] },
          { key: 'Strategic Approach', value: row['Strategic Approach Towards Software platform'] },
        ]

        parameters.forEach(({ key, value }) => {
          if (!processedData[key]) {
            processedData[key] = {
              parameter: key,
              oemValues: {}
            }
          }
          if (value) {
            processedData[key].oemValues[oem] = value
          }
        })
      })

      // Convert to array and sort by parameter order
      const parameterOrder = [
        'Operating System',
        'Middleware',
        'In-house AD Software Development Capability',
        'OTA_FOTA Capability',
        'OTA_SOTA Capability',
        'Cybersecurity Approach',
        'Strategic Approach'
      ]

      const sortedData = parameterOrder
        .filter(param => processedData[param])
        .map(param => processedData[param])

      const oems = Array.from(oemsSet).sort()

      return { data: sortedData, oems }
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}
