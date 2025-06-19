
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface PartnerEcosystemProps {
  selectedOEM: string
  selectedCountry: string
}

const PartnerEcosystem = ({ selectedOEM, selectedCountry }: PartnerEcosystemProps) => {
  return (
    <Card className="h-full bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Partner Ecosystem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-20">
          <div className="text-gray-400 text-center">
            <div className="text-lg font-medium mb-2">Coming Soon</div>
            <div className="text-sm">Partner ecosystem analysis for {selectedOEM}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PartnerEcosystem
