
import { VennDiagramData } from "@/utils/vennDiagramUtils"

export const calculateUniqueCount = (data: VennDiagramData, entityName: string): number => {
  return data.uniqueFeatures[entityName]?.length || 0
}

export const calculateTwoWayIntersection = (data: VennDiagramData, entity1: string, entity2: string): number => {
  const key = `${entity1}-${entity2}`
  const reverseKey = `${entity2}-${entity1}`
  return data.featureIntersections[key]?.length || data.featureIntersections[reverseKey]?.length || 0
}

export const calculateThreeWayIntersection = (data: VennDiagramData): number => {
  return data.featureIntersections['all']?.length || 0
}
