import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface AVPlatformData {
  oem: string
  platformName: string
  maxAutonomyLevel: string
  platformVariants: string
  mostAdvancedVariant: string
  driverIntervention: string
}

export function useAVLandscapeData(selectedRegion: string, selectedCategory: string) {
  return useQuery({
    queryKey: ['av-landscape', selectedRegion, selectedCategory],
    queryFn: async () => {
      console.log('Fetching AV Landscape data for:', selectedRegion, selectedCategory)
      
      const { data, error } = await supabase
        .from('adas_current_snapshot' as any)
        .select('*')
        .eq('Parameter', 'AV Platform Landscape')
      
      if (error) {
        console.error('Error fetching AV landscape data:', error)
        throw error
      }

      console.log('Raw AV landscape data:', data)

      // Process the data to extract platform information
      const platformData: AVPlatformData[] = []
      const attributeMap: Record<string, any> = {}

      data?.forEach(row => {
        const oem = row['OEM Name']
        const attribute = row['Attribute']
        const remarks = row['Remarks']
        const value = row['Value']

        if (!oem || !attribute) return

        // Filter by region if needed
        if (selectedRegion && row['Country'] && row['Country'] !== selectedRegion) return

        if (!attributeMap[oem]) {
          attributeMap[oem] = {}
        }

        // Handle multiple values (Value = 2 means multiple entries in remarks)
        if (value === '2' && remarks) {
          // Split by common delimiters or newlines
          const values = remarks.split(/[;,\n]/).filter(v => v.trim())
          attributeMap[oem][attribute] = values.join(', ')
        } else {
          attributeMap[oem][attribute] = remarks || ''
        }
      })

      // Convert to array format
      Object.entries(attributeMap).forEach(([oem, attributes]: [string, any]) => {
        platformData.push({
          oem,
          platformName: attributes['Platform Name'] || '',
          maxAutonomyLevel: attributes['Maximum Autonomy Level Deployed in Vehicles'] || '',
          platformVariants: attributes['Platform Variants with L2+ and Above Capability'] || '',
          mostAdvancedVariant: attributes['Most Advanced Variant of AV Platform'] || '',
          driverIntervention: attributes['Level of Driver Intervention in Most Advanced AV Platform'] || ''
        })
      })

      console.log('Processed AV landscape data:', platformData)
      return platformData
    },
  })
}
