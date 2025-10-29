import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { normalizeOEM } from './useGlobalFootprintData'

export interface SensoricsData {
  oem: string
  parameterCategory: string
  parameter: string
  subParameter: string
  zone: string
  position: string
  value: string
  unit: string
  cameraCategory: string
  sensorFusion: string
}

const fetchSensoricsData = async (
  region: string,
  category: string
): Promise<SensoricsData[]> => {
  let query = supabase
    .from('adas_sensing_architecture')
    .select('*')

  const { data, error } = await query

  if (error) {
    console.error('Error fetching sensorics data:', error)
    throw error
  }

  return (data || []).map((row: any) => ({
    oem: normalizeOEM(row['OEM Name'] || ''),
    parameterCategory: row['Parameter Category'] || '',
    parameter: row['Parameter'] || '',
    subParameter: row['SubParameter'] || '',
    zone: row['Zone'] || '',
    position: row['Position'] || '',
    value: row['Value'] || '',
    unit: row['Unit'] || '',
    cameraCategory: row['Camera Category'] || '',
    sensorFusion: row['Sensor Fusion'] || '',
  }))
}

export const useSensoricsData = (region: string, category: string) => {
  return useQuery({
    queryKey: ['sensorics-data', region, category],
    queryFn: () => fetchSensoricsData(region, category),
    staleTime: 5 * 60 * 1000,
  })
}
