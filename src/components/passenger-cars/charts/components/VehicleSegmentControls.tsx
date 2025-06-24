
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useTheme } from "@/contexts/ThemeContext"
import type { ChartControlsProps } from "../types/VehicleSegmentTypes"

const VehicleSegmentControls = ({ 
  viewMode, 
  onViewModeChange, 
  groupingMode, 
  onGroupingModeChange 
}: ChartControlsProps) => {
  const { theme } = useTheme()

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme.textSecondary}`}>View:</span>
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(value) => value && onViewModeChange(value as typeof viewMode)}
          >
            <ToggleGroupItem value="grouped">Chart</ToggleGroupItem>
            <ToggleGroupItem value="table">Table</ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-sm ${theme.textSecondary}`}>Group by:</span>
          <ToggleGroup 
            type="single" 
            value={groupingMode} 
            onValueChange={(value) => value && onGroupingModeChange(value as typeof groupingMode)}
          >
            <ToggleGroupItem value="by-oem">OEM</ToggleGroupItem>
            <ToggleGroupItem value="by-segment">Segment</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}

export default VehicleSegmentControls
