import { useState } from "react"
import { useSensoricsData } from "@/hooks/useSensoricsData"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Radio, Radar, CircleDot } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import bmwImage from "@/assets/vehicles/bmw_raw.png"
import teslaImage from "@/assets/vehicles/tesla_raw.png"
import fordImage from "@/assets/vehicles/ford_raw.png"
import gmImage from "@/assets/vehicles/gm_raw.png"
import rivianImage from "@/assets/vehicles/rivian_raw.png"

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
  { id: "Front", label: "Front", zoom: "scale-110 -translate-y-8" },
  { id: "Side", label: "Side", zoom: "scale-110" },
  { id: "Rear", label: "Rear", zoom: "scale-110 translate-y-8" },
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sensor Type Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Sensor Types</h3>
            <div className="flex flex-wrap gap-2">
              {sensorTypes.map(({ id, label, icon: Icon, color }) => (
                <Button
                  key={id}
                  variant={selectedSensorType === id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSensorType(id)}
                  className="gap-2"
                  style={selectedSensorType === id ? { backgroundColor: color, borderColor: color } : {}}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Sensor Position</h3>
            <div className="flex flex-wrap gap-2">
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

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">OEM</h3>
            <div className="flex flex-wrap gap-2">
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
        </div>
      </Card>

      {/* Vehicle Visualization */}
      <Card className="p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="flex justify-center items-center min-h-[400px] overflow-hidden">
          <div className={`transition-all duration-500 ease-out ${currentZoom}`}>
            <div className="relative">
              <img
                src={vehicleImages[selectedOEM] || teslaImage}
                alt={`${selectedOEM} Vehicle`}
                className="w-auto h-[350px] object-contain drop-shadow-2xl"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedOEM} - {selectedSensorType}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedSensorType} Specifications - {selectedPosition} Zone
            </h3>
            <Badge variant="outline">{filteredData.length} sensors</Badge>
          </div>
          
          <div className="rounded-md border overflow-hidden">
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
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No sensor data available for this configuration
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.parameter}</TableCell>
                      <TableCell>{item.subParameter}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.position || item.zone}</Badge>
                      </TableCell>
                      <TableCell>{item.value || "-"}</TableCell>
                      <TableCell>{item.unit || "-"}</TableCell>
                      {selectedSensorType === "Camera" && (
                        <TableCell>{item.cameraCategory || "-"}</TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SensoricsTable
