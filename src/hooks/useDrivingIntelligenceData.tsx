import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface DrivingIntelligenceData {
  parameter: string
  oemValues: Record<string, string>
}

// OEM to Region mapping
const oemRegionMap: Record<string, string> = {
  'Tesla': 'US',
  'Rivian': 'US',
  'Ford': 'US',
  'GM': 'US',
  'BMW': 'Europe',
  'Mercedes-Benz': 'Europe',
  'Volkswagen': 'Europe',
  'Audi': 'Europe',
  'Porsche': 'Europe',
  'Volvo': 'Europe',
  'BYD': 'China',
  'NIO': 'China',
  'XPeng': 'China',
  'Li Auto': 'China',
  'Geely': 'China',
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

export function useDrivingIntelligenceData(selectedRegion: string, selectedCategory: string) {
  return useQuery({
    queryKey: ['driving-intelligence-data', selectedRegion, selectedCategory],
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

      let oems = Array.from(oemsSet).sort()

      // Filter OEMs by region
      if (selectedRegion && selectedRegion !== 'All') {
        oems = oems.filter(oem => oemRegionMap[oem] === selectedRegion)
      }

      // Filter OEMs by category
      if (selectedCategory && selectedCategory !== 'all') {
        oems = oems.filter(oem => oemCategoryMap[oem] === selectedCategory)
      }

      // Filter the data to only include filtered OEMs
      const filteredData = sortedData.map(row => ({
        parameter: row.parameter,
        oemValues: Object.keys(row.oemValues)
          .filter(oem => oems.includes(oem))
          .reduce((acc, oem) => {
            acc[oem] = row.oemValues[oem]
            return acc
          }, {} as Record<string, string>)
      }))

      return { data: filteredData, oems }
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}
