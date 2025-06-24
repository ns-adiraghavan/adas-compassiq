
import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { extractVehicleSegments } from "../utils/segmentDetection"
import type { ProcessedData, GroupingMode } from "../types/VehicleSegmentTypes"

export function useVehicleSegmentData(
  selectedCountry: string,
  selectedOEMs: string[],
  groupingMode: GroupingMode
): ProcessedData {
  const { data: waypointData } = useWaypointData()

  return useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { 
        chartData: [], 
        availableSegments: [], 
        hasData: false, 
        debugInfo: {}, 
        segmentFeatureMap: new Map(), 
        oemFeatureMap: new Map(),
        detailedFeatureData: new Map()
      }
    }

    console.log('Processing vehicle segment data for:', { selectedCountry, selectedOEMs })

    const segmentFeatureMap = new Map<string, Map<string, number>>()
    const oemFeatureMap = new Map<string, Map<string, number>>()
    const detailedFeatureData = new Map<string, Array<{ oem: string; category: string; feature: string; segment: string; isLighthouse: boolean }>>()
    
    let debugInfo: any = {
      totalRows: 0,
      processedRows: 0,
      availableColumns: [],
      segmentColumns: [],
      sampleData: []
    }

    const segments = extractVehicleSegments(waypointData, selectedCountry, selectedOEMs)

    // Get column headers based on grouping mode
    const columnHeaders = (() => {
      if (groupingMode === 'by-oem') {
        return selectedOEMs.map(oem => oem.length > 12 ? oem.substring(0, 12) + '...' : oem)
      } else {
        return segments
      }
    })()

    // Process data using the same structure as VehicleSegmentCategoryTable
    const categoryData: Record<string, Record<string, number>> = {}
    
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        debugInfo.totalRows += file.data.length
        
        if (file.data.length > 0) {
          const firstRow = file.data[0]
          const allColumns = Object.keys(firstRow)
          debugInfo.availableColumns = allColumns
          debugInfo.sampleData = file.data.slice(0, 3)
        }

        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          const rowCategory = row.Category?.toString().trim()
          const featureAvailability = row['Feature Availability']?.toString().trim().toLowerCase()
          const feature = row.Feature?.toString().trim()
          const isLighthouse = row['Lighthouse Feature']?.toString().trim().toLowerCase() === 'yes'
          
          if (rowCountry === selectedCountry &&
              rowOEM && selectedOEMs.includes(rowOEM) &&
              rowCategory && rowCategory !== '' &&
              featureAvailability === 'available') {
            
            debugInfo.processedRows++
            
            if (!categoryData[rowCategory]) {
              categoryData[rowCategory] = {}
              // Initialize all columns to 0
              if (groupingMode === 'by-oem') {
                selectedOEMs.forEach(oem => {
                  const displayOem = oem.length > 12 ? oem.substring(0, 12) + '...' : oem
                  categoryData[rowCategory][displayOem] = 0
                })
              } else {
                segments.forEach(segment => {
                  categoryData[rowCategory][segment] = 0
                })
              }
            }
            
            if (groupingMode === 'by-oem') {
              // Count by OEM - OEMs as columns
              const displayOem = rowOEM.length > 12 ? rowOEM.substring(0, 12) + '...' : rowOEM
              categoryData[rowCategory][displayOem]++
              
              // Store detailed feature data
              if (!detailedFeatureData.has(displayOem)) {
                detailedFeatureData.set(displayOem, [])
              }
              detailedFeatureData.get(displayOem)!.push({ 
                oem: rowOEM, category: rowCategory, feature, segment: 'N/A', isLighthouse 
              })
            } else {
              // Count by segment - segments as columns
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
                  
                  if (categoryData[rowCategory][segmentName] !== undefined) {
                    categoryData[rowCategory][segmentName]++
                  }
                  
                  // Store detailed feature data
                  if (!detailedFeatureData.has(segmentName)) {
                    detailedFeatureData.set(segmentName, [])
                  }
                  detailedFeatureData.get(segmentName)!.push({ 
                    oem: rowOEM, category: rowCategory, feature, segment: segmentName, isLighthouse 
                  })
                }
              })
            }
          }
        })
      }
    })

    // Convert to chart data format - transposed structure
    const chartData = Object.entries(categoryData)
      .map(([category, counts]) => {
        const row: any = { name: category }
        columnHeaders.forEach(header => {
          const originalHeader = groupingMode === 'by-oem' 
            ? selectedOEMs.find(oem => (oem.length > 12 ? oem.substring(0, 12) + '...' : oem) === header) || header
            : header
          row[header] = counts[originalHeader] || 0
        })
        return row
      })
      .filter(item => columnHeaders.some(header => item[header] > 0))
      .sort((a, b) => {
        const totalA = columnHeaders.reduce((sum, header) => sum + (a[header] || 0), 0)
        const totalB = columnHeaders.reduce((sum, header) => sum + (b[header] || 0), 0)
        return totalB - totalA
      })

    console.log('Final processing results:', { chartData, segments, debugInfo })

    return { 
      chartData, 
      availableSegments: segments, 
      hasData: chartData.length > 0,
      debugInfo,
      segmentFeatureMap,
      oemFeatureMap,
      detailedFeatureData
    }
  }, [waypointData, selectedCountry, selectedOEMs, groupingMode])
}
