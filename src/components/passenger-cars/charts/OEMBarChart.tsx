
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"

interface OEMBarChartProps {
  selectedCountry: string
  onOEMClick: (oem: string) => void
}

const OEMBarChart = ({ selectedCountry, onOEMClick }: OEMBarChartProps) => {
  const { data: waypointData, isLoading } = useWaypointData()

  const chartData = useMemo(() => {
    if (!waypointData?.csvData?.length || !selectedCountry) return []

    console.log('Processing data for country:', selectedCountry)
    
    const oemAvailableFeatureCounts = new Map<string, number>()
    let totalRowsProcessed = 0
    let matchingCountryRows = 0
    let availableFeatureRows = 0

    waypointData.csvData.forEach(file => {
      console.log('Processing file:', file.file_name)
      
      if (file.data && Array.isArray(file.data)) {
        file.data.forEach((row: any) => {
          totalRowsProcessed++
          
          // Log first few rows to understand structure
          if (totalRowsProcessed <= 3) {
            console.log('Sample row structure:', row)
            console.log('Available keys in row:', Object.keys(row))
          }

          // Step 1: Extract and validate country field
          const country = row.Country || row.country || row['Country '] || row[' Country']
          
          // Step 2: Filter by selected country first
          if (country && typeof country === 'string' && country.toString().trim() === selectedCountry) {
            matchingCountryRows++
            console.log('Found matching country row:', country.toString().trim())
            
            // Step 3: Extract feature availability field
            const featureAvailability = row['Feature Availability'] || 
                                      row['Available Feature'] || 
                                      row['Available_Feature'] || 
                                      row.available_feature || 
                                      row.AvailableFeature ||
                                      row['feature_availability'] ||
                                      row['FEATURE AVAILABILITY']

            // Step 4: Filter by availability = "Available"
            if (featureAvailability && 
                typeof featureAvailability === 'string' && 
                featureAvailability.toString().trim().toLowerCase() === 'available') {
              availableFeatureRows++
              console.log('Found available feature row with availability:', featureAvailability.toString().trim())
              
              // Step 5: Extract and validate OEM field
              const oem = row.OEM || row.oem || row['OEM '] || row[' OEM'] || row['oem '] || row[' oem']
              
              if (oem && 
                  typeof oem === 'string' && 
                  oem.trim() !== '' &&
                  !oem.toLowerCase().includes('merged') &&
                  !oem.toLowerCase().includes('monitoring') &&
                  !oem.toLowerCase().includes('total')) {
                
                const oemName = oem.toString().trim()
                oemAvailableFeatureCounts.set(oemName, (oemAvailableFeatureCounts.get(oemName) || 0) + 1)
                console.log('Added available feature for OEM:', oemName, 'Total count:', oemAvailableFeatureCounts.get(oemName))
              }
            }
          }
        })
      }
    })

    console.log('Processing summary:')
    console.log('- Total rows processed:', totalRowsProcessed)
    console.log('- Matching country rows:', matchingCountryRows)
    console.log('- Available feature rows:', availableFeatureRows)
    console.log('- Final OEM counts:', Array.from(oemAvailableFeatureCounts.entries()))

    return Array.from(oemAvailableFeatureCounts.entries())
      .map(([oem, count]) => ({ oem, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15) // Top 15 OEMs
  }, [waypointData, selectedCountry])

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-gray-400">Loading OEM data...</div>
      </div>
    )
  }

  if (!selectedCountry) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-gray-400">Please select a country to view OEM data</div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-gray-400">No available features found for {selectedCountry}</div>
      </div>
    )
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="oem" 
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value, name) => [value, 'Available Features']}
          />
          <Bar 
            dataKey="count" 
            fill="#3B82F6"
            cursor="pointer"
            onClick={(data) => data && onOEMClick(data.oem)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OEMBarChart
