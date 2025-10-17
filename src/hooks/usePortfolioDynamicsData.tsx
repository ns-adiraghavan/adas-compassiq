import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface PortfolioDynamicsData {
  oem: string
  modelsEquipped: string
  mostAdvancedModel: string
  salesOfAdvancedModel: string
  penetrationRate: string
}

export function usePortfolioDynamicsData(selectedRegion: string, selectedCategory: string) {
  return useQuery({
    queryKey: ['portfolio-dynamics', 'v1'],
    queryFn: async () => {
      console.log('Fetching Portfolio Dynamics data')
      
      const { data, error } = await supabase
        .from('adas_current_snapshot' as any)
        .select('*')
        .eq('Parameter', 'Vehicle Portfolio Dynamics for AV Platform')
      
      if (error) {
        console.error('Error fetching portfolio dynamics data:', error)
        throw error
      }

      console.log('Raw portfolio dynamics data:', data)

      const portfolioData: PortfolioDynamicsData[] = []
      const attributeMap: Record<string, Record<string, string>> = {}

      const canonicalMap = {
        'models equipped with l2+ and above autonomy': 'Models Equipped with L2+ and Above Autonomy',
        'most advanced av model': 'Most Advanced AV Model',
        'sales of most advanced av model': 'Sales of Most Advanced AV Model',
        'penetration across product portfolio for l2+ and above platform (%)': 'Penetration Across Product Portfolio for L2+ and Above Platform (%)',
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
        portfolioData.push({
          oem,
          modelsEquipped: attributes['Models Equipped with L2+ and Above Autonomy'] || '',
          mostAdvancedModel: attributes['Most Advanced AV Model'] || '',
          salesOfAdvancedModel: attributes['Sales of Most Advanced AV Model'] || '',
          penetrationRate: attributes['Penetration Across Product Portfolio for L2+ and Above Platform (%)'] || ''
        })
      })

      portfolioData.sort((a, b) => a.oem.localeCompare(b.oem))

      console.log('Processed portfolio dynamics data:', portfolioData)
      return portfolioData
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}
