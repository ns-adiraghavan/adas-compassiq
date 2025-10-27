import { useQuery } from '@tanstack/react-query'
import Papa from 'papaparse'

interface TaxonomyRow {
  'Module 1: OEM-level Benchmarking': string
  '': string
  '__1': string
  '__2': string
}

const fetchADASTaxonomy = async () => {
  const response = await fetch('/data/adas_taxonomy.csv')
  const text = await response.text()
  
  return new Promise<TaxonomyRow[]>((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as TaxonomyRow[])
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

export const useADASTaxonomy = () => {
  return useQuery({
    queryKey: ['adas-taxonomy'],
    queryFn: fetchADASTaxonomy,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
