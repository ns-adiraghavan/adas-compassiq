
import { useMemo } from "react"
import { useWaypointData } from "@/hooks/useWaypointData"
import { processVennDiagramData, VennDiagramData } from "@/utils/vennDiagramUtils"

export function useVennDiagramData(selectedCountry: string, selectedOEMs: string[]) {
  const { data: waypointData, isLoading } = useWaypointData()

  const vennData = useMemo((): VennDiagramData | null => {
    if (!waypointData?.csvData?.length || selectedOEMs.length === 0) {
      return null
    }

    const allData: any[] = []
    waypointData.csvData.forEach(file => {
      if (file.data && Array.isArray(file.data)) {
        allData.push(...file.data)
      }
    })

    return processVennDiagramData(allData, selectedOEMs, selectedCountry)
  }, [waypointData, selectedOEMs, selectedCountry])

  return {
    vennData,
    isLoading
  }
}
