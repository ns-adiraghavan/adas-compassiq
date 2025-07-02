import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface FeatureMatrixData {
  features: string[]
  matrix: Record<string, Record<string, Record<string, { available: boolean, lighthouse: boolean }>>>
}

export const useFeaturesMatrix = (
  selectedCountry: string,
  selectedOEMs: string[],
  groupingMode: GroupingMode,
  category: string | null
): FeatureMatrixData => {
  const { data: waypointData } = useWaypointData()

  return useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0 || !category) {
      return { features: [], matrix: {} }
    }

    const featureMatrix: Record<string, Record<string, Record<string, { available: boolean, lighthouse: boolean }>>> = {}
    const uniqueFeatures = new Set<string>()
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          const rowCategory = row.Category?.toString().trim()
          const rowFeature = row.Feature?.toString().trim()
          const featureAvailability = row['Feature Availability']?.toString().trim().toLowerCase()
          const lighthouseFeature = row['Lighthouse Feature']?.toString().trim().toLowerCase() === 'yes'
          
          if (rowCountry === selectedCountry &&
              rowOEM && selectedOEMs.includes(rowOEM) &&
              rowCategory === category &&
              rowFeature && rowFeature !== '' &&
              featureAvailability === 'available') {
            
            uniqueFeatures.add(rowFeature)
            
            if (!featureMatrix[rowFeature]) {
              featureMatrix[rowFeature] = {}
            }
            
            // Map to segments and OEMs
            const firstRow = file.data[0]
            const allColumns = Object.keys(firstRow)
            const segmentPatterns = [
              /segment/i, /entry/i, /mid/i, /premium/i, /luxury/i, /basic/i, /standard/i, /high/i, /executive/i
            ]
            
            const segmentColumns = allColumns.filter(column => 
              segmentPatterns.some(pattern => pattern.test(column))
            )
            
            segmentColumns.forEach(segmentCol => {
              const segmentValue = row[segmentCol]?.toString().trim().toLowerCase()
              
              if (segmentValue && segmentValue !== 'n/a' && segmentValue !== '' && 
                  (segmentValue === 'yes' || segmentValue === 'y' || segmentValue === '1' || 
                   segmentValue === 'true' || segmentValue === 'available')) {
                
                let segmentName = segmentCol.replace(/segment/i, '').trim()
                if (segmentName.toLowerCase().includes('entry')) segmentName = 'Entry'
                else if (segmentName.toLowerCase().includes('mid')) segmentName = 'Mid'
                else if (segmentName.toLowerCase().includes('premium')) segmentName = 'Premium'
                else if (segmentName.toLowerCase().includes('luxury')) segmentName = 'Luxury'
                else segmentName = segmentCol
                
                if (groupingMode === 'by-segment') {
                  if (!featureMatrix[rowFeature][segmentName]) {
                    featureMatrix[rowFeature][segmentName] = {}
                  }
                  featureMatrix[rowFeature][segmentName][rowOEM] = {
                    available: true,
                    lighthouse: lighthouseFeature
                  }
                } else {
                  if (!featureMatrix[rowFeature][rowOEM]) {
                    featureMatrix[rowFeature][rowOEM] = {}
                  }
                  featureMatrix[rowFeature][rowOEM][segmentName] = {
                    available: true,
                    lighthouse: lighthouseFeature
                  }
                }
              }
            })
          }
        })
      }
    })

    const sortedFeatures = Array.from(uniqueFeatures).sort()
    return { features: sortedFeatures, matrix: featureMatrix }
  }, [waypointData, selectedCountry, selectedOEMs, groupingMode, category])
}