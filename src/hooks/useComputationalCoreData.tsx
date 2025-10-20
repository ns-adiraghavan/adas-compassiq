import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ComputationalCoreData {
  parameter: string
  oemValues: Record<string, string>
}

export function useComputationalCoreData(selectedRegion: string, selectedCategory: string) {
  return useQuery({
    queryKey: ['computational-core', selectedRegion, selectedCategory],
    queryFn: async () => {
      console.log('Fetching Computational Core data')
      
      const { data, error } = await supabase
        .from('adas_onboard_compute_systems' as any)
        .select('*')
        .eq('Parameter', 'Computational Core')
      
      if (error) {
        console.error('Error fetching computational core data:', error)
        throw error
      }

      console.log('Raw computational core data:', data)

      // Group by Attribute (row) and OEM Name (column)
      const parameterMap: Record<string, Record<string, string>> = {}
      const oemsSet = new Set<string>()

      data?.forEach((row: any) => {
        const attribute = row['Attribute']?.trim()
        const oem = row['OEM Name']?.trim()
        const value = row['Values']?.trim() || ''

        if (!attribute || !oem) return

        oemsSet.add(oem)

        if (!parameterMap[attribute]) {
          parameterMap[attribute] = {}
        }

        parameterMap[attribute][oem] = value
      })

      const result: ComputationalCoreData[] = Object.entries(parameterMap).map(([parameter, oemValues]) => ({
        parameter,
        oemValues
      }))

      // Sort parameters in logical order
      const order = [
        'AV System Architecture',
        'SoC/AI Chipset Platform',
        'CPU Specifications',
        'GPU Specifications',
        'NPU Specifications'
      ]

      result.sort((a, b) => {
        const aIndex = order.indexOf(a.parameter)
        const bIndex = order.indexOf(b.parameter)
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
        if (aIndex !== -1) return -1
        if (bIndex !== -1) return 1
        return a.parameter.localeCompare(b.parameter)
      })

      console.log('Processed computational core data:', result)
      console.log('OEMs found:', Array.from(oemsSet))
      
      return { data: result, oems: Array.from(oemsSet).sort() }
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}
