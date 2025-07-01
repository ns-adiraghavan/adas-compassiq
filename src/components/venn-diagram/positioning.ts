
import { EntityFeatureData } from "@/utils/vennDiagramUtils"
import { CirclePosition, IntersectionPosition } from "./types"

const SVG_WIDTH = 600
const SVG_HEIGHT = 400
const RADIUS = 120

export const getCirclePositions = (entities: EntityFeatureData[]): CirclePosition[] => {
  if (entities.length === 1) {
    return [{ cx: SVG_WIDTH / 2, cy: SVG_HEIGHT / 2 }]
  } else if (entities.length === 2) {
    return [
      { cx: SVG_WIDTH / 2 - 60, cy: SVG_HEIGHT / 2 },
      { cx: SVG_WIDTH / 2 + 60, cy: SVG_HEIGHT / 2 }
    ]
  } else { // 3 entities
    return [
      { cx: SVG_WIDTH / 2, cy: SVG_HEIGHT / 2 - 50 },
      { cx: SVG_WIDTH / 2 - 70, cy: SVG_HEIGHT / 2 + 50 },
      { cx: SVG_WIDTH / 2 + 70, cy: SVG_HEIGHT / 2 + 50 }
    ]
  }
}

export const getIntersectionPositions = (entities: EntityFeatureData[], positions: CirclePosition[]): Record<string, IntersectionPosition> => {
  if (entities.length === 3) {
    const [pos1, pos2, pos3] = positions
    return {
      [`${entities[0].name}-${entities[1].name}`]: {
        x: (pos1.cx + pos2.cx) / 2 - 25,
        y: (pos1.cy + pos2.cy) / 2 - 15
      },
      [`${entities[0].name}-${entities[2].name}`]: {
        x: (pos1.cx + pos3.cx) / 2 + 25,
        y: (pos1.cy + pos3.cy) / 2 - 15
      },
      [`${entities[1].name}-${entities[2].name}`]: {
        x: (pos2.cx + pos3.cx) / 2,
        y: (pos2.cy + pos3.cy) / 2 + 35
      },
      'all': {
        x: SVG_WIDTH / 2,
        y: SVG_HEIGHT / 2 + 5
      }
    }
  } else if (entities.length === 2) {
    const [pos1, pos2] = positions
    return {
      [`${entities[0].name}-${entities[1].name}`]: {
        x: (pos1.cx + pos2.cx) / 2,
        y: (pos1.cy + pos2.cy) / 2 + 5
      }
    }
  }
  return {}
}

export const getUniquePositions = (entities: EntityFeatureData[], positions: CirclePosition[]): Record<string, IntersectionPosition> => {
  if (entities.length === 3) {
    const [pos1, pos2, pos3] = positions
    return {
      [entities[0].name]: { x: pos1.cx, y: pos1.cy - 60 },
      [entities[1].name]: { x: pos2.cx - 50, y: pos2.cy + 30 },
      [entities[2].name]: { x: pos3.cx + 50, y: pos3.cy + 30 }
    }
  } else if (entities.length === 2) {
    const [pos1, pos2] = positions
    return {
      [entities[0].name]: { x: pos1.cx - 40, y: pos1.cy },
      [entities[1].name]: { x: pos2.cx + 40, y: pos2.cy }
    }
  } else if (entities.length === 1) {
    return {
      [entities[0].name]: { x: positions[0].cx, y: positions[0].cy + 5 }
    }
  }
  return {}
}

export const SVG_DIMENSIONS = {
  width: SVG_WIDTH,
  height: SVG_HEIGHT,
  radius: RADIUS
}
