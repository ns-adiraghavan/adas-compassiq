
import { useMemo } from "react"
import { useWaypointData } from "./useWaypointData"

export function useDashboardMetrics(selectedOEM: string, selectedCountry: string) {
  const { data: waypointData, isLoading } = useWaypointData()

  const dashboardMetrics = useMemo(() => {
    console.log('Processing waypoint data:', waypointData)
    
    if (!waypointData?.csvData || !Array.isArray(waypointData.csvData) || waypointData.csvData.length === 0) {
      return {
        totalFeatures: 0,
        totalOEMs: 0,
        totalCountries: 0,
        lighthouseFeatures: 0,
        subscriptionFeatures: 0,
        freeFeatures: 0,
        topCategories: [],
        businessModelData: [],
        countryFeatures: [],
        oemPerformance: []
      }
    }

    let totalFeatures = 0
    const uniqueOEMs = new Set<string>()
    const uniqueCountries = new Set<string>()
    let lighthouseFeatures = 0
    let subscriptionFeatures = 0
    let freeFeatures = 0
    const categoryCount: Record<string, number> = {}
    const countryFeatureCount: Record<string, number> = {}
    const oemFeatureCount: Record<string, number> = {}

    // Process CSV data
    waypointData.csvData.forEach(file => {
      console.log('Processing file:', file.file_name, 'with rows:', Array.isArray(file.data) ? file.data.length : 0)
      
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowOEM = row.OEM?.toString().trim()
          const rowCountry = row.Country?.toString().trim()
          const rowFeature = row.Feature?.toString().trim()
          
          // Apply filters
          if (selectedOEM && rowOEM !== selectedOEM) return
          if (selectedCountry && selectedCountry !== "Global" && rowCountry !== selectedCountry) return

          // Only count if we have a valid feature
          if (rowFeature && rowFeature !== '' && rowFeature.toLowerCase() !== 'n/a') {
            totalFeatures++

            // Track OEMs
            if (rowOEM && rowOEM !== '' && !rowOEM.toLowerCase().includes('merged')) {
              uniqueOEMs.add(rowOEM)
              oemFeatureCount[rowOEM] = (oemFeatureCount[rowOEM] || 0) + 1
            }

            // Track Countries
            if (rowCountry && rowCountry !== '' && 
                !['yes', 'no', 'n/a', 'na'].includes(rowCountry.toLowerCase())) {
              uniqueCountries.add(rowCountry)
              countryFeatureCount[rowCountry] = (countryFeatureCount[rowCountry] || 0) + 1
            }

            // Track Categories
            if (row.Category && row.Category.toString().trim() !== '') {
              const category = row.Category.toString().trim()
              categoryCount[category] = (categoryCount[category] || 0) + 1
            }

            // Track Lighthouse features
            if (row['Lighthouse Feature']?.toString().toLowerCase() === 'yes') {
              lighthouseFeatures++
            }

            // Track Business Models
            const businessModel = row['Business Model']?.toString().trim()
            if (businessModel?.toLowerCase() === 'subscription') {
              subscriptionFeatures++
            } else if (businessModel?.toLowerCase() === 'free') {
              freeFeatures++
            }
          }
        })
      }
    })

    // Prepare visualization data
    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, value: count }))

    const businessModelData = [
      { name: 'Subscription', value: subscriptionFeatures, color: '#10B981' },
      { name: 'Free', value: freeFeatures, color: '#3B82F6' },
      { name: 'Other', value: totalFeatures - subscriptionFeatures - freeFeatures, color: '#8B5CF6' }
    ].filter(item => item.value > 0)

    const countryFeatures = Object.entries(countryFeatureCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, count]) => ({ name: name.length > 12 ? name.substring(0, 12) + '...' : name, count }))

    const oemPerformance = Object.entries(oemFeatureCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ 
        name: name.length > 15 ? name.substring(0, 15) + '...' : name, 
        features: count,
        countries: Object.keys(countryFeatureCount).length
      }))

    console.log('Calculated metrics:', {
      totalFeatures,
      totalOEMs: uniqueOEMs.size,
      totalCountries: uniqueCountries.size,
      lighthouseFeatures,
      subscriptionFeatures,
      freeFeatures
    })

    return {
      totalFeatures,
      totalOEMs: uniqueOEMs.size,
      totalCountries: uniqueCountries.size,
      lighthouseFeatures,
      subscriptionFeatures,
      freeFeatures,
      topCategories,
      businessModelData,
      countryFeatures,
      oemPerformance
    }
  }, [waypointData, selectedOEM, selectedCountry])

  return { dashboardMetrics, isLoading }
}
