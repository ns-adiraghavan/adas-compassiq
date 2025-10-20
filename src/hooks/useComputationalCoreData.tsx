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
        .or('Parameter.eq.AV System Architecture,Parameter.eq.SoC/AI Chipset Platform,Parameter.ilike.SoC%')
      
      if (error) {
        console.error('Error fetching computational core data:', error)
        throw error
      }

      console.log('Raw computational core data:', data)
      console.log('Total fetched rows:', data?.length || 0)
      console.log('Distinct Parameters:', [...new Set(data?.map((r: any) => r['Parameter']))])

      // Normalize and pivot robustly
      const parameterMap: Record<string, Record<string, string[]>> = {}
      const oemsSet = new Set<string>()

      data?.forEach((row: any) => {
        const param = row['Parameter']?.trim() || ''
        const attr = row['Attribute']?.trim() || ''
        const oem = row['OEM Name']?.trim()
        const values = row['Values']?.trim() || ''
        const unit = row['Unit']?.trim() || ''
        const remarks = row['Remarks']?.trim() || ''

        // Derive rowLabel
        let rowLabel = attr || (param === 'SoC/AI Chipset Platform' ? 'SoC/AI Chipset Platform' : null)
        
        if (!rowLabel || !oem) return

        oemsSet.add(oem)

        if (!parameterMap[rowLabel]) {
          parameterMap[rowLabel] = {}
        }

        if (!parameterMap[rowLabel][oem]) {
          parameterMap[rowLabel][oem] = []
        }

        // Prefer Remarks, else compose from Values and Unit
        const displayValue = remarks || (values ? `${values}${unit ? ' ' + unit : ''}` : '')
        if (displayValue) {
          parameterMap[rowLabel][oem].push(displayValue)
        }
      })

      // Combine multiple values per (rowLabel, OEM) and build result
      const result: ComputationalCoreData[] = Object.entries(parameterMap).map(([parameter, oemValuesArray]) => {
        const oemValues: Record<string, string> = {}
        Object.entries(oemValuesArray).forEach(([oem, valuesArr]) => {
          // Join unique values with "; "
          const uniqueValues = [...new Set(valuesArr)]
          oemValues[oem] = uniqueValues.join('; ') || '-'
        })
        return { parameter, oemValues }
      })

      // Sort parameters in logical order
      const order = [
        'SoC/AI Chipset Platform',
        'Domain Centralized Architecture',
        'Zonal Architecture',
        'Central Architecture',
        'Distributed Architecture',
        'CPU',
        'GPU',
        'NPU',
        'Overall Processing Specifications'
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
      console.log('Total rows after processing:', result.length)
      
      return { data: result, oems: Array.from(oemsSet).sort() }
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}
