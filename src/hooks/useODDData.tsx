import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ODDData {
  oem: string
  geographicArea: string
  maxOperatingSpeed: string
  roadNetwork: string
  keyRegulatory: string
}

export function useODDData(selectedRegion: string, selectedCategory: string) {
  return useQuery({
    queryKey: ['odd-data', 'v1'],
    queryFn: async () => {
      console.log('Fetching ODD data')
      
      const { data, error } = await supabase
        .from('adas_current_snapshot' as any)
        .select('*')
        .eq('Parameter', 'Operational Design Domain (ODD)')
      
      if (error) {
        console.error('Error fetching ODD data:', error)
        throw error
      }

      console.log('Raw ODD data:', data)

      const oddData: ODDData[] = []
      const attributeMap: Record<string, Record<string, string>> = {}

      const canonicalMap = {
        'geographic area': 'Geographic Area',
        'max operating speed range (miles/h - mph)': 'Max Operating Speed Range (miles/h - mph)',
        'road network for l2+ and higher driving functionality (in miles)': 'Road Network for L2+ and Higher Driving Functionality (in Miles)',
        'key regulatory approvals/endorsements': 'Key Regulatory Approvals/Endorsements',
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

        let content = remarksRaw || valueRaw
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

      Object.entries(attributeMap).forEach(([oem, attributes]) => {
        oddData.push({
          oem,
          geographicArea: attributes['Geographic Area'] || '',
          maxOperatingSpeed: attributes['Max Operating Speed Range (miles/h - mph)'] || '',
          roadNetwork: attributes['Road Network for L2+ and Higher Driving Functionality (in Miles)'] || '',
          keyRegulatory: attributes['Key Regulatory Approvals/Endorsements'] || ''
        })
      })

      oddData.sort((a, b) => a.oem.localeCompare(b.oem))

      console.log('Processed ODD data:', oddData)
      return oddData
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}
