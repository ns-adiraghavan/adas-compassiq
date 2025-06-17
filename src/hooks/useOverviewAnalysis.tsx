
import { useQuery } from "@tanstack/react-query"
import { useWaypointData } from "./useWaypointData"

interface OverviewAnalysisProps {
  selectedOEM: string
  selectedCountry: string
}

export function useOverviewAnalysis({ selectedOEM, selectedCountry }: OverviewAnalysisProps) {
  const { data: waypointData } = useWaypointData()

  return useQuery({
    queryKey: ['overview-analysis', selectedOEM, selectedCountry, waypointData],
    queryFn: async () => {
      if (!waypointData?.csvData?.length || !selectedOEM) {
        return null
      }

      // Filter CSV data
      const filteredData: any[] = []
      waypointData.csvData.forEach(file => {
        if (file.data && Array.isArray(file.data)) {
          file.data.forEach((row: any) => {
            const matchesOEM = row.OEM === selectedOEM
            const matchesCountry = selectedCountry === "Global" || row.Country === selectedCountry
            
            if (matchesOEM && matchesCountry) {
              filteredData.push(row)
            }
          })
        }
      })

      // Prepare data for OpenAI analysis
      const analysisPrompt = `
        Analyze the following automotive data for ${selectedOEM} ${selectedCountry !== "Global" ? `in ${selectedCountry}` : "globally"}.
        
        CSV Data Summary: ${filteredData.length} records found
        Sample data: ${JSON.stringify(filteredData.slice(0, 3), null, 2)}
        
        Context Data: ${JSON.stringify(waypointData.contextData, null, 2)}
        
        Create a comprehensive overview analysis including:
        1. Company description and market positioning
        2. Connected services platform overview
        3. Lighthouse features (key differentiators)
        4. Vehicle type coverage (Entry, Mid, Premium, Luxury)
        5. Geographical presence
        6. Key connected services aligned to brand promise
        7. Financial insights if available
        
        Return a structured JSON response with the following format:
        {
          "companyOverview": "Description of the company and market position",
          "connectedPlatform": {
            "name": "Platform name",
            "description": "Platform description",
            "features": ["feature1", "feature2", ...]
          },
          "lighthouseFeatures": [
            {"name": "Feature name", "description": "Description", "category": "Category"}
          ],
          "vehicleTypes": {
            "entry": true/false,
            "mid": true/false,
            "premium": true/false,
            "luxury": true/false
          },
          "geographicalPresence": ["country1", "country2", ...],
          "keyServices": {
            "safety": ["service1", "service2"],
            "maintenance": ["service1", "service2"],
            "otaUpdates": ["service1", "service2"],
            "telematics": ["service1", "service2"],
            "remoteControl": ["service1", "service2"]
          },
          "financialInsights": {
            "revenue": "Revenue info if available",
            "marketShare": "Market share info if available"
          }
        }
      `

      try {
        const response = await fetch('/api/openai-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: analysisPrompt,
            selectedOEM,
            selectedCountry,
            filteredData: filteredData.slice(0, 10), // Limit data size
            contextData: waypointData.contextData
          })
        })

        if (!response.ok) {
          throw new Error('Failed to get OpenAI analysis')
        }

        const result = await response.json()
        return result.analysis || null
      } catch (error) {
        console.error('OpenAI analysis error:', error)
        
        // Fallback analysis based on actual data
        return generateFallbackAnalysis(filteredData, selectedOEM, selectedCountry)
      }
    },
    enabled: !!waypointData?.csvData?.length && !!selectedOEM,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

function generateFallbackAnalysis(filteredData: any[], selectedOEM: string, selectedCountry: string) {
  const features = new Set<string>()
  const countries = new Set<string>()
  const categories = new Set<string>()
  const segments = {
    entry: false,
    mid: false,
    premium: false,
    luxury: false
  }

  filteredData.forEach(row => {
    if (row.Feature) features.add(row.Feature)
    if (row.Country) countries.add(row.Country)
    if (row.Category) categories.add(row.Category)
    
    if (row["Entry Segment"] && row["Entry Segment"].toLowerCase() !== 'no') segments.entry = true
    if (row["Mid Segment"] && row["Mid Segment"].toLowerCase() !== 'no') segments.mid = true
    if (row["Premium Segment"] && row["Premium Segment"].toLowerCase() !== 'no') segments.premium = true
    if (row["Luxury Segment"] && row["Luxury Segment"].toLowerCase() !== 'no') segments.luxury = true
  })

  return {
    companyOverview: `${selectedOEM} is a leading automotive manufacturer with a strong focus on connected vehicle technologies. The company offers comprehensive digital services across multiple market segments and geographical regions.`,
    connectedPlatform: {
      name: `${selectedOEM} Connect`,
      description: `Advanced connected car platform offering integrated digital services and features`,
      features: Array.from(features).slice(0, 6)
    },
    lighthouseFeatures: Array.from(features).slice(0, 4).map(feature => ({
      name: feature,
      description: `Advanced ${feature} capability`,
      category: "Connected Services"
    })),
    vehicleTypes: segments,
    geographicalPresence: Array.from(countries),
    keyServices: {
      safety: Array.from(features).filter(f => f.toLowerCase().includes('safety')).slice(0, 3),
      maintenance: Array.from(features).filter(f => f.toLowerCase().includes('maintenance')).slice(0, 3),
      otaUpdates: Array.from(features).filter(f => f.toLowerCase().includes('update')).slice(0, 3),
      telematics: Array.from(features).filter(f => f.toLowerCase().includes('telematics')).slice(0, 3),
      remoteControl: Array.from(features).filter(f => f.toLowerCase().includes('remote')).slice(0, 3)
    },
    financialInsights: {
      revenue: "Financial data not available",
      marketShare: "Market share data not available"
    }
  }
}
