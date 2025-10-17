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
    queryKey: ['av-landscape'],
    queryFn: async () => {
      console.log('Fetching AV Landscape data (region filter disabled)')
      
      const { data, error } = await supabase
        .from('adas_current_snapshot' as any)
        .select('*')
        .or('Parameter.ilike.%AV%Landscape%,Attribute.ilike.%AV%Landscape%')
      
      if (error) {
        console.error('Error fetching AV landscape data:', error)
        throw error
      }

      console.log('Raw AV landscape data:', data)

      // Process the data to extract platform information
      const platformData: AVPlatformData[] = []
      const attributeMap: Record<string, Record<string, string>> = {}

      const canonicalMap = {
        'platform name': 'Platform Name',
        'maximum autonomy level deployed in vehicles': 'Maximum Autonomy Level Deployed in Vehicles',
        'platform variants with l2+ and above capability': 'Platform Variants with L2+ and Above Capability',
        'most advanced variant of av platform': 'Most Advanced Variant of AV Platform',
        'level of driver intervention in most advanced av platform': 'Level of Driver Intervention in Most Advanced AV Platform',
      } as const

      const normalize = (s: any) => (s ?? '').toString().trim()
      const toCanonical = (attr: string) => {
        const key = attr.toLowerCase().replace(/\s+/g, ' ').trim()
        return (canonicalMap as any)[key] || attr
      }

      data?.forEach((row: any) => {
        const oem = normalize(row['OEM Name'] ?? row.OEM)
        const attributeRaw = normalize(row['Attribute'])
        const remarksRaw = normalize(row['Remarks'] ?? row['Remark'])
        const valueRaw = normalize(row['Value'])

        if (!oem || !attributeRaw) return

        const attribute = toCanonical(attributeRaw)

        if (!attributeMap[oem]) attributeMap[oem] = {}

        let content = remarksRaw
        if ((valueRaw === '2' || valueRaw === '2.0' || valueRaw.toLowerCase?.() === 'two') && remarksRaw) {
          const parts = remarksRaw.split(/[;\n,]/).map((v: string) => v.trim()).filter(Boolean)
          content = parts.join(', ')
        }

        if (attributeMap[oem][attribute]) {
          const existing = attributeMap[oem][attribute]
          const merged = Array.from(new Set((existing + ', ' + content).split(',').map((s: string) => s.trim()).filter(Boolean))).join(', ')
          attributeMap[oem][attribute] = merged
        } else {
          attributeMap[oem][attribute] = content
        }
      })

      // Convert to array format
      Object.entries(attributeMap).forEach(([oem, attributes]) => {
        platformData.push({
          oem,
          platformName: attributes['Platform Name'] || '',
          maxAutonomyLevel: attributes['Maximum Autonomy Level Deployed in Vehicles'] || '',
          platformVariants: attributes['Platform Variants with L2+ and Above Capability'] || '',
          mostAdvancedVariant: attributes['Most Advanced Variant of AV Platform'] || '',
          driverIntervention: attributes['Level of Driver Intervention in Most Advanced AV Platform'] || ''
        })
      })

      platformData.sort((a, b) => a.oem.localeCompare(b.oem))

      console.log('Processed AV landscape data:', platformData)
      return platformData
    },
  })
}
