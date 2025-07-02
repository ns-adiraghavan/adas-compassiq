import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { extractVehicleSegments } from "../utils/segmentDetection"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface TableData {
  categories: string[]
  mainColumns: string[]
  subColumns: string[]
  categoryData: Record<string, Record<string, Record<string, number>>>
  grandTotals: Record<string, Record<string, number>>
}

export const useVehicleSegmentTableData = (
  selectedCountry: string,
  selectedOEMs: string[],
  groupingMode: GroupingMode
): TableData => {
  const { data: waypointData } = useWaypointData()

  return useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
      return { categories: [], mainColumns: [], subColumns: [], categoryData: {}, grandTotals: {} }
    }

    const availableSegments = extractVehicleSegments(waypointData, selectedCountry, selectedOEMs)
    const availableOEMs = selectedOEMs
    const categoryData: Record<string, Record<string, Record<string, number>>> = {}
    
    // Process data to count features
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          const rowCategory = row.Category?.toString().trim()
          const featureAvailability = row['Feature Availability']?.toString().trim().toLowerCase()
          
          if (rowCountry === selectedCountry &&
              rowOEM && selectedOEMs.includes(rowOEM) &&
              rowCategory && rowCategory !== '' &&
              featureAvailability === 'available') {
            
            if (!categoryData[rowCategory]) {
              categoryData[rowCategory] = {}
            }
            
            // Detect segments for this row
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
                  // Segment -> OEM structure
                  if (!categoryData[rowCategory][segmentName]) {
                    categoryData[rowCategory][segmentName] = {}
                  }
                  categoryData[rowCategory][segmentName][rowOEM] = (categoryData[rowCategory][segmentName][rowOEM] || 0) + 1
                } else {
                  // OEM -> Segment structure
                  if (!categoryData[rowCategory][rowOEM]) {
                    categoryData[rowCategory][rowOEM] = {}
                  }
                  categoryData[rowCategory][rowOEM][segmentName] = (categoryData[rowCategory][rowOEM][segmentName] || 0) + 1
                }
              }
            })
          }
        })
      }
    })

    const categories = Object.keys(categoryData).sort()
    const mainColumns = groupingMode === 'by-segment' ? availableSegments : availableOEMs
    const subColumns = groupingMode === 'by-segment' ? availableOEMs : availableSegments

    // Calculate grand totals
    const grandTotals: Record<string, Record<string, number>> = {}
    mainColumns.forEach(mainCol => {
      grandTotals[mainCol] = {}
      subColumns.forEach(subCol => {
        let sum = 0
        for (const category of categories) {
          sum += (categoryData?.[category]?.[mainCol]?.[subCol] || 0)
        }
        grandTotals[mainCol][subCol] = sum
      })
    })

    return { categories, mainColumns, subColumns, categoryData, grandTotals }
  }, [waypointData, selectedCountry, selectedOEMs, groupingMode])
}