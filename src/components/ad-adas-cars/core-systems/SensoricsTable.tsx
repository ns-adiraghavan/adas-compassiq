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
import bmwImage from "@/assets/vehicles/bmw.png"
import teslaImage from "@/assets/vehicles/tesla.png"
import fordImage from "@/assets/vehicles/ford.png"
import gmImage from "@/assets/vehicles/gm.png"
import rivianImage from "@/assets/vehicles/rivian.png"

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
  { id: "Front", label: "Front", zoom: "scale-125 -translate-y-12" },
  { id: "Side", label: "Side", zoom: "scale-115" },
  { id: "Rear", label: "Rear", zoom: "scale-125 translate-y-12" },
]

const vehicleImages: Record<string, string> = {
  "BMW": bmwImage,
  "Tesla": teslaImage,
  "Ford": fordImage,
  "General Motors": gmImage,
  "RIVIAN": rivianImage,
}

const SensoricsTable = ({ selectedRegion, selectedCategory }: SensoricsTableProps) => {
  const { data, isLoading } = useSensoricsData(selectedRegion, selectedCategory)
  const [selectedSensorType, setSelectedSensorType] = useState<string>("Camera")
  const [selectedPosition, setSelectedPosition] = useState<string>("Front")
  const [selectedOEM, setSelectedOEM] = useState<string>("Tesla")

  const filteredData = data?.filter(item => {
    const matchesSensorType = item.parameterCategory.includes(selectedSensorType)
    const matchesPosition = !selectedPosition || item.zone === selectedPosition
    const matchesOEM = !selectedOEM || item.oem === selectedOEM
    return matchesSensorType && matchesPosition && matchesOEM
  }) || []

  const uniqueOEMs = Array.from(new Set(data?.map(item => item.oem).filter(Boolean))) || []

  const currentZoom = sensorPositions.find(p => p.id === selectedPosition)?.zoom || ""
  const currentSensorColor = sensorTypes.find(s => s.id === selectedSensorType)?.color || "hsl(var(--primary))"

  const sensorCounts = sensorTypes.map(({ id }) => ({
    type: id,
    count: data?.filter(item => 
      item.parameterCategory.includes(id) && 
      item.oem === selectedOEM
    ).length || 0
  }))

  // Get sensor positions for the selected type and OEM
  const activeSensorPositions = data?.filter(item =>
    item.parameterCategory.includes(selectedSensorType) &&
    item.oem === selectedOEM &&
    (!selectedPosition || item.zone === selectedPosition)
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
                    Colored dots show active {selectedSensorType} sensors
                  </div>
                </div>
              </Card>

              {/* Car Visualization */}
              <div className="flex items-center justify-center min-h-[500px]">
                <div className="relative">
                  <div 
                    className={`transition-all duration-700 ease-out ${currentZoom}`}
                    style={{
                      filter: `drop-shadow(0 0 30px ${currentSensorColor}40)`
                    }}
                  >
                    <img
                      src={vehicleImages[selectedOEM] || teslaImage}
                      alt={`${selectedOEM} Vehicle`}
                      className="w-auto h-[400px] object-contain"
                    />
                  </div>
                  
                  {/* Dynamic Sensor Position Overlays - Aligned with image dots */}
                  {Object.entries(activeSensorPositions).map(([zone, count]) => {
                    if (count === 0) return null
                    
                    // Position overlays to match the dots on the car images
                    // These positions are calibrated to overlay the existing dots
                    const overlayPosition = zone === 'Front' 
                      ? 'top-[15%] left-1/2 -translate-x-1/2'
                      : zone === 'Rear'
                      ? 'bottom-[15%] left-1/2 -translate-x-1/2'
                      : zone === 'Side'
                      ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                      : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    
                    return (
                      <div
                        key={zone}
                        className={`absolute ${overlayPosition} transition-all duration-500`}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="relative flex items-center justify-center cursor-pointer"
                              style={{
                                width: '32px',
                                height: '32px',
                              }}
                            >
                              {/* Pulsing ring - larger and more visible */}
                              <div 
                                className="absolute inset-0 rounded-full animate-ping opacity-60"
                                style={{
                                  backgroundColor: currentSensorColor,
                                }}
                              />
                              {/* Outer glow ring */}
                              <div 
                                className="absolute inset-0 rounded-full opacity-40 blur-sm"
                                style={{
                                  backgroundColor: currentSensorColor,
                                }}
                              />
                              {/* Solid dot - overlays existing image dot */}
                              <div 
                                className="relative rounded-full border-3 border-background shadow-2xl"
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: currentSensorColor,
                                  boxShadow: `0 0 20px ${currentSensorColor}80`,
                                }}
                              />
                              {/* Count badge */}
                              <div 
                                className="absolute -top-1 -right-1 bg-background border-2 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-lg"
                                style={{ 
                                  color: currentSensorColor,
                                  borderColor: currentSensorColor,
                                }}
                              >
                                {count}
                              </div>
                            </div>
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
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-6 right-6">
                <Badge variant="secondary" className="shadow-lg">
                  {selectedSensorType} • {selectedPosition} Zone
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
