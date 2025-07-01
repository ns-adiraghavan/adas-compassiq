import { useMemo } from "react"
import { useWaypointData } from "./useWaypointData"

interface VehicleSegmentContextData {
  analysisType: 'vehicle-segment-analysis'
  selectedOEMs: string[]
  selectedCountry: string
  totalFeatures: number
  vehicleSegments: Array<{
    segment: string
    total: number
    oemDistribution: Record<string, number>
  }>
}

export function useVehicleSegmentContext(
  selectedOEMs: string[], 
  selectedCountry: string
): VehicleSegmentContextData | null {
  const { data: waypointData } = useWaypointData()

  return useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return null
    }

    console.log('Processing vehicle segment context for:', selectedOEMs, selectedCountry)

    const segmentData: Record<string, Record<string, number>> = {}
    let totalFeatures = 0

    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            const segment = row['Vehicle Segment']?.toString().trim() || 'Unknown'
            const oem = row.OEM?.toString().trim()
            
            if (!segmentData[segment]) {
              segmentData[segment] = {}
            }
            
            segmentData[segment][oem] = (segmentData[segment][oem] || 0) + 1
            totalFeatures++
          }
        })
      }
    })

    const vehicleSegments = Object.entries(segmentData).map(([segment, oemCounts]) => ({
      segment,
      total: Object.values(oemCounts).reduce((sum, count) => sum + count, 0),
      oemDistribution: oemCounts
    })).sort((a, b) => b.total - a.total)

    const result: VehicleSegmentContextData = {
      analysisType: 'vehicle-segment-analysis',
      selectedOEMs,
      selectedCountry,
      totalFeatures,
      vehicleSegments
    }

    console.log('Vehicle segment context:', result)
    return result
  }, [waypointData, selectedOEMs, selectedCountry])
}