import { useState } from "react"
import { useSensoricsData } from "@/hooks/useSensoricsData"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Radio, Radar, CircleDot } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import topViewClean from "@/assets/vehicles/top-view-clean.png"
import topViewCamera from "@/assets/vehicles/top-view-camera.png"
import sideViewCamera from "@/assets/vehicles/side-view-camera.png"
import topViewRadar from "@/assets/vehicles/top-view-radar.png"
import sideViewRadar from "@/assets/vehicles/side-view-radar.png"
import topViewUltrasonic from "@/assets/vehicles/top-view-ultrasonic.png"

// Per-OEM top view images (clean and camera)
import bmwTopClean from "@/assets/vehicles/bmw_top_view_clean.png"
import fordTopClean from "@/assets/vehicles/ford_top_view_clean.png"
import gmTopClean from "@/assets/vehicles/gm_top_view_clean.png"
import rivianTopClean from "@/assets/vehicles/rivian_top_view_clean.png"
import teslaTopClean from "@/assets/vehicles/tesla_top_view_clean.png"

import bmwTopCamera from "@/assets/vehicles/bmw_top_view_camera.png"
import fordTopCamera from "@/assets/vehicles/ford_top_view_camera.png"
import gmTopCamera from "@/assets/vehicles/gm_top_view_camera.png"
import rivianTopCamera from "@/assets/vehicles/rivian_top_view_camera.png"
import teslaTopCamera from "@/assets/vehicles/tesla_top_view_camera.png"

import bmwTopRadar from "@/assets/vehicles/bmw_top_view_radar.png"
import fordTopRadar from "@/assets/vehicles/ford_top_view_radar.png"
import gmTopRadar from "@/assets/vehicles/gm_top_view_radar.png"
import rivianTopRadar from "@/assets/vehicles/rivian_top_view_radar.png"
import teslaTopRadar from "@/assets/vehicles/tesla_top_view_radar.png"

import bmwTopUltrasonic from "@/assets/vehicles/bmw_top_view_ultrasonic.png"
import fordTopUltrasonic from "@/assets/vehicles/ford_top_view_ultrasonic.png"
import gmTopUltrasonic from "@/assets/vehicles/gm_top_view_ultrasonic.png"
import rivianTopUltrasonic from "@/assets/vehicles/rivian_top_view_ultrasonic.png"
import teslaTopUltrasonic from "@/assets/vehicles/tesla_top_view_ultrasonic.png"

interface SensoricsTableProps {
  selectedRegion: string
  selectedCategory: string
}

const sensorTypes = [
  { id: "Camera", label: "Camera", icon: Camera, color: "hsl(var(--chart-1))" },
  { id: "Radar", label: "Radar", icon: Radar, color: "hsl(var(--chart-2))" },
  { id: "LiDAR", label: "LiDAR", icon: CircleDot, color: "hsl(var(--chart-3))" },
  { id: "Ultrasonic", label: "Ultrasonic", icon: Radio, color: "hsl(var(--chart-4))" },
]

const sensorPositions = [
  { id: "Front", label: "Front" },
  { id: "Side", label: "Side" },
  { id: "Rear", label: "Rear" },
]

// Map OEM names to their position in the image (0-4: Tesla, Rivian, BMW, GM, Ford)
const oemToImageIndex: Record<string, number> = {
  "Tesla": 0,
  "RIVIAN": 1,
  "Rivian": 1, // Alias for RIVIAN
  "BMW": 2,
  "General Motors": 3,
  "GM": 3, // Alias for General Motors
  "Ford": 4,
}

// Map sensor types to their reference images
const getSensorReferenceImage = (sensorType: string, viewType: 'top' | 'side') => {
  if (sensorType === "Camera") {
    return viewType === 'top' ? topViewCamera : sideViewCamera
  } else if (sensorType === "Radar") {
    return viewType === 'top' ? topViewRadar : sideViewRadar
  } else if (sensorType === "Ultrasonic") {
    return topViewUltrasonic // Only top view for ultrasonic
  }
  return topViewClean
}

