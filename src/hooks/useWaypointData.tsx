
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function useWaypointData() {
  return useQuery({
    queryKey: ['waypoint-data'],
    queryFn: async () => {
      console.log('Fetching waypoint data...')
      
      // Fetch CSV data
      const { data: csvData, error: csvError } = await supabase
        .from('csv_data')
        .select('*')
        .order('uploaded_at', { ascending: false })
      
      if (csvError) {
        console.error('Error fetching CSV data:', csvError)
        throw csvError
      }

      // Fetch waypoint context data
      const { data: contextData, error: contextError } = await supabase
        .from('waypoint_data_context')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (contextError) {
        console.error('Error fetching context data:', contextError)
        throw contextError
      }

      console.log('CSV Data:', csvData)
      console.log('Context Data:', contextData)

      return {
        csvData: csvData || [],
        contextData: contextData || []
      }
    },
  })
}

export function useDashboardMetrics() {
  const { data: waypointData, isLoading } = useWaypointData()
  
  return useQuery({
    queryKey: ['dashboard-metrics', waypointData],
    queryFn: () => {
      if (!waypointData?.csvData?.length) {
        return {
          totalFeatures: 0,
          oemPartners: 0,
          globalCoverage: 0,
          availabilityRate: 0,
          dataFiles: 0,
          totalRows: 0
        }
      }

      console.log('Processing dashboard metrics...')
      
      const csvData = waypointData.csvData
      const totalRows = csvData.reduce((sum, file) => sum + (file.row_count || 0), 0)
      const dataFiles = csvData.length
      
      // Extract unique values from data using correct keys
      let uniqueOEMs = new Set()
      let uniqueCountries = new Set()
      let totalFeatureCount = 0
      
      csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.OEM) uniqueOEMs.add(row.OEM)
            if (row.Country) uniqueCountries.add(row.Country)
            if (row.Feature) totalFeatureCount++
          })
        }
      })

      const metrics = {
        totalFeatures: totalFeatureCount,
        oemPartners: uniqueOEMs.size,
        globalCoverage: uniqueCountries.size,
        availabilityRate: totalRows > 0 ? Math.round((totalFeatureCount / totalRows) * 100) : 0,
        dataFiles,
        totalRows
      }

      console.log('Calculated metrics:', metrics)
      return metrics
    },
    enabled: !isLoading && !!waypointData,
  })
}

// Hook to get the first available OEM for default selection
export function useFirstAvailableOEM() {
  const { data: waypointData, isLoading } = useWaypointData()
  
  return useQuery({
    queryKey: ['first-oem', waypointData],
    queryFn: () => {
      if (!waypointData?.csvData?.length) return null

      const uniqueOEMs = new Set<string>()
      
      waypointData.csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            if (row.OEM) {
              uniqueOEMs.add(row.OEM)
            }
          })
        }
      })

      const sortedOEMs = Array.from(uniqueOEMs).sort()
      return sortedOEMs.length > 0 ? sortedOEMs[0] : null
    },
    enabled: !isLoading && !!waypointData,
  })
}
