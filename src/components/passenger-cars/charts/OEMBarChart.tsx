import { useMemo, useState, useRef, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useWaypointData } from "@/hooks/useWaypointData"
import { useTheme } from "@/contexts/ThemeContext"
import AnimatedTireIcon from "./AnimatedTireIcon"

interface OEMBarChartProps {
  selectedCountry: string
  onOEMClick: (oem: string) => void
}

const OEMBarChart = ({ selectedCountry, onOEMClick }: OEMBarChartProps) => {
  const { data: waypointData, isLoading } = useWaypointData()
  const { theme } = useTheme()
  const [hoveredBarIndex, setHoveredBarIndex] = useState(-1)
  const [chartWidth, setChartWidth] = useState(800)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth)
      }
    }

    updateChartWidth()
    window.addEventListener('resize', updateChartWidth)
    return () => window.removeEventListener('resize', updateChartWidth)
  }, [])

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

  const handleBarMouseEnter = (data: any, index: number) => {
    setHoveredBarIndex(index)
  }

  const handleBarMouseLeave = () => {
    setHoveredBarIndex(-1)
  }

  const handleBarClick = (data: any) => {
    if (data && data.oem) {
      onOEMClick(data.oem)
    }
  }

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className={`${theme.textSecondary}`}>Loading OEM data...</div>
      </div>
    )
  }

  if (!selectedCountry) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className={`${theme.textSecondary}`}>Please select a country to view OEM data</div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className={`${theme.textSecondary}`}>No available features found for {selectedCountry}</div>
      </div>
    )
  }

  const getPrimaryColor = () => {
    if (theme.primary.includes('blue')) return '#3B82F6'
    if (theme.primary.includes('emerald')) return '#10B981'
    if (theme.primary.includes('orange')) return '#F97316'
    if (theme.primary.includes('purple')) return '#8B5CF6'
    if (theme.primary.includes('slate')) return '#64748B'
    return '#3B82F6' // default
  }

  const getGridColor = () => {
    return theme.name === 'Arctic White' ? '#E2E8F0' : '#374151'
  }

  const getTextColor = () => {
    return theme.name === 'Arctic White' ? '#475569' : '#9CA3AF'
  }

  return (
    <div className="h-96 relative" ref={chartContainerRef}>
      <AnimatedTireIcon
        targetBarIndex={hoveredBarIndex}
        chartData={chartData}
        chartWidth={chartWidth}
        onAnimationComplete={() => console.log('Animation completed')}
      />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 60, right: 30, left: 20, bottom: 60 }}
          onMouseMove={(data) => {
            if (data && data.activeTooltipIndex !== undefined) {
              setHoveredBarIndex(data.activeTooltipIndex)
            }
          }}
          onMouseLeave={handleBarMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={getGridColor()} />
          <XAxis 
            dataKey="oem" 
            stroke={getTextColor()}
            angle={0}
            textAnchor="middle"
            height={60}
            fontSize={11}
            interval={0}
          />
          <YAxis stroke={getTextColor()} />
          <Tooltip
            formatter={(value, name) => [value, 'Available Features']}
            cursor={false}
          />
          <Bar 
            dataKey="count" 
            fill={getPrimaryColor()}
            cursor="pointer"
            onClick={handleBarClick}
            onMouseEnter={handleBarMouseEnter}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OEMBarChart
