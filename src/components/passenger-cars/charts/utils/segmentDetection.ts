
export const extractVehicleSegments = (waypointData: any, selectedCountry: string, selectedOEMs: string[]): string[] => {
  if (!waypointData?.csvData?.length || !selectedCountry || selectedOEMs.length === 0) {
    return []
  }

  const segments = new Set<string>()
  
  waypointData.csvData.forEach((file: any) => {
    if (file.data && Array.isArray(file.data) && file.data.length > 0) {
      const firstRow = file.data[0]
      const allColumns = Object.keys(firstRow)
      
      // Look for segment-related columns
      const segmentPatterns = [
        /segment/i, /entry/i, /mid/i, /premium/i, /luxury/i, /basic/i, /standard/i, /high/i, /executive/i
      ]
      
      const segmentColumns = allColumns.filter(column => 
        segmentPatterns.some(pattern => pattern.test(column))
      )
      
      if (segmentColumns.length > 0) {
        file.data.forEach((row: any) => {
          const rowCountry = row.Country?.toString().trim()
          const rowOEM = row.OEM?.toString().trim()
          
          if (rowCountry === selectedCountry && 
              rowOEM && selectedOEMs.includes(rowOEM) &&
              row['Feature Availability']?.toString().trim().toLowerCase() === 'available') {
            
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
                
                segments.add(segmentName)
              }
            })
          }
        })
      }
    }
  })
  
  return Array.from(segments).sort()
}
