
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

interface TaxonomyRow {
  [key: string]: string
}

interface TaxonomyData {
  columns: string[]
  rows: TaxonomyRow[]
}

const parseCSV = (csvText: string): TaxonomyData => {
  const lines = csvText.trim().split('\n')
  if (lines.length === 0) return { columns: [], rows: [] }
  
  const columns = lines[0].split(',').map(col => col.trim().replace(/"/g, ''))
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(val => val.trim().replace(/"/g, ''))
    const row: TaxonomyRow = {}
    columns.forEach((col, index) => {
      row[col] = values[index] || ''
    })
    return row
  })
  
  return { columns, rows }
}

const fetchTaxonomyFile = async (fileName: string): Promise<TaxonomyData> => {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(`uploads/${fileName}`)
  
  if (error) {
    throw new Error(`Failed to fetch ${fileName}: ${error.message}`)
  }
  
  const csvText = await data.text()
  return parseCSV(csvText)
}

export const useFeaturesTaganomy = () => {
  return useQuery({
    queryKey: ['taxonomy', 'features'],
    queryFn: () => fetchTaxonomyFile('Features_Taxanomy.csv'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useBusinessModelTaxonomy = () => {
  return useQuery({
    queryKey: ['taxonomy', 'business-model'],
    queryFn: () => fetchTaxonomyFile('Business_model_Taxanomy.csv'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
