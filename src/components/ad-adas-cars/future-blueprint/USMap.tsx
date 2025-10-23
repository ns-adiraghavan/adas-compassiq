import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { FacilityLocation } from "@/hooks/useGlobalFootprintData"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface USMapProps {
  facilities: FacilityLocation[]
}

const USMap = ({ facilities }: USMapProps) => {
  const { theme } = useTheme()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [mapboxToken, setMapboxToken] = useState<string>("")
  const [tokenInput, setTokenInput] = useState<string>("")
  const [isTokenSet, setIsTokenSet] = useState(false)

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3.5,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    
    // Add dark mode support
    if (theme.name === 'dark') {
      map.current.on('load', () => {
        map.current?.setStyle('mapbox://styles/mapbox/dark-v11')
      })
    }

    setIsTokenSet(true)
  }

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      setMapboxToken(tokenInput.trim())
      initializeMap(tokenInput.trim())
    }
  }

  // Update markers when facilities change
  useEffect(() => {
    if (!map.current || !isTokenSet) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Group facilities by location for popup content
    const facilitiesByLocation: Record<string, FacilityLocation[]> = {}
    facilities.forEach(facility => {
      if (!facility.lat || !facility.lng) return
      const key = `${facility.lat},${facility.lng}`
      if (!facilitiesByLocation[key]) {
        facilitiesByLocation[key] = []
      }
      facilitiesByLocation[key].push(facility)
    })

    // Add new markers
    Object.entries(facilitiesByLocation).forEach(([key, locationFacilities]) => {
      const facility = locationFacilities[0]
      if (!facility.lat || !facility.lng) return

      const facilityTypes = locationFacilities.map(f => f.facilityType)
      const isRnD = facilityTypes.includes("R&D Center")
      const isTesting = facilityTypes.includes("Testing")
      
      // Determine marker color
      let color = 'hsl(262, 83%, 58%)' // primary
      if (isRnD && !isTesting) color = 'hsl(220, 70%, 50%)' // chart-1
      if (isTesting && !isRnD) color = 'hsl(160, 60%, 45%)' // chart-2

      // Create marker element
      const el = document.createElement('div')
      el.className = 'marker'
      el.style.backgroundColor = color
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'
      el.style.border = '2px solid white'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'

      // Create popup content
      const popupContent = `
        <div class="p-2">
          <h4 class="font-bold mb-1">${facility.location}</h4>
          ${locationFacilities.map(f => `
            <div class="text-sm mb-1">
              <strong>${f.oem}</strong> - ${f.facilityType}
              ${f.details ? `<br/><span class="text-xs">${f.details}</span>` : ''}
            </div>
          `).join('')}
        </div>
      `

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)

      const marker = new mapboxgl.Marker(el)
        .setLngLat([facility.lng, facility.lat])
        .setPopup(popup)
        .addTo(map.current!)

      markers.current.push(marker)
    })
  }, [facilities, isTokenSet])

  // Cleanup
  useEffect(() => {
    return () => {
      markers.current.forEach(marker => marker.remove())
      map.current?.remove()
    }
  }, [])

  if (!isTokenSet) {
    return (
      <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
        <h3 className={`text-lg font-bold mb-4 ${theme.textPrimary}`}>US Facilities Map</h3>
        <div className="space-y-4">
          <p className={`text-sm ${theme.textSecondary}`}>
            Enter your Mapbox public token to view the interactive map. You can get one at{' '}
            <a 
              href="https://mapbox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOi..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSetToken}>
              Load Map
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${theme.cardBackground} ${theme.cardBorder} border rounded-2xl p-6 ${theme.shadowColor} shadow-lg backdrop-blur-sm`}>
      <h3 className={`text-lg font-bold mb-4 ${theme.textPrimary}`}>US Facilities Map</h3>
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      
      {/* Legend */}
      <div className="flex gap-6 mt-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(220, 70%, 50%)', border: '2px solid white' }} />
          <span className={`text-sm ${theme.textSecondary}`}>R&D Center</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(160, 60%, 45%)', border: '2px solid white' }} />
          <span className={`text-sm ${theme.textSecondary}`}>Testing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(262, 83%, 58%)', border: '2px solid white' }} />
          <span className={`text-sm ${theme.textSecondary}`}>Both</span>
        </div>
      </div>
    </div>
  )
}

export default USMap
