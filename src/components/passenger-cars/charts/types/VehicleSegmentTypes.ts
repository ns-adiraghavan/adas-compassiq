
export interface VehicleSegmentChartProps {
  selectedCountry: string
  selectedOEMs: string[]
}

export type GroupingMode = 'by-oem' | 'by-segment'

export interface ProcessedData {
  chartData: any[]
  availableSegments: string[]
  hasData: boolean
  debugInfo: any
  segmentFeatureMap: Map<string, Map<string, number>>
  oemFeatureMap: Map<string, Map<string, number>>
  detailedFeatureData: Map<string, Array<{ oem: string; category: string; feature: string; segment: string; isLighthouse: boolean }>>
}
