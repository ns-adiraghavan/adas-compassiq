import { useMemo } from "react"
import { useWaypointData } from "./useWaypointData"

interface LandscapeAnalysisData {
  selectedOEM: string
  selectedCountry: string
  ranking: {
    rank: number
    totalOEMs: number
    availableFeatures: number
    lighthouseFeatures: number
  }
  topCategories: Array<{
    category: string
    count: number
  }>
  lighthouseFeaturesList: string[]
  categoryDistribution: Array<{
    category: string
    count: number
  }>
  businessModels: Array<{
    model: string
    count: number
  }>
}

export function useLandscapeAnalysisData(selectedOEM: string, selectedCountry: string): LandscapeAnalysisData | null {
  const { data: waypointData } = useWaypointData()

  return useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedOEM || !selectedCountry) return null

    console.log('Processing landscape analysis data for:', selectedOEM, selectedCountry)

    // 1. Calculate ranking data
    const oemAvailableFeatureCounts = new Map<string, number>()
    const oemLighthouseFeatureCounts = new Map<string, number>()
    const categoryCounts = new Map<string, number>()
    const businessModelCounts = new Map<string, number>()
    const lighthouseFeaturesList: string[] = []

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          // Filter by country
          const country = row.Country || row.country || row['Country '] || row[' Country']
          if (selectedCountry && country?.toString().trim() !== selectedCountry) return

          // Filter by availability
          const featureAvailability = row['Feature Availability'] || 
                                    row['Available Feature'] || 
                                    row['Available_Feature'] || 
                                    row.available_feature || 
                                    row.AvailableFeature ||
                                    row['feature_availability'] ||
                                    row['FEATURE AVAILABILITY']

          if (!featureAvailability || 
              featureAvailability.toString().trim().toLowerCase() !== 'available') return

          // Process OEM data
          const oem = row.OEM || row.oem || row['OEM '] || row[' OEM']
          if (oem && typeof oem === 'string' && 
              !oem.toLowerCase().includes('merged') &&
              !oem.toLowerCase().includes('monitoring') &&
              !oem.toLowerCase().includes('total')) {
            
            const oemName = oem.toString().trim()
            oemAvailableFeatureCounts.set(oemName, (oemAvailableFeatureCounts.get(oemName) || 0) + 1)

            // Check lighthouse features
            const isLighthouse = row['Lighthouse Feature'] || 
                               row['Lighthouse_Feature'] || 
                               row.lighthouse_feature || 
                               row.LighthouseFeature ||
                               row['lighthouse feature'] ||
                               row['LIGHTHOUSE FEATURE']

            if (isLighthouse && isLighthouse.toString().trim().toLowerCase() === 'yes') {
              oemLighthouseFeatureCounts.set(oemName, (oemLighthouseFeatureCounts.get(oemName) || 0) + 1)
              
              // Collect lighthouse features for selected OEM
              if (oemName === selectedOEM) {
                const feature = row.Feature || row.feature || row['Feature '] || row[' Feature']
                if (feature && typeof feature === 'string' && feature.trim() !== '') {
                  lighthouseFeaturesList.push(feature.toString().trim())
                }
              }
            }

            // Collect categories for selected OEM
            if (oemName === selectedOEM) {
              const category = row.Category || row.category || row['Category '] || row[' Category']
              if (category && typeof category === 'string' && category.trim() !== '') {
                const categoryName = category.toString().trim()
                categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1)
              }

              // Collect business models for selected OEM
              const businessModel = row['Business Model'] || row['business_model'] || row.BusinessModel || row['BUSINESS MODEL']
              if (businessModel && typeof businessModel === 'string' && businessModel.trim() !== '') {
                const modelName = businessModel.toString().trim()
                businessModelCounts.set(modelName, (businessModelCounts.get(modelName) || 0) + 1)
              }
            }
          }
        })
      }
    })

    // Calculate ranking
    const sortedOEMs = Array.from(oemAvailableFeatureCounts.entries()).sort((a, b) => b[1] - a[1])
    const rank = sortedOEMs.findIndex(([oem]) => oem === selectedOEM) + 1
    const availableFeatures = oemAvailableFeatureCounts.get(selectedOEM) || 0
    const lighthouseFeatures = oemLighthouseFeatureCounts.get(selectedOEM) || 0
    const totalOEMs = oemAvailableFeatureCounts.size

    // Process categories
    const topCategories = Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    // Process category distribution for charts
    const categoryDistribution = Array.from(categoryCounts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    // Process business models
    const businessModels = Array.from(businessModelCounts.entries())
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count)

    const result: LandscapeAnalysisData = {
      selectedOEM,
      selectedCountry,
      ranking: {
        rank,
        totalOEMs,
        availableFeatures,
        lighthouseFeatures
      },
      topCategories,
      lighthouseFeaturesList: Array.from(new Set(lighthouseFeaturesList)).slice(0, 5),
      categoryDistribution,
      businessModels
    }

    console.log('Landscape analysis data:', result)
    return result
  }, [waypointData, selectedOEM, selectedCountry])
}