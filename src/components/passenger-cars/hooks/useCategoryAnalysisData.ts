
import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"

interface CategoryAnalysisDataProps {
  selectedCountry: string
  selectedOEMs: string[]
  businessModelFilter?: string
  expandedCategory: string | null
  showBusinessModelInDetails?: boolean
}

export const useCategoryAnalysisData = ({
  selectedCountry,
  selectedOEMs,
  businessModelFilter,
  expandedCategory,
  showBusinessModelInDetails = false
}: CategoryAnalysisDataProps) => {
  const { data: waypointData } = useWaypointData()

  return useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { categoryData: [], expandedFeaturesData: {} }
    }

    const categoryFeatureData: Record<string, Record<string, number>> = {}
    const categoryFeatures: Record<string, any[]> = {}
    const allCategories = new Set<string>()

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            // Filter by business model type if provided
            if (businessModelFilter) {
              const businessModelType = row['Business Model Type']?.toString().trim() || 'Unknown'
              if (businessModelType !== businessModelFilter) {
                return
              }
            }
            
            const category = row.Category?.toString().trim() || 'Unknown'
            const oem = row.OEM?.toString().trim()
            
            allCategories.add(category)
            
            if (!categoryFeatureData[category]) {
              categoryFeatureData[category] = {}
              categoryFeatures[category] = []
            }
            
            categoryFeatureData[category][oem] = (categoryFeatureData[category][oem] || 0) + 1
            categoryFeatures[category].push(row)
          }
        })
      }
    })

    const categoryData = Array.from(allCategories).map(category => {
      const row: any = { name: category }
      selectedOEMs.forEach(oem => {
        const count = categoryFeatureData[category]?.[oem] || 0
        row[oem] = count
      })
      return row
    }).filter(row => selectedOEMs.some(oem => row[oem] > 0)).sort((a, b) => {
      const totalA = selectedOEMs.reduce((sum, oem) => sum + (a[oem] || 0), 0)
      const totalB = selectedOEMs.reduce((sum, oem) => sum + (b[oem] || 0), 0)
      return totalB - totalA
    })

    // Process features for expanded category
    const expandedFeaturesData: Record<string, Record<string, { available: boolean, isLighthouse?: boolean, businessModel?: string }>> = {}
    if (expandedCategory && categoryFeatures[expandedCategory]) {
      categoryFeatures[expandedCategory].forEach((feature: any) => {
        const featureName = feature.Feature?.toString().trim()
        const oem = feature.OEM?.toString().trim()
        
        if (!expandedFeaturesData[featureName]) {
          expandedFeaturesData[featureName] = {}
        }
        
        // Check if this is a lighthouse feature
        const isLighthouse = feature['Lighthouse Feature']?.toString().trim().toLowerCase() === 'yes' ||
                            feature['Lighthouse Feature']?.toString().trim().toLowerCase() === 'true' ||
                            feature['Is Lighthouse']?.toString().trim().toLowerCase() === 'yes' ||
                            feature['Is Lighthouse']?.toString().trim().toLowerCase() === 'true'
        
        expandedFeaturesData[featureName][oem] = {
          available: true,
          isLighthouse,
          businessModel: showBusinessModelInDetails ? 
            feature['Business Model Type']?.toString().trim() || 'Unknown' : undefined
        }
      })
    }

    return { categoryData, expandedFeaturesData }
  }, [waypointData, selectedCountry, selectedOEMs, businessModelFilter, expandedCategory, showBusinessModelInDetails])
}
