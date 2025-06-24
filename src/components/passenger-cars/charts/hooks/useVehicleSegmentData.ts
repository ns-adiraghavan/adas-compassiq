
import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import type { ProcessedData, GroupingMode } from "../types/VehicleSegmentTypes"

export function useVehicleSegmentData(
  selectedCountry: string,
  selectedOEMs: string[],
  groupingMode: GroupingMode
): ProcessedData {
  const { data: waypointData } = useWaypointData()

  return useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { chartData: [], availableSegments: [], hasData: false, debugInfo: {}, segmentFeatureMap: new Map(), oemFeatureMap: new Map() }
    }

    console.log('Processing vehicle segment data for:', { selectedCountry, selectedOEMs })

    const segmentFeatureMap = new Map<string, Map<string, number>>()
    const oemFeatureMap = new Map<string, Map<string, number>>()
    const availableSegments = new Set<string>()
    
    let detectedSegmentColumns: string[] = []
    let debugInfo: any = {
      totalRows: 0,
      processedRows: 0,
      availableColumns: [],
      segmentColumns: [],
      sampleData: []
    }

    // Analyze available columns
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data) && file.data.length > 0) {
        const firstRow = file.data[0]
        const allColumns = Object.keys(firstRow)
        debugInfo.availableColumns = allColumns
        
        console.log('All available columns:', allColumns)
        
        // Look for segment-related columns
        const segmentPatterns = [
          /segment/i, /entry/i, /mid/i, /premium/i, /luxury/i, /basic/i, /standard/i, /high/i, /executive/i
        ]
        
        allColumns.forEach(column => {
          if (segmentPatterns.some(pattern => pattern.test(column))) {
            detectedSegmentColumns.push(column)
          }
        })
        
        debugInfo.segmentColumns = detectedSegmentColumns
        debugInfo.sampleData = file.data.slice(0, 3)
      }
    })

    console.log('Detected segment columns:', detectedSegmentColumns)

    // Process data
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          debugInfo.totalRows++
          
          if (row.Country === selectedCountry && 
              selectedOEMs.includes(row.OEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available' &&
              row.Feature && row.Feature.toString().trim() !== '') {
            
            debugInfo.processedRows++
            const oem = row.OEM.toString().trim()
            const feature = row.Feature.toString().trim()
            
            // Check segment columns
            if (detectedSegmentColumns.length > 0) {
              detectedSegmentColumns.forEach(segmentCol => {
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
                  
                  availableSegments.add(segmentName)
                  
                  // Update segment → OEM mapping
                  if (!segmentFeatureMap.has(segmentName)) {
                    segmentFeatureMap.set(segmentName, new Map())
                  }
                  const segmentOEMs = segmentFeatureMap.get(segmentName)!
                  segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
                  
                  // Update OEM → segment mapping
                  if (!oemFeatureMap.has(oem)) {
                    oemFeatureMap.set(oem, new Map())
                  }
                  const oemSegments = oemFeatureMap.get(oem)!
                  oemSegments.set(segmentName, (oemSegments.get(segmentName) || 0) + 1)
                }
              })
            } else {
              // Fallback to category-based segmentation
              const category = row.Category?.toString().trim() || 'General'
              availableSegments.add(category)
              
              if (!segmentFeatureMap.has(category)) {
                segmentFeatureMap.set(category, new Map())
              }
              const segmentOEMs = segmentFeatureMap.get(category)!
              segmentOEMs.set(oem, (segmentOEMs.get(oem) || 0) + 1)
              
              if (!oemFeatureMap.has(oem)) {
                oemFeatureMap.set(oem, new Map())
              }
              const oemSegments = oemFeatureMap.get(oem)!
              oemSegments.set(category, (oemSegments.get(category) || 0) + 1)
            }
          }
        })
      }
    })

    const segments = Array.from(availableSegments).sort()
    console.log('Final processing results:', { segments, debugInfo })

    // Build chart data based on grouping mode
    let chartData: any[] = []
    
    if (groupingMode === 'by-oem') {
      // Group by OEM (OEMs on X-axis, segments as separate bars)
      chartData = selectedOEMs.map(oem => {
        const item: any = { name: oem }
        const oemSegments = oemFeatureMap.get(oem) || new Map()
        
        segments.forEach(segment => {
          item[segment] = oemSegments.get(segment) || 0
        })
        
        return item
      }).filter(item => segments.some(segment => item[segment] > 0))
    } else {
      // Group by segment (Segments on X-axis, OEMs as separate bars)
      chartData = segments.map(segment => {
        const item: any = { name: segment }
        const segmentOEMs = segmentFeatureMap.get(segment) || new Map()
        
        selectedOEMs.forEach(oem => {
          item[oem] = segmentOEMs.get(oem) || 0
        })
        
        return item
      }).filter(item => selectedOEMs.some(oem => item[oem] > 0))
    }

    return { 
      chartData, 
      availableSegments: segments, 
      hasData: chartData.length > 0,
      debugInfo,
      segmentFeatureMap,
      oemFeatureMap
    }
  }, [waypointData, selectedCountry, selectedOEMs, groupingMode])
}
