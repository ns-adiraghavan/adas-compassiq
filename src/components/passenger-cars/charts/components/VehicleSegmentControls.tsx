
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useTheme } from "@/contexts/ThemeContext"
import type { GroupingMode } from "../types/VehicleSegmentTypes"

interface VehicleSegmentControlsProps {
  groupingMode: GroupingMode
  onGroupingModeChange: (mode: GroupingMode) => void
}

const VehicleSegmentControls = ({ 
  groupingMode, 
  onGroupingModeChange 
}: VehicleSegmentControlsProps) => {
  const { theme } = useTheme()

  return (
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
  )
}

export default VehicleSegmentControls
