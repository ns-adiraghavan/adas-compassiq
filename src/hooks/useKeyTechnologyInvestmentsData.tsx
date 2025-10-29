import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export interface InvestmentData {
  oem: string
  subAttribute: string
  value: string
  investmentTrends: string
  subsidies: string
  location: string
}

export const useKeyTechnologyInvestmentsData = (region: string, selectedOEM?: string, selectedInvestmentType?: string) => {
  return useQuery({
    queryKey: ['key-technology-investments', region, selectedOEM, selectedInvestmentType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adas_future_blueprint')
        .select('*')
        .eq('Parameter', 'Strategic Investments in AV/ADAS Technologies')

      if (error) throw error

      const investments: InvestmentData[] = []

      data?.forEach((row) => {
        const oem = row["OEM Name"] || ""
        const subAttribute = row["Sub-attribute"] || ""
        const value = row.Value || ""
        const investmentTrends = row["Investment Trends in AV/ADAS Projects"] || ""
        const subsidies = row["AV/ADAS Specific Subsidies"] || ""
        const location = row.Location || ""

        if (value || investmentTrends || subsidies) {
          investments.push({
            oem,
            subAttribute,
            value,
            investmentTrends,
            subsidies,
            location
          })
        }
      })

      // Filter by selected OEM if provided
      let filteredInvestments = selectedOEM && selectedOEM !== "All"
        ? investments.filter(inv => inv.oem.toLowerCase().includes(selectedOEM.toLowerCase()))
        : investments

      // Filter by investment type if provided
      if (selectedInvestmentType && selectedInvestmentType !== "All") {
        filteredInvestments = filteredInvestments.filter(inv => 
          inv.subAttribute === selectedInvestmentType
        )
      }

      return {
        investments: filteredInvestments,
        oems: [...new Set(investments.map(inv => inv.oem))].filter(Boolean),
        investmentTypes: [...new Set(investments.map(inv => inv.subAttribute))].filter(Boolean).sort()
      }
    },
  })
}