const SensoricsTable = ({ selectedRegion, selectedCategory }: SensoricsTableProps) => {
  const { data, isLoading } = useSensoricsData(selectedRegion, selectedCategory)
  const [selectedSensorType, setSelectedSensorType] = useState<string>("Camera")
  const [selectedPosition, setSelectedPosition] = useState<string>("Front")
  const [selectedOEM, setSelectedOEM] = useState<string>("Tesla")
  const [viewType, setViewType] = useState<'top' | 'side'>('top')

  const filteredData = data?.filter(item => {
    const matchesSensorType = item.parameterCategory.includes(selectedSensorType)
    const matchesPosition = !selectedPosition || item.zone === selectedPosition
    const matchesOEM = !selectedOEM || item.oem === selectedOEM
    return matchesSensorType && matchesPosition && matchesOEM
  }) || []

  // Ensure all OEMs from composite image are available, plus any from data
  const uniqueOEMs = Array.from(new Set([
    ...Object.keys(oemToImageIndex),
    ...(data?.map(item => item.oem).filter(Boolean) || [])
  ]))
  const currentSensorColor = sensorTypes.find(s => s.id === selectedSensorType)?.color || "hsl(var(--primary))"
  const oemIndex = oemToImageIndex[selectedOEM] ?? 0
  
  // Image selection using per-OEM assets (top view)
  const topCleanByOEM: Record<string, string> = {
    Tesla: teslaTopClean,
    RIVIAN: rivianTopClean,
    Rivian: rivianTopClean,
    BMW: bmwTopClean,
    'General Motors': gmTopClean,
    GM: gmTopClean,
    Ford: fordTopClean,
  }

  const topCameraByOEM: Record<string, string> = {
    Tesla: teslaTopCamera,
    RIVIAN: rivianTopCamera,
    Rivian: rivianTopCamera,
    BMW: bmwTopCamera,
    'General Motors': gmTopCamera,
    GM: gmTopCamera,
    Ford: fordTopCamera,
  }

  const topRadarByOEM: Record<string, string> = {
    Tesla: teslaTopRadar,
    RIVIAN: rivianTopRadar,
    Rivian: rivianTopRadar,
    BMW: bmwTopRadar,
    'General Motors': gmTopRadar,
    GM: gmTopRadar,
    Ford: fordTopRadar,
  }

  const topUltrasonicByOEM: Record<string, string> = {
    Tesla: teslaTopUltrasonic,
    RIVIAN: rivianTopUltrasonic,
    Rivian: rivianTopUltrasonic,
    BMW: bmwTopUltrasonic,
    'General Motors': gmTopUltrasonic,
    GM: gmTopUltrasonic,
    Ford: fordTopUltrasonic,
  }

  const imageSrc = (() => {
    if (viewType === 'top') {
      if (selectedSensorType === 'Camera') return topCameraByOEM[selectedOEM] || topViewCamera
      if (selectedSensorType === 'Radar') return topRadarByOEM[selectedOEM] || topViewRadar
      if (selectedSensorType === 'Ultrasonic') return topUltrasonicByOEM[selectedOEM] || topViewUltrasonic
      return topCleanByOEM[selectedOEM] || topViewClean
    }
    if (selectedSensorType === 'Camera') return sideViewCamera
    if (selectedSensorType === 'Radar') return sideViewRadar
    if (selectedSensorType === 'Ultrasonic') return topViewUltrasonic
    return topViewClean
  })()

  const sensorCounts = sensorTypes.map(({ id }) => ({
    type: id,
    count: data?.filter(item => 
      item.parameterCategory.includes(id) && 
      item.oem === selectedOEM
    ).length || 0
  }))

  // Count sensors by zone
  const sensorsByZone = data?.filter(item =>
    item.parameterCategory.includes(selectedSensorType) &&
    item.oem === selectedOEM
  ).reduce((acc, item) => {
    const zone = item.zone || 'Unknown'
    if (!acc[zone]) acc[zone] = 0
    acc[zone]++
    return acc
  }, {} as Record<string, number>) || {}

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Compact Horizontal Filter Bar */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* OEM Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">OEM:</span>
              <div className="flex gap-2">
                {uniqueOEMs.map((oem) => (
                  <Button
                    key={oem}
                    variant={selectedOEM === oem ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOEM(oem)}
                  >
                    {oem}
                  </Button>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Sensor Type - Icon-only with tooltips */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sensor:</span>
              <div className="flex gap-1">
                {sensorTypes.map(({ id, icon: Icon, color }) => (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedSensorType === id ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setSelectedSensorType(id)}
                        style={selectedSensorType === id ? { 
                          backgroundColor: color, 
                          borderColor: color,
                          color: 'white'
                        } : {}}
                        className="h-9 w-9"
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{id}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Position Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Zone:</span>
              <div className="flex gap-1">
                {sensorPositions.map(({ id, label }) => (
                  <Button
                    key={id}
                    variant={selectedPosition === id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPosition(id)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View Type Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">View:</span>
              <div className="flex gap-1">
                <Button
                  variant={viewType === 'top' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType('top')}
                >
                  Top
                </Button>
                <Button
                  variant={viewType === 'side' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType('side')}
                  disabled={selectedSensorType === "Ultrasonic"}
                >
                  Side
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Vehicle Visualization */}
          <Card className="relative overflow-hidden">
            <div className="p-6">
              {/* Sensor Legend */}
              <Card className="absolute top-6 left-6 z-10 bg-background/95 backdrop-blur-sm border shadow-lg">
                <div className="p-3 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Sensor Count by Type
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-2">
                      for {selectedOEM}
                    </div>
                  </div>
                  {sensorTypes.map(({ id, icon: Icon, color }) => {
                    const count = sensorCounts.find(s => s.type === id)?.count || 0
                    return (
                      <div key={id} className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: color }}
                          />
                          <Icon className="h-3 w-3" style={{ color }} />
                        </div>
                        <span className="flex-1">{id}</span>
                        <Badge variant="secondary" className="h-5 px-2 text-xs">
                          {count}
                        </Badge>
                      </div>
                    )
                  })}
                  <Separator className="my-2" />
                  <div className="text-[10px] text-muted-foreground">
                    Reference dots shown on {viewType === 'top' ? 'top' : 'side'} view image
                  </div>
                </div>
              </Card>

              {/* Car Visualization with precise cropping */}
              <div className="flex items-center justify-center min-h-[500px] overflow-hidden">
                <div className="relative w-full h-[500px]">
                  {/* Display the full composite image but crop to show only selected OEM */}
                  <div 
                    className="absolute inset-0 overflow-hidden transition-all duration-500"
                    style={{
                      filter: `drop-shadow(0 0 30px ${currentSensorColor})`,
                    }}
                  >
                    <img 
                      src={imageSrc}
                      alt={`${selectedOEM} ${selectedSensorType} sensors`}
                      className="h-full w-full object-contain transition-all duration-500"
                    />
                  </div>
                  
                  {/* Zone badges showing sensor counts */}
                  {Object.entries(sensorsByZone).map(([zone, count]) => {
                    if (count === 0) return null
                    
                    // Position badges based on zone
                    const badgePosition = zone === 'Front' 
                      ? 'top-8 left-1/2 -translate-x-1/2'
                      : zone === 'Rear'
                      ? 'bottom-8 left-1/2 -translate-x-1/2'
                      : zone === 'Side'
                      ? 'top-1/2 right-8 -translate-y-1/2'
                      : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    
                    return (
                      <Tooltip key={zone}>
                        <TooltipTrigger asChild>
                          <Badge
                            className={`absolute ${badgePosition} cursor-pointer shadow-lg transition-all hover:scale-110`}
                            style={{
                              backgroundColor: currentSensorColor,
                              color: 'white',
                              borderColor: currentSensorColor,
                            }}
                          >
                            <span className="font-semibold">{zone}:</span>
                            <span className="ml-1">{count}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <div className="font-semibold">{zone} Zone</div>
                            <div className="text-muted-foreground">
                              {count} {selectedSensorType} sensor{count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-6 right-6">
                <Badge variant="secondary" className="shadow-lg">
                  {selectedSensorType} • {selectedPosition} • {viewType === 'top' ? 'Top View' : 'Side View'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* RIGHT: Data Table */}
          <Card className="flex flex-col">
            <div className="p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Sensor Specifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedOEM} • {selectedSensorType} • {selectedPosition}
                  </p>
                </div>
                <Badge variant="outline" className="h-8 px-3">
                  {filteredData.length} sensors
                </Badge>
              </div>
            </div>
            
            <ScrollArea className="flex-1 h-[500px]">
              <div className="p-6 pt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Sub-Parameter</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Unit</TableHead>
                        {selectedSensorType === "Camera" && <TableHead>Category</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                            No sensor data available for this configuration
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((item, index) => (
                          <TableRow 
                            key={index}
                            className="transition-colors hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">{item.parameter}</TableCell>
                            <TableCell>{item.subParameter}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {item.position || item.zone}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{item.value || "-"}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{item.unit || "-"}</TableCell>
                            {selectedSensorType === "Camera" && (
                              <TableCell className="text-sm">{item.cameraCategory || "-"}</TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default SensoricsTable
